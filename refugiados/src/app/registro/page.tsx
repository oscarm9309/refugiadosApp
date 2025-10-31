"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { auth } from "lib/firebase";
import { FcGoogle } from "react-icons/fc";

export default function RegistroPage() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGoogle = async () => {
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/home");
    } catch (err: any) {
      console.error(err);
      setError("No se pudo iniciar sesión con Google.");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Ingresa email y contraseña.");
      return;
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      // Evitar conflictos con provider distinto (p.ej. creado por Google)
      const methods: string[] = await fetchSignInMethodsForEmail(
        auth,
        email
      ).catch(() => [] as string[]);
      if (methods.includes("google.com") && !methods.includes("password")) {
        setError(
          "Esta cuenta ya existe con Google. Iniciá sesión con Google o usá la opción de 'Iniciar con Google'."
        );
        setLoading(false);
        return;
      }

      const res = await createUserWithEmailAndPassword(auth, email, password);
      if (nombre.trim()) {
        try {
          await updateProfile(res.user, { displayName: nombre });
        } catch (e) {
          console.warn("No se pudo setear displayName:", e);
        }
      }
      router.push("/home");
    } catch (err: any) {
      console.error("Error creando usuario:", err);
      setError(err?.message || "No se pudo crear el usuario.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow">
        <h1 className="text-3xl font-bold text-center mb-4">Crear cuenta</h1>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre completo (opcional)"
            className="w-full p-3 bg-gray-700 rounded"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo electrónico"
            className="w-full p-3 bg-gray-700 rounded"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            className="w-full p-3 bg-gray-700 rounded"
            required
          />
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Confirmar contraseña"
            className="w-full p-3 bg-gray-700 rounded"
            required
          />

          {error && <div className="text-red-400 text-sm">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 rounded font-semibold hover:bg-blue-500 disabled:opacity-60"
          >
            {loading ? "Creando..." : "Crear cuenta"}
          </button>
        </form>

        <div className="my-4 flex items-center">
          <div className="flex-grow border-t border-gray-700"></div>
          <span className="mx-3 text-gray-400">O</span>
          <div className="flex-grow border-t border-gray-700"></div>
        </div>

        <button
          onClick={handleGoogle}
          className="w-full py-3 bg-gray-700 rounded flex items-center justify-center gap-3 hover:bg-gray-600"
        >
          <FcGoogle size={20} />
          Crear cuenta con Google
        </button>

        <p className="text-center text-sm text-gray-400 mt-4">
          ¿Ya tenés cuenta?{" "}
          <button
            onClick={() => router.push("/")}
            className="text-blue-400 underline"
          >
            Iniciar sesión
          </button>
        </p>
      </div>
    </div>
  );
}
