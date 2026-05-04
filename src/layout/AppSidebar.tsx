import { Link, useLocation } from "react-router";
import SchoolIcon from "@mui/icons-material/School";
import HomeFilledIcon from "@mui/icons-material/HomeFilled";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

import { ChevronDownIcon, HorizontaLDots, UserCircleIcon } from "../icons";
import { useSidebar } from "../context/SidebarContext";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const sistemItems: NavItem[] = [
  { icon: <HomeFilledIcon />, name: "Ana Səhifə", path: "/" },
  { icon: <UserCircleIcon />, name: "Profil", path: "/profile" },
];

const akademikItems: NavItem[] = [
  { icon: <SchoolIcon />, name: "İxtisaslar", path: "/specialties" },
  { icon: <MenuBookIcon />, name: "Ədəbiyyat", path: "/literatures" },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const auth = useSelector((state: RootState) => state.auth);

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "sistem" | "akademik";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback((path: string) => location.pathname === path, [location.pathname]);

  useEffect(() => {
    let submenuMatched = false;
    (["sistem", "akademik"] as const).forEach((menuType) => {
      const items = menuType === "sistem" ? sistemItems : akademikItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({ type: menuType, index });
              submenuMatched = true;
            }
          });
        }
      });
    });
    if (!submenuMatched) setOpenSubmenu(null);
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prev) => ({
          ...prev,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "sistem" | "akademik") => {
    setOpenSubmenu((prev) => {
      if (prev && prev.type === menuType && prev.index === index) return null;
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (items: NavItem[], menuType: "sistem" | "akademik") => (
    <ul className="flex flex-col gap-1">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${!isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"}`}
            >
              <span
                className={`menu-item-icon-size ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto h-5 w-5 transition-transform duration-200 ${
                    openSubmenu?.type === menuType && openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"}`}
              >
                <span
                  className={`menu-item-icon-size ${
                    isActive(nav.path) ? "menu-item-icon-active" : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="ml-9 mt-2 space-y-1">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path) ? "menu-dropdown-item-active" : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.name}
                      <span className="ml-auto flex items-center gap-1">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path) ? "menu-dropdown-badge-active" : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path) ? "menu-dropdown-badge-active" : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  const showLabel = isExpanded || isHovered || isMobileOpen;

  return (
    <aside
      className={`fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-gray-200 bg-white px-5 text-gray-900 transition-all duration-300 ease-in-out dark:border-gray-800 dark:bg-gray-900 lg:mt-0
        ${isExpanded || isMobileOpen ? "w-[290px]" : isHovered ? "w-[290px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo */}
      <div className={`flex py-6 ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
        <Link to="/">
          {showLabel ? (
            <>
              <img className="dark:hidden" src="/aztu-logo-dark.webp" alt="AzTU" height={40} style={{ maxHeight: 40 }} />
              <img className="hidden dark:block" src="/aztu-logo-light.png" alt="AzTU" height={40} style={{ maxHeight: 40 }} />
            </>
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 text-sm font-bold text-white">
              A
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <div className="no-scrollbar flex flex-1 flex-col overflow-y-auto">
        <nav className="flex flex-col gap-6">
          {/* Sistem group */}
          <div>
            <h2
              className={`mb-3 flex text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-600 ${
                !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
              }`}
            >
              {showLabel ? "Sistem" : <HorizontaLDots className="size-5" />}
            </h2>
            {renderMenuItems(sistemItems, "sistem")}
          </div>

          {/* Akademik group */}
          <div>
            <h2
              className={`mb-3 flex text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-600 ${
                !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
              }`}
            >
              {showLabel ? "Akademik" : <HorizontaLDots className="size-5" />}
            </h2>
            {renderMenuItems(akademikItems, "akademik")}
          </div>
        </nav>

        {/* User strip at bottom */}
        <div className="mt-auto border-t border-gray-200 pt-4 pb-4 dark:border-gray-800">
          <div
            className={`flex items-center gap-3 rounded-lg px-2 py-2 ${
              !isExpanded && !isHovered ? "lg:justify-center" : ""
            }`}
          >
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700 dark:bg-brand-500/20 dark:text-brand-300">
              {auth.name ? auth.name.charAt(0).toUpperCase() : "?"}
            </div>
            {showLabel && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-800 dark:text-white/90">
                  {auth.name} {auth.surname}
                </p>
                <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                  {auth.role === 2 ? "Kafedra müdiri" : "Admin"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
