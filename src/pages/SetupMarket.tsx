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
};

interface PoolToken {
  id: number;
  name: string;
  tokenMint: string;
  decimals: number;
};

const SetupMarket = () => {
  const wallet = useWallet();
  const { jwtToken } = useContext(JwtTokenContext);

  const [projects, setProjects] = useState<Project[]>([]);
  const [poolTokens, setPoolTokens] = useState<PoolToken[]>([]);
  const [baseTokenAddress, setBaseTokenAddress] = useState('');
  const [quoteTokenAddress, setQuoteTokenAddress] = useState('');

  const [minOrderSize, setMinOrderSize] = useState(1.0);
  const [tickSize, setTickSize] = useState(0.0001);
  const [loading, setLoading] = useState<boolean>(false);

  /* --- Order & Tick size default Value configuration --- */
  const incrementOrderSize = () => {
    setMinOrderSize((prev) => prev + 1);
  };

  const decrementOrderSize = () => {
    setMinOrderSize((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const incrementTickSize = () => {
    setTickSize((prev) => parseFloat((prev + 0.0001).toFixed(10)));
  };

  const decrementTickSize = () => {
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
          .filter((e: any) => e.proposalStatus === "LAUNCHED")
          .map((e: Project) => ({
            id: e.id,
            proposalStatus: e.proposalStatus,
            symbol: e.symbol,
            decimals: e.decimals,
            mint: e.mint
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
          tokenMint: e.tokenMint
        }))
      )
    }
  }, [setProjects, setPoolTokens]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleBaseTokenSelect = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();

    if (!e.target.value) {
      toast.error('Token mint address error!');
      return;
    }
    if (!wallet) {
      toast.error('Wallet connect error!');
      return;
    }
    if (!wallet.publicKey) {
      toast.error('Wallet connect error! (PublicKey)')
      return;
    }

    const baseToken = e.target.value;
    setBaseTokenAddress(baseToken);
  };

  const handleQuoteTokenSelect = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();

    if (!e.target.value) {
      toast.error('Token mint address error!');
      return;
    }
    if (!wallet) {
      toast.error('Wallet connect error!');
      return;
    }
    if (!wallet.publicKey) {
      toast.error('Wallet connect error! (PublicKey)')
      return;
    }

    const quoteToken = e.target.value;
    setQuoteTokenAddress(quoteToken);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      const marketRes = await createOpenBookMarket(wallet, baseTokenAddress, quoteTokenAddress, minOrderSize, tickSize)
      if (!marketRes) {
        setLoading(false);
        toast.error('Create Market Error');
        return;
      }

      const res = await createMarketApi(jwtToken, marketRes.address, baseTokenAddress, quoteTokenAddress, minOrderSize, tickSize);
      if (!res.success) {
        setLoading(false);
        toast.error('Create Market API error!');
        return;
      }

      setLoading(false);
      toast.success('Create Market Success!');
    } catch (err) {
      setLoading(false);
      toast.error(`Create Market Error: ${err}`);
    }
  }
  return (
    <>
      <div className="min-h-screen p-4 bg-radial-gradient">
        <motion.div
          className="px-6 py-6 mx-auto border shadow-lg rounded-2xl bg-white/10 min-w-fit border-textclr2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-primaryBold text-textclr2">
            Create OpenBook Market
          </h1>
          <p className="text-lg text-textclr2/50 font-primaryRegular">
            Create your Openbook Market.
          </p>
        </motion.div>

        {/* --- Setup Market form --- */}
        <form onSubmit={handleSubmit}>
          <motion.div
            className="px-6 py-6 mx-auto mt-4 border shadow-lg rounded-2xl bg-white/10 min-w-fit border-textclr2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
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
                  {projects.map((e) => <option value={e.mint}>{e.symbol}</option>)}
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
                  {poolTokens.map((e) => <option value={e.tokenMint}>{e.name}</option>)}
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
                      className="w-full md:w-[32rem] p-2 lg:text-3xl sm:text-sm bg-transparent border border-transparent text-center"
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
                      className="w-full md:w-[32rem] p-2 lg:text-3xl sm:text-sm bg-transparent border border-transparent text-center"
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
        )}
      </div>
    </>
  );
};

export default SetupMarket;
