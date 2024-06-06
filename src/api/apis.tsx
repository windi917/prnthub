
import axios from "axios";

export const getProjects = async () => {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "https://api.prnthub.com/token",
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
      url: "https://api.prnthub.com/period",
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

export const getVTokens = async () => {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "https://api.prnthub.com/vtoken",
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

export const createVToken = async (jwtToken: string | null, name: string, mint: string , decimals: number) => {
    const data = {
        'name': name,
        'tokenMint': mint,
        'decimals': decimals.toString()
    };

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://api.prnthub.com/vtoken",
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