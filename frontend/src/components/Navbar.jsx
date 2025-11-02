import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import logo from "../assets/BattleIDE.png"
import { LayoutDashboard } from "lucide-react"; 
const Link = ({ to, children, className }) => <a href={to} className={className}>{children}</a>;

const Navbar = () => {

  return (
    <header className="flex w-full justify-between fixed bg-transparent z-50 p-4">
      <img src={logo} alt="logo" className="h-8" />
      <SignedOut>
        <div className="text-white">
          <div className="text-lg bg-gradient-to-r flex  gap-3   from-black/60 to-white/5   backdrop-blur-lg text-white  p-2 px-4    rounded-full border-2 border-l-0 border-b-1 border-white/30 filter ">
            <SignInButton >
              <button className="hover:text-cyan-500 cursor-pointer">
                Register
              </button>
            </SignInButton >
            <span className="select-none">|</span>
            <SignInButton >

              <button className="hover:text-cyan-500 cursor-pointer">
                Login
              </button>
            </SignInButton >
          </div>
        </div>
      </SignedOut>
      <SignedIn>
        <div className="flex gap-2">
          <Link
            to="/dashboard"
            className="bg-gradient-to-r select-none from-black/60 to-white/5 text-white font-semibold backdrop-blur-lg flex justify-center items-center px-4 rounded-full border-2 border-l-0 border-b-1 border-white/30 filter hover:bg-white/10 transition-colors"
          >
            <LayoutDashboard className="w-5 h-5 mr-2" />
            Dashboard
          </Link>
          <div className="bg-gradient-to-r select-none from-black/60 to-white/5 text-white font-semibold backdrop-blur-lg flex justify-center items-center px-4 rounded-4xl border-2 border-l-0 border-b-1 border-white/30 filter">
            ACE I
          </div>
          <div className="bg-gradient-to-r from-black/60 to-white/5 backdrop-blur-lg flex justify-center items-center p-1 rounded-full border-2 border-l-0 border-b-1 border-white/30 filter">
            <UserButton

              appearance={{
                elements: {
                  avatarBox: "w-8 h-8",
                },
              }}
            />
          </div>
        </div>
      </SignedIn>
    </header>
  );
};

export default Navbar;
