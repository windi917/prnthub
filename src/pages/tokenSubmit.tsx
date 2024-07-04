// import { useState, ChangeEvent, FormEvent, useContext } from "react";
// import { motion } from "framer-motion";
// import axios from "axios";
// import { FaFileAlt, FaDownload } from "react-icons/fa";
// import { Oval } from "react-loader-spinner";
// import { JwtTokenContext } from "../contexts/JWTTokenProvider";
// import { API_URL } from "../config";
// import { toast } from "react-toastify";

// interface FormData {
//   name: string;
//   symbol: string;
//   supply: string;
//   decimals: number | "";
//   websitename: string;
//   twitterURL: string;
//   description: string;
//   tokenomics: File | null;
//   logo: File | null;
// }

// const TokenSubmit = () => {
//   const [formData, setFormData] = useState<FormData>({
//     name: "",
//     symbol: "",
//     supply: "",
//     decimals: "",
//     websitename: "",
//     twitterURL: "",
//     description: "",
//     tokenomics: null,
//     logo: null,
//   });

//   const [tokenomicsFileName, setTokenomicsFileName] = useState<string>("");
//   const [logoFileName, setLogoFileName] = useState<string>("");
//   const [loading, setLoading] = useState<boolean>(false);
//   const [success, setSuccess] = useState<boolean>(false);

//   const { jwtToken } = useContext(JwtTokenContext);

//   const handleChange = (
//     e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value, files } = e.target as HTMLInputElement;
//     if (files && files.length > 0) {
//       if (name === "tokenomics") {
//         setFormData({ ...formData, tokenomics: files[0] });
//         setTokenomicsFileName(files[0].name);
//       } else if (name === "logo") {
//         setFormData({ ...formData, logo: files[0] });
//         setLogoFileName(files[0].name);
//       }
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const handleSubmit = async (event: FormEvent) => {
//     event.preventDefault();

//     if (!jwtToken) {
//       toast.error("Token Error: Please sign first!");
//       return;
//     }

//     setLoading(true);

//     const data = new FormData();
//     data.append("name", formData.name);
//     data.append("symbol", formData.symbol);
//     data.append("totalSupply", formData.supply);
//     data.append("website", formData.websitename);
//     data.append("twitter", formData.twitterURL);
//     data.append("decimals", formData.decimals.toString());
//     data.append("proposalTitle", "");
//     data.append("proposalStatus", "PENDING");
//     data.append("proposalDesc", formData.description);
//     data.append("periodId", "1");
//     data.append("mint", "");
//     if (formData.tokenomics) {
//       data.append("tokenomicsURL", formData.tokenomics);
//     }
//     if (formData.logo) {
//       data.append("logoURL", formData.logo);
//     }

//     const config = {
//       method: "post",
//       maxBodyLength: Infinity,
//       url: API_URL + "/token",
//       headers: {
//         Authorization: "Bearer " + jwtToken,
//         "Content-Type": "multipart/form-data",
//       },
//       data: data,
//     };

//     try {
//       await axios.request(config);
//       setSuccess(true);
//     } catch (error) {
//       if (error instanceof Error) {
//         toast.error("Error Submit Proposal: " + error.message);
//       } else {
//         toast.error("Error Submit Proposal");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };
//   return (
//     <>
//       <div className="min-h-screen p-4 bg-radial-gradient">
//         <motion.div
//           className="px-6 py-6 mx-auto shadow-lg max-w-screen rounded-2xl bg-white/10"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//         >
//           <h1 className="text-4xl leading-6 font-primaryBold text-textclr2">
//             Submit Token
//           </h1>
//           <p className="mt-2 text-lg text-textclr2/50 font-primaryRegular">
//             Submit your own token.
//           </p>
//         </motion.div>
//         <motion.div
//           className="flex flex-col items-center p-4 mx-auto mt-4 border shadow-lg min-w-fit border-textclr2 backdrop-blur-3xl rounded-box bg-white/10 lg:px-6 lg:w-3/5 md:w-1/2 md:px-8"
//           initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
//           animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
//           transition={{
//             duration: 0.8,
//             ease: "easeInOut",
//             staggerChildren: 0.4,
//           }}
//         >
//           <form
//             onSubmit={handleSubmit}
//             className="grid grid-cols-1 gap-6 pt-8 md:grid-cols-2"
//           >
//             <div>
//               <label className="block mb-2 text-md font-primaryRegular text-textclr2 dark:text-slate-200">
//                 Name
//               </label>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 placeholder="Token Name"
//                 className="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border rounded-lg placeholder-slate-400 border-slate-200 dark:placeholder-slate-600 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700 focus:border-textclr2 dark:focus:border-textclr2 focus:ring-textclr2 focus:outline-none focus:ring focus:ring-opacity-40"
//               />
//             </div>
//             <div>
//               <label className="block mb-2 text-md font-primaryRegular text-textclr2 dark:text-slate-200">
//                 Symbol
//               </label>
//               <input
//                 type="text"
//                 name="symbol"
//                 value={formData.symbol}
//                 onChange={handleChange}
//                 placeholder="Token Symbol"
//                 className="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border rounded-lg placeholder-slate-400 border-slate-200 dark:placeholder-slate-600 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700 focus:border-textclr2 dark:focus:border-textclr2 focus:ring-textclr2 focus:outline-none focus:ring focus:ring-opacity-40"
//               />
//             </div>
//             <div>
//               <label className="block mb-2 text-md font-primaryRegular text-textclr2 dark:text-slate-200">
//                 Supply
//               </label>
//               <input
//                 type="text"
//                 name="supply"
//                 value={formData.supply}
//                 onChange={handleChange}
//                 placeholder="Token Supply"
//                 className="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border rounded-lg placeholder-slate-400 border-slate-200 dark:placeholder-slate-600 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700 focus:border-textclr2 dark:focus:border-textclr2 focus:ring-textclr2 focus:outline-none focus:ring focus:ring-opacity-40"
//               />
//             </div>
//             <div>
//               <label className="block mb-2 text-md font-primaryRegular text-textclr2 dark:text-slate-200">
//                 Decimals
//               </label>
//               <input
//                 type="number"
//                 name="decimals"
//                 value={formData.decimals}
//                 onChange={handleChange}
//                 min="0"
//                 max="9"
//                 placeholder="Decimals"
//                 className="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border rounded-lg placeholder-slate-400 border-slate-200 dark:placeholder-slate-600 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700 focus:border-textclr2 dark:focus:border-textclr2 focus:ring-textclr2 focus:outline-none focus:ring focus:ring-opacity-40"
//                 title="Numbers only"
//               />
//             </div>
//             <div>
//               <label className="block mb-2 text-md font-primaryRegular text-textclr2 dark:text-slate-200">
//                 Project Website
//               </label>
//               <input
//                 type="text"
//                 name="websitename"
//                 value={formData.websitename}
//                 onChange={handleChange}
//                 placeholder="Website"
//                 className="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border rounded-lg placeholder-slate-400 border-slate-200 dark:placeholder-slate-600 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700 focus:border-textclr2 dark:focus:border-textclr2 focus:ring-textclr2 focus:outline-none focus:ring focus:ring-opacity-40"
//               />
//             </div>
//             <div>
//               <label className="block mb-2 text-md font-primaryRegular text-textclr2 dark:text-slate-200">
//                 Project Twitter
//               </label>
//               <input
//                 type="text"
//                 name="twitterURL"
//                 value={formData.twitterURL}
//                 onChange={handleChange}
//                 placeholder="Twitter"
//                 className="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border rounded-lg placeholder-slate-400 border-slate-200 dark:placeholder-slate-600 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700 focus:border-textclr2 dark:focus:border-textclr2 focus:ring-textclr2 focus:outline-none focus:ring focus:ring-opacity-40"
//               />
//             </div>
//             <div className="md:col-span-2">
//               <label
//                 htmlFor="Description"
//                 className="block w-full text-md text-textclr2 dark:text-white"
//               >
//                 Description
//               </label>
//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 placeholder="Description about team & project"
//                 className="block mt-2 w-full rounded-lg border border-gray-200 bg-white px-4 h-32 py-2.5 text-slate-700 focus:border-textclr2 focus:outline-none focus:ring focus:ring-textclr2 focus:ring-opacity-40 dark:border-white dark:bg-gray-900 dark:text-white dark:focus:border-textclr2"
//               ></textarea>
//             </div>
//             {/* Tokenomics Upload */}
//             <div>
//               <label
//                 htmlFor="tokenomics"
//                 className="block mb-2 text-md font-primaryRegular text-textclr2 dark:text-slate-200"
//               >
//                 Tokenomics
//               </label>
//               <label
//                 htmlFor="tokenomics"
//                 className="flex flex-col items-center w-full max-w-lg p-5 mx-auto mt-2 text-center bg-white border-2 border-dashed cursor-pointer border-slate-300 dark:bg-slate-900 dark:border-slate-700 rounded-xl"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   strokeWidth="1.5"
//                   stroke="currentColor"
//                   className="w-8 h-8 text-slate-500 dark:text-slate-400"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
//                   />
//                 </svg>
//                 <h2 className="mt-1 tracking-wide font-primaryBold text-textclr2 dark:text-slate-200">
//                   Upload Tokenomics
//                 </h2>
//                 <p className="mt-2 text-xs tracking-wide text-slate-500 dark:text-slate-400">
//                   Upload your file PDF, PNG, JPG or GIF.
//                 </p>
//                 <input
//                   id="tokenomics"
//                   type="file"
//                   name="tokenomics"
//                   onChange={handleChange}
//                   className="hidden"
//                 />
//                 {tokenomicsFileName && (
//                   <div className="flex items-center mt-2 text-xs text-slate-700 dark:text-slate-400">
//                     <div className="flex items-center">
//                       <FaFileAlt className="mr-2 text-slate-500 dark:text-slate-400" />
//                       <span>{tokenomicsFileName}</span>
//                     </div>
//                     <div className="ml-4">
//                       <FaDownload className="cursor-pointer text-slate-500 dark:text-slate-400" />
//                     </div>
//                   </div>
//                 )}
//               </label>
//             </div>
//             {/* Logo Upload */}
//             <div>
//               <label
//                 htmlFor="logo"
//                 className="block mb-2 text-md font-primaryRegular text-textclr2 dark:text-slate-200"
//               >
//                 Project Logo
//               </label>
//               <label
//                 htmlFor="logo"
//                 className="flex flex-col items-center w-full max-w-lg p-5 mx-auto mt-2 text-center bg-white border-2 border-dashed cursor-pointer border-slate-300 dark:bg-slate-900 dark:border-slate-700 rounded-xl"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   strokeWidth="1.5"
//                   stroke="currentColor"
//                   className="w-8 h-8 text-slate-500 dark:text-slate-400"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
//                   />
//                 </svg>
//                 <h2 className="mt-1 tracking-wide font-primaryBold text-textclr2 dark:text-slate-200">
//                   Upload Logo
//                 </h2>
//                 <p className="mt-2 text-xs tracking-wide text-slate-500 dark:text-slate-400">
//                   Upload your file SVG, PNG, JPG or GIF.
//                 </p>
//                 <input
//                   id="logo"
//                   type="file"
//                   name="logo"
//                   onChange={handleChange}
//                   className="hidden"
//                 />
//                 {logoFileName && (
//                   <div className="flex items-center mt-2 text-xs text-slate-700 dark:text-slate-400">
//                     <div className="flex items-center">
//                       <FaFileAlt className="mr-2 text-slate-500 dark:text-slate-400" />
//                       <span>{logoFileName}</span>
//                     </div>
//                     <div className="ml-4">
//                       <FaDownload className="cursor-pointer text-slate-500 dark:text-slate-400" />
//                     </div>
//                   </div>
//                 )}
//               </label>
//             </div>
//             {/* -- Submit Button -- */}
//             <div className="flex-col items-center justify-center md:flex-row md:justify-between">
//               <button
//                 type="submit"
//                 className="px-4 py-2 border-lg btn text-textclr2 border-textclr2 font-primaryRegular hover:border-btnbg hover:text-btnbg focus:outline-none focus:bg-btnbg/10 focus:border-btnbg/10"
//               >
//                 Submit
//               </button>
//             </div>
//             {/* Loading Spinner */}
//             {loading && (
//               <>
//                 <Oval
//                   height="80"
//                   visible={true}
//                   width="80"
//                   color="#CCF869"
//                   ariaLabel="oval-loading"
//                   wrapperStyle={{
//                     position: "fixed",
//                     top: "50%",
//                     left: "50%",
//                     transform: "translate(-50%, -50%)",
//                   }}
//                 />
//                 {success && (
//                   <div className="fixed inset-0 z-10 flex justify-center pt-20 pb-4 font-semibold text-center bg-opacity-50 text-textclr2 bg-bg">
//                     Submitted successfully!
//                   </div>
//                 )}
//               </>
//             )}
//           </form>
//         </motion.div>
//       </div>
//     </>
//   );
// };

// export default TokenSubmit;

import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import axios from "axios";
import { FaFileAlt } from "react-icons/fa";
import { Oval } from "react-loader-spinner";
import { JwtTokenContext } from "../contexts/JWTTokenProvider";
import { API_URL } from "../config";
import { toast } from "react-toastify";

interface FormData {
  name: string;
  symbol: string;
  supply: string;
  decimals: number | "";
  websitename: string;
  twitterURL: string;
  description: string;
  tokenomics: File | null;
  logo: File | null;
}

const TokenSubmit = () => {
  const { jwtToken } = useContext(JwtTokenContext);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  const [tokenomicsFileName, setTokenomicsFileName] = useState<string>("");
  const [logoFileName, setLogoFileName] = useState<string>("");
  const [tokenomics, setTokenomics] = useState<File | null>(null);
  const [logo, setLogo] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const onSubmit = async (data: FormData) => {
    if (!jwtToken) {
      toast.error("Token Error: Please sign first!");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("symbol", data.symbol);
    formData.append("totalSupply", data.supply);
    formData.append("website", data.websitename);
    formData.append("twitter", data.twitterURL);
    formData.append("decimals", data.decimals.toString());
    formData.append("proposalTitle", "");
    formData.append("proposalStatus", "PENDING");
    formData.append("proposalDesc", data.description);
    formData.append("periodId", "1");
    formData.append("mint", "");


    if (tokenomics) {
      formData.append("tokenomicsURL", tokenomics);
    } else {
      setLoading(false);
      toast.error('Please Select Tokenomics!');
      return;
    }

    if (logo) {
      formData.append("logoURL", logo);
    } else {
      setLoading(false);
      toast.error('Please Select Logo!');
      return;
    }

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: API_URL + "/token",
      headers: {
        Authorization: "Bearer " + jwtToken,
        "Content-Type": "multipart/form-data",
      },
      data: formData,
    };

    try {
      await axios.request(config);
      setSuccess(true);
      toast.success("Submitted successfully!");
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Error Submit Proposal: " + error.message);
      } else {
        toast.error("Error Submit Proposal");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fileType: "tokenomics" | "logo"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue(fileType, file, { shouldValidate: true });
      if (fileType === "tokenomics") {
        setTokenomicsFileName(file.name);
        setTokenomics(file);
      } else {
        setLogoFileName(file.name);
        setLogo(file)
      }
    }
  };

  const handleRemoveTokenomics = (e: React.FormEvent) => {
    e.preventDefault();

    setTokenomicsFileName('');
    setTokenomics(null);
  }

  const handleRemoveLogo = (e: React.FormEvent) => {
    e.preventDefault();

    setLogoFileName('');
    setLogo(null);
  }

  return (
    <>
      <div className="min-h-screen p-4 bg-radial-gradient pt-20">
        <motion.div
          className="px-6 py-6 mx-auto shadow-lg max-w-screen rounded-2xl bg-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl leading-6 font-primaryBold text-textclr2">
            Submit Token
          </h1>
          <p className="mt-2 text-lg text-textclr2/50 font-primaryRegular">
            Submit your own token.
          </p>
        </motion.div>
        <motion.div
          className="flex flex-col items-center p-4 mx-auto mt-4 border shadow-lg min-w-fit border-textclr2 backdrop-blur-3xl rounded-box bg-white/10 lg:px-6 lg:w-3/5 md:w-1/2 md:px-8"
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.8,
            ease: "easeInOut",
            staggerChildren: 0.4,
          }}
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 gap-6 pt-8 md:grid-cols-2"
          >
            <div>
              <label className="block mb-2 text-md font-primaryRegular text-textclr2 dark:text-slate-200">
                Name
              </label>
              <input
                type="text"
                {...register("name", { required: "Token name is required" })}
                placeholder="Token Name"
                className="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border rounded-lg placeholder-slate-400 border-slate-200 dark:placeholder-slate-600 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700 focus:border-textclr2 dark:focus:border-textclr2 focus:ring-textclr2 focus:outline-none focus:ring focus:ring-opacity-40"
              />
              {errors.name && (
                <span className="py-3 text-sm text-red-500/80">
                  {errors.name.message}
                </span>
              )}
            </div>
            <div>
              <label className="block mb-2 text-md font-primaryRegular text-textclr2 dark:text-slate-200">
                Symbol
              </label>
              <input
                type="text"
                {...register("symbol", {
                  required: "Token symbol is required",
                })}
                placeholder="Token Symbol"
                className="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border rounded-lg placeholder-slate-400 border-slate-200 dark:placeholder-slate-600 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700 focus:border-textclr2 dark:focus:border-textclr2 focus:ring-textclr2 focus:outline-none focus:ring focus:ring-opacity-40"
              />
              {errors.symbol && (
                <span className="py-3 text-sm text-red-500/80">
                  {errors.symbol.message}
                </span>
              )}
            </div>
            <div>
              <label className="block mb-2 text-md font-primaryRegular text-textclr2 dark:text-slate-200">
                Supply
              </label>
              <input
                type="text"
                {...register("supply", {
                  required: "Token supply is required",
                })}
                placeholder="Token Supply"
                className="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border rounded-lg placeholder-slate-400 border-slate-200 dark:placeholder-slate-600 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700 focus:border-textclr2 dark:focus:border-textclr2 focus:ring-textclr2 focus:outline-none focus:ring focus:ring-opacity-40"
              />
              {errors.supply && (
                <span className="py-3 text-sm text-red-500/80">
                  {errors.supply.message}
                </span>
              )}
            </div>
            <div>
              <label className="block mb-2 text-md font-primaryRegular text-textclr2 dark:text-slate-200">
                Decimals
              </label>
              <input
                type="number"
                {...register("decimals", {
                  required: "Token decimals are required (0-9)",
                  min: 0,
                  max: 9,
                })}
                placeholder="Decimals"
                className="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border rounded-lg placeholder-slate-400 border-slate-200 dark:placeholder-slate-600 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700 focus:border-textclr2 dark:focus:border-textclr2 focus:ring-textclr2 focus:outline-none focus:ring focus:ring-opacity-40"
                title="Numbers only"
              />
              {errors.decimals && (
                <span className="py-3 text-sm text-red-500/80">
                  {errors.decimals.message}
                </span>
              )}
            </div>
            <div>
              <label className="block mb-2 text-md font-primaryRegular text-textclr2 dark:text-slate-200">
                Project Website
              </label>
              <input
                type="text"
                {...register("websitename", {
                  required: "Website is required",
                })}
                placeholder="Website"
                className="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border rounded-lg placeholder-slate-400 border-slate-200 dark:placeholder-slate-600 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700 focus:border-textclr2 dark:focus:border-textclr2 focus:ring-textclr2 focus:outline-none focus:ring focus:ring-opacity-40"
              />
              {errors.websitename && (
                <span className="py-3 text-sm text-red-500/80">
                  {errors.websitename.message}
                </span>
              )}
            </div>
            <div>
              <label className="block mb-2 text-md font-primaryRegular text-textclr2 dark:text-slate-200">
                Twitter URL
              </label>
              <input
                type="text"
                {...register("twitterURL", {
                  required: "Twitter URL is required",
                })}
                placeholder="Twitter URL"
                className="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border rounded-lg placeholder-slate-400 border-slate-200 dark:placeholder-slate-600 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700 focus:border-textclr2 dark:focus:border-textclr2 focus:ring-textclr2 focus:outline-none focus:ring focus:ring-opacity-40"
              />
              {errors.twitterURL && (
                <span className="py-3 text-sm text-red-500/80">
                  {errors.twitterURL.message}
                </span>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block mb-2 text-md font-primaryRegular text-textclr2 dark:text-slate-200">
                Project Description
              </label>
              <textarea
                {...register("description", {
                  required: "Project description is required",
                })}
                placeholder="Project Description"
                className="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border rounded-lg placeholder-slate-400 border-slate-200 dark:placeholder-slate-600 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700 focus:border-textclr2 dark:focus:border-textclr2 focus:ring-textclr2 focus:outline-none focus:ring focus:ring-opacity-40"
                rows={4}
              />
              {errors.description && (
                <span className="py-3 text-sm text-red-500/80">
                  {errors.description.message}
                </span>
              )}
            </div>
            <div>
              <label className="block mb-2 text-md font-primaryRegular text-textclr2 dark:text-slate-200">
                Tokenomics
              </label>
              <input
                type="file"
                {...register("tokenomics")}
                onChange={(e) => handleFileChange(e, "tokenomics")}
                className="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border rounded-lg placeholder-slate-400 border-slate-200 dark:placeholder-slate-600 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700 focus:border-textclr2 dark:focus:border-textclr2 focus:ring-textclr2 focus:outline-none focus:ring focus:ring-opacity-40"
              />
              <div className="flex items-center gap-2 mt-2">
                <FaFileAlt className="text-gray-400" />
                <span className="text-gray-500">{tokenomicsFileName}</span>
                <button
                  onClick={handleRemoveTokenomics}
                  className="px-4 py-2 border-lg btn text-textclr2 border-textclr2 font-primaryRegular hover:border-btnbg hover:text-btnbg focus:outline-none focus:bg-btnbg/10 focus:border-btnbg/10"
                >
                  Remove
                </button>
              </div>
            </div>
            <div>
              <label className="block mb-2 text-md font-primaryRegular text-textclr2 dark:text-slate-200">
                Project Logo
              </label>
              <input
                type="file"
                {...register("logo")}
                onChange={(e) => handleFileChange(e, "logo")}
                className="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border rounded-lg placeholder-slate-400 border-slate-200 dark:placeholder-slate-600 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700 focus:border-textclr2 dark:focus:border-textclr2 focus:ring-textclr2 focus:outline-none focus:ring focus:ring-opacity-40"
              />
              <div className="flex items-center gap-2 mt-2">
                <FaFileAlt className="text-gray-400" />
                <span className="text-gray-500">{logoFileName}</span>
                <button
                  onClick={handleRemoveLogo}
                  className="px-4 py-2 border-lg btn text-textclr2 border-textclr2 font-primaryRegular hover:border-btnbg hover:text-btnbg focus:outline-none focus:bg-btnbg/10 focus:border-btnbg/10"
                >
                  Remove
                </button>
              </div>
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                className="px-10 py-2 border-lg btn text-textclr2 border-textclr2 font-primaryRegular hover:border-btnbg hover:text-btnbg focus:outline-none focus:bg-btnbg/10 focus:border-btnbg/10"
              >
                Submit
              </button>
            </div>
          </form>
        </motion.div >
        {loading && (
          <>
            <div style={{
              position: "fixed",
              top: "0",
              left: "0",
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: "1000"
            }}>
              <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                <Oval
                  height="80"
                  visible={true}
                  width="80"
                  color="#CCF869"
                  ariaLabel="oval-loading"
                />
                {success && (
                  <div className="fixed inset-0 z-10 flex justify-center pt-20 pb-4 font-semibold text-center bg-opacity-50 text-textclr2 bg-bg">
                    Submitted successfully!
                  </div>
                )}
              </div>
            </div>
          </>
        )
        }
      </div >
    </>
  );
};

export default TokenSubmit;
