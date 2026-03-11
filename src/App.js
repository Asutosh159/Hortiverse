import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar    from "./components/Navbar";
import Home      from "./pages/Home";
import Stories   from "./pages/Stories";
import Topics    from "./pages/Topics";
import Resources from "./pages/Resources";
import Community from "./pages/Community";
import Login     from "./pages/Login";
import Register  from "./pages/Register";

function App() {
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
              <Route path="/"          element={<Home />}      />
              <Route path="/stories"   element={<Stories />}   />
              <Route path="/topics"    element={<Topics />}    />
              <Route path="/resources" element={<Resources />} />
              <Route path="/community" element={<Community />} />
            </Routes>
          </>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;