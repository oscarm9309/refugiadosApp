import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    // Estas rutas le dicen a Tailwind que busque clases en todos estos archivos
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Fuentes personalizadas: Inter para body y Montserrat para headings
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Arial', 'Helvetica', 'sans-serif'],
        heading: ['Montserrat', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;