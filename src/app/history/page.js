"use client";

import { useState, useEffect } from 'react';
import { getHashHistory, deleteHashEntry } from '@/lib/api';

export default function HashHistory() {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      const data = await getHashHistory();
      setHistory(data || []);
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this record?")) return;
    try {
      await deleteHashEntry(id);
      fetchHistory();
    } catch (error) {
      console.error("Error deleting history:", error);
    }
  };

  return (
    <div className="max-w-container-max mx-auto w-full">
      <div className="flex items-end justify-between border-b border-outline-variant/30 pb-sm mb-6">
        <div className="flex flex-col gap-base">
          <h2 className="font-headline-md text-headline-md text-on-surface">Hash Generation Log</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">Comprehensive history of all cryptographic operations performed within the vault.</p>
        </div>
      </div>

      <div className="bg-surface-container-lowest border border-surface-container-high rounded-xl overflow-hidden flex flex-col flex-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container border-b border-surface-container-high font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
                <th className="px-sm py-3 font-semibold w-12 text-center">#</th>
                <th className="px-sm py-3 font-semibold">Algorithm</th>
                <th className="px-sm py-3 font-semibold w-[35%]">Hash Output</th>
                <th className="px-sm py-3 font-semibold">Source Identifier</th>
                <th className="px-sm py-3 font-semibold">Timestamp (UTC)</th>
                <th className="px-sm py-3 font-semibold text-right pr-md">Actions</th>
              </tr>
            </thead>
            <tbody className="font-body-sm text-body-sm divide-y divide-surface-container-high">
              {isLoading ? (
                <tr><td colSpan="6" className="text-center py-4">Loading data...</td></tr>
              ) : history.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-4">No records found.</td></tr>
              ) : history.map((item, index) => (
                <tr key={item.id} className="group hover:bg-surface-variant transition-colors even:bg-surface-container-lowest odd:bg-background relative">
                  <td className="px-sm py-3 text-on-surface-variant text-center border-l-2 border-transparent group-hover:border-primary transition-colors">{index + 1}</td>
                  <td className="px-sm py-3">
                    <span className="inline-flex items-center bg-primary/10 border border-primary text-primary px-2 py-0.5 rounded font-label-caps text-[10px] tracking-wider uppercase">
                      {item.algorithm}
                    </span>
                  </td>
                  <td className="px-sm py-3">
                    <div className="bg-surface border border-outline-variant/30 rounded px-2 py-1 font-code-sm text-code-sm text-primary truncate max-w-[300px]" title={item.hash_value}>
                      {item.hash_value}
                    </div>
                  </td>
                  <td className="px-sm py-3 text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-slate-500">description</span>
                    {item.source_type}
                  </td>
                  <td className="px-sm py-3 text-on-surface-variant font-code-sm text-code-sm">
                    {new Date(item.created_at).toLocaleString()}
                  </td>
                  <td className="px-sm py-3 text-right pr-md flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleDelete(item.id)} className="text-on-surface-variant hover:text-error transition-colors p-1" title="Delete Log">
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
