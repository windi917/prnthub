import React, { useEffect } from "react";
import NFTdata from "../NFTdata.json";
import Tokendata from "../TokenData.json";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Hero from "../components/Hero";
import Partners from "../components/Partners";
import ClientReviews from "../components/ClientReviews";
import Accordion from "../components/Accordion";

interface TokenLaunchProps {
  title: string;
  description: string;
  raised: string;
  image: string;
  BE_link: string;
}

interface CardProps {
  title: string;
  image: string;
  description: string;
  price: string;
  ME_link: string;
}

const Card: React.FC<CardProps> = ({
  title,
  image,
  description,
  price,
  ME_link,
}) => {
  const controls = useAnimation();
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      controls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, delay: 0.6 },
      });
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={controls}
      className="p-4 border-2 shadow-xl cursor-pointer bg-#FFFFF border-textclr2/70 card hover:scale-105 hover:shadow-2xl hover:shadow-textclr2"
    >
      <figure>
        <motion.img
          src={image}
          alt={title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="w-full"
        />
      </figure>
      <div className="px-2 pt-2.1 card-body text-slate-700/70">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="card-title font-primaryRegular text-textclr2"
        >
          {title}
        </motion.h2>
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="text-justify font-primaryBold text-textclr2"
        >
          Description:
        </motion.span>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.5 }}
          className="text-justify text-textclr"
        >
          {description}
        </motion.p>
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.8 }}
          className="font-primaryBold text-textclr2"
        >
          Price:
          <span className="text-textclr font-primaryRegular"> {price} </span>
        </motion.span>
        {/* -- ME Link -- */}
        <div className="justify-end card-actions">
          <a
            href={ME_link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-textclr2 hover:text-white/80"
          >
            <svg
              viewBox="0 0 23 12"
              className="w-6 h-6"
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
        </div>
        <div className="justify-end card-actions">
          {/* <button className="px-5 py-4 font-bold text-white transition duration-300 rounded-md shadow-md bg-btnbg/70 hover:bg-btnhover before:absolute before:right-0 before:top-0 before:h-12 before:w-6 before:translate-x-15 before:rotate-6 before:opacity-10 before:duration-700 hover:shadow-btnbg hover:before:-translate-x-40 hover:shadow-lg">
            Learn more
          </button> */}
        </div>
      </div>
      <div className="divider"></div>
    </motion.div>
  );
};

const TokenLaunch: React.FC<TokenLaunchProps> = ({
  title,
  description,
  raised,
  image,
  BE_link,
}) => {
  const controls = useAnimation();
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      controls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, delay: 0.6 },
      });
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={controls}
      className="p-4 border-2 shadow-2xl cursor-pointer bg-#FFFFF border-textclr2/70 card hover:scale-105 hover:shadow-2xl hover:shadow-textclr2"
    >
      <figure>
        <motion.img
          src={image}
          alt={title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="w-full"
        />
      </figure>
      <div className="px-2 pt-2 card-body text-textclr2">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="card-title font-primaryRegular text-textclr2"
        >
          {title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="text-textclr2 font-primaryBold"
        >
          Description:
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.5 }}
          className="text-textclr"
        >
          {description}
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.8 }}
          className="font-primaryBold text-textclr2"
        >
          Raised:
          <span className="font-primaryRegular text-textclr"> {raised} </span>
        </motion.p>
        {/* -- BirdEye Link -- */}
        <div className="justify-end card-actions">
          <a
            href={BE_link}
            className="text-textclr2 hover:text-white/80"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              className="w-[40px] h-[40px]"
              viewBox="0 0 50.8 50.8"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#CCF869"
                stroke="#000000"
                stroke-width="3.175"
                d="M27.01 25.454s11.556-7.81 12.018-7.346c3.918 3.934-.653 13.431-5.877 17.046 0 0 6.6 9.838 5.612 9.825-9.53-.123-24.812-5.941-24.812-17.743-1.45-.287-3.653-2.254-3.653-2.663 0-.47 3-1.209 4.57-1.557 3.919-6.352 10.22-2.836 12.142 2.438zm-14.098-9.143s5.877-10.49 7.182-10.49c1.306 0 7.183 10.49 7.183 10.49.653 1.311-.806 2.182-1.306 1.68-2.863-2.875-8.974-2.807-11.753 0-.499.504-1.959-.369-1.306-1.68z"
              />
              <ellipse
                cx="20.278"
                cy="25.611"
                fill="none"
                stroke="#000000"
                stroke-width="2.117"
                rx="2.428"
                ry="2.438"
              />
            </svg>
          </a>
        </div>
        <div className="justify-end card-actions">
          {/* <button className="px-5 py-4 font-bold text-white transition duration-300 rounded-md shadow-md bg-btnbg/70 hover:bg-btnhover before:absolute before:right-0 before:top-0 before:h-12 before:w-6 before:translate-x-15 before:rotate-6 before:opacity-10 before:duration-700 hover:shadow-btnbg hover:before:-translate-x-40 hover:shadow-lg">
            Learn more
          </button> */}
        </div>
      </div>
      <div className="divider"></div>
    </motion.div>
  );
};

// Main Renderer
const Homepage: React.FC = () => {
  return (
    <section className="relative w-full h-full min-h-screen bg-bg">
      {/* -- Hero Section --  */}
      <Hero />
      {/* -- Launhes Main Section --  */}
      <div className="container px-4 py-4 mx-auto">
        <motion.div
          className="mt-10 text-textclr2 text-[30px] font-primaryBold text-center lg:text-left"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            ease: "easeInOut",
            duration: 2,
            delay: 0.3,
          }}
          id="nft"
        >
          NFT Showcase!
        </motion.div>
        <div className="grid grid-cols-1 gap-6 p-2 m-2 mt-6 text-pretty md:grid-cols-2 lg:grid-cols-3">
          {NFTdata.map((item, index) => (
            <Card key={index} {...item} />
          ))}
        </div>
        <motion.div
          className="mt-10 text-textclr2 text-[30px] font-primaryBold text-center lg:text-left"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            ease: "easeInOut",
            duration: 2,
            delay: 0.4,
          }}
          id="token"
        >
          Featured launches!
        </motion.div>
        <div className="grid grid-cols-1 gap-6 p-2 m-2 mt-6 text-pretty md:grid-cols-2 lg:grid-cols-3">
          {Tokendata.map((item, index) => (
            <TokenLaunch key={index} {...item} />
          ))}
        </div>
      </div>
      {/* -- Partner's Section -- */}
      <Partners />
      {/* -- Client Reviews Section -- */}
      <ClientReviews />
      {/* -- FAQ Section -- */}
      <Accordion />
    </section>
  );
};

export default Homepage;
