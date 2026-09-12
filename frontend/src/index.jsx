import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "sonner";
import App from "./App";
import store, { persistor } from "./store";
import { ThemeProvider } from "./components/ThemeProvider";
import "./styles/tailwind.css";
import "./styles/index.css";

const root = createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <App />
          <Toaster position="bottom-right" richColors closeButton theme="system" />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
