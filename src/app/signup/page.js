"use client";

import { useState } from 'react';
import { signUpUser, signInUser } from '@/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Renders the signup form page
export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Validate email format
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Handle user account creation and authentication
  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Basic validation
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      await signUpUser(email, password);
      // Automatically sign in after signup
      await signInUser(email, password);
      setSuccess('Account created successfully! Redirecting...');
      router.push('/');
      router.refresh();
    } catch (err) {
      console.error("Signup error:", err);
      // Map common Supabase errors
      if (err.message?.includes('User already registered')) {
        setError('This email is already registered. Please try logging in.');
      } else {
        setError(err.message || 'An error occurred during signup.');
      }
    } finally {
      setIsLoading(false);
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
        <div>
          <label className="block text-sm mb-1 text-on-surface-variant">Confirm Password</label>
          <input 
            type="password" 
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className="w-full bg-surface-dim border border-outline-variant rounded p-2 text-on-surface" 
            required 
          />
        </div>
        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-primary-container text-on-primary-container p-2 rounded font-bold hover:bg-primary-fixed transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-on-surface-variant">
        Already have an account? <Link href="/login" className="text-primary hover:underline">Login</Link>
      </p>
    </div>
  );
}
