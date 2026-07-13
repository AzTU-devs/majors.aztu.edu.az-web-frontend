import { Link, useLocation } from "react-router";
import SchoolIcon from "@mui/icons-material/School";
import HomeFilledIcon from "@mui/icons-material/HomeFilled";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ApartmentIcon from "@mui/icons-material/Apartment";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

import { ChevronDownIcon, HorizontaLDots, UserCircleIcon } from "../icons";
import { useSidebar } from "../context/SidebarContext";

// Role values: 1 = admin/dev, 2 = kafedra müdiri (department head).
const ADMIN_ONLY = [1];

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  // When set, only these roles may see the item. Undefined = visible to all.
  roles?: number[];
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const sistemItems: NavItem[] = [
  { icon: <HomeFilledIcon />, name: "Ana Səhifə", path: "/" },
  { icon: <UserCircleIcon />, name: "Profil", path: "/profile" },
  { icon: <PeopleAltIcon />, name: "İstifadəçilər", path: "/users", roles: ADMIN_ONLY },
  { icon: <AdminPanelSettingsIcon />, name: "Adminlər", path: "/admins", roles: ADMIN_ONLY },
];

const akademikItems: NavItem[] = [
  { icon: <AccountBalanceIcon />, name: "Fakültələr", path: "/faculties", roles: ADMIN_ONLY },
  { icon: <ApartmentIcon />, name: "Kafedralar", path: "/cafedras", roles: ADMIN_ONLY },
  { icon: <SchoolIcon />, name: "İxtisaslar", path: "/specialties" },
  { icon: <LibraryBooksIcon />, name: "Ümumi Fənlər", path: "/general-subjects" },
  { icon: <MenuBookIcon />, name: "Ədəbiyyat", path: "/literatures", roles: ADMIN_ONLY },
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

  // Filter menu items by the signed-in user's role.
  const canSee = useCallback(
    (item: NavItem) => !item.roles || (auth.role != null && item.roles.includes(auth.role)),
    [auth.role]
  );
  const visibleSistemItems = useMemo(
    () => sistemItems.filter(canSee),
    [canSee]
  );
  const visibleAkademikItems = useMemo(
    () => akademikItems.filter(canSee),
    [canSee]
  );

  const isActive = useCallback((path: string) => location.pathname === path, [location.pathname]);

  useEffect(() => {
    let submenuMatched = false;
    (["sistem", "akademik"] as const).forEach((menuType) => {
      const items = menuType === "sistem" ? visibleSistemItems : visibleAkademikItems;
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
  }, [location, isActive, visibleSistemItems, visibleAkademikItems]);

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
      className={`fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-gray-200/70 bg-white/85 px-5 text-gray-900 backdrop-blur-xl transition-all duration-300 ease-out dark:border-white/5 dark:bg-gray-900/80 lg:mt-0
        ${isExpanded || isMobileOpen ? "w-[290px]" : isHovered ? "w-[290px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo */}
      <div className={`flex py-6 ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
        <Link to="/" className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl brand-gradient text-sm font-bold text-white shadow-glow ring-1 ring-white/20">
            A
          </div>
          {showLabel && (
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight text-gray-900 dark:text-white">
                AZTU Majors
              </div>
              <div className="text-[11px] text-gray-500 dark:text-gray-400">
                İdarəetmə paneli
              </div>
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
            {renderMenuItems(visibleSistemItems, "sistem")}
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
            {renderMenuItems(visibleAkademikItems, "akademik")}
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
