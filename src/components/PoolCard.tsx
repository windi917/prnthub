import { useState, useEffect, useCallback } from "react";
import * as React from "react";
import PollIcon from "@mui/icons-material/Poll";
import BallotTwoToneIcon from "@mui/icons-material/BallotTwoTone";
import { getProjects, getPoolTokens } from "../api/apis";

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

interface Pool {
  id: number;
  pooladdress: string;
  marketaddress: string;
  basemint: string;
  quotemint: string;
  lpmint: string;
  baseamount: number;
  quoteamount: number;
};

interface PoolCardProps {
  pool: Pool;
}

const PoolCard: React.FC<PoolCardProps> = (param) => {

  const [baseName, setBaseName] = useState('');
  const [quoteName, setQuoteName] = useState('');

  const fetchProjects = useCallback(async () => {
    // set base token
    const pros = await getProjects();
    console.log(pros, param.pool.basemint)
    if (pros.success === true) {
      const project = pros.projects
        .filter((e: any) => e.mint === param.pool.basemint)
        .map((e: Project) => ({
          id: e.id,
          symbol: e.symbol,
          mint: e.mint
        }))[0];

      setBaseName(project.symbol);
    };

    // set quote token
    const pTokens = await getPoolTokens();
    if (pros.success === true) {
      const poolToken = pTokens.pooltokens
        .filter((e: any) => e.tokenMint === param.pool.quotemint)
        .map((e: PoolToken) => ({
          id: e.id,
          name: e.name,
          decimals: e.decimals,
          tokenMint: e.tokenMint
        }))[0];

      setQuoteName(poolToken.name)
    }
  }, [setBaseName, setQuoteName]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <div className="relative flex flex-col justify-between p-4 mx-4 border rounded-lg shadow-2xl min-w-[10rem] min-h-[20rem] border-textclr2 card bg-white/10">
      <div className="flex items-center mb-4 cursor-pointer">
        <div className="flex flex-col">
          <span className="text-textclr2 font-primaryBold">
            Pool
          </span>
          <span className="text-textclr2 font-primaryBold">
            {param.pool.pooladdress}
          </span>
        </div>
        <div className="flex-1" />
      </div>
      <div className="flex flex-col">
        <span className="min-h-0 mt-2 text-sm text-balance text-textclr">
          Market
        </span>
        <span className="min-h-0 mt-2 text-sm text-balance text-textclr">
          {param.pool.marketaddress}
        </span>
      </div>

      <div className="flex items-center px-2 py-2 my-2 text-sm rounded-md shadow-sm cursor-pointer bg-textclr2/30 hover:bg-textclr2/40 hover:text-textclr font-primaryRegular">
        <PollIcon className="inline mr-4 text-textclr2" />
        <div className="flex flex-col">
          <span className="text-textclr font-primaryRegular">
            Base: {baseName}
          </span>
          <span className="text-textclr font-primaryRegular">
            Quote: {quoteName}
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
            {param.pool.baseamount} : {param.pool.quoteamount}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PoolCard;
