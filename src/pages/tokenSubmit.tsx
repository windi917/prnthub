import React, { useState, ChangeEvent, FormEvent } from "react";
import { motion } from "framer-motion";
import axios from "axios";

interface FormData {
  name: string;
  symbol: string;
  supply: string;
  decimals: number | "";
  description: string;
  tokenomics: File | null;
  logo: File | null;
}

const TokenSubmit: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    symbol: "",
    supply: "",
    decimals: "",
    description: "",
    tokenomics: null,
    logo: null,
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("symbol", formData.symbol);
    data.append("supply", formData.supply);
    data.append("decimals", formData.decimals.toString());
    data.append("description", formData.description);
    if (formData.tokenomics) {
      data.append("tokenomics", formData.tokenomics);
    }
    if (formData.logo) {
      data.append("logo", formData.logo);
    }

    try {
      const response = await axios.post("https://api.prnthub.com/token/", data);
      console.log("Success:", response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <section className="bg-radial-gradient dark:bg-bg ">
      <div className="flex justify-center min-h-screen">
        <motion.div
          className="flex items-center max-w-3xl p-8 mx-auto my-16 shadow-lg backdrop-blur-3xl rounded-box bg-white/10 lg:px-12 lg:w-3/5 md:w-1/2 md:px-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          layout
        >
          <div className="w-full">
            <h1 className="text-2xl tracking-wider capitalize font-primaryBold text-textclr2 dark:text-white">
              Submit Token
            </h1>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2"
            >
              <div>
                <label className="block mb-2 text-md font-primaryRegular text-textclr2 dark:text-slate-200">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Token Name"
                  className="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border rounded-lg placeholder-slate-400 border-slate-200 dark:placeholder-slate-600 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700 focus:border-textclr2 dark:focus:border-textclr2 focus:ring-textclr2 focus:outline-none focus:ring focus:ring-opacity-40"
                />
              </div>

              <div>
                <label className="block mb-2 text-md font-primaryRegular text-textclr2 dark:text-slate-200">
                  Symbol
                </label>
                <input
                  type="text"
                  name="symbol"
                  value={formData.symbol}
                  onChange={handleChange}
                  placeholder="Token Symbol"
                  className="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border rounded-lg placeholder-slate-400 border-slate-200 dark:placeholder-slate-600 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700 focus:border-textclr2 dark:focus:border-textclr2 focus:ring-textclr2 focus:outline-none focus:ring focus:ring-opacity-40"
                />
              </div>

              <div>
                <label className="block mb-2 text-md font-primaryRegular text-textclr2 dark:text-slate-200">
                  Supply
                </label>
                <input
                  type="text"
                  name="supply"
                  value={formData.supply}
                  onChange={handleChange}
                  placeholder="Token Supply"
                  className="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border rounded-lg placeholder-slate-400 border-slate-200 dark:placeholder-slate-600 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700 focus:border-textclr2 dark:focus:border-textclr2 focus:ring-textclr2 focus:outline-none focus:ring focus:ring-opacity-40"
                />
              </div>

              <div>
                <label className="block mb-2 text-md font-primaryRegular text-textclr2 dark:text-slate-200">
                  Decimals
                </label>
                <input
                  type="number"
                  name="decimals"
                  value={formData.decimals}
                  onChange={handleChange}
                  min="0"
                  max="9"
                  placeholder="Decimals"
                  className="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border rounded-lg placeholder-slate-400 border-slate-200 dark:placeholder-slate-600 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700 focus:border-textclr2 dark:focus:border-textclr2 focus:ring-textclr2 focus:outline-none focus:ring focus:ring-opacity-40"
                  title="Numbers only"
                />
              </div>

              <div>
                <label
                  htmlFor="Description"
                  className="block text-md text-textclr2 dark:text-white"
                >
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Description about team & project"
                  className="block mt-2 w-full rounded-lg border border-gray-200 bg-white px-4 h-32 py-2.5 text-slate-700 focus:border-textclr2 focus:outline-none focus:ring focus:ring-textclr2 focus:ring-opacity-40 dark:border-white dark:bg-gray-900 dark:text-white dark:focus:border-textclr2"
                ></textarea>
              </div>
              <div>
                <label
                  htmlFor="tokenomics"
                  className="block mb-2 text-md font-primaryRegular text-textclr2 dark:text-slate-200"
                >
                  Tokenomics
                </label>
                <label
                  htmlFor="tokenomics"
                  className="flex flex-col items-center w-full max-w-lg p-5 mx-auto mt-2 text-center bg-white border-2 border-dashed cursor-pointer border-slate-300 dark:bg-slate-900 dark:border-slate-700 rounded-xl"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-8 h-8 text-slate-500 dark:text-slate-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                    />
                  </svg>
                  <h2 className="mt-1 tracking-wide font-primaryBold text-textclr2 dark:text-slate-200">
                    Upload Tokenomics
                  </h2>
                  <p className="mt-2 text-xs tracking-wide text-slate-500 dark:text-slate-400">
                    Upload your file txt, pdf or excel.
                  </p>
                  <input
                    id="tokenomics"
                    type="file"
                    name="tokenomics"
                    onChange={handleChange}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <label
                  htmlFor="logo"
                  className="block mb-2 text-md font-primaryRegular text-textclr2 dark:text-slate-200"
                >
                  Logo
                </label>
                <label
                  htmlFor="logo"
                  className="flex flex-col items-center w-full max-w-lg p-5 mx-auto mt-2 text-center bg-white border-2 border-dashed cursor-pointer border-slate-300 dark:bg-slate-900 dark:border-slate-700 rounded-xl"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-8 h-8 text-slate-500 dark:text-slate-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                    />
                  </svg>
                  <h2 className="mt-1 tracking-wide font-primaryBold text-textclr2 dark:text-slate-200">
                    Upload Logo
                  </h2>
                  <p className="mt-2 text-xs tracking-wide text-slate-500 dark:text-slate-400">
                    Upload your file SVG, PNG, JPG or GIF.
                  </p>
                  <input
                    id="logo"
                    type="file"
                    name="logo"
                    onChange={handleChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* -- Submit Button -- */}
              <div className="flex items-center justify-center">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md btn text-slate-500 bg-textclr2/90 hover:bg-textclr2/60 focus:outline-none focus:bg-textclr2"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TokenSubmit;
