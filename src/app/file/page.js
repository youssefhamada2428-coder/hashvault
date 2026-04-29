"use client";

import { useState, useRef } from 'react';
import CryptoJS from 'crypto-js';
import { addHashEntry } from '@/lib/api';

// Renders the file hashing page
export default function FileHasher() {
  const [file, setFile] = useState(null);
  const [algorithm, setAlgorithm] = useState('sha256');
  const [outputHash, setOutputHash] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (selectedFile) => {
    if (!selectedFile) return;
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File exceeds 5MB limit. Please choose a smaller file.");
      setFile(null);
      return;
    }
    setError('');
    setFile(selectedFile);
    setOutputHash('');
  };

  // Handle file hashing logic and Supabase API calls
  const generateHash = async () => {
    if (!file) return;
    setIsGenerating(true);
    setError('');
    
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        // Read file content as string
        const content = e.target.result;
        let hash = '';
        
        // Hash content
        if (algorithm === 'sha256') hash = CryptoJS.SHA256(content).toString();
        else if (algorithm === 'sha512') hash = CryptoJS.SHA512(content).toString();
        else if (algorithm === 'sha1') hash = CryptoJS.SHA1(content).toString();
        else if (algorithm === 'md5') hash = CryptoJS.MD5(content).toString();
        
        setOutputHash(hash);
        
        // Save to Supabase
        await addHashEntry({
          hash_value: hash,
          algorithm: algorithm,
          source_type: 'file'
        });
      } catch (err) {
        console.error("Error hashing or saving:", err);
        setError("Failed to process file or save to database.");
      } finally {
        setIsGenerating(false);
      }
    };

    reader.onerror = () => {
      setError("Failed to read file.");
      setIsGenerating(false);
    };

    // Using readAsBinaryString or readAsText. Let's use readAsText for simplicity with Crypto-JS string inputs, or readAsDataURL if binary but we can just use readAsText or readAsArrayBuffer then WordArray.
    // For Crypto-JS standard way with files: WordArray.create or readAsDataURL
    // readAsText is simplest for standard string representation of file
    // But since the assignment says "keep files small", and it's a minimal implementation, let's just use readAsText or readAsBinaryString
    // Using readAsBinaryString for better binary file compatibility, though CryptoJS parses it via Latin1
    // A more robust way is readAsArrayBuffer then convert, but we can do WordArray.create. Let's use readAsArrayBuffer.
    
    reader.onloadend = async () => {
      if (reader.error) return;
      const arrayBuffer = reader.result;
      const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
      let hash = '';
      
      try {
        if (algorithm === 'sha256') hash = CryptoJS.SHA256(wordArray).toString();
        else if (algorithm === 'sha512') hash = CryptoJS.SHA512(wordArray).toString();
        else if (algorithm === 'sha1') hash = CryptoJS.SHA1(wordArray).toString();
        else if (algorithm === 'md5') hash = CryptoJS.MD5(wordArray).toString();
        
        setOutputHash(hash);
        
        await addHashEntry({
          hash_value: hash,
          algorithm: algorithm,
          source_type: 'file'
        });
      } catch (err) {
        console.error("Supabase Error:", err);
        if (err?.code === '42501') {
           setError("Database Error: RLS is blocking the save. Check policies.");
        } else {
           setError("Failed to hash or save to database.");
        }
      } finally {
        setIsGenerating(false);
      }
    };
    
    // We override onloadend, so we remove onload to avoid running twice
    reader.onload = null;
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="max-w-[1200px] mx-auto w-full">
      <div className="mb-lg flex justify-between items-end">
        <div>
          <h2 className="font-headline-md text-headline-md text-on-surface">File Hashing Engine</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Generate deterministic hashes from local files without uploading them to any server, preserving complete privacy.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-md mt-6">
        <div className="col-span-1 lg:col-span-8 space-y-md">
          <div className="bg-surface-container-low border border-outline-variant rounded-lg flex flex-col">
            <div className="border-b border-outline-variant p-sm flex items-center justify-between">
              <h3 className="font-label-caps text-label-caps text-on-surface-variant flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">upload_file</span>
                FILE PAYLOAD (Max 5MB)
              </h3>
              {file && <button onClick={() => { setFile(null); setOutputHash(''); }} className="text-xs text-primary hover:text-primary-fixed transition-colors">Clear</button>}
            </div>
            <div 
              className={`p-lg flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-b-lg transition-colors min-h-[200px] cursor-pointer
                ${file ? 'border-primary bg-primary/5' : 'border-outline-variant hover:border-primary-container bg-surface-dim'}`}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current.click()}
            >
              <input 
                type="file" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleFileChange}
              />
              
              {!file ? (
                <>
                  <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2">cloud_upload</span>
                  <p className="text-on-surface">Drag & drop a file here</p>
                  <p className="text-on-surface-variant text-sm mt-1">or click to browse</p>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-4xl text-primary mb-2">draft</span>
                  <p className="text-on-surface font-bold text-lg text-center break-all">{file.name}</p>
                  <p className="text-on-surface-variant text-sm mt-1">{(file.size / 1024).toFixed(2)} KB</p>
                </>
              )}
            </div>
          </div>
          {error && <p className="text-error text-sm font-bold bg-error/10 p-3 rounded">{error}</p>}
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
            onClick={(e) => { e.stopPropagation(); generateHash(); }}
            disabled={isGenerating || !file}
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
