import Link from "next/link";
import { getDemoState } from "@/server/store";

export default function DashboardPage() {
  const state = getDemoState();
  return (
    <main className="shell">
      <section className="panel">
        <p className="eyebrow">Dashboard</p>
        <h1>X Audience Manager</h1>
        <p className="lede">Preview scans are capped by entitlement before any X provider call is made.</p>
        <div className="metrics-grid">
          <article><span>Cleanup actions</span><strong>{state.cleanupActions.length}</strong><small>Queued rate-limit-aware work</small></article>
          <article><span>Usage events</span><strong>{state.usageEvents.length}</strong><small>For scan/action cost analysis</small></article>
        </div>
        <Link className="primary-action" href="/candidates">Review candidates</Link>
      </section>
    </main>
  );
}
