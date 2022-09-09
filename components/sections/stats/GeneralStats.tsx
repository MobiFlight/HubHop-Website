import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import DataTable, { createTheme } from "react-data-table-component";
import LoadingSpinner from "../Shared/LoadingSpinner";
import Modal from "../Shared/Modal";
import StatsCard from "./ui/StatsCard";
import { db } from "../../../services/db";
import OpenPresetButton from "../presets/ui/OpenPresetButton";
import PresetPreviewLabel from "../presets/ui/PresetInputLabel";

interface Props {
  presets: String[];
  stats: any;
}

const GeneralStats: React.FC<Props> = ({ presets, stats }) => {
  const [modal, setModal] = useState(false);
  const [contModal, setContModal] = useState(false);
  const [singleCont, setSingleCont] = useState("");
  const [contSearch, setContSearch] = useState("");
  const [contPresetSearch, setContPresetSearch] = useState("");
  const [cont, setCont] = useState<any>([]);

  const columns: any = [
    {
      name: "Name",
      selector: (row: any) => row.name,
      maxWidth: "60%",
      sortable: true,
    },
    {
      name: "Submissions or updates",
      selector: (row: any) => row.presets,
      maxWidth: "40%",
      sortable: true,
    },
  ];
  const columnSingle: any = [
    {
      name: "Last modification",
      selector: (row: any) => new Date(row.createdDate).toLocaleString(),
      sortable: true,
      maxWidth: "15%",
      hide: "md",
    },
    {
      name: "Author / Updated",
      selector: (row: any) => (row.author ? "Author" : "Updated"),
      sortable: true,
      maxWidth: "10%",
      hide: "md",
    },
    {
      name: "Vendor",
      selector: (row: any) => row.vendor,
      sortable: true,
      maxWidth: "10%",
      hide: "md",
    },
    {
      name: "Aircraft",
      selector: (row: any) => row.aircraft,
      sortable: true,
      maxWidth: "10%",
    },
    {
      name: "System",
      selector: (row: any) => row.system,
      sortable: true,
      maxWidth: "10%",
      hide: "md",
    },
    {
      name: "Input/Output",
      selector: (row: any) => row.presetType,
      sortable: true,
      maxWidth: "10%",
      hide: "md",
    },
    {
      name: "Preset name",
      selector: (row: any) => row.label,
      sortable: true,
      maxWidth: "50%",
    },
  ];

  createTheme("hubhop", {
    text: {
      primary: "#D2D0D2",
      secondary: "#D2D0D2",
    },
    background: {
      default: "transparent",
    },
    context: {
      background: "transparent",
      text: "#D2D0D2",
    },
    divider: {
      default: "#33353e",
    },
    highlightOnHover: {
      default: "#ffa047",
      text: "#33353e",
      fontWeight: 700,
    },
    button: {
      default: "#D2D0D2",
      focus: "rgba(0,0,0,.12)",
      hover: "rgba(0,0,0,.12)",
      disabled: "rgba(0, 0, 0, .18)",
    },
  });

  const customStyles = {
    noData: {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#D2D0D2",
        backgroundColor: "transparent",
      },
    },
    rows: {
      highlightOnHoverStyle: {
        fontWeight: 700,
      },
    },
    headRow: {
      style: {
        fontWeight: 700,
        fontSize: "0.9rem",
      },
    },
  };

  const contributor = Array.from(
    new Set(
      presets
        .filter((un: any) => un.author != undefined)
        .map((item: any) => item.author)
        .sort()
    )
  );

  useEffect(() => {
    var ar = [];
    for (const contribute of contributor) {
      ar.push({
        name: contribute,
        presets: presets
          .filter((un: any) => un.author != undefined)
          .filter(
            (fi: any) => fi.author === contribute || fi.updatedBy === contribute
          ).length,
      });
    }
    setCont(ar);
  }, [presets]);

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
        <div
          onClick={() => setModal((prev) => !prev)}
          className="w-full cursor-pointer rounded-xl transition-all hover:bg-hhCard"
        >
          <StatsCard title={"Total contributors"}>
            <div>
              {new Set(presets.map((preset: any) => preset.author)).size > 0 ? (
                <div className="flex items-baseline space-x-2">
                  <p className="text-3xl font-bold">
                    {
                      new Set(
                        presets
                          .filter((un: any) => un.author != undefined)
                          .map((preset: any) => preset.author)
                      ).size
                    }
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
        </div>
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
      <AnimatePresence>
        {modal && (
          <Modal
            title="Contributors"
            closeModal={() => (setModal(false), setContSearch(""))}
            closeModalX={() => setModal(false)}
            position="fixed"
            height={true}
          >
            <input
              placeholder="Search contributor"
              className={`w-1/4 rounded-lg border bg-hhBG px-3 py-1 text-sm text-hhText`}
              onChange={(e) => setContSearch(e.target.value)}
            />
            <div className="w-[80vw]">
              <DataTable
                columns={columns}
                data={cont.filter((search: any) =>
                  search.name.toLowerCase().includes(contSearch)
                )}
                customStyles={customStyles}
                pagination
                highlightOnHover
                responsive={true}
                theme="hubhop"
                paginationPerPage={5}
                paginationRowsPerPageOptions={[5, 10, 20, 30, 50, 100]}
                defaultSortFieldId={2}
                defaultSortAsc={false}
                onRowClicked={(row: any) => (
                  setSingleCont(row.name), setContModal((prev) => !prev)
                )}
              />
              {contModal && (
                <Modal
                  title={"Presets by " + singleCont}
                  position="fixed"
                  closeModal={() => setContModal(false)}
                  closeModalX={() => setContModal(false)}
                >
                  <input
                    placeholder="Search preset"
                    className={`w-1/4 rounded-lg border bg-hhBG px-3 py-1 text-sm text-hhText`}
                    onChange={(e) => setContPresetSearch(e.target.value)}
                  />
                  <div className="w-[70vw]">
                    <DataTable
                      columns={columnSingle}
                      data={presets
                        .filter(
                          (cont: any) =>
                            cont.author === singleCont ||
                            cont.updatedBy === singleCont
                        )
                        .filter(
                          (na: any) =>
                            na.label.toLowerCase().includes(contPresetSearch) ||
                            na.vendor
                              .toLowerCase()
                              .includes(contPresetSearch) ||
                            na.aircraft
                              .toLowerCase()
                              .includes(contPresetSearch) ||
                            na.system
                              .toLowerCase()
                              .includes(contPresetSearch) ||
                            na.presetType
                              .toLowerCase()
                              .includes(contPresetSearch) ||
                            na.code.toLowerCase().includes(contPresetSearch)
                        )
                        .sort(
                          (a: any, b: any) =>
                            new Date(b.createdDate).valueOf() -
                            new Date(a.createdDate).valueOf()
                        )}
                      customStyles={customStyles}
                      pagination
                      highlightOnHover
                      responsive={true}
                      theme="hubhop"
                      paginationPerPage={5}
                      paginationRowsPerPageOptions={[5, 10, 20, 30, 50, 100]}
                      onRowClicked={(row: any) =>
                        window.open(
                          "https://hubhop.mobiflight.com/preset/?id=" + row.id,
                          "_blank"
                        )
                      }
                    />
                  </div>
                </Modal>
              )}
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GeneralStats;
