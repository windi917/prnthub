import { motion } from "framer-motion";

const ContactPage = () => {
  return (
    <>
      <div className="h-screen px-12 py-10 bg-radial-gradient">
        <motion.form
          className="px-6 py-6 mx-auto rounded-2xl bg-white/10 min-w-fit"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          layout
        >
          <h1 className="text-4xl font-primaryBold text-textclr2">
            Contact Page
          </h1>
          <form className="mt-8">
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block mb-2 text-lg text-textclr2 font-primaryBold"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-4 py-2 text-gray-800 bg-white rounded-lg font-primaryRegular"
                placeholder="Name"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block mb-2 text-lg text-textclr2 font-primaryBold"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 text-gray-800 bg-white rounded-lg font-primaryRegular"
                placeholder="Email"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="message"
                className="block mb-2 text-lg text-textclr2 font-primaryBold"
              >
                Message
              </label>
              <textarea
                id="message"
                className="w-full px-4 py-2 text-gray-800 bg-white rounded-lg font-primaryRegular"
                placeholder="Let us know how we can help you!"
                rows={4}
              ></textarea>
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-md btn text-slate-500 bg-textclr2/90 hover:bg-textclr2/60 focus:outline-none focus:bg-textclr2"
            >
              Submit
            </button>
          </form>
        </motion.form>
      </div>
    </>
  );
};

export default ContactPage;
