import { useState, useContext } from "react";
import * as React from "react";
import { motion } from "framer-motion";
import Modal from "../components/Modal";
import EditModal from "../components/TokenRegisterModal";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PollIcon from "@mui/icons-material/Poll";
import BallotIcon from "@mui/icons-material/Ballot";
import RemoveCircleOutlineRoundedIcon from "@mui/icons-material/RemoveCircleOutlineRounded";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import Box from "@mui/material/Box";

import { toast } from "react-toastify";
import { checkMintAddress, getDecimals } from "../utils/WebIntegration";
import { createVToken  } from "../api/apis";
import { JwtTokenContext } from "../contexts/JWTTokenProvider";

interface Token {
  name: string;
  weight: number;
  minVoteAmount: string;
}

const Dashboard = () => {
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [passScore, setPassScore] = useState<number>(0);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [vTokenMintAddress, setVTokenMintAddress] = useState<string>("");
  const [vTokenName, setVTokenName] = useState<string>("");

  const { jwtToken } = useContext(JwtTokenContext);

  const [isEditTokenModalOpen, setIsEditTokenModalOpen] =
    useState<boolean>(false);

  // Example fetch function for API
  // const fetchData = async () => {
    // const response = await fetch("https://api.example.com/tokens"); // API endpoint
    // const data = await response.json();
    // setTokens(data);
  // };
  // fetchData();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to handle form submission
    
  };

  const handleTokenRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const mintValid = await checkMintAddress(vTokenMintAddress);
    if ( mintValid.success === false ) { // valid mint
      toast.error("Mint Address is invalid!");
      return;
    }

    const res = await getDecimals(vTokenMintAddress);
    if ( res.success == false ) {
      toast.error("Get Decimals error!");
      return;
    }

    const response = await createVToken(jwtToken, vTokenName, vTokenMintAddress, res.decimals);
    if ( response.success == false ) {
      toast.error("Create Vote Token error!");
      return;
    }
  };

  const addToken = (token: Token) => {
    setTokens([...tokens, token]);
  };
  const deleteTokens = () => {
    setTokens([]);
  };
  const [value, setValue] = React.useState(0);
  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const handleDeleteToken = (index: number) => {
    const newTokens = tokens.filter((_, i) => i !== index);
    setTokens(newTokens);
  };

  const openEditTokenModal = () => {
    setIsEditTokenModalOpen(true);
  };

  const closeEditTokenModal = () => {
    setIsEditTokenModalOpen(false);
  };

  return (
    <motion.div className="flex min-h-screen p-4 bg-radial-gradient">
      <Box className="w-full">
        <Tabs
          value={value}
          onChange={handleChange}
          centered
          sx={{
            "& .MuiTab-root": {
              color: "#CCF869 !important",
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#CCF869 !important", // indicator color
            },
          }}
        >
          <Tab
            icon={<PollIcon />}
            label="Create Vote"
            aria-label="Create Vote"
          ></Tab>
          <Tab
            icon={<BallotIcon />}
            label="Applications"
            aria-label="Applications"
          />
          <Tab
            icon={<AppRegistrationIcon />}
            label="Register"
            aria-label="Token Register"
          />
        </Tabs>

        {/* --- Vote Config Container --- */}
        {value === 0 && (
          <motion.div
            className="flex flex-col justify-center w-full max-w-2xl p-8 mx-auto mt-1 overflow-x-auto shadow-md rounded-box bg-white/10 backdrop-blur-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            layout
          >
            <h2 className="mb-4 text-4xl text-center font-primaryBold text-textclr2">
              Vote Creation
            </h2>
            <h2 className="mb-4 text-2xl text-left font-primaryBold text-textclr2">
              Project Name
            </h2>
            <select className="w-full max-w-2xl select-md select select-ghost !bg-slate-500/60 !border !border-textclr2">
              <option disabled selected>
                Select Project
              </option>
              <option>PRNT</option> {/* Hardcodes values */}
              <option>SLERF</option>
              <option>SOL</option>
              <option>WIF</option>
              <option>JUP</option>
            </select>
            <h2 className="my-4 mb-4 text-2xl text-left font-primaryBold text-textclr2">
              Period
            </h2>
            <div className="flex flex-col mb-4 space-y-4 md:flex-row md:space-y-0 md:space-x-4">
              <div className="flex-1">
                <label
                  htmlFor="from-date"
                  className="block font-primaryRegular text-textclr2"
                >
                  From:
                </label>
                <input
                  type="date"
                  id="from-date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-textclr2 focus:border-textclr2 sm:text-sm"
                />
              </div>
              <div className="flex-1 my-2">
                <label
                  htmlFor="to-date"
                  className="block font-primaryRegular text-textclr2 hover:!text-textclr2"
                >
                  To:
                </label>
                <input
                  type="date"
                  id="to-date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-textclr2 focus:border-textclr2 sm:text-sm"
                />
              </div>
            </div>
            <h2 className="mb-4 text-2xl text-left font-primaryBold text-textclr2">
              Voting Tokens
            </h2>
            {tokens.map((token, index) => (
              <div
                key={index}
                className="flex items-center mb-4 space-x-2 md:space-x-4"
              >
                <div className="flex-1">
                  <label className="block text-sm text-textclr2 font-primaryRegular md:text-base">
                    Token
                  </label>
                  <div className="block w-full px-2 py-1 mt-1 text-sm border border-gray-300 rounded-md shadow-sm md:px-3 md:py-2 md:text-base">
                    {token.name}
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-textclr2 font-primaryRegular md:text-base">
                    Weight
                  </label>
                  <div className="block w-full px-2 py-1 mt-1 text-sm border border-gray-300 rounded-md shadow-sm md:px-3 md:py-2 md:text-base">
                    {token.weight}
                  </div>
                </div>
                <div className="flex items-center flex-1">
                  <div className="flex-1">
                    <label className="block text-sm text-textclr2 font-primaryRegular md:text-base">
                      Minimum Vote
                    </label>
                    <div className="block w-full px-2 py-1 mt-1 text-sm border border-gray-300 rounded-md shadow-sm md:px-3 md:py-2 md:text-base">
                      {token.minVoteAmount}
                    </div>
                  </div>
                  <RemoveCircleOutlineRoundedIcon
                    style={{ color: "#ccf769", marginTop: "25px" }}
                    className="ml-2 cursor-pointer"
                    onClick={() => handleDeleteToken(index)}
                  />
                </div>
              </div>
            ))}
            <button
              onClick={() => setIsModalOpen(true)}
              className="block py-2 mx-auto mt-4 text-white rounded-md shadow-sm px-7 bg-textclr2/45 font-primaryRegular hover:bg-textclr2/30 sm:w-1/2 lg:w-1/3"
            >
              Add Token
            </button>
            {isModalOpen && (
              <Modal
                closeModal={() => setIsModalOpen(false)}
                addToken={addToken}
              />
            )}
            <button
              onClick={deleteTokens}
              className="block px-5 py-2 mx-auto mt-4 text-white rounded-md shadow-sm bg-textclr2/45 font-primaryRegular hover:bg-textclr2/30 sm:w-1/2 lg:w-1/3"
            >
              Delete All
            </button>
            <h2 className="my-3 text-2xl text-left font-primaryBold text-textclr2">
              Vote Threshold
            </h2>
            <input
              type="number"
              placeholder="Enter Score"
              value={passScore}
              onChange={(e) => setPassScore(parseInt(e.target.value))}
              className="block mt-2 w-full placeholder-slate-200/70 dark:placeholder-gray-500 rounded-lg border border-textclr2 bg-slate-500/60 px-5 py-2.5 text-slate-200/70 focus:border-textclr2 focus:outline-none focus:ring focus:ring-textclr2 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-textclr2"
            />
            <button
              type="submit"
              onClick={handleSubmit}
              className="block w-3/6 px-4 py-2 mx-auto mt-4 rounded-md shadow-sm text-slate-700/75 bg-textclr2 font-primaryRegular hover:bg-textclr2/70"
            >
              Create
            </button>
          </motion.div>
        )}

        {/* --- Applications Container --- */}
        {value === 1 && (
          <motion.div
            className="flex flex-col justify-center w-full max-w-3xl p-8 pt-8 mx-auto shadow-md max-h-2xl rounded-box bg-white/10 backdrop-blur-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            layout
          >
            <h2 className="mb-4 text-4xl text-center font-primaryBold text-textclr2">
              Applications
            </h2>
            <h2 className="mb-4 text-2xl text-left font-primaryBold text-textclr2">
              Vote 1
            </h2>
            {/* Table Component */}
            <div className="overflow-x-auto">
              <table className="table text-textclr2">
                <thead>
                  <tr className="text-2xl font-primaryBold text-textclr2">
                    <th>No</th>
                    <th>Token Name</th>
                    <th>Description</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody className="font-primaryRegular">
                  {tokens.map((token, index) => (
                    <tr>
                      {/* id change as needed */}
                      <td>{index + 1}</td>
                      <td>{token.name}</td>
                      <td>{token.name}</td> {/* Description change as needed */}
                      <td>
                        <button className="text-white rounded-md shadow-sm btn bg-textclr2/70 font-primaryRegular hover:bg-textclr2/30 btn-sm ">
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <h2 className="pt-12 mb-4 text-2xl text-left font-primaryBold text-textclr2">
                Vote 2
              </h2>
              {/* Table Component */}
              <div className="overflow-x-auto">
                <table className="table text-textclr2">
                  <thead>
                    <tr className="text-2xl font-primaryBold text-textclr2">
                      <th>No</th>
                      <th>Token Name</th>
                      <th>Description</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody className="font-primaryRegular">
                    {tokens.map((token, index) => (
                      <tr>
                        {/* id change as needed */}
                        <td>{index + 1}</td>
                        <td>{token.name}</td>
                        <td>{token.name}</td>{" "}
                        {/* Description change as needed */}
                        <td>
                          <button
                            onClick={() => openEditTokenModal()}
                            className="text-white rounded-md shadow-sm btn bg-textclr2/70 font-primaryRegular hover:bg-textclr2/30 btn-sm"
                          >
                            Edit
                          </button>
                          {isEditTokenModalOpen && (
                            <EditModal
                              isOpen={isEditTokenModalOpen}
                              onClose={closeEditTokenModal}
                            />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
        {/* --- Token Reg Container --- */}
        {value === 2 && (
          <motion.div
            className="flex flex-col justify-center w-full max-w-xl p-8 mx-auto mt-4 shadow-md rounded-box bg-white/10 backdrop-blur-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            layout
          >
            <h2 className="mb-4 text-4xl text-center font-primaryBold text-textclr2">
              Token Register
            </h2>
            <h2 className="mb-4 text-2xl text-left font-primaryRegular text-textclr2">
              Mint Address
            </h2>
            <input
              type="text"
              placeholder="Enter Wallet Address"
              value={vTokenMintAddress}
              onChange={(e) => setVTokenMintAddress(e.target.value)}
              className="block mt-2 w-full placeholder-gray-400/70 dark:placeholder-gray-500 rounded-lg border border-textclr2 bg-white px-5 py-2.5 text-gray-700 focus:border-textclr2 focus:outline-none focus:ring focus:ring-textclr2 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-textclr2"
            />
            <h2 className="my-4 mb-4 text-2xl text-left font-primaryRegular text-textclr2">
              Token Name
            </h2>
            <input
              type="text"
              placeholder="Enter Token Name"
              value={vTokenName}
              onChange={(e) => setVTokenName(e.target.value)}
              className="block w-full placeholder-gray-400/70 dark:placeholder-gray-500 rounded-lg border border-textclr2 bg-white px-5 py-2.5 text-gray-700 focus:border-textclr2 focus:outline-none focus:ring focus:ring-textclr2 focus:ring-opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-textclr2"
            />
            <button
              type="submit"
              onClick={handleTokenRegister}
              className="block w-3/6 px-4 py-2 mx-auto mt-4 rounded-md shadow-sm text-slate-700/75 bg-textclr2 font-primaryRegular hover:bg-textclr2/70"
            >
              Add
            </button>
          </motion.div>
        )}
      </Box>
    </motion.div>
  );
};

export default Dashboard;
