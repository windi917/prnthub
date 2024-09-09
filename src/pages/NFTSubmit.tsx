import { motion } from "framer-motion";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";

type FormValues = {
  projectName: string;
  supply: string;
  mintType: string;
  mintPrice: string;
  mintDate: string;
  xLink: string;
  discordLink: string;
  mainContact: string;
  mainContactEmail: string;
  previousProjects: string;
  previousProjectName?: string;
  timeZone: string;
  artist: string;
  teamContact: string;
};

const ContactForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbwbHbiYM4c1jlJDpJmhVlfl5QU3YHBeYfFINln5GzuQbZVihSBRF2g0I3wTSYieogw/exec",
        {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok || response.type === "opaque") {
        alert(
          "Thank you for your submission. We will review your application and get back to you soon."
        );
        reset(); // Reset form fields after submission
      } else {
        console.error("Form submission failed.");
        alert("Failed to submit the form. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  // Watch to conditionally display the previousProjectName field
  const previousProjects = watch("previousProjects");

  return (
    <div className="pt-16 bg-radial-gradient">
      <motion.div
        className="max-w-xl p-6 mx-auto"
        initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{
          duration: 0.6,
          ease: "easeInOut",
          staggerChildren: 0.3,
        }}
      >
        <h1 className="mb-4 text-3xl font-primaryBold text-textclr2">
          PRNT Hub: NFT Application Form
        </h1>
        <p className="mb-6 text-textclr font-primaryRegular">
          Welcome to PRNT Hub: NFT Submission Form. Kindly provide us with all
          of the requested information below. Should you not have any details at
          the moment, please respond as TBD. Should your project be considered
          for launch, we will be in contact with you to gather any remaining
          detail.
        </p>
        <p className="mb-6 text-textclr font-primaryRegular">
          All applications will be reviewed in detail before a decision is to be
          made. We ask that you provide at least 2 weeks of notice ahead of your
          mint day to ensure sufficient time for review; however, exceptions can
          be made should time permit.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-1 text-textclr2">
              What is the name of the project? *
            </label>
            <input
              type="text"
              {...register("projectName", {
                required: "Project name is required",
              })}
              className="w-full p-2 border border-gray-300 rounded"
            />
            {errors.projectName && (
              <span className="text-red-500">{errors.projectName.message}</span>
            )}
          </div>

          <div>
            <label className="block mb-1 text-textclr2">
              How much is the supply of the collection? *
            </label>
            <input
              type="text"
              {...register("supply", { required: "Supply is required" })}
              className="w-full p-2 border border-gray-300 rounded"
            />
            {errors.supply && (
              <span className="text-red-500">{errors.supply.message}</span>
            )}
          </div>

          <div>
            <label className="block mb-1 text-textclr2">
              What will the mint price be? *
            </label>
            <input
              type="text"
              {...register("mintPrice", { required: "Mint price is required" })}
              className="w-full p-2 border border-gray-300 rounded"
            />
            {errors.mintPrice && (
              <span className="text-red-500">{errors.mintPrice.message}</span>
            )}
          </div>

          <div>
            <label className="block mb-1 text-textclr2">
              What is the mint date? (If you have not decided, please put N/A) *
            </label>
            <input
              type="text"
              {...register("mintDate", { required: "Mint date is required" })}
              className="w-full p-2 border border-gray-300 rounded"
            />
            {errors.mintDate && (
              <span className="text-red-500">{errors.mintDate.message}</span>
            )}
          </div>

          <div>
            <label className="block mb-1 text-textclr2">
              What is the project's X link? *
            </label>
            <input
              type="text"
              {...register("xLink", { required: "X link is required" })}
              className="w-full p-2 border border-gray-300 rounded"
            />
            {errors.xLink && (
              <span className="text-red-500">{errors.xLink.message}</span>
            )}
          </div>

          <div>
            <label className="block mb-1 text-textclr2">
              What is the project's discord link? *
            </label>
            <input
              type="text"
              {...register("discordLink", {
                required: "Discord link is required",
              })}
              className="w-full p-2 border border-gray-300 rounded"
            />
            {errors.discordLink && (
              <span className="text-red-500">{errors.discordLink.message}</span>
            )}
          </div>

          <div>
            <label className="block mb-1 text-textclr2">
              Who is the main contact of the project? *
            </label>
            <input
              type="text"
              {...register("mainContact", {
                required: "Main contact is required",
              })}
              className="w-full p-2 border border-gray-300 rounded"
            />
            {errors.mainContact && (
              <span className="text-red-500">{errors.mainContact.message}</span>
            )}
          </div>

          <div>
            <label className="block mb-1 text-textclr2">
              What is the main contact's email address? *
            </label>
            <input
              type="email"
              {...register("mainContactEmail", {
                required: "Main contact email is required",
              })}
              className="w-full p-2 border border-gray-300 rounded"
            />
            {errors.mainContactEmail && (
              <span className="text-red-500">
                {errors.mainContactEmail.message}
              </span>
            )}
          </div>

          <div>
            <label className="block mb-1 text-textclr2">
              Which time-zone do you mainly operate on? *
            </label>
            <input
              type="text"
              {...register("timeZone", { required: "Time zone is required" })}
              className="w-full p-2 border border-gray-300 rounded"
            />
            {errors.timeZone && (
              <span className="text-red-500">{errors.timeZone.message}</span>
            )}
          </div>

          <div>
            <label className="block mb-1 text-textclr2">
              Who is the artist of the project? And what is their X @ or Discord
              ID *
            </label>
            <input
              type="text"
              {...register("artist", {
                required: "Artist information is required",
              })}
              className="w-full p-2 border border-gray-300 rounded"
            />
            {errors.artist && (
              <span className="text-red-500">{errors.artist.message}</span>
            )}
          </div>

          <div>
            <label className="block mb-1 text-textclr2">
              Have you already spoken to anyone on the team in regards to the
              launchpad? (If yes, please provide their name) *
            </label>
            <input
              type="text"
              {...register("teamContact", {
                required: "Team contact is required",
              })}
              className="w-full p-2 border border-gray-300 rounded"
            />
            {errors.teamContact && (
              <span className="text-red-500">{errors.teamContact.message}</span>
            )}
          </div>

          <div>
            <label className="block mb-1 text-textclr2">
              Which type of mint would be your preferred? *
            </label>
            <select
              {...register("mintType", { required: "Mint type is required" })}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="Whitelist and Public">Whitelist and Public</option>
              <option value="Presale">Presale</option>
              <option value="Whitelist & Public">Whitelist & Public</option>
              <option value="Public Only">Public Only</option>
              <option value="Other">Other</option>
            </select>
            {errors.mintType && (
              <span className="text-red-500">{errors.mintType.message}</span>
            )}
          </div>

          <div>
            <label className="block mb-1 text-textclr2">
              Have you completed any previous projects in the NFT space? *
            </label>
            <select
              {...register("previousProjects", {
                required: "This field is required",
              })}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
            {errors.previousProjects && (
              <span className="text-red-500">
                {errors.previousProjects.message}
              </span>
            )}
          </div>

          {previousProjects === "Yes" && (
            <div>
              <label className="block mb-1 text-textclr2">
                If yes, what is the name of the project(s)?
              </label>
              <input
                type="text"
                {...register("previousProjectName")}
                className="w-full p-2 border border-gray-300 rounded"
              />
              {errors.previousProjectName && (
                <span className="text-red-500">
                  {errors.previousProjectName.message}
                </span>
              )}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ContactForm;
