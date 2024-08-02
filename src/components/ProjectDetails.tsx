import { motion } from "framer-motion";
import React, { useState, useEffect, useCallback } from "react";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { FaGlobe, FaTelegram, FaXTwitter } from "react-icons/fa6";
import { useParams } from "react-router-dom";
import { getAllData } from "../solana/transaction";
import { getPoolTokens, getProjects } from "../api/apis";
import { buyTokens } from "../solana/transaction";
import { Oval } from "react-loader-spinner";
import { toast } from "react-toastify";

interface Presale {
  presaleKey: string;
  name: string;
  description: string;
  logo: string;
  owner: string;
  website: "https://apple.com";
  socials: {
    twitter: "#";
    telegram: "#";
  };
  state: string;
  base_mint: string;
  quote_mint: string;
  quote_symbol: string;
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
}

// Dummy data for now, replace with dynamic data later
const ProjectDetails = () => {
  const anchorWallet = useAnchorWallet();
  const [buyCount, setBuyCount] = useState(0);
  const { presaleKey } = useParams<{ presaleKey: string }>();
  const [projectData, setProjectData] = useState<Presale>();
  const [loading, setLoading] = useState<boolean>(false);

  const fetchProjects = useCallback(async () => {
    const projects = await getProjects();
    const poolTokenRes = await getPoolTokens();
    const presaleDatas = await getAllData();

    if (projects.success === false) return null;
    if (poolTokenRes.success === false) return null;
    if (!presaleDatas) return null;

    const presaleObjs: Presale[] = presaleDatas
      .map((e: any) => {
        const project = projects.projects.find(
          (item: any) => item.mint === e.base_mint
        );
        if (!project) return null;

        const poolToken = poolTokenRes.pooltokens.find(
          (item: any) => item.tokenMint === e.quote_mint
        );
        if (!poolToken) return null;

        const curTime = new Date();
        const startTime = new Date(e.start_time); // assuming e.start_time is in seconds
        const endTime = new Date(e.end_time); // assuming e.end_time is in seconds

        let state = "Pending";
        if (e.state === 0 && curTime < startTime) state = "Upcoming";
        if (e.state === 0 && curTime >= startTime && curTime < endTime)
          state = "Live";
        if (e.state === 0 && curTime >= endTime) state = "Ended";
        if (e.state === 1) state = "Approved";
        if (e.state === 2) state = "Closed";

        return {
          presaleKey: e.presaleKey,
          name: project.name,
          description: project.proposalDesc,
          logo: project.logoURL,
          owner: e.owner,
          website: "https://apple.com",
          socials: {
            twitter: "#",
            telegram: "#",
          },
          state: state,
          base_mint: e.base_mint,
          quote_mint: e.quote_mint,
          quote_symbol: poolToken.name,
          min_allocation: e.min_allocation / 10 ** poolToken.decimals,
          max_allocation: e.max_allocation / 10 ** poolToken.decimals,
          hardcap: e.hardcap / 10 ** poolToken.decimals,
          softcap: e.softcap / 10 ** poolToken.decimals,
          sale_price: e.sale_price / 10 ** poolToken.decimals,
          launch_price: e.launch_price / 10 ** poolToken.decimals,
          start_time: e.start_time,
          end_time: e.end_time,
          total_contributions: e.total_contributions / 10 ** poolToken.decimals,
          max_contribution: e.max_contribution,
        };
      })
      .filter((presale: any): presale is Presale => presale !== null);

    const res = presaleObjs.filter((e) => e.presaleKey === presaleKey);
    if (!res) return;

    setProjectData(res[0]);
  }, [setProjectData]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleBuy = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!projectData) return;

      if ( buyCount <= 0 ) {
        toast.error("Input amount correctly!");
        return;
      }

      setLoading(true);
      try {
        const res = await buyTokens(
          anchorWallet,
          new PublicKey(projectData.presaleKey),
          buyCount
        );

        if ( res.success === false )
          toast.error(`Buy tokens error! ${res.error}`);
        else
          toast.success("Buy tokens success!");
      } catch (err) {
        toast.error("Buy tokens error!");
      }

      setLoading(false);
    },
    [buyCount]
  );

  return (
    <>
      <section className="min-h-screen p-4 bg-radial-gradient">
        <motion.div
          className="flex flex-col p-6 mx-auto rounded-lg shadow-lg max-w-[90vh] mb-6 bg-white/15 md:max-w-[80vw] lg:max-w-[70vw]"
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.8,
            delay: 0.3,
            ease: "easeInOut",
            staggerChildren: 0.2, // Add staggering effect if there are child elements
          }}
        >
          <motion.div
            className="flex flex-col mb-4 md:flex-row md:items-center"
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              duration: 0.8,
              delay: 0.4,
              ease: "easeInOut",
              staggerChildren: 0.2, // Add staggering effect if there are child elements
            }}
          >
            <div className="mb-2 md:justify-start md:mb-0 md:mr-8">
              <img
                src={projectData?.logo}
                className="w-24 h-24 rounded-lg"
                alt="Project Logo"
              />
            </div>
            <div className="flex flex-col md:items-start">
              <h2 className="mb-2 text-2xl font-primaryBold text-textclr2 md:text-left">
                {projectData?.name}
              </h2>
              <div className="flex space-x-4">
                <a
                  href={projectData?.socials?.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-textclr2 hover:text-btnbg/30"
                >
                  <FaXTwitter size={24} />
                </a>
                <a
                  href={projectData?.socials.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-textclr2 hover:text-btnbg/30"
                >
                  <FaTelegram size={24} />
                </a>
                <a
                  href={projectData?.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-textclr2 hover:text-btnbg/30"
                >
                  <FaGlobe size={24} />
                </a>
              </div>
            </div>
          </motion.div>
          {/* <p className="mt-4 text-center text-textclr font-primaryRegular md:text-left">
            Website:
            <a
              href={projectData?.website}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 text-textclr2 hover:underline"
            >
              {projectData?.website}
            </a>
          </p> */}
          <motion.p
            className="mt-2 text-justify text-textclr font-primaryRegular md:text-left"
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              duration: 0.8,
              delay: 0.3,
              ease: "easeInOut",
              staggerChildren: 0.2, // Add staggering effect if there are child elements
            }}
          >
            {projectData?.description}
          </motion.p>

          <motion.div
            className="flex flex-col items-center justify-between w-full mt-4 space-y-4 md:flex-row md:space-y-0"
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              duration: 0.8,
              delay: 0.5,
              ease: "easeInOut",
              staggerChildren: 0.2, // Add staggering effect if there are child elements
            }}
          >
            <div className="flex flex-col w-full md:w-1/2">
              <div className="flex justify-between mb-2">
                <p className="text-textclr font-primaryRegular">
                  Sold{" "}
                  <span className="font-mono text-textclr2">
                    {projectData?.total_contributions}%
                  </span>
                </p>
                <p className="text-textclr font-primaryRegular">
                  <span className="font-mono text-textclr2">
                    {projectData?.hardcap}
                  </span>{" "}
                  {projectData?.quote_symbol}{" "}
                </p>
              </div>
              <progress
                className="w-full progress progress-info"
                value={projectData?.total_contributions}
                max={projectData?.hardcap}
              ></progress>
              <p className="mt-2 text-textclr font-primaryRegular">
                <span className="font-mono text-textclr2">
                  {projectData?.total_contributions}
                </span>{" "}
                {projectData?.quote_symbol}
              </p>
            </div>
            <div className="flex flex-col items-end w-full md:w-1/2">
              <p className="mb-1 text-textclr font-primaryRegular">
                Buy (Min:
                <span className="font-mono text-textclr2">
                  {" "}
                  {projectData?.min_allocation}{" "}
                </span>
                {projectData?.quote_symbol}, Max:
                <span className="font-mono text-textclr2">
                  {" "}
                  {projectData?.max_allocation}{" "}
                </span>
                {projectData?.quote_symbol})
              </p>
              <div className="flex items-center mt-2">
                <input
                  type="number"
                  className="w-40 input input-bordered focus:outline-1 focus:ring-textclr2 focus:border-textclr2"
                  placeholder={projectData?.min_allocation.toString()}
                  min={projectData?.min_allocation}
                  max={projectData?.max_allocation}
                  value={buyCount}
                  onChange={(e) => {
                    setBuyCount(parseInt(e.target.value));
                  }}
                  step="1"
                />
                {projectData?.state === "Live" ? (
                  <button
                    className="px-4 py-2 ml-2 border rounded-lg text-textclr border-textclr2 border-lg bg-btnbg/50 hover:bg-btnbg/60 hover:border-btnbg hover:text-btnbg focus:outline-none"
                    onClick={handleBuy}
                  >
                    Buy
                  </button>
                ) : (
                  <button
                    className="px-4 py-2 ml-2 border rounded-lg text-textclr border-textclr2 border-lg bg-btnbg/50 hover:bg-btnbg/60 hover:border-btnbg hover:text-btnbg focus:outline-none"
                    disabled
                  >
                    Buy
                  </button>
                )}
              </div>
              <p className="mt-2 text-textclr font-primaryRegular">
                Buying{" "}
                <span className="font-mono text-textclr2">
                  {buyCount} {projectData?.quote_symbol}
                </span>
              </p>
            </div>
          </motion.div>

          <motion.div
            className="flex flex-col justify-center w-full mt-4 space-y-4 md:flex-row md:space-y-0 md:space-x-4"
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              duration: 0.9,
              delay: 0.2,
              ease: "easeInOut",
              staggerChildren: 0.4, // Add staggering effect if there are child elements
            }}
          >
            <div className="w-full md:w-auto">
              <p className="text-center text-textclr2 font-primaryRegular md:text-left">
                Whitelist Sale Finished:
              </p>
              <div className="p-2 mt-2 font-mono text-center border-2 border-dashed border-btnbg/80">
                00:00
              </div>
            </div>
            <div className="w-full md:w-auto">
              <p className="text-center text-textclr2 font-primaryRegular md:text-left">
                Public Sale Ending in:
              </p>
              <div className="p-2 mt-2 font-mono text-center border-2 border-dashed border-btnbg/80">
                {projectData
                  ? new Date(projectData?.end_time).toLocaleString()
                  : "00:00:00"}
              </div>
            </div>
          </motion.div>

          <motion.div
            className="w-full mt-4"
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              duration: 0.8,
              delay: 0.8,
              ease: "easeInOut",
              staggerChildren: 0.2,
            }}
          >
            <div className="collapse collapse-arrow">
              <input type="checkbox" className="peer" />
              <div className="collapse-title text-textclr2 font-primaryBold">
                Project Information
              </div>
              <div className="collapse-content">
                <p className="text-textclr font-primaryRegular">
                  ex, molestias voluptates hic! Dicta qui commodi id ipsam
                  repudiandae aspernatur pariatur quis doloremque ducimus.
                  Similique at ducimus sint, illo tempore minima veniam
                  dignissimos ea repellendus accusamus ut pariatur autem, iste
                  quidem, enim odit repudiandae laudantium debitis maxime earum
                  nam sequi repellat magni dolorem! Odit.
                </p>
              </div>
            </div>
            <div className="mt-2 collapse collapse-arrow">
              <input type="checkbox" className="peer" />
              <div className="collapse-title text-textclr2 font-primaryBold">
                Tokenomics
              </div>
              <div className="collapse-content">
                <p className="text-textclr font-primaryRegular">
                  Lorem, ipsum dolor. Lorem ipsum dolor sit amet consectetur
                  adipisicing elit. Aliquid vel, ipsam perspiciatis laboriosam
                  expedita, labore repellat unde nostrum cum provident sed quo
                  culpa cumque maiores, minus enim! Recusandae, aut incidunt.
                  Voluptatibus minima quam corporis quibusdam dolorem et sit
                  reiciendis perspiciatis repellat officia optio, tenetur itaque
                </p>
              </div>
            </div>
            <div className="mt-2 collapse collapse-arrow">
              <input type="checkbox" className="peer" />
              <div className="collapse-title text-textclr2 font-primaryBold">
                Roadmap
              </div>
              <div className="collapse-content">
                <p className="text-textclr font-primaryRegular">
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                  Consequatur nostrum eveniet sunt mollitia quidem dolores modi
                  perferendis atque eos possimus fuga minus fugit ullam, labore
                  veritatis esse suscipit adipisci molestiae. Nihil error atque
                  perspiciatis earum? Odio nam pariatur, voluptas ullam ut
                  nesciunt dolorum sit? Distinctio hic repellendus doloremque at
                  harum voluptatum, iure architecto sequi minus mollitia? Nemo
                  voluptatem dolorum blanditiis. Placeat nostrum ea explicabo
                  maxime quaerat repellat debitis sit vel fugiat perferendis quo
                </p>
              </div>
            </div>
            {/* <div className="mt-2 collapse collapse-arrow">
              <input type="checkbox" className="peer" />
              <div className="collapse-title text-textclr2 font-primaryBold">
                Lorem 2
              </div>
              <div className="collapse-content">
                <p className="text-textclr font-primaryRegular">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Laborum illum ad architecto vero error perspiciatis amet optio
                  nostrum quis veritatis ex temporibus necessitatibus nemo
                  voluptatum explicabo, sequi ipsam nam molestias.
                </p>
              </div>
            </div> */}
          </motion.div>
        </motion.div>
        {loading ? (
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
        ) : null}
      </section>
    </>
  );
};

export default ProjectDetails;
