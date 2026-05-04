import "./index.css";
import App from "./App.tsx";
import "swiper/swiper-bundle.css";
import { StrictMode } from "react";
import "flatpickr/dist/flatpickr.css";
import { Provider } from "react-redux";
import { store } from "./redux/store.ts";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <AppWrapper>
          <App />
        </AppWrapper>
      </ThemeProvider>
    </Provider>
  </StrictMode>,
);
