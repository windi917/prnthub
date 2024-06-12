import { motion } from "framer-motion";

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
    <div className="flex flex-col px-4 py-8 min-h-[345px] lg:flex-row bg-radial-gradient lg:py-16 lg:px-32">
      <div className="flex flex-col items-center justify-center flex-1">
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
          One
          <span className="mx-2 skew-y-3 text-gradient"> platform </span>
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
          Explore Token & NFT launches with ease. Stay informed & track all the
          latest launches in one location.
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
      </div>
    </div>
  );
};

export default Hero;
