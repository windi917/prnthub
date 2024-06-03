import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ModalProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalVote: React.FC<ModalProps> = ({ setShowModal }) => {
  const [voteAmount, setVoteAmount] = useState("");

  const handleSubmit = () => {
    if (voteAmount) {
      toast.success("Vote submitted successfully!", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        theme: "dark",
      });
    } else {
      toast.error("Please enter a vote amount.", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        theme: "dark",
      });
    }
    setShowModal(false);
  };
  // const Test = () => toast("success!");

  return (
    <>
      <ToastContainer />
      <div className="fixed inset-0 z-10 flex items-center justify-center bg-opacity-50 bg-bg ">
        <div className="p-8 mx-3 border rounded-lg bg-slate-800/90 border-textclr2">
          <h2 className="mb-4 text-xl text-textclr2">Vote </h2>
          <select className="w-full max-w-xl select-sm select select-ghost !bg-slate-500/60 !border !border-textclr2">
            <option selected>Select Token</option>
            <option>PRNT</option> {/* Hardcodes values */}
            <option>SLERF</option>
            <option>SOL</option>
            <option>WIF</option>
            <option>JUP</option>
          </select>
          <input
            type="number"
            value={voteAmount}
            onChange={(e) => setVoteAmount(e.target.value)}
            placeholder="Enter vote amount [ 1,000 - 10,000 ]"
            className="w-full p-2 mt-6 mb-4 border rounded-xl bg-slate-600/80 border-textclr2 text-textclr2 focus:outline-none focus:border-textclr2/60"
          />
          <button
            onClick={handleSubmit}
            // onClick={Test}
            className="px-4 py-2 rounded-lg text-slate-700/90 font-primaryBold bg-textclr2/60 hover:bg-textclr2/90 focus:outline-none focus:bg-textclr2"
          >
            Submit
          </button>
        </div>
      </div>
    </>
  );
};

export default ModalVote;
