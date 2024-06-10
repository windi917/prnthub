
import axios from "axios";
import { API_URL } from "../config";

export const getProjects = async () => {
  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: API_URL + "/token",
    headers: {
      "Content-Type": "application/json"
    }
  };

  try {
    const response = await axios.request(config);
    return { success: true, projects: response.data };
  } catch (error) {
    return { success: false };
  }
};

export const getPeriods = async () => {
  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: API_URL + "/period",
    headers: {
      "Content-Type": "application/json"
    }
  };

  try {
    const response = await axios.request(config);
    return { success: true, periods: response.data };
  } catch (error) {
    return { success: false };
  }
};

export const getTokenPairs = async () => {
  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: API_URL + "/tokenpair",
    headers: {
      "Content-Type": "application/json"
    }
  };

  try {
    const response = await axios.request(config);
    return { success: true, tokenPairs: response.data };
  } catch (error) {
    return { success: false };
  }
};

export const getVTokens = async () => {
  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: API_URL + "/vtoken",
    headers: {
      "Content-Type": "application/json"
    }
  };

  try {
    const response = await axios.request(config);
    return { success: true, vtokens: response.data };
  } catch (error) {
    return { success: false };
  }
};

export const createVToken = async (jwtToken: string | null, name: string, mint: string, decimals: number) => {
  const data = {
    'name': name,
    'tokenMint': mint,
    'decimals': decimals.toString()
  };

  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: API_URL + "/vtoken",
    headers: {
      "Authorization": "Bearer " + jwtToken,
      "Content-Type": "application/json"
    },
    data: data,
  };

  try {
    await axios.request(config);
    return { success: true }
  } catch (error) {
    return { success: false };
  }
};

export const createVotePeriod = async (jwtToken: string | null, projectId: number, startAt: string, endAt: string, votingtitle: string, votePowerLimit: number) => {
  const data = {
    'projectId': projectId,
    'startAt': new Date(startAt).toISOString(),
    'endAt': new Date(endAt).toISOString(),
    'votingtitle': votingtitle,
    'votePowerLimit': votePowerLimit
  };

  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: API_URL + "/period",
    headers: {
      "Authorization": "Bearer " + jwtToken,
      "Content-Type": "application/json"
    },
    data: data,
  };

  try {
    const response = await axios.request(config);
    return { success: true, period: response.data }
  } catch (error) {
    return { success: false };
  }
};

export const createTokenPair = async (jwtToken: string | null, periodId: number, voteTokenId: number, weight: number, minVoteAmount: number) => {
  const data = {
    'periodId': periodId,
    'voteTokenId': voteTokenId,
    'weight': weight,
    'minimumCount': minVoteAmount
  };

  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: API_URL + "/tokenpair",
    headers: {
      "Authorization": "Bearer " + jwtToken,
      "Content-Type": "application/json"
    },
    data: data,
  };

  try {
    await axios.request(config);
    return { success: true }
  } catch (error) {
    return { success: false };
  }
};

export const createVoteApi = async (jwtToken: string | null, txHash: string, tokenId: number, votePower: number) => {
  const data = {
    'txHash': txHash,
    'tokenId': tokenId,
    'votePower': votePower
  };

  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: API_URL + "/vote",
    headers: {
      "Authorization": "Bearer " + jwtToken,
      "Content-Type": "application/json"
    },
    data: data,
  };

  try {
    await axios.request(config);
    return { success: true }
  } catch (error) {
    return { success: false };
  }
};

export const createNoneVoteApi = async (jwtToken: string | null, txHash: string, tokenId: number, votePower: number) => {
  const data = {
    'txHash': txHash,
    'tokenId': tokenId,
    'votePower': votePower
  };

  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: API_URL + "/vote/none",
    headers: {
      "Authorization": "Bearer " + jwtToken,
      "Content-Type": "application/json"
    },
    data: data,
  };

  try {
    await axios.request(config);
    return { success: true }
  } catch (error) {
    if ( axios.isAxiosError(error) )
      if ( error.response )
        return { success: false, error: error.response.data.Error }
    return { success: false, error: error };
  }
};

export const setTokenStatus = async (jwtToken: string | null, tokenId: number, status: string) => {
  const data = {
    tokenId: tokenId,
    status: status
  };

  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: API_URL + "/token/status",
    headers: {
      "Authorization": "Bearer " + jwtToken,
      "Content-Type": "application/json"
    },
    data: data,
  };

  try {
    await axios.request(config);
    return { success: true }
  } catch (error) {
    return { success: false };
  }
};