export type RepresentRepoType = {
  isActive: boolean;
  battleRank: number;
  repoExp: number;
  repoId: number;
  repoName: string;
  repoRank: number;
  repoRating: number;
  repomonNickName: string;
  repomon: RepomonType;
};

export type UserInfoType = {
  updateTime: string;
  extensionKey: string;
  avatarUrl: string;
  nickname: string;
  representRepo: RepresentRepoType;
  totalExp: number;
  userDescription: string;
  activeRepoCnt: number;
  userId: number;
  username: string;
  userRank: number;
};

export type RepoListType = {
  repoListItems: RepoListItemType[];
  totalElements: number;
  totalPages: number;
};

export type RepoListItemType = {
  isActive: boolean;
  isPrivate: boolean;
  repoExp: number;
  repoId: number;
  repomonId: number;
  repoName: string;
  repomonName: string;
  repoDescription: string;
  repoRating: number;
  repomonUrl: string;
};

export type RepomonType = {
  repomonId: number;
  repomonUrl: string;
  repomonName: string;
  repomonSkillUrl: number;
  repomonSkillName: string;
  repomonTier: number;
};

// 레포몬 등록 페이지 차트 props TYPE
export type statsData = {
  attackStat: number;
  avoidStat: number;
  enduranceStat: number;
  criticalStat: number;
  hitStat: number;
};
