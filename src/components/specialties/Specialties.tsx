import { Link } from "react-router";
import Stack from "@mui/material/Stack";
import { Skeleton } from "@mui/material";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { RootState } from "../../redux/store";
import Pagination from "@mui/material/Pagination";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { getSpecialtiesByCafedra, getAllSpecialties, Specialty } from "../../services/specialty/specialtyService";

export default function Specialties() {
    const [end, setEnd] = useState<number>(6);
    const [start, setStart] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [specialties, setSpecialties] = useState<Specialty[]>([]);
    const [search, setSearch] = useState("");
    const role = useSelector((state: RootState) => state.auth.role);
    const [specailtyLength, setSpecialtyLength] = useState<number>(0);
    const token = useSelector((state: RootState) => state.auth.token);
    const cafedra_code = useSelector((state: RootState) => state.auth.cafedra_code);

    useEffect(() => {
        try {
            setLoading(true);
            if (role === 2) {
                getSpecialtiesByCafedra(
                    cafedra_code ? cafedra_code : "",
                    token ? token : "",
                    start,
                    end
                )
                    .then((res) => {
                        if (typeof res === "object" && res.specialties) {
                            setSpecialties(res.specialties);
                            setSpecialtyLength(res.total_specialties);
                        } else {
                            setSpecialties([]);
                        }
                    })
                    .finally(() => setLoading(false));
            } else if (role === 1) {
                getAllSpecialties(token ? token : "")
                    .then(setSpecialties)
                    .finally(() => setLoading(false));
            }
        } catch (err) {
            setSpecialties([]);
            setLoading(false);
        }
    }, []);

    const filtered = specialties.filter((s) =>
        s.specialty_name.toLowerCase().includes(search.toLowerCase()) ||
        s.specialty_code.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Search bar */}
            <div className="relative max-w-sm">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                            fill="currentColor"
                        />
                    </svg>
                </span>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="İxtisas axtar..."
                    className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-800 placeholder-gray-400 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 dark:placeholder-gray-500 dark:focus:border-brand-700"
                />
            </div>

            {/* Cards grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {loading
                    ? Array.from({ length: 6 }).map((_, index) => (
                          <div
                              key={index}
                              className="flex animate-pulse flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]"
                          >
                              <div className="flex items-center justify-between">
                                  <Skeleton variant="rounded" width={80} height={24} sx={{ borderRadius: 8 }} />
                                  <Skeleton variant="rounded" width={64} height={22} sx={{ borderRadius: 999 }} />
                              </div>
                              <Skeleton variant="text" width="90%" height={24} />
                              <Skeleton variant="text" width="50%" height={20} />
                          </div>
                      ))
                    : filtered.map((specialty, index) => (
                          <Link
                              key={index}
                              to="/specialty-details"
                              state={{ specialtyCode: specialty.specialty_code, specialtyName: specialty.specialty_name }}
                              className="group flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-5 transition-all duration-200 hover:border-brand-300 hover:shadow-lg dark:border-gray-800 dark:bg-white/[0.03] dark:hover:border-brand-700"
                          >
                              {/* Top row: code badge + degree badge */}
                              <div className="flex items-center justify-between">
                                  <span className="inline-flex items-center rounded-lg bg-gray-100 px-2.5 py-1 font-mono text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                                      {specialty.specialty_code}
                                  </span>
                                  <span className="inline-flex items-center rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-500/10 dark:text-brand-400">
                                      İxtisas
                                  </span>
                              </div>

                              {/* Specialty name */}
                              <p className="line-clamp-2 text-base font-semibold text-gray-800 leading-snug dark:text-white/90">
                                  {specialty.specialty_name}
                              </p>

                              {/* Bottom: arrow link */}
                              <div className="flex items-center gap-1 text-sm font-medium text-brand-500 transition-all group-hover:gap-2 dark:text-brand-400">
                                  Ətraflı bax
                                  <ArrowForwardIcon sx={{ fontSize: 16 }} />
                              </div>
                          </Link>
                      ))}
            </div>

            {/* Empty state when search yields nothing */}
            {!loading && filtered.length === 0 && specialties.length > 0 && (
                <div className="py-12 text-center text-gray-500 dark:text-gray-400">
                    <p className="text-sm">Axtarışa uyğun ixtisas tapılmadı.</p>
                </div>
            )}

            {/* Pagination (only for role 2 with server-side pagination) */}
            {role === 2 && (
                <div className="mt-8 flex justify-center">
                    <Stack spacing={2}>
                        <Pagination
                            count={specailtyLength ? (specailtyLength <= 6 ? 1 : Math.ceil(specailtyLength / 6)) : 1}
                            page={Math.floor(start / (end - start)) + 1}
                            onChange={(_event, page) => {
                                const pageSize = end - start;
                                const newStart = (page - 1) * pageSize;
                                const newEnd = newStart + pageSize;
                                setStart(newStart);
                                setEnd(newEnd);
                                setLoading(true);
                                getSpecialtiesByCafedra(
                                    cafedra_code ? cafedra_code : "",
                                    token ? token : "",
                                    newStart,
                                    newEnd
                                )
                                    .then((res) => {
                                        if (typeof res === "object" && res.specialties) {
                                            setSpecialties(res.specialties);
                                            setSpecialtyLength(res.total_specialties);
                                        } else {
                                            setSpecialties([]);
                                        }
                                    })
                                    .finally(() => setLoading(false));
                            }}
                            sx={{
                                "& .MuiPaginationItem-root": {
                                    color: "text.primary",
                                    bgcolor: "background.paper",
                                },
                                "& .MuiPaginationItem-root.Mui-selected": {
                                    bgcolor: "primary.main",
                                    color: "primary.contrastText",
                                    "&:hover": { bgcolor: "primary.dark" },
                                },
                                "& .MuiPaginationItem-root:hover": {
                                    bgcolor: "action.hover",
                                },
                            }}
                        />
                    </Stack>
                </div>
            )}
        </div>
    );
}
