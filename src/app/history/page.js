"use client";

import { useState, useEffect } from 'react';
import { getHashHistory, deleteHashEntry, updateHashEntry } from '@/lib/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// Renders the hash history page
export default function HashHistory() {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // Handle user authentication and redirect if not logged in
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
      } else {
        setIsAuthenticated(true);
        fetchHistory();
      }
    };
    checkAuth();
  }, [router]);

  // Fetch user history from Supabase
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

  const getChartData = () => {
    const counts = {};
    history.forEach(item => {
      counts[item.algorithm] = (counts[item.algorithm] || 0) + 1;
    });
    return Object.keys(counts).map(key => ({ name: key, count: counts[key] }));
  };

  const getVelocityData = () => {
    const dates = {};
    history.forEach(item => {
      const date = new Date(item.created_at).toLocaleDateString();
      dates[date] = (dates[date] || 0) + 1;
    });
    return Object.keys(dates)
      .sort((a, b) => new Date(a) - new Date(b))
      .map(date => ({ date, count: dates[date] }));
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

  const handleEdit = async (id, currentType) => {
    setEditingId(id);
    setEditValue(currentType);
  };

  const saveEdit = async (id) => {
    try {
      await updateHashEntry(id, { source_type: editValue });
      setEditingId(null);
      fetchHistory();
    } catch (error) {
      console.error("Error updating history:", error);
    }
  };

  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  if (!isAuthenticated) return null;

  return (
    <div className="max-w-container-max mx-auto w-full">
      <div className="flex items-end justify-between border-b border-outline-variant/30 pb-sm mb-6">
        <div className="flex flex-col gap-base">
          <h2 className="font-headline-md text-headline-md text-on-surface">Hash Generation Log</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">Comprehensive history of all cryptographic operations performed within the vault.</p>
        </div>
      </div>

      {!isLoading && history.length > 0 && (
        <div className="mb-8">
          <h3 className="font-label-caps text-on-surface mb-4">Analytics Dashboard</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-surface-container-low border border-outline-variant rounded-xl p-6 h-64">
              <h4 className="font-label-caps text-on-surface-variant mb-4 text-sm">Hash Usage by Algorithm</h4>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getChartData()}>
                  <XAxis dataKey="name" stroke="#8884d8" fontSize={12} />
                  <YAxis allowDecimals={false} stroke="#8884d8" fontSize={12} />
                  <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#1E293B', border: 'none' }} />
                  <Bar dataKey="count" fill="#4ADE80" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-surface-container-low border border-outline-variant rounded-xl p-6 h-64">
              <h4 className="font-label-caps text-on-surface-variant mb-4 text-sm">Hash Activity Over Time</h4>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getVelocityData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="date" stroke="#8884d8" fontSize={12} />
                  <YAxis allowDecimals={false} stroke="#8884d8" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: 'none' }} />
                  <Line type="monotone" dataKey="count" stroke="#60A5FA" strokeWidth={2} dot={{ fill: '#60A5FA', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      <div className="bg-surface-container-lowest border border-surface-container-high rounded-xl overflow-hidden flex flex-col flex-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container border-b border-surface-container-high font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
                <th className="px-sm py-3 font-semibold w-12 text-center">#</th>
                <th className="px-sm py-3 font-semibold">Date</th>
                <th className="px-sm py-3 font-semibold">Type</th>
                <th className="px-sm py-3 font-semibold">Algorithm</th>
                <th className="px-sm py-3 font-semibold w-[35%]">Hash</th>
                <th className="px-sm py-3 font-semibold text-right pr-md">Actions</th>
              </tr>
            </thead>
            <tbody className="font-body-sm text-body-sm divide-y divide-surface-container-high">
              {isLoading ? (
                <tr><td colSpan="6" className="text-center py-8">Loading data...</td></tr>
              ) : history.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-8 text-on-surface-variant">No data available yet. Start hashing to see analytics.</td></tr>
              ) : history.map((item, index) => (
                <tr key={item.id} className="group hover:bg-surface-variant transition-colors even:bg-surface-container-lowest odd:bg-background relative">
                  <td className="px-sm py-3 text-on-surface-variant text-center border-l-2 border-transparent group-hover:border-primary transition-colors">{index + 1}</td>
                  <td className="px-sm py-3 text-on-surface-variant font-code-sm text-code-sm">
                    {new Date(item.created_at).toLocaleString()}
                  </td>
                  <td className="px-sm py-3 text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-slate-500">description</span>
                    {editingId === item.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="bg-surface-dim border border-primary text-on-surface rounded px-2 py-1 text-sm max-w-[100px]"
                          autoFocus
                        />
                        <button onClick={() => saveEdit(item.id)} className="text-secondary hover:text-secondary-fixed transition-colors">
                          <span className="material-symbols-outlined text-[16px]">check</span>
                        </button>
                        <button onClick={() => setEditingId(null)} className="text-error hover:text-error/80 transition-colors">
                          <span className="material-symbols-outlined text-[16px]">close</span>
                        </button>
                      </div>
                    ) : (
                      item.source_type
                    )}
                  </td>
                  <td className="px-sm py-3">
                    <span className="inline-flex items-center bg-primary/10 border border-primary text-primary px-2 py-0.5 rounded font-label-caps text-[10px] tracking-wider uppercase">
                      {item.algorithm}
                    </span>
                  </td>
                  <td className="px-sm py-3">
                    <div className="bg-surface border border-outline-variant/30 rounded px-2 py-1 font-code-sm text-code-sm text-primary max-w-[150px] lg:max-w-[300px] truncate group-hover:max-w-none transition-all" title={item.hash_value}>
                      {item.hash_value}
                    </div>
                  </td>
                  <td className="px-sm py-3 text-right pr-md flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEdit(item.id, item.source_type)} className="text-on-surface-variant hover:text-primary transition-colors p-1" title="Edit/Rehash">
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
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
