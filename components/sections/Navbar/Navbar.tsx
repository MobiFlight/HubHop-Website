import NavbarLinks from "@/lib/Constants"
import Image, { type ImageLoaderProps } from "next/image"
import hhLogo from "@/public/images/logo-big.png"
import Link from "next/link"
import {
  IconBolt,
  IconPlane,
  IconHome,
  IconList,
  IconLogout,
  IconMenu2,
  IconTrendingUp,
  IconUserCircle,
} from "@tabler/icons-react"
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from "@azure/msal-react"
import type { IPublicClientApplication } from "@azure/msal-browser"
import { msalInstance, msalReady } from "@/services/msal"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { getUserSettings, getAccessToken } from "@/services/msalFunctions"

const icons: Record<string, typeof IconHome> = {
  Home: IconHome,
  Presets: IconList,
  Aircraft: IconPlane,
  Tools: IconBolt,
  Stats: IconTrendingUp,
}

const Navbar = () => {
  const { accounts } = useMsal()

  async function login() {
    await msalReady
    await msalInstance.handleRedirectPromise()
    const accounts = msalInstance.getAllAccounts()
    if (accounts.length === 0) {
      await msalInstance
        .loginPopup()
        .then(() => {
          getAccessToken().then(() => getUserSettings())
        })
        .catch((error) => {
          console.error(`error during authentication: ${error}`)
          localStorage.setItem("roles", "Guest")
          localStorage.setItem("setAccessToken", "")
          msalInstance.logoutRedirect({}).catch((error) => {
            console.error(error)
          })
        })
    }
  }

  function logout(instance: IPublicClientApplication) {
    const logoutRequest = {
      account: instance.getAccount({
        homeAccountId: accounts[0].homeAccountId,
      }),
      postLogoutRedirectUri: "/",
    }
    localStorage.clear()
    instance.logoutRedirect(logoutRequest)
  }

  if (accounts.length) {
    localStorage.setItem("username", accounts[0].name || "")
  }

  const customLoader = ({ src }: ImageLoaderProps) => {
    return src
  }

  const navLinks = NavbarLinks.map((link) => {
    const Icon = icons[link.title]
    return (
      <Link
        key={link.href}
        href={link.href}
        className="flex items-center gap-1 transition-colors hover:text-primary"
      >
        <Icon className="size-5" />
        {link.title}
      </Link>
    )
  })

  const user = accounts[0]

  return (
    <header className="container mx-auto">
      <nav className="mt-2 flex items-center justify-between gap-4 px-3 text-xl md:mt-0 md:p-2">
        <Link href="/" className="flex max-w-32 p-1">
          <Image
            alt="HubHop"
            loader={customLoader}
            priority
            src={hhLogo}
            unoptimized
          />
        </Link>
        <div className="hidden w-full justify-center gap-10 xl:flex">
          {navLinks}
        </div>
        <div className="hidden whitespace-nowrap xl:flex">
          <AuthenticatedTemplate>
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-xl">
                    <IconUserCircle className="size-5" />
                    {user.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-auto">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>
                      <p>Hey, {user.name}</p>
                      <p className="text-xs font-normal text-muted-foreground">
                        {user.username}
                      </p>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => logout(msalInstance)}>
                    <IconLogout />
                    Log-out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </AuthenticatedTemplate>
          <UnauthenticatedTemplate>
            <Button variant="ghost" className="text-xl" onClick={login}>
              <IconUserCircle className="size-5" />
              Log-in
            </Button>
          </UnauthenticatedTemplate>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon-lg"
              className="xl:hidden"
              aria-label="Open menu"
            >
              <IconMenu2 className="size-8" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 text-xl">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-5 px-4">{navLinks}</div>
            <SheetFooter>
              <AuthenticatedTemplate>
                {user && (
                  <>
                    <p>Hey, {user.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {user.username}
                    </p>
                    <Button onClick={() => logout(msalInstance)}>
                      <IconLogout />
                      Log-out
                    </Button>
                  </>
                )}
              </AuthenticatedTemplate>
              <UnauthenticatedTemplate>
                <Button onClick={login}>
                  <IconUserCircle />
                  Log-in
                </Button>
              </UnauthenticatedTemplate>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  )
}

export default Navbar
