import { BrowserRouter as Router } from "react-router-dom";
import { MainRoutes } from "./routes/MainRoutes";
import { UserRoutes } from "./routes/UserRoutes";
import { SelllerRoutes } from "./routes/SelllerRoutes";
import { AdminRoutes } from "./routes/Adminroutes";

function App() {
  return (
    <Router>
      <MainRoutes />
      <UserRoutes />
      <SelllerRoutes />
      <AdminRoutes />
    </Router>
  );
}

export default App;
