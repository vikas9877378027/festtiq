import React, { useEffect, useRef, useState } from "react";
import { XMarkIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useAuth } from '../../context/Auth';
import { USER_LOGIN, USER_REGISTER } from '../../config/apiConfig';

export default function AuthModal({ show, onClose }) {
  const { signIn } = useAuth();
  const [mode, setMode] = useState("signin"); // 'signin' | 'signup'
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const dialogRef = useRef(null);

  useEffect(() => {
    if (show) setErr("");
  }, [show]);

  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && show && onClose();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [show, onClose]);

  const update = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value.trimStart() }));

  const validate = () => {
    if (!form.email) return "Email is required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Enter a valid email";
    if (!form.password || form.password.length < 6) return "Password must be at least 6 characters";
    if (mode === "signup" && !form.name) return "Name is required";
    return "";
  };

  const submit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (v) return setErr(v);

    try {
      setLoading(true);
      setErr("");

      const url = mode === "signin" ? USER_LOGIN : USER_REGISTER;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.message || "Unable to authenticate");
      }

      // Expect: { token, user: { name, email, avatarUrl? } }
      if (!data?.token || !data?.user) {
        throw new Error("Invalid server response");
      }

      signIn({ user: data.user, token: data.token });
      onClose();
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
      <div ref={dialogRef} className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h3 className="text-xl font-semibold">{mode === "signin" ? "Log in" : "Sign up"}</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="px-6 pt-4">
          <div className="mb-4 grid grid-cols-2 overflow-hidden rounded-lg border">
            <button
              className={`py-2 text-sm ${mode === "signin" ? "bg-[#8F24AB] text-white" : "hover:bg-gray-50"}`}
              onClick={() => setMode("signin")}
            >
              Sign in
            </button>
            <button
              className={`py-2 text-sm ${mode === "signup" ? "bg-[#8F24AB] text-white" : "hover:bg-gray-50"}`}
              onClick={() => setMode("signup")}
            >
              Sign up
            </button>
          </div>

          <form onSubmit={submit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={update}
                  className="mt-1 w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-[#8F24AB]"
                  placeholder="Your name"
                  autoComplete="name"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={update}
                className="mt-1 w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-[#8F24AB]"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1 flex items-center rounded-md border px-3">
                <input
                  name="password"
                  type={showPwd ? "text" : "password"}
                  value={form.password}
                  onChange={update}
                  className="w-full py-2 outline-none"
                  placeholder="••••••••"
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((s) => !s)}
                  className="ml-2 p-1"
                  aria-label={showPwd ? "Hide password" : "Show password"}
                >
                  {showPwd ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {err && <p className="text-sm text-red-600">{err}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-[#8F24AB] py-2 font-medium text-white hover:bg-[#5E0C7D] disabled:opacity-60"
            >
              {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>

          {mode === "signin" && (
            <p className="mt-3 text-center text-sm text-gray-500">
              New here?{" "}
              <button className="font-medium text-[#8F24AB]" onClick={() => setMode("signup")}>
                Create an account
              </button>
            </p>
          )}
        </div>

        <div className="px-6 pb-5 pt-4 text-center text-xs text-gray-500">
          By continuing you agree to our Terms & Privacy Policy.
        </div>
      </div>
    </div>
  );
}
