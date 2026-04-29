"use client";

import { useState } from 'react';
import { signInUser } from '@/lib/api';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInUser(email, password);
      window.location.href = '/';
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-[400px] mx-auto w-full mt-24 bg-surface-container p-8 rounded-xl border border-outline-variant">
      <h2 className="text-2xl font-bold mb-6 text-center text-primary">Login to HashVault</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        {error && <p className="text-error bg-error/10 p-2 rounded text-sm">{error}</p>}
        <div>
          <label className="block text-sm mb-1 text-on-surface-variant">Email</label>
          <input 
            type="email" 
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full bg-surface-dim border border-outline-variant rounded p-2 text-on-surface" 
            required 
          />
        </div>
        <div>
          <label className="block text-sm mb-1 text-on-surface-variant">Password</label>
          <input 
            type="password" 
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full bg-surface-dim border border-outline-variant rounded p-2 text-on-surface" 
            required 
          />
        </div>
        <button type="submit" className="w-full bg-primary-container text-on-primary-container p-2 rounded font-bold hover:bg-primary-fixed transition-colors">
          Login
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-on-surface-variant">
        Don't have an account? <Link href="/signup" className="text-primary hover:underline">Sign up</Link>
      </p>
    </div>
  );
}
