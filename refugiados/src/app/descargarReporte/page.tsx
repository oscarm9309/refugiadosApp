"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "lib/firebase";
import { collection, getDocs } from "firebase/firestore";

type Report = {
  id: string;
  title: string;
  createdAt: string;
  rows?: Record<string, any>[];
};

export default function DescargarReportePage() {
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Nuevo estado para el select de reportes
  const [selectedReport, setSelectedReport] = useState<string>("");

  useEffect(() => {
    fetchReports();
  }, []);

  async function fetchReports() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/reports", { cache: "no-store" });
      if (!res.ok) throw new Error("Error " + res.status);
      const data = await res.json();
      setReports(data || []);
    } catch (err: any) {
      // Si no existe endpoint /api/reports, no es crítico — permitimos usar el select para 'habitantes'
      setError(null);
    } finally {
      setLoading(false);
    }
  }

  async function downloadFromServer(
    reportId: string,
    filenameBase = "reporte"
  ) {
    try {
      const res = await fetch(
        `/api/reports/download?id=${encodeURIComponent(reportId)}`
      );
      if (!res.ok) throw new Error("Error al descargar desde el servidor");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      triggerBrowserDownload(
        url,
        `${filenameBase}.${getExtensionFromBlob(res)}`
      );
      URL.revokeObjectURL(url);
    } catch (err) {
      alert(
        "Fallo la descarga desde el servidor. Intenta exportar como CSV en el cliente."
      );
    }
  }

  // Nueva función: descarga los documentos de la colección 'habitantes' y los exporta a CSV
  async function downloadHabitantes() {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "habitantes"));
      const rows = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Record<string, any>),
      }));
      if (!rows || rows.length === 0) {
        alert("No se encontraron habitantes en la colección.");
        return;
      }
      const csv = jsonToCsv(rows);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      triggerBrowserDownload(url, `habitantes_${new Date().toISOString()}.csv`);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert(
        "Error al leer la colección 'habitantes' desde Firestore. Comprueba las reglas y la conexión."
      );
    } finally {
      setLoading(false);
    }
  }

  function getExtensionFromBlob(res: Response) {
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("pdf")) return "pdf";
    if (ct.includes("csv")) return "csv";
    if (ct.includes("json")) return "json";
    return "bin";
  }

  function triggerBrowserDownload(url: string, filename: string) {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  async function exportCsv(report: Report) {
    try {
      let dataRows = report.rows;
      if (!dataRows) {
        const res = await fetch(
          `/api/reports?id=${encodeURIComponent(report.id)}`
        );
        if (!res.ok) throw new Error("No se pudo obtener detalle del reporte");
        const obj = await res.json();
        dataRows = obj.rows || [];
      }
      if (!dataRows || dataRows.length === 0) {
        alert("El reporte no contiene filas para exportar.");
        return;
      }
      const csv = jsonToCsv(dataRows);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      triggerBrowserDownload(
        url,
        `${sanitizeFilename(report.title || "reporte")}.csv`
      );
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Error al generar CSV del reporte.");
    }
  }

  function sanitizeFilename(name: string) {
    return name.replace(/[^a-z0-9_\\-\\.]/gi, "_");
  }

  function jsonToCsv(rows: Record<string, any>[]) {
    const keySet = new Set<string>();
    rows.forEach((r) => Object.keys(r).forEach((k) => keySet.add(k)));
    const keys = Array.from(keySet);

    const escape = (v: any) => {
      if (v === null || v === undefined) return "";
      const s = String(v);
      if (s.includes('"') || s.includes(",") || s.includes("\\n"))
        return `"${s.replace(/"/g, '""')}"`;
      return s;
    };

    const header = keys.join(",");
    const lines = rows.map((r) => keys.map((k) => escape(r[k])).join(","));
    return [header, ...lines].join("\\n");
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6">
      <header className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-full hover:bg-gray-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h2 className="text-lg font-semibold">Reportes</h2>
      </header>

      <main className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Descargar reportes</h1>
        <p className="text-gray-400 mb-6">
          Selecciona el reporte que quieres descargar desde la base de datos.
        </p>

        <div className="flex gap-3 mb-4 items-center">
          <select
            value={selectedReport}
            onChange={(e) => setSelectedReport(e.target.value)}
            className="bg-gray-800 px-3 py-2 rounded-md"
          >
            <option value="">-- Selecciona un reporte --</option>
            <option value="habitantes">Reporte Habitantes</option>
            {/* Agrega más opciones aquí si hay otros reportes */}
          </select>

          <button
            onClick={async () => {
              if (!selectedReport)
                return alert("Selecciona primero un reporte.");
              if (selectedReport === "habitantes") {
                await downloadHabitantes();
              } else {
                alert("Reporte no soportado.");
              }
            }}
            className="px-3 py-2 bg-blue-600 rounded-md text-sm hover:bg-blue-500"
            disabled={loading}
          >
            Descargar seleccionado
          </button>

          <button
            onClick={fetchReports}
            disabled={loading}
            className="px-3 py-2 bg-gray-800 rounded-md text-sm hover:bg-gray-700 disabled:opacity-60"
          >
            Actualizar lista de reportes
          </button>
        </div>

        {loading && <div className="text-gray-400 mb-2">Cargando...</div>}
        {error && <div className="text-red-500 mb-2">{error}</div>}

        <hr className="border-gray-700 my-4" />

        <h2 className="text-lg font-semibold mb-2">Reportes disponibles</h2>
        <ul className="space-y-3">
          {reports.length === 0 ? (
            <li className="text-gray-500">
              No hay reportes desde /api/reports (puedes usar 'Reporte
              Habitantes').
            </li>
          ) : (
            reports.map((r) => (
              <li
                key={r.id}
                className="bg-gray-800 rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-700 rounded-md flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16h8M8 12h8M8 8h4"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold">{r.title || "Reporte"}</div>
                    <div className="text-gray-400 text-sm">
                      {new Date(r.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => exportCsv(r)}
                    className="text-sm px-3 py-2 bg-gray-700 rounded-md hover:bg-gray-600"
                  >
                    Exportar CSV
                  </button>
                  <button
                    onClick={() =>
                      downloadFromServer(r.id, r.title || "reporte")
                    }
                    className="p-2 rounded-md bg-gray-700 hover:bg-gray-600"
                    title="Descargar"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 3v12m0 0l-4-4m4 4l4-4M21 21H3"
                      />
                    </svg>
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </main>
    </div>
  );
}
