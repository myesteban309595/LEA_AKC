import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Select, MenuItem, InputLabel, FormControl, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const ModalFilterData = ({ isOpen, onClose, data }) => {
  // Estado para almacenar la variable seleccionada y el valor del input
  const [selectedVariable, setSelectedVariable] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [availableKeys, setAvailableKeys] = useState([]);

  // Extracción de las keys del primer objeto (ignorando las keys no deseadas)
  useEffect(() => {
    if (data.length > 0) {
      // Tomamos las keys del primer objeto y las filtramos
      const keys = Object.keys(data[0]).filter(
        (key) =>
          key !== '_id' && key !== 'createdAt' && key !== 'updatedAt' && key !== 'Accion' && key !== '__v'
      );
      setAvailableKeys(keys);
      setFilteredData(data); // Inicializamos el filtro con toda la data
    }
  }, [data]);

  // Manejar el cambio en el select
  const handleSelectChange = (event) => {
    setSelectedVariable(event.target.value);
  };

  // Manejar el cambio en el input
  const handleInputChange = (event) => {
    setFilterValue(event.target.value);
  };

  // Aplicar filtro según la variable seleccionada y el input
  const applyFilter = () => {
    if (selectedVariable && filterValue) {
      const filtered = data.filter((item) =>
        item[selectedVariable]?.toString().includes(filterValue)
      );
      setFilteredData(filtered);
    }
  };

  // Mostrar toda la data sin aplicar filtro
  const showAllData = () => {
    setSelectedVariable('');
    setFilterValue('');
    setFilteredData(data); // Deshacer el filtro y mostrar todos los datos
  };

  // Función para eliminar un item de la lista
  const deleteItem = (index) => {
    const newData = [...filteredData];
    newData.splice(index, 1); // Elimina el item en el índice específico
    setFilteredData(newData); // Actualiza el estado con los datos filtrados restantes
  };

  // Función para renderizar la información de cada item de manera organizada
  const renderItem = (item, index) => {
    return (
      <div key={index} style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '8px' }}>
          {availableKeys.map((key) => (
            <div key={key} style={{ marginBottom: '8px' }}>
              <strong>{key}:</strong> {item[key] || 'No disponible'}
            </div>
          ))}
        </div>
        
        {/* Botón de eliminar debajo de cada item */}
        <div style={{ textAlign: 'right', marginTop: '10px' }}>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => deleteItem(index)} // Eliminar el item actual
          >
            Eliminar
          </Button>
          {/* Línea separadora entre items */}

         <hr style={{ margin: '20px 0', borderColor: '#e0e0e0', borderWidth: '1px' }} />
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle sx={{ textAlign: 'center' }}>Filtrar Data</DialogTitle>
      <DialogContent>
        {/* Select para elegir la variable */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Selecciona una variable</InputLabel>
          <Select
            value={selectedVariable}
            onChange={handleSelectChange}
            label="Selecciona una variable"
          >
            {/* Renderizar las keys como opciones en el select */}
            {availableKeys.map((key) => (
              <MenuItem key={key} value={key}>
                {key}
              </MenuItem>
            ))}
            {/* Opción para mostrar toda la data */}
            <MenuItem value="allData">All Data</MenuItem>
          </Select>
        </FormControl>

        {/* Input para buscar y filtrar */}
        <TextField
          fullWidth
          label="Filtrar por"
          variant="outlined"
          value={filterValue}
          onChange={handleInputChange}
          margin="normal"
          placeholder="Escribe para filtrar..."
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={applyFilter}
          sx={{ marginTop: 2 }}
        >
          Aplicar Filtro
        </Button>

        {/* Mostrar los resultados filtrados */}
        <div style={{ marginTop: 20 }}>
          <h3>Datos filtrados:</h3>
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => renderItem(item, index))
          ) : (
            <p>No hay datos que coincidan</p>
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cerrar
        </Button>
        {/* Botón para mostrar toda la data */}
        <Button onClick={showAllData} color="default">
          Ver toda la data
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalFilterData;
