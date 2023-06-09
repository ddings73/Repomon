import { http } from "./axios";

export const axiosRequestRepoRank = async (page: number, search?: string) => {
  const params = {
    page,
    search,
    size: 15,
  };

  const res = await http.get("rank/repo", { params });

  return res;
};

export const axiosRequestBattleRank = async (page: number, search?: string) => {
  const params = {
    page,
    search,
    size: 15,
  };

  const res = await http.get("rank/repomon", { params });

  return res;
};

export const axiosRequestUserRank = async (page: number, search?: string) => {
  const params = {
    page,
    search,
    size: 20,
  };

  const res = await http.get("rank/user", { params });

  return res;
};
