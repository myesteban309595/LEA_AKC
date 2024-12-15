import React, { useState, useEffect, useRef } from 'react';

// Tu código existente aquí...

const CodificacionDeColoresComponent = React.memo(() => {
  // Resto de tu estado y funciones...

  // Estado para el número de columna
  const [ColumValue, setColumValue] = useState();

  // Ref para el TableBody
  const tableBodyRef = useRef(null);

  const clickColumFixed = (columnClicked) => {
    if (columnClicked === ColumValue) {
      setColumValue(100000); // se fija un valor de columna que nunca vaya a existir
    } else {
      setColumValue(columnClicked); // se fija el valor de columna que fue clickeada
    }
  };

  useEffect(() => {
    // Función para detectar clics fuera del TableBody
    const handleClickOutside = (event) => {
      if (tableBodyRef.current && !tableBodyRef.current.contains(event.target)) {
        clickColumFixed(100000); // Fijar la columna en 100000 (valor que nunca existirá)
      }
    };

    // Añadir el event listener para clics en el documento
    document.addEventListener('mousedown', handleClickOutside);

    // Limpiar el event listener cuando el componente se desmonte
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ColumValue]);

  return (
    <TableContainer component={Paper} style={{ height: '100vh', overflow: 'auto' }}>
      <Table style={{ width: '100%' }}>
        <TableHead>
          {/* Tu código para el encabezado de la tabla */}
        </TableHead>
        
        <TableBody ref={tableBodyRef}>
          {
            loading ? (
              <TableRow>
                <TableCell
                  colSpan={Object.keys(data[0] || {}).length}
                  sx={{
                    marginLeft: "600px",
                    textAlign: 'center',
                    padding: 3,
                    height: '50vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <CircularProgress size={150} />
                </TableCell>
              </TableRow>
            ) : (
              Array.isArray(data) && data.length > 0 ? (
                data.map((row, rowIndex) => {
                  const filteredRow = filterData(row); // Filtrar la fila
                  const backgroundColor = "transparent"
                  const color = "black"

                  return (
                    <TableRow key={rowIndex}>
                      {Object.keys(filteredRow).map((column, colIndex) => (
                        <TableCell
                          key={colIndex}
                          sx={{
                            textAlign: 'center',
                            fontSize: "14px",
                            background: colIndex === 6 
                            ? colorMapping[filteredRow[column].replace(/\s+/g, '').toUpperCase()] 
                            : backgroundColor,                    
                            color: color, 
                          }}
                          onClick={() => handleDoubleClick(rowIndex, column)}
                        >
                          {editingCell.rowIndex === rowIndex && editingCell.column === column && colIndex !== 7 ? (
                            <TextField
                              sx={{
                                width: '100%',
                                height: '42px',
                                padding: 0,
                                margin: 0,
                                borderRadius: "1px",
                                backgroundColor: '#f9fcfe',
                                textAlign: 'center',
                                fontSize: '15px',
                                lineHeight: "normal",
                                border: 'none',
                                '& .MuiInputBase-input': {
                                  height: '42px',
                                  padding: '0px',
                                  fontSize: '15px',
                                  textAlign: 'center',
                                },
                              }}
                              value={tempValue}
                              onChange={handleChange}
                              onBlur={() => handleBlur()}
                              onKeyDown={handleKeyDown}
                            />
                          ) : colIndex === 7 ? (
                            <IconButton
                              style={{ outline: "none", color: "#fc5a4e" }}
                              onClick={() => deleteRowData(row._id)}
                            >
                              <HighlightOffIcon />
                            </IconButton>
                          ) : (
                            filteredRow[column]
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={Object.keys(data[0] || {}).length} sx={{ textAlign: 'center' }}>
                    No data available
                  </TableCell>
                </TableRow>
              )
            )
          }
        </TableBody>
      </Table>
      
      {/* El resto de tu código (Snackbar, modales, etc.) */}
    </TableContainer>
  );
});

export default CodificacionDeColoresComponent;
import React, { useState, useEffect, useRef } from 'react';

// Tu código existente aquí...

const CodificacionDeColoresComponent = React.memo(() => {
  // Resto de tu estado y funciones...

  // Estado para el número de columna
  const [ColumValue, setColumValue] = useState();

  // Ref para el TableBody
  const tableBodyRef = useRef(null);

  const clickColumFixed = (columnClicked) => {
    if (columnClicked === ColumValue) {
      setColumValue(100000); // se fija un valor de columna que nunca vaya a existir
    } else {
      setColumValue(columnClicked); // se fija el valor de columna que fue clickeada
    }
  };

  useEffect(() => {
    // Función para detectar clics fuera del TableBody
    const handleClickOutside = (event) => {
      if (tableBodyRef.current && !tableBodyRef.current.contains(event.target)) {
        clickColumFixed(100000); // Fijar la columna en 100000 (valor que nunca existirá)
      }
    };

    // Añadir el event listener para clics en el documento
    document.addEventListener('mousedown', handleClickOutside);

    // Limpiar el event listener cuando el componente se desmonte
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ColumValue]);

  return (
    <TableContainer component={Paper} style={{ height: '100vh', overflow: 'auto' }}>
      <Table style={{ width: '100%' }}>
        <TableHead>
          {/* Tu código para el encabezado de la tabla */}
        </TableHead>
        
        <TableBody ref={tableBodyRef}>
          {
            loading ? (
              <TableRow>
                <TableCell
                  colSpan={Object.keys(data[0] || {}).length}
                  sx={{
                    marginLeft: "600px",
                    textAlign: 'center',
                    padding: 3,
                    height: '50vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <CircularProgress size={150} />
                </TableCell>
              </TableRow>
            ) : (
              Array.isArray(data) && data.length > 0 ? (
                data.map((row, rowIndex) => {
                  const filteredRow = filterData(row); // Filtrar la fila
                  const backgroundColor = "transparent"
                  const color = "black"

                  return (
                    <TableRow key={rowIndex}>
                      {Object.keys(filteredRow).map((column, colIndex) => (
                        <TableCell
                          key={colIndex}
                          sx={{
                            textAlign: 'center',
                            fontSize: "14px",
                            background: colIndex === 6 
                            ? colorMapping[filteredRow[column].replace(/\s+/g, '').toUpperCase()] 
                            : backgroundColor,                    
                            color: color, 
                          }}
                          onClick={() => handleDoubleClick(rowIndex, column)}
                        >
                          {editingCell.rowIndex === rowIndex && editingCell.column === column && colIndex !== 7 ? (
                            <TextField
                              sx={{
                                width: '100%',
                                height: '42px',
                                padding: 0,
                                margin: 0,
                                borderRadius: "1px",
                                backgroundColor: '#f9fcfe',
                                textAlign: 'center',
                                fontSize: '15px',
                                lineHeight: "normal",
                                border: 'none',
                                '& .MuiInputBase-input': {
                                  height: '42px',
                                  padding: '0px',
                                  fontSize: '15px',
                                  textAlign: 'center',
                                },
                              }}
                              value={tempValue}
                              onChange={handleChange}
                              onBlur={() => handleBlur()}
                              onKeyDown={handleKeyDown}
                            />
                          ) : colIndex === 7 ? (
                            <IconButton
                              style={{ outline: "none", color: "#fc5a4e" }}
                              onClick={() => deleteRowData(row._id)}
                            >
                              <HighlightOffIcon />
                            </IconButton>
                          ) : (
                            filteredRow[column]
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={Object.keys(data[0] || {}).length} sx={{ textAlign: 'center' }}>
                    No data available
                  </TableCell>
                </TableRow>
              )
            )
          }
        </TableBody>
      </Table>
      
      {/* El resto de tu código (Snackbar, modales, etc.) */}
    </TableContainer>
  );
});

export default CodificacionDeColoresComponent;
