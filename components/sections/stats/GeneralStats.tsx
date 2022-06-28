import LoadingSpinner from "../Shared/LoadingSpinner";
import StatsCard from "./ui/StatsCard";

interface Props {
  presets: String[];
  stats: any;
}

const GeneralStats: React.FC<Props> = ({ presets, stats }) => {
  return (
    <div className="container mx-auto flex flex-col">
      <h2 className="text-2xl font-semibold">General statistics</h2>
      <div className="flex flex-col justify-items-center space-y-3 md:grid md:grid-cols-2 md:gap-10 md:space-y-0 xl:grid-cols-4">
        <StatsCard title={"Total presets"}>
          <div className="text-3xl font-bold">
            {presets.length ? <p>{presets.length}</p> : <LoadingSpinner />}
          </div>
        </StatsCard>
        <StatsCard title={"Aircraft with most presets"}>
          <div className="text-3xl font-bold">
            {stats.aircrafts ? (
              <div className="flex items-baseline space-x-2">
                <p>{stats.aircrafts[0].presetCount}</p>
                <p className="text-base font-normal">
                  {stats.aircrafts[0]._id.vendor} -{" "}
                  {stats.aircrafts[0]._id.aircraft}
                </p>
              </div>
            ) : (
              <LoadingSpinner />
            )}
          </div>
        </StatsCard>
        <StatsCard title={"Total contributors"}>
          <div>
            {new Set(presets.map((preset: any) => preset.author)).size > 0 ? (
              <div className="flex items-baseline space-x-2">
                <p className="text-3xl font-bold">
                  {new Set(presets.map((preset: any) => preset.author)).size}
                </p>
                <p>Individual users</p>
              </div>
            ) : (
              <div className="text-3xl">
                <LoadingSpinner />
              </div>
            )}
          </div>
        </StatsCard>
        <StatsCard title={"Top contributor"}>
          <div className="text-3xl font-bold">
            {stats.contributors ? (
              <div className="flex items-baseline space-x-2">
                <p>{stats.contributors[0].contributions}</p>
                <p className="text-base font-normal">
                  {stats.contributors[0]._id}
                </p>
              </div>
            ) : (
              <LoadingSpinner />
            )}
          </div>
        </StatsCard>
      </div>
    </div>
  );
};

export default GeneralStats;
