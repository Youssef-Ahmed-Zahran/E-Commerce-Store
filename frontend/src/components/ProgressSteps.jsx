// src/components/ProgressSteps.jsx
const ProgressSteps = ({ step1, step2, step3 }) => {
  const steps = [
    { number: 1, label: "Sign In", active: step1 },
    { number: 2, label: "Shipping", active: step2 },
    { number: 3, label: "Summary", active: step3 },
  ];

  return (
    <div className="flex justify-center items-center space-x-4 sm:space-x-8 md:space-x-12 py-8 px-4">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div
            className={`flex flex-col items-center transition-all duration-300 ${
              step.active ? "text-emerald-400" : "text-gray-500"
            }`}
          >
            <div
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-lg sm:text-xl font-bold border-4 transition-all ${
                step.active
                  ? "bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/50"
                  : "bg-slate-700 text-gray-400 border-slate-600"
              }`}
            >
              {step.active ? "Check" : step.number}
            </div>
            <span className="mt-3 text-xs sm:text-sm font-medium hidden sm:block">
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-16 sm:w-24 md:w-32 h-1 transition-all duration-500 ${
                step.active ? "bg-emerald-500" : "bg-slate-600"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default ProgressSteps;
