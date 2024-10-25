"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

const Navbar = () => {
  const { data } = useSession();

  return (
    <nav className="navbar navbar-dark bg-dark">
      <div className="container">
        <Link
          href="/"
          className="btn btn-primary btn-sm"
        >
          Inicio
        </Link>
        {data?.accessToken ? (
          <>
            <Link
              href="/home"
              className="btn btn-primary btn-sm"
            >
              Pagina Principal
            </Link>
            <Link
              href="/home/manage-doctor"
              className="btn btn-primary btn-sm"
            >
              Administrar doctores
            </Link>
            <Link
              href="/home/bussines"
              className="btn btn-primary btn-sm"
            >
              Ver Datos Bussines intelligence
            </Link>
            <Link
              href="/home/horario"
              className="btn btn-primary btn-sm"
            >
              Mis Horarios
            </Link>
            <Link
              href="/home/reserva"
              className="btn btn-primary btn-sm"
            >
              Mis Reservas
            </Link>
            <button
              onClick={() => signOut()}
              className="btn btn-danger btn-sm"
            >
              Cerrar sesion
            </button>
          </>
        ) : (
          <>
            <Link
              href="/auth/signin"
              className="btn btn-primary btn-sm"
            >
              Login
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};
export default Navbar;
