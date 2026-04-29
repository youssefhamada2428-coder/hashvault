"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { signOutUser } from '@/lib/api';

// Renders the top navigation bar component
export default function TopNavBar() {
  const [user, setUser] = useState(null);

  // Handle auth state changes
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });
    return () => authListener.subscription.unsubscribe();
  }, []);

  // Handle user logout
  const handleLogout = async () => {
    await signOutUser();
    window.location.href = '/';
  };
  return (
    <header className="fixed top-0 left-0 w-full z-50 p-6 flex justify-between items-center bg-background/80 backdrop-blur-sm border-b border-surface-variant">
      <div className="text-primary font-headline-md text-headline-md uppercase tracking-widest font-black flex items-center gap-2">
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
        <Link href="/">HashVault</Link>
      </div>
      <nav className="flex gap-4 items-center">
        <Link href="/" className="text-on-surface hover:text-primary transition-colors text-body-sm">Home</Link>
        <Link href="/text" className="text-on-surface hover:text-primary transition-colors text-body-sm">Text</Link>
        <Link href="/file" className="text-on-surface hover:text-primary transition-colors text-body-sm">File</Link>
        <Link href="/compare" className="text-on-surface hover:text-primary transition-colors text-body-sm">Compare</Link>
        <Link href="/history" className="text-on-surface hover:text-primary transition-colors text-body-sm">History</Link>
        <div className="w-px h-4 bg-outline-variant mx-2"></div>
        {user ? (
          <button onClick={handleLogout} className="text-error hover:text-error/80 transition-colors text-body-sm font-bold">Logout</button>
        ) : (
          <>
            <Link href="/login" className="text-primary hover:text-primary-fixed transition-colors text-body-sm font-bold">Login</Link>
            <Link href="/signup" className="text-primary hover:text-primary-fixed transition-colors text-body-sm font-bold">Sign Up</Link>
          </>
        )}
      </nav>
    </header>
  );
}
