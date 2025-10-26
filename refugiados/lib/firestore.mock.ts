// Este archivo simula las funciones de Firestore

// Datos falsos que nuestra base de datos simulada devolverá
const mockItems = [
  { id: '1', title: 'Elemento Falso 1', description: 'Esta es una descripción simulada.' },
  { id: '2', title: 'Elemento Falso 2', description: 'Viene de los datos mock.' },
  { id: '3', title: 'Elemento Falso 3', description: 'Perfecto para probar la UI.' },
];

// Simulación de onSnapshot para obtener los items
export const mockOnSnapshot = (callback: (data: any[]) => void) => {
  console.log(" MOCK: Obteniendo datos de la colección 'items'...");
  
  // Simulamos una carga instantánea de datos
  setTimeout(() => {
     callback(mockItems);
  }, 200);

  // Devolvemos una función de "desuscripción" vacía para imitar el comportamiento real
  return () => {
    console.log(" MOCK: Listener de Firestore detenido.");
  };
};

export const mockAddHabitante = (habitanteData: any) => {
  return new Promise<void>((resolve) => {
    console.log(" MOCK: Guardando nuevo habitante:", habitanteData);
    // Simulamos un retraso de red
    setTimeout(() => {
      console.log(" MOCK: ¡Habitante guardado con éxito!");
      resolve();
    }, 500);
  });
};