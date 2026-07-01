import { useLocation, useNavigate } from "react-router";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

/**
 * A "go back" button that returns to the PREVIOUS section (browser history),
 * instead of jumping to the main program overview. Hidden on the dashboard
 * home route where there is nowhere to go back to.
 */
export default function BackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  // Nothing to go back to on the dashboard home.
  if (location.pathname === "/") return null;

  return (
    <button
      type="button"
      onClick={() => navigate(-1)}
      className="mb-4 inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-transparent dark:text-gray-200 dark:hover:bg-gray-800"
      aria-label="Geri"
    >
      <ArrowBackIcon sx={{ fontSize: 18 }} />
      Geri
    </button>
  );
}
