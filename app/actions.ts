"use server";

import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";
import { isSameDay, isSameISOWeek, addMonths, addYears } from "date-fns";

// ─── Dashboard & Settings ─────────────────────────────────────────────

export async function getDashboardData() {
    const session = await getServerSession(authOptions);
    if (!session?.user) return { pillars: [], habits: [], settings: { gardenSectionTitle: "Your Gardens" } };

    // @ts-ignore
    const userId = session.user.id;

    // Fetch user settings
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { gardenSectionTitle: true }
    });

    // Fetch pillars
    const pillars = await prisma.pillar.findMany({
        where: { userId },
        include: { pet: true },
        orderBy: { createdAt: "asc" },
    });

    // Fetch ALL habits for this user to build the daily/weekly lists
    const habits = await prisma.habit.findMany({
        where: { pillar: { userId } },
        include: { pillar: true },
        orderBy: { createdAt: "asc" },
    });

    // Compute dynamic completion status
    const computedHabits = habits.map(habit => {
        let isCompleted = false;

        if (habit.lastCompletedAt) {
            const lastDate = new Date(habit.lastCompletedAt);
            const now = new Date();

            if (habit.frequency === 'daily') {
                isCompleted = isSameDay(lastDate, now);
            } else if (habit.frequency === 'weekly') {
                isCompleted = isSameISOWeek(lastDate, now); // Weekly reset
            } else if (habit.frequency === 'onetime') {
                isCompleted = true; // Never resets
            } else {
                // Default fallback (custom/flexible)
                isCompleted = isSameDay(lastDate, now);
            }
        }

        return {
            ...habit,
            completedToday: isCompleted, // Override DB value with computed value
        };
    });

    return {
        pillars,
        habits: computedHabits,
        settings: {
            gardenSectionTitle: user?.gardenSectionTitle || "Your Gardens"
        }
    };
}

export async function updateGardenTitle(newTitle: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error("Unauthorized");
    // @ts-ignore
    const userId = session.user.id;

    await prisma.user.update({
        where: { id: userId },
        data: { gardenSectionTitle: newTitle }
    });
    revalidatePath("/");
}

// ─── Pillars ─────────────────────────────────────────────────────────

export async function createPillar(name: string, description: string, color: string, companionSpecies: string = 'Chicken', companionName?: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error("Unauthorized");
    // @ts-ignore
    const userId = session.user.id;

    // Freemium Check
    // @ts-ignore
    const isPremium = session.user.isPremium;
    const pillarCount = await prisma.pillar.count({ where: { userId } });

    if (pillarCount >= 2 && !isPremium) {
        throw new Error("Free limit reached. Upgrade to unlock more realms.");
    }

    // Premium Check
    if ((companionSpecies === 'Dragon' || companionSpecies === 'CrystalTree') && !isPremium) {
        throw new Error("Premium companion requires subscription.");
    }

    let type = 'ANIMAL';
    let rarity = 'COMMON';
    let stage = 'egg';

    if (companionSpecies === 'Sunflower' || companionSpecies === 'CrystalTree') {
        type = 'PLANT';
        stage = 'seed';
    }

    if (companionSpecies === 'Dragon' || companionSpecies === 'CrystalTree') {
        rarity = 'LEGENDARY';
    }

    const finalPetName = companionName?.trim() || (companionSpecies === 'Chicken' ? "Chick" : companionSpecies);

    const newPillar = await prisma.pillar.create({
        data: {
            userId,
            name,
            description,
            color,
            pet: {
                create: {
                    name: finalPetName,
                    stage: stage,
                    color: color,
                    species: companionSpecies,
                    type: type,
                    rarity: rarity
                },
            },
        },
        include: { pet: true },
    });

    revalidatePath("/");
    return newPillar;
}

// ─── Habits & Logic ───────────────────────────────────────────────────

export async function getPillarDetails(pillarId: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error("Unauthorized");

    const pillar = await prisma.pillar.findUnique({
        where: { id: pillarId },
        include: { pet: true },
    });

    if (!pillar) throw new Error("Pillar not found");

    const habits = await prisma.habit.findMany({
        where: { pillarId },
        orderBy: { createdAt: "asc" },
    });

    // Compute dynamic completion status (Same logic as dashboard)
    const computedHabits = habits.map(habit => {
        let isCompleted = false;
        if (habit.lastCompletedAt) {
            const lastDate = new Date(habit.lastCompletedAt);
            const now = new Date(); // Server time (UTC usually)

            if (habit.frequency === 'daily') isCompleted = isSameDay(lastDate, now);
            else if (habit.frequency === 'weekly') isCompleted = isSameISOWeek(lastDate, now);
            else if (habit.frequency === 'onetime') isCompleted = true;
            else isCompleted = isSameDay(lastDate, now);
        }
        return { ...habit, completedToday: isCompleted };
    });

    return { pillar, habits: computedHabits };
}

