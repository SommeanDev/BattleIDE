
import vid from "../assets/bg_vid.mp4"; 

const Home = () => {
  return (
    <div className="relative flex items-center justify-center w-full h-screen overflow-hidden">
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover "
      >
        <source src={vid} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className=" absolute text-white flex justify-center items-end z-10  h-full w-full">
        <div className="flex flex-col justify-center items-center py-12">
          <h1 className="text-4xl tracking-widest mb-4">Elevate your coding skills!</h1>
          <button class="text-3xl bg-gradient-to-r  from-black/60 to-white/5   backdrop-blur-lg text-white  p-2 px-8 cursor-pointer hover:bg-white/10  rounded-full border-2 border-l-0 border-b-1 border-white/30 filter ">
            &lt; Play &gt;
          </button>
        </div>

      </div>
    </div>
  );
};

export default Home;
