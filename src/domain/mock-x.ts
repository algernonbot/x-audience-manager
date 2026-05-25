import type { XAccount, XProvider } from "./x-provider";

const KEYWORDS = ["airdrop", "crypto", "giveaway", "growth", "bot"];

export function makeMockAccount(index: number): XAccount {
  const keyword = KEYWORDS[index % KEYWORDS.length];
  return {
    id: `x-${index + 1}`,
    username: index % 3 === 0 ? `cleanup_${index + 1}` : `builder_${index + 1}`,
    name: index % 3 === 0 ? `Low Signal ${index + 1}` : `Builder ${index + 1}`,
    description: index % 3 === 0 ? `${keyword} links and low-signal content` : "Founder, designer, or engineer building useful things",
    verified: index % 11 === 0,
    protected: index % 13 === 0,
    profileImageUrl: index % 4 === 0 ? null : `https://img.example.com/${index + 1}.png`,
    followersCount: index % 3 === 0 ? 8 + index : 250 + index * 3,
    followingCount: index % 3 === 0 ? 900 + index : 180 + index,
    createdAt: new Date(Date.UTC(2018 + (index % 7), index % 12, 1)).toISOString(),
  };
}

export function createMockXProvider(totalAccounts = 150): XProvider {
  const accounts = Array.from({ length: totalAccounts }, (_, index) => makeMockAccount(index));
  return {
    async getMe() {
      return { id: "me-1", username: "charles_preview", name: "Charles Preview", avatarUrl: null };
    },
    async getFollowingPage({ cursor, limit }) {
      const start = cursor ? Number(cursor) : 0;
      const data = accounts.slice(start, start + limit);
      const next = start + data.length < accounts.length ? String(start + data.length) : null;
      return { data, nextCursor: next };
    },
    async unfollowUser(targetUserId) {
      return { ok: true, targetUserId };
    },
  };
}
