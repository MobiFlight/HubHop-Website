import DataTable, { createTheme } from "react-data-table-component";
import { useState } from "react";
import AddPresetButton from "../ui/addPreset/AddPresetButton";
import ExportPresetsButton from "../ui/exportPresets/ExportPresetsButton";
import PresetCard from "../ui/PresetCard";
import { msalInstance } from "../../../../services/msal";
import {
  getUserSettings,
  getAccessToken,
} from "../../../../services/msalFunctions";

interface Props {
  data: string[];
  setExportModalOpen: Function;
  setAddModalOpen: Function;
  deletedToast: Function;
  reportedToast: Function;
  savedToast: Function;
  fixedToast: Function;
}

const PresetTable: React.FC<Props> = ({
  data,
  setExportModalOpen,
  setAddModalOpen,
  deletedToast,
  reportedToast,
  fixedToast,
  savedToast,
}) => {
  const columns: any = [
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
    localStorage.getItem("simType") === "xplane"
      ? {
          name: "Code Type",
          selector: (row: any) => row.codeType,
          sortable: true,
          maxWidth: "10%",
          hide: "md",
        }
      : {
          name: "",
          selector: (row: any) => row.codeType,
          sortable: true,
          maxWidth: "0%",
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

  const ExpandedComponent = ({ data }: { data: any }) => {
    const [updatedBy, setUpdatedBy] = useState(data.updatedBy);
    const [createdDate, setCreatedDate] = useState(data.createdDate);
    const [version, setVersion] = useState(data.version);
    const [reported, setReported] = useState(data.reported);
    const [vendor, setVendor] = useState(data.vendor);
    const [aircraft, setAircraft] = useState(data.aircraft);
    const [system, setSystem] = useState(data.system);
    const [presetType, setPresetType] = useState(data.presetType);
    const [codeType, setCodeType] = useState(data.codeType);
    const [label, setLabel] = useState(data.label);
    const [code, setCode] = useState(data.code);
    const [description, setDescription] = useState(data.description);
    const [author, setAuthor] = useState(data.author);

    return (
      <div className="relative -mx-3 md:m-0">
        <PresetCard
          id={data.id}
          label={label}
          updatedBy={updatedBy}
          author={author}
          createdDate={createdDate}
          version={version}
          reported={reported}
          vendor={vendor}
          aircraft={aircraft}
          system={system}
          presetType={presetType}
          codeType={codeType}
          code={code}
          description={description}
          data={data}
          showingHistory={false}
          text={"sm"}
          card={false}
          setVendor={(e: React.ChangeEvent<HTMLInputElement>) =>
            setVendor(e.target.value)
          }
          setAircraft={(e: React.ChangeEvent<HTMLInputElement>) =>
            setAircraft(e.target.value)
          }
          setSystem={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSystem(e.target.value)
          }
          setPresetType={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPresetType(e.target.value)
          }
          setCodeType={(e: React.ChangeEvent<HTMLInputElement>) =>
            setCodeType(e.target.value)
          }
          setLabel={(e: React.ChangeEvent<HTMLInputElement>) =>
            setLabel(e.target.value)
          }
          setCode={(e: React.ChangeEvent<HTMLInputElement>) =>
            setCode(e.target.value)
          }
          setDescription={(e: React.ChangeEvent<HTMLInputElement>) =>
            setDescription(e.target.value)
          }
          deletedToast={deletedToast}
          reportedToast={reportedToast}
          fixedToast={fixedToast}
          savedToast={savedToast}
        />
        <hr className="border-hhBG" />
      </div>
    );
  };

  async function login() {
    await msalInstance.handleRedirectPromise();
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length === 0) {
      await msalInstance
        .loginPopup()
        .then(() => {
          getAccessToken().then(() => getUserSettings());
        })
        .catch((error) => {
          console.error(`error during authentication: ${error}`);
          localStorage.setItem("roles", "Guest");
          localStorage.setItem("setAccessToken", "");
          msalInstance.logoutRedirect({}).catch((error) => {
            console.error(error);
          });
        });
    }
  }

  const [userPagination, setUserPagination] = useState(
    localStorage.getItem("pagination") === ""
      ? 15
      : parseInt(localStorage.getItem("pagination") || "15")
  );

  const rowsPerPage = [15, 20, 30, 50, 100];

  return (
    <div className="relative flex w-full flex-col rounded-lg bg-hhCard/40">
      <div className="absolute right-0 z-10 mr-2 mt-2 hidden items-center space-x-3 md:flex ">
        <div
          onClick={() => {
            if (localStorage.getItem("username")) {
              setAddModalOpen(true);
            } else login();
          }}
        >
          <AddPresetButton />
        </div>
      </div>
      <div className="absolute left-3 bottom-3 z-10 mr-2 mt-2 hidden items-center space-x-3 md:flex ">
        <div
          onClick={() => {
            if (localStorage.getItem("username")) {
              setExportModalOpen(true);
            } else login();
          }}
        >
          <ExportPresetsButton />
        </div>
      </div>
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
        paginationPerPage={userPagination}
        paginationRowsPerPageOptions={rowsPerPage}
        onChangeRowsPerPage={(currentRowsPerPage) => (
          setUserPagination(currentRowsPerPage),
          localStorage.setItem("pagination", currentRowsPerPage.toString())
        )}
        defaultSortFieldId={1}
      />
    </div>
  );
};

export default PresetTable;
