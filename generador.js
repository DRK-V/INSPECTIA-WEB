
  const API_KEY = "AIzaSyBqUaK5uLKOb0DXV0JjQGFPwkTeYWURXVE";
  const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
  const resultsBody = document.getElementById('results-body');
  const inputTableDiv = document.getElementById('input-table');
  const downloadBtn = document.getElementById('download-btn');

  const testData = [];

  document.getElementById('excel-file').addEventListener('change', handleFile);
  downloadBtn.addEventListener('click', downloadExcel);

  async function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    resultsBody.innerHTML = '';
    testData.length = 0;

    const reader = new FileReader();
    reader.onload = async function (e) {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      //let inputHTML = `<table><tr><th>Historia #</th><th>ID (Col A)</th><th>Col D</th><th>Col F</th></tr>`;
      //for (let i = 1; i < json.length; i++) {
      //  const row = json[i];
      //  const id = row[0];
       // const colD = row[3];
       //const colF = row[5];
       // if (id || colD || colF) {
        // inputHTML += `<tr><td>${i}</td><td>${id || ''}</td><td>${colD || ''}</td><td>${colF || ''}</td></tr>`;
       // }
     // }
     // inputHTML += `</table>`;
     // inputTableDiv.innerHTML = inputHTML;

      for (let i = 1; i < json.length; i++) {
        const row = json[i];
        const id = row[0];
        const colD = row[3];
        const colF = row[5];
        if (!id || (!colD && !colF)) continue;

        const historiaUsuario = `Como ${colD || ''}, quiero ${colF || ''}`;
        const prompt = `
Dada la siguiente historia de usuario:

"${historiaUsuario}"

Genera uno o más casos de prueba en una tabla con los siguientes campos separados por "|":
Resumen | Descripción de los Pasos de prueba | Resultados Esperados | Tipo de Prueba | Importancia del caso | Rol

No incluyas encabezado. Solo responde con las filas.`;

        try {
          const body = {
            contents: [{ parts: [{ text: prompt }] }]
          };

          const res = await fetch(ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
          });

          const data = await res.json();
          const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
          const lines = responseText.split('\n').filter(l => l.trim() && l.includes('|'));

          lines.forEach(line => {
            const parts = line.split('|').map(p => p.trim());
            if (parts.length >= 6) {
              const [resumen, pasos, esperado, tipo, importancia, rol] = parts;
              const testId = id;
              const datos = id;

              resultsBody.insertAdjacentHTML('beforeend', `
                <tr>
                  <td>${testId}</td>
                  <td>${resumen}</td>
                  <td><pre>${pasos}</pre></td>
                  <td>${datos}</td>
                  <td>${esperado}</td>
                  <td>${tipo}</td>
                  <td>${importancia}</td>
                  <td>${rol}</td>
                </tr>
              `);

              testData.push({
                "ID del Caso de Prueba": testId,
                "Resumen": resumen,
                "Descripción de los Pasos de prueba": pasos,
                "Datos de prueba": datos,
                "Resultados Esperados": esperado,
                "Tipo de Prueba": tipo,
                "Importancia del caso": importancia,
                "Rol": rol,
                "Resultado de prueba": "Pendiente",
                "Observaciones de pruebas": "",
                "Enlace de la tarea BACK": "",
                "Enlace de la tarea FRONT": ""
              });
            }
          });

        } catch (error) {
          resultsBody.insertAdjacentHTML('beforeend', `<tr><td colspan="8">Error procesando fila ${i}</td></tr>`);
        }
      }

      downloadBtn.style.display = 'inline-block';
    };

    reader.readAsArrayBuffer(file);
  }

  function downloadExcel() {
  const wb = XLSX.utils.book_new();

  // Datos del encabezado
  const headers = [
    "ID del Caso de Prueba", "Resumen", "Descripción de los Pasos de prueba", "Datos de prueba", "Resultados Esperados",
    "Tipo de Prueba", "Importancia del caso", "Rol",
    "Resultado de prueba", "Observaciones de pruebas", "Enlace de la tarea BACK", "Enlace de la tarea FRONT"
  ];

  // Insertamos una fila vacía para el título
  const sheetData = [
    [], // Fila 0
    headers // Fila 1
  ];

  // Insertamos los datos
  testData.forEach(row => {
    sheetData.push(headers.map(h => row[h] || ""));
  });

  const ws = XLSX.utils.aoa_to_sheet(sheetData);

  // Estilos generales
  const range = XLSX.utils.decode_range(ws['!ref']);

  // Estilo para título principal
  const titleCell = ws["A1"];
  ws["A1"] = { t: "s", v: "MATRIZ DE CASOS DE PRUEBA - Novek", s: {
    font: { bold: true, sz: 14 },
    alignment: { horizontal: "center", vertical: "center" },
    fill: { fgColor: { rgb: "A6CE39" } }
  }};
  // Merge de celdas para el título
  ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } }];

  // Estilo para encabezados
  headers.forEach((_, colIndex) => {
    const cellRef = XLSX.utils.encode_cell({ r: 1, c: colIndex });
    if (ws[cellRef]) {
      ws[cellRef].s = {
        font: { bold: true },
        alignment: { horizontal: "center", vertical: "center", wrapText: true },
        fill: { fgColor: { rgb: "A6CE39" } },
        border: {
          top: { style: "thin", color: { auto: 1 } },
          bottom: { style: "thin", color: { auto: 1 } },
          left: { style: "thin", color: { auto: 1 } },
          right: { style: "thin", color: { auto: 1 } }
        }
      };
    }
  });

  // Ajustar ancho automático
  const colWidths = headers.map((h, i) => {
    let maxLen = h.length;
    testData.forEach(row => {
      const value = row[headers[i]];
      if (value && value.length > maxLen) maxLen = value.length;
    });
    return { wch: maxLen + 2 };
  });
  ws['!cols'] = colWidths;

  XLSX.utils.book_append_sheet(wb, ws, "Casos de Prueba");
  XLSX.writeFile(wb, "Casos_de_Prueba_Generados.xlsx", { cellStyles: true });
}


