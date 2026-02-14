import { Navbar } from "@/components/ui/Navbar";
import { LivelyBackground } from "@/components/ui/LivelyBackground";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Sprout, Award, Calendar, Zap, Crown, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { PetSprite } from "@/components/ui/PetSprite";

// Calculate total XP and level for display
function calculateTotalStats(pillars: any[]) {
    let totalCommits = 0;
    let totalXp = 0;
    let highestLevel = 0;
    let bestPet = null;

    for (const pillar of pillars) {
        totalCommits += pillar.totalCommits;
        if (pillar.pet) {
            totalXp += pillar.pet.xp + (pillar.pet.level * 100); // Rough estimate
            if (pillar.pet.level > highestLevel) {
                highestLevel = pillar.pet.level;
                bestPet = pillar.pet;
            }
        }
    }

    return { totalCommits, totalXp, highestLevel, bestPet };
}

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ProfilePage(props: Props) {
    const session = await getServerSession(authOptions);
    if (!session?.user) redirect("/");

    // @ts-ignore
    const user = await prisma.user.findUnique({
        where: { id: (session.user as any).id },
        include: {
            pillars: {
                include: { pet: true }
            }
        }
    });

    if (!user) redirect("/");

    const searchParams = await props.searchParams;
    const isUpgradeSuccess = searchParams?.upgrade === 'success';

    const stats = calculateTotalStats(user.pillars);

    return (
        <main className="min-h-screen font-sans relative">
            <LivelyBackground />
            <div className="fixed inset-0 z-0 bg-black/65 pointer-events-none" /> {/* Overlay match */}

            <Navbar />

            <div className="relative z-10 container mx-auto px-4 pt-24 pb-12 flex flex-col items-center">

                {/* Back Button */}
                <div className="w-full max-w-4xl mb-6 flex justify-start animate-in fade-in slide-in-from-left-4 duration-500">
                    <Link href="/" className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-200 transition-colors uppercase tracking-widest text-xs font-bold bg-black/40 px-3 py-2 rounded-full border border-amber-900/50 hover:bg-black/60">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Farm
                    </Link>
                </div>

                {/* Upgrade Success Message */}
                {isUpgradeSuccess && (
                    <div className="w-full max-w-4xl mb-6 bg-green-900/40 border border-green-500/50 p-4 rounded-lg flex items-center gap-4 animate-in slide-in-from-top-4 fade-in duration-700">
                        <div className="bg-green-500 p-2 rounded-full shadow-lg shadow-green-500/20">
                            <Crown className="w-6 h-6 text-black" fill="currentColor" />
                        </div>
                        <div>
                            <h3 className="text-green-400 font-bold uppercase tracking-widest text-sm">Upgrade Successful!</h3>
                            <p className="text-green-200/60 text-xs">Welcome to the elite ranks. Your premium benefits are now active.</p>
                        </div>
                    </div>
                )}

                {/* Profile Card */}
                <div className="w-full max-w-4xl bg-amber-950/80 border-4 border-amber-800 shadow-2xl backdrop-blur-md p-8 animate-in slide-in-from-bottom-4 duration-500">

                    {/* Header: Avatar & Info */}
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 border-b-4 border-amber-900/50 pb-8">
                        <div className="w-32 h-32 rounded-full border-4 border-amber-500 shadow-xl overflow-hidden shrink-0 relative">
                            {user.image ? (
                                <img
                                    src={user.image}
                                    alt={user.name || "User"}
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                />
                            ) : (
                                <div className="w-full h-full bg-amber-800 flex items-center justify-center">
                                    <Sprout className="w-16 h-16 text-amber-400" />
                                </div>
                            )}
                            {user.isPremium && (
                                <div className="absolute bottom-0 right-0 bg-yellow-400 p-1 rounded-full border-2 border-white shadow-lg" title="Premium">
                                    <Crown className="w-5 h-5 text-yellow-900" fill="currentColor" />
                                </div>
                            )}
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl font-bold text-amber-100 uppercase tracking-widest">{user.name}</h1>
                            <div className="flex items-center justify-center md:justify-start gap-2 text-amber-400/60 font-mono text-sm mt-1">
                                <span>{user.email}</span>
                                {user.role === 'ADMIN' && <span className="bg-red-900/50 text-red-400 px-2 py-0.5 rounded text-[10px] font-bold border border-red-800">ADMIN</span>}
                            </div>

                            <div className="flex items-center justify-center md:justify-start gap-4 mt-4 text-xs font-bold uppercase tracking-widest text-amber-500">
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Crown className="w-4 h-4" />
                                    <span>{user.isPremium ? "Premium Plan" : "Free Plan"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Best Pet Showcase */}
                        {stats.bestPet && (
                            <div className="flex flex-col items-center bg-black/20 p-4 rounded-lg border-2 border-amber-900/30">
                                <div className="text-[10px] uppercase tracking-widest text-amber-500 font-bold mb-2">Best Companion</div>
                                <div className="transform scale-125 mb-2">
                                    <PetSprite species={stats.bestPet.species} stage={stats.bestPet.stage} className="w-16 h-16" />
                                </div>
                                <div className="text-xs font-bold text-amber-200">{stats.bestPet.name}</div>
                                <div className="text-[10px] text-green-400">Lv {stats.bestPet.level}</div>
                            </div>
                        )}
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                        <div className="bg-amber-900/30 p-4 border-2 border-amber-800 rounded-lg text-center">
                            <div className="text-amber-500 mb-1"><Sprout className="w-6 h-6 mx-auto" /></div>
                            <div className="text-2xl font-bold text-amber-100">{user.pillars.length}</div>
                            <div className="text-[10px] uppercase tracking-widest text-amber-400/60">Active Gardens</div>
                        </div>
                        <div className="bg-amber-900/30 p-4 border-2 border-amber-800 rounded-lg text-center">
                            <div className="text-blue-400 mb-1"><Zap className="w-6 h-6 mx-auto" /></div>
                            <div className="text-2xl font-bold text-amber-100">{stats.totalCommits}</div>
                            <div className="text-[10px] uppercase tracking-widest text-amber-400/60">Total Commits</div>
                        </div>
                        <div className="bg-amber-900/30 p-4 border-2 border-amber-800 rounded-lg text-center">
                            <div className="text-yellow-400 mb-1"><Award className="w-6 h-6 mx-auto" /></div>
                            <div className="text-2xl font-bold text-amber-100">{stats.highestLevel}</div>
                            <div className="text-[10px] uppercase tracking-widest text-amber-400/60">Highest Level</div>
                        </div>
                        <div className="bg-amber-900/30 p-4 border-2 border-amber-800 rounded-lg text-center">
                            <div className="text-purple-400 mb-1"><Crown className="w-6 h-6 mx-auto" /></div>
                            <div className="text-2xl font-bold text-amber-100">{user.isPremium ? "PRO" : "FREE"}</div>
                            <div className="text-[10px] uppercase tracking-widest text-amber-400/60">Status</div>
                        </div>
                    </div>

                    {/* Companions Scroll */}
                    <div className="mt-8">
                        <h3 className="text-sm font-bold text-amber-400 uppercase tracking-widest border-b-2 border-amber-800/50 pb-2 mb-4">
                            Your Companions
                        </h3>
                        {user.pillars.length > 0 ? (
                            <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                                {user.pillars.map((pillar: any) => (
                                    pillar.pet && (
                                        <div key={pillar.id} className="shrink-0 w-32 bg-black/20 p-3 rounded border-2 border-amber-900/40 text-center group hover:bg-black/30 transition-colors">
                                            <div className="flex justify-center mb-2 grayscale group-hover:grayscale-0 transition-all duration-300">
                                                <PetSprite species={pillar.pet.species} stage={pillar.pet.stage} className="w-16 h-16" />
                                            </div>
                                            <div className="text-xs font-bold text-amber-200 truncate">{pillar.pet.name}</div>
                                            <div className="text-[10px] text-amber-500 uppercase">{pillar.pet.species} • Lv {pillar.pet.level}</div>
                                        </div>
                                    )
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-amber-500/50 text-sm italic">
                                No companions yet. Start a garden!
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </main>
    );
}
