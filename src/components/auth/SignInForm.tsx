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
      const credentials = {
        fin_kod: finKod,
        password: password
      };

      const result = await signin(credentials);

      if (typeof result === "object") {
        dispatch(loginSuccess(result));
        navigate("/");
      } else if (result === "UNAUTHORIZED") {
        Swal.fire(
          "Xəta!",
          "Fin kod və ya şifrə yanlışdır.",
          "error"
        ).then(() => {
          setLoading(false);
        })
      } else {
        Swal.fire(
          "Xəta!",
          "Gözlənilməz xəta baş verdi.",
          "error"
        ).then(() => {
          setLoading(false);
        })
      }
    } catch (e) {
      Swal.fire(
        "Xəta!",
        "Gözlənilməz xəta baş verdi.",
        "error"
      ).then(() => {
        setLoading(false);
      })
    }
  }
  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Daxil Ol
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Daxil olmaq üçün fin kod və şifrəni daxil edin!
            </p>
          </div>
          <div>
            <form onSubmit={handleSignIn}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Fin kod <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input
                    type="text"
                    value={finKod}
                    onChange={(e) => setFinKod(e.target.value.toUpperCase())}
                    placeholder="Fin kod"
                  />
                </div>
                <div>
                  <Label>
                    Şifrə <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type={showPassword ? "text" : "password"}
                      placeholder="Şifrə"
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-end">
                  <Link
                    to="/reset-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Şifrəni unutdum?
                  </Link>
                </div>
                <div>
                  <Button className="w-full" size="sm" disabled={loading}>
                    {loading ? "Daxil Olunur..." : "Daxil Ol"}
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Hesabınız yoxdur?
                <Link
                  to="/signup"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Qeydiyyat
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
