import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LuSearch, LuBell, LuChevronDown, LuMenu, LuSun, LuMoon, LuSettings, LuLogOut,
} from "react-icons/lu";
import { getStoredUser, clearUser } from "./Login";
import { useTheme } from "./ThemeContext";
import { useToast } from "./ToastContext";
import { MENU_LEAVES } from "../utils/menu";
import { ROLE_LABELS, canAccess, normalizeRole } from "../utils/permissions";
import { initials, norm, tofa } from "../utils/format";
import { MOCK_INBOX } from "../services/mockData";

// بستن یک پنجره‌ی بازشو با کلیک بیرون یا Esc
function useDismiss(open, setOpen, ref) {
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => !ref.current?.contains(e.target) && setOpen(false);
    const onEsc = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open, setOpen, ref]);
}

const Topbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const { theme, toggleTheme } = useTheme();
  const user = getStoredUser();
  const role = normalizeRole(user?.role);

  const [query, setQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [inbox, setInbox] = useState(MOCK_INBOX); // اعلان‌های داخلی (فعلاً استاتیک)
  const profileRef = useRef(null);
  const bellRef = useRef(null);

  useDismiss(profileOpen, setProfileOpen, profileRef);
  useDismiss(bellOpen, setBellOpen, bellRef);

  const unread = inbox.filter((n) => n.unread).length;

  // جستجو در نام بخش‌ها و زیرمنوها: با Enter به اولین بخش مطابق می‌رود
  const onSearch = (e) => {
    e.preventDefault();
    const q = norm(query.trim());
    if (!q) return;
    const hit = MENU_LEAVES.find(
      (i) => (norm(i.label).includes(q) || norm(i.parent?.label || "").includes(q)) && canAccess(role, i.module),
    );
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
      <button type="button" className="topbarmenubtn" onClick={onMenuClick} aria-label="باز کردن منو">
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

        <div className="bellwrap" ref={bellRef}>
          <button
            type="button"
            className="iconbtn"
            onClick={() => setBellOpen((v) => !v)}
            aria-label={unread ? `اعلان‌ها (${unread} خوانده‌نشده)` : "اعلان‌ها"}
            aria-expanded={bellOpen}
          >
            <LuBell />
            {unread > 0 && <span className="belldot" />}
          </button>

          {bellOpen && (
            <div className="popover" role="dialog" aria-label="اعلان‌های داخلی">
              <header className="popoverhead">
                <strong>اعلان‌ها</strong>
                {unread > 0 && (
                  <button type="button" className="textlink" onClick={() => setInbox((l) => l.map((n) => ({ ...n, unread: false })))}>
                    همه را خوانده‌شده کن
                  </button>
                )}
              </header>
              <ul className="notifylist">
                {inbox.map((n) => (
                  <li key={n.id}>
                    <Link
                      to={n.to}
                      className={`notifyitem ${n.unread ? "notifyitem-unread" : ""}`}
                      onClick={() => setBellOpen(false)}
                    >
                      <strong>{n.title}</strong>
                      <span>{n.text}</span>
                      <em>{n.at}</em>
                    </Link>
                  </li>
                ))}
              </ul>
              {unread > 0 && <p className="popoverfoot">{tofa(unread)} اعلان خوانده‌نشده</p>}
            </div>
          )}
        </div>

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
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setProfileOpen(false);
                  navigate("/settings/profile");
                }}
              >
                <LuSettings /> پروفایل من
              </button>
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
