// src/components/Modal.tsx
import React, { useState, useEffect } from "react";
import { getVTokens } from "../api/apis";

interface ModalProps {
  closeModal: () => void;
  addToken: (token: {
    id: number;
    name: string;
    weight: number;
    minVoteAmount: number;
  }) => void;
}

interface VoteToken {
  id: number,
  name: string
};

const Modal: React.FC<ModalProps> = ({ closeModal, addToken }) => {
  const [id, setId] = useState<number>(0);
  const [name, setName] = useState<string>("");
  const [weight, setWeight] = useState<number>(0);
  const [minVoteAmount, setMinVoteAmount] = useState(0);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const [vTokens, setVTokens] = useState<VoteToken[]>([]);

  useEffect(() => {
    const fetchVTokens = async () => {
      const pros = await getVTokens();
      if (pros.success === true) {
        setVTokens(pros.vtokens.map((e: VoteToken) => (
          {
            id: e.id,
            name: e.name
          }
        )))
      }
    }

    fetchVTokens();
  }, [])

  const handleVTokenSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();

    const pid = e.target.value;
    setId(parseInt(pid));
    const project = vTokens.filter((e) => (e.id === parseInt(pid)));

    if ( project ) {
      setName(project[0].name)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addToken({ id, name, weight, minVoteAmount });
    handleClose();
  };

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => closeModal(), 300); // Ensure this matches the duration of the animation
  };

  return (
    <div
      className={`fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`bg-black/75 p-6 rounded-lg shadow-lg max-w-md w-full transform transition-transform duration-300 ${
          isVisible ? "scale-100" : "scale-90"
        }`}
      >
        <h3 className="mb-4 text-textclr2 font-primaryBold">Add New Token</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 text-textclr2 font-primaryRegular">
              Token Name
            </label>
            <select
              className="w-full max-w-2xl select-md select select-ghost !bg-slate-500/60 !border !border-textclr2"
              onChange={handleVTokenSelect}
              defaultValue="Select Vote Token"
            >
              <option disabled>Select Vote Token</option>
              {vTokens.map((e) => (
                <option value={e.id}>{e.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-textclr2 font-primaryRegular">
              Weight
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-textclr2 focus:border-textclr2 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-textclr2 font-primaryRegular">
              Minimum Vote Amount
            </label>
            <input
              type="number"
              value={minVoteAmount}
              onChange={(e) => setMinVoteAmount(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-textclr2 focus:border-textclr2 sm:text-sm"
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-md shadow-sm text-slate-700/75 bg-textclr2 font-primaryRegular hover:bg-textclr2/70"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md shadow-sm text-slate-700/75 bg-textclr2 font-primaryRegular hover:bg-textclr2/70"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
