import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2'
import axios from 'axios';

const ModalFilterData = ({ isOpen, onClose, data, module }) => {
  const [selectedVariable, setSelectedVariable] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [availableKeys, setAvailableKeys] = useState([]);
  const [openModal, setOpenModal] = useState(isOpen); // Estado para manejar la visibilidad del modal

  useEffect(() => {
    if (data.length > 0) {
      const keys = Object.keys(data[0]).filter(
        (key) => key !== '_id' && key !== 'createdAt' && key !== 'updatedAt' && key !== 'Accion' && key !== '__v'
      );
      setAvailableKeys(keys);
      setFilteredData(data); // Inicializamos el filtro con toda la data
    }
  }, [data]);

  // Función para eliminar un item de la base de datos
  const deleteItem = async (rowId) => {
    console.log("ejecutando deleteItem id:", rowId);

    const UrlRequest = module == "dataTableColor" ? "tableColors/dataColors" : "table/data"
    // Primero, cerramos temporalmente el modal antes de mostrar el Swal
    setOpenModal(false);

    // Mostramos una alerta de confirmación utilizando SweetAlert
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        // Realizamos la eliminación del item
        axios.delete(`https://sgmrcbackend-production.up.railway.app/api/${UrlRequest}/${rowId}`)
          .then(() => {
            const newData = filteredData.filter((item) => item._id !== rowId); // Filtramos el item eliminado
            setFilteredData(newData); // Actualizamos los datos filtrados

            // Reabrimos el modal y mostramos una notificación de éxito
            setOpenModal(true);
            Swal.fire({
              icon: 'success',
              title: 'Fila eliminada',
              text: 'La fila se ha eliminado correctamente.',
            });
          })
          .catch((err) => {
            setOpenModal(true); // Reabrir el modal si ocurre un error
            Swal.fire({
              icon: 'error',
              title: 'Error al eliminar la data',
              text: "Hubo un error al eliminar el item.",
            });
          });
      } else {
        // Si el usuario cancela la eliminación, reabrimos el modal
        setOpenModal(true);
      }
    });
  };

  // El resto de las funciones permanecen igual...

  return (
    <Dialog open={openModal} onClose={onClose}>
      <DialogTitle sx={{ textAlign: 'center' }}>Filtrar Data</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="normal">
          <InputLabel>Selecciona una variable</InputLabel>
          <Select
            value={selectedVariable}
            onChange={handleSelectChange}
            label="Selecciona una variable"
          >
            {availableKeys.map((key) => (
              <MenuItem key={key} value={key}>
                {key}
              </MenuItem>
            ))}
            <MenuItem value="allData">All Data</MenuItem>
          </Select>
        </FormControl>

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
        <Button onClick={showAllData} color="default">
          Ver toda la data
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalFilterData;
