import { BrowserRouter, Routes, Route } from "react-router-dom";

import Root from "@/pages/Root";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Editor from "@/pages/Editor";
import Test from "@/pages/Test";
import Play from "@/pages/Play";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Root />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/test" element={<Test />} />
        <Route path="/play" element={<Play />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
