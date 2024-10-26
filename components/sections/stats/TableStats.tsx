import DataTable, { createTheme } from "react-data-table-component";
import { useState } from "react";
import OpenPresetButton from "../presets/ui/OpenPresetButton";
import PresetPreviewLabel from "../presets/ui/PresetInputLabel";

interface Props {
  data: string[];
  added: boolean;
}

const TableStats: React.FC<Props> = ({ data, added }) => {
  const columns: any = [
    {
      name: added ? "Added" : "Updated",
      selector: (row: any) => new Date(row.createdDate).toLocaleString(),
      maxWidth: "10%",
    },
    {
      name: added ? "Added by" : "Updated by",
      selector: (row: any) => (added ? row.author : row.updatedBy),
      maxWidth: "10%",
      hide: "md",
    },
    {
      name: "Vendor",
      selector: (row: any) => row.vendor,
      maxWidth: "10%",
      hide: "md",
    },
    {
      name: "Aircraft",
      selector: (row: any) => row.aircraft,
      maxWidth: "10%",
      hide: "md",
    },
    {
      name: "System",
      selector: (row: any) => row.system,
      maxWidth: "10%",
      hide: "md",
    },
    {
      name: "Input/Output",
      selector: (row: any) => row.presetType,
      maxWidth: "10%",
      hide: "md",
    },
    {
      name: "Preset name",
      selector: (row: any) => row.label,
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

  const ExpandedComponent = ({ data }: { data: any }) => {
    const [updatedBy, setUpdatedBy] = useState(data.updatedBy);
    const [createdDate, setCreatedDate] = useState(data.createdDate);
    const [version, setVersion] = useState(data.version);
    const [reported, setReported] = useState(data.reported);
    const [vendor, setVendor] = useState(data.vendor);
    const [aircraft, setAircraft] = useState(data.aircraft);
    const [system, setSystem] = useState(data.system);
    const [presetType, setPresetType] = useState(data.presetType);
    const [label, setLabel] = useState(data.label);
    const [code, setCode] = useState(data.code);
    const [description, setDescription] = useState(data.description);
    const [author, setAuthor] = useState(data.author);

    return (
      <div className="relative -mx-3 md:m-0">
        <div>
          <div
            className={`p-3 md:p-0 text-${data.text} ${"container mx-auto"}`}
          >
            <div>
              <h2 className={`ml-5 pt-3 font-bold text-hhText`}>{label}</h2>
              <div className="flex w-full flex-col space-y-2 p-5 text-sm text-hhText md:flex-row md:space-y-0 md:space-x-5">
                <div className="flex w-full flex-col space-y-2 md:w-1/6">
                  {version > "1" ? (
                    <PresetPreviewLabel
                      title={"Updated by"}
                      editData={updatedBy}
                    />
                  ) : (
                    <PresetPreviewLabel title={"Author"} editData={author} />
                  )}
                  <PresetPreviewLabel
                    title={version > "1" ? "Updated" : "Added"}
                    editData={new Date(createdDate).toLocaleString()}
                  />
                  <PresetPreviewLabel title={"Version"} editData={version} />
                  {
                    <PresetPreviewLabel
                      title={"Reported"}
                      editData={reported >= "1" ? reported : "0"}
                    />
                  }
                </div>
                <div className="flex w-full flex-col space-y-2 md:w-1/6">
                  <PresetPreviewLabel
                    title={"Vendor"}
                    editData={vendor}
                    inputHandler={(e: any) => setVendor(e)}
                  />
                  <PresetPreviewLabel
                    title={"Aircraft"}
                    editData={aircraft}
                    inputHandler={(e: any) => setAircraft(e)}
                  />
                  <PresetPreviewLabel
                    title={"System"}
                    editData={system}
                    inputHandler={(e: any) => setSystem(e)}
                  />
                  <PresetPreviewLabel
                    title={"Input / Output"}
                    editData={presetType}
                    inputHandler={(e: any) => setPresetType(e)}
                  />
                </div>
                <div className="flex w-full flex-col space-y-2 md:w-4/6">
                  <PresetPreviewLabel
                    title={"Preset name"}
                    editData={label}
                    inputHandler={(e: any) => setLabel(e)}
                  />
                  <PresetPreviewLabel
                    title={"Code"}
                    editData={code}
                    inputHandler={(e: any) => setCode(e)}
                  />
                  <PresetPreviewLabel
                    title={"Description"}
                    editData={
                      description ? description : "No description available"
                    }
                    inputHandler={(e: any) => setDescription(e)}
                  />
                </div>
              </div>
              <div className="flex w-full justify-end px-5 pb-5 pt-2">
                <div className="flex flex-col-reverse justify-between space-y-reverse md:flex-row md:items-center md:space-y-0 md:space-x-5">
                  {<OpenPresetButton id={data._id} />}
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr className="border-hhBG" />
      </div>
    );
  };

  return (
    <div className="relative flex w-full flex-col rounded-lg bg-hhCard/40">
      <DataTable
        columns={columns}
        data={data}
        customStyles={customStyles}
        pagination
        expandOnRowClicked
        expandableRows
        expandableRowsComponent={ExpandedComponent}
        highlightOnHover
        responsive={true}
        theme="hubhop"
        paginationPerPage={5}
        paginationRowsPerPageOptions={[5, 15, 20, 30, 50, 100]}
        dense
      />
    </div>
  );
};

export default TableStats;
