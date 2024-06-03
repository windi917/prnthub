import React, { useState } from "react";

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    projectName: "",
    supply: "",
    mintType: "",
    mintPrice: "",
    mintDate: "",
    xLink: "",
    discordLink: "",
    mainContact: "",
    mainContactEmail: "",
    previousProjects: "",
    timeZone: "",
    artist: "",
    teamContact: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.projectName)
      newErrors.projectName = "Project name is required";
    if (!formData.supply) newErrors.supply = "Supply is required";
    if (!formData.mintType) newErrors.mintType = "Mint type is required";
    if (!formData.mintPrice) newErrors.mintPrice = "Mint price is required";
    if (!formData.mintDate) newErrors.mintDate = "Mint date is required";
    if (!formData.xLink) newErrors.xLink = "X link is required";
    if (!formData.discordLink)
      newErrors.discordLink = "Discord link is required";
    if (!formData.mainContact)
      newErrors.mainContact = "Main contact is required";
    if (!formData.mainContactEmail)
      newErrors.mainContactEmail = "Main contact email is required";
    if (!formData.previousProjects)
      newErrors.previousProjects = "Previous projects information is required";
    if (!formData.timeZone) newErrors.timeZone = "Time zone is required";
    if (!formData.artist) newErrors.artist = "Artist information is required";
    if (!formData.teamContact)
      newErrors.teamContact = "Team contact is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      console.log(formData);
      setSubmitted(true);
    }
  };

  return (
    <div className="bg-radial-gradient">
      <div className="max-w-xl p-6 mx-auto">
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
        {submitted ? (
          <div className="p-4 text-green-700 bg-green-100 rounded ">
            Thank you for your submission. We will review your application and
            get back to you soon.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              {
                name: "projectName",
                label: "What is the name of the project? *",
              },
              {
                name: "supply",
                label: "How much is the supply of the collection? *",
              },
              { name: "mintPrice", label: "What will the mint price be? *" },
              {
                name: "mintDate",
                label:
                  "What is the mint date? (If you have not decided, please put N/A) *",
              },
              { name: "xLink", label: "What is the project's X link? *" },
              {
                name: "discordLink",
                label: "What is the project's discord link? *",
              },
              {
                name: "mainContact",
                label: "Who is the main contact of the project? *",
              },
              {
                name: "mainContactEmail",
                label: "What is the main contact's email address? *",
              },
              {
                name: "timeZone",
                label: "Which time-zone do you mainly operate on? *",
              },
              {
                name: "artist",
                label:
                  "Who is the artist of the project? And what is their X @ or Discord ID *",
              },
              {
                name: "teamContact",
                label:
                  "Have you already spoken to anyone on the team in regards to the launchpad? (If yes, please provide their name) *",
              },
            ].map(({ name, label }) => (
              <div key={name}>
                <label className="block mb-1 text-textclr2">{label}</label>
                <input
                  type="text"
                  name={name}
                  value={formData[name as keyof typeof formData]}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
                {errors[name] && (
                  <span className="text-red-500">{errors[name]}</span>
                )}
              </div>
            ))}

            <div>
              <label className="block mb-1 text-textclr2">
                Which type of mint would be your preferred? *
              </label>
              <select
                name="mintType"
                value={formData.mintType}
                onChange={handleChange}
                aria-placeholder="Select an option"
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="Whitelist and Public">
                  Whitelist and Public
                </option>
                <option value="Presale">Presale</option>
                <option value="Whitelist & Public">Whitelist & Public</option>
                <option value="Public Only">Public Only</option>
                <option value="Other">Other</option>
              </select>
              {errors.mintType && (
                <span className="text-red-500">{errors.mintType}</span>
              )}
            </div>

            <div>
              <label className="block mb-1 text-textclr2">
                Have you worked on any previous projects before this one? *
              </label>
              <select
                name="previousProjects"
                value={formData.previousProjects}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Select an option</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
              {errors.previousProjects && (
                <span className="text-red-500">{errors.previousProjects}</span>
              )}
            </div>

            {formData.previousProjects === "Yes" && (
              <div>
                <label className="block mb-1 text-textclr2">
                  If you have worked on a previous project, what is the name of
                  this project?
                </label>
                <input
                  type="text"
                  name="previousProjectName"
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            )}

            <button
              type="submit"
              className="p-2 text-black rounded btn-ghost bg-textclr2 hover:bg-textclr2/60 hover:text-white/80"
            >
              Submit
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ContactForm;
