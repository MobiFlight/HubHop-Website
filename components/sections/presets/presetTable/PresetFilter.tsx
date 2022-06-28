import { useState } from "react";
import {
  HiAdjustments,
  HiOutlineSearchCircle,
  HiChevronRight,
  HiChevronLeft,
  HiOutlineLightBulb,
} from "react-icons/hi";
import { GiCommercialAirplane } from "react-icons/gi";
import { MdBusiness } from "react-icons/md";
import { BiCog, BiJoystickButton } from "react-icons/bi";
import { motion } from "framer-motion";
import { AuthenticatedTemplate } from "@azure/msal-react";

interface Props {
  search: Function;
  filterVendor: Function;
  resetFilter: Function;
  filteredPresets: any;
  filterAircraft: Function;
  filteredVendors: any;
  filteredItems: any;
  filteredAircrafts: any;
  filteredSystems: any;
  filteredPresetTypes: any;
  filterSystem: Function;
  filterPresetType: Function;
  showReportedPresets: boolean;
  showMyPresets: boolean;
  setShowReportedPresets: Function;
  setShowMyPresets: Function;
}

const PresetFilter: React.FC<Props> = ({
  filteredPresets,
  filteredVendors,
  filteredItems,
  search,
  filterVendor,
  resetFilter,
  filterAircraft,
  filteredAircrafts,
  filteredSystems,
  filteredPresetTypes,
  filterSystem,
  filterPresetType,
  showReportedPresets,
  showMyPresets,
  setShowReportedPresets,
  setShowMyPresets,
}) => {
  const [filterOpen, setFilterOpen] = useState(true);
  const [myPresetTooltip, setMyPresetTooltip] = useState(false);

  const uniqueVendor = Array.from(
    new Set(filteredItems.map((item: any) => item.vendor).sort())
  );
  const uniqueAircraft = Array.from(
    new Set(filteredItems.map((item: any) => item.aircraft).sort())
  );
  const uniqueSystem = Array.from(
    new Set(filteredItems.map((item: any) => item.system).sort())
  );
  const uniqueType = Array.from(
    new Set(filteredItems.map((item: any) => item.presetType).sort())
  );

  const draw = {
    hidden: {
      pathLength: 0,
      transition: {
        pathLength: { type: "spring", duration: 0.5, bounce: 0 },
        opacity: { duration: 0.01 },
      },
      opacity: 0,
    },
    visible: () => {
      return {
        pathLength: 1,
        opacity: 1,
        transition: {
          pathLength: { type: "spring", duration: 0.5, bounce: 0 },
          opacity: { duration: 0.01 },
        },
      };
    },
  };

  var timeout: any;

  const showTip = () => {
    timeout = setTimeout(() => {
      setMyPresetTooltip(true);
    }, 400);
  };

  const hideTip = () => {
    clearInterval(timeout);
    setMyPresetTooltip(false);
  };

  return (
    <div
      className={`top-3 mb-5 flex flex-col space-y-3 self-start rounded-lg bg-hhCard/30 p-3 transition-all md:sticky md:mb-0 ${
        filterOpen ? `w-full md:w-96` : `w-full md:w-16`
      }`}
    >
      <div>
        <button
          onClick={() => setFilterOpen((prev) => !prev)}
          className="flex w-full items-center justify-between"
        >
          <div className="flex items-center justify-center space-x-1 text-2xl">
            <HiAdjustments />
            <h4 className={`${!filterOpen ? `block md:hidden` : `md:block`}`}>
              Filter
            </h4>
          </div>
          <div className="text-2xl">
            {filterOpen ? <HiChevronLeft /> : <HiChevronRight />}
          </div>
        </button>
        <div className="hidden md:block">
          {!filterOpen && (
            <button
              onClick={() => setFilterOpen((prev) => !prev)}
              className="mt-5 origin-center -rotate-90 pb-10"
            >
              <p className="hidden text-4xl md:block">Filter</p>
            </button>
          )}
        </div>
      </div>
      <div
        className={`flex flex-col text-sm ${!filterOpen ? `hidden` : `block`}`}
      >
        <div className="flex flex-col space-y-3">
          <div>
            <div className="flex items-center space-x-1">
              <HiOutlineSearchCircle />
              <label htmlFor="searchfield">Search Preset</label>
            </div>
            <textarea
              id="seachfield"
              className="w-full rounded-lg border border-hhOrange bg-hhBG px-3 py-1 text-hhText"
              value={filteredPresets}
              onChange={(e) => search(e)}
            />
          </div>
          <div>
            <div className="flex items-center space-x-1">
              <MdBusiness />
              <label htmlFor="searchfield">Select Vendor</label>
            </div>
            <select
              className="w-full rounded-lg border border-hhOrange bg-hhBG px-3 py-1 text-hhText"
              onChange={(e) => filterVendor(e)}
              value={filteredVendors}
            >
              <option value="">All Vendors</option>
              {uniqueVendor.map((o) => (
                <option key={o as any}>{o as String[]}</option>
              ))}
            </select>
          </div>
          <div>
            <div className="flex items-center space-x-1">
              <GiCommercialAirplane />
              <label htmlFor="searchfield">Search Aircraft</label>
            </div>
            <select
              className="w-full rounded-lg border border-hhOrange bg-hhBG px-3 py-1 text-hhText"
              onChange={(e) => filterAircraft(e)}
              value={filteredAircrafts}
            >
              <option value="">All Aircraft</option>
              {uniqueAircraft.map((o) => (
                <option key={o as any}>{o as String[]}</option>
              ))}
            </select>
          </div>
          <div>
            <div className="flex items-center space-x-1">
              <BiCog />
              <label htmlFor="searchfield">Select System</label>
            </div>
            <select
              className="w-full rounded-lg border border-hhOrange bg-hhBG px-3 py-1 text-hhText"
              onChange={(e) => filterSystem(e)}
              value={filteredSystems}
            >
              <option value="">All Systems</option>
              {uniqueSystem.map((o) => (
                <option key={o as any}>{o as String[]}</option>
              ))}
            </select>
          </div>
          <div>
            <div className="flex items-center space-x-1">
              <div className="flex space-x-1">
                <BiJoystickButton />
                <HiOutlineLightBulb />
              </div>
              <label htmlFor="searchfield">Select Input/Output</label>
            </div>
            <select
              className="w-full rounded-lg border border-hhOrange bg-hhBG px-3 py-1 text-hhText"
              onChange={(e) => filterPresetType(e)}
              value={filteredPresetTypes}
            >
              <option value="">All Inputs/Outputs</option>
              {uniqueType.map((o) => (
                <option key={o as any}>{o as String[]}</option>
              ))}
            </select>
          </div>
          <AuthenticatedTemplate>
            <div>
              <button
                onClick={(e) => setShowMyPresets(e)}
                className="mt-5 flex items-center justify-center space-x-2"
              >
                <motion.div
                  animate={
                    showMyPresets
                      ? { background: "#ffa047" }
                      : { background: "#545963" }
                  }
                  className={`flex h-5 w-5 items-center justify-center rounded border border-hhOrange text-hhBG`}
                  onMouseEnter={showTip}
                  onMouseLeave={hideTip}
                >
                  {showMyPresets && (
                    <motion.div className="text-xs">
                      <motion.svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 p-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                        initial="hidden"
                        animate="visible"
                      >
                        <motion.path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                          variants={draw}
                        />
                      </motion.svg>
                    </motion.div>
                  )}
                </motion.div>
                <label className="relative cursor-pointer text-left text-sm">
                  {myPresetTooltip && (
                    <p className="absolute bottom-6 w-[200px] rounded-lg bg-hhCard p-3 font-semibold">
                      Select only added or updated presets by you.
                    </p>
                  )}
                  <p>Show my presets</p>
                </label>
              </button>
              {localStorage
                .getItem("roles")
                ?.toLowerCase()
                .includes("moderator") && (
                <button
                  onClick={(e) => setShowReportedPresets(e)}
                  className="mt-5 flex items-center justify-center space-x-2"
                >
                  <motion.div
                    animate={
                      showReportedPresets
                        ? { background: "#ffa047" }
                        : { background: "#545963" }
                    }
                    className={`flex h-5 w-5 items-center justify-center rounded border border-hhOrange text-hhBG`}
                  >
                    {showReportedPresets && (
                      <motion.div className="text-xs">
                        <motion.svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 p-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                          initial="hidden"
                          animate="visible"
                        >
                          <motion.path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                            variants={draw}
                          />
                        </motion.svg>
                      </motion.div>
                    )}
                  </motion.div>
                  <label className="cursor-pointer text-sm">
                    Show reported presets
                  </label>
                </button>
              )}
            </div>
          </AuthenticatedTemplate>
        </div>
        <button
          className="mt-6 w-full rounded-lg border border-hhOrange bg-hhBG px-3 py-1 text-hhText transition-all hover:bg-hhOrange hover:text-hhBG"
          onClick={() => resetFilter()}
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default PresetFilter;
