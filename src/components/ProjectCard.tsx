// import { motion } from "framer-motion";
import { useCallback, useContext, useState } from "react";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { FaXTwitter, FaTelegram } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { JwtTokenContext } from "../contexts/JWTTokenProvider";
import { toast } from "react-toastify";
import { setApprove, withdraw } from "../solana/transaction";
import { Oval } from "react-loader-spinner";

interface Socials {
  twitter?: string;
  telegram?: string;
}

interface Project {
  presaleKey: string;
  name: string;
  logo: string;
  owner: string;
  website: string,
  socials: Socials,
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
};

interface CardProps {
  project: Project;
}

const ProjectCard: React.FC<CardProps> = ({ project }) => {
  const anchorWallet = useAnchorWallet();
  const { userRole } = useContext(JwtTokenContext);
  const [loading, setLoading] = useState<boolean>(false);

  let badgeClass = "";
  let badgeText = "";
  const navigate = useNavigate();

  const handleViewClick = () => {
    navigate(`/project/${project.presaleKey}`);
  };

  // Badge text and color config
  if (project.state === 'Live') {
    badgeClass = "bg-lime-500";
    badgeText = "LIVE";
  } else if (project.state === 'Upcoming') {
    badgeClass = "bg-amber-300";
    badgeText = "UPCOMING";
  } else if (project.state === 'Ended') {
    badgeClass = "bg-amber-700";
    badgeText = "ENDED";
  } else if (project.state === 'Approved') {
    badgeClass = "bg-amber-100";
    badgeText = "APPROVED";
  } else if (project.state === 'Closed') {
    badgeClass = "bg-amber-900";
    badgeText = "CLOSED";
  }

  const handleApprove = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (userRole !== "ADMIN") {
      toast.error('You do not have admin role');
      return;
    }

    setLoading(true);
    
    try {
      const res = await setApprove(anchorWallet, new PublicKey(project.presaleKey));
      if ( res.success === false )
        toast.error(`Set Approve Error! ${res.error}`);
      else
        toast.success('Set Approve Success!');
    } catch(err) {
      toast.error('Set Approve Error!');
    }

    setLoading(false);
  }, [userRole]);

  const handleWithdraw = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await withdraw(anchorWallet, new PublicKey(project.presaleKey));
      if ( res.success === false )
        toast.error(`Withdraw fail! ${res.error}`);
      else
        toast.success("Withdraw success!");
    } catch(err) {
      toast.error('Withdraw fail!');
    }
    
    setLoading(false);
  }, []);

  return (
    <>
      <div className="border rounded-lg mb-4 shadow-lg mt-4 p-4 bg-white/10 border-textclr2/60 transition-transform duration-300 hover:scale-105 min-w-[20rem] min-h-[20rem] flex flex-col justify-between hover:shadow-textclr2 ease-in-out">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <img
              src={project.logo}
              alt={`${project.name} logo`}
              className="w-12 h-12 border rounded-full border-btnbg"
            />
            <a
              href={project.website}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-3 hover:text-green-300 text-textclr2 font-primaryBold"
            >
              {project.name}
            </a>
          </div>

          {/* -- Project socials Config --  */}
          <div className="flex flex-col gap-2">
            {project.socials.twitter && (
              <a
                href={project.socials.twitter}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaXTwitter className="text-textclr2 hover:text-blue-500" />
              </a>
            )}
            {project.socials.telegram && (
              <a
                href={project.socials.telegram}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTelegram className="text-textclr2 hover:text-blue-500" />
              </a>
            )}
          </div>
        </div>
        {badgeText && (
          <div
            className={`flex w-[5rem] items-center justify-center border-2 border-textclr2/60 py-1 px-1 text-xs text-slate-700 font-primaryBold rounded-2xl ${badgeClass}`}
          >
            {badgeText}
          </div>
        )}
        {/* -- Project Hardcap , Softcap & Sold Config --  */}
        <div className="flex flex-col space-y-3 text-textclr2 font-primaryRegular">
          <div className="flex justify-between mt-2">
            <span>Sale Price</span>
            <span className="font-mono text-textclr">{project.sale_price} {project.quote_symbol}</span>
          </div>
          <div className="flex justify-between">
            <span>Hardcap</span>
            <span className="font-mono text-textclr">{project.hardcap} {project.quote_symbol}</span>
          </div>
          <div className="flex justify-between">
            <span>Sold</span>
            <span className="font-mono text-textclr">{project.total_contributions} {project.quote_symbol}</span>
          </div>
          <progress
            className="w-full progress progress-success"
            value={project.total_contributions}
            max={project.hardcap}
          ></progress>
        </div>
        <div className="text-center">
          {project.state === 'Ended' ? (
            <button
              onClick={handleApprove}
              className="px-4 py-2 mt-4 border rounded-lg text-textclr border-textclr2 bg-btnbg/70 hover:bg-btnbg/40 hover:text-white focus:outline-none"
            >
              Approve
            </button>
          ) : (
            <>
              {project.state === 'Approved' ? (
                <button
                  onClick={handleWithdraw}
                  className="px-4 py-2 mt-4 border rounded-lg text-textclr border-textclr2 bg-btnbg/70 hover:bg-btnbg/40 hover:text-white focus:outline-none"
                >
                  Withdraw
                </button>
              ) : (
                <>
                  {project.state === 'Live' ? (
                    <button
                      onClick={handleViewClick}
                      className="px-4 py-2 mt-4 border rounded-lg text-textclr border-textclr2 bg-btnbg/70 hover:bg-btnbg/40 hover:text-white focus:outline-none"
                    >
                      Buy
                    </button>
                  ) : (
                    <button
                      onClick={handleViewClick}
                      className="px-4 py-2 mt-4 border rounded-lg text-textclr border-textclr2 bg-btnbg/70 hover:bg-btnbg/40 hover:text-white focus:outline-none"
                    >
                      View
                    </button>
                  )}
                </>
              )}
            </>
          )}

        </div>

        {/* -- Project Starttime Config --  */}
        <div className="px-1 py-2 my-2 mt-4 font-mono text-xs rounded-md countdown bg-btnbg/20 w-fit text-textclr2">
          Starts in: {new Date(project.start_time).toLocaleString()}
        </div>
      </div>
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
    </>
  );
};

export default ProjectCard;
