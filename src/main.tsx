import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Provider } from "react-redux";
import { UserProvider } from "./context/UserContext.tsx";
import { store } from "./redux/store.ts";

createRoot(document.getElementById("root")!).render(
    <Provider store={store}>
        <UserProvider>
            <App />
        </UserProvider>
    </Provider>
);