export async function createHabit(pillarId: string, name: string, frequency: string) {
    const habit = await prisma.habit.create({
        data: { pillarId, name, frequency },
    });
    revalidatePath(`/pillars/${pillarId}`);
    return habit;
}

export async function commitHabit(habitId: string, remark?: string) {
    // Transactional Commit Logic
    return await prisma.$transaction(async (tx: any) => {
        const habit = await tx.habit.findUnique({
            where: { id: habitId },
            include: { pillar: { include: { pet: true } } }
        });

        if (!habit) throw new Error("Habit not found");

        // Logic Re-Check: If it's One Time and already done, deny.
        if (habit.frequency === 'onetime' && habit.lastCompletedAt) {
            return habit;
        }

        // 1. Mark habit as done
        const updatedHabit = await tx.habit.update({
            where: { id: habitId },
            data: {
                completedToday: true, // Legacy field, mostly ignored by read logic now
                streak: { increment: 1 },
                lastCompletedAt: new Date(),
                lastRemark: remark || null,
            },
        });

        // 1.5 Log completion for analytics (Safety check for runtime)
        if ((tx as any).habitLog) {
            await tx.habitLog.create({
                data: {
                    habitId: habitId,
                    remark: remark || null,
                    date: new Date()
                }
            });
        }

        const pet = habit.pillar.pet;
        if (pet) {
            // 2. XP Logic
            const XP_GAIN = 10;
            let newXp = pet.xp + XP_GAIN;
            let newLevel = pet.level;
            let newStage = pet.stage;
            let xpToNext = pet.xpToNextLevel;

            // Level Up Check
            while (newXp >= xpToNext) {
                newXp -= xpToNext;
                newLevel += 1;
                xpToNext = Math.floor(xpToNext * 1.2);
            }

            // Logic: Every 10 levels = Evolution
            // Stage 1: 1-9
            // Stage 2: 10-19
            // Stage 3: 20-29
            // Stage 4: 30+

            if (pet.type === 'ANIMAL') {
                if (newLevel < 10) newStage = "egg";
                else if (newLevel < 20) newStage = "baby";
                else if (newLevel < 30) newStage = "adult";
                else newStage = "ancient";
            } else {
                // PLANT
                if (newLevel < 10) newStage = "seed";
                else if (newLevel < 20) newStage = "sprout";
                else if (newLevel < 30) newStage = "bloom";
                else newStage = "ancient";
            }

            await tx.pet.update({
                where: { id: pet.id },
                data: {
                    xp: newXp,
                    level: newLevel,
                    stage: newStage,
                    xpToNextLevel: xpToNext,
                },
            });
        }

        // 3. Update Pillar Stats
        await tx.pillar.update({
            where: { id: habit.pillarId },
            data: { totalCommits: { increment: 1 } }
        });

        revalidatePath("/");
        revalidatePath(`/pillars/${habit.pillarId}`);
        return updatedHabit;
    });
}

// ─── Admin Actions ───────────────────────────────────────────────────

export async function deleteUser(userId: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error("Unauthorized");

    // Check if requester is admin
    const requester = await prisma.user.findUnique({
        where: { id: (session.user as any).id },
        select: { role: true }
    });

    if (requester?.role !== 'ADMIN') throw new Error("Forbidden: Admin Access Required");
    if (userId === (session.user as any).id) throw new Error("Cannot delete yourself");

    await prisma.user.delete({ where: { id: userId } });
    revalidatePath("/admin");
}

export async function toggleRole(userId: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error("Unauthorized");

    // Check if requester is admin
    const requester = await prisma.user.findUnique({
        where: { id: (session.user as any).id },
        select: { role: true }
    });

    if (requester?.role !== 'ADMIN') throw new Error("Forbidden");
    if (userId === (session.user as any).id) throw new Error("Cannot demote yourself");

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User not found");

    const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
    await prisma.user.update({
        where: { id: userId },
        data: { role: newRole }
    });
    revalidatePath("/admin");
}

export async function togglePremium(userId: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error("Unauthorized");

    const requester = await prisma.user.findUnique({
        where: { id: (session.user as any).id },
        select: { role: true }
    });

    if (requester?.role !== 'ADMIN') throw new Error("Forbidden");

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User not found");

    await prisma.user.update({
        where: { id: userId },
        data: { isPremium: !user.isPremium }
    });

    // If granting premium manually, maybe log a $0 payment or just update status?
    // For now, just toggling boolean is sufficient for access control.

    revalidatePath("/admin");
}

export async function completePurchase(orderId: string, amount: string, plan: string = 'monthly') {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error("Unauthorized");
    // @ts-ignore
    const userId = session.user.id;

    // 1. Create Payment Record
    await prisma.payment.create({
        data: {
            userId: userId,
            amount: parseFloat(amount),
            currency: "USD",
            status: "COMPLETED",
            reference: orderId,
            plan: plan
        }
    });

    // 2. Calculate Expiry
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const currentEnd = user?.subscriptionEnd && user.subscriptionEnd > new Date()
        ? new Date(user.subscriptionEnd)
        : new Date();

    let newEnd;
    if (plan === 'annually') {
        newEnd = addYears(currentEnd, 1);
    } else {
        newEnd = addMonths(currentEnd, 1);
    }

    // 3. Upgrade User
    await prisma.user.update({
        where: { id: userId },
        data: {
            isPremium: true,
            subscriptionEnd: newEnd
        }
    });

    revalidatePath("/profile");
    revalidatePath("/admin");
    return { success: true };
}

// ─── Analytics ────────────────────────────────────────────────────────
export async function getAdminData() {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error("Unauthorized");

    const requester = await prisma.user.findUnique({
        where: { id: (session.user as any).id },
        select: { role: true }
    });

    if (requester?.role !== 'ADMIN') throw new Error("Forbidden");

    // Fetch payments
    const payments = await prisma.payment.findMany({
        include: { user: { select: { name: true, email: true } } },
        orderBy: { createdAt: 'desc' },
        take: 50
    });

    // Fetch subscription stats
    const totalUsers = await prisma.user.count();
    const premiumUsers = await prisma.user.count({ where: { isPremium: true } });

    // Revenue calc (rough sum of all payments) - In production use aggregate
    const allPayments = await prisma.payment.aggregate({
        _sum: {
            amount: true
        }
    });

    const revenue = allPayments._sum.amount || 0;

    return { payments, stats: { totalUsers, premiumUsers, revenue } };
}

export async function bulkImportHabits(pillarId: string, habits: { name: string, frequency: string }[]) {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error("Unauthorized");

    // Check Premium
    // @ts-ignore
    if (!session.user.isPremium) {
        throw new Error("Bulk import is a Premium feature.");
    }

    // Verify Pillar Ownership
    // @ts-ignore
    const userId = session.user.id;
    const pillar = await prisma.pillar.findUnique({
        where: { id: pillarId, userId }
    });

    if (!pillar) throw new Error("Garden not found or access denied.");

    // Bulk Create
    // Convert frequency to lowercase valid enum if needed, but schema uses String default 'daily'
    // We trust client validation or sanitize here
    const validHabits = habits.map(h => ({
        pillarId,
        name: h.name.slice(0, 100), // Limit name length
        frequency: ['daily', 'weekly', 'onetime'].includes(h.frequency) ? h.frequency : 'daily'
    }));

    await prisma.habit.createMany({
        data: validHabits
    });

    revalidatePath(`/pillars/${pillarId}`);
    return { success: true, count: validHabits.length };
}

export async function getAnalyticsData(pillarId: string, timeZone: string = 'UTC') {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error("Unauthorized");

    // Check Premium
    if (!(session.user as any).isPremium) {
        throw new Error("Analytics is a Premium feature.");
    }

    // Verify Access
    const pillar = await prisma.pillar.findUnique({
        where: { id: pillarId, userId: (session.user as any).id }
    });
    if (!pillar) throw new Error("Garden not found.");

    // Optimized Aggregation Query
    // Groups commits by day considering the User's Timezone
    try {
        // Use a subquery (or CTE) to calculate the local date first.
        // This avoids issues where Postgres doesn't recognize that the SELECT expression matches the GROUP BY expression
        // when parameters are used multiple times (Prisma generates distinct parameters $1, $2, etc).
        const rawData: any[] = await prisma.$queryRaw`
            SELECT day as date, COUNT(*)::int as count
            FROM (
                SELECT DATE_TRUNC('day', hl."date" AT TIME ZONE 'UTC' AT TIME ZONE ${timeZone}::text) as day
                FROM "HabitLog" hl
                JOIN "Habit" h ON hl."habitId" = h."id"
                WHERE h."pillarId" = ${pillarId}
            ) as sub
            GROUP BY day
            ORDER BY day ASC
        `;

        return rawData.map(row => ({
            date: row.date,
            count: Number(row.count)
        }));
    } catch (e: any) {
        console.error("Analytics query failed details:", e);
        throw new Error(`Database error loading analytics: ${e.message}`);
    }
}
