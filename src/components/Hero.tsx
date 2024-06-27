import { motion } from "framer-motion";
import {
  BallotTwoTone,
  MonetizationOn,
  HowToVote,
  Waves,
  AutoStories,
} from "@mui/icons-material/";

// const hub =
//   "https://shdw-drive.genesysgo.net/6ckeAEwCjs6qjCTv5mghBfdwHkB5aCfTes9mqxbxb5EE/hubx.png";

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

const Hero = () => {
  return (
    <>
      <div className="flex flex-col px-4 py-8 min-h-[335px] lg:flex-row bg-radial-gradient lg:py-16 lg:px-32">
        <div className="flex flex-col items-center justify-center flex-1">
          {/* Hero Image and Text */}
          {/* <motion.img
          src={hub}
          alt="Logo"
          className="mb-8 h-[600px] w-[700px] shadow-2xl border-[4px] border-textclr2 rounded-2xl"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        /> */}
          <motion.h1
            className="text-4xl text-center font-primaryBold text-textclr"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              ease: "easeInOut",
              duration: 2,
              delay: 0.4,
            }}
          >
            One{" "}
            <span className="relative mx-2 transform -skew-y-3 text-gradient circular-line">
              {" "}
              platform{" "}
            </span>{" "}
            for all launches!
          </motion.h1>
          <motion.p
            className="mt-4 text-lg text-center font-primaryRegular text-textclr2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              ease: "easeInOut",
              duration: 2,
              delay: 0.4,
            }}
          >
            Explore Token & NFT launches with ease. Stay informed & track all
            the latest launches in one location.
          </motion.p>
          <motion.div
            className="flex flex-row gap-6 px-2 py-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              ease: "easeInOut",
              duration: 2,
              delay: 0.7,
            }}
          >
            <button
              onClick={() => scrollToSection("token")}
              className="flex-1 px-6 text-sm text-center text-white bg-transparent border rounded-md flex-nowrap border-btnbg font-primaryRegular animate-buttonheartbeat hover:bg-btnbg/10 hover:text-textclr2/80"
            >
              Token Launches
            </button>
            <button
              onClick={() => scrollToSection("nft")}
              className="flex items-center px-6 text-sm text-white bg-transparent border rounded-md flex-nowrap btn border-btnbg font-primaryRegular animate-buttonheartbeat hover:bg-btnbg/10 hover:text-textclr2/80 hover:border-btnbg"
            >
              NFT Launches
            </button>
          </motion.div>

          {/* Vote Based Launching Section */}
          <div className="flex gap-8 p-7 lg:flex-row lg:justify-center lg:gap-14">
            <motion.div
              className="w-full max-w-md p-6 text-center rounded-lg shadow-lg bg-white/10 lg:w-96"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="mb-4 text-2xl text-textclr2 font-primaryBold">
                Vote Based Launching
              </h2>
              <p className="mb-6 text-textclr font-primaryRegular text-pretty">
                Vote for your project. The highest voted project wins and gets
                launched on our platform.
              </p>
              <div className="flex flex-col gap-4">
                <motion.div
                  className="p-4 rounded-lg shadow-md bg-btnbg/20"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <BallotTwoTone fontSize="large" className="text-btnbg" />
                  <h3 className="mt-2 text-xl font-semibold text-textclr2">
                    Vote for Your Project
                  </h3>
                  <p className="text-textclr">
                    Participate and cast your vote for your favorite projects.
                  </p>
                </motion.div>
                <motion.div
                  className="p-4 rounded-lg shadow-md bg-btnbg/20"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <HowToVote fontSize="large" className="text-btnbg" />
                  <h3 className="mt-2 text-xl font-semibold text-textclr2">
                    Highest Voted Project Wins
                  </h3>
                  <p className="text-textclr">
                    The project with the highest votes gets launched on our
                    platform.
                  </p>
                </motion.div>
                <motion.div
                  className="p-4 rounded-lg shadow-md bg-btnbg/20"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <HowToVote fontSize="large" className="text-btnbg" />
                  <h3 className="mt-2 text-xl font-semibold text-textclr2">
                    add another featuture
                  </h3>
                  <p className="text-textclr">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Incidunt, sit hic.
                  </p>
                </motion.div>
              </div>
            </motion.div>

            {/* Presale Section */}
            <motion.div
              className="w-full max-w-md p-6 text-center bg-white rounded-lg shadow-lg lg:w-96 bg-white/10"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="mb-4 text-2xl text-textclr2 font-primaryBold">
                Token Presale
              </h2>
              <p className="mb-6 text-textclr font-primaryRegular text-pretty">
                Set up your token presale with our in-house tools, including
                presale setup, LP funding creator, and market ID creator.
              </p>
              <div className="flex flex-col gap-4">
                <motion.div
                  className="p-4 rounded-lg shadow-md bg-btnbg/20"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <MonetizationOn fontSize="large" className="text-btnbg" />
                  <h3 className="mt-2 text-xl font-semibold text-textclr2">
                    Presale Setup
                  </h3>
                  <p className="text-textclr">
                    Quickly configure your token's presale with our easy-to-use
                    tools.
                  </p>
                </motion.div>
                <motion.div
                  className="p-4 rounded-lg shadow-md bg-btnbg/20"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Waves fontSize="large" className="text-btnbg" />
                  <h3 className="mt-2 text-xl font-semibold text-textclr2">
                    LP Funding Creator
                  </h3>
                  <p className="text-textclr">
                    Create liquidity pools effortlessly with our integrated
                    solutions.
                  </p>
                </motion.div>
                <motion.div
                  className="p-4 rounded-lg shadow-md bg-btnbg/20"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <AutoStories fontSize="large" className="text-btnbg" />
                  <h3 className="mt-2 text-xl font-semibold text-textclr2">
                    Market ID Creator
                  </h3>
                  <p className="text-textclr">
                    Generate market IDs for your projects seamlessly.
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
