import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl font-bold text-gradient mb-4">404</div>
        <h1 className="text-2xl font-light text-soft-white mb-2">Access Denied</h1>
        <p className="text-soft-white/50 mb-6 text-sm">This page does not exist in this network.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-electric-blue/20 border border-cyan-500/30 text-cyan hover:from-cyan-500/30 hover:to-electric-blue/30 transition-all text-sm"
        >
          Return to Base
        </Link>
      </div>
    </div>
  );
}
