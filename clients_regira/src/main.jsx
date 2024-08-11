import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from './App.jsx'
import Inici from './Inici.jsx';
import Login from './LoginAndRegister/Login';
import LlistaProjectes from './Projectes/LlistaProjectes.jsx';
import {MostraProjecte} from './Projectes/MostraProjecte.jsx';
import './index.css'
import Register from './LoginAndRegister/Register.jsx';
import NouProjecte from './Projectes/NouProjecte.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(

  <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>

          <Route index element={<Inici />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/projectes" element={<LlistaProjectes />} />
          <Route path="/projectes/:idProj" element={<MostraProjecte />} />
          <Route path="/projectes/nou" element={<NouProjecte />} />
          
        </Route>
      </Routes>
    </BrowserRouter>

)
