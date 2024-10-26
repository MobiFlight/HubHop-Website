import NavbarLinks from "../../../lib/Constants";
import Image from "next/image";
import hhLogo from "../../../public/images/logo-big.png";
import Link from "next/link";
import {
  HiOutlineHome,
  HiOutlineViewList,
  HiOutlineLightningBolt,
  HiOutlineTrendingUp,
  HiOutlineUserCircle,
} from "react-icons/hi";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AiOutlineMenu } from "react-icons/ai";
import { MdOutlineClose } from "react-icons/md";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from "@azure/msal-react";
import { msalInstance } from "../../../services/msal";
import UserDropdown from "../Shared/UserDropdown";
import ButtonOrange from "../Shared/ButtonOrange";
import {
  getUserSettings,
  getAccessToken,
} from "../../../services/msalFunctions";

const Navbar: React.FC = () => {
  if (
    typeof window !== "undefined" &&
    localStorage.getItem("searchFilter") === null
  ) {
    localStorage.setItem("searchFilter", "");
  }
  if (
    typeof window !== "undefined" &&
    localStorage.getItem("vendorFilter") === null
  ) {
    localStorage.setItem("vendorFilter", "");
  }
  if (
    typeof window !== "undefined" &&
    localStorage.getItem("aircraftFilter") === null
  ) {
    localStorage.setItem("aircraftFilter", "");
  }
  if (
    typeof window !== "undefined" &&
    localStorage.getItem("systemFilter") === null
  ) {
    localStorage.setItem("systemFilter", "");
  }
  if (
    typeof window !== "undefined" &&
    localStorage.getItem("presetTypeFilter") === null
  ) {
    localStorage.setItem("presetTypeFilter", "");
  }

  const [mobileMenu, setMobileMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  function openMobileMenu() {
    setMobileMenu((setMobileMenu) => !setMobileMenu);
  }

  const itemVariants = {
    closed: {
      transition: {
        duration: 0.2,
      },
      opacity: 0,
    },
    open: {
      transition: {
        duration: 0.3,
      },
      opacity: 1,
    },
  };

  const sideVariants = {
    closed: {
      transition: {
        staggerChildren: 0.3,
        staggerDirection: -1,
      },
    },
    open: {
      transition: {
        staggerChildren: 0.3,
        staggerDirection: 1,
      },
    },
  };

  const { accounts } = useMsal();

  var timeout: any;

  const showTip = () => {
    timeout = setTimeout(() => {
      setShowDropdown(true);
    }, 400);
  };

  const hideTip = () => {
    clearInterval(timeout);
    setShowDropdown(false);
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

  function logout(instance: any) {
    const logoutRequest = {
      account: instance.getAccountByHomeId(accounts[0].homeAccountId),
      postLogoutRedirectUri: "/",
    };
    localStorage.clear();
    instance.logoutRedirect(logoutRequest);
  }

  if (accounts.length) {
    localStorage.setItem("username", accounts[0].name || "");
  }

  const customLoader = ({ src }: any) => {
    return src;
  };

  return (
    <div>
      <header className="container mx-auto">
        <nav className="container mx-auto flex items-center justify-between px-3 text-xl md:p-2">
          <AnimatePresence>
            {mobileMenu && (
              <motion.div
                className="fixed left-0 top-0 z-50 h-screen bg-black/50 backdrop-blur"
                onClick={openMobileMenu}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  width: "100%",
                  transition: {
                    duration: 0,
                    damping: 100,
                  },
                }}
                exit={{
                  width: 1,
                  transition: { duration: 0 },
                }}
              >
                <motion.div
                  className="relative left-0 top-0 z-50"
                  initial={{ width: 0 }}
                  animate={{
                    width: 300,
                  }}
                  exit={{
                    width: 1,
                    transition: { duration: 0.3 },
                  }}
                  onClick={openMobileMenu}
                >
                  <motion.div
                    className="h-screen bg-hhOrange text-hhBG"
                    initial="closed"
                    animate="open"
                    exit="closed"
                    variants={sideVariants}
                    onClick={openMobileMenu}
                  >
                    <motion.div
                      className="flex h-full flex-col items-center justify-between space-y-5 py-10"
                      variants={itemVariants}
                    >
                      <div className="flex flex-col items-center space-y-5">
                        {NavbarLinks.map((link) => (
                          <Link legacyBehavior key={link.href} href={link.href}>
                            <a className="flex items-center space-x-1 transition-all hover:text-hhOrange">
                              {link.title === "Home" ? (
                                <HiOutlineHome />
                              ) : link.title === "Presets" ? (
                                <HiOutlineViewList />
                              ) : link.title === "Tools" ? (
                                <HiOutlineLightningBolt />
                              ) : (
                                <HiOutlineTrendingUp />
                              )}
                              <div>{link.title}</div>
                            </a>
                          </Link>
                        ))}
                      </div>
                      <div className="flex items-center space-x-1 whitespace-nowrap text-xl">
                        <AuthenticatedTemplate>
                          {accounts.length && (
                            <div className="flex flex-col space-y-5 font-medium">
                              <div className="flex flex-col items-center space-y-1">
                                <p>Hey, {accounts[0].name}</p>
                                <p className="text-sm">
                                  {accounts[0].username}
                                </p>
                              </div>
                              <hr className="border-hhBG" />
                              <div
                                className="w-full text-center"
                                onClick={() => logout(msalInstance)}
                              >
                                <button>Log-out</button>
                              </div>
                            </div>
                          )}
                        </AuthenticatedTemplate>
                        <UnauthenticatedTemplate>
                          <button
                            className="flex items-center space-x-1"
                            onClick={() => login()}
                          >
                            <HiOutlineUserCircle /> <p>Log-in</p>
                          </button>
                        </UnauthenticatedTemplate>
                      </div>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="mt-2 flex w-full items-center justify-between md:mt-0">
            <Link legacyBehavior href={"/"}>
              <a className="flex max-w-[8rem] p-1">
                <Image
                  alt=""
                  loader={customLoader}
                  priority
                  src={hhLogo}
                  unoptimized
                />
              </a>
            </Link>
            <div className="hidden w-full justify-center space-x-10 xl:flex">
              {NavbarLinks.map((link) => (
                <Link legacyBehavior key={link.href} href={link.href}>
                  <a className="flex items-center space-x-1 transition-all hover:text-hhOrange">
                    {link.title === "Home" ? (
                      <HiOutlineHome />
                    ) : link.title === "Presets" ? (
                      <HiOutlineViewList />
                    ) : link.title === "Tools" ? (
                      <HiOutlineLightningBolt />
                    ) : (
                      <HiOutlineTrendingUp />
                    )}
                    <div>{link.title}</div>
                  </a>
                </Link>
              ))}
            </div>
            <div className="hidden items-center space-x-1 whitespace-nowrap text-xl xl:flex">
              <AuthenticatedTemplate>
                {accounts.length && (
                  <div
                    onMouseEnter={showTip}
                    onMouseLeave={hideTip}
                    className="flex items-start justify-end"
                  >
                    <button className="relative flex w-full items-center space-x-1">
                      <HiOutlineUserCircle />
                      <p>{accounts[0].name}</p>
                    </button>
                    <AnimatePresence>
                      {showDropdown && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.1 }}
                          className="flex cursor-pointer items-start justify-end"
                        >
                          <UserDropdown>
                            <div className="flex flex-col space-y-5">
                              <div className="flex flex-col items-center space-y-1">
                                <p>Hey, {accounts[0].name}</p>
                                <p className="text-sm">
                                  {accounts[0].username}
                                </p>
                              </div>
                              <hr />
                              <button onClick={() => logout(msalInstance)}>
                                <ButtonOrange>Log-out</ButtonOrange>
                              </button>
                            </div>
                          </UserDropdown>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </AuthenticatedTemplate>
              <UnauthenticatedTemplate>
                <button
                  className="flex items-center space-x-1"
                  onClick={() => login()}
                >
                  <HiOutlineUserCircle /> <p>Log-in</p>
                </button>
              </UnauthenticatedTemplate>
            </div>
            <button
              onClick={openMobileMenu}
              className="flex items-center justify-center text-4xl xl:hidden"
            >
              <div>{mobileMenu ? <MdOutlineClose /> : <AiOutlineMenu />}</div>
            </button>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default Navbar;
