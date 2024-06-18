import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const TokenSetup = () => {
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
            Token Setup
          </h1>
          <p className="text-lg text-textclr2/50 font-primaryRegular">
            Setup a token presale.
          </p>
        </motion.div>
        <motion.div
          className="px-6 py-6 mx-auto mt-4 border shadow-lg rounded-2xl bg-white/10 min-w-fit border-textclr2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h1 className="text-2xl font-primaryBold text-textclr2">
            Create Token Presale
          </h1>
          <div className="p-6 mx-auto rounded-lg shadow-2xl bg font-primaryRegular">
            <form>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label
                    className="block mb-2 text-textclr2 font-primaryBold"
                    htmlFor="sale-token"
                  >
                    Sale Token :
                  </label>
                  <input
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-textclr2 focus:outline-none"
                    type="text"
                    id="sale-token"
                    placeholder="Enter Sale Token"
                  />
                  <Link
                    to="/MyVote"
                    className="inline-block mt-1 text-sm text-textclr2"
                  >
                    Don't have a token ? Submit it here
                  </Link>
                </div>

                <div>
                  <label
                    className="block mb-2 text-textclr2 font-primaryBold"
                    htmlFor="payment-currency"
                  >
                    Payment Currency :
                  </label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-textclr2 focus:outline-none"
                    id="payment-currency"
                  >
                    <option value="SOL">SOL</option>
                    <option value="SOL">USDT</option>
                    <option value="SOL">USDC</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-6 mt-6 md:grid-cols-2">
                <div>
                  <label
                    className="block mb-2 text-textclr2 font-primaryBold"
                    htmlFor="sale-price"
                  >
                    Sale Price :
                  </label>
                  <input
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-textclr2 focus:outline-none"
                    type="text"
                    id="sale-price"
                    placeholder="Set token price for presale"
                  />
                </div>

                <div>
                  <label
                    className="block mb-2 text-textclr2 font-primaryBold"
                    htmlFor="lp-launch-price"
                  >
                    LP Launch Price :
                  </label>
                  <input
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-textclr2 focus:outline-none"
                    type="text"
                    id="lp-launch-price"
                    placeholder="Set token price for Liquidity pool"
                  />
                </div>
              </div>

              <div className="grid gap-6 mt-6 md:grid-cols-2">
                <div>
                  <label
                    className="block mb-2 text-textclr2 font-primaryBold"
                    htmlFor="minimum-buy"
                  >
                    Minimum Buy (SOL) :
                  </label>
                  <input
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-textclr2 focus:outline-none"
                    type="number"
                    id="minimum-buy"
                    defaultValue="0"
                  />
                  <p className="text-sm text-textclr2">
                    Minimum SOL quantity that user can buy
                  </p>
                </div>

                <div>
                  <label
                    className="block mb-2 text-textclr2 font-primaryBold"
                    htmlFor="maximum-buy"
                  >
                    Maximum Buy (SOL) :
                  </label>
                  <input
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-textclr2 focus:outline-none"
                    type="number"
                    id="maximum-buy"
                    defaultValue="0"
                  />
                  <p className="text-sm text-textclr2">
                    Maximum SOL quantity that user can buy
                  </p>
                </div>
              </div>

              <div className="grid gap-6 mt-6 md:grid-cols-2">
                <div>
                  <label
                    className="block mb-2 text-textclr2 font-primaryBold"
                    htmlFor="softcap"
                  >
                    Softcap (SOL) :
                  </label>
                  <input
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-textclr2 focus:outline-none"
                    type="number"
                    id="softcap"
                    defaultValue="0"
                  />
                  <p className="text-sm text-textclr2">
                    Softcap for minimum amount of SOL to raise
                  </p>
                </div>

                <div>
                  <label
                    className="block mb-2 text-textclr2 font-primaryBold"
                    htmlFor="hardcap"
                  >
                    Hardcap (SOL) :
                  </label>
                  <input
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-textclr2 focus:outline-none"
                    type="number"
                    id="hardcap"
                    defaultValue="0"
                  />
                  <p className="text-sm text-textclr2">
                    Hardcap for maximum amount of SOL to raise
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-textclr2 font-primaryBold">
                  Sending Tokens :
                </p>
                <span className="text-textclr">0.00 Tokens</span>
                <p className="text-textclr2 font-primaryBold"> Sale Rate :</p>
                <span className="text-textclr">0.00 Tokens/SOL</span>
                <p className="mt-2 text-center text-textclr2">
                  <span className="font-primaryBold"> Prnthub Fee : </span>
                  <span className="text-textclr">2.5%</span>
                  <p className="mt-1 text-center text-textclr2">
                    <span className="font-primaryBold"> Total Fees : </span>
                    <span className="text-textclr"> 0.1 SOL</span>
                  </p>
                </p>
                <button
                  type="submit"
                  className="px-4 py-2 text-black rounded-lg border-lg bg-btnbg hover:bg-btnbg/60 border-textclr2 font-primaryRegular hover:border-btnbg hover:text-btnbg focus:outline-none focus:bg-btnbg/10 focus:border-btnbg/10"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default TokenSetup;
