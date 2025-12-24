import './style.css';

function Hello({ onFinish }) {
  return (
    <h1 className="flex items-center text-4xl font-bold font-patrick">
      <span className="opacity-0 animate-[bracketSlideInLeft_1.6s_cubic-bezier(0.16,1,0.3,1)_forwards] mr-2 text-slate-500">
        「
      </span>

      <span className="opacity-0 animate-[textIn_1.2s_ease-out_forwards] delay-700 text-slate-700">
        Hello World!
      </span>

      <span 
        className="opacity-0 animate-[bracketSlideInRight_1.6s_cubic-bezier(0.16,1,0.3,1)_forwards] ml-2 delay-300 text-slate-500"
        onAnimationEnd={onFinish}
      >
        」
      </span>
    </h1>
  );
}

export default Hello;