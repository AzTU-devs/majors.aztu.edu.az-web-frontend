import Swal from "sweetalert2";
import Label from "../form/Label";
import { Link } from "react-router";
import React, { useState } from "react";
import Button from "../ui/button/Button";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import Input from "../form/input/InputField";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import { signin } from "../../services/auth/authService";
import { loginSuccess } from "../../redux/slice/authSlice";

export default function SignInForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [finKod, setFinKod] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!finKod || !password) {
        Swal.fire(
          "Xəta!",
          "Zəhmət olmasa bütün xanaları doldurun.",
          "warning"
        );
        return;
      }
      setLoading(true);
      const credentials = { fin_kod: finKod, password };
      const result = await signin(credentials);

      if (typeof result === "object") {
        dispatch(loginSuccess(result));
        navigate("/");
      } else if (result === "UNAUTHORIZED") {
        Swal.fire("Xəta!", "Fin kod və ya şifrə yanlışdır.", "error").then(() =>
          setLoading(false)
        );
      } else {
        Swal.fire("Xəta!", "Gözlənilməz xəta baş verdi.", "error").then(() =>
          setLoading(false)
        );
      }
    } catch {
      Swal.fire("Xəta!", "Gözlənilməz xəta baş verdi.", "error").then(() =>
        setLoading(false)
      );
    }
  };

  return (
    <div className="flex flex-col">
      <div className="mb-8">
        <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
          AZTU
        </span>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Xoş gəldiniz
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Hesabınıza daxil olmaq üçün fin kod və şifrəni daxil edin.
        </p>
      </div>

      <form onSubmit={handleSignIn} className="space-y-5">
        <div>
          <Label>
            Fin kod <span className="text-error-500">*</span>
          </Label>
          <Input
            type="text"
            value={finKod}
            onChange={(e) => setFinKod(e.target.value.toUpperCase())}
            placeholder="ADMIN001"
            autoComplete="username"
          />
        </div>

        <div>
          <Label>
            Şifrə <span className="text-error-500">*</span>
          </Label>
          <div className="relative">
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-white/5 dark:hover:text-gray-200"
              aria-label={showPassword ? "Şifrəni gizlət" : "Şifrəni göstər"}
            >
              {showPassword ? (
                <EyeIcon className="size-5 fill-current" />
              ) : (
                <EyeCloseIcon className="size-5 fill-current" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end">
          <Link
            to="/reset-password"
            className="text-sm font-medium text-brand-600 transition hover:text-brand-700 dark:text-brand-300 dark:hover:text-brand-200"
          >
            Şifrəni unutdum?
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={loading}
        >
          {loading ? "Daxil olunur..." : "Daxil ol"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Hesabınız yoxdur?{" "}
        <Link
          to="/signup"
          className="font-medium text-brand-600 hover:text-brand-700 dark:text-brand-300 dark:hover:text-brand-200"
        >
          Qeydiyyatdan keç
        </Link>
      </p>
    </div>
  );
}
