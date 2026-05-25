import type { XAccount } from "./x-provider";

export type CleanupCandidate = {
  accountId: string;
  username: string;
  name: string;
  reasonCodes: string[];
  score: number;
  status: "candidate" | "safe_listed" | "queued" | "removed" | "skipped";
};

const riskyKeywords = ["airdrop", "crypto", "giveaway", "growth", "bot", "spam"];

export function generateCleanupCandidates(accounts: XAccount[], options: { safeListedAccountIds: string[] }): CleanupCandidate[] {
  const safe = new Set(options.safeListedAccountIds);
  return accounts
    .filter((account) => !safe.has(account.id))
    .map((account) => {
      const reasonCodes: string[] = [];
      if (!account.profileImageUrl) reasonCodes.push("no_profile_image");
      if (account.followersCount < 50) reasonCodes.push("low_followers");
      if (account.followingCount > account.followersCount * 10) reasonCodes.push("high_following_ratio");
      if (account.protected) reasonCodes.push("protected_account");
      if (riskyKeywords.some((keyword) => `${account.username} ${account.name} ${account.description}`.toLowerCase().includes(keyword))) reasonCodes.push("keyword_match");
      return { accountId: account.id, username: account.username, name: account.name, reasonCodes, score: reasonCodes.length, status: "candidate" as const };
    })
    .filter((candidate) => candidate.score > 0)
    .sort((a, b) => b.score - a.score || a.username.localeCompare(b.username));
}
