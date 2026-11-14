import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LuSearch,
  LuBell,
  LuChevronDown,
  LuMenu,
  LuSun,
  LuMoon,
  LuSettings,
  LuLogOut,
} from "react-icons/lu";
import { getStoredUser, clearUser } from "./Login";
import { useTheme } from "./ThemeContext";
import { useToast } from "./ToastContext";
import { MENU_ITEMS } from "../utils/menu";
import { ROLE_LABELS, can, normalizeRole } from "../utils/permissions";
import { initials } from "../utils/format";

const Topbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const { theme, toggleTheme } = useTheme();
  const user = getStoredUser();
  const role = normalizeRole(user?.role);

  const [query, setQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // بستن منوی پروفایل با کلیک بیرون یا Esc
  useEffect(() => {
    if (!profileOpen) return;
    const onDown = (e) => {
      if (!profileRef.current?.contains(e.target)) setProfileOpen(false);
    };
    const onEsc = (e) => e.key === "Escape" && setProfileOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onEsc);
    };
  }, [profileOpen]);

  // جستجو در نام بخش‌ها و زیرمنوها: با Enter به اولین بخش مطابق می‌رود
  const onSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;

    const flat = MENU_ITEMS.flatMap((i) =>
      i.children?.length
        ? i.children.map((c) => ({ ...c, perm: c.perm || i.perm }))
        : [i],
    );
    const hit = flat.find((i) => i.label.includes(q) && (!i.perm || can(role, i.perm)));

    if (hit) {
      navigate(hit.path);
      setQuery("");
    } else {
      toast.info("بخشی با این نام پیدا نشد");
    }
  };

  const logout = () => {
    clearUser();
    toast.info("از حساب خارج شدید");
    navigate("/login", { replace: true });
  };

  return (
    <header className="topbar">
      <button
        type="button"
        className="topbarmenubtn"
        onClick={onMenuClick}
        aria-label="باز کردن منو"
      >
        <LuMenu />
      </button>

      <form className="topbarsearch" onSubmit={onSearch} role="search">
        <LuSearch className="topbarsearchicon" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="جستجو در بخش‌ها..."
          aria-label="جستجو در بخش‌ها"
        />
      </form>

      <div className="topbarend">
        <button
          type="button"
          className="iconbtn"
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "تم روشن" : "تم تیره"}
        >
          {theme === "dark" ? <LuSun /> : <LuMoon />}
        </button>

        <button type="button" className="iconbtn iconbtnbell" aria-label="اعلان‌ها">
          <LuBell />
          <span className="belldot" />
        </button>

        <span className="topbarsep" />

        <div className="profile" ref={profileRef}>
          <button
            type="button"
            className="profilebtn"
            onClick={() => setProfileOpen((v) => !v)}
            aria-expanded={profileOpen}
            aria-haspopup="menu"
          >
            <span className="avatar">{initials(user?.name) || "؟"}</span>
            <span className="profileinfo">
              <span className="profilename">{user?.name || "کاربر"}</span>
              <span className="profilerole">{ROLE_LABELS[role]}</span>
            </span>
            <LuChevronDown className="profilechevron" />
          </button>

          {profileOpen && (
            <div className="profilemenu" role="menu">
              {can(role, "write") && (
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setProfileOpen(false);
                    navigate("/settings");
                  }}
                >
                  <LuSettings /> تنظیمات
                </button>
              )}
              <button type="button" role="menuitem" onClick={logout}>
                <LuLogOut /> خروج از حساب
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;