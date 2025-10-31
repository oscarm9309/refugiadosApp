"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const prev = useRef<string | null>(null);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    // Al montar por primera vez prev.current es null -> inicializamos
    if (prev.current === null) {
      prev.current = pathname;
      return;
    }

    if (prev.current !== pathname) {
      // activa animación breve
      setAnimating(true);
      const t = setTimeout(() => setAnimating(false), 700); // duración de la animación
      prev.current = pathname;
      return () => clearTimeout(t);
    }
  }, [pathname]);

  return (
    <div className="relative">
      {children}

      {animating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-blue-400 animate-dot-delay-0" />
              <span className="w-3 h-3 rounded-full bg-green-400 animate-dot-delay-1" />
              <span className="w-3 h-3 rounded-full bg-pink-400 animate-dot-delay-2" />
            </div>
            <div className="mt-4 text-white text-sm">Cargando...</div>
          </div>
        </div>
      )}
    </div>
  );
}
