/** @format */

import { Link } from "react-router-dom";

const HomeNavigation = () => {
  return (
    <>
      <Link
        className="text-white p-2 uppercase font-black text-xs cursor-pointer"
        to="/auth/login"
      >
        Iniciar Sesión
      </Link>
      <Link
        className=" bg-lime-500 rounded-lg text-slate-800 p-2 uppercase font-black text-xs cursor-pointer"
        to="/auth/register"
      >
        Registrarme
      </Link>
    </>
  );
};

export default HomeNavigation;
