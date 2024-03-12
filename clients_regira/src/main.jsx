import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from './App.jsx'
import Inici from './Inici.jsx';
import Login from './LoginAndRegister/Login';
import LlistaProjectes from './Projectes/LlistaProjectes.jsx';
import MostraProjecte from './Projectes/MostraProjecte.jsx';
import NouProjecte from './Projectes/NouProjecte.jsx';
import './index.css'
import Register from './LoginAndRegister/Register.jsx';
import NouIssue from './Issues/NouIssue';

ReactDOM.createRoot(document.getElementById('root')).render(

  <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>

          <Route index element={<Inici />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/projectes" element={<LlistaProjectes />} />
          <Route path="/projecte/:idProj" element={<MostraProjecte />} />
          <Route path="/projecte/:idProj/newIssue" element={<NouIssue />} />
          <Route path="/projecte/nou" element={<NouProjecte />} />
          
        </Route>
      </Routes>
    </BrowserRouter>

)
