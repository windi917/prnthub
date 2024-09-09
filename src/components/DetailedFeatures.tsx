import { motion } from "framer-motion";
import ParticleSwarm from "./ParticleSwarm";

const DetailedFeatures = () => {
  return (
    <>
      <section className="relative min-h-screen py-12 bg-black">
        <div className="px-4 mx-auto text-center max-w-7xl sm:px-6 lg:px-8">
          <motion.h1
            className="relative py-6 mx-auto mt-6 text-4xl text-transparent font-primaryBold md:text-4xl lg:text-6xl bg-clip-text bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-lime-600 dark:to-lime-200"
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              duration: 0.8,
              ease: "easeInOut",
              staggerChildren: 0.4,
            }}
          >
            <span className="absolute h-20 rounded-lg bg-lime-300 w-[10rem] mx-12 filter blur-3xl animate-pulse"></span>
            Vote to Innovate, <br /> Launch to Dominate
          </motion.h1>
          <div>
            <motion.div
              className="relative flex justify-center max-w-6xl mt-12 overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeInOut" }}
            >
              <video
                src="https://shdw-drive.genesysgo.net/6ckeAEwCjs6qjCTv5mghBfdwHkB5aCfTes9mqxbxb5EE/Create_Token.mp4"
                className="h-full w-full rounded-lg object-cover md:w-[1300px] shadow-lg border-lime-600 border-2"
                style={{
                  maskImage: `linear-gradient(to top, transparent, black 50%)`,
                }}
                controls
                autoPlay
                loop
                muted
              />
            </motion.div>
            <div className="py-12 space-y-8 text-2xl text-transparent font-primaryBold md:text-4xl lg:text-6xl bg-clip-text bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-lime-600 dark:to-lime-200">
              <motion.div
                className=""
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              >
                <h2 className="px-2 py-2 text-2xl tracking-tight text-left text-transparent text-pretty font-primaryBold md:text-4xl lg:text-6xl bg-clip-text bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-lime-400 dark:to-teal-400">
                  Tired of rugs, bundled, <br></br>botted launches?
                </h2>
                <p className="px-2 py-2 mt-2 text-lg tracking-wider text-left text-teal-300/75 font-primaryRegular">
                  We are here to change the game. 😎
                  <div className="flex-row justify-start">
                    <ParticleSwarm />
                  </div>
                </p>
              </motion.div>
              <motion.div
                className="p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut", delay: 0.2 }}
              >
                <h2 className="px-2 py-2 tracking-tight text-right text-transparent text-wrap font-primaryBold md:text-4xl lg:text-6xl bg-clip-text bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-lime-500 dark:to-teal-300">
                  Our platform is designed to be a one-stop shop for all your
                  launch needs
                </h2>
                <p className="px-2 py-2 mt-2 text-lg tracking-wider text-right text-teal-300/75 font-primaryRegular">
                  With our platform, you can easily create a token or an NFT
                  launch.
                  <div className="flex justify-end">
                    <ParticleSwarm />
                  </div>
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DetailedFeatures;
