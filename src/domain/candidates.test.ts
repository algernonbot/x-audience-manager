import { describe, expect, it } from "vitest";
import { generateCleanupCandidates } from "./candidates";
import type { XAccount } from "./x-provider";

const accounts: XAccount[] = [
  { id: "1", username: "spammy", name: "Spam Bot", description: "crypto airdrop", verified: false, protected: false, profileImageUrl: null, followersCount: 4, followingCount: 900, createdAt: "2024-01-01T00:00:00Z" },
  { id: "2", username: "friend", name: "Good Friend", description: "builder", verified: false, protected: false, profileImageUrl: "https://img", followersCount: 200, followingCount: 150, createdAt: "2020-01-01T00:00:00Z" },
  { id: "3", username: "private", name: "Private", description: "", verified: false, protected: true, profileImageUrl: "https://img", followersCount: 20, followingCount: 300, createdAt: "2021-01-01T00:00:00Z" }
];

describe("generateCleanupCandidates", () => {
  it("scores low-signal accounts from basic profile fields", () => {
    const candidates = generateCleanupCandidates(accounts, { safeListedAccountIds: [] });
    expect(candidates[0]).toMatchObject({ accountId: "1", reasonCodes: expect.arrayContaining(["no_profile_image", "low_followers", "keyword_match"]) });
  });

  it("excludes safe-listed accounts by default", () => {
    const candidates = generateCleanupCandidates(accounts, { safeListedAccountIds: ["1"] });
    expect(candidates.map((c) => c.accountId)).not.toContain("1");
  });
});
