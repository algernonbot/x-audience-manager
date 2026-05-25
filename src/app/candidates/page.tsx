import { latestCandidates } from "@/server/store";

export default function CandidatesPage() {
  const candidates = latestCandidates();
  return (
    <main className="shell">
      <section className="panel">
        <p className="eyebrow">Cleanup candidates</p>
        <h1>Review queue</h1>
        <p className="lede">Safe-listed accounts are excluded by default and every unfollow requires explicit queueing.</p>
        <div className="table">
          {candidates.length === 0 ? <div className="row">Run a preview scan to populate candidates.</div> : candidates.map((candidate) => (
            <div className="row" key={candidate.accountId}>
              <div><strong>@{candidate.username}</strong><small>{candidate.name}</small></div>
              <div className="reasons">{candidate.reasonCodes.join(" · ")}</div>
              <button type="button">Queue unfollow</button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
