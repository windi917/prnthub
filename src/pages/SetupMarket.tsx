import { motion } from "framer-motion";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useState, useEffect, useContext, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { toast } from "react-toastify";
import { Oval } from "react-loader-spinner";

import { JwtTokenContext } from "../contexts/JWTTokenProvider";
import { createOpenBookMarket } from "../utils/WebIntegration";
import { getProjects, getPoolTokens, createMarketApi } from "../api/apis";

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

const SetupMarket = () => {
  const wallet = useWallet();
  const { jwtToken, userId } = useContext(JwtTokenContext);

  const [projects, setProjects] = useState<Project[]>([]);
  const [poolTokens, setPoolTokens] = useState<PoolToken[]>([]);
  const [baseTokenAddress, setBaseTokenAddress] = useState("");
  const [quoteTokenAddress, setQuoteTokenAddress] = useState("");
  const [eventQueueLength, setEventQueueLength] = useState(11308);
  const [requestQueueLength, setRequestQueueLength] = useState(764);
  const [orderbookLength, setOrderBookLength] = useState(14524);

  const [minOrderSize, setMinOrderSize] = useState(1.0);
  const [tickSize, setTickSize] = useState(0.0001);
  const [loading, setLoading] = useState<boolean>(false);

  /* --- Order & Tick size default Value configuration --- */
  const incrementOrderSize = (e: React.FormEvent) => {
    e.preventDefault();
    setMinOrderSize((prev) => prev + 1);
  };

  const decrementOrderSize = (e: React.FormEvent) => {
    e.preventDefault();
    setMinOrderSize((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const incrementTickSize = (e: React.FormEvent) => {
    e.preventDefault();
    setTickSize((prev) => parseFloat((prev + 0.0001).toFixed(10)));
  };

  const decrementTickSize = (e: React.FormEvent) => {
    e.preventDefault();
    setTickSize((prev) =>
      prev > 0.0001 ? parseFloat((prev - 0.0001).toFixed(10)) : 0
    );
  };

  const fetchProjects = useCallback(async () => {
    // set base token
    const pros = await getProjects();
    if (pros.success === true) {
      setProjects(
        pros.projects
          .filter((e: any) => e.owner === userId && e.proposalStatus === "LAUNCHED")
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
  };

  const handleOpenBookMarket = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    e.preventDefault();

    if (parseInt(e.target.value) === 0) {
      setEventQueueLength(11308);
      setRequestQueueLength(764);
      setOrderBookLength(14524);
    } else if (parseInt(e.target.value) === 1) {
      setEventQueueLength(123244);
      setRequestQueueLength(5084);
      setOrderBookLength(32452);
    } else {
      setEventQueueLength(262108);
      setRequestQueueLength(5084);
      setOrderBookLength(65500);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      const marketRes = await createOpenBookMarket(
        wallet,
        baseTokenAddress,
        quoteTokenAddress,
        minOrderSize,
        tickSize,
        eventQueueLength,
        requestQueueLength,
        orderbookLength
      ); // 2.8SOL
      if (marketRes.status === "failed" || !marketRes.address) {
        setLoading(false);
        toast.error("Create Market Error");
        return;
      }

      const res = await createMarketApi(
        jwtToken,
        marketRes.address,
        baseTokenAddress,
        quoteTokenAddress,
        minOrderSize,
        tickSize
      );
      if (!res.success) {
        setLoading(false);
        toast.error("Create Market API error!");
        return;
      }

      setLoading(false);
      toast.success(`Create Market Success! Market ID = ${marketRes.address}`);
    } catch (err) {
      setLoading(false);
      toast.error(`Create Market Error: ${err}`);
    }
  };
  return (
    <>
      <div className="min-h-screen p-4 bg-radial-gradient pt-20">
        <motion.div
          className="px-6 py-6 mx-auto border shadow-lg rounded-2xl bg-white/10 min-w-fit border-textclr2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl leading-7 font-primaryBold text-textclr2">
            Create OpenBook Market
          </h1>
          <p className="text-lg text-textclr2/50 font-primaryRegular">
            Create your Openbook Market for your Token
          </p>
        </motion.div>

        {/* --- Setup Market form --- */}
        <form onSubmit={handleSubmit}>
          <motion.div
            className="px-6 py-6 mx-auto mt-4 border shadow-lg rounded-2xl bg-white/10 min-w-fit border-textclr2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h1 className="text-2xl font-primaryBold text-textclr2">
              Set Token Pair
            </h1>
            {/* --- Input Base & Quote token --- */}
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
              </div>
            </div>

            {/* --- Order & Tick size --- */}
            <div className="flex flex-col w-full pt-4 lg:flex-row">
              <label className="block w-full py-2 mb-2 text-textclr2 font-primaryBold">
                Min Order Size (Minimum Buy):
                <div className="grid flex-grow h-32 mt-4 bg-transparent border border-btnbg card rounded-box place-items-center">
                  <div className="flex flex-row items-center">
                    <button
                      className="p-2 ml-6 mr-6 text-white transform border rounded-lg border-btnbg bg-btnbg/50 hover:bg-btnbg/60 hover:border-btnbg focus:outline-none focus:ring-2 focus:ring-btnbg focus:ring-opacity-80"
                      onClick={decrementOrderSize}
                    >
                      <RemoveIcon />
                    </button>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      placeholder="0"
                      value={minOrderSize}
                      readOnly
                      className="w-full md:w-[32rem] p-2 font-mono lg:text-3xl sm:text-sm bg-transparent border border-transparent text-center"
                    />
                    <button
                      className="p-2 ml-6 mr-6 text-white transform border rounded-lg border-btnbg bg-btnbg/50 hover:bg-btnbg/60 hover:border-btnbg focus:outline-none focus:ring-2 focus:ring-btnbg focus:ring-opacity-80"
                      onClick={incrementOrderSize}
                    >
                      <AddIcon />
                    </button>
                  </div>
                </div>
              </label>
              <div className="divider lg:divider-horizontal"></div>
              <label className="block w-full py-2 mb-2 text-textclr2 font-primaryBold">
                Tick Size (Minimum Price Change):
                <div className="grid flex-grow h-32 mt-4 bg-transparent border border-btnbg card rounded-box place-items-center">
                  <div className="flex flex-row items-center ">
                    <button
                      className="p-2 ml-6 text-white transform border rounded-lg border-btnbg bg-btnbg/50 hover:bg-btnbg/60 hover:border-btnbg focus:outline-none focus:ring-2 focus:ring-btnbg focus:ring-opacity-80"
                      onClick={decrementTickSize}
                    >
                      <RemoveIcon />
                    </button>
                    <input
                      type="number"
                      min="0"
                      step="0.0001"
                      value={tickSize.toFixed(4)}
                      readOnly
                      className="w-full md:w-[32rem] p-2 font-mono lg:text-3xl sm:text-sm bg-transparent border border-transparent text-center"
                    />
                    <button
                      className="p-2 mx-6 text-white transform border rounded-lg border-btnbg bg-btnbg/50 hover:bg-btnbg/60 hover:border-btnbg focus:outline-none focus:ring-2 focus:ring-btnbg focus:ring-opacity-80"
                      onClick={incrementTickSize}
                    >
                      <AddIcon />
                    </button>
                  </div>
                </div>
              </label>
            </div>
            {/* --- Advance Option --- */}
            <div className="my-6">
              <label className="block my-4 text-textclr2 font-primaryBold">
                Advanced Option :
              </label>
              <select
                className="w-full p-2 border rounded-lg border-textclr2 focus:ring-2 focus:ring-textclr2 focus:outline-none"
                id="quote-token"
                onChange={handleOpenBookMarket}
                defaultValue="Select Quote Token"
              >
                <option disabled>Select a standard OpenBook Market</option>
                <option value={0}>0.4 SOL</option>
                <option value={1}>1.5 SOL</option>
                <option value={2}>2.8 SOL</option>
              </select>
            </div>
            <div className="justify-center mt-4 text-center">
              <button
                type="submit"
                className="px-4 py-2 border rounded-lg text-textclr border-textclr2 border-lg bg-btnbg/50 hover:bg-btnbg/60 hover:border-btnbg hover:text-btnbg focus:outline-none"
              >
                Create Market
              </button>
            </div>
          </motion.div>
        </form>
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
            How to Create OpenBook Market ?
          </motion.h1>
          <motion.div
            className="grid gap-6 md:grid-cols-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <p className="px-2 py-2 lg:text-lg sm:text-sm text-textclr/80 font-primaryRegular">
              1. Connect your Solana wallet.
              <br />
              2. Select the Base Token.
              <br />
              3. Select the Quote Token.
              <br />
              4. Set the Minimum Buy (Minimum Order Size).
              <br />
              5. Set the Minimum Price Change (Price Tick).
              <br />
              6. Click on Create Market.
              <br />
              7. Accept the transaction and wait until your Market is ready.
            </p>

            <p className="px-2 text-justify lg:text-lg sm:text-sm text-textclr/80 font-primaryRegular">
              The cost of creating a Market ID is XX SOL, which includes a base
              fee plus additional storage costs starting at XX SOL. Once you
              initiate the creation process, it will take a few seconds to
              complete. After the process is finished, your Market ID will be
              displayed. It's important to copy and save this Market ID, as
              you'll need it to create your Liquidity Pool.
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

export default SetupMarket;
