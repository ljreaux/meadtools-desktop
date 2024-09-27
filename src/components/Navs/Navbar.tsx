import React, { Dispatch, SetStateAction } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/full-logo.png";
import logoOnly from "../../assets/logoOnly.png";

import { useTranslation } from "react-i18next";
import { ModeToggle } from "../ui/mode-toggle";
import LanguageSwitcher from "../ui/Language-switcher";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const mainCalcs = [
  {
    path: "/",
    label: "calculators.recipes",
  },
  {
    path: "/NuteCalc/",
    label: "calculators.nutes",
  },
];

const extraCalculatorLinks = [
  {
    path: "/ExtraCalcs/",
    label: "calculators.extraCalcs.abv",
  },
  {
    path: "/ExtraCalcs/brixCalc",
    label: "calculators.extraCalcs.brix",
  },
  {
    path: "/ExtraCalcs/estOG",
    label: "calculators.extraCalcs.estOG",
  },
  {
    path: "/ExtraCalcs/benchTrials",
    label: "calculators.extraCalcs.benchTrials",
  },
  {
    path: "/ExtraCalcs/stabilizers",
    label: "calculators.extraCalcs.stabilizers",
  },
  {
    path: "/ExtraCalcs/RefractometerCorrection",
    label: "calculators.extraCalcs.refractometer",
  },
  {
    path: "/ExtraCalcs/tempCorrection",
    label: "calculators.extraCalcs.tempCorrection",
  },
  {
    path: "/ExtraCalcs/blending",
    label: "calculators.extraCalcs.blending",
  },
];

const extraLinks = [
  {
    path: "/about",
    label: "additionalLinks.about",
  },
  {
    path: "/contact",
    label: "additionalLinks.contact",
  },
  {
    path: "/juice",
    label: "additionalLinks.juice",
  },
  {
    path: "/yeastTable",
    label: "yeasts",
  },
];

const yeastDashboard = [
  {
    path: "/yeasts",
    label: "desktop.allYeasts",
  },
  {
    path: "/yeasts/create",
    label: "desktop.addYeast",
  },
];
const ingredientDashboard = [
  {
    path: "/ingredients",
    label: "desktop.allIng",
  },
  {
    path: "/ingredients/create",
    label: "desktop.addIng",
  },
];

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="text-sm leading-snug line-clamp-2 text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default function Navbar({
  token,
  setToken,
  setUser,
}: {
  token: string | null;
  setToken: Dispatch<SetStateAction<string | null>>;
  setUser: Dispatch<
    SetStateAction<{ id: number; role: "user" | "admin"; email: string } | null>
  >;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <nav className="sm:h-20 h-28 fixed top-0 z-[51] flex items-center justify-between mb-[1rem] border-b-2 border-background">
      <div className="relative grid items-center justify-center w-screen h-full gap-2 text-xl text-center sm:justify-between sm:flex bg-background text-foreground">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="px-2">
                {t("calculators.label")}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid sm:gap-3 gap-2 sm:p-4 sm:min-w-[400px] min-w-[300px] lg:grid-cols-[1fr_1fr] text-start">
                  <li className="col-span-full">{t("calculators.main")}</li>
                  {mainCalcs.map((link) => {
                    return (
                      <ListItem
                        key={link.path}
                        title={t(link.label)}
                        href={link.path}
                      />
                    );
                  })}
                </ul>
                <ul className="grid sm:gap-3 gap-2 sm:p-4 p-2 sm:min-w-[400px] min-w-[300px] lg:grid-cols-[1fr_1fr] text-start">
                  <li className="col-span-full">
                    {t("calculators.extraCalcs.label")}
                  </li>
                  {extraCalculatorLinks.map((link) => {
                    return (
                      <ListItem
                        key={link.path}
                        title={t(link.label)}
                        href={link.path}
                      />
                    );
                  })}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="px-2">
                {t("account.label")}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="flex sm:min-w-[400px] min-w-[300px] p-4 items-center justify-center">
                  {token ? (
                    <>
                      <li>
                        <Link
                          className="p-3 space-y-1 leading-none no-underline transition-colors rounded-md outline-none select-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          to="/account"
                        >
                          {t("account.label")}
                        </Link>
                        <button
                          onClick={() => {
                            localStorage.removeItem("token");
                            setToken(null);
                            localStorage.removeItem("refreshToken");
                            localStorage.removeItem("user");
                            setUser(null);
                            navigate("/login");
                          }}
                          className="p-3 space-y-1 leading-none no-underline transition-colors rounded-md outline-none select-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          {t("account.logout")}
                        </button>
                      </li>
                    </>
                  ) : (
                    <li>
                      <NavLink
                        className="block p-3 space-y-1 leading-none no-underline transition-colors rounded-md outline-none select-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground "
                        to="/login"
                      >
                        {t("account.login")}
                      </NavLink>
                    </li>
                  )}
                  <li>
                    <NavLink
                      className="block p-3 space-y-1 leading-none no-underline transition-colors rounded-md outline-none select-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground "
                      to={"/localRecipes"}
                    >
                      {t("desktop.local")}
                    </NavLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="px-2">
                {t("additionalLinks.label")}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="flex gap-3 p-4 sm:min-w-[400px] min-w-[300px] justify-center">
                  {extraLinks.map((link) => {
                    return (
                      <ListItem
                        key={link.path}
                        title={t(link.label)}
                        href={link.path}
                      />
                    );
                  })}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>
                <Link to={"/yeasts/"}>{t("desktop.data")}</Link>
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid sm:gap-3 gap-2 sm:p-4 sm:min-w-[400px] min-w-[300px] lg:grid-cols-[1fr_1fr] text-start">
                  <li className="col-span-full">{t("desktop.yeasts")}</li>
                  {yeastDashboard.map((link) => {
                    return (
                      <ListItem
                        key={link.path}
                        title={t(link.label)}
                        href={link.path}
                      />
                    );
                  })}
                </ul>
                <ul className="grid sm:gap-3 gap-2 sm:p-4 sm:min-w-[400px] min-w-[300px] lg:grid-cols-[1fr_1fr] text-start">
                  <li className="col-span-full">{t("desktop.ing")}</li>
                  {ingredientDashboard.map((link) => {
                    return (
                      <ListItem
                        key={link.path}
                        title={t(link.label)}
                        href={link.path}
                      />
                    );
                  })}
                </ul>
                <div className="p-4">
                  <Link to={"/reset/"}>{t("desktop.reset")}</Link>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center justify-center h-full">
          <div className="flex gap-4 ml-4 mr-auto sm:mr-4">
            <ModeToggle />
            <LanguageSwitcher />
          </div>
          <Link
            className="bg-background w-[3rem] sm:flex sm:w-24 lg:w-52 h-full left-0 border-[1px] border-sidebar hover:opacity-80 transition-all"
            to="/"
          >
            <span className="flex flex-col items-center justify-center w-full h-full bg-secondary">
              <img src={logo} alt="MeadTools logo" className="hidden lg:flex" />
              <img
                src={logoOnly}
                alt="MeadTools logo"
                className="lg:hidden w-[50%]"
              />
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
