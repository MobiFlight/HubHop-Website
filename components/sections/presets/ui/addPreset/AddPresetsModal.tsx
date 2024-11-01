import { useEffect, useState } from "react";
import {
  BiAddToQueue,
  BiCog,
  BiJoystickButton,
  BiRename,
} from "react-icons/bi";
import { BsCardText, BsCheck2Square, BsList } from "react-icons/bs";
import { GiCommercialAirplane } from "react-icons/gi";
import { HiOutlineLightBulb, HiOutlineSearchCircle } from "react-icons/hi";
import { MdBusiness } from "react-icons/md";
import ButtonDark from "../../../Shared/ButtonDark";
import ButtonOrange from "../../../Shared/ButtonOrange";
import Modal from "../../../Shared/Modal";
import { useForm } from "react-hook-form";
import { FiExternalLink, FiRepeat } from "react-icons/fi";
import Link from "next/link";
import { AiOutlineLoading } from "react-icons/ai";
import { AnimatePresence, motion } from "framer-motion";
import Toast from "../../../Shared/Toast";
import { AuthenticatedTemplate } from "@azure/msal-react";
import { RiListSettingsLine } from "react-icons/ri";
import { db } from "../../../../../services/db";

interface Props {
  setAddModalOpen: Function;
  presets: any;
}

const AddPresetsModal: React.FC<Props> = ({ setAddModalOpen, presets }) => {
  const [filteredVendors, setFilteredVendors] = useState(
    localStorage.getItem("vendorFilter") === ""
      ? ""
      : localStorage.getItem("vendorFilter") || ""
  );
  const [filteredAircrafts, setFilteredAircrafts] = useState(
    localStorage.getItem("aircraftFilter") === ""
      ? ""
      : localStorage.getItem("aircraftFilter") || ""
  );
  const [filteredSystems, setFilteredSystems] = useState(
    localStorage.getItem("systemFilter") === ""
      ? ""
      : localStorage.getItem("systemFilter") || ""
  );
  const [filteredPresetTypes, setFilteredPresetTypes] = useState(
    localStorage.getItem("presetTypeFilter") === ""
      ? ""
      : localStorage.getItem("presetTypeFilter") || ""
  );
  const [filteredCodeTypes, setFilteredCodeTypes] = useState(
    localStorage.getItem("codeTypeFilter") === ""
      ? ""
      : localStorage.getItem("codeTypeFilter") || ""
  );
  const [label, setLabel] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [addVendor, setAddVendor] = useState(false);
  const [addAircraft, setAddAircraft] = useState(false);
  const [addSystem, setAddSystem] = useState(false);
  const [addPresetType, setAddPresetType] = useState(false);
  const [addCodeType, setAddCodeType] = useState(false);
  const [buttonSubmit, setButtonSubmit] = useState(false);
  const [bulkUpload, setBulkUpload] = useState(false);
  const [presetToast, setPresetToast] = useState(false);
  const [presetToastError, setPresetToastError] = useState(false);

  const filteredVendorList = presets.filter((preset: any) =>
    preset.vendor.toLowerCase().includes(filteredVendors.toLowerCase())
  );
  const filteredAircraftList = filteredVendorList.filter((preset: any) => {
    if (filteredAircrafts.length == 0) {
      return preset.aircraft.toLowerCase("");
    } else {
      return preset.aircraft.toLowerCase() === filteredAircrafts.toLowerCase();
    }
  });
  const filteredSystemList = filteredAircraftList.filter((preset: any) => {
    if (filteredSystems.length == 0) {
      return preset.system.toLowerCase("");
    } else {
      return preset.system.toLowerCase() === filteredSystems.toLowerCase();
    }
  });
  const filteredInputTypeList = filteredSystemList.filter((preset: any) => {
    if (preset.presetType) {
      if (filteredPresetTypes.length == 0) {
        return preset.presetType.toLowerCase("");
      } else {
        return (
          preset.presetType.toLowerCase() === filteredPresetTypes.toLowerCase()
        );
      }
    } else {
      return preset;
    }
  });

  const filteredItemsLabel = filteredInputTypeList.filter((preset: any) => {
    if (preset.description) {
      return preset.label.toLowerCase().includes(label.toLowerCase());
    } else {
      return preset.label.toLowerCase().includes(label.toLowerCase());
    }
  });

  const filteredItemsCode = filteredItemsLabel.filter((preset: any) => {
    if (preset.description) {
      return preset.code.toLowerCase().includes(code.toLowerCase());
    } else {
      return preset.code.toLowerCase().includes(code.toLowerCase());
    }
  });

  const filteredItems = filteredItemsCode.filter((preset: any) => {
    if (preset.description) {
      return preset.description
        .toLowerCase()
        .includes(description.toLowerCase());
    } else {
      return preset.code.toLowerCase().includes(code.toLowerCase());
    }
  });

  const uniqueVendor = Array.from(
    new Set(
      filteredInputTypeList
        .map((item: any) => item.vendor)
        .sort((a: any, b: any) =>
          a.toLowerCase().localeCompare(b.toLowerCase())
        )
    )
  );
  const uniqueAircraft = Array.from(
    new Set(
      filteredInputTypeList
        .map((item: any) => item.aircraft)
        .sort((a: any, b: any) =>
          a.toLowerCase().localeCompare(b.toLowerCase())
        )
    )
  );
  const uniqueSystem = Array.from(
    new Set(
      filteredInputTypeList
        .map((item: any) => item.system)
        .sort((a: any, b: any) =>
          a.toLowerCase().localeCompare(b.toLowerCase())
        )
    )
  );
  const uniqueType = Array.from(
    new Set(
      filteredInputTypeList
        .map((item: any) => item.presetType)
        .sort((a: any, b: any) =>
          a.toLowerCase().localeCompare(b.toLowerCase())
        )
    )
  );

  const {
    register,
    handleSubmit,
    watch,
    resetField,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const subscription = watch((value) => {
      setFilteredVendors(value.vendors);
      setFilteredAircrafts(value.aircrafts);
      setFilteredSystems(value.systems);
      setFilteredPresetTypes(value.presetTypes);
      setFilteredCodeTypes(value.codeTypes);
      setCode(value.code);
      setLabel(value.label);
      setDescription(value.description);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  function presetAdded() {
    setPresetToast(true);
    setTimeout(() => {
      setPresetToast(false);
    }, 5000);
  }
  function presetAddedError() {
    setPresetToastError(true);
    setTimeout(() => {
      setPresetToastError(false);
    }, 5000);
  }

  return (
    <Modal
      position={"fixed"}
      title="Add Preset"
      closeModalX={setAddModalOpen}
      closeModal={() => {}}
    >
      <div className="w-[70vw]">
        <form
          onSubmit={handleSubmit(async (data) => {
            setButtonSubmit(true);
            const url =
              process.env.NEXT_PUBLIC_HUBHOP_API_BASEURL +
              "/" +
              localStorage.getItem("simType") +
              "/presets";

            // post body data
            const preset =
              localStorage.getItem("simType") === "msfs2020"
                ? {
                    path:
                      (data.vendors == "" ? data.addVendors : data.vendors) +
                      "." +
                      (data.aircrafts == ""
                        ? data.addAircrafts
                        : data.aircrafts) +
                      "." +
                      (data.systems == "" ? data.addSystems : data.systems) +
                      "." +
                      (data.presetTypes == ""
                        ? data.addPresetTypes
                        : data.presetTypes) +
                      "." +
                      data.label,
                    vendor: data.vendors == "" ? data.addVendors : data.vendors,
                    aircraft:
                      data.aircrafts == "" ? data.addAircrafts : data.aircrafts,
                    system: data.systems == "" ? data.addSystems : data.systems,
                    code: data.code,
                    label: data.label,
                    presetType:
                      data.presetTypes == ""
                        ? data.addPresetTypes
                        : data.presetTypes,
                    status: "Submitted",
                    createdDate: new Date().toUTCString(),
                    author: localStorage.getItem("username"),
                    description: data.description,
                  }
                : {
                    vendor: data.vendors == "" ? data.addVendors : data.vendors,
                    aircraft:
                      data.aircrafts == "" ? data.addAircrafts : data.aircrafts,
                    system: data.systems == "" ? data.addSystems : data.systems,
                    code: data.code,
                    label: data.label,
                    presetType:
                      data.presetTypes == ""
                        ? data.addPresetTypes
                        : data.presetTypes,
                    codeType: data.codeTypes,
                    status: "Submitted",
                    createdDate: new Date().toUTCString(),
                    author: localStorage.getItem("username"),
                    description: data.description,
                  };

            // request options
            const options: any = {
              method: "POST",
              body: JSON.stringify(preset),
              redirect: "follow",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("accessToken"),
              },
            };

            // send POST request
            fetch(url, options).then((res) => {
              if (res.status != 200) {
                presetAddedError();
              }

              resetField("label", { defaultValue: "" });
              resetField("code", { defaultValue: "" });
              resetField("description", { defaultValue: "" });
              setButtonSubmit(false);
              presetAdded();
            });
          })}
        >
          <div
            className={`flex w-full flex-col space-y-3 self-start rounded-lg p-3 transition-all`}
          >
            <div className={`flex space-x-5 text-sm`}>
              <div className="flex w-2/6 flex-col space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-full">
                    <div className="flex items-center space-x-1">
                      <MdBusiness />
                      <label htmlFor="searchfield">
                        {addVendor ? "Name" : "Select"} Vendor
                      </label>
                    </div>
                    <div className="flex space-x-2">
                      {addVendor ? (
                        <input
                          placeholder="Provide a vendor name"
                          type="text"
                          className={`w-full rounded-lg border bg-hhBG/75 px-3 py-1 text-hhText ${
                            errors.addVendors
                              ? "border-red-500"
                              : "border-hhOrange/75"
                          }`}
                          onInput={(e) => {
                            e.currentTarget.value =
                              e.currentTarget.value.replace(
                                /[^a-zA-Z\s0-9\-/]/g,
                                ""
                              );
                          }}
                          {...register("addVendors", {
                            required: "Provide a vendor name",
                          })}
                        />
                      ) : (
                        <select
                          className={`w-full rounded-lg border bg-hhBG/75 px-3 py-1 text-hhText ${
                            errors.vendors
                              ? "border-red-500"
                              : "border-hhOrange/75"
                          }`}
                          value={filteredVendors}
                          {...register("vendors", {
                            required: "Select Vendor",
                          })}
                        >
                          <option value="">All Vendors</option>
                          {Array.from(
                            new Set(
                              presets
                                .map((item: any) => item.vendor)
                                .sort((a: any, b: any) =>
                                  a.toLowerCase().localeCompare(b.toLowerCase())
                                )
                            )
                          ).map((o, i) => (
                            <option key={i as any}>{o as String[]}</option>
                          ))}
                        </select>
                      )}
                      <button
                        onClick={() => (
                          setAddVendor((prev) => !prev),
                          resetField("addVendors", { defaultValue: "" }),
                          resetField("vendors", { defaultValue: "" })
                        )}
                        type={"button"}
                        className="rounded-lg bg-hhOrange p-2 text-hhBG transition-all hover:bg-hhOrangeShade-600"
                      >
                        {addVendor ? <BsList /> : <BiAddToQueue />}
                      </button>
                    </div>
                    <p className="font-semibold text-red-500">
                      {addVendor
                        ? errors.addVendors?.message
                        : errors.vendors?.message}
                    </p>
                  </div>
                </div>
                <div className="w-full">
                  <div className="flex items-center space-x-1">
                    <GiCommercialAirplane />
                    <label htmlFor="searchfield">
                      {addAircraft ? "Name" : "Search"} Aircraft
                    </label>
                  </div>
                  <div className="flex space-x-2">
                    {addAircraft ? (
                      <input
                        placeholder="Provide an aircraft name"
                        className={`w-full rounded-lg border bg-hhBG/75 px-3 py-1 text-hhText ${
                          errors.addAircrafts
                            ? "border-red-500"
                            : "border-hhOrange/75"
                        }`}
                        onInput={(e) => {
                          e.currentTarget.value = e.currentTarget.value.replace(
                            /[^a-zA-Z\s0-9\-/]/g,
                            ""
                          );
                        }}
                        {...register("addAircrafts", {
                          required: "Provide an aircraft name",
                        })}
                      />
                    ) : (
                      <select
                        className={`w-full rounded-lg border bg-hhBG/75 px-3 py-1 text-hhText ${
                          errors.aircrafts
                            ? "border-red-500"
                            : "border-hhOrange/75"
                        }`}
                        value={filteredAircrafts}
                        {...register("aircrafts", {
                          required: "Select Aircraft",
                        })}
                      >
                        <option value="">All Aircraft</option>
                        {Array.from(
                          new Set(
                            presets
                              .map((item: any) => item.aircraft)
                              .sort((a: any, b: any) =>
                                a.toLowerCase().localeCompare(b.toLowerCase())
                              )
                          )
                        ).map((o, i) => (
                          <option key={i as any}>{o as String[]}</option>
                        ))}
                        {/* {uniqueAircraft.map((o, i) => (
                          <option key={i as any}>{o as String[]}</option>
                        ))} */}
                      </select>
                    )}
                    <button
                      onClick={() => (
                        setAddAircraft((prev) => !prev),
                        resetField("addAicrafts", { defaultValue: "" }),
                        resetField("aircrafts", { defaultValue: "" })
                      )}
                      type={"button"}
                      className="rounded-lg bg-hhOrange p-2 text-hhBG transition-all hover:bg-hhOrangeShade-600"
                    >
                      {addAircraft ? <BsList /> : <BiAddToQueue />}
                    </button>
                  </div>
                  <p className="font-semibold text-red-500">
                    {addAircraft
                      ? errors.addAircrafts?.message
                      : errors.aircrafts?.message}
                  </p>
                </div>
                <div className="w-full">
                  <div className="flex items-center space-x-1">
                    <BiCog />
                    <label htmlFor="searchfield">
                      {addSystem ? "Name" : "Select"} System
                    </label>
                  </div>
                  <div className="flex space-x-2">
                    {addSystem ? (
                      <input
                        placeholder="Provide a system name"
                        className={`w-full rounded-lg border bg-hhBG/75 px-3 py-1 text-hhText ${
                          errors.addSystems
                            ? "border-red-500"
                            : "border-hhOrange/75"
                        }`}
                        {...register("addSystems", {
                          required: "Provide a system name",
                        })}
                      />
                    ) : (
                      <select
                        className={`w-full rounded-lg border bg-hhBG/75 px-3 py-1 text-hhText ${
                          errors.systems
                            ? "border-red-500"
                            : "border-hhOrange/75"
                        }`}
                        value={filteredSystems}
                        {...register("systems", { required: "Select System" })}
                      >
                        <option value="">All Systems</option>
                        {Array.from(
                          new Set(
                            presets
                              .map((item: any) => item.system)
                              .sort((a: any, b: any) =>
                                a.toLowerCase().localeCompare(b.toLowerCase())
                              )
                          )
                        ).map((o, i) => (
                          <option key={i as any}>{o as String[]}</option>
                        ))}
                        {/* {uniqueSystem.map((o, i) => (
                          <option key={i as any}>{o as String[]}</option>
                        ))} */}
                      </select>
                    )}
                    <AuthenticatedTemplate>
                      {localStorage.getItem("roles")?.includes("moderator") && (
                        <button
                          onClick={() => (
                            setAddSystem((prev) => !prev),
                            resetField("addSystems", { defaultValue: "" }),
                            resetField("systems", { defaultValue: "" })
                          )}
                          type={"button"}
                          className="rounded-lg bg-hhOrange p-2 text-hhBG transition-all hover:bg-hhOrangeShade-600"
                        >
                          {addSystem ? <BsList /> : <BiAddToQueue />}
                        </button>
                      )}
                    </AuthenticatedTemplate>
                  </div>
                  <p className="font-semibold text-red-500">
                    {addSystem
                      ? errors.addSystems?.message
                      : errors.systems?.message}
                  </p>
                </div>
                <div className="w-full">
                  <div className="flex items-center space-x-1">
                    <div className="flex space-x-1">
                      <BiJoystickButton />
                      <HiOutlineLightBulb />
                    </div>
                    <label htmlFor="searchfield">
                      {addPresetType ? "Name" : "Select"} Input/Output
                    </label>
                  </div>
                  <div className="flex space-x-2">
                    {addPresetType ? (
                      <input
                        type={"text"}
                        placeholder={"Provide action type"}
                        className={`w-full rounded-lg border bg-hhBG/75 px-3 py-1 text-hhText ${
                          errors.addPresetTypes
                            ? "border-red-500"
                            : "border-hhOrange/75"
                        }`}
                        {...register("addPresetTypes", {
                          required: "Provide action type",
                        })}
                      />
                    ) : (
                      <select
                        className={`w-full rounded-lg border bg-hhBG/75 px-3 py-1 text-hhText ${
                          errors.addPresetTypes
                            ? "border-red-500"
                            : "border-hhOrange/75"
                        }`}
                        value={filteredPresetTypes}
                        {...register("presetTypes", {
                          required: "Select preset type",
                        })}
                      >
                        <option value="">All Inputs/Outputs</option>
                        {Array.from(
                          new Set(
                            presets
                              .map((item: any) => item.presetType)
                              .sort((a: any, b: any) =>
                                a.toLowerCase().localeCompare(b.toLowerCase())
                              )
                          )
                        ).map((o, i) => (
                          <option key={i as any}>{o as String[]}</option>
                        ))}
                      </select>
                    )}
                    <AuthenticatedTemplate>
                      {localStorage.getItem("roles")?.includes("moderator") && (
                        <button
                          onClick={() => (
                            setAddPresetType((prev) => !prev),
                            resetField("addPresetTypes", { defaultValue: "" }),
                            resetField("presetTypes", { defaultValue: "" })
                          )}
                          type={"button"}
                          className="rounded-lg bg-hhOrange p-2 text-hhBG transition-all hover:bg-hhOrangeShade-600"
                        >
                          {addPresetType ? <BsList /> : <BiAddToQueue />}
                        </button>
                      )}
                    </AuthenticatedTemplate>
                  </div>
                  {localStorage.getItem("simType") === "xplane" && (
                    <div>
                      <div className="mt-3 flex items-center space-x-1">
                        <div className="flex space-x-1">
                          <RiListSettingsLine />
                        </div>
                        <label htmlFor="searchfield">Select Code Type</label>
                      </div>
                      <div className="flex space-x-2">
                        {addCodeType ? (
                          <input
                            type={"text"}
                            placeholder={"Provide code type"}
                            className={`w-full rounded-lg border bg-hhBG/75 px-3 py-1 text-hhText ${
                              errors.addCodeTypes
                                ? "border-red-500"
                                : "border-hhOrange/75"
                            }`}
                            {...register("addCodeTypes", {
                              required: "Provide code type",
                            })}
                          />
                        ) : (
                          <select
                            className={`w-full rounded-lg border bg-hhBG/75 px-3 py-1 text-hhText ${
                              errors.addCodeTypes
                                ? "border-red-500"
                                : "border-hhOrange/75"
                            }`}
                            value={filteredCodeTypes}
                            {...register("codeTypes", {
                              required: "Select code type",
                            })}
                          >
                            <option value="">All Code Types</option>
                            {Array.from(
                              new Set(
                                presets
                                  .map((item: any) => item.codeType)
                                  .sort((a: any, b: any) =>
                                    a
                                      .toLowerCase()
                                      .localeCompare(b.toLowerCase())
                                  )
                              )
                            ).map((o, i) => (
                              <option key={i as any}>{o as String[]}</option>
                            ))}
                          </select>
                        )}
                        <AuthenticatedTemplate>
                          {localStorage
                            .getItem("roles")
                            ?.includes("moderator") && (
                            <button
                              onClick={() => (
                                setAddPresetType((prev) => !prev),
                                resetField("addPresetTypes", {
                                  defaultValue: "",
                                }),
                                resetField("presetTypes", { defaultValue: "" })
                              )}
                              type={"button"}
                              className="rounded-lg bg-hhOrange p-2 text-hhBG transition-all hover:bg-hhOrangeShade-600"
                            >
                              {addPresetType ? <BsList /> : <BiAddToQueue />}
                            </button>
                          )}
                        </AuthenticatedTemplate>
                      </div>
                    </div>
                  )}
                  <p className="font-semibold text-red-500">
                    {addPresetType
                      ? errors.addPresetTypes?.message
                      : errors.presetTypes?.message}
                  </p>
                </div>
              </div>
              <div className="flex w-3/6 flex-col space-y-3">
                <div>
                  <div className="flex items-center space-x-1">
                    <BiRename />
                    <label htmlFor="searchfield">Name</label>
                  </div>
                  <input
                    className={`w-full rounded-lg border bg-hhBG/75 px-3 py-1 text-hhText ${
                      errors.label ? "border-red-500" : "border-hhOrange/75"
                    }`}
                    placeholder="Alternator 1 On"
                    onInput={(e) => {
                      e.currentTarget.value = e.currentTarget.value
                        .replace(/[^a-zA-Z0-9\s/]/g, "")
                        .replace(/^\s+|\s+$/g, "");
                    }}
                    {...register("label", { required: "Name required" })}
                  />
                  <p className="font-semibold text-red-500">
                    {errors.label?.message}
                  </p>
                </div>
                <div>
                  <div className="flex items-center space-x-1">
                    <HiOutlineSearchCircle />
                    <label htmlFor="searchfield">Code</label>
                  </div>
                  <textarea
                    className={`w-full rounded-lg border bg-hhBG/75 px-3 py-1 text-hhText ${
                      errors.code ? "border-red-500" : "border-hhOrange/75"
                    }`}
                    onInput={(e) => {
                      e.currentTarget.value = e.currentTarget.value.replace(
                        /[^a-zA-Z0-9\s()+\-*/:<>]/g,
                        ""
                      );
                    }}
                    cols={100}
                    rows={5}
                    placeholder={"(>L:somecode) (>K:somecodeToo) * near"}
                    {...register("code", { required: "Code required" })}
                  />
                  <p className="font-semibold text-red-500">
                    {errors.code?.message}
                  </p>
                </div>
                <div>
                  <div className="flex items-center space-x-1">
                    <BsCardText />
                    <label htmlFor="searchfield">Description</label>
                  </div>
                  <textarea
                    className="w-full rounded-lg border border-hhOrange/75 bg-hhBG/75 px-3 py-1 text-hhText"
                    cols={100}
                    rows={5}
                    placeholder={"This is your space for a nice description"}
                    {...register("description")}
                  />
                </div>
              </div>
              <div className="flex w-1/6 flex-col">
                <div className="flex items-center space-x-1">
                  <FiRepeat />
                  <label htmlFor="searchfield">Similar Presets</label>
                </div>
                <div
                  className={`flex w-full flex-col space-y-1 rounded-lg border border-hhOrange/75 bg-hhBG/75 px-3 py-1 text-hhText`}
                >
                  <p>{filteredItems.length} presets found.</p>
                  {filteredItems.length === 0 ? (
                    <div>No matches</div>
                  ) : filteredItems.length <= 10 ? (
                    filteredItems.map((preset: any) => (
                      <Link
                        legacyBehavior
                        href={{
                          pathname: `/preset`,
                          query: { id: preset.id },
                        }}
                        key={preset.id}
                      >
                        <a
                          target={"_blank"}
                          className="flex items-center justify-between space-x-1 rounded-lg bg-hhCard/75 px-3 py-0.5 transition-all hover:bg-hhOrange hover:text-hhBG"
                        >
                          <p className="w-11/12 truncate hover:text-clip">
                            {preset.label}
                          </p>
                          <FiExternalLink />
                        </a>
                      </Link>
                    ))
                  ) : (
                    <p>Maximum 10 will be displayed here.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-5 flex justify-between px-3">
            <button type={"button"} onClick={() => setAddModalOpen(false)}>
              <ButtonDark>
                <p>Close</p>
              </ButtonDark>
            </button>
            <div className="flex space-x-3">
              <button onClick={() => setBulkUpload(true)} type={"button"}>
                <ButtonOrange>
                  <p>Bulk upload</p>
                </ButtonOrange>
              </button>
              <button disabled={buttonSubmit} type="submit">
                <ButtonOrange>
                  {buttonSubmit && (
                    <div className="mr-2 animate-spin text-hhCard">
                      <AiOutlineLoading />
                    </div>
                  )}
                  <p className={buttonSubmit ? "text-hhCard" : "text-hhBG"}>
                    Add preset
                  </p>
                </ButtonOrange>
              </button>
            </div>
          </div>
        </form>
      </div>
      {bulkUpload && (
        <Modal
          title={"Bulk Upload"}
          closeModal={() => setBulkUpload(false)}
          position={"fixed"}
        >
          <p className="max-w-lg">
            If you want to upload many presets at once, you can download or open
            the import-file and post it on the{" "}
            <a
              className="rounded bg-hhOrange px-2 font-semibold text-hhBG transition-all hover:bg-hhOrangeShade-600"
              href="https://discord.gg/weZwE4sD"
              target={"_blank"}
            >
              Discord
            </a>{" "}
            bulk-upload channel.
          </p>
          <div className="mt-2 flex flex-col items-start space-y-2">
            <Link
              legacyBehavior
              href={"../../../../../../import_events_yourName.xlsx"}
            >
              <a>
                <ButtonOrange>
                  Download import-file (MS Excel Required)
                </ButtonOrange>
              </a>
            </Link>
            <Link
              legacyBehavior
              href={
                "https://docs.google.com/spreadsheets/d/1HHDvuA1rgdLZvdy0MTXB3QNIxba4iZZUcit8TQysD_k/edit#gid=664333323"
              }
            >
              <a target={"_blank"}>
                <ButtonOrange>
                  Open import-file (Google-Account required)
                </ButtonOrange>
              </a>
            </Link>
          </div>
        </Modal>
      )}
      <AnimatePresence>
        {presetToast && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Toast bg={"rgb(22 101 52 / var(--tw-bg-opacity))"} textColor={""}>
              <div className="mr-1 bg-green-800 text-xl">
                <BsCheck2Square />
              </div>
              <p>Preset successfully added!</p>
            </Toast>
          </motion.div>
        )}
        {presetToastError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Toast bg={"rgb(127 29 29 / var(--tw-bg-opacity))"} textColor={""}>
              <div className="mr-1 bg-red-900 text-xl">
                <BsCheck2Square />
              </div>
              <p>Error - Preset not added!</p>
            </Toast>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
};

export default AddPresetsModal;
