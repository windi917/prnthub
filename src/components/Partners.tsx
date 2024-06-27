import { motion } from "framer-motion";

const logos = [
  {
    name: "helio_logo",
    url: "https://shdw-drive.genesysgo.net/6ckeAEwCjs6qjCTv5mghBfdwHkB5aCfTes9mqxbxb5EE/2h.png",
  },
  {
    name: "rayd_logo",
    url: "https://shdw-drive.genesysgo.net/6ckeAEwCjs6qjCTv5mghBfdwHkB5aCfTes9mqxbxb5EE/5r.png",
  },
  {
    name: "birde_logo",
    url: " https://shdw-drive.genesysgo.net/6ckeAEwCjs6qjCTv5mghBfdwHkB5aCfTes9mqxbxb5EE/3b.png",
  },
  {
    name: "ME_logo",
    url: " https://shdw-drive.genesysgo.net/6ckeAEwCjs6qjCTv5mghBfdwHkB5aCfTes9mqxbxb5EE/4m.png",
  },
  {
    name: "anybod_logo",
    url: "https://shdw-drive.genesysgo.net/6ckeAEwCjs6qjCTv5mghBfdwHkB5aCfTes9mqxbxb5EE/1a.png",
  },

  {
    name: "sniper_logo",
    url: "https://shdw-drive.genesysgo.net/6ckeAEwCjs6qjCTv5mghBfdwHkB5aCfTes9mqxbxb5EE/6s.png",
  },
  {
    name: "assetd_logo",
    url: "https://shdw-drive.genesysgo.net/6ckeAEwCjs6qjCTv5mghBfdwHkB5aCfTes9mqxbxb5EE/7a.png",
  },
];

const Partners = () => {
  return (
    <>
      <div className="bg-radial-gradient">
        <div className="h-auto px-1 py-16 mx-auto mt-12 text-center rounded-2xl bg-white/30 md:max-w-screen-md lg:max-w-screen-lg">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-3xl text-textclr2 font-primaryBold"
          >
            Our Partners
          </motion.span>
          <motion.div
            className="w-full py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="w-full px-4 mx-auto md:px-8">
              <div
                className="relative flex gap-6 p-2 mt-6 overflow-hidden h-fit group"
                style={{
                  maskImage:
                    "linear-gradient(to left, transparent 0%, black 20%, transparent 95%)",
                }}
              >
                {Array(5)
                  .fill(null)
                  .map((index) => (
                    <div
                      key={index}
                      className="flex flex-row justify-around gap-6 shrink-0 animate-logo-cloud"
                    >
                      {logos.map((logo, key) => (
                        <img
                          key={key}
                          src={logo.url}
                          className="h-16 px-2 w-fit dark:invert"
                          alt={`${logo.name}`}
                        />
                      ))}
                    </div>
                  ))}
              </div>
            </div>
          </motion.div>
          {/* <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.8 }}
            className="flex flex-wrap items-center cursor-pointer justify-center gap-[1.8vw] my-6 sm:justify-between"
          >
            <motion.img
              src={helio_logo}
              alt="Helio Logo"
              height={100}
              width={120}
              whileHover={{ scale: 1.5 }}
              whileTap={{ scale: 0.9 }}
            />
            <motion.img
              src={rayd_logo}
              alt="raydium Logo"
              height={100}
              width={120}
              whileHover={{ scale: 1.5 }}
              whileTap={{ scale: 0.9 }}
            />
            <motion.img
              src={birde_logo}
              alt="Birdeye Logo"
              height={100}
              width={120}
              whileHover={{ scale: 1.5 }}
              whileTap={{ scale: 0.9 }}
            />
            <motion.img
              src={ME_logo}
              alt="ME Logo"
              height={130}
              width={150}
              whileHover={{ scale: 1.5 }}
              whileTap={{ scale: 0.9 }}
            />
            <motion.img
              src={anybod_logo}
              alt="anybodies Logo"
              height={100}
              width={120}
              whileHover={{ scale: 1.5 }}
              whileTap={{ scale: 0.9 }}
            />
            <motion.img
              src={assetd_logo}
              alt="assetdash Logo"
              height={100}
              width={120}
              whileHover={{ scale: 1.5 }}
              whileTap={{ scale: 0.9 }}
            />
            <motion.img
              src={sniper_logo}
              alt="sniperz Logo"
              height={100}
              width={120}
              whileHover={{ scale: 1.5 }}
              whileTap={{ scale: 0.9 }}
            />
          </motion.div> */}
        </div>
      </div>
    </>
  );
};

export default Partners;
