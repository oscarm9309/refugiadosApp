// Este archivo simula las funciones de autenticación de Firebase

// Un objeto de usuario falso para simular una sesión iniciada
const fakeUser = {
  uid: 'mock-user-123',
  email: 'test@example.com',
  displayName: 'Test User',
  photoURL: 'https://via.placeholder.com/150',
};

// Simulación de signInWithPopup
export const mockSignInWithPopup = () => {
  return new Promise((resolve) => {
    console.log(" MOCK: Simulando inicio de sesión con Google...");
    // Simulamos un retraso de red de 0.5 segundos
    setTimeout(() => {
      console.log(" MOCK: ¡Usuario autenticado!");
      resolve({ user: fakeUser });
    }, 500);
  });
};

// Simulación de signOut
export const mockSignOut = () => {
  return new Promise<void>((resolve) => {
    console.log(" MOCK: Simulando cierre de sesión...");
    setTimeout(() => {
      console.log(" MOCK: ¡Sesión cerrada!");
      resolve();
    }, 300);
  });
};