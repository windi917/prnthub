import { useEffect } from "react";
import { RPC_ENDPOINT } from "../config.ts";

const JupiterWidget = () => {
  useEffect(() => {
    const initializeJupiter = async () => {
      try {
        window.Jupiter.init({
          displayMode: "widget",
          endpoint: RPC_ENDPOINT,
          defaultExplorer: "Solscan",
          formProps: {
            swapMode: "ExactInOrOut",
          },
          containerClassName: "max-h-[90vh] lg:max-h-[600px]",
          widgetStyle: {
            position: "bottom-left", // 'bottom-left', 'top-left', 'top-right'
            size: "sm", // 'sm', 'md', 'lg'
          },
          // containerClassName: "jupiter-cont",
        });
        console.log("Jupiter initialized successfully");
      } catch (error) {
        console.error("Error initializing Jupiter:", error);
      }
    };

    initializeJupiter();
  }, []);

  return (
    <div
    // id="jupiter-terminal"
    // className="max-h-[90vh] lg:max-h-[600px] !bg-white w-full lg:w-[600px] overflow-hidden"
    ></div>
  );
};

export default JupiterWidget;
