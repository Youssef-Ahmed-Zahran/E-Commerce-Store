// components/Loader.jsx
const Loader = ({ size = "md" }) => {
  const sizeClass = {
    sm: "w-5 h-5",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  }[size];

  return (
    <div
      className={`${sizeClass} border-4 border-emerald-500 border-t-transparent rounded-full animate-spin`}
    />
  );
};

export default Loader;
