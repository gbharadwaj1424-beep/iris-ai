import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-void px-6 text-center">
      <div className="pointer-events-none fixed inset-0 bg-aurora" />
      <p className="label-eyebrow relative">Error 404</p>
      <h1 className="relative mt-4 font-display text-5xl font-medium text-gradient">
        Signal lost
      </h1>
      <p className="relative mt-4 max-w-sm text-ink/60">
        This orbital path doesn't resolve to any page in the current mission manifest.
      </p>
      <Link
        href="/"
        className="relative mt-8 inline-flex items-center gap-2 rounded-full bg-cyan px-6 py-3 text-sm font-medium text-void shadow-glow"
      >
        Return to base
      </Link>
    </div>
  );
}
