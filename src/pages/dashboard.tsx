import { useState, useContext, useCallback, useEffect } from "react";
import * as React from "react";
import { motion } from "framer-motion";
import Modal from "../components/Modal";
// import EditModal from "../components/TokenRegisterModal";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PollIcon from "@mui/icons-material/Poll";
import BallotIcon from "@mui/icons-material/Ballot";
import RemoveCircleOutlineRoundedIcon from "@mui/icons-material/RemoveCircleOutlineRounded";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import ApprovalIcon from "@mui/icons-material/Approval";
import Box from "@mui/material/Box";

import { toast } from "react-toastify";
import { checkMintAddress, getDecimals } from "../utils/WebIntegration";
import { createTokenPair, createVToken, createVotePeriod } from "../api/apis";
import { JwtTokenContext } from "../contexts/JWTTokenProvider";
import { getProjects, getPeriods, setTokenStatus } from "../api/apis";

interface Token {
  id: number;
  name: string;
  weight: number;
  minVoteAmount: number;
}

interface Project {
  id: number,
  periodId: number,
  logoURL: string,
  name: string,
  proposalDesc: string,
  socials: ["https://twitter.com/", "https://google.com/"],
  proposalStatus: string,
  startAt: string,
  endAt: string,
  currentVotePower: number,
  threshold: number
};

