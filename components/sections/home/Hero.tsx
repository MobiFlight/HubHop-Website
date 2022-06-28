import Image from "next/image";
import hubhopLogo from "../../../public/images/logo.png";
import mfLogo from "../../../public/images/mf_logo.jpg";
import Link from "next/link";

const Hero: React.FC = () => {
  const customLoader = ({ src }: any) => {
    return src;
  };
  return (
    <div className="container mx-auto flex min-h-screen p-3 md:p-0">
      <div className="mt-10 flex w-full flex-col justify-between md:mt-52 md:flex-row">
        <div className="w-full space-y-10 md:w-2/5 md:space-y-3">
          <h1 className="text-5xl font-bold text-hhOrange">
            Create, Share, Improve
          </h1>
          <p className="text-justify text-lg">
            HubHop is an API which consolidates Microsoft Flight Simulator 2020
            variables and events and provides unique, understandable and
            standardized events and variables.
          </p>
          <Link href={"/presets"}>
            <button className="upper w-full rounded-lg bg-hhOrange py-3 px-5 text-xl font-semibold text-hhBG transition-all hover:bg-hhOrangeShade-600 md:w-fit">
              View contributions
            </button>
          </Link>
          <Link href={"https://www.mobiflight.com/en/index.html"}>
            <a
              target="_blank"
              className="flex items-center space-x-2 transition-all hover:text-hhOrange"
            >
              <p className="-mt-1 text-left">
                Created and sponsored by Mobiflight and the Mobiflight community
              </p>
              <div className="w-8">
                <Image loader={customLoader} priority src={mfLogo} unoptimized />
              </div>
            </a>
          </Link>
        </div>
        <div className="hidden h-max w-full justify-center md:flex md:w-2/5">
          <Image loader={customLoader} priority src={hubhopLogo} unoptimized />
        </div>
      </div>
    </div>
  );
};

export default Hero;
