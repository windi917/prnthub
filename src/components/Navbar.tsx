// import ThemeToggle from "./ThemeToggle";
import { useContext } from "react";
import { Link } from "react-router-dom";
// import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import WalletInteraction from "../utils/WalletInteraction";
import { JwtTokenContext } from "../contexts/JWTTokenProvider";
import {
  BallotTwoTone as BallotTwoToneIcon,
  RocketLaunch as RocketLaunchIcon,
  HowToVote as HowToVoteIcon,
  MonetizationOn as MonetizationOnIcon,
  AutoStories as AutoStoriesIcon,
  Waves as WavesIcon,
  AddTask as AddTaskIcon,
} from "@mui/icons-material";

const logo =
  "https://shdw-drive.genesysgo.net/6ckeAEwCjs6qjCTv5mghBfdwHkB5aCfTes9mqxbxb5EE/logo_prntHub.png";

const Navbar = () => {
  const { userRole } = useContext(JwtTokenContext);

  return (
    <>
      <nav className="fixed z-10 bg-black navbar min-h-15">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#CCF869"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 bg-bg text-textclr shadow border-[0.03rem] border-btnbg rounded-md w-52"
            >
              {/* Presale Section */}
              <li>
                <a className="text-textclr2">Presale</a>
                <ul className="p-1 text-sm">
                  <li>
                    <Link to="/setupMarket">
                      <AutoStoriesIcon /> Create Market ID
                    </Link>
                  </li>
                  <li>
                    <Link to="/tokenSetup">
                      <MonetizationOnIcon /> Presale Setup
                    </Link>
                  </li>
                  <li>
                    <Link to="/setupLP">
                      <WavesIcon /> LP Funding
                    </Link>
                  </li>
                </ul>
              </li>

              {/* Token Launch Section */}
              <li>
                <a className="text-textclr2">Token Launch</a>
                <ul className="p-1 text-sm">
                  <li>
                    <Link to="/tokenSubmit">
                      <AddTaskIcon /> Submit Token
                    </Link>
                  </li>
                  <li>
                    <Link to="/VoteList">
                      <BallotTwoToneIcon /> Vote List
                    </Link>
                  </li>
                  <li>
                    <Link to="/LaunchList">
                      <RocketLaunchIcon /> Launches
                    </Link>
                  </li>
                  <li>
                    <Link to="/mylaunches">
                      <HowToVoteIcon /> My Projects
                    </Link>
                  </li>
                </ul>
              </li>

              {/* Menu Items */}
              <li>
                <a className="text-textclr2">NFT Hub</a>
                <ul className="p-2">
                  <li>
                    <Link to="/NFTSubmit">NFT Application</Link>
                  </li>
                  <li>
                    <Link
                      to="https://docs.google.com/forms/d/e/1FAIpQLSdCiZfRgREdOLw6hEYWMfukMzkf4LoHItJXedWEt-Kd1_ZE7w/viewform"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Submit NFT
                    </Link>
                  </li>
                </ul>
              </li>
              <li>
                <Link to="/Contact">Contact Us</Link>
              </li>
              <li>
                <Link to="/privacyPolicy">Privacy Policy</Link>
              </li>

              {userRole === "ADMIN" ? (
                <li>
                  <Link
                    to="/dashboard"
                    className="text-textclr2 bg-slate-700 hover:bg-slate-400 hover:text-textclr"
                  >
                    Admin Dashboard
                  </Link>
                </li>
              ) : null}
            </ul>
          </div>
        </div>

        <Link to="/" className="navbar-center">
          <img
            src={logo}
            alt="Logo"
            className="w-auto h-6 sm:h-10 md:h-12 lg:h-9"
          />
        </Link>
        {/* Dark / Light Toggle */}
        <div className="navbar-end">
          {/* <ThemeToggle /> */}
          <WalletInteraction />
          {/* <WalletMultiButton /> */}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
