import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar    from "./components/Navbar";
import Home      from "./pages/Home";
import Stories   from "./pages/Stories";
import Topics    from "./pages/Topics";
import Resources from "./pages/Resources";
import Community from "./pages/UnderDevelopment";
import Login     from "./pages/Login";
import Register  from "./pages/Register";
import SuperAdmin from "./pages/SuperAdmin"; // 🟢 Added Import

function App() {

  useEffect(() => {
    if (!localStorage.getItem("hv_visitor_id")) {
      const randomId = "guest_" + Math.random().toString(36).substring(2, 15);
      localStorage.setItem("hv_visitor_id", randomId);
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Full-screen auth pages — no navbar */}
        <Route path="/login"    element={<Login />}    />
        <Route path="/register" element={<Register />} />

        {/* All other pages — with navbar */}
        <Route path="*" element={
          <>
            <Navbar />
            <Routes>
              <Route path="/"           element={<Home />}      />
              <Route path="/stories"    element={<Stories />}   />
              <Route path="/topics"     element={<Topics />}    />
              <Route path="/resources"  element={<Resources />} />
              <Route path="/admin"      element={<SuperAdmin />} /> {/* 🟢 Added Route */}
              <Route path="/UnderDevelopment" element={<Community />} />
            </Routes>
          </>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;