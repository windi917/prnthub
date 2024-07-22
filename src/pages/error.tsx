import { motion } from "framer-motion";

const ErrorPage = () => {
  return (
    <>
      <div className="h-screen px-12 py-10 pt-20 bg-radial-gradient">
        <motion.div
          className="px-6 py-6 mx-auto border shadow-lg rounded-2xl bg-white/10 min-w-fit border-textclr2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          layout
        >
          <h1 className="text-4xl font-primaryBold text-textclr2">
            Error 404!
          </h1>
        </motion.div>
      </div>
    </>
  );
};

export default ErrorPage;
