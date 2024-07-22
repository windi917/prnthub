import { FC, useCallback, useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { useWallet, WalletContextState } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Buffer } from "buffer";
import { API_URL } from "../config";

import { JwtTokenContext } from "../contexts/JWTTokenProvider";
import { getAllData } from "../solana/transaction";

const WHITE_LIST = [
  "4mJKFtKpBbnqQZSzBaoZndzB1NdkmCm2tngAJ4tVobnZ",
  "R4fHhwostT1LU4HDc8EE3cj9iBysLDwMFusove7A52G",
  "5z5e6TZhRyeNdggjTcNzQkjs1yvMx842DoUQtc7uVmbU",
  "5rsVTk7moxdzkQWN5mrJuZ4fLCp9mSu2PZXtm54qjoMM",
  "CnupAEYxVDatLPoS2xJ5ATbhsb2VZj3FSeL7KLGDPz8a",
  "HsiEk8kHdMRqPsVU28foa6rHUjhyg7AtCY3PtdeDJDGn",
  "FP51foPMCgH8XeH8ekFh1PEXaTPndPrmYnPUSCgTtizz",
  "BoAqsV7fYNa6GVyyqGjVrpJJ4T4wgoMhaV4vHxLBSvZH",
  "Hq79Y2iQA9EWixmMPzdptm1j4BZwUZyohDfK9wsy8URG",
  "4hpvkDtDTDry1XASKPVxPS8KPc6q17RfjMoisoRqq3N3",
  "AGEso8rZkhqaoN26ZLUzL6cY92EARLeUEApSAvpLfMDy",
  "BopErGtCVqZ7k5DRkfpyCkUTYDJnKBb45j75zkch7MHg",
  "28GnFX1yRVFSzUQ7uyTdauH2usS46nhkYkQDgShhGgtk",
  "5G5HDvbib4CyHxVgm4RHiVY5RfbDuFfp6BiH5xgZXczT",
  "BZrVoacSC8Z1zNzCpeWRTAUn6SaAM8gqHvBPNHfS34R9",
  "5tTmNcmw5okEf9MKSSYjnDMqJVwiDi76bMB6PZY2qGYT",
  "CVkmjR66ZbM7FFG1Zoc3JhP4WfWCSvkxBQzGsUKkw9is",
  "9DahqnFqwMisEvdEpMnvptKZmt9RDBuBWfvTpzD7kyJu",
  "CtL5rTmW5g9NbCcehhzkMm887jzSyeEtQcJDgeM2sHDb",
  "7NqENUyGWS6yKNNnT7swE1WsRF9wrdvLLpskDN32qZVn",
  "teSTMZnKST8R2w5Nk3J1jiCooN2jEC33CQZtewyQcqE",
  "82fS64KzxMVGU5hrB7xt94A3xF2v9Y1JXjxon7yFjgBT",
  "4AUE2FTUBo35jwo1Cz3ErvzZPVS7PFCxDP88d2BwJVyW",
  "FqhfQnMjyMM7kQR3NAdTMg3s9LbpwQmfEvCnnMHuyfks",
  "3BWcH5wSKXkydJg3giuLesrqkSSgw4jDo16wEWnhoS65"
];

function checkUser(address: string) {
  const findOne = WHITE_LIST.find((e) => e === address)
  if (findOne)
    return true;

  return false;
}

const WalletInteraction: FC = () => {
  const navigate = useNavigate(); // Hook for navigation
  // const anchorWallet = useAnchorWallet();
  const { publicKey, connected, signMessage } = useWallet() as WalletContextState & {
    signMessage: (message: Uint8Array) => Promise<Uint8Array>;
  };

  const { setJwtToken, setUserRole, setUserId, setPresales, setUserAllow } = useContext(JwtTokenContext);

  const [isRegistered, setIsRegistered] = useState(true);

  const handleLogin = useCallback(async () => {
    if (!publicKey || !signMessage) {
      toast.error("Wallet not connected or signMessage not available");
      return;
    }

    try {
      const userCheckRes = checkUser(publicKey.toBase58());

      if (userCheckRes === false) {
        setUserAllow(0);
        navigate('/error');
        return;
      }

      const data = JSON.stringify({
        address: publicKey.toBase58(), // Convert public key to base58 string
      });

      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: API_URL + "/user/login",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      const response = await axios.request(config);

      if (response.data.success == true) {
        setJwtToken(response.data.token);
        setUserRole(response.data.role);
        setUserId(response.data.userId);
        setIsRegistered(true);

        const data = await getAllData();
        // await initProject(anchorWallet);

        console.log("Presales: ", data);
        setPresales(data);

      } else {
        setIsRegistered(false);
        handleSignup();
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Error logging in: " + error.message);
      } else {
        toast.error("Error logging in");
      }
    }
  }, [publicKey, signMessage]);

  useEffect(() => {
    if (publicKey) {
      handleLogin();
    }
  }, [publicKey, handleLogin]);

  const handleSignup = useCallback(async () => {
    if (!publicKey || !signMessage) {
      toast.error("Wallet not connected or signMessage not available");
      return;
    }

    try {
      const message = new TextEncoder().encode("Sign this message for signup");
      const signedMessage = await signMessage(message);
      const data = JSON.stringify({
        address: publicKey.toBase58(), // Convert public key to base58 string
        msg: "Sign this message for signup",
        signature: Buffer.from(signedMessage).toString("base64"),
      });

      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: API_URL + "/user/signup",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      await axios.request(config);

      // After successful signup, attempt login again to obtain JWT token
      handleLogin();
    } catch (error) {
      console.error("Signup error:", error);
      if (error instanceof Error) {
        toast.error("Error signing up: " + error.message);
      } else {
        toast.error("Error signing up");
      }
    }
  }, [publicKey, signMessage, handleLogin]);

  return (
    <div>
      <ToastContainer />
      <div className="flex" style={{ alignItems: 'center' }}>
        <WalletMultiButton />
        {connected && isRegistered === false ? (
          <button
            className="bg-[#ccf869] border-2 mt-1 border-whitesmoke font-primaryRegular leading-normal py-2 px-6 rounded-3xl text-[0.9em] duration-300 ease-in-out text-black hover:bg-[#bbe759] hover:text-black"
            onClick={handleSignup}
          >
            Sign Up
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default WalletInteraction;
