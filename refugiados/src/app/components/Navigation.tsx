"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiHome, FiFileText, FiBarChart2 } from "react-icons/fi";

export default function Navigation() {
  const pathname = usePathname() || "/";

  const isActive = (path: string) => {
    if (path === "/home") return pathname === "/" || pathname === "/home";
    return pathname.startsWith(path);
  };

  const btnClass = (path: string) =>
    `flex flex-col items-center gap-1 py-2 px-3 rounded ${
      isActive(path) ? "text-white" : "text-gray-400"
    }`;

  return (
    <footer className="w-full bg-gray-800 p-2 fixed bottom-0 left-0 z-40">
      <nav className="flex justify-around text-xs">
        <Link href="/home" className={btnClass("/home")} aria-label="Inicio">
          <FiHome size={22} />
          <span className="text-[10px]">Inicio</span>
        </Link>

        <Link
          href="/registrar"
          className={btnClass("/registrar")}
          aria-label="Registros"
        >
          <FiFileText size={22} />
          <span className="text-[10px]">Registros</span>
        </Link>

        <Link
          href="/descargarReporte"
          className={btnClass("/descargarReporte")}
          aria-label="Reportes"
        >
          <FiBarChart2 size={22} />
          <span className="text-[10px]">Reportes</span>
        </Link>
      </nav>
    </footer>
  );
}
