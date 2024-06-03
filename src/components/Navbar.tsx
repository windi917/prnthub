// import ThemeToggle from "./ThemeToggle";
import { Link } from "react-router-dom";
// import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import WalletInteraction from "../utils/WalletInteraction";

const logo =
  "https://shdw-drive.genesysgo.net/6ckeAEwCjs6qjCTv5mghBfdwHkB5aCfTes9mqxbxb5EE/logo_prntHub.png";

const Navbar = () => {
  return (
    <>
      <nav className="navbar bg-bg">
        <div className="navbar-start">
          <div className="dropdown">
            <button className="btn btn-ghost btn-circle">
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
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>
            </button>
            <ul className="z-10 p-2 mt-3 shadow bg-bg text-textclr menu menu-sm dropdown-content rounded-box w-52">
              <li>
                <Link to="/">Homepage</Link>
              </li>
              <li>
                <Link to="/Contact">Contact Us</Link>
              </li>
              <li>
                <Link to="/VoteList">Vote List</Link>
              </li>
              <li>
                <Link to="/submitToken">Submit Token</Link>
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
              <li>
                <Link to="/NFTSubmit">NFT Application</Link>
              </li>
              <li>
                <Link to="/dashboard">Admin Dashboard</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="navbar-center">
          {/* Logo */}
          <img
            src={logo}
            alt="Logo"
            className="w-auto h-8 sm:h-10 sm:w-auto md:h-12 md:w-auto lg:h-12 lg:w-auto"
          />
        </div>
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
