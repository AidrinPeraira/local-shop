import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {MainRoutes} from "./routes/MainRoutes";
import {SellerRoutes} from "./routes/SellerRoutes"; // Fixed spelling mistake
import {AdminRoutes} from "./routes/AdminRoutes";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<MainRoutes />} />
        <Route path="/seller/*" element={<SellerRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
    </Router>
  );
}

export default App;
