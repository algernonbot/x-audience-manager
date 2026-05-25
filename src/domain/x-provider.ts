export type XAccount = {
  id: string;
  username: string;
  name: string;
  description: string;
  verified: boolean;
  protected: boolean;
  profileImageUrl: string | null;
  followersCount: number;
  followingCount: number;
  createdAt: string;
};

export type XProfile = { id: string; username: string; name: string; avatarUrl: string | null };

export type XPage<T> = { data: T[]; nextCursor: string | null };

export type XProvider = {
  getMe(): Promise<XProfile>;
  getFollowingPage(input: { cursor?: string | null; limit: number }): Promise<XPage<XAccount>>;
  unfollowUser(targetUserId: string): Promise<{ ok: true; targetUserId: string }>;
};
