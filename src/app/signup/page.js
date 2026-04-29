"use client";

import { useState } from 'react';
import { signUpUser, signInUser } from '@/lib/api';
import Link from 'next/link';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await signUpUser(email, password);
      await signInUser(email, password);
      window.location.href = '/';
    } catch (err) {
      setError(err.message);
      setSuccess('');
    }
  };

  return (
    <div className="max-w-[400px] mx-auto w-full mt-24 bg-surface-container p-8 rounded-xl border border-outline-variant">
      <h2 className="text-2xl font-bold mb-6 text-center text-primary">Create Account</h2>
      <form onSubmit={handleSignup} className="space-y-4">
        {error && <p className="text-error bg-error/10 p-2 rounded text-sm">{error}</p>}
        {success && <p className="text-secondary bg-secondary/10 p-2 rounded text-sm">{success}</p>}
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
          Sign Up
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-on-surface-variant">
        Already have an account? <Link href="/login" className="text-primary hover:underline">Login</Link>
      </p>
    </div>
  );
}
