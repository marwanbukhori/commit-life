"use client";

import React, { useState, useEffect } from 'react';
import { X, TrendingUp, Calendar, Lock } from 'lucide-react';
import { getAnalyticsData } from '@/app/actions';
import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';

interface AnalyticsModalProps {
    isOpen: boolean;
    onClose: () => void;
    pillarId: string;
}

export function AnalyticsModal({ isOpen, onClose, pillarId }: AnalyticsModalProps) {
    const [stats, setStats] = useState<{ date: string | Date, count: number }[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            fetchData();
        }
    }, [isOpen]);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
            const data = await getAnalyticsData(pillarId, timeZone);
            setStats(data);
        } catch (err: any) {
            console.error(err);
            if (err.message.includes("Premium")) {
                setError("Premium Feature Locked. Upgrade to view insights.");
            } else {
                setError("Failed to load analytics.");
            }
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    // Process Data
    // 1. Heatmap (Last 30 days)
    const today = new Date();

    // Helper: Convert client local date to YYYY-MM-DD string (Local Time)
    // We cannot use toISOString() directly because it converts to UTC (shifting days)
    const toLocalYMD = (date: Date) => {
        const offset = date.getTimezoneOffset() * 60000;
        const localISODate = new Date(date.getTime() - offset);
        return localISODate.toISOString().split('T')[0];
    };

    const last30Days = Array.from({ length: 30 }, (_, i) => {
        const d = new Date();
        d.setDate(today.getDate() - (29 - i));
        return toLocalYMD(d);
    });

    // Map aggregated data for quick lookup
    const dailyCounts = stats.reduce((acc, stat) => {
        const dateStr = new Date(stat.date).toISOString().split('T')[0];
        acc[dateStr] = stat.count;
        return acc;
    }, {} as Record<string, number>);

    // 2. Progression (Cumulative XP)
    let cumulativeXP = 0;
    const progressionData = stats.map(stat => {
        cumulativeXP += (stat.count * 10); // 10 XP per commit
        return {
            date: new Date(stat.date).toLocaleDateString(),
            xp: cumulativeXP
        };
    });

    // Simplify graph (still useful if many days)
    const progressionChartData = progressionData;

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm p-4">
            <div className={`bg-gray-900 border-2 ${error ? 'border-red-800' : 'border-purple-800'} p-6 rounded-lg w-full max-w-4xl shadow-2xl relative max-h-[90vh] overflow-y-auto`}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-bold text-purple-400 mb-6 uppercase tracking-widest flex items-center gap-2">
                    <TrendingUp className="w-6 h-6" />
                    Garden Analytics
                </h2>

                {loading ? (
                    <div className="flex items-center justify-center h-64 text-purple-400 animate-pulse">
                        Analyzing growth patterns...
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                        <Lock className="w-12 h-12 text-red-500 mb-4" />
                        <p className="text-red-400 font-bold uppercase tracking-widest mb-4">{error}</p>
                        <a href="/upgrade" className="bg-yellow-600 text-black px-6 py-2 rounded font-bold uppercase hover:bg-yellow-500">
                            Unlock Full Potential
                        </a>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Heatmap Section */}
                        <div className="bg-gray-800 p-4 rounded border border-gray-700">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                30-Day Consistency
                            </h3>
                            <div className="flex flex-wrap gap-1 md:gap-2">
                                {last30Days.map(dateStr => {
                                    const count = dailyCounts[dateStr] || 0;
                                    const opacity = count === 0 ? 0.1 : Math.min(1, 0.2 + (count * 0.2));
                                    return (
                                        <div
                                            key={dateStr}
                                            className="w-4 h-4 md:w-6 md:h-6 rounded-sm bg-green-500 tooltip relative group"
                                            style={{ opacity }}
                                            title={`${dateStr}: ${count} commits`}
                                        >
                                            <div className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-black text-white text-[9px] px-1 py-0.5 rounded whitespace-nowrap z-10 pointer-events-none">
                                                {new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}: {count}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Chart Section */}
                        <div className="bg-gray-800 p-4 rounded border border-gray-700 h-80">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                                XP Progression
                            </h3>
                            {progressionData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={progressionChartData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                        <XAxis dataKey="date" stroke="#9ca3af" tick={{ fontSize: 10 }} />
                                        <YAxis stroke="#9ca3af" tick={{ fontSize: 10 }} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#111827', border: '1px solid #4b5563' }}
                                            itemStyle={{ color: '#a78bfa' }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="xp"
                                            stroke="#8b5cf6"
                                            strokeWidth={2}
                                            dot={{ fill: '#8b5cf6', r: 2 }}
                                            activeDot={{ r: 6 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-600 text-xs uppercase">
                                    No data recorded yet
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
