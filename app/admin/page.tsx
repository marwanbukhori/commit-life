import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Shield, DollarSign, Users, Activity } from "lucide-react";
import Link from "next/link";
import { deleteUser, toggleRole, togglePremium } from "@/app/actions";

async function getAdminData() {
    const totalUsers = await prisma.user.count();
    const totalPayments = await prisma.payment.count();
    const revenue = await prisma.payment.aggregate({
        _sum: { amount: true }
    });

    const recentUsers = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 20,
        include: {
            _count: { select: { pillars: true } },
            payments: { take: 1, orderBy: { createdAt: 'desc' } }
        }
    });

    const recentPayments = await prisma.payment.findMany({
        take: 50,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true, email: true } } }
    });

    return { totalUsers, totalPayments, revenue: revenue._sum.amount || 0, recentUsers, recentPayments };
}

export default async function AdminPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user) redirect("/");

    // Check Role
    const user = await prisma.user.findUnique({
        where: { id: (session.user as any).id },
        select: { role: true }
    });

    if (!user || user.role !== 'ADMIN') {
        return (
            <div className="min-h-screen bg-black text-red-500 flex items-center justify-center font-mono uppercase tracking-widest animate-pulse">
                Access Denied: Level 99 Clearance Required
            </div>
        );
    }

    const { totalUsers, totalPayments, revenue, recentUsers, recentPayments } = await getAdminData();

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 font-mono">
            {/* Admin Nav */}
            <nav className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-2 text-xl font-bold text-white">
                    <Shield className="w-6 h-6 text-red-500" />
                    <span>OVERWATCH COMMAND</span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <Link
                        href="/"
                        className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded font-bold uppercase tracking-widest text-xs transition-colors shadow-lg border-b-4 border-green-800 active:border-b-0 active:translate-y-1"
                    >
                        Return to Farm
                    </Link>
                </div>
            </nav>

            <main className="p-8 max-w-7xl mx-auto">
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                    <StatCard
                        title="Total Users"
                        value={totalUsers}
                        icon={<Users className="w-5 h-5 text-blue-400" />}
                        subtitle="+12% this week"
                    />
                    <StatCard
                        title="Total Revenue"
                        value={`$${revenue.toFixed(2)}`}
                        icon={<DollarSign className="w-5 h-5 text-green-400" />}
                        subtitle="Gross Volume"
                    />
                    <StatCard
                        title="Active Sessions"
                        value="--"
                        icon={<Activity className="w-5 h-5 text-yellow-400" />}
                        subtitle="real-time"
                    />
                    <StatCard
                        title="Profit Margin"
                        value="N/A"
                        icon={<Shield className="w-5 h-5 text-purple-400" />}
                        subtitle="estimated"
                    />
                </div>

                {/* User List */}
                <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden shadow-lg">
                    <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center bg-gray-800/50">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Recent Users</h3>
                        <button className="text-xs bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-white font-bold transition-colors">
                            Export CSV
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-900/50 text-gray-400 uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-3">User</th>
                                    <th className="px-6 py-3">Role</th>
                                    <th className="px-6 py-3">Joined</th>
                                    <th className="px-6 py-3">Gardens</th>
                                    <th className="px-6 py-3">Latest Sub</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {recentUsers.map((u) => {
                                    const latestPayment = (u as any).payments?.[0];
                                    return (
                                        <tr key={u.id} className="hover:bg-gray-700/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-white flex items-center space-x-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-600 overflow-hidden">
                                                    {u.image ? <img src={u.image} alt="" className="w-full h-full" referrerPolicy="no-referrer" /> : null}
                                                </div>
                                                <div>
                                                    <div>{u.name || "Unknown"}</div>
                                                    <div className="text-xs text-gray-500">{u.email}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {(u as any).role === 'ADMIN' ? (
                                                    <span className="bg-red-900 text-red-200 text-xs px-2 py-1 rounded font-bold border border-red-800">ADMIN</span>
                                                ) : (
                                                    <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded">USER</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-gray-400">
                                                {new Date(u.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-gray-300">
                                                {(u as any)._count.pillars}
                                            </td>
                                            <td className="px-6 py-4 text-gray-300 text-xs">
                                                {latestPayment ? (
                                                    <div>
                                                        <div className="text-green-400 font-bold">${latestPayment.amount}</div>
                                                        <div className="text-gray-500">{new Date(latestPayment.createdAt).toLocaleDateString()}</div>
                                                    </div>
                                                ) : <span className="text-gray-600 italic">Never</span>}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col space-y-1 items-start">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${(u as any).isPremium ? 'bg-yellow-900 text-yellow-200' : 'bg-green-900 text-green-200'}`}>
                                                        {(u as any).isPremium ? 'PREMIUM' : 'FREE'}
                                                    </span>
                                                    {(u as any).role !== 'ADMIN' && (
                                                        <form action={togglePremium.bind(null, u.id)}>
                                                            <button className="text-[10px] text-gray-500 hover:text-white underline decoration-dotted">
                                                                {(u as any).isPremium ? 'Revoke' : 'Add to Premium'}
                                                            </button>
                                                        </form>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right flex justify-end items-center space-x-4">
                                                {(u as any).role !== 'ADMIN' || (session.user as any).id !== u.id ? (
                                                    <>
                                                        <form action={toggleRole.bind(null, u.id)}>
                                                            <button className="text-blue-400 hover:text-blue-300 text-xs uppercase font-bold">
                                                                {(u as any).role === 'ADMIN' ? 'Demote' : 'Promote'}
                                                            </button>
                                                        </form>
                                                        <form action={deleteUser.bind(null, u.id)}>
                                                            <button className="text-red-400 hover:text-red-300 text-xs uppercase font-bold">Delete</button>
                                                        </form>
                                                    </>
                                                ) : (
                                                    <span className="text-gray-500 text-xs italic">You</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
                {/* Transactions Table */}
                <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden shadow-lg mt-8">
                    <div className="px-6 py-4 border-b border-gray-700 bg-gray-800/50">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Recent Transactions</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-900/50 text-gray-400 uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3">User</th>
                                    <th className="px-6 py-3">Amount</th>
                                    <th className="px-6 py-3">Plan</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Reference</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {recentPayments.map((p: any) => (
                                    <tr key={p.id} className="hover:bg-gray-700/50 transition-colors">
                                        <td className="px-6 py-4 text-gray-400">
                                            {new Date(p.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-white font-bold">{p.user?.name || "Unknown"}</div>
                                            <div className="text-xs text-gray-500">{p.user?.email}</div>
                                        </td>
                                        <td className="px-6 py-4 text-green-400 font-bold font-mono">
                                            ${p.amount.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-gray-300 uppercase text-xs">
                                            {p.plan}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="bg-green-900 text-green-200 text-[10px] px-2 py-1 rounded font-bold">
                                                {p.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 font-mono text-xs">
                                            {p.reference || "-"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}

function StatCard({ title, value, icon, subtitle }: any) {
    return (
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-blue-500/50 transition-colors">
            <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-xs uppercase tracking-widest font-bold">{title}</span>
                {icon}
            </div>
            <div className="text-3xl font-bold text-white mb-1">{value}</div>
            <div className="text-xs text-green-500 font-mono">{subtitle}</div>
        </div>
    );
}
