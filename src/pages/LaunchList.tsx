import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Tabs, Tab } from "@mui/material";
import Box from "@mui/material/Box";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import ChecklistIcon from "@mui/icons-material/Checklist";
import ProjectCard from "../components/ProjectCard";
import { getAllData } from "../solana/transaction";
import { getPoolTokens, getProjects } from "../api/apis";
import { Oval } from "react-loader-spinner";
import ChecklistRtlIcon from "@mui/icons-material/ChecklistRtl";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import EventBusyIcon from "@mui/icons-material/EventBusy";
interface Presale {
  presaleKey: string;
  name: string;
  description: string;
  logo: string;
  owner: string;
  website: "https://apple.com";
  socials: {
    twitter: "#";
    telegram: "#";
  };
  state: string;
  base_mint: string;
  quote_mint: string;
  quote_symbol: string;
  min_allocation: number;
  max_allocation: number;
  hardcap: number;
  softcap: number;
  sale_price: number;
  launch_price: number;
  start_time: number;
  end_time: number;
  total_contributions: number;
  max_contribution: number;
}

const LaunchList = () => {
  const [value, setValue] = useState(0);
  const [presales, setPresales] = useState<Presale[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchProjects = useCallback(async () => {
    const projects = await getProjects();
    const poolTokenRes = await getPoolTokens();
    const presaleDatas = await getAllData();

    if (projects.success === false) return null;
    if (poolTokenRes.success === false) return null;
    if (!presaleDatas) return null;

    const presaleObjs: Presale[] = presaleDatas
      .map((e: any) => {
        const project = projects.projects.find(
          (item: any) => item.mint === e.base_mint
        );
        if (!project) return null;

        const poolToken = poolTokenRes.pooltokens.find(
          (item: any) => item.tokenMint === e.quote_mint
        );
        if (!poolToken) return null;

        const curTime = new Date();
        const startTime = new Date(e.start_time); // assuming e.start_time is in seconds
        const endTime = new Date(e.end_time); // assuming e.end_time is in seconds

        let state = "Pending";
        if (e.state === 0 && curTime < startTime) state = "Upcoming";
        if (e.state === 0 && curTime >= startTime && curTime < endTime)
          state = "Live";
        if (e.state === 0 && curTime >= endTime) state = "Ended";
        if (e.state === 1) state = "Approved";
        if (e.state === 2) state = "Closed";

        return {
          presaleKey: e.presaleKey,
          name: project.name,
          description: project.description,
          logo: project.logoURL,
          owner: e.owner,
          website: "#",
          socials: {
            twitter: "#",
            telegram: "#",
          },
          state: state,
          base_mint: e.base_mint,
          quote_mint: e.quote_mint,
          quote_symbol: poolToken.name,
          min_allocation: e.min_allocation / 10 ** poolToken.decimals,
          max_allocation: e.max_allocation / 10 ** poolToken.decimals,
          hardcap: e.hardcap / 10 ** poolToken.decimals,
          softcap: e.softcap / 10 ** poolToken.decimals,
          sale_price: e.sale_price / 10 ** poolToken.decimals,
          launch_price: e.launch_price / 10 ** poolToken.decimals,
          start_time: e.start_time,
          end_time: e.end_time,
          total_contributions: e.total_contributions / 10 ** poolToken.decimals,
          max_contribution: e.max_contribution,
        };
      })
      .filter((presale: any): presale is Presale => presale !== null);

    setPresales(presaleObjs);
  }, [setPresales]);

  useEffect(() => {
    setLoading(true);
    fetchProjects();
    setLoading(false);
  }, [fetchProjects]);

  const handleChange = (
    _event: React.SyntheticEvent,
    newValue: React.SetStateAction<number>
  ) => {
    setValue(newValue);
  };

  const filteredProjects = presales.filter((presale) => {
    // Filter projects based on tab selection
    switch (value) {
      case 0: // All
        return true;
      case 1: // Upcoming
        return presale.state === "Upcoming";
      case 2: // Live
        return presale.state === "Live";
      case 3: // Ended
        return presale.state === "Ended";
      case 4: // Approved
        return presale.state === "Approved";
      case 5: // Closed
        return presale.state === "Closed";
      default:
        return true;
    }
  });

  return (
    <>
      <section className="min-h-screen p-4 bg-radial-gradient pt-20">
        <motion.div
          className="px-6 py-6 mx-auto shadow-lg rounded-2xl bg-white/10 min-w-fit"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl leading-6 font-primaryBold text-textclr2">
            Launch List
          </h1>
          <p className="mt-2 text-lg text-textclr2/50 font-primaryRegular">
            Find out about the Live , Upcoming & current Projects.
          </p>
        </motion.div>
        <Box className="w-full pt-4">
          {/* <Box className="flex items-center justify-center py-2 mt-4 place-items-center rounded-2xl w-fit item-center bg-white/5"> */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Tabs
              value={value}
              onChange={handleChange}
              centered
              aria-label="Launch List Tabs"
              sx={{
                "& .MuiTab-root": {
                  color: "#CCF869 !important",
                  textTransform: "capitalize",
                  fontFamily: "Regular",
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "#CCF869 !important", // indicator color
                },
              }}
            >
              <Tab icon={<TaskAltIcon />} label="All" />
              <Tab icon={<ChecklistIcon />} label="Live" />
              <Tab icon={<PlayCircleFilledWhiteIcon />} label="Upcoming" />
              <Tab icon={<CheckBoxIcon />} label="Approved" />
              <Tab icon={<ChecklistRtlIcon />} label="Ended" />
              <Tab icon={<EventBusyIcon />} label="Closed" />
            </Tabs>
          </motion.div>
        </Box>
        <motion.div
          className="flex flex-wrap justify-center gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {filteredProjects.map((project) => (
            <ProjectCard key={project.presaleKey} project={project} />
          ))}
        </motion.div>

        {loading ? (
          <>
            <Oval
              height="80"
              visible={true}
              width="80"
              color="#CCF869"
              ariaLabel="oval-loading"
              wrapperStyle={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          </>
        ) : null}
      </section>
    </>
  );
};

export default LaunchList;
