import Link from 'next/link';

export default function TopNavBar() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 p-6 flex justify-between items-center bg-background/80 backdrop-blur-sm border-b border-surface-variant">
      <div className="text-primary font-headline-md text-headline-md uppercase tracking-widest font-black flex items-center gap-2">
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
        <Link href="/">HashVault</Link>
      </div>
      <nav className="flex gap-4">
        <Link href="/" className="text-on-surface hover:text-primary transition-colors text-body-sm">Home</Link>
        <Link href="/text" className="text-on-surface hover:text-primary transition-colors text-body-sm">Text</Link>
        <Link href="/file" className="text-on-surface hover:text-primary transition-colors text-body-sm">File</Link>
        <Link href="/compare" className="text-on-surface hover:text-primary transition-colors text-body-sm">Compare</Link>
        <Link href="/history" className="text-on-surface hover:text-primary transition-colors text-body-sm">History</Link>
      </nav>
    </header>
  );
}
