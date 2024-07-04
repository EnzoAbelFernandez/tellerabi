//import Form from "./components/form";
// import Gpt from "./components/gpt";
import './App.css'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from "./components/login";
import Dashboard from "./components/dashboard";
import { useState } from "react";


function App(){
  const [autenticado, setAutenticado] = useState(false);

  return (
    <>
      <Router>
      <Routes>
        <Route path="/login" element={<Login setAuthenticated={setAutenticado} />} />
        <Route
          path="/dashboard"
          element={autenticado ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
    </>
  )
}


export default App;