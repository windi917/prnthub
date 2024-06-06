import { FC, useCallback, useState, useEffect } from "react";
import { useWallet, WalletContextState } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Buffer } from "buffer";

const WalletInteraction: FC = () => {
  const { publicKey, signMessage } = useWallet() as WalletContextState & {
    signMessage: (message: Uint8Array) => Promise<Uint8Array>;
  };
  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState<boolean | null>(null);

  const handleLogin = useCallback(async () => {
    if (!publicKey || !signMessage) {
      toast.error("Wallet not connected or signMessage not available");
      return;
    }

    try {
      const message = new TextEncoder().encode("Sign this message for login");
      const signedMessage = await signMessage(message);
      const data = JSON.stringify({
        address: publicKey.toBase58(), // Convert public key to base58 string
        signature: Buffer.from(signedMessage).toString("base64"),
      });

      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://api.prnthub.com/user/login",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      const response = await axios.request(config);

      if ( response.data.success == true ) {
        setJwtToken(response.data.token);
        setIsRegistered(true);
        toast.success("Login successful!");
      } else {
        setIsRegistered(false);
        toast.info("User not registered. Please sign up.");
      }
    } catch (error) {
      console.error("Login error:", error);
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
        url: "https://api.prnthub.com/user/signup",
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
      <WalletMultiButton />
      {publicKey && isRegistered === true && (
        <div>
          <p>Connected: {publicKey.toBase58()}</p>
        </div>
      )}
      {publicKey && isRegistered === false && (
        <div>
          <p>User not registered. Please sign up.</p>
          <button onClick={handleSignup}>Sign Up</button>
        </div>
      )}
      {jwtToken && <div>JWT Token: {jwtToken}</div>}
    </div>
  );
};

export default WalletInteraction;
