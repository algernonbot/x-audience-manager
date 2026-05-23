import { getDemoState } from "@/server/store";

export default function ReportsPage() {
  const state = getDemoState();
  return (
    <main className="shell">
      <section className="panel report-panel">
        <p className="eyebrow">Reports</p>
        <h1>Cleanup summary</h1>
        <p className="lede">The MVP keeps an audit-friendly trail of scans, queued unfollows, and estimated cost events.</p>
        <div className="metrics-grid">
          <article><span>Queued</span><strong>{state.cleanupActions.length}</strong><small>Cleanup actions</small></article>
          <article><span>Usage</span><strong>{state.usageEvents.length}</strong><small>Events recorded</small></article>
        </div>
      </section>
    </main>
  );
}
