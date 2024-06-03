// src/components/Modal.tsx
import React, { useState, useEffect } from "react";

interface ModalProps {
  closeModal: () => void;
  addToken: (token: {
    name: string;
    weight: number;
    minVoteAmount: string;
  }) => void;
}

const Modal: React.FC<ModalProps> = ({ closeModal, addToken }) => {
  const [name, setName] = useState<string>("");
  const [weight, setWeight] = useState<number>(0);
  const [minVoteAmount, setMinVoteAmount] = useState("");
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addToken({ name, weight, minVoteAmount });
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
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-textclr2 focus:border-textclr2 sm:text-sm"
            />
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
              onChange={(e) => setMinVoteAmount(e.target.value)}
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
