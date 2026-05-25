export default function BillingPage() {
  return (
    <main className="shell">
      <section className="workspace-grid">
        <article className="panel">
          <p className="eyebrow">48-hour Purge Pass</p>
          <h1>Same product, two-day access</h1>
          <p className="lede">Unlock deeper scans and higher action capacity without changing the workspace surface.</p>
          <form action="/api/billing/purge-pass" method="post"><button className="primary-action" type="submit">Buy Purge Pass</button></form>
        </article>
        <article className="panel">
          <p className="eyebrow">Subscription</p>
          <h1>Ongoing cleanup</h1>
          <p className="lede">Recurring access for scans, reports, and safe-list maintenance over time.</p>
          <form action="/api/billing/subscription" method="post"><button className="primary-action" type="submit">Subscribe</button></form>
        </article>
      </section>
    </main>
  );
}
