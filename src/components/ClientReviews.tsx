import { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

const TestimonialCard = ({ testimonial }: { testimonial: any }) => {
  const { ref, inView } = useInView();
  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      className="p-8 border-4 border-double rounded-lg shadow-2xl cursor-pointer border-textclr2 bg-bg/70 card"
      initial="hidden"
      animate={controls}
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 50 },
      }}
      transition={{ duration: 1.5 }}
    >
      <p className="leading-loose font-primaryRegular text-textclr dark:text-textclr">
        {testimonial.quote}
      </p>

      <div className="flex items-center mx-2 mt-8">
        <img
          className="object-cover mx-2 rounded-full w-14 text-textclr2 shrink-0 h-14 ring-4 ring-teal-600/70"
          src={testimonial.image}
          alt={testimonial.name}
        />

        <div className="mx-2">
          <h1 className="font-semibold text-textclr2 dark:text-black">
            {testimonial.name}
          </h1>
          <span className="text-sm text-textclr">{testimonial.role}</span>
        </div>
      </div>
    </motion.div>
  );
};

const ClientReviews = () => {
  const testimonials = [
    {
      quote:
        "$PRNT team have made an extremely good example & set a high bar how WEB-3 projects / companies should work like with their customers. I can freely say that their team were able to help our project Fuddles NFT collection of 1111 NFTs sell out within a day! Their availability & constant communication is on another level.",
      name: "Dem",
      role: "Fouder, Fuddles",
      image:
        "https://shdw-drive.genesysgo.net/EHYJeNPjwkkTr9Bv46eymGgT9p6GqVVvMjB3KRCHHiEK/Fuddles-logo.jpg",
    },
    {
      quote:
        "The $PRNT team is one of the most professional, organized and knowledgeable teams that we have ever worked with. With their help, we were able to navigate the complex Solana ecosystem to launch our NFT and Token. We appreciate their guidance and recommend their services to anyone looking to launch.",
      name: "Overlord",
      role: "Founder, Dragon Sanctuary",
      image:
        "https://shdw-drive.genesysgo.net/HA2mevVhNQSzcCFtFxdvJVvfz1GvW18VD47HFvaPbkYP/ds.jpg",
    },
    {
      quote:
        "$PRNT was extremely cooperative for launching our project and the entire process was extremely smooth. The team was active and responded to our concerns and questions 24/7! ❤️ Any potential client will not regret working with the team over at $PRNT 🚀 as they are a great set of people to work with!.",
      name: "Zyke",
      role: "CEO, Suits Syndicate",
      image:
        "https://shdw-drive.genesysgo.net/BtDnViiMBmbxCzT7c4VNvnjqDSBMQxAHEHZ7Ve2e1cxt/Loop.gif",
    },
  ];

  return (
    <section className="bg-bg">
      <div className="container px-6 py-10 mx-auto ">
        <motion.h1
          className="text-2xl text-center capitalize font-primaryBold text-textclr2 lg:text-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            ease: "easeInOut",
            duration: 2,
            delay: 0.4,
          }}
        >
          What our <span className="text-textclr">clients</span> say
        </motion.h1>

        <motion.p
          className="max-w-2xl mx-auto mt-6 text-center font-primaryRegular text-textclr dark:text-slate-800/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            ease: "easeInOut",
            duration: 2,
            delay: 0.4,
          }}
        >
          Some of the review's from our clients who have worked with us.
        </motion.p>

        <section className="grid grid-cols-1 gap-8 mt-8 xl:mt-12 lg:grid-cols-2 xl:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </section>
      </div>
    </section>
  );
};

export default ClientReviews;
