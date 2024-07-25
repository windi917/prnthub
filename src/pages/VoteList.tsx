import { useState, useEffect } from "react";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import EventIcon from "@mui/icons-material/Event";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import TokenCard from "../components/TokenCard";
import { Drawer } from "vaul";
import { getPeriods, getProjects, getTokenPairs } from "../api/apis";
import { motion } from "framer-motion";
import Modal from "../components/ModalVote";

interface TokenPair {
  id: number;
  periodId: number;
  voteTokenId: number;
  weight: number;
  minimumCount: number;
}

interface Project {
  id: number;
  periodId: number;
  logoURL: string;
  name: string;
  proposalDesc: string;
  socials: [];
  proposalStatus: string;
  startAt: string;
  endAt: string;
  currentVotePower: number;
  vTokens: TokenPair[];
}

const VoteList = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [sortOrder, setSortOrder] = useState("all");

  const [showModal, setShowModal] = useState(false);
  const [_approveShowModal, setApproveShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(0);
  const [votePower, setVotePower] = useState(0);

  useEffect(() => {
    const fetchProjects = async () => {
      const pros = await getProjects();
      const periods = await getPeriods();
      const tokenPairs = await getTokenPairs();

      if (
        pros.success === true &&
        periods.success === true &&
        tokenPairs.success === true
      ) {
        setProjects(
          pros.projects
            .filter((e: any) => e.proposalStatus !== "DECLINED")
            .map((e: any) => {
              const period = periods.periods.filter(
                (item: any) => item.id === e.periodId
              );

              if (!period) return null;
              return {
                id: e.id,
                logoURL: e.logoURL,
                name: e.name,
                proposalDesc: e.proposalDesc,
                proposalStatus: e.proposalStatus,
                socials: [e.twitter, e.website],
                startAt: period[0].startAt,
                endAt: period[0].endAt,
                currentVotePower: e.currentVotePower,
                vTokens: tokenPairs.tokenPairs.filter(
                  (item: any) => item.periodId === e.periodId
                ),
              };
            })
        );
      }
    };

    fetchProjects();
  }, [votePower]);

  const handleSort = (order: string) => {
    setSortOrder(order);
  };

  // Sort projects based on status
  const filteredProjects = projects.filter((project) => {
    if (sortOrder === "VOTING") {
      return project.proposalStatus === "VOTING";
    } else if (sortOrder === "APPROVED") {
      return project.proposalStatus === "APPROVED";
    } else if (sortOrder === "LAUNCHED") {
      return project.proposalStatus === "LAUNCHED";
    } else {
      if (project.proposalStatus === "PENDING") false;
      return true; // Default to show all projects
    }
  });

  return (
    <section className="bg-radial-gradient pt-16">
      <div className="flex justify-center min-h-screen">
        <div className="min-h-screen text-textclr2">
          <motion.div
            className="max-w-6xl mx-auto"
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              duration: 0.6,
              ease: "easeInOut",
              staggerChildren: 0.3,
            }}
          >
            <h1 className="my-4 mb-4 text-4xl text-center font-primaryBold">
              Vote List
            </h1>
            <p className="mb-4 text-center">
              Vote for your favourite projects.
              <br />
            </p>

            {/*  -- Sort Dropdown --  */}
            <div className="my-2 dropdown">
              <div
                tabIndex={0}
                role="button"
                className="flex items-center m-1 border btn text-textclr2 border-textclr2 hover:border-textclr2/60 font-primaryRegular"
              >
                <FilterAltIcon className="inline mr-2 size-5" /> Sort
              </div>
              <div
                tabIndex={0}
                className="dropdown-content z-[1] card card-compact w-64 p-1 shadow bg-primary/60 text-primary-content"
              >
                <ul className="rounded-lg shadow-lg menu bg-bg text-textclr2">
                  <li>
                    <button
                      className={`w-full text-left ${
                        sortOrder === "VOTING"
                          ? "text-textclr"
                          : "text-textclr2"
                      }`}
                      onClick={() => handleSort("VOTING")}
                    >
                      <EventIcon className="inline mr-2" /> Voting
                    </button>
                  </li>
                  <li>
                    <button
                      className={`w-full text-left ${
                        sortOrder === "APPROVED"
                          ? "text-textclr"
                          : "text-textclr2"
                      }`}
                      onClick={() => handleSort("APPROVED")}
                    >
                      <EventAvailableIcon className="inline mr-2" /> Approved
                    </button>
                  </li>
                  <li>
                    <button
                      className={`w-full text-left ${
                        sortOrder === "LAUNCHED"
                          ? "text-textclr"
                          : "text-textclr2"
                      }`}
                      onClick={() => handleSort("LAUNCHED")}
                    >
                      <EventAvailableIcon className="inline mr-2" /> Launched
                    </button>
                  </li>
                  <li>
                    <button
                      className={`w-full text-left ${
                        sortOrder === "all" ? "text-textclr" : "text-textclr2"
                      }`}
                      onClick={() => handleSort("all")}
                    >
                      <CalendarMonthIcon className="inline mr-2" /> All
                    </button>
                  </li>
                  <li>
                    <button
                      className={`w-full text-left ${
                        sortOrder === "HightVote"
                          ? "text-textclr"
                          : "text-textclr2"
                      }`}
                      onClick={() => handleSort("HightVote")}
                    >
                      <TrendingUpIcon className="inline mr-2" /> Most Voted
                    </button>
                  </li>
                  <li>
                    <button
                      className={`w-full text-left ${
                        sortOrder === "LowVote"
                          ? "text-textclr"
                          : "text-textclr2"
                      }`}
                      onClick={() => handleSort("LowVote")}
                    >
                      <TrendingDownIcon className="inline mr-2" /> Least Voted
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project, index) => {
                if (project.proposalStatus == "LAUNCHED") return null;
                return (
                  <TokenCard
                    key={index}
                    projectId={project.id}
                    projectName={project.name}
                    projectLogo={project.logoURL}
                    projectDesc={project.proposalDesc}
                    socials={project.socials}
                    status={
                      project.proposalStatus as
                        | "PENDING"
                        | "VOTING"
                        | "APPROVED"
                        | "LAUNCHED"
                        | "DECLINED"
                    }
                    startAt={project.startAt}
                    endAt={project.endAt}
                    votePower={project.currentVotePower}
                    isVote={true}
                    setSelectedId={setSelectedId}
                    setShowModal={setShowModal}
                    setApproveShowModal={setApproveShowModal}
                  />
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
      {/* // Pagination  */}
      <div className="flex justify-center p-2">
        <div className="join ">
          <button className="join-item btn btn-active text-textclr2">1</button>
          <button className="join-item btn bg-btnbg/30 text-textclr2">2</button>
          <button className="join-item btn bg-btnbg/30 text-textclr2">3</button>
          <button className="join-item btn bg-btnbg/30 text-textclr2">4</button>
        </div>
      </div>
      <Drawer.Root>
        <Drawer.Trigger asChild>
          <div className="flex items-center justify-center">
            <div className="btn btn-ghost text-textclr2/40 hover:text-textclr/20">
              Disclaimer
            </div>
          </div>
        </Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/80" />
          <Drawer.Content className="bg-gray-700/80 flex flex-col rounded-t-[10px] mt-24 fixed bottom-0 left-0 right-0">
            <div className="p-2 rounded-t-[10px] flex-1">
              <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-btnbg mb-2" />
              <div className="max-w-md mx-auto">
                <Drawer.Title className="mb-4 text-2xl text-center text-textclr font-primaryBold">
                  Disclaimer
                </Drawer.Title>
                <p className="px-4 py-4 mb-2 text-sm leading-5 border-4 rounded-e-badge font-primaryRegular border-textclr2 text-textclr2 text-pretty">
                  <i>
                    The information provided about tokens is for informational
                    purposes only & should not be considered financial advice.
                    Investing in tokens carries risks, including market
                    volatility & potential loss of investment. It's crucial to
                    conduct thorough research and seek professional advice
                    before investing. Please ensure you review all the details
                    of each project before casting your vote.
                  </i>
                </p>
                <p className="px-4 py-4 mb-2 text-sm leading-5 border-4 text-textclr2 font-primaryRegular rounded-e-badge border-textclr2">
                  <i>
                    We <b>"PRNT"</b> do not endorse the accuracy of token claims
                    or investment opportunities mentioned. Users should exercise
                    caution when engaging in its related activities.
                  </i>
                </p>
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
      {showModal && (
        <Modal
          setShowModal={setShowModal}
          projectId={selectedId}
          voteTokens={projects.filter(e => e.id === selectedId)[0].vTokens}
          currentVotePower={projects.filter(e => e.id === selectedId)[0].currentVotePower}
          setVotePower={setVotePower}
        />
      )}
    </section>
  );
};

export default VoteList;
