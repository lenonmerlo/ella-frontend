import { AppRoutes } from "./routes";
import { DialogProvider } from "./contexts/DialogContext";
import "./styles/globals.css";

function App() {
  return (
    <DialogProvider>
      <AppRoutes />
    </DialogProvider>
  );
}

export default App;
