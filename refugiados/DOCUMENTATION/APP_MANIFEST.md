# Manifiesto de la aplicación — RefugiApp

Este documento resume la configuración de la aplicación, la arquitectura general y los servicios de Google/Firebase usados (Autenticación, Base de datos, Hosting y API). Está pensado para documentación técnica y para que el equipo de despliegue comprenda dependencias, reglas y comandos necesarios.

## 1. Resumen del proyecto

- Nombre: RefugiApp
- Tecnologías principales: Next.js (App Router), React, Tailwind CSS, Firebase (Auth, Firestore, Hosting / App Hosting), Firebase SDK v9 (modular)
- Propósito: Aplicación web para registrar y gestionar información de habitantes de la calle y generar/descargar reportes en CSV.

## 2. Estructura de la aplicación (alta nivel)

- `src/app/` — Rutas y componentes de la aplicación (login, registro, home, descargarReporte, etc.).
- `lib/firebase.ts` — Inicialización de Firebase (exporta `auth` y `db`).
- `src/app/descargarReporte` — Vista que lista reportes desde Firestore (`reportes`) y/o exporta colecciones (por ejemplo `habitantes`).
- `src/app/registro` — Formulario de registro (email/password y Google Sign-In).
- `DOCUMENTATION/APP_MANIFEST.md` — Este documento.
- `apphosting.yaml` — Configuración de App Hosting (Cloud Run) — runConfig y env/secrets.
- `firebase.json` — Configuración de firebase; en este repo incluye sección `apphosting`.

## 3. Servicios Firebase usados

### 3.1 Autenticación (Firebase Authentication)

- Providers habilitados en la app: Google Sign-In y Email/Password.
- Uso dentro de la app:
  - `signInWithPopup(auth, new GoogleAuthProvider())` para login con Google.
  - `createUserWithEmailAndPassword` y `signInWithEmailAndPassword` para email/password.
  - `sendPasswordResetEmail` para que usuarios creen/recuperen contraseña.

Recomendaciones de seguridad: habilitar verificación de correo en producción y usar reglas de Firestore que limiten lecturas/escrituras a usuarios autenticados o roles específicos.

### 3.2 Base de datos (Cloud Firestore)

- Colecciones usadas (convenio actual del proyecto):

  - `habitantes` — documentos con datos de cada habitante (usado para exportar CSV).
  - `reportes` — documentos que describen reportes disponibles (title, collection, createdAt, description). La vista `descargarReporte` consulta `reportes` y muestra opciones; si `reportes` está vacío hace fallback buscando colecciones conocidas (p.ej. `habitantes`).

- Acceso desde cliente: la app realiza lecturas con `getDocs()` y querys (p. ej. `orderBy('createdAt', 'desc')`). Por ello las reglas de seguridad deben permitir lectura según la política deseada (ver sección 6).

### 3.3 Hosting / App Hosting

- `firebase.json` contiene la sección `apphosting`, por lo que este proyecto está configurado para desplegar usando Firebase App Hosting que puede crear/usar backends en Cloud Run.
- `apphosting.yaml` controla ajustes de Cloud Run (por ejemplo `runConfig.minInstances`) y permite declarar `env` y `secret` bindings para variables de entorno y secretos en Secret Manager.

### 3.4 API / Endpoints

- Diseño actual: la app usa lecturas directas a Firestore desde el cliente para los reportes y descargas (no se requiere un endpoint backend para CSV; la generación se hace en el cliente). Existe soporte para descargar archivos generados desde un endpoint (`/api/reports/download`) si se implementa en el servidor; revisar `src/app/descargarReporte/page.tsx` para lógica de fallback `downloadFromServer`.
- Si planeas grandes volúmenes de datos o controles de acceso más estrictos, recomendamos implementar un endpoint server-side (Cloud Function o Cloud Run) que haga la exportación y entregue el CSV — así se evita cargar grandes volúmenes en el navegador.

## 4. Configuración importante en el repo

- `lib/firebase.ts` — contiene el `firebaseConfig` (apiKey, authDomain, projectId, etc.). Asegúrate de que coincida con el proyecto Firebase usado para despliegue.
- `apphosting.yaml` — (raíz) controla Cloud Run (ejemplo actual en repo: `minInstances: 0`). Puedes añadir variables de entorno:

## 5. Reglas de seguridad (ejemplos)

### Firestore — regla de ejemplo (lectura solo para usuarios autenticados)

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /reportes/{docId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    match /habitantes/{docId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

Notas: adapta las reglas según la política del proyecto. Para pruebas locales puedes usar `allow read: if true;` temporalmente pero no mantenerlo en producción.

## 6. Variables de entorno y secretos

- Para build y runtime, cualquier `NEXT_PUBLIC_*` debe definirse en GitHub Secrets (y se inyecta en el paso de `Build` del workflow) o en `.env.local` para desarrollo local.
- Para secretos de runtime (p. ej. claves de terceros), usa Google Secret Manager y referencia en `apphosting.yaml`.

## 7. Pipeline CI/CD y comandos de despliegue (resumen)

- Comandos para deploy manual (PowerShell / Windows):

```powershell
npx firebase-tools login
npm ci
npm run build
npx firebase-tools deploy --project YOUR_PROJECT_ID
```

- Deploy preview channel (temporal):

```powershell
npx firebase-tools hosting:channel:deploy preview-branch-name --project YOUR_PROJECT_ID
```

## 8. Referencias rápidas

- Archivos clave en el repo:

  - `lib/firebase.ts` — inicialización Firebase
  - `firebase.json` — configuración de despliegue
  - `apphosting.yaml` — configuración Cloud Run / App Hosting
  - `src/app/descargarReporte/page.tsx` — lógica de reportes/descarga

- Documentación de Firebase:
  - Auth: https://firebase.google.com/docs/auth
  - Firestore rules: https://firebase.google.com/docs/firestore/security/get-started
  - App Hosting & Cloud Run: https://firebase.google.com/docs/app-hosting/
