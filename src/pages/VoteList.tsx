// import React from "react";
import { motion } from "framer-motion";
import TokenCard from "../components/TokenCard";
import { Drawer } from "vaul";

const projects = [
  {
    projectLogo:
      "https://shdw-drive.genesysgo.net/6ckeAEwCjs6qjCTv5mghBfdwHkB5aCfTes9mqxbxb5EE/hubx.png",
    projectName: "PRIME",
    projectDesc:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque dapibus leo eget volutpat imperdiet. Nam placerat, massa a facilisis vestibulum, velit mauris convallis mi, a tempus dui nulla eget purus. Fusce laoreet quis justo et elementum. In dapibus est vehicula magna efficitur sollicitudin. Praesent mollis mi non convallis dictum. ",
    socials: ["https://twitter.com/", "https://google.com/"],
    status: "Active",
  },
  {
    projectLogo:
      "https://shdw-drive.genesysgo.net/6ckeAEwCjs6qjCTv5mghBfdwHkB5aCfTes9mqxbxb5EE/hubx.png",
    projectName: "SLERF",
    projectDesc:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque dapibus leo eget volutpat imperdiet. Nam placerat, massa a facilisis vestibulum, velit mauris convallis mi, a tempus dui nulla eget purus. Fusce laoreet quis justo et elementum. In dapibus est vehicula magna efficitur sollicitudin. Praesent mollis mi non convallis dictum. ",
    socials: ["https://twitter.com/", "https://google.com/"],
    status: "Completed",
  },
  {
    projectLogo:
      "https://shdw-drive.genesysgo.net/6ckeAEwCjs6qjCTv5mghBfdwHkB5aCfTes9mqxbxb5EE/hubx.png",
    projectName: "TEST",
    projectDesc:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque dapibus leo eget volutpat imperdiet. Nam placerat, massa a facilisis vestibulum, velit mauris convallis mi, a tempus dui nulla eget purus. Fusce laoreet quis justo et elementum. In dapibus est vehicula magna efficitur sollicitudin. Praesent mollis mi non convallis dictum. ",
    socials: ["https://twitter.com/", "https://google.com/"],
    status: "Completed",
  },
  {
    projectLogo:
      "https://shdw-drive.genesysgo.net/6ckeAEwCjs6qjCTv5mghBfdwHkB5aCfTes9mqxbxb5EE/hubx.png",
    projectName: "TEST",
    projectDesc:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque dapibus leo eget volutpat imperdiet. Nam placerat, massa a facilisis vestibulum, velit mauris convallis mi, a tempus dui nulla eget purus. Fusce laoreet quis justo et elementum. In dapibus est vehicula magna efficitur sollicitudin. Praesent mollis mi non convallis dictum. ",
    socials: ["https://twitter.com/", "https://google.com/"],
    status: "Completed",
  },
  {
    projectLogo:
      "https://shdw-drive.genesysgo.net/6ckeAEwCjs6qjCTv5mghBfdwHkB5aCfTes9mqxbxb5EE/hubx.png",
    projectName: "TEST",
    projectDesc:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque dapibus leo eget volutpat imperdiet. Nam placerat, massa a facilisis vestibulum, velit mauris convallis mi, a tempus dui nulla eget purus. Fusce laoreet quis justo et elementum. In dapibus est vehicula magna efficitur sollicitudin. Praesent mollis mi non convallis dictum. ",
    socials: ["https://twitter.com/", "https://google.com/"],
    status: "Completed",
  },
  // Add more projects
];

const VoteList = (index: any) => {
  return (
    <section className="bg-radial-gradient dark:bg-bg ">
      <motion.div
        className="flex justify-center min-h-screen"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        layout
      >
        <div className="min-h-screen p-2 text-textclr2">
          <div className="max-w-6xl mx-auto">
            <motion.h1
              className="my-4 mb-4 text-4xl text-center font-primaryBold"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              layout
            >
              Vote List
            </motion.h1>
            <p className="mb-4 text-center">
              Vote for your favourite projects.
              <br />
              <span className="font-primaryRegular">
                Start:
                <span className="text-textclr"> 25 May 2024, 22:33 PM</span>
                {/*Hardcoded date */}
              </span>
              <br />
              <span className="font-primaryRegular">
                End:
                <span className="text-textclr"> 5 June 2024, 22:33 PM</span>
                {/*Hardcoded date */}
              </span>
            </p>
            <motion.div
              className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
              initial={{
                opacity: 0,
                // if odd index card,slide from right instead of left
                x: index % 2 === 0 ? 50 : -50,
              }}
              whileInView={{
                opacity: 1,
                x: 0, // Slide in to its original position
                transition: {
                  duration: 1.5, // Animation duration
                },
              }}
              viewport={{ once: true }}
            >
              {projects.map((project, index) => (
                <TokenCard
                  key={index}
                  projectName={project.projectName}
                  projectLogo={project.projectLogo}
                  projectDesc={project.projectDesc}
                  socials={project.socials}
                  status={project.status as "Active" | "Completed"} // Add 'as "Active" | "Completed"' to ensure the correct type
                />
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>
      <Drawer.Root>
        <Drawer.Trigger asChild>
          <div className="flex items-center justify-center">
            <div className="btn btn-ghost text-textclr2/40 hover:text-textclr/20">
              Disclaimer
            </div>
          </div>
        </Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/80" />
          <Drawer.Content className="bg-gray-700/80 flex flex-col rounded-t-[10px] mt-24 fixed bottom-0 left-0 right-0">
            <div className="p-2 rounded-t-[10px] flex-1">
              <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-btnbg mb-2" />
              <div className="max-w-md mx-auto">
                <Drawer.Title className="mb-4 text-2xl text-center text-textclr font-primaryBold">
                  Disclaimer
                </Drawer.Title>
                <p className="px-4 py-4 mb-2 text-sm leading-5 border-4 rounded-e-badge font-primaryRegular border-textclr2 text-textclr2 text-pretty">
                  <i>
                    The information provided about tokens is for informational
                    purposes only & should not be considered financial advice.
                    Investing in tokens carries risks, including market
                    volatility & potential loss of investment. It's crucial to
                    conduct thorough research and seek professional advice
                    before investing. Please ensure you review all the details
                    of each project before casting your vote.
                  </i>
                </p>
                <p className="px-4 py-4 mb-2 text-sm leading-5 border-4 text-textclr2 font-primaryRegular rounded-e-badge border-textclr2">
                  <i>
                    We <b>"PRNT"</b> do not endorse the accuracy of token claims
                    or investment opportunities mentioned. Users should exercise
                    caution when engaging in its related activities.
                  </i>
                </p>
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </section>
  );
};

export default VoteList;
