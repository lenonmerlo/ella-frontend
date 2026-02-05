import { DialogProvider } from "./contexts/DialogContext";
import { AppRoutes } from "./routes";
import "./styles/globals.css";

function App() {
  return (
    <DialogProvider>
      <AppRoutes />
    </DialogProvider>
  );
}

export default App;
