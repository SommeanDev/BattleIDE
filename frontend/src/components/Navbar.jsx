import logo from "../assets/BattleIDE.png"

const Navbar = () => {
  return (
    <header className="flex w-full justify-between fixed bg-transparent z-50 p-4   ">
      <img src={logo} alt="logo" className="h-8" />
      <div className="text-white">
        <div class="text-lg bg-gradient-to-r flex  gap-3   from-black/60 to-white/5   backdrop-blur-lg text-white  p-2 px-4    rounded-full border-2 border-l-0 border-b-1 border-white/30 filter ">
          <button className="hover:text-cyan-500 cursor-pointer">
            Register
          </button>
          <span  className="select-none">|</span>
          <button className="hover:text-cyan-500 cursor-pointer">
            Login
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
