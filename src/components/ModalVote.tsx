import React, { useState, useEffect, useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getVTokens } from "../api/apis";

import { Oval } from "react-loader-spinner";

import { useWallet } from "@solana/wallet-adapter-react";
import { createVote } from "../utils/WebIntegration";
import { createVoteApi } from "../api/apis";
import { JwtTokenContext } from "../contexts/JWTTokenProvider";

interface TokenPair {
  id: number,
  periodId: number,
  voteTokenId: number,
  weight: number
};

interface ModalProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  projectId: number;
  voteTokens: TokenPair[];
  currentVotePower: number;
  setVotePower: React.Dispatch<React.SetStateAction<number>>;
}

interface VoteToken {
  id: number,
  name: string,
  tokenMint: string,
  decimals: number
};

const ModalVote: React.FC<ModalProps> = ({ setShowModal, projectId, voteTokens, currentVotePower, setVotePower }) => {
  const [voteAmount, setVoteAmount] = useState("");
  const [tokenMint, setTokenMint] = useState<string>("");
  const [decimals, setDecimals] = useState<number>(0);

  const [vTokens, setVTokens] = useState<VoteToken[]>([]);
  const wallet = useWallet();

  const [loading, setLoading] = useState<boolean>(false);

  const { jwtToken } = useContext(JwtTokenContext);

  useEffect(() => {
    const fetchVTokens = async () => {
      const pros = await getVTokens();
      if (pros.success === true) {
        const avalableTokens = pros.vtokens.filter((e: VoteToken) => {
          for (let i = 0; i < voteTokens.length; i++) {
            const item: TokenPair = voteTokens[i];
            if (item.voteTokenId === e.id)
              return true;
          }

          return false;
        })

        setVTokens(avalableTokens.map((e: VoteToken) => ({
          id: e.id,
          name: e.name,
          tokenMint: e.tokenMint,
          decimals: e.decimals
        })))
      }
    };

    fetchVTokens();
  }, [])

  const handleVTokenSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();

    const tokenid = e.target.value;
    const vtoken = vTokens.filter((e) => (e.id === parseInt(tokenid)));

    if (vtoken) {
      setTokenMint(vtoken[0].tokenMint);
      setDecimals(vtoken[0].decimals);
    }
  }

  const handleSubmit = async () => {
    if (!voteAmount) {
      toast.error("Please enter a vote amount.", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        theme: "dark",
      });
      return;
    }

    setLoading(true);

    const txHash = await createVote(tokenMint, wallet, 'HRD7gyMZwkQ65uFgvYmoxrmxdW1KjRCa9g9uRiw5RBoj', parseInt(voteAmount) * Math.pow(10, decimals))
    if (!txHash) {
      setLoading(false);
      toast.error("Vote failed(transaction)!");
      return;
    }

    const response = await createVoteApi(jwtToken, txHash, projectId, parseInt(voteAmount));
    if (response.success == false) {
      setLoading(false);
      toast.error("Create Vote error!");
      return;
    }

    toast.success("Vote submitted successfully!", {
      position: "bottom-center",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      theme: "dark",
    });

    setVotePower(currentVotePower + parseInt(voteAmount));

    setLoading(false);
    setShowModal(false);
  };

  const handleClose = () => {
    setShowModal(false);
  };
  // const Test = () => toast("success!");

  return (
    <>
      <ToastContainer />
      <div className="fixed inset-0 z-10 flex items-center justify-center bg-opacity-50 bg-bg ">
        {/* Loading Spinner */}
        {loading ? (
          <>
            <Oval
              height="80"
              visible={true}
              width="80"
              color="#CCF869"
              ariaLabel="oval-loading"
              wrapperStyle={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          </>
        ) : (
        <div className="p-8 mx-3 border rounded-lg bg-slate-800/90 border-textclr2">
          <h2 className="mb-4 text-xl text-textclr2">Vote </h2>
          <select
            className="w-full max-w-2xl select-md select select-ghost !bg-slate-500/60 !border !border-textclr2"
            onChange={handleVTokenSelect}
            defaultValue="Select Vote Token"
          >
            <option disabled>Select Vote Token</option>
            {vTokens.map((e) => (
                <option value={e.id}>{e.name}</option>
            ))}
          </select>
          <input
            type="number"
            value={voteAmount}
            onChange={(e) => setVoteAmount(e.target.value)}
            placeholder="Enter vote amount [ 1,000 - 10,000 ]"
            className="w-full p-2 mt-6 mb-4 border rounded-xl bg-slate-600/80 border-textclr2 text-textclr2 focus:outline-none focus:border-textclr2/60"
          />
          <button
            onClick={handleSubmit}
            // onClick={Test}
            className="px-4 py-2 rounded-lg text-slate-700/90 font-primaryBold bg-textclr2/60 hover:bg-textclr2/90 focus:outline-none focus:bg-textclr2 mr-4"
          >
            Submit
          </button>
          <button
            onClick={handleClose}
            // onClick={Test}
            className="px-4 py-2 rounded-lg text-slate-700/90 font-primaryBold bg-textclr2/60 hover:bg-textclr2/90 focus:outline-none focus:bg-textclr2"
          >
            Close
          </button>
        </div>)}
      </div>
    </>
  );
};

export default ModalVote;
