import Navbar from "../components/Navbar";
import heroImage from "../assets/hero.png";

const Home = () => {
  return (
    <div className="min-h-screen bg-[#111c22] text-white ">
      <main className="px-4 md:px-10 py-8 max-w-[960px] mx-auto flex flex-col gap-10">
        {/* Hero Section */}
        <section
          className="min-h-[440px] rounded-xl bg-cover bg-center p-8 flex flex-col justify-end gap-6"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.4)), url(${heroImage})`,
          }}
        >
          <div className="w-full">
            <h1 className=" text-3xl md:text-5xl font-semibold leading-tight tracking-tight">
              Elevate Your Coding Skills with CodeCraft
            </h1>
            <p className="text-sm md:text-base mt-2 ">
              Join a vibrant community of developers, tackle challenging problems, and unlock your full potential.
            </p>
          </div>
          <button className="h-12 px-5 cursor-pointer hover:bg-[#2bb3ee]  bg-[#2badee] text-[#111c22] text-base font-semibold rounded-xl w-fit">
            Get Started
          </button>
        </section>

        {/* Project Plan Section */}
        {/* <section>
          <h2 className="text-[22px] font-bold mb-4">Our Project Plan</h2>
          <div className="flex overflow-x-auto gap-4">
            {[
              {
                title: "Phase 1: Foundations",
                description:
                  "Build a strong base with fundamental concepts and introductory challenges.",
                image:
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuBwLC3_KfN--OjfQidRgDawrspEpQx5NeAmm3W-HFoOH-41yLIvHJP7biRmKyazn3zLfjmB9NXQq1hi6Zgp2BsBv0L-W8oMtVAZt7IYTLh8jWfhfP5FktGfBIO3Ap12aM_dfbAbnn4lJrQPn2sO38XV4k9FRz-_JmegSmRo4DKuUKBZZG25B5-6o-pjUlB_0Lr4crwwxbzqTCBgivNXYm2ikd8u48AQ_fqzIZKkdjlox0euAb8uTkjWnMe0btsHkIB8KnXCeWYgieQ",
              },
              {
                title: "Phase 2: Mastery",
                description: "Dive deeper into advanced topics, algorithms, and data structures.",
                image:
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuAyUH-MkuuMnZqyNMDYpU6LBMEy9T1A7glXDdcqR01gQUOlNfB_zYcjuHl-naF1BQQcST7G9KGNwA2GAii-jOT2zhJXad0iDwBYeLxnmZATpYgxj-wfgO5ffKWABivfVUq1v4e2T3y22Zein2zrIg4xV1d7wO7juEiiPAEOBKF5mE4RmwnXMCQbfSFduyaaKN5zURxm9cl_hce9A_xJb0Mgji-bwcjAzpuM8UCS27j9-oRYPNWSCb6GBYYeZ77gFMnyCqi1BcigczY",
              },
              {
                title: "Phase 3: Innovation",
                description: "Apply your skills to real-world projects and contribute to open source.",
                image:
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuDuhibeyYtZEiNZYgASuQhth41eiKyoeVRlkLh-4n9ZjXF9LjCBCQfDbZ44I76o7KBIoi_W6GOsS-XXmi9BFSlpxWkJYgORg0qRAHwM-4SzKFJI9Su7hotK77Yio_I19v3YPm3bss46jB2yeHALjlzyNACGgo7_vTXiBqqWZMEPGEkuHWEczHNGXb3RlmGPNbxzO3LBnRasVPk_J-kKXGVyEYJ7WogGS0AKL91Mfrnm0cNfV80lKtSUb2cm1g38OxXY7AqJZL2LsCA",
              },
            ].map((phase, index) => (
              <div key={index} className="min-w-[280px] bg-[#233c48] rounded-xl overflow-hidden">
                <img src={phase.image} alt={phase.title} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="text-base font-bold">{phase.title}</h3>
                  <p className="text-sm mt-2">{phase.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section> */}

        {/* Call to Action */}
        <section className="text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to start your journey?</h2>
          <button className="h-12 px-6 bg-[#2badee] text-[#111c22] text-base font-bold rounded-xl">
            Join CodeCraft Today
          </button>
        </section>
      </main>
    </div>
  );
};

export default Home;
