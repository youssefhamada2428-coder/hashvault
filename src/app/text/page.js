"use client";

import { useState } from 'react';
import CryptoJS from 'crypto-js';
import { addHashEntry } from '@/lib/api';

// Renders the text hashing page
export default function HashGeneratorHome() {
  const [inputText, setInputText] = useState('');
  const [algorithm, setAlgorithm] = useState('sha256');
  const [outputHash, setOutputHash] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Handle text hashing logic and Supabase API calls
  const generateHash = async () => {
    if (!inputText) return;
    setIsGenerating(true);
    
    let hash = '';
    const start = performance.now();
    
    try {
      if (algorithm === 'sha256') hash = CryptoJS.SHA256(inputText).toString();
      else if (algorithm === 'sha512') hash = CryptoJS.SHA512(inputText).toString();
      else if (algorithm === 'sha1') hash = CryptoJS.SHA1(inputText).toString();
      else if (algorithm === 'md5') hash = CryptoJS.MD5(inputText).toString();
      
      const end = performance.now();
      
      setOutputHash(hash);
      
      // Save to Supabase
      await addHashEntry({
        hash_value: hash,
        algorithm: algorithm,
        source_type: 'text'
      });
      
    } catch (e) {
      console.error("Supabase Error Details:", e);
      if (e?.code === '42501' || e?.message?.includes('row-level security')) {
        alert("Database Error: Row-Level Security (RLS) is blocking the save. Please see the AI assistant's message for the SQL script to fix this.");
      } else {
        alert("Failed to save to database. Check console for details.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto w-full">
      <div className="mb-lg flex justify-between items-end">
        <div>
          <h2 className="font-headline-md text-headline-md text-on-surface">Cryptographic Hash Generator</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Generate deterministic hashes from strings. Safe and secure client-side computation ensuring your raw text never leaves the browser.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-md mt-6">
        <div className="col-span-1 lg:col-span-8 space-y-md">
          <div className="bg-surface-container-low border border-outline-variant rounded-lg flex flex-col">
            <div className="border-b border-outline-variant p-sm flex items-center justify-between">
              <h3 className="font-label-caps text-label-caps text-on-surface-variant flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">code</span>
                RAW TEXT PAYLOAD
              </h3>
              <button onClick={() => setInputText('')} className="text-xs text-primary hover:text-primary-fixed transition-colors">Clear</button>
            </div>
            <div className="p-sm flex-1">
              <textarea 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full h-32 bg-surface-dim border border-outline-variant rounded p-3 font-code-sm text-code-sm text-on-surface placeholder-outline focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all resize-none shadow-inner" 
                placeholder="Enter text string to hash...">
              </textarea>
            </div>
          </div>
        </div>
        
        <div className="col-span-1 lg:col-span-4 space-y-md">
          <div className="bg-surface-container border border-outline-variant rounded-lg p-sm">
            <h3 className="font-label-caps text-label-caps text-on-surface-variant flex items-center gap-2 mb-sm">
              <span className="material-symbols-outlined text-[16px]">tune</span>
              ALGORITHM CONFIGURATION
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block font-label-caps text-[10px] text-outline mb-1">ALGORITHM</label>
                <div className="relative">
                  <select 
                    value={algorithm}
                    onChange={(e) => setAlgorithm(e.target.value)}
                    className="w-full bg-surface-dim border border-outline-variant rounded py-2 pl-3 pr-10 font-body-sm text-on-surface appearance-none focus:border-primary-container focus:ring-1 focus:ring-primary-container">
                    <option value="sha256">SHA-256 (Recommended)</option>
                    <option value="sha512">SHA-512</option>
                    <option value="sha1">SHA-1 (Legacy)</option>
                    <option value="md5">MD5 (Insecure)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <button 
            onClick={generateHash}
            disabled={isGenerating || !inputText}
            className="w-full bg-primary-container text-on-primary-container hover:bg-primary-fixed disabled:opacity-50 transition-colors py-3 rounded-lg font-label-caps text-label-caps flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[18px]">memory</span>
            {isGenerating ? 'GENERATING...' : 'GENERATE HASH'}
          </button>
        </div>
      </div>

      {outputHash && (
        <div className="col-span-1 lg:col-span-12 mt-8">
          <div className="bg-surface-container-low border border-outline-variant rounded-lg">
            <div className="border-b border-outline-variant p-sm flex items-center justify-between bg-surface-container-highest/30 rounded-t-lg">
              <h3 className="font-label-caps text-label-caps text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-secondary">check_circle</span>
                CRYPTOGRAPHIC OUTPUT
              </h3>
            </div>
            <div className="p-lg flex items-center justify-between bg-[#0B0F19] rounded-b-lg relative overflow-hidden group">
              <code className="font-code-sm text-code-sm text-secondary-fixed break-all max-w-[85%] select-all">
                {outputHash}
              </code>
              <button 
                onClick={() => navigator.clipboard.writeText(outputHash)}
                className="p-2 text-outline hover:text-primary-container hover:bg-surface-variant rounded transition-colors" title="Copy to clipboard">
                <span className="material-symbols-outlined">content_copy</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
