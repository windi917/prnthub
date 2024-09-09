import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getVTokens, getProjects } from "../api/apis";
import TweetButton from "./TweetButton";
import { motion } from "framer-motion";

import { Oval } from "react-loader-spinner";

import { useWallet } from "@solana/wallet-adapter-react";
import { getBalance, createVote } from "../utils/WebIntegration";
import { createVoteApi, createNoneVoteApi } from "../api/apis";
import { JwtTokenContext } from "../contexts/JWTTokenProvider";

import { ADMIN_WALLET_ADDRESS } from "../config";

interface TokenPair {
  id: number;
  periodId: number;
  voteTokenId: number;
  weight: number;
  minimumCount: number;
}

interface ModalProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  projectId: number;
  voteTokens: TokenPair[];
  currentVotePower: number;
  setVotePower: React.Dispatch<React.SetStateAction<number>>;
  projectName: string;
}

interface VoteToken {
  id: number;
  name: string;
  tokenMint: string;
  decimals: number;
  weight: number;
  minimumCount: number;
}

const ModalVote: React.FC<ModalProps> = ({
  setShowModal,
  projectId,
  voteTokens,
  currentVotePower,
  setVotePower,
  projectName,
}) => {
  const [voteAmount, setVoteAmount] = useState("");
  const [tokenMint, setTokenMint] = useState<string>("");
  const [decimals, setDecimals] = useState<number>(0);
  const [weight, setWeight] = useState<number>(0);
  const [minimumCount, setMinimumCount] = useState<number>(0);
  const [tokenBalance, setTokenBalance] = useState<number>(-1);

  const [vTokens, setVTokens] = useState<VoteToken[]>([]);
  const wallet = useWallet();

  const [loading, setLoading] = useState<boolean>(false);

  const { jwtToken } = useContext(JwtTokenContext);

  useEffect(() => {
    const fetchVTokens = async () => {
      const pros = await getVTokens();
      const projects = await getProjects();

      if (pros.success === true && projects.success === true) {
        let project = projects.projects.filter(
          (e: any) => e.id === projectId
        )[0];

        const avalableTokens = pros.vtokens.filter((e: VoteToken) => {
          for (let i = 0; i < voteTokens.length; i++) {
            const item: TokenPair = voteTokens[i];
            if (item.voteTokenId === e.id) return true;
          }

          return false;
        });

        setVTokens(
          avalableTokens.map((e: VoteToken) => ({
            id: e.id,
            name: e.name,
            tokenMint: e.tokenMint,
            decimals: e.decimals,
            weight: voteTokens.filter(
              (item: TokenPair) =>
                item.periodId === project.periodId && item.voteTokenId === e.id
            )[0].weight,
            minimumCount: voteTokens.filter(
              (item: TokenPair) =>
                item.periodId === project.periodId && item.voteTokenId === e.id
            )[0].minimumCount,
          }))
        );
      }
    };

    fetchVTokens();
  }, []);

  const handleVTokenSelect = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    e.preventDefault();

    const tokenid = e.target.value;
    if (tokenid === "NoneToken") {
      setTokenMint(tokenid);
      setTokenBalance(-1);
    } else {
      const vtoken = vTokens.filter((e) => e.id === parseInt(tokenid));
      if (vtoken) {
        const balance = await getBalance(wallet, vtoken[0].tokenMint);
        setTokenBalance(balance);
        setTokenMint(vtoken[0].tokenMint);
        setDecimals(vtoken[0].decimals);
        setWeight(vtoken[0].weight);
        setMinimumCount(vtoken[0].minimumCount);
      }
    }
  };

  const handleSubmit = async () => {
    if (!jwtToken) {
      toast.error("Token Error: Please sign first!");
      return;
    }

    if (!tokenMint) {
      toast.error(`Please select vote token`, {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        theme: "dark",
      });
      return;
    }

    if (tokenMint !== "NoneToken") {
      if (!voteAmount || parseInt(voteAmount) < minimumCount) {
        toast.error(`Please enter a vote amount. (Minimum = ${minimumCount})`, {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          theme: "dark",
        });
        return;
      }
      if (parseInt(voteAmount) > tokenBalance) {
        toast.error("Token balance is not enough", {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          theme: "dark",
        });
        return;
      }
    }
    setLoading(true);

    const txHash = await createVote(
      tokenMint,
      wallet,
      ADMIN_WALLET_ADDRESS.toBase58(),
      parseInt(voteAmount) * Math.pow(10, decimals)
    );
    if (!txHash) {
      setLoading(false);
      toast.error("Vote failed(transaction)!");
      return;
    }

    if (tokenMint === "NoneToken") {
      const response = await createNoneVoteApi(jwtToken, txHash, projectId, 1);
      if (response.success == false) {
        setLoading(false);
        toast.error(`Create Vote error! (${response.error})`);
        return;
      }

      setVotePower(currentVotePower + 1);
    } else {
      const response = await createVoteApi(
        jwtToken,
        txHash,
        projectId,
        parseInt(voteAmount)
      );
      if (response.success == false) {
        setLoading(false);
        toast.error("Create Vote error!");
        return;
      }

      setVotePower(currentVotePower + parseInt(voteAmount) * weight);
    }

    toast.success("Vote submitted successfully!", {
      position: "bottom-center",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      theme: "dark",
    });

    setLoading(false);
    setShowModal(false);
  };

  const handleClose = () => {
    setShowModal(false);
  };
  // const Test = () => toast("success!");
  // const projects = ["test1"];

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="p-8 mx-3 border rounded-lg bg-slate-800/90 border-textclr2 w-96">
          <h2 className="mb-4 text-2xl font-primaryBold text-textclr">Vote</h2>
          <select
            className="w-full max-w-2xl select-md select select-ghost !bg-slate-500/60 !border !border-textclr2 p-2 mt-6 mb-4"
            onChange={handleVTokenSelect}
            defaultValue="Select Vote Token"
          >
            <option disabled>Select Vote Token</option>
            <option value="NoneToken">Without Token</option>
            {vTokens.map((e) => (
              <option value={e.id}>{e.name}</option>
            ))}
          </select>
          {tokenBalance !== -1 ? (
            <h2 className="px-2 py-2 mb-4 font-mono text-sm border-2 rounded-lg text-textclr border-textclr2">
              <span className="font-primaryRegular text-textclr2">
                Balance :{" "}
              </span>
              {tokenBalance}
            </h2>
          ) : null}
          {tokenMint !== "NoneToken" ? (
            <input
              type="number"
              value={voteAmount}
              onChange={(e) => setVoteAmount(e.target.value)}
              placeholder="Enter vote amount [ 5,000 - 1M ]"
              className="w-full p-2 mb-4 text-sm border rounded-xl bg-slate-600/80 border-textclr2 text-textclr2 focus:outline-none focus:border-textclr2/60"
            />
          ) : null}
          <div className="flex space-x-3">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 mr-4 rounded-lg text-textclr/90 font-primaryBold bg-textclr2/40 hover:bg-textclr2/80 focus:outline-none focus:bg-textclr2"
            >
              Submit
            </button>

            <button
              onClick={handleClose}
              className="px-4 py-2 rounded-lg text-textclr/90 font-primaryBold bg-textclr2/40 hover:bg-textclr2/80 focus:outline-none focus:bg-textclr2"
            >
              Close
            </button>
          </div>
          {/* Tweet button */}
          <motion.span
            className="flex flex-col justify-start py-2 space-y-2 text-sm text-transparent bg-clip-text bg-gradient-to-r from-lime-300 to-lime-600"
            initial={{ opacity: 1 }}
            animate={{ opacity: [1, 0.9, 1], scale: [1, 1.05, 1] }} // animate prop
            transition={{
              opacity: {
                duration: 2,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut",
              },
              scale: {
                duration: 2,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut",
              },
            }}
          >
            Tweet your vote 🎉!
          </motion.span>
          <TweetButton projectName={projectName} />
        </div>
      </div>
      {loading && (
        <>
          <div
            style={{
              position: "fixed",
              top: "0",
              left: "0",
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: "1000",
            }}
          >
            <div
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <Oval
                height="80"
                visible={true}
                width="80"
                color="#CCF869"
                ariaLabel="oval-loading"
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ModalVote;
