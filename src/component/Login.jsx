import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LuUser, LuLock, LuEye, LuEyeOff, LuLogIn } from "react-icons/lu";
import Logo from "./Logo";
import { useToast } from "./ToastContext";
import useAsyncAction from "../hooks/useAsyncAction";
import { api, apiErrorMessage, AUTH_KEY } from "../services/apiService";
import { logActivity } from "../services/actions";

/* ─────────── ذخیره‌ی نشست ─────────── */

// «مرا به خاطر بسپار» روشن = localStorage، خاموش = sessionStorage
export function saveUser(session, remember) {
  clearUser();
  const store = remember ? localStorage : sessionStorage;
  store.setItem(AUTH_KEY, JSON.stringify({ ...session.user, token: session.token }));
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(AUTH_KEY) || sessionStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearUser() {
  localStorage.removeItem(AUTH_KEY);
  sessionStorage.removeItem(AUTH_KEY);
}

/* ─────────── صفحه‌ی ورود ─────────── */

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { busy, run } = useAsyncAction();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError("نام کاربری و رمز عبور را وارد کنید.");
      return;
    }
    setError("");
    run(async () => {
      try {
        const session = await api.login({ username, password });
        saveUser(session, remember);
        logActivity("auth", "ورود به پنل");
        toast.success(`خوش آمدید، ${session.user.name}`);
        navigate(location.state?.from?.pathname || "/", { replace: true });
      } catch (err) {
        setError(apiErrorMessage(err, "ورود انجام نشد. دوباره تلاش کنید."));
      }
    });
  };

  return (
    <main className="loginpage">
      <aside className="loginaside">
        <div className="loginasidebrand">
          <Logo size={44} />
          <span>ماردین</span>
        </div>
        <div className="loginasidetext">
          <h2>درخواست‌ها، نصاب‌ها و ورکشاپ‌ها در یک پنل</h2>
          <p>وارد شوید و کارهای امروز را ببینید.</p>
        </div>
      </aside>

      <div className="loginpanel">
      <form className="logincard" onSubmit={onSubmit} noValidate>
        <div className="loginbrand">
          <h1 className="logintitle">ورود به پنل</h1>
          <p className="loginsub">نام کاربری و رمز عبور خود را وارد کنید.</p>
        </div>

        <label className="field">
          <span className="fieldlabel">نام کاربری</span>
          <span className="fieldbox">
            <LuUser className="fieldicon" />
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              autoFocus
              dir="ltr"
            />
          </span>
        </label>

        <label className="field">
          <span className="fieldlabel">رمز عبور</span>
          <span className="fieldbox">
            <LuLock className="fieldicon" />
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              dir="ltr"
            />
            <button
              type="button"
              className="fieldtoggle"
              onClick={() => setShowPass((v) => !v)}
              aria-label={showPass ? "پنهان کردن رمز" : "نمایش رمز"}
            >
              {showPass ? <LuEyeOff /> : <LuEye />}
            </button>
          </span>
        </label>

        <label className="checkrow">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          <span>مرا به خاطر بسپار</span>
        </label>

        {error && (
          <p className="formerror" role="alert">
            {error}
          </p>
        )}

        <button type="submit" className="btnprimary btnblock" disabled={busy}>
          <LuLogIn />
          {busy ? "در حال ورود..." : "ورود"}
        </button>

        {import.meta.env.DEV && (
          <p className="loginhint">
            نسخه‌ی نمایشی (رمز همه <code>1234</code>): <code>admin</code> مدیر، <code>operator</code> اپراتور،
            <code>accountant</code> حسابدار، <code>tech</code> تکنسین
          </p>
        )}
      </form>
      </div>
    </main>
  );
};

export default Login;
