import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="max-w-[800px] mx-auto w-full text-center mt-12 space-y-8">
      <div className="space-y-4">
        <h1 className="font-headline-lg text-4xl text-primary font-black uppercase tracking-widest flex justify-center items-center gap-3">
          <span className="material-symbols-outlined text-[40px]" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
          HashVault
        </h1>
        <p className="font-body-lg text-on-surface-variant text-xl">
          Secure, deterministic cryptographic hashing and verification tool.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
        <Link href="/text" className="bg-surface-container hover:bg-surface-container-high transition-colors p-6 rounded-xl border border-outline-variant flex flex-col items-center gap-4 group">
          <span className="material-symbols-outlined text-[48px] text-primary group-hover:scale-110 transition-transform">text_fields</span>
          <h2 className="font-headline-sm text-on-surface">Text Hashing</h2>
          <p className="font-body-sm text-on-surface-variant">Generate cryptographic hashes from string payloads.</p>
        </Link>
        
        <Link href="/file" className="bg-surface-container hover:bg-surface-container-high transition-colors p-6 rounded-xl border border-outline-variant flex flex-col items-center gap-4 group">
          <span className="material-symbols-outlined text-[48px] text-primary group-hover:scale-110 transition-transform">upload_file</span>
          <h2 className="font-headline-sm text-on-surface">File Hashing</h2>
          <p className="font-body-sm text-on-surface-variant">Generate hashes from local files securely in the browser.</p>
        </Link>

        <Link href="/compare" className="bg-surface-container hover:bg-surface-container-high transition-colors p-6 rounded-xl border border-outline-variant flex flex-col items-center gap-4 group">
          <span className="material-symbols-outlined text-[48px] text-primary group-hover:scale-110 transition-transform">compare_arrows</span>
          <h2 className="font-headline-sm text-on-surface">Hash Comparison</h2>
          <p className="font-body-sm text-on-surface-variant">Verify data integrity by comparing cryptographic signatures.</p>
        </Link>

        <Link href="/history" className="bg-surface-container hover:bg-surface-container-high transition-colors p-6 rounded-xl border border-outline-variant flex flex-col items-center gap-4 group">
          <span className="material-symbols-outlined text-[48px] text-primary group-hover:scale-110 transition-transform">history</span>
          <h2 className="font-headline-sm text-on-surface">Operation History</h2>
          <p className="font-body-sm text-on-surface-variant">View the log of cryptographic operations performed.</p>
        </Link>
      </div>
    </div>
  );
}
