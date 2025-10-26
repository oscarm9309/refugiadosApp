'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// --- CAMBIOS REALIZADOS AQUÍ ---
import { addHabitante } from 'lib/firebase';
import { mockAddHabitante } from 'lib/firestore.mock';
// --------------------------------

// Importa un ícono para el botón de "atrás"
import { FiArrowLeft } from 'react-icons/fi';

// Define la estructura de los datos del habitante
interface Habitante {
  nombreCompleto: string;
  alias: string;
  fechaNacimiento: string;
  sexo: string;
  nacionalidad: string;
  notas: string;
}

export default function RegistrarPage() {
  const router = useRouter();
  const [habitante, setHabitante] = useState<Habitante>({
    nombreCompleto: '',
    alias: '',
    fechaNacimiento: '',
    sexo: '',
    nacionalidad: '',
    notas: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Maneja los cambios en los inputs del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setHabitante(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Maneja el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
        await mockAddHabitante(habitante);
      } else {
        await addHabitante(habitante);
      }
      alert('Habitante registrado con éxito');
      router.push('/home'); // Redirige a la página de inicio
    } catch (err) {
      setError('Hubo un error al guardar el registro. Intentá de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white p-4">
      <header className="flex items-center mb-6">
        <button onClick={() => router.back()} className="p-2">
          <FiArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold mx-auto">Nuevo registro</h1>
      </header>

      <main className="flex-grow">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="nombreCompleto"
            value={habitante.nombreCompleto}
            onChange={handleChange}
            placeholder="Nombre completo"
            className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg"
            required
          />
          <input
            type="text"
            name="alias"
            value={habitante.alias}
            onChange={handleChange}
            placeholder="Alias"
            className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg"
          />
          <input
            type="date"
            name="fechaNacimiento"
            value={habitante.fechaNacimiento}
            onChange={handleChange}
            placeholder="Fecha de nacimiento"
            className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg"
            required
          />
          <input
            type="text"
            name="sexo"
            value={habitante.sexo}
            onChange={handleChange}
            placeholder="Sexo"
            className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg"
          />
          <input
            type="text"
            name="nacionalidad"
            value={habitante.nacionalidad}
            onChange={handleChange}
            placeholder="Nacionalidad"
            className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg"
          />
          <textarea
            name="notas"
            value={habitante.notas}
            onChange={handleChange}
            placeholder="Notas adicionales..."
            rows={5}
            className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg"
          ></textarea>

          {error && <p className="text-red-500 text-center">{error}</p>}
          
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}