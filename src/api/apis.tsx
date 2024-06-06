
// import { useContext } from "react";
import axios from "axios";
// import { JwtTokenContext } from "../contexts/JWTTokenProvider";

// const { jwtToken } = useContext(JwtTokenContext);

export const getProjects = async () => {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "https://api.prnthub.com/token",
      headers: {
        "Content-Type": "application/json"
      }
    };

    await axios.request(config);

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

    await axios.request(config);

    try {
      const response = await axios.request(config);
      return { success: true, periods: response.data };
    } catch (error) {
      return { success: false };
    }
};