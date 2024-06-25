import React from "react";
import { motion } from "framer-motion";

interface TokenRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TokenRegisterModal: React.FC<TokenRegisterModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <motion.div
        className="w-full max-w-xl p-5 transition-transform transform border-2 rounded-lg shadow-lg bg-black/95 border-textclr2/50"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: isOpen ? 0 : -20, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="mb-4 text-2xl text-center font-primaryBold text-textclr2">
          Token Register
        </h2>
        <div className="mb-4 text-xl text-left font-primaryRegular text-textclr2">
          <label htmlFor="mintAddress">Mint Address</label>
          <input
            id="mintAddress"
            type="text"
            placeholder="Enter Wallet Address"
            className="block w-full px-3 py-2 pt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-textclr2 focus:border-textclr2 sm:text-sm"
          />
        </div>
        <div className="mb-4 text-xl text-left font-primaryRegular text-textclr2">
          <label htmlFor="tokenName">Token Name</label>
          <input
            id="tokenName"
            type="text"
            placeholder="Enter Token Name"
            className="block w-full px-3 py-1 pt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-textclr2 focus:border-textclr2 sm:text-sm"
          />
        </div>
        <div className="flex justify-end space-x-4">
          <button
            type="submit"
            onClick={onClose} // Replace with actual submit function
            className="px-4 py-2 rounded-md shadow-sm text-slate-700/75 bg-textclr2 font-primaryRegular hover:bg-textclr2/70"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md shadow-sm text-slate-700/75 bg-textclr2 font-primaryRegular hover:bg-textclr2/70"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default TokenRegisterModal;
