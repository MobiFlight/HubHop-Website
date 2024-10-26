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
}) => {
  const [filterOpen, setFilterOpen] = useState(true);
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

  return (
    <div
      className={`sticky top-3 flex flex-col space-y-3 self-start rounded-lg bg-hhCard/40 p-3 transition-all ${
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
            <h4 className={`${!filterOpen ? `hidden` : `block`}`}>Filter</h4>
          </div>
          <div className="text-2xl">
            {filterOpen ? <HiChevronLeft /> : <HiChevronRight />}
          </div>
        </button>
        {!filterOpen && (
          <button
            onClick={() => setFilterOpen((prev) => !prev)}
            className="mt-5 origin-center -rotate-90 pb-10"
          >
            <p className="text-4xl">Filter</p>
          </button>
        )}
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
              {uniqueVendor.map((o, i) => (
                <option key={i as any}>{o as String[]}</option>
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
              {uniqueAircraft.map((o, i) => (
                <option key={i as any}>{o as String[]}</option>
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
              {uniqueSystem.map((o, i) => (
                <option key={i as any}>{o as String[]}</option>
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
              {uniqueType.map((o, i) => (
                <option key={i as any}>{o as String[]}</option>
              ))}
            </select>
          </div>
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
