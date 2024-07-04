import { useState, useEffect, useContext, useCallback } from "react";
import * as React from "react";
import AddIcon from "@mui/icons-material/Add";
import { useWallet } from "@solana/wallet-adapter-react";
import { JwtTokenContext } from "../contexts/JWTTokenProvider";
import { getProjects, getPoolTokens } from "../api/apis";
import { toast } from "react-toastify";
import { createAmmPool, getBalance } from "../utils/WebIntegration";
import { createPoolApi } from "../api/apis";
import { Oval } from "react-loader-spinner";
import { motion } from "framer-motion";

interface Project {
  id: number;
  symbol: string;
  proposalStatus: string;
  mint: string;
  decimals: number;
}

interface PoolToken {
  id: number;
  name: string;
  tokenMint: string;
  decimals: number;
}

const LPsetup = () => {
  const wallet = useWallet();
  const { jwtToken } = useContext(JwtTokenContext);
  const [projects, setProjects] = useState<Project[]>([]);
  const [poolTokens, setPoolTokens] = useState<PoolToken[]>([]);
  const [baseTokenAddress, setBaseTokenAddress] = useState("");
  const [quoteTokenAddress, setQuoteTokenAddress] = useState("");
  const [baseTokenBalance, setBaseTokenBalance] = useState(0);
  const [quoteTokenBalance, setQuoteTokenBalance] = useState(0);
  const [baseTokenAmount, setBaseTokenAmount] = useState(0);
  const [quoteTokenAmount, setQuoteTokenAmount] = useState(0);
  const [launchDate, setLaunchDate] = useState("");
  const [marketaddress, setMarketAddress] = useState("");

  const [loading, setLoading] = useState<boolean>(false);

  const fetchProjects = useCallback(async () => {
    // set base token
    const pros = await getProjects();
    if (pros.success === true) {
      setProjects(
        pros.projects
          .filter((e: any) => e.proposalStatus === "LAUNCHED")
          .map((e: Project) => ({
            id: e.id,
            proposalStatus: e.proposalStatus,
            symbol: e.symbol,
            decimals: e.decimals,
            mint: e.mint,
          }))
      );
    }

    // set quote token
    const pTokens = await getPoolTokens();
    if (pros.success === true) {
      setPoolTokens(
        pTokens.pooltokens.map((e: PoolToken) => ({
          id: e.id,
          name: e.name,
          decimals: e.decimals,
          tokenMint: e.tokenMint,
        }))
      );
    }
  }, [setProjects, setPoolTokens]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      if (!marketaddress) {
        setLoading(false);
        toast.error("Market Address Invalid!");
        return;
      }

      const marketId = marketaddress;

      console.log("HANDLE CREATE POOL : ", marketId);
      const poolRes = await createAmmPool(
        wallet,
        baseTokenAddress,
        quoteTokenAddress,
        marketId,
        baseTokenAmount,
        quoteTokenAmount,
        launchDate
      );
      if (!poolRes) {
        setLoading(false);
        toast.error("Create Pool Error");
        return;
      }

      if (poolRes.status === "failed") {
        setLoading(false);
        toast.error(`Create Pool Error: ${poolRes.msg}`);
        return;
      }
      console.log("Pool Res: ", poolRes);

      const res = await createPoolApi(
        jwtToken,
        poolRes.address,
        marketId,
        baseTokenAddress,
        quoteTokenAddress,
        poolRes.lpMint,
        baseTokenAmount,
        quoteTokenAmount
      );
      if (!res.success) {
        setLoading(false);
        toast.error("Create Pool API error!");
        return;
      }

      setLoading(false);
      toast.success(`Create Pool Success! Pool Address: ${poolRes.address}`);
    } catch (err) {
      setLoading(false);
      toast.error(`Create Pool Error: ${err}`);
    }
  };

  const handleBaseTokenSelect = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    e.preventDefault();

    if (!e.target.value) {
      toast.error("Token mint address error!");
      return;
    }
    if (!wallet) {
      toast.error("Wallet connect error!");
      return;
    }
    if (!wallet.publicKey) {
      toast.error("Wallet connect error! (PublicKey)");
      return;
    }

    const baseToken = e.target.value;
    setBaseTokenAddress(baseToken);

    try {
      const baseBalance = await getBalance(wallet, baseToken);
      setBaseTokenBalance(baseBalance);
    } catch (err) {
      toast.error(`Get balance error: ${err}`);
    }
  };

  const handleQuoteTokenSelect = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    e.preventDefault();

    if (!e.target.value) {
      toast.error("Token mint address error!");
      return;
    }
    if (!wallet) {
      toast.error("Wallet connect error!");
      return;
    }
    if (!wallet.publicKey) {
      toast.error("Wallet connect error! (PublicKey)");
      return;
    }

    const quoteToken = e.target.value;
    setQuoteTokenAddress(quoteToken);

    try {
      const quoteBalance = await getBalance(wallet, quoteToken);
      setQuoteTokenBalance(quoteBalance);
    } catch (err) {
      toast.error(`Get balance error: ${err}`);
    }
  };

  return (
    <>
      <div className="min-h-screen p-4 bg-radial-gradient pt-20">
        <motion.div
          className="px-6 py-6 mx-auto border shadow-lg rounded-2xl bg-white/10 min-w-fit border-textclr2"
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.8,
            ease: "easeInOut",
            staggerChildren: 0.4,
          }}
        >
          <h1 className="text-4xl font-primaryBold text-textclr2">
            Create Liquidity Pool
          </h1>
          <p className="text-lg text-textclr2/50 font-primaryRegular text-pretty">
            Create the Liquidity Pool for your Token.
          </p>

          {/* --- Create LP form --- */}
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 mt-6 md:grid-cols-2">
              {/* --- Base Token set --- */}
              <div>
                <label className="block mb-2 text-textclr2 font-primaryBold">
                  Base Token :
                </label>
                <select
                  className="w-full p-2 border rounded-lg border-textclr2 focus:ring-2 focus:ring-textclr2 focus:outline-none"
                  id="base-token"
                  onChange={handleBaseTokenSelect}
                  defaultValue="Select Base Token"
                >
                  <option disabled>Select Base Token</option>
                  {projects.map((e) => (
                    <option value={e.mint}>{e.symbol}</option>
                  ))}
                </select>
                <p className="py-1 text-sm text-textclr2/50">
                  Select Base Token to create Liquidity Pool
                </p>
              </div>

              {/* --- Quote Token set --- */}
              <div>
                <label className="block mb-2 text-textclr2 font-primaryBold">
                  Quote Token :
                </label>
                <select
                  className="w-full p-2 border rounded-lg border-textclr2 focus:ring-2 focus:ring-textclr2 focus:outline-none"
                  id="quote-token"
                  onChange={handleQuoteTokenSelect}
                  defaultValue="Select Quote Token"
                >
                  <option disabled>Select Quote Token</option>
                  {poolTokens.map((e) => (
                    <option value={e.tokenMint}>{e.name}</option>
                  ))}
                </select>
                <p className="py-1 text-sm text-textclr2/50">
                  Select Quote Token to create Liquidity Pool
                </p>
              </div>
            </div>

            <div className="grid gap-6 my-4 mt-6 md:grid-cols-2">
              {/* --- Market ID set --- */}
              <div>
                <label className="block mb-2 text-textclr2 font-primaryBold">
                  Market ID :
                </label>

                <input
                  type="string"
                  placeholder="Input Market Address"
                  className="w-full mb-2 border input lg:mb-0 focus:ring focus:ring-textclr2 focus:outline-none border-textclr2 "
                  onChange={(e) => setMarketAddress(e.target.value)}
                />
              </div>
            </div>

            {/* --- Base Price --- */}
            <div className="flex flex-col w-full gap-4 py-4 lg:flex-row">
              <div className="grid items-center flex-grow grid-cols-1 gap-4 p-4 border border-btnbg card bg-base-300 rounded-box lg:grid-cols-3">
                <span className="px-2 py-2 text-2xl transition-colors rounded-md text-textclr font-primaryBold bg-btnbg/40 hover:bg-btnbg/70">
                  Base
                </span>
                <input
                  type="number"
                  placeholder="Base Amount"
                  className="mb-2 input lg:col-span-2 lg:mb-0"
                  onChange={(e) => setBaseTokenAmount(parseInt(e.target.value))}
                />
                <div className="flex items-center justify-between w-full lg:justify-start lg:col-span-3">
                  <span className="text-textclr2 font-primaryRegular">
                    Balance:{" "}
                    <span className="text-textclr">{baseTokenBalance}</span>
                  </span>
                </div>
              </div>
              <div className="divider lg:divider-horizontal">
                <AddIcon className="size-6" />
              </div>
              {/* --- Quote Price --- */}
              <div className="grid items-center flex-grow grid-cols-1 gap-4 p-4 border border-btnbg card bg-base-300 rounded-box lg:grid-cols-3">
                <span className="px-2 py-2 text-2xl transition-colors rounded-md text-textclr font-primaryBold bg-btnbg/40 hover:bg-btnbg/70">
                  Quote
                </span>
                <input
                  type="number"
                  placeholder="Quote Amount"
                  className="mb-2 input lg:col-span-2 lg:mb-0"
                  onChange={(e) =>
                    setQuoteTokenAmount(parseInt(e.target.value))
                  }
                />
                <div className="flex items-center justify-between w-full lg:justify-start lg:col-span-3">
                  <span className="text-textclr2 font-primaryRegular">
                    Balance:{" "}
                    <span className="text-textclr">{quoteTokenBalance}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* --- Launch Price --- */}
            <div className=" text-textclr2 font-primaryBold">
              Launch Price :
            </div>
            <span className=" text-textclr font-primaryRegular">
              {baseTokenAmount / quoteTokenAmount} Base / Quote
            </span>
            {/* --- Launch Date --- */}
            <div className="py-4 font-primaryBold text-textclr2">
              Launch Date :
              <input
                type="date"
                id="launch-date"
                value={launchDate}
                onChange={(e) => setLaunchDate(e.target.value)}
                className="block px-3 py-2 mt-1 border border-gray-200 rounded-md shadow-sm w-fit focus:outline-none focus:ring-textclr2 focus:border-textclr2 sm:text-sm"
              />
              <p className="py-1 text-sm text-textclr2/50 font-primaryRegular text-pretty">
                Select the date when you would want the LP Pool to go live.
              </p>
            </div>
            <button
              type="submit"
              className="px-4 py-2 border rounded-lg text-textclr border-textclr2 border-lg bg-btnbg/50 hover:bg-btnbg/60 hover:border-btnbg hover:text-btnbg focus:outline-none"
            >
              Create Liquidity Pool
            </button>

            {/* --- LP Calculation --- */}
            <div className="justify-center text-center text-textclr2 font-primaryRegular">
              {/* --- Dummy static Value for now --- */}
              <p className="mt-4">Adding to Liquidity Pool :</p>
              <p className="text-textclr2">
                {baseTokenAmount}
                <span className="font-primaryBold text-textclr"> Base </span>+
                {quoteTokenAmount}
                <span className="font-primaryBold text-textclr "> Quote</span>
              </p>
            </div>
          </form>
        </motion.div>
        {loading && (
          <>
            <div style={{
              position: "fixed",
              top: "0",
              left: "0",
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: "1000"
            }}>
              <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
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
        {/* --- Info Section --- */}
        <motion.div
          className="px-6 py-6 mx-auto mt-4 border shadow-2xl rounded-2xl bg-white/10 min-w-fit border-textclr2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1
            className="text-2xl font-primaryBold text-textclr2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            How to Create Liquidity Pool ?
          </motion.h1>
          <motion.div
            className="grid gap-6 md:grid-cols-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <p className="px-2 py-2 lg:text-lg sm:text-sm text-textclr2 font-primaryRegular">
              1. Connect your Solana wallet.
              <br />
              2. Select the Token Pair.
              <br />
              <span className="text-textclr2/75">
                * The Quote Token (usually SOL/USDC) will define the price of
                the Base Token (the token you created).
              </span>
              3. Input the Market ID.
              <br />
              4. Set the Starting Price.
              <br />
              5. Set the Minimum Token Quantity that users can buy.
              <br />
              6. Set the Minimum Price Change in SOL or USDC.
              <br />
              7. Specify the amount of Liquidity you want to add.
              <br />
              8. Click on "Create Liquidity Pool" & confirm the transaction.
              This process will take a few seconds depending on the network.
            </p>

            <p className="px-2 text-justify lg:text-lg sm:text-sm text-textclr/80 font-primaryRegular">
              Creating a Liquidity Pool will cost between X & XX SOL. This fee
              encompasses all necessary expenses for establishing both the
              Market (Token Pair) & the Liquidity Pool. Once you initiate the
              process, it will begin immediately and involve a series of
              transactions.
              <br />
              The entire creation process typically takes a few seconds to
              complete. Be prepared to confirm a couple of transactions to
              finalize the setup.
              <br />
              <br />
              <i className="text-sm text-justify">
                *Please note that in some cases there might be delays due to
                network congestion.
              </i>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default LPsetup;
