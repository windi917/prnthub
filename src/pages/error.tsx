const errorGif =
  "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExdjV1azM4OGxkOGtwMGl1anZiZHljMnRpMnlwb2JsMXlrNjduaGZtYyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/j9XoexYMmd7LdntEK4/giphy.webp";

const ErrorPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-radial-gradient">
      <div className="flex flex-col items-center p-10 border rounded-lg shadow-lg bg-white/10 border-textclr2">
        <img
          src={errorGif}
          alt="Error"
          className="w-fit h-fit mb-6 !rounded-sm"
        />
        <h1 className="mb-4 text-5xl font-primaryBold text-textclr2">404</h1>
        <p className="mb-6 text-xl text-center text-textclr2">
          Sorry, the page you are looking for does not exist. ☹️
        </p>
        <button
          onClick={() => (window.location.href = "/")}
          className="px-6 py-2 transition duration-300 rounded-full text-slate-100 bg-textclr2/40 hover:bg-textclr2/80"
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
