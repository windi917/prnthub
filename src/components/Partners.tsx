import { motion } from "framer-motion";

const helio_logo =
  "https://shdw-drive.genesysgo.net/6ckeAEwCjs6qjCTv5mghBfdwHkB5aCfTes9mqxbxb5EE/2h.png";

const rayd_logo =
  "https://shdw-drive.genesysgo.net/6ckeAEwCjs6qjCTv5mghBfdwHkB5aCfTes9mqxbxb5EE/5r.png";

const birde_logo =
  "https://shdw-drive.genesysgo.net/6ckeAEwCjs6qjCTv5mghBfdwHkB5aCfTes9mqxbxb5EE/3b.png";

const ME_logo =
  "https://shdw-drive.genesysgo.net/6ckeAEwCjs6qjCTv5mghBfdwHkB5aCfTes9mqxbxb5EE/4m.png";

const anybod_logo =
  "https://shdw-drive.genesysgo.net/6ckeAEwCjs6qjCTv5mghBfdwHkB5aCfTes9mqxbxb5EE/1a.png";

const sniper_logo =
  "https://shdw-drive.genesysgo.net/6ckeAEwCjs6qjCTv5mghBfdwHkB5aCfTes9mqxbxb5EE/6s.png";

const assetd_logo =
  "https://shdw-drive.genesysgo.net/6ckeAEwCjs6qjCTv5mghBfdwHkB5aCfTes9mqxbxb5EE/7a.png";

const Partners = () => {
  return (
    <>
      <div className="bg-radial-gradient">
        <div className="h-auto px-4 py-12 mx-auto text-center md:max-w-screen-md lg:max-w-screen-lg">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-3xl text-textclr2 font-primaryBold"
          >
            Our Partners
          </motion.span>
          <motion.div
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
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Partners;
