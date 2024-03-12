import './App.css'
import { Outlet, Link } from "react-router-dom";

function App() {


  const handleLogout = () => {
    // Clear the authentication token cookie
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; // Set the expiration date to a past date
    // Redirect the user to the login page or any other appropriate page
    window.location.href = "/login"; // Redirect to the login page
  };


  return (
    
    <div className="p-[30px]">

      <div className="flex justify-between mb-10">
        <Link className="border px-4 py-2 bg-blue-700 text-white" to="/" >Inici</Link>
        <Link className="border px-4 py-2 bg-blue-700 text-white" to="/register" >Registrar</Link>
        <Link className="border px-4 py-2 bg-blue-700 text-white" to="/projectes">Llista</Link>
        <Link className="border px-4 py-2 bg-blue-700 text-white" to="/projecte/nou">Nou Bolet</Link>
        <Link className="border px-4 py-2 bg-blue-700 text-white" to="/login" >Login</Link>
        <button className="border px-4 py-2 bg-blue-700 text-white" onClick={handleLogout}>Logout</button>
      </div>

      <div className=" p-5">
        <Outlet />
      </div>

    </div>
  )
}

export default App