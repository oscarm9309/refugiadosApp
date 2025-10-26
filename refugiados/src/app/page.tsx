'use client'; // Directiva necesaria para usar hooks y eventos

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Importaciones de Firebase (servicios reales)
import { 
  GoogleAuthProvider, 
  signInWithPopup,
  signInWithEmailAndPassword // Importa la función para login con correo/contraseña
} from 'firebase/auth';
import { auth } from 'lib/firebase';

// Importaciones de simulación (servicios "mock")
import { mockSignInWithPopup } from 'lib/firebase.mock';

// Importa un ícono de Google para el botón
import { FcGoogle } from 'react-icons/fc';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Función para manejar el inicio de sesión con correo y contraseña
  const handleEmailPasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita que la página se recargue al enviar el formulario
    setError(''); // Limpia errores previos

    if (!email || !password) {
      setError('Por favor, ingresa tu correo y contraseña.');
      return;
    }

    try {
      if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
        console.log('Simulando inicio de sesión con correo y contraseña...');
        // Aquí podrías crear una función mock para este tipo de login si lo necesitaras
        await mockSignInWithPopup(); // Usamos el mock de Google como placeholder
      } else {
        console.log('Iniciando sesión con correo y contraseña...');
        await signInWithEmailAndPassword(auth, email, password);
      }
      router.push('/home');
    } catch (error: any) {
      console.error("Error durante el inicio de sesión:", error);
      setError('Las credenciales son incorrectas. Por favor, intentá de nuevo.');
    }
  };

  // Función para manejar el inicio de sesión con Google
  const handleGoogleSignIn = async () => {
    setError('');
    try {
      if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
        await mockSignInWithPopup();
      } else {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
      }
      router.push('/home');
    } catch (error) {
      console.error("Error durante el inicio de sesión con Google:", error);
      setError('No se pudo iniciar sesión con Google.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-sm p-8 space-y-8 bg-gray-800 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-center">Iniciar Sesión</h1>

          <form onSubmit={handleEmailPasswordSignIn} className="space-y-6">
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-400">
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
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-400">
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

            {error && <p className="text-sm text-red-500 text-center">{error}</p>}

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
        </div>
      </main>

      {/* Menú de navegación inferior (opcional, si lo necesitás en el login) */}
      <footer className="w-full bg-gray-800 p-2">
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
      </footer>
    </div>
  );
}