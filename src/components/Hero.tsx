import { motion } from "framer-motion";
import {
  BallotTwoTone,
  MonetizationOn,
  HowToVote,
  Waves,
  AutoStories,
  EditNote,
  DesignServices,
  Spa,
  RocketLaunch,
  AdsClick,
} from "@mui/icons-material/";

// const hub =
//   "https://shdw-drive.genesysgo.net/6ckeAEwCjs6qjCTv5mghBfdwHkB5aCfTes9mqxbxb5EE/hubx.png";

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

const featureData = [
  {
    icon: <BallotTwoTone fontSize="large" className="text-btnbg" />,
    title: "Community-Driven Launch",
    subFeatures: [
      {
        icon: <BallotTwoTone fontSize="large" className="text-btnbg/70" />,
        title: "Vote for Your Project",
        description:
          "Participate and cast your vote for your favorite projects. select your project & vote for it.",
      },
      {
        icon: <HowToVote fontSize="large" className="text-btnbg/70" />,
        title: "Highest Voted Project Wins",
        description:
          "The project with the highest votes gets launched on our platform automatically.",
      },
      {
        icon: <AdsClick fontSize="large" className="text-btnbg " />,
        title: "Featured Project Spotlight",
        description:
          "Earn exclusive visibility as our featured project, chosen based on community votes.",
      },
    ],
  },
  {
    icon: <MonetizationOn fontSize="large" className="text-btnbg" />,
    title: "Token Presale",
    subFeatures: [
      {
        icon: <MonetizationOn fontSize="large" className="text-btnbg/70" />,
        title: "Presale Setup",
        description:
          "Quickly configure your token's presale with our easy-to-use tools.",
      },
      {
        icon: <Waves fontSize="large" className="text-btnbg" />,
        title: "LP Funding Creator",
        description:
          "Create liquidity pools effortlessly with our integrated solutions.",
      },
      {
        icon: <AutoStories fontSize="large" className="text-btnbg" />,
        title: "Market ID Creator",
        description:
          "Generate market IDs for your projects seamlessly by integrating our platform.",
      },
    ],
  },
  {
    icon: <EditNote fontSize="large" className="text-btnbg" />,
    title: "NFT Launches",
    subFeatures: [
      {
        icon: <EditNote fontSize="large" className="text-btnbg/70" />,
        title: "NFT Creator",
        description:
          "Bring your NFT project to life with our expert assistance from design to launch.",
      },
      {
        icon: <DesignServices fontSize="large" className="text-btnbg" />,
        title: "Custom Mint Site",
        description:
          "Get a unique mint site tailored for your NFT project to ensure a successful launch.",
      },
      {
        icon: <Spa fontSize="large" className="text-btnbg" />,
        title: "Prnt Cares",
        description:
          "Supporting NFT projects by minimizing fees. We help smaller projects launch for free or with reduced fees.",
      },
    ],
  },
];

const Hero = () => {
  return (
    <>
      <div className="flex flex-col px-4 py-8 min-h-[335px] min-w-screen lg:flex-row bg-radial-gradient lg:py-16 lg:px-32">
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
            className="text-4xl tracking-wide text-center font-primaryBold text-textclr"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              ease: "easeInOut",
              duration: 2,
              delay: 0.4,
            }}
          >
            {" "}
            One{" "}
            <span className="relative mx-2 transform -skew-y-3 text-gradient circular-line">
              {" "}
              <span className="absolute h-20 rounded-lg bg-[#9bd186] min-w-20 mx-12 filter blur-3xl"></span>
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
        </div>
      </div>

      {/* --- Our Features Section --- */}
      <div className="max-w-6xl px-4 py-16 mx-auto text-center bg-black/10">
        <div className="flex items-center justify-center mb-12 ">
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.2, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="absolute rounded-full h-14 w-44 bg-btnbg filter blur-md animate-bounce"
            />
            <div className="relative">
              <RocketLaunch className="size-24 text-textclr2" />
            </div>
          </div>
          <div className="ml-6 tracking-wide text-left">
            <h2 className="mb-2 text-2xl font-primaryRegular text-textclr2/70">
              Why Choose Us
            </h2>
            <h3 className="mb-4 text-4xl text-textclr font-primaryBold">
              Our Features
            </h3>
          </div>
        </div>
        {/* <p className="mb-12 text-slate-400/70">
          Check out our core features that make us stand out from the rest.
        </p> */}
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-2">
          {featureData.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="p-6 transition-transform duration-300 ease-in-out shadow-lg rounded-xl bg-white/5 backdrop-blur-lg hover:scale-105 hover:shadow-2xl hover:shadow-textclr2/60"
            >
              <div className="flex items-center mb-6 space-x-">
                <div className="relative">
                  <div className="absolute mr-4 rounded-full bg-gradient-to-bl animate-spin filter from-btnbg/70 via-teal-300/60 to-btnbg size-16 blur-xl" />
                  <div className="flex items-center justify-center gap-2 rounded shadow-2xl bg-white/5">
                    {feature.icon}
                  </div>
                </div>
                <h4 className="ml-2 text-2xl tracking-tight font-primaryBold text-textclr">
                  {feature.title}
                </h4>
              </div>
              <div className="space-y-4">
                {feature.subFeatures.map((subFeature, subIndex) => (
                  <motion.div
                    key={subIndex}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.9, delay: subIndex * 0.1 }}
                    className="flex items-start space-x-3"
                  >
                    <div className="text-btnbg/70">{subFeature.icon}</div>
                    <div>
                      <h5 className="flex items-start tracking-wide font-primaryBold text-textclr2">
                        {subFeature.title}
                      </h5>
                      <p className="flex tracking-wide text-justify item-start font-primaryRegular text-white/40 md:text-md sm:text-sm">
                        {subFeature.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Hero;
