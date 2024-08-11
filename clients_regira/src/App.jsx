import { Outlet, Link, useLocation } from "react-router-dom";

function App() {


  const handleLogout = () => {
    // Clear the authentication token cookie
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; // Set the expiration date to a past date
    // Redirect the user to the login page or any other appropriate page
    window.location.href = "/login"; // Redirect to the login page
  };

  /*
  <div className="flex justify-between mb-10">
          <Link className="border px-4 py-2 bg-blue-700 text-white" to="/" >Inici</Link>
          <Link className="border px-4 py-2 bg-blue-700 text-white" to="/register" >Registrar</Link>
          <Link className="border px-4 py-2 bg-blue-700 text-white" to="/projectes">Llista</Link>
          <Link className="border px-4 py-2 bg-blue-700 text-white" to="/projecte/nou">Nou Bolet</Link>
          <Link className="border px-4 py-2 bg-blue-700 text-white" to="/login" >Login</Link>
          <button className="border px-4 py-2 bg-blue-700 text-white" onClick={handleLogout}>Logout</button>
        </div>
  */

  let index = (useLocation().pathname == '/')
  let mostraProjecta = (useLocation().pathname == '/projectes/:idProj')
  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-r from-neutral-800 to-bg-white">

      <div className="h-5/6 w-5/6 flex flex-col items-center justify-center bg-white">
        <div className={`w-full h-full ${index ? '' : 'p-32'} ${mostraProjecta ? '' : 'p-0'}`}>
          <Outlet />
        </div>
      </div>
      
    </div>
  )
}

export default App