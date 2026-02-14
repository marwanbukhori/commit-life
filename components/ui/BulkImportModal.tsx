"use client";

import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Upload, FileDown, X } from 'lucide-react';
import { bulkImportHabits } from '@/app/actions';

interface BulkImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    pillarId: string;
    onSuccess: () => void;
}

export function BulkImportModal({ isOpen, onClose, pillarId, onSuccess }: BulkImportModalProps) {
    const [file, setFile] = useState<File | null>(null);
    const [log, setLog] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setLog([]);
        }
    };

    const handleDownloadTemplate = () => {
        const ws = XLSX.utils.json_to_sheet([
            { Name: "Read 10 pages", Frequency: "daily" },
            { Name: "Visit Grandma", Frequency: "weekly" },
            { Name: "Clean Desk", Frequency: "onetime" }
        ]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Template");
        XLSX.writeFile(wb, "HabitTemplate.xlsx");
    };

    const handleUpload = async () => {
        if (!file) return;
        setLoading(true);
        setLog(prev => [...prev, "Reading file..."]);

        try {
            const data = await file.arrayBuffer();
            const workbook = XLSX.read(data);
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(worksheet) as any[];

            setLog(prev => [...prev, `Found ${json.length} rows.`]);

            // Validate and transform
            const habits = json.map((row, i) => {
                const name = row.Name || row.name || row['Task Name'];
                let freq = row.Frequency || row.frequency || 'daily';

                if (!name) throw new Error(`Row ${i + 1}: Missing Name`);

                // Normalize frequency
                freq = freq.toLowerCase();
                if (!['daily', 'weekly', 'onetime'].includes(freq)) freq = 'daily';

                return { name, frequency: freq };
            });

            setLog(prev => [...prev, "Uploading to garden..."]);

            await bulkImportHabits(pillarId, habits);

            setLog(prev => [...prev, "Success! closing..."]);
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 1000);

        } catch (err: any) {
            console.error(err);
            setLog(prev => [...prev, `Error: ${err.message}`]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-gray-900 border-2 border-green-800 p-6 rounded-lg w-full max-w-md shadow-2xl relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-bold text-green-400 mb-2 uppercase tracking-widest flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Bulk Import Seeds
                </h2>
                <p className="text-gray-400 text-xs mb-6">
                    Upload an Excel file (.xlsx) with columns "Name" and "Frequency" (daily, weekly, onetime).
                </p>

                <div className="space-y-4">
                    <button
                        onClick={handleDownloadTemplate}
                        className="w-full py-2 bg-gray-800 border border-gray-700 hover:bg-gray-700 text-sm text-gray-300 flex items-center justify-center gap-2 rounded transition-colors"
                    >
                        <FileDown className="w-4 h-4" />
                        Download Template
                    </button>

                    <div className="relative border-2 border-dashed border-gray-700 bg-gray-800/50 rounded-lg p-8 text-center hover:border-green-500/50 transition-colors group cursor-pointer">
                        <input
                            type="file"
                            accept=".xlsx, .xls"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="text-gray-500 group-hover:text-green-400 transition-colors">
                            {file ? (
                                <span className="font-bold text-white">{file.name}</span>
                            ) : (
                                "Drop Excel file here or click to browse"
                            )}
                        </div>
                    </div>

                    {file && (
                        <button
                            onClick={handleUpload}
                            disabled={loading}
                            className="w-full py-3 bg-green-700 hover:bg-green-600 disabled:opacity-50 text-white font-bold uppercase tracking-widest text-sm rounded shadow-lg transition-all active:translate-y-0.5"
                        >
                            {loading ? "Planting..." : "Plant Seeds"}
                        </button>
                    )}

                    {log.length > 0 && (
                        <div className="bg-black/50 p-2 rounded text-[10px] font-mono text-green-400/80 max-h-32 overflow-y-auto">
                            {log.map((line, i) => (
                                <div key={i}>{'>'} {line}</div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
