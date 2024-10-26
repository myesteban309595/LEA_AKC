import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField } from '@mui/material';

const SGMRC = () => {
  // Estado para la fecha y hora actual
  const [fechaHoraActual, setFechaHoraActual] = useState('');
  const [data, setData] = useState([]);
  const [editingCell, setEditingCell] = useState({ rowIndex: null, column: null });
  const [tempValue, setTempValue] = useState('');

  useEffect(() => {
    const mostrarFechaYHora = () => {
      const fechaActual = new Date();
      const opciones = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false,
      };
      const fechaFormateada = fechaActual.toLocaleString('es-ES', opciones);
      setFechaHoraActual(fechaFormateada);
    };

    mostrarFechaYHora();
    const intervalId = setInterval(mostrarFechaYHora, 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const initialData = Array.from({ length: 10 }, (_, index) => ({
      fechaSolicitud: `2024-10-0${index + 1}`,
      codigoInventario: `INV-${index + 1}`,
      col3: `Certipur® Buffer solution pH 6.00 (25°C). Certified Reference Material for pH measurement`,
      col4: `Fila ${index + 1} Col 4`,
      col5: `Fila ${index + 1} Col 5`,
      col6: `Fila ${index + 1} Col 6`,
      col7: `Fila ${index + 1} Col 7`,
      col8: `Fila ${index + 1} Col 8`,
      col9: `Fila ${index + 1} Col 9`,
      col10: `Fila ${index + 1} Col 10`,
      col11: `Fila ${index + 1} Col 11`,
      col12: `Fila ${index + 1} Col 12`,
      col13: `Fila ${index + 1} Col 13`,
      col14: `Fila ${index + 1} Col 14`,
      col15: `Fila ${index + 1} Col 15`,
      col16: `Fila ${index + 1} Col 16`,
      col17: `Fila ${index + 1} Col 17`,
      col18: `Fila ${index + 1} Col 18`,
    }));
    setData(initialData);
  }, []);

  const handleDoubleClick = (rowIndex, column) => {
    setEditingCell({ rowIndex, column });
    setTempValue(data[rowIndex][column]);
  };

  const handleChange = (event) => {
    setTempValue(event.target.value);
  };

  const handleBlur = () => {
    const newData = [...data];
    newData[editingCell.rowIndex][editingCell.column] = tempValue;
    setData(newData);
    setEditingCell({ rowIndex: null, column: null });
  };

  return (
    <TableContainer component={Paper}>
      <Table style={{ width: 'max-content' }}>
        <TableHead>
          <TableRow>
            <TableCell colSpan={4} style={{ fontSize: '25px', fontWeight: 'bold' }}>
              <div>{fechaHoraActual}</div>
            </TableCell>
          </TableRow>
          <TableRow style={{ background: "#82ccdd" }}>
            <TableCell colSpan={18} style={{ fontSize: '18px', textAlign: 'center', fontWeight: 'bold', border: '3px solid rgba(224, 224, 224, 1)' }}>
              Seguimiento General Material de referencia
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2} style={{ background: "#78e08f", textAlign: 'center', fontWeight: 'bold', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>
              Seguimiento inventario
            </TableCell>
            <TableCell colSpan={4} style={{ background: "#eabbfa", textAlign: 'center', fontWeight: 'bold', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>
              Identificacion del MR O MRC
            </TableCell>
            <TableCell colSpan={5} style={{ background: "#fbfc92", textAlign: 'center', fontWeight: 'bold', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>
              Seguimiento a su uso
            </TableCell>
            <TableCell colSpan={5} style={{ background: "#b8b3fc", textAlign: 'center', fontWeight: 'bold', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>
              Condiciones especiales de manipulacion y almacenamiento
            </TableCell>
            <TableCell colSpan={2} style={{ background: "#c5fcc5", textAlign: 'center', fontWeight: 'bold', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>
              Seguimiento Consumo
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={{ background: "#bbfad1", width: '200px', textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)', position: 'sticky', top: 0 }}>Fecha Solicitud</TableCell>
            <TableCell style={{ background: "#bbfad1", width: '150px', textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>Código de inventario</TableCell>
            <TableCell style={{ background: "#f5d9ff", textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>Nombre</TableCell>
            <TableCell style={{ background: "#f5d9ff", textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>Marca</TableCell>
            <TableCell style={{ background: "#f5d9ff", textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>No. Lote</TableCell>
            <TableCell style={{ background: "#f5d9ff", textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>TIPO</TableCell>
            <TableCell style={{ background: "#feffcf", textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>AREA</TableCell>
            <TableCell style={{ background: "#feffcf", textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>Fecha de ingreso al laboratorio</TableCell>
            <TableCell style={{ background: "#feffcf", textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>Fecha de vencimiento</TableCell>
            <TableCell style={{ background: "#feffcf", textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>Fecha actualización de la información</TableCell>
            <TableCell style={{ background: "#feffcf", textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>Cantidad de ingreso</TableCell>
            <TableCell style={{ background: "#c9c5fc", textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>Consideración de la manipulación</TableCell>
            <TableCell style={{ background: "#c9c5fc", textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>Almacenamiento</TableCell>
            <TableCell style={{ background: "#c9c5fc", textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>Certificado de análisis</TableCell>
            <TableCell style={{ background: "#c9c5fc", textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>Responsable de la manipulación</TableCell>
            <TableCell style={{ background: "#c9c5fc", textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>Observaciones</TableCell>
            <TableCell style={{ background: "#d9ffd9", textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>Vencimiento</TableCell>
            <TableCell style={{ background: "#d9ffd9", textAlign: 'center', borderRight: '1px solid rgba(224, 224, 224, 1)' }}>Fecha actual</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {Object.keys(row).map((column, colIndex) => (
                <TableCell
                  key={colIndex}
                  style={{ textAlign: 'center' }}
                  onDoubleClick={() => handleDoubleClick(rowIndex, column)}
                >
                  {editingCell.rowIndex === rowIndex && editingCell.column === column ? (
                    <TextField
                      value={tempValue}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoFocus
                    />
                  ) : (
                    row[column]
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SGMRC;
