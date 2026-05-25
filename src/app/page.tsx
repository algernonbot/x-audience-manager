import { generateCleanupCandidates } from "@/domain/candidates";
import { queueCleanupActions } from "@/domain/cleanup";
import { calculateEntitlement } from "@/domain/entitlements";
import { createMockXProvider } from "@/domain/mock-x";
import { runPreviewScan } from "@/domain/scan";
import { buildDashboardViewModel } from "@/domain/dashboard";
import type { UsageEvent } from "@/domain/usage";

const NOW = new Date("2026-05-23T00:00:00.000Z");
const SAFE_LISTED_ACCOUNT_IDS = ["x-1", "x-4", "x-7"];

export default async function Page() {
  const usageEvents: UsageEvent[] = [];
  const entitlement = calculateEntitlement({ now: NOW, passes: [], subscription: null });
  const scan = await runPreviewScan({
    provider: createMockXProvider(150),
    entitlement,
    requestedLimit: 100,
    recordUsage: (event) => usageEvents.push(event),
  });
  const candidates = generateCleanupCandidates(scan.accounts, { safeListedAccountIds: SAFE_LISTED_ACCOUNT_IDS });
  const queued = queueCleanupActions({
    selectedAccountIds: candidates.slice(0, 7).map((candidate) => candidate.accountId),
    usedActions: 0,
    actionLimit: entitlement.actionLimit,
    safeListedAccountIds: SAFE_LISTED_ACCOUNT_IDS,
  });
  const dashboard = buildDashboardViewModel({
    profile: scan.profile,
    scan: scan.scan,
    entitlement,
    candidates,
    usedActions: queued.queued.length,
    queuedActions: queued.queued.length,
    safeListedCount: SAFE_LISTED_ACCOUNT_IDS.length,
  });

  return (
    <main className="shell">
      <section className="hero-card">
        <p className="eyebrow">managex · light-only ch.sh interface</p>
        <div className="hero-grid">
          <div>
            <h1>ManageX</h1>
            <p className="lede">
              A clean, tactile command center for cleaning your X graph. Preview a capped sample, inspect every candidate,
              safe-list accounts you trust, and queue removals with rate-limit-aware controls.
            </p>
            <div className="actions">
              <a className="primary-action" href="/api/mock-login">Login with X</a>
              <a className="secondary-action" href="/dashboard">View demo dashboard</a>
            </div>
          </div>
          <div className="status-panel" aria-label="Preview account status">
            <span>{dashboard.hero.accessLabel}</span>
            <strong>{dashboard.hero.name}</strong>
            <small>{dashboard.hero.username}</small>
          </div>
        </div>
      </section>

      <section className="metrics-grid" aria-label="Preview scan metrics">
        <article>
          <span>Preview scan</span>
          <strong>{dashboard.scan.recordsLabel}</strong>
          <small>No full graph import on first login</small>
        </article>
        <article>
          <span>Free allowance</span>
          <strong>{dashboard.allowance.label}</strong>
          <small>{dashboard.allowance.queuedActions} queued in this demo</small>
        </article>
        <article>
          <span>Cost controls</span>
          <strong>{dashboard.scan.estimatedCostLabel}</strong>
          <small>{usageEvents.length} usage event recorded</small>
        </article>
        <article>
          <span>Trust controls</span>
          <strong>Safe-list protected</strong>
          <small>{dashboard.candidates.safeListedCount} accounts excluded by default</small>
        </article>
      </section>

      <section className="workspace-grid">
        <article className="panel wide">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Candidate review</p>
              <h2>Review before any destructive action</h2>
            </div>
            <span>{dashboard.candidates.total} candidates</span>
          </div>
          <div className="table" role="table" aria-label="Cleanup candidates">
            {candidates.slice(0, 6).map((candidate) => (
              <div className="row" role="row" key={candidate.accountId}>
                <div>
                  <strong>@{candidate.username}</strong>
                  <small>{candidate.name}</small>
                </div>
                <div className="reasons">{candidate.reasonCodes.join(" · ")}</div>
                <button type="button">Queue unfollow</button>
              </div>
            ))}
          </div>
        </article>

        <aside className="panel">
          <p className="eyebrow">Upgrade paths</p>
          {dashboard.upgradeCards.map((card) => (
            <div className="upgrade-card" key={card.kind}>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              <a href={card.kind === "purge_pass" ? "/api/billing/purge-pass" : "/api/billing/subscription"}>{card.cta}</a>
            </div>
          ))}
        </aside>
      </section>

      <section className="panel report-panel">
        <p className="eyebrow">Cleanup report</p>
        <h2>Queued actions stay rate-limit-aware</h2>
        <p>
          Actions are queued instead of fired inline, which keeps the UX calm during X API rate limits and
          gives the user visible success, failure, and retry states.
        </p>
      </section>
    </main>
  );
}
