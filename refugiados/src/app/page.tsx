"use client"; // Directiva necesaria para usar hooks y eventos

import { useState } from "react";
import { useRouter } from "next/navigation";

// Importaciones de Firebase (servicios reales)
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword, // Importa la función para login con correo/contraseña
  fetchSignInMethodsForEmail,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "lib/firebase";

// Importaciones de simulación (servicios "mock")
import { mockSignInWithPopup } from "lib/firebase.mock";

// Importa un ícono de Google para el botón
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showResetOption, setShowResetOption] = useState(false);

  // Función para manejar el inicio de sesión con correo y contraseña
  const handleEmailPasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita que la página se recargue al enviar el formulario
    setError(""); // Limpia errores previos
    setShowResetOption(false);

    if (!email || !password) {
      setError("Por favor, ingresa tu correo y contraseña.");
      return;
    }

    try {
      // Antes de intentar signin por password, comprobamos los providers
      if (process.env.NEXT_PUBLIC_USE_MOCK_DATA !== "true") {
        try {
          const methods = await fetchSignInMethodsForEmail(auth, email);
          // Si el email existe pero solo con Google, ofrecemos enviar reset
          if (methods.includes("google.com") && !methods.includes("password")) {
            setError(
              "Esta cuenta fue creada con Google. Puedes iniciar con Google o crear una contraseña vía correo."
            );
            setShowResetOption(true);
            return;
          }
        } catch (err) {
          console.warn("No se pudieron obtener los métodos de inicio:", err);
          // continuar y dejar que el error original maneje cualquier fallo
        }
      }

      if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true") {
        console.log("Simulando inicio de sesión con correo y contraseña...");
        // Aquí podrías crear una función mock para este tipo de login si lo necesitaras
        await mockSignInWithPopup(); // Usamos el mock de Google como placeholder
      } else {
        console.log("Iniciando sesión con correo y contraseña...");
        await signInWithEmailAndPassword(auth, email, password);
      }
      router.push("/home");
    } catch (error: any) {
      console.error("Error durante el inicio de sesión:", error);
      setError(
        "Las credenciales son incorrectas. Por favor, intentá de nuevo."
      );
    }
  };

  // Enviar correo para crear/recuperar contraseña
  const handleSendPasswordReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setError("Se envió un correo para crear/recuperar la contraseña.");
      setShowResetOption(false);
    } catch (err: any) {
      console.error("Error enviando correo de restablecimiento:", err);
      setError("No fue posible enviar el correo de restablecimiento.");
    }
  };

  // Función para manejar el inicio de sesión con Google
  const handleGoogleSignIn = async () => {
    setError("");
    try {
      if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true") {
        await mockSignInWithPopup();
      } else {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
      }
      router.push("/home");
    } catch (error) {
      console.error("Error durante el inicio de sesión con Google:", error);
      setError("No se pudo iniciar sesión con Google.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-sm p-8 space-y-8 bg-gray-800 rounded-lg shadow-lg">
          <h1 className="text-5xl font-bold text-center text-blue-500">
            RefugiApp
          </h1>
          <h1 className="text-2xl font-bold text-center">Iniciar Sesión</h1>

          <form onSubmit={handleEmailPasswordSignIn} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-400"
              >
                Usuario (Email)
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ingresa tu usuario"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-400"
              >
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            {showResetOption && (
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={handleSendPasswordReset}
                  className="w-full py-2 mt-1 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700"
                >
                  Enviar correo para crear/recuperar contraseña
                </button>

                <button
                  onClick={handleGoogleSignIn}
                  className="w-full py-2 mt-1 text-sm font-semibold text-white bg-gray-700 rounded-lg hover:bg-gray-600 flex items-center justify-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                  >
                    <path
                      fill="#4285F4"
                      d="M21.35 11.1h-9.17v2.92h5.28c-.22 1.23-.9 2.27-1.9 2.97v2.47h3.07c1.8-1.66 2.88-4.12 2.88-7.36 0-.68-.07-1.34-.23-1.9z"
                    />
                    <path
                      fill="#34A853"
                      d="M12.18 21c2.6 0 4.78-.86 6.37-2.33l-3.07-2.47c-.85.57-1.94.9-3.3.9-2.54 0-4.69-1.72-5.46-4.04H3.46v2.53C5.04 19.98 8.36 21 12.18 21z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M6.72 13.06c-.2-.6-.32-1.24-.32-1.9s.12-1.3.32-1.9V6.73H3.46A9.98 9.98 0 003.46 12c0 1.6.36 3.12 1 4.52l2.26-3.46z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12.18 5.5c1.43 0 2.7.49 3.71 1.44l2.78-2.78C16.95 2.62 14.77 2 12.18 2 8.36 2 5.04 3.02 3.46 5.47l3.26 2.59C7.49 7.22 9.64 5.5 12.18 5.5z"
                    />
                  </svg>
                  Iniciar sesión con Google
                </button>

                <p className="text-xs text-gray-400 text-center">
                  También podés iniciar sesión con Google si preferís.
                </p>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
            >
              Iniciar Sesión
            </button>
          </form>

          <div className="relative flex items-center">
            <div className="flex-grow border-t border-gray-600"></div>
            <span className="flex-shrink mx-4 text-sm text-gray-400">O</span>
            <div className="flex-grow border-t border-gray-600"></div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 py-3 font-semibold bg-gray-700 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors"
          >
            <FcGoogle size={22} />
            Iniciar Sesión con Google
          </button>
          <div className="flex justify-center mt-6 mb-2">
            <label className="text-gray-400 text-sm">
              ¿No tienes una cuenta?
            </label>
          </div>
          <button
            onClick={() => router.push("/registro")}
            className="w-full mt-2 py-3 font-semibold text-white bg-gray-600 rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 transition-colors"
          >
            Registrarse
          </button>
        </div>
      </main>

      {/* Menú de navegación inferior (opcional, si lo necesitás en el login) */}
      {/* <footer className="w-full bg-gray-800 p-2">
        <nav className="flex justify-around text-xs text-gray-400">
          <a href="#" className="flex flex-col items-center gap-1 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1V11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 001 1z" /></svg>
            Inicio
          </a>
          <a href="#" className="flex flex-col items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            Registros
          </a>
          <a href="#" className="flex flex-col items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            Reportes
          </a>
        </nav>
      </footer> */}
    </div>
  );
}
