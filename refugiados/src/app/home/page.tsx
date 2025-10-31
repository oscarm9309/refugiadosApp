"use client"; // Directiva necesaria para usar hooks y eventos

import { useRouter } from "next/navigation";
import Image from "next/image";

// Importaciones de Firebase (servicios reales)
import { signOut } from "firebase/auth";
import { auth } from "lib/firebase";

// Importaciones de simulación (servicios "mock")
import { mockSignOut } from "lib/firebase.mock";

// Importa los íconos para la barra de navegación
import { FiHome, FiFileText, FiBarChart2, FiLogOut } from "react-icons/fi";

export default function HomePage() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true") {
        await mockSignOut(); // Usa el mock
      } else {
        await signOut(auth); // Usa el real
      }
      router.push("/"); // Redirige al login después de cerrar sesión
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      alert("Hubo un error al intentar cerrar la sesión.");
    }
  };

  // Funciones placeholder para los botones de las tarjetas
  const handleRegisterClick = () => {
    router.push("/registrar");
    // router.push('/registrar'); // Descomentar cuando la ruta exista
  };

  const handleReportsClick = () => {
    // Navegar a la vista de descargar/generar reportes
    router.push("/descargarReporte");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <header className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold">Inicio</h1>
        </div>

        <div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-3 py-2 bg-red-600 rounded-md text-sm hover:bg-red-500"
          >
            <FiLogOut size={18} />
            <span className="hidden sm:inline">Cerrar sesión</span>
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 flex flex-col items-center gap-6">
        <div className="w-full max-w-sm bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <Image
            src="/registrar-bg.jpg" // Asegurate de tener esta imagen en la carpeta `public`
            alt="Registrar habitante"
            width={390}
            height={200}
            className="w-full h-48 object-cover"
          />
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-2">Registrar Habitante</h2>
            <p className="text-gray-400 mb-4">
              Añade un nuevo registro de habitante en la calle.
            </p>
            <button
              onClick={handleRegisterClick}
              className="w-full py-2 px-4 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Registrar
            </button>
          </div>
        </div>

        {/* Card para Descargar/Generar Reportes */}
        <div className="w-full max-w-sm bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <Image
            src="/reportes-bg.jpg" // Asegurate de tener esta imagen en la carpeta `public`
            alt="Generar reportes"
            width={390}
            height={200}
            className="w-full h-48 object-cover"
          />
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-2">
              Descargar/Generar Reportes
            </h2>
            <p className="text-gray-400 mb-4">
              Descarga o genera reportes detallados sobre los habitantes
              registrados.
            </p>
            <button
              onClick={handleReportsClick}
              className="w-full py-2 px-4 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reportes
            </button>
          </div>
        </div>
      </main>

      {/* Menú de navegación inferior */}
      <footer className="w-full bg-gray-800 p-2 sticky bottom-0">
        <nav className="flex justify-around text-xs text-gray-400">
          <button
            onClick={() => router.push("/home")}
            className="flex flex-col items-center gap-1 text-white"
            aria-label="Inicio"
          >
            <FiHome size={24} />
            Inicio
          </button>

          <button
            onClick={() => router.push("/registrar")}
            className="flex flex-col items-center gap-1"
            aria-label="Registros"
          >
            <FiFileText size={24} />
            Registros
          </button>

          <button
            onClick={() => router.push("/descargarReporte")}
            className="flex flex-col items-center gap-1"
            aria-label="Reportes"
          >
            <FiBarChart2 size={24} />
            Reportes
          </button>
        </nav>
      </footer>
    </div>
  );
}
