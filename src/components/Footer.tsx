import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <footer className="p-4 mx-auto border shadow-xl rounded-2xl bg-bg border-textclr2 font-primaryRegular md:flex md:items-center md:justify-between md:p-6 xl:p-8">
        <ul className="flex flex-wrap items-center mb-6 md:mb-0">
          <li>
            <Link
              to="/"
              className="mr-4 text-sm font-normal text-textclr2 hover:text-white/80"
            >
              Home
            </Link>
          </li>
          {/* <li>
            <Link
              to="/about"
              className="mr-4 text-sm font-normal text-textclr2 hover:text-white/80"
            >
              About
            </Link>
          </li> */}
          <li>
            <Link
              to="/Contact"
              className="mr-4 text-sm font-normal text-textclr2 hover:text-white/80"
            >
              Contact
            </Link>
          </li>
          <Link
            to="/privacyPolicy"
            className="mr-4 text-sm font-primaryRegular text-textclr2 hover:text-white/80"
          >
            Privacy Policy
          </Link>
        </ul>
        <div className="flex space-x-6 sm:justify-center">
          {/* -- Twitter -- */}
          <a
            href="https://twitter.com/printonsol"
            target="_blank"
            rel="noopener noreferrer"
            className="text-textclr2 hover:text-white/80"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M18.205 2.25h3.308l-7.227 8.26l8.502 11.24H16.13l-5.214-6.817L4.95 21.75H1.64l7.73-8.835L1.215 2.25H8.04l4.713 6.231zm-1.161 17.52h1.833L7.045 4.126H5.078z"
              />
            </svg>
          </a>

          {/* -- Discord -- */}
          <a
            href="https://discord.gg/prntonsol"
            target="_blank"
            rel="noopener noreferrer"
            className="text-textclr2 hover:text-white/80"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M19.303 5.337A17.32 17.32 0 0 0 14.963 4c-.191.329-.403.775-.552 1.125a16.592 16.592 0 0 0-4.808 0C9.454 4.775 9.23 4.329 9.05 4a17.075 17.075 0 0 0-4.342 1.337C1.961 9.391 1.218 13.35 1.59 17.255a17.69 17.69 0 0 0 5.318 2.664a12.94 12.94 0 0 0 1.136-1.836c-.627-.234-1.22-.52-1.794-.86c.149-.106.297-.223.435-.34c3.46 1.582 7.207 1.582 10.624 0c.149.117.287.234.435.34c-.573.34-1.167.626-1.793.86a12.94 12.94 0 0 0 1.135 1.836a17.594 17.594 0 0 0 5.318-2.664c.457-4.52-.722-8.448-3.1-11.918M8.52 14.846c-1.04 0-1.889-.945-1.889-2.101c0-1.157.828-2.102 1.89-2.102c1.05 0 1.91.945 1.888 2.102c0 1.156-.838 2.1-1.889 2.1m6.974 0c-1.04 0-1.89-.945-1.89-2.101c0-1.157.828-2.102 1.89-2.102c1.05 0 1.91.945 1.889 2.102c0 1.156-.828 2.1-1.89 2.1"
              />
            </svg>
          </a>

          {/* -- MagicEden -- */}
          <a
            href="https://magiceden.io/marketplace/prnt"
            target="_blank"
            rel="noopener noreferrer"
            className="text-textclr2 hover:text-white/80"
          >
            <svg
              viewBox="0 0 23 12"
              className="w-5 h-5"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M1.92984 0.0833004C1.55534 0.208426 1.22946 0.465524 1.0174 0.803187L0.82971 1.10212L0.810616 5.95123C0.793486 10.3072 0.802762 10.828 0.901887 11.0722C1.1499 11.6834 1.64512 12 2.35315 12C2.88764 12 3.21717 11.8559 3.62119 11.4456C4.10165 10.9576 4.11356 10.8696 4.11356 7.80961C4.11356 5.45922 4.12623 5.1272 4.21587 5.1272C4.27207 5.1272 5.01381 5.76861 5.8641 6.55252C6.81702 7.43106 7.5042 8.0146 7.65546 8.07381C7.79047 8.12661 8.08588 8.16978 8.31202 8.16978C9.04686 8.16978 9.08193 8.13903 10.792 5.99655C11.6328 4.94318 12.3748 4.02838 12.4409 3.96373C12.5572 3.85008 12.5927 3.88063 13.5002 4.87498C14.0166 5.44084 14.4488 5.94261 14.4608 5.99009C14.4727 6.0375 13.9685 6.72563 13.3402 7.51923C11.5974 9.72079 11.4214 9.97764 11.3245 10.461C11.2223 10.9708 11.5909 11.5579 12.1709 11.8093C12.4677 11.9379 12.5837 11.9417 16.6735 11.9596C20.4271 11.9759 20.9021 11.9669 21.1618 11.8742C22.1702 11.5141 22.5127 10.3407 21.8078 9.66121C21.3359 9.20628 21.4229 9.21915 18.5693 9.18397C16.2474 9.15538 15.9964 9.1422 15.9964 9.0487C15.9964 8.99171 16.4051 8.49273 16.9048 7.93987C17.9564 6.77615 18.1655 6.42568 18.1098 5.92011C18.0556 5.4286 17.8773 5.15908 16.8901 4.07567C16.3986 3.53618 15.9964 3.04576 15.9964 2.98586C15.9964 2.88539 16.1952 2.87449 18.5693 2.84526C21.4055 2.81034 21.3236 2.82194 21.7651 2.3911C22.4807 1.6927 22.2814 0.634261 21.3453 0.16133C21.0757 0.0251113 21.0551 0.0245408 16.6058 0.0245408H12.137L11.8243 0.196637C11.5624 0.340779 11.2454 0.70874 9.87256 2.46272C8.9711 3.6144 8.21073 4.55671 8.1829 4.55671C8.15501 4.55671 7.0668 3.57732 5.76456 2.38032C3.70075 0.483209 3.35442 0.190361 3.06605 0.0983867C2.67165 -0.0274365 2.27698 -0.0326978 1.92984 0.0833004Z"
                fill="currentColor"
              ></path>
            </svg>
          </a>

          {/* -- Prnt Website -- */}
          <a
            href="https://prnt.gg"
            target="_blank"
            rel="noopener noreferrer"
            className="text-textclr2 hover:text-white/80"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              viewBox="0 0 16 16"
            >
              <path
                fill="currentColor"
                d="M6 8c0-.703.044-1.375.125-2h3.75c.08.625.125 1.297.125 2s-.044 1.375-.125 2h-3.75A16 16 0 0 1 6 8m-.883 2A17 17 0 0 1 5 8c0-.693.04-1.365.117-2H2.34A6 6 0 0 0 2 8c0 .701.12 1.374.341 2zm-2.314 1h2.47c.125.655.292 1.254.493 1.776c.134.349.286.672.457.957A6.02 6.02 0 0 1 2.803 11m3.489 0h3.416a9 9 0 0 1-.407 1.417c-.213.554-.455.969-.698 1.236S8.156 14 8 14s-.36-.08-.603-.347s-.485-.682-.698-1.236A9 9 0 0 1 6.292 11m4.436 0a10.5 10.5 0 0 1-.494 1.776a6 6 0 0 1-.457.957A6.02 6.02 0 0 0 13.197 11zm2.93-1A6 6 0 0 0 14 8a6 6 0 0 0-.341-2h-2.776c.076.635.117 1.307.117 2s-.04 1.365-.117 2zM9.302 3.583c.159.414.297.89.407 1.417H6.292c.11-.527.248-1.003.407-1.417c.213-.554.455-.969.698-1.236S7.844 2 8 2s.36.08.603.347s.485.682.698 1.236M10.728 5h2.47a6.02 6.02 0 0 0-3.421-2.733c.17.285.323.608.457.957c.201.522.368 1.12.494 1.776M2.803 5h2.47a10.5 10.5 0 0 1 .493-1.776c.134-.349.286-.672.457-.957A6.02 6.02 0 0 0 2.803 5"
              />
            </svg>
          </a>
          {/* -- Prnt Chart -- */}
          <a
            href="https://birdeye.so/token/4TUNzcgp2fPD48fcW4seRjyqyDZMrPj4ZubnXFEsKeYk?chain=solana&__cf_chl_rt_tk=ndYhcDiepFURY6yW.IHIgdBJ0Xn03uRAGi5Pn5mWWdQ-1708711802-0.0-4519"
            className="text-textclr2 hover:text-white/80"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="#CCF869"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 16H13C13.6667 16 15 15.6 15 14C15 12.4 13.6667 12 13 12H11C10.3333 12 9 11.6 9 10C9 8.4 10.3333 8 11 8H12M12 16H9M12 16V18M15 8H12M12 8V6M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                stroke="#000000"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </a>
          {/* -- Prnt Token Stats -- */}
          <a
            href="https://stats.prnt.gg/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-textclr2 hover:text-white/80"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              className="w-5 h-5"
            >
              <path
                fill="currentColor"
                fill-rule="evenodd"
                d="M9 6a3 3 0 0 0-3 3v30a3 3 0 0 0 3 3h30a3 3 0 0 0 3-3V9a3 3 0 0 0-3-3zm6.775 16.477c2.28-4.065 4.314-7.696 4.314-12.477c3.987 3.309 7.72 7.022 9.029 12.09l.228-.437c.646-1.236 1.5-2.872 1.984-4.653c2.816 8.683 3.333 16.334-6.33 21c.737-4.5.525-7.565-1.807-11.741c-3.794 3.81-4.6 6.672-4.6 11.741c-3.503-4.417-6.356-9.18-3.289-14.68z"
                clip-rule="evenodd"
              />
            </svg>
          </a>
        </div>
      </footer>
    </>
  );
};

export default Footer;
