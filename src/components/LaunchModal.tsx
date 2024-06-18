// src/components/Modal.tsx
import React, { useState, useEffect, useCallback, useContext } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

import { getProjects, setTokenMint } from "../api/apis";
import { createToken, initializeBundlr, uploadMetadata } from "../utils/WebIntegration";
import { toast } from "react-toastify";
import { WebBundlr } from "@bundlr-network/client";
import { Oval } from "react-loader-spinner";
import { JwtTokenContext } from "../contexts/JWTTokenProvider";

interface ModalProps {
  setApproveShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  projectId: number;
  setProjectStatus: React.Dispatch<React.SetStateAction<"PENDING"
    | "VOTING"
    | "APPROVED"
    | "LAUNCHED"
    | "DECLINED"
    | "PREPENDING"
    | "ENDED">>;
}

interface Project {
  id: number,
  logoURL: string,
  name: string,
  symbol: string,
  proposalDesc: string,
  decimals: number,
  totalSupply: number,
  socials: ["https://twitter.com/", "https://google.com/"]
};

const LaunchModal: React.FC<ModalProps> = ({ setApproveShowModal, projectId, setProjectStatus }) => {
  const wallet = useWallet();
  const { jwtToken } = useContext(JwtTokenContext);

  const [project, setProject] = useState<Project>();
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    if ( project ) {
      const bunRes = await initializeBundlr(wallet);
      if ( !bunRes?.success ) {
        setLoading(false);
        toast.error(bunRes?.error);
        handleClose();
        return;
      }

      const metaUrl = await uploadMetadata(bunRes?.bundler as WebBundlr, project.name, project.symbol, project.proposalDesc, project.logoURL);
      if ( !metaUrl.success ) {
        setLoading(false);
        toast.error(`Metadata uplaod fail! ${metaUrl.error}`);
        handleClose();
        return;
      }

      if ( !metaUrl.url ) {
        setLoading(false);
        toast.error('Metadata Url invalid!');
        handleClose();
        return;
      }

      const tokenRes = await createToken(wallet, project.name, project.symbol, project.totalSupply, project.decimals, metaUrl.url);
      if ( !tokenRes.success ) {
        setLoading(false);
        toast.error(`Create Token fail! ${tokenRes.error}`);
        handleClose();
        return;
      }

      if ( !tokenRes.mint ) {
        setLoading(false);
        toast.error('Token mint address error!')
        handleClose();
        return;
      }

      const res = await setTokenMint(jwtToken, project.id, tokenRes.mint);
      if ( !res.success ) {
        setLoading(false);
        toast.error(`Set token mint error! (Mint:${tokenRes.mint})`);
        handleClose();
        return;
      }
    }
    
    setProjectStatus('LAUNCHED');
    setLoading(false);
    handleClose();
  }, [project]);

  useEffect(() => {
    const fetchProject = async () => {
      const pros = await getProjects();
      if (pros.success === true) {
        setProject(pros.projects.filter((e: any) => (e.id === projectId))
          .map((e: Project) => ({
            id: e.id,
            logoURL: e.logoURL,
            name: e.name,
            symbol: e.symbol,
            proposalDesc: e.proposalDesc,
            decimals: e.decimals,
            totalSupply: e.totalSupply,
            socials: ["https://twitter.com/", "https://google.com/"],
          }
          ))[0]);
      }
    }

    fetchProject();
  }, [])

  const handleClose = () => {
    setApproveShowModal(false);
  };

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-opacity-50 bg-bg ">
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
        ) : (
      <div className="p-8 mx-3 border rounded-lg bg-slate-800/90 border-textclr2">
        <div className="w-96 h-96 overflow-hidden">
          <img
            src={project?.logoURL}
            alt={project?.name}
            className="w-full h-full object-cover rounded-full ring-2 ring-textclr2/70"
          />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 text-textclr2 font-primaryRegular">
              Name:        {project?.name}
            </label>
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-textclr2 font-primaryRegular">
              Description: {project?.proposalDesc}
            </label>
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-textclr2 font-primaryRegular">
              decimals:    {project?.decimals}
            </label>
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-textclr2 font-primaryRegular">
              Supply:    {project?.totalSupply}
            </label>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="submit"
              className="px-4 py-2 rounded-md shadow-sm text-slate-700/75 bg-textclr2 font-primaryRegular hover:bg-textclr2/70"
            >
              Launch
            </button>
            <button
              onClick={handleClose}
              className="px-4 py-2 rounded-md shadow-sm text-slate-700/75 bg-textclr2 font-primaryRegular hover:bg-textclr2/70"
            >
              Close
            </button>
          </div>
        </form>
      </div>)}
    </div>
  );
};

export default LaunchModal;
