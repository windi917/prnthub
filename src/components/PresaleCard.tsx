import { useState, useEffect, useCallback, useContext } from "react";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import * as React from "react";
import PollIcon from "@mui/icons-material/Poll";
import BallotTwoToneIcon from "@mui/icons-material/BallotTwoTone";
import { getProjects, getPoolTokens } from "../api/apis";
import { buyTokens, withdraw } from "../solana/transaction";
import { JwtTokenContext } from "../contexts/JWTTokenProvider";
// import { getDecimals } from "../utils/WebIntegration";
import { toast } from "react-toastify";
import { setApprove } from "../solana/transaction";

interface Project {
  id: number;
  symbol: string;
  mint: string;
};

interface PoolToken {
  id: number;
  name: string;
  tokenMint: string;
  decimals: number;
};

interface Presale {
  presaleKey: string;
  owner: string;
  base_mint: string;
  quote_mint: string;
  min_allocation: number;
  max_allocation: number;
  hardcap: number;
  softcap: number;
  sale_price: number;
  launch_price: number;
  start_time: number;
  end_time: number;
  total_contributions: number;
  max_contribution: number;
};

interface PoolCardProps {
  presale: Presale;
}

const PresaleCard: React.FC<PoolCardProps> = (param) => {

  const anchorWallet = useAnchorWallet();
  const { userRole } = useContext(JwtTokenContext);
  const [baseToken, setBaseToken] = useState<Project>();
  const [quoteToken, setQuoteToken] = useState<PoolToken>();
  const [buyCount, setBuyCount] = useState(0);

  const fetchProjects = useCallback(async () => {
    // set base token
    const pros = await getProjects();
    console.log(pros, param.presale.base_mint)
    if (pros.success === true) {
      const project = pros.projects
        .filter((e: any) => e.mint === param.presale.base_mint)
        .map((e: Project) => ({
          id: e.id,
          symbol: e.symbol,
          mint: e.mint
        }))[0];

      setBaseToken(project);
    };

    // set quote token
    const pTokens = await getPoolTokens();
    if (pros.success === true) {
      const poolToken = pTokens.pooltokens
        .filter((e: any) => e.tokenMint === param.presale.quote_mint)
        .map((e: PoolToken) => ({
          id: e.id,
          name: e.name,
          decimals: e.decimals,
          tokenMint: e.tokenMint
        }))[0];

      setQuoteToken(poolToken)
    }
  }, [setBaseToken, setQuoteToken]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleBuy = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("###########", buyCount, param.presale)

    await buyTokens(anchorWallet, new PublicKey(param.presale.presaleKey), buyCount)
    console.log("-----------------------------------------")
  }, [buyCount]);

  const handleApprove = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if ( userRole !== "ADMIN" ) {
      toast.error('You do not have admin role');
      return;
    }

    await setApprove(anchorWallet, new PublicKey(param.presale.presaleKey));
  }, [userRole]);

  const handleWithdraw = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    await withdraw(anchorWallet, new PublicKey(param.presale.presaleKey));
  }, []);

  return (
    <div className="relative flex flex-col justify-between p-4 mx-4 border rounded-lg shadow-2xl min-w-[10rem] min-h-[20rem] border-textclr2 card bg-white/10">
      <div className="flex items-center mb-4 cursor-pointer">
        <div className="flex flex-col">
          <span className="text-textclr2 font-primaryBold">
            Base
          </span>
          <span className="text-textclr2 font-primaryBold">
            {baseToken?.symbol}
          </span>
        </div>
        <div className="flex-1" />
      </div>
      <div className="flex flex-col">
        <span className="min-h-0 mt-2 text-sm text-balance text-textclr">
          Quote
        </span>
        <span className="min-h-0 mt-2 text-sm text-balance text-textclr">
          {quoteToken?.name}
        </span>
      </div>

      <div className="flex items-center px-2 py-2 my-2 text-sm rounded-md shadow-sm cursor-pointer bg-textclr2/30 hover:bg-textclr2/40 hover:text-textclr font-primaryRegular">
        <PollIcon className="inline mr-4 text-textclr2" />
        <div className="flex flex-col">
          <span className="text-textclr font-primaryRegular">
            Start: {new Date(param.presale.start_time).toISOString()}
          </span>
          <span className="text-textclr font-primaryRegular">
            Quote: {new Date(param.presale.end_time).toISOString()}
          </span>
        </div>
      </div>

      <div className="flex items-center px-2 py-2 my-2 text-sm text-center rounded-md shadow-sm cursor-pointer bg-textclr2/50 hover:bg-textclr2/60 hover:text-textclr font-primaryRegular">
        <BallotTwoToneIcon className="inline mr-4 text-textclr2" />
        <div className="flex flex-row gap-1">
          <span className=" text-textclr font-primaryRegular">
            Amount (Base:Quote):
          </span>
          <span className="px-[0.5rem] py-[0.4] rounded-lg text-textclr2 font-primaryRegular bg-bg">
            {param.presale.sale_price} : {param.presale.hardcap}
          </span>
        </div>
      </div>

      <div className="flex flex-col">
        <input
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-textclr2 focus:outline-none"
          type="number"
          id="BuyCount"
          defaultValue="0"
          onChange={(e) => {
            setBuyCount(parseInt(e.target.value))
            console.log("--------------", parseInt(e.target.value), buyCount)
          }}
        />
        <button
          onClick={handleBuy}
          className="py-2 mt-4 tracking-wider rounded-md btn text-bg font-primaryRegular bg-textclr2/90 hover:bg-textclr2/60 focus:outline-none focus:bg-textclr2"
        >
          Buy
        </button>
        <button
          onClick={handleApprove}
          className="py-2 mt-4 tracking-wider rounded-md btn text-bg font-primaryRegular bg-textclr2/90 hover:bg-textclr2/60 focus:outline-none focus:bg-textclr2"
        >
          Approve
        </button>
        <button
          onClick={handleWithdraw}
          className="py-2 mt-4 tracking-wider rounded-md btn text-bg font-primaryRegular bg-textclr2/90 hover:bg-textclr2/60 focus:outline-none focus:bg-textclr2"
        >
          Withdraw
        </button>
      </div>
    </div>
  );
};

export default PresaleCard;
