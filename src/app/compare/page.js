"use client";

import { useState, useEffect } from 'react';
import { getComparisonLogs, addComparisonLog } from '@/lib/api';

// Renders the hash comparison page
export default function CompareTool() {
  const [hash1, setHash1] = useState('');
  const [hash2, setHash2] = useState('');
  const [result, setResult] = useState(null);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchLogs();
  }, []);

  // Fetch comparison history from Supabase
  const fetchLogs = async () => {
    try {
      const data = await getComparisonLogs();
      setLogs(data || []);
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  // Handle hash comparison logic and log to Supabase
  const handleCompare = async () => {
    if (!hash1 || !hash2) return;
    
    const isMatch = hash1 === hash2;
    setResult(isMatch);
    
    try {
      await addComparisonLog({
        hash_1: hash1,
        hash_2: hash2,
        match_status: isMatch
      });
      fetchLogs();
    } catch (error) {
      console.error("Error logging comparison:", error);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto w-full">
      <div className="mb-lg flex justify-between items-end">
        <div>
          <h2 className="font-headline-md text-headline-md text-on-surface">Hash Comparison Engine</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Verify integrity by comparing cryptographic signatures.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-surface-container-low border border-outline-variant rounded-lg p-6">
          <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-4">HASH A</h3>
          <input 
            type="text" 
            value={hash1}
            onChange={(e) => setHash1(e.target.value)}
            className="w-full bg-surface-dim border border-outline-variant rounded p-3 font-code-sm text-on-surface" 
            placeholder="Enter first hash..." 
          />
        </div>
        
        <div className="bg-surface-container-low border border-outline-variant rounded-lg p-6">
          <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-4">HASH B</h3>
          <input 
            type="text" 
            value={hash2}
            onChange={(e) => setHash2(e.target.value)}
            className="w-full bg-surface-dim border border-outline-variant rounded p-3 font-code-sm text-on-surface" 
            placeholder="Enter second hash..." 
          />
        </div>
      </div>
      
      <div className="flex justify-center mt-6">
        <button 
          onClick={handleCompare}
          disabled={!hash1 || !hash2}
          className="bg-primary-container text-on-primary-container disabled:opacity-50 hover:bg-primary-fixed transition-colors py-3 px-8 rounded-lg font-label-caps flex items-center gap-2">
          <span className="material-symbols-outlined">compare_arrows</span>
          EXECUTE COMPARISON
        </button>
      </div>
      
      {result !== null && (
        <div className={`mt-8 p-6 rounded-lg text-center border ${result ? 'bg-secondary/10 border-secondary text-secondary' : 'bg-error/10 border-error text-error'}`}>
          <h3 className="text-2xl font-bold flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">{result ? 'check_circle' : 'cancel'}</span>
            {result ? 'HASHES MATCH' : 'HASHES DO NOT MATCH'}
          </h3>
        </div>
      )}

      <div className="mt-12 bg-surface-container-lowest border border-surface-container-high rounded-xl overflow-hidden flex flex-col flex-1">
        <div className="p-4 border-b border-surface-container-high">
          <h3 className="font-label-caps text-on-surface">Recent Comparisons</h3>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container border-b border-surface-container-high font-label-caps text-on-surface-variant uppercase tracking-widest">
              <th className="px-sm py-3">Hash 1</th>
              <th className="px-sm py-3">Hash 2</th>
              <th className="px-sm py-3 text-center">Status</th>
              <th className="px-sm py-3">Timestamp</th>
            </tr>
          </thead>
          <tbody className="font-body-sm text-body-sm divide-y divide-surface-container-high">
            {logs.map(log => (
              <tr key={log.id} className="hover:bg-surface-variant transition-colors">
                <td className="px-sm py-3 font-code-sm text-primary truncate max-w-[200px]">{log.hash_1}</td>
                <td className="px-sm py-3 font-code-sm text-primary truncate max-w-[200px]">{log.hash_2}</td>
                <td className="px-sm py-3 text-center">
                  {log.match_status ? 
                    <span className="text-secondary bg-secondary/10 px-2 py-1 rounded">MATCH</span> : 
                    <span className="text-error bg-error/10 px-2 py-1 rounded">MISMATCH</span>
                  }
                </td>
                <td className="px-sm py-3 text-on-surface-variant font-code-sm text-code-sm">
                  {new Date(log.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr><td colSpan="4" className="text-center py-4">No comparison logs found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
