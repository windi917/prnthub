// src/components/Modal.tsx
import React, { useState, useEffect, useCallback } from "react";
import { getProjects } from "../api/apis";

interface ModalProps {
  setApproveShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  projectId: number;
}

interface Project {
  id: number,
  logoURL: string,
  name: string,
  proposalDesc: string,
  decimals: number,
  totalSupply: number,
  socials: ["https://twitter.com/", "https://google.com/"]
};

const LaunchModal: React.FC<ModalProps> = ({ setApproveShowModal, projectId }) => {
  const [project, setProject] = useState<Project>();

  useEffect(() => {
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleClose();
  };

  const fetchProject = useCallback(async () => {
    const pros = await getProjects();

    if (pros.success === true) {
      setProject(pros.projects.filter((e: any) => (e.id === projectId))
        .map((e: Project) => ({
          id: e.id,
          logoURL: e.logoURL,
          name: e.name,
          proposalDesc: e.proposalDesc,
          decimals: e.decimals,
          totalSupply: e.totalSupply,
          socials: ["https://twitter.com/", "https://google.com/"],
        }
        ))[0])
    }
  }, []);

  useEffect(() => {
    fetchProject();
  }, [fetchProject])

  const handleClose = () => {
    setApproveShowModal(false);
  };

  return (
    <div
      className={"fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center transition-opacity duration-300 opacity-100"}
    >
      <div
        className={"bg-black/75 p-6 rounded-lg shadow-lg max-w-md w-full transform transition-transform duration-300 scale-100"}
      >
        <img
          src={project?.logoURL}
          alt={project?.name}
          className="w-25 h-25 mr-4 rounded-full ring-2 ring-textclr2/70"
        />
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
      </div>
    </div>
  );
};

export default LaunchModal;
