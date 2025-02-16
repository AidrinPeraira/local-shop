import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {MainRoutes} from "./routes/MainRoutes";
import {UserRoutes} from "./routes/UserRoutes";
import {SellerRoutes} from "./routes/SellerRoutes"; // Fixed spelling mistake
import {AdminRoutes} from "./routes/AdminRoutes";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<MainRoutes />} />
        <Route path="/user/*" element={<UserRoutes />} />
        <Route path="/seller/*" element={<SellerRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
    </Router>
  );
}

export default App;
