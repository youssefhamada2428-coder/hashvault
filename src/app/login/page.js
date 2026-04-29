"use client";

import { useState } from 'react';
import { signInUser } from '@/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Renders the login form page
export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Validate email format
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Handle user authentication login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    try {
      await signInUser(email, password);
      router.push('/');
      router.refresh(); // Ensure session state is updated
    } catch (err) {
      console.error("Login error:", err);
      // Map common Supabase errors to user-friendly messages
      if (err.message?.includes('Invalid login credentials')) {
        setError('Invalid email or password. Please try again.');
      } else {
        setError(err.message || 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
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
