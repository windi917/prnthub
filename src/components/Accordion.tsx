import { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

const Accordion = () => {
  const { ref, inView } = useInView();
  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <section className="flex flex-col items-center justify-center py-6 md:py-10 bg-bg">
      <motion.div
        ref={ref}
        className="p-4 mb-2 text-3xl text-textclr2 font-primaryBold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          ease: "easeInOut",
          duration: 2,
          delay: 0.4,
        }}
      >
        <span className="absolute rounded-full h-14 w-44 bg-btnbg/50 filter blur-3xl animate-bounce"></span>
        FAQ
      </motion.div>
      <motion.div
        className="py-2 mb-4 font-primaryRegular text-textclr"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          ease: "easeInOut",
          duration: 1.4,
          delay: 0.3,
        }}
      >
        Some of the frequently asked questions!
      </motion.div>

      <motion.div
        className="w-full lg:max-w-6xl max-w-[calc(100%-3rem)] min-h-auto mb-4 border collapse collapse-arrow bg-btnbg/20 font-primaryBold border-slate-800/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          ease: "easeInOut",
          duration: 2,
          delay: 0.4,
        }}
      >
        <input type="radio" name="my-accordion-2" defaultChecked />
        <div className="text-xl font-medium text-textclr2 collapse-title">
          1. What is <b>Prnt Hub</b>?
        </div>
        <div className="collapse-content">
          <p className="font-primaryRegular text-textclr text-pretty">
            <b>Prnt Hub</b> is a comprehensive platform designed to streamline
            the process of launching NFTs (Non-Fungible Tokens) & conducting
            token sales. It provides creators, artists, & projects with the
            tools & resources needed to mint, launch their projects on the
            Solana Blockchain.
          </p>
        </div>
      </motion.div>

      <motion.div
        className="w-full max-w-[calc(100%-3rem)] lg:max-w-6xl mb-4 border collapse collapse-arrow bg-btnbg/20  font-primaryBold border-slate-800/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          ease: "easeInOut",
          duration: 2,
          delay: 0.4,
        }}
      >
        <input type="radio" name="my-accordion-2" />
        <div className="text-xl font-medium text-textclr2 collapse-title">
          2. How does <b>Prnt Hub</b> help with NFT launches?
        </div>
        <div className="collapse-content">
          <p className="font-primaryRegular text-textclr text-pretty">
            <b>Prnt Hub</b> offers a user-friendly interface & robust features
            for minting NFTs. Creators can share the project details & assets,
            with us via our applicaiton form. We will check back review the
            details & guide you through the process of minting & launching your
            NFTs on our platform. We provide personalized assistance & support
            to help you launch your NFTs successfully.
          </p>
        </div>
      </motion.div>

      <motion.div
        className="w-full max-w-[calc(100%-3rem)] lg:max-w-6xl mb-4 border collapse collapse-arrow bg-btnbg/20  font-primaryBold border-slate-800/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          ease: "easeInOut",
          duration: 2,
          delay: 0.4,
        }}
      >
        <input type="radio" name="my-accordion-2" />
        <div className="text-xl font-medium text-textclr2 collapse-title">
          3. How does <b>Prnt Hub</b> help with Token launches?
        </div>
        <div className="collapse-content">
          <p className="font-primaryRegular text-textclr text-pretty">
            <b>Prnt Hub</b> offers a streamlined process for launching tokens.
            We recommend methods & guide you with the tokenomics, marketing to
            liquidity pool management, graphics & much more. We provide
            personalized assistance & support to help you launch your tokens
            successfully.
          </p>
        </div>
      </motion.div>

      <motion.div
        className="w-full max-w-[calc(100%-3rem)] lg:max-w-6xl mb-4 border collapse collapse-arrow bg-btnbg/20  font-primaryBold border-slate-800/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          ease: "easeInOut",
          duration: 2,
          delay: 0.4,
        }}
      >
        <input type="radio" name="my-accordion-2" />
        <div className="text-xl font-medium text-textclr2 collapse-title">
          4. What is the purpose of a token launch?
        </div>
        <div className="collapse-content">
          <p className="font-primaryRegular text-textclr text-pretty">
            The main purpose of a token launch is to raise capital to fund the
            development & growth of a project or platform. It also helps
            distribute the project's native tokens to a wide range of investors,
            which can help increase liquidity & adoption.
          </p>
        </div>
      </motion.div>

      <motion.div
        className="w-full max-w-[calc(100%-3rem)] lg:max-w-6xl mb-4 border collapse collapse-arrow bg-btnbg/20  font-primaryBold border-slate-800/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          ease: "easeInOut",
          duration: 2,
          delay: 0.4,
        }}
      >
        <input type="radio" name="my-accordion-2" />
        <div className="text-xl font-medium text-textclr2 collapse-title">
          5. How do I get started with launching NFTs launches on{" "}
          <b>Prnt Hub</b>?
        </div>
        <div className="collapse-content">
          <p className="font-primaryRegular text-textclr text-pretty">
            To initiate an NFT launch, simply fill out the form available{" "}
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSdCiZfRgREdOLw6hEYWMfukMzkf4LoHItJXedWEt-Kd1_ZE7w/viewform"
              className="text-textclr2 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              here
            </a>
            . Our team will review your submission & guide you through the
            process of minting & launching your NFTs on our platform. If you
            need assistance feel free to reach out to us on{" "}
            <a
              href="https://discord.com/invite/prntonsol"
              className="text-textclr2 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Discord
            </a>{" "}
            or{" "}
            <a
              href="https://twitter.com/printonsol"
              className="text-textclr2 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Twitter
            </a>{" "}
            to discuss your project's requirements & schedule a consultation
            with our team. We'll provide personalized assistance & support to
            help you launch your project successfully!
          </p>
        </div>
      </motion.div>

      <motion.div
        className="w-full max-w-[calc(100%-3rem)] lg:max-w-6xl mb-4 border collapse collapse-arrow bg-btnbg/20  font-primaryBold border-slate-800/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          ease: "easeInOut",
          duration: 2,
          delay: 0.4,
        }}
      >
        <input type="radio" name="my-accordion-2" />
        <div className="text-xl font-medium text-textclr2 collapse-title">
          6. What blockchain networks does <b>Prnt Hub</b> support for NFT &
          token launches?
        </div>
        <div className="collapse-content">
          <p className="font-primaryRegular text-textclr text-pretty">
            <b>Prnt Hub</b> currently supports the Solana blockchain for NFT
            minting & token sales. Our platform is optimized to leverage
            Solana's high throughput & low transaction fees, providing users
            with an efficient & cost-effective solution for launching their
            digital assets. <br />
            We are committed to providing the best experience for our users and
            are happy to assist with any inquiries or support related to NFT &
            token launches. Our dedicated team is here to help you navigate the
            process & unleash the full potential of your projects.
          </p>
        </div>
      </motion.div>

      <motion.div
        className="w-full max-w-[calc(100%-3rem)] lg:max-w-6xl mb-4 border collapse collapse-arrow bg-btnbg/20  font-primaryBold border-slate-800/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          ease: "easeInOut",
          duration: 2,
          delay: 0.4,
        }}
      >
        <input type="radio" name="my-accordion-2" />
        <div className="text-xl font-medium text-textclr2 collapse-title">
          7. Are there any risks associated with NFT or Token launches?
        </div>
        <div className="collapse-content">
          <p className="font-primaryRegular text-textclr text-pretty">
            As with any investment or digital transaction, there are risks
            associated with all types of launches. It's essential to conduct due
            diligence on the project, the creator, & the platform hosting the
            launch to mitigate risks of fraud or scams.
          </p>
        </div>
      </motion.div>

      {/* Brief mention of Voting-based Launching */}
      <motion.div
        className="w-full max-w-[calc(100%-3rem)] lg:max-w-6xl mb-4 border collapse collapse-arrow bg-btnbg/20  font-primaryBold border-slate-800/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          ease: "easeInOut",
          duration: 2,
          delay: 0.4,
        }}
      >
        <input type="radio" name="my-accordion-2" />
        <div className="text-xl font-medium text-textclr2 collapse-title">
          8. How do I launch my token ?
        </div>
        <div className="collapse-content">
          <p className="font-primaryRegular text-textclr text-pretty">
            <b>Prnt Hub</b> also offers voting-based launching, where community
            members can participate in the decision-making process for new token
            projects. This democratic approach allows for transparent and
            community-driven launches, fostering engagement and trust among
            project stakeholders.
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default Accordion;
