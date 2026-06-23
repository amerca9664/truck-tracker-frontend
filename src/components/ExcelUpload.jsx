import { useState, useRef } from 'react';
import Swal from 'sweetalert2';
import { uploadExcel } from '../services/api';

export default function ExcelUpload({ onUploadComplete }) {
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;

    const validExtensions = ['.xlsx', '.xls', '.csv'];
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

    if (!validExtensions.includes(ext)) {
      Swal.fire('Formato invalido', 'Solo se permiten archivos Excel (.xlsx, .xls) o CSV', 'error');
      return;
    }

    setLoading(true);
    try {
      const result = await uploadExcel(file);

      const { filasValidas, filasConError, lotesCreados, errores } = result.data;

      if (filasConError > 0 && filasValidas === 0) {
        Swal.fire({
          title: 'Error de validacion',
          html: `<p>Todas las filas tienen errores:</p><ul class="text-left text-sm mt-2 max-h-40 overflow-y-auto">${errores.map((e) => `<li>${e}</li>`).join('')}</ul>`,
          icon: 'error',
        });
      } else {
        let message = `<strong>${filasValidas}</strong> filas encoladas en <strong>${lotesCreados}</strong> lotes`;
        if (filasConError > 0) {
          message += `<br/><br/><span class="text-amber-600">${filasConError} filas con errores ignoradas</span>`;
        }
        Swal.fire({
          title: 'Archivo procesado',
          html: message,
          icon: filasConError > 0 ? 'warning' : 'success',
        });
      }

      if (onUploadComplete) onUploadComplete();
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleChange = (e) => {
    handleFile(e.target.files?.[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
        dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={handleChange}
        className="hidden"
        id="excel-upload"
        aria-label="Seleccionar archivo Excel"
      />

      <label htmlFor="excel-upload" className="cursor-pointer">
        <div className="text-gray-500">
          <svg className="mx-auto h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          {loading ? (
            <p className="text-sm text-blue-600 font-medium">Procesando archivo...</p>
          ) : (
            <>
              <p className="text-sm font-medium text-gray-700">
                Arrastra un archivo Excel aqui o haz click para seleccionar
              </p>
              <p className="text-xs text-gray-400 mt-1">.xlsx, .xls o .csv (max 10MB)</p>
            </>
          )}
        </div>
      </label>
    </div>
  );
}