const Dashboard = () => {
  const [projectId, setProjectId] = useState<number>(0);
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [passScore, setPassScore] = useState<number>(0);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [vTokenMintAddress, setVTokenMintAddress] = useState<string>("");
  const [vTokenName, setVTokenName] = useState<string>("");

  const { jwtToken } = useContext(JwtTokenContext);

  // const [isEditTokenModalOpen, setIsEditTokenModalOpen] =
  //   useState<boolean>(false);

  const [projects, setProjects] = useState<Project[]>([]);

  const fetchProjects = useCallback(async () => {
    const pros = await getProjects();
    const periods = await getPeriods();

    if (pros.success === true && periods.success === true ) {
      setProjects(pros.projects.map((e: Project) => {
        const period = periods.periods.filter((item: any) => (item.id === e.periodId));
        if ( !period )
          return null;

        return {
          id: e.id,
          logoURL: e.logoURL,
          name: e.name,
          proposalDesc: e.proposalDesc,
          proposalStatus: e.proposalStatus,
          socials: ["https://twitter.com/", "https://google.com/"],
          startAt: period[0].startAt,
          endAt: period[0].endAt,
          currentVotePower: e.currentVotePower,
          threshold: period[0].votePowerLimit
        }
      }))
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to handle form submission

    console.log("@@@@@@@@@@@@@@@", projectId, fromDate, toDate, tokens, passScore)

    const response = await createVotePeriod(jwtToken, projectId, fromDate, toDate, "", passScore);
    if (response.success == false) {
      toast.error("Create Vote Period error!");
      return;
    }

    if ( !response.period )
      return;

    const period = response.period;
    for (let i = 0; i < tokens.length; i++) {

      const res = await createTokenPair(jwtToken, period.id, tokens[i].id, tokens[i].weight, tokens[i].minVoteAmount);
      if (res.success == false) {
        toast.error("Create TokenPair error!");
        return;
      }
    }

    toast.success("Create Vote Period success!");
    fetchProjects();
  };

  const handleApprove = async (tokenId: number) => {
    const res = await setTokenStatus(jwtToken, tokenId, "APPROVED");
    if ( res.success == false) {
      toast.error("Approve token failed!");
      return;
    }

    toast.success("Approve token Success!");
    fetchProjects();
  };

  const handleReject = async (tokenId: number) => {
    const res = await setTokenStatus(jwtToken, tokenId, "DECLINED");
    if ( res.success == false) {
      toast.error("Reject token failed!");
    }

    toast.success("Reject token Success!");
    fetchProjects();
  };

  const handleProjectSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    setProjectId(parseInt(e.target.value));
  }

  const handleTokenRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const mintValid = await checkMintAddress(vTokenMintAddress);
    if (mintValid.success === false) { // valid mint
      toast.error("Mint Address is invalid!");
      return;
    }

    const res = await getDecimals(vTokenMintAddress);
    if (res.success == false) {
      toast.error("Get Decimals error!");
      return;
    }

    const response = await createVToken(jwtToken, vTokenName, vTokenMintAddress, res.decimals);
    if (response.success == false) {
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

  // const openEditTokenModal = () => {
  //   setIsEditTokenModalOpen(true);
  // };

  // const closeEditTokenModal = () => {
  //   setIsEditTokenModalOpen(false);
  // };

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
            icon={<ApprovalIcon />}
            label="Approvals"
            aria-label="Approvals List"
          />
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

        {/* --- Approvals Container --- */}
        {value === 0 && (
          <motion.div
            className="flex flex-col justify-center w-full max-w-6xl p-8 mx-auto mt-1 overflow-x-auto shadow-md rounded-box bg-white/10 backdrop-blur-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            layout
          >
            <h2 className="mb-4 text-4xl text-center font-primaryBold text-textclr2">
              Approvals
            </h2>

            {/* Table Component */}
            <table className="table w-full text-textclr2">
              <thead>
                <tr className="text-2xl font-primaryRegular text-textclr2">
                  <th className="px-4 py-2">No</th>
                  <th className="px-4 py-2">Project Name</th>
                  <th className="px-4 py-2">Description</th>
                  <th className="px-4 py-2">Vote Create</th>
                </tr>
              </thead>
              <tbody className="font-primaryRegular">
                {projects.map((project, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{project.name}</td>

                    <td className="px-4 py-2 break-words">
                      {project.proposalDesc}
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => setValue(1)}
                        className="text-white rounded-md shadow-sm btn bg-textclr2/70 font-primaryRegular hover:bg-textclr2/30 btn-sm"
                      >
                        Create Vote
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}

        {/* --- Vote Config Container --- */}
        {value === 1 && (
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
            <select
              className="w-full max-w-2xl select-md select select-ghost !bg-slate-500/60 !border !border-textclr2"
              onChange={handleProjectSelect}
              defaultValue="Select Project"
            >
              <option disabled>Select Project</option>
              {projects.map((e) => {
                if ( e.proposalStatus === "PENDING" )
                  return <option value={e.id}>{e.name}</option>;
                return null;
              })}
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
        {value === 2 && (
          <motion.div
            className="flex flex-col justify-center w-full max-w-6xl p-8 pt-8 mx-auto shadow-md max-h-2xl rounded-box bg-white/10 backdrop-blur-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            layout
          >
            <h2 className="mb-4 text-4xl text-center font-primaryBold text-textclr2">
              Applications
            </h2>
            {/* <h2 className="mb-4 text-2xl text-left font-primaryBold text-textclr2"> */}
              {/* Vote 1 */}
            {/* </h2> */}
            {/* Table Component */}
            <div className="overflow-x-auto">
              <table className="table text-textclr2">
                <thead>
                  <tr className="text-2xl font-primaryRegular text-textclr2">
                    <th>No</th>
                    <th>Token Name</th>
                    <th>Description</th>
                    <th>Threshold</th>
                    <th>Vote Power</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody className="font-primaryRegular">
                  {projects.filter((e) => {
                    if ( new Date(e.endAt) < new Date() )
                      return true;
                    return false;
                  }).map((project, index) => (
                    <tr>
                      {/* id change as needed */}
                      <td>{index + 1}</td>
                      <td>{project.name}</td>
                      <td>{project.proposalDesc}</td> {/* Description change as needed */}
                      <td>{project.threshold}</td>
                      <td>{project.currentVotePower}</td>
                      <td>{project.proposalStatus}</td>
                      <td className="px-4 py-2 space-x-2 space-y-2">
                        <button 
                          className="text-white rounded-md shadow-sm bg-green-500/40 btn font-primaryRegular hover:bg-green-400/20 btn-sm" 
                          onClick={() => handleApprove(project.id)}
                          disabled={project.proposalStatus === "APPROVED" ? true : false}
                        >
                          Approve
                        </button>
                        <button 
                          className="text-white rounded-md shadow-sm btn bg-red-500/40 font-primaryRegular hover:bg-red-500/20 btn-sm" 
                          onClick={() => handleReject(project.id)}
                          disabled={project.proposalStatus === "DECLINED" ? true : false}
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
        {/* --- Token Reg Container --- */}
        {value === 3 && (
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
