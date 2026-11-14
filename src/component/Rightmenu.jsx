import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { LuLogOut, LuChevronDown } from "react-icons/lu";
import Logo from "./Logo";
import { getStoredUser, clearUser } from "./Login";
import { useToast } from "./ToastContext";
import { MENU_ITEMS } from "../utils/menu";
import { can, normalizeRole } from "../utils/permissions";

// فیلتر آیتم‌ها بر اساس دسترسی؛ اگر همه‌ی زیرمنوها مخفی شوند، خود آیتم هم حذف می‌شود
function filterByPerm(items, role) {
  return items
    .map((item) => {
      if (item.perm && !can(role, item.perm)) return null;
      if (!item.children) return item;
      const children = item.children.filter((c) => !c.perm || can(role, c.perm));
      return children.length ? { ...item, children } : null;
    })
    .filter(Boolean);
}

const Rightmenu = ({ open = false, onClose = () => {} }) => {
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const role = normalizeRole(getStoredUser()?.role);

  const visible = filterByPerm(MENU_ITEMS, role);
  const main = visible.filter((i) => !i.bottom);
  const bottom = visible.filter((i) => i.bottom);

  // کدام آیتم‌های دارای زیرمنو باز هستند
  const [expanded, setExpanded] = useState(() => new Set());

  // اگر مسیر فعلی داخل یک زیرمنو بود، والدش خودکار باز شود
  useEffect(() => {
    setExpanded((prev) => {
      const next = new Set(prev);
      visible.forEach((item) => {
        if (item.children?.some((c) => location.pathname.startsWith(c.path))) {
          next.add(item.key);
        }
      });
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const toggle = (key) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  const handleLogout = () => {
    clearUser();
    toast.info("از حساب خارج شدید");
    navigate("/login", { replace: true });
  };

  const renderItem = (item) => {
    const Icon = item.icon;
    const hasChildren = !!item.children;
    const isOpen = expanded.has(item.key);
    const isChildActive = hasChildren && item.children.some((c) => location.pathname === c.path);

    return (
      <div key={item.key} className="rightmenugroup">
        {hasChildren ? (
          <button
            type="button"
            className={`rightmenuitem ${isChildActive ? "rightmenuitemparent" : ""}`}
            onClick={() => toggle(item.key)}
            aria-expanded={isOpen}
          >
            <Icon className="rightmenuitemicon" />
            <span className="rightmenuitemlabel">{item.label}</span>
            <LuChevronDown className={`rightmenuchevron ${isOpen ? "rightmenuchevronopen" : ""}`} />
          </button>
        ) : (
          <NavLink
            to={item.path}
            end={item.end}
            onClick={onClose}
            className={({ isActive }) =>
              `rightmenuitem ${isActive ? "rightmenuitemactive" : ""}`
            }
          >
            <Icon className="rightmenuitemicon" />
            <span className="rightmenuitemlabel">{item.label}</span>
          </NavLink>
        )}

        {hasChildren && isOpen && (
          <div className="rightmenusub">
            {item.children.map((child) => (
              <NavLink
                key={child.key}
                to={child.path}
                end={child.end}
                onClick={onClose}
                className={({ isActive }) =>
                  `rightmenusubitem ${isActive ? "rightmenusubitemactive" : ""}`
                }
              >
                {child.icon && <child.icon className="rightmenusubicon" />}
                <span>{child.label}</span>
              </NavLink>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div
        className={`rightmenuoverlay ${open ? "rightmenuoverlayshow" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className={`rightmenu ${open ? "rightmenuopen" : ""}`}>
        <div className="rightmenubrand">
          <Logo size={42} />
          <h1 className="rightmenubrandtitle">ماردین</h1>
        </div>

        <nav className="rightmenunav" aria-label="منوی اصلی">
          {main.map(renderItem)}
          <div className="rightmenudivider" />
          {bottom.map(renderItem)}
        </nav>

        <div className="rightmenufooter">
          <button type="button" className="rightmenuitem" onClick={handleLogout}>
            <LuLogOut className="rightmenuitemicon" />
            <span className="rightmenuitemlabel">خروج از حساب</span>
          </button>
        </div>

        <svg className="rightmenudecor" viewBox="0 0 200 140" aria-hidden="true" preserveAspectRatio="xMaxYMax meet">
          <path d="M200 0C150 20 90 70 40 140H200Z" fill="var(--primary)" />
        </svg>
      </aside>
    </>
  );
};

export default Rightmenu;