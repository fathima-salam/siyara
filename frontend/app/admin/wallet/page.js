"use client";

import Link from "next/link";

export default function AdminWalletPage() {
  return (
    <main className="min-h-screen">
      <section className="pb-8">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-4">
            <nav className="text-[9px] uppercase tracking-wider text-gray-400 font-bold mb-0.5">Admin</nav>
            <h1 className="text-lg font-bold uppercase tracking-tight text-primary">Wallet / Refunds</h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">View wallets & issue refunds</p>
          </div>

          <div className="bg-white p-5 border border-gray-100 shadow-sm">
            <p className="text-[9px] uppercase tracking-wider font-bold text-gray-400 mb-2">Coming soon</p>
            <p className="text-[11px] text-primary font-bold uppercase tracking-tight mb-4">
              Wallet & refund management. Use Users to manage wallets via API.
            </p>
            <Link href="/admin/users" className="btn-primary inline-flex items-center gap-1.5 text-[10px] py-2 px-4">
              Go to Users
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
