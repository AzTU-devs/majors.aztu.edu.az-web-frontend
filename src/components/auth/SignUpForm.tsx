import Swal from "sweetalert2";
import Label from "../form/Label";
import { Link } from "react-router";
import Select from "../form/Select";
import { useSelector } from "react-redux";
import Input from "../form/input/InputField";
import { RootState } from "../../redux/store";
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import { EyeCloseIcon, EyeIcon } from "../../icons";
import React, { useState, useEffect, useMemo } from "react";
import { signup } from "../../services/auth/authService";
import CircularProgress from "@mui/material/CircularProgress";
import { getFaculties, Faculty } from "../../services/faculty/facultyService";
import { Cafedra, getCafedrasByFaculty } from "../../services/cafedra/cafedraService";

export default function SignUpForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [finKod, setFinKod] = useState("");
  const [faculty, setFaculty] = useState("");
  const [surname, setSurname] = useState("");
  const [cafedra, setCafedra] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [fatherName, setFatherName] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [inputFocussed, setInputFocussed] = useState(false);
  const [repeatedPassword, setRepeatedPassword] = useState("");
  const [showRepPassword, setShowRepPassword] = useState(false);

  const capitalizeFirst = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  // faculties logic

  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    getFaculties(token)
      .then(setFaculties)
      .finally(() => {
        setLoading(false);
      })
  }, []);

  const facultyOptions = useMemo(() => {
    const options = faculties.map((faculty) => ({
      value: String(faculty.faculty_code),
      label: `${faculty.faculty_name} (${faculty.faculty_code})`
    }));
    return options;
  }, [faculties]);

  const handleFacultyChange = (value: string) => {
    setFaculty(value);
  };

  // cafedras logic

  const [cafedras, setCafedras] = useState<Cafedra[]>([]);

  useEffect(() => {
    if (!faculty) return;

    getCafedrasByFaculty(faculty, token || '')
      .then(setCafedras)
      .finally(() => setLoading(false));
  }, [faculty]);

  const cafedraOptions = useMemo(() => {
    return (cafedras || []).map((cafedra) => ({
      value: String(cafedra.cafedra_code),
      label: `${cafedra.cafedra_name} (${cafedra.cafedra_code})`
    }));
  }, [cafedras]);

  const handleCafedraChange = (value: string) => {
    setCafedra(value);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setFormLoading(true);
      const singUpCredentials = {
      name: name,
      surname: surname,
      father_name: fatherName,
      fin_kod: finKod,
      email: email,
      password: password,
      cafedra_code: cafedra
    };

    const result = await signup(singUpCredentials);

    if (result === "SUCCESS") {
      Swal.fire(
        "Uğurlu!",
        "Qeydiyyat tamamlandı.",
        "success"
      ).then(() => {
        setFormLoading(false);
      })
    } else if (result === "CONFLICT") {
      Swal.fire("Xəta!", "İstifadəçi artıq mövcuddur.", "error").then(() => {
        setFormLoading(false);
      })
    } else {
      Swal.fire("Xəta!", "Naməlum bir səhv baş verdi.", "error").then(() => {
        setFormLoading(false);
      })
    }
    } catch (err) {
      Swal.fire("Xəta!", "Naməlum bir səhv baş verdi.", "error").then(() => {
        setFormLoading(false);
      })
    }
  };

  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
      <div className="flex flex-col justify-center flex-1 w-full max-w-[50%] mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Qeydiyyat
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign up!
            </p>
          </div>
          <div>
            <form onSubmit={handleSignUp}>
              <div className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                  {/* <!-- First Name --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      Ad<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      value={name}
                      type="text"
                      id="fname"
                      name="fname"
                      placeholder="Ad"
                      onChange={(e) => setName(capitalizeFirst(e.target.value))}
                    />
                  </div>
                  {/* <!-- Last Name --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      Soyad<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      value={surname}
                      type="text"
                      id="lname"
                      name="lname"
                      placeholder="Soyad"
                      onChange={(e) => setSurname(capitalizeFirst(e.target.value))}
                    />
                  </div>
                  {/* <!-- Father Name --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      Ata adı<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      value={fatherName}
                      type="text"
                      id="fatherName"
                      name="fatherName"
                      placeholder="Ata adı"
                      onChange={(e) => { setFatherName(capitalizeFirst(e.target.value)) }}
                    />
                  </div>
                </div>
                {/* <!-- Fin Kod --> */}
                <div>
                  <Label>
                    Fin Kod<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    maxLength={7}
                    value={finKod}
                    type="text"
                    id="finKod"
                    name="finKod"
                    placeholder="Fin kod"
                    onChange={(e) => {
                      const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
                      setFinKod(value);
                    }}
                  />
                </div>
                {/* <!-- Email --> */}
                <div>
                  <Label>
                    Email (korporativ)<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    value={email}
                    type="email"
                    id="email"
                    name="email"
                    placeholder="E-poçt adresi"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {/* Faculty */}
                <div>
                  <Label>Fakültə</Label>
                  {loading ? (
                    <div className="flex justify-center items-center w-full h-full py-10">
                      <CircularProgress />
                    </div>
                  ) : (
                    <Select
                      options={facultyOptions}
                      placeholder={"Fakültə seçin"}
                      onChange={handleFacultyChange}
                      className="dark:bg-dark-900"
                    />
                  )}
                </div>
                {/* Cafedra */}
                <div>
                  <Label>Kafedra</Label>
                  {loading ? (
                    <div className="flex justify-center items-center w-full h-full py-10">
                      <CircularProgress />
                    </div>
                  ) : (
                    <Select
                      options={cafedraOptions}
                      placeholder={"Kafedra seçin"}
                      onChange={handleCafedraChange}
                      className="dark:bg-dark-900"
                    />
                  )}
                </div>
                {/* <!-- Password --> */}
                <div>
                  <Label>
                    Şifrə<span className="text-error-500">*</span>
                  </Label>
                  <div className="relative mb-[20px]">
                    <Input
                      value={password}
                      onChange={(e) => { setPassword(e.target.value) }}
                      placeholder="Şifrə"
                      type={showPassword ? "text" : "password"}
                      onFocus={() => setInputFocussed(true)}
                      onBlur={() => setInputFocussed(false)}
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
                  {inputFocussed ? (
                    <div className="mb-[10px]">
                      <div className="flex items-center">
                        <div className="flex justify-center items-center"
                          style={{
                            backgroundColor: password.length >= 8 ? "green" : "red",
                            borderColor: password.length >= 8 ? "green" : "red",
                            borderWidth: 2,
                            width: "15px",
                            height: "15px",
                            borderRadius: "50%",
                            padding: "7px",
                            marginRight: 10
                          }}>
                          {password.length >= 8 ? (
                            <DoneIcon className="text-white" style={{ fontSize: "14px" }} />
                          ) : (
                            <CloseIcon className="text-white" style={{ fontSize: "14px" }} />
                          )}
                        </div>
                        <p>
                          Minimum 8 simvol
                        </p>
                      </div>
                      <div className="flex items-center">
                        <div className="flex justify-center items-center"
                          style={{
                            backgroundColor: /[A-Z]/.test(password) ? "green" : "red",
                            borderColor: /[A-Z]/.test(password) ? "green" : "red",
                            borderWidth: 2,
                            width: "15px",
                            height: "15px",
                            borderRadius: "50%",
                            padding: "7px",
                            marginRight: 10
                          }}>
                          {/[A-Z]/.test(password) ? (
                            <DoneIcon className="text-white" style={{ fontSize: "14px" }} />
                          ) : (
                            <CloseIcon className="text-white" style={{ fontSize: "14px" }} />
                          )}
                        </div>
                        <p>
                          Ən azı bir böyük hərf
                        </p>
                      </div>
                      <div className="flex items-center">
                        <div className="flex justify-center items-center"
                          style={{
                            backgroundColor: /[0-9]/.test(password) ? "green" : "red",
                            borderColor: /[0-9]/.test(password) ? "green" : "red",
                            borderWidth: 2,
                            width: "15px",
                            height: "15px",
                            borderRadius: "50%",
                            padding: "7px",
                            marginRight: 10
                          }}>
                          {/[0-9]/.test(password) ? (
                            <DoneIcon className="text-white" style={{ fontSize: "14px" }} />
                          ) : (
                            <CloseIcon className="text-white" style={{ fontSize: "14px" }} />
                          )}
                        </div>
                        <p>
                          Ən azı bir nömrə
                        </p>
                      </div>
                      <div className="flex items-center">
                        <div className="flex justify-center items-center"
                          style={{
                            backgroundColor: /[^A-Za-z0-9]/.test(password) ? "green" : "red",
                            borderColor: /[^A-Za-z0-9]/.test(password) ? "green" : "red",
                            borderWidth: 2,
                            width: "15px",
                            height: "15px",
                            borderRadius: "50%",
                            padding: "7px",
                            marginRight: 10
                          }}>
                          {/[^A-Za-z0-9]/.test(password) ? (
                            <DoneIcon className="text-white" style={{ fontSize: "14px" }} />
                          ) : (
                            <CloseIcon className="text-white" style={{ fontSize: "14px" }} />
                          )}
                        </div>
                        <p>
                          Ən azı bir xüsusi simvol (!@#$%^&*(),.?":{ }|")
                        </p>
                      </div>
                    </div>
                  ) : null}
                  <Label>
                    Təkrar Şifrə<span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      value={repeatedPassword}
                      onChange={(e) => { setRepeatedPassword(e.target.value) }}
                      placeholder="Təkrar şifrə"
                      type={showRepPassword ? "text" : "password"}
                    />
                    <span
                      onClick={() => setShowRepPassword(!showRepPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showRepPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>
                {/* <!-- Button --> */}
                <div>
                  <button disabled={formLoading} className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600">
                    {formLoading ? "Yüklənir..." : "Qeydiyyat"}
                  </button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Artıq hesabınız var? {""}
                <Link
                  to="/signin"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Daxil Ol
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
