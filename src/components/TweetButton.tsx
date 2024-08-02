import { motion } from "framer-motion";
import React from "react";
import { FaXTwitter } from "react-icons/fa6";

interface TweetButtonProps {
  projectName: string;
}

const TweetButton: React.FC<TweetButtonProps> = ({ projectName }) => {
  const handleTweet = () => {
    const tweetText = encodeURIComponent(
      `I just voted for ${projectName} on PRNTHub, by @printonsol!`
    );
    const twitterIntentUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;
    window.open(twitterIntentUrl, "_blank");
  };

  return (
    <motion.button
      onClick={handleTweet}
      className="px-2 py-2 text-white transition rounded bg-lime-300/70 hover:bg-lime-700"
    >
      <FaXTwitter />
    </motion.button>
  );
};

export default TweetButton;
