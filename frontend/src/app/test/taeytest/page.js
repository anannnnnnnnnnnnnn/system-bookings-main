'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

const ToursPage = () => {
  const [tours, setTours] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedTour, setSelectedTour] = useState(null);
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    license_plate: '',
    seating_capacity: '',
    fuel_type: '',
    status: '',
    image: null,
  });

  useEffect(() => {
    axios.get('http://localhost:5182/api/cars')
      .then(response => setTours(response.data))
      .catch(error => console.error('Error fetching tours:', error));
  }, []);

  const handleOpenDialog = (tour = null) => {
    if (tour) {
      setSelectedTour(tour);
      setFormData({
        brand: tour.brand || '',
        model: tour.model || '',
        license_plate: tour.license_plate || '',
        seating_capacity: tour.seating_capacity || '',
        fuel_type: tour.fuel_type || '',
        status: tour.status || '',
        image: null,
      });
    } else {
      setSelectedTour(null);
      setFormData({
        brand: '',
        model: '',
        license_plate: '',
        seating_capacity: '',
        fuel_type: '',
        status: '',
        image: null,
      });
    }
    setOpen(true);
  };

  const handleCloseDialog = () => setOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSave = () => {
    const {
      brand,
      model,
      license_plate,
      seating_capacity,
      fuel_type,
      status,
      image,
    } = formData;

    const formDataObj = new FormData();
    formDataObj.append('brand', brand);
    formDataObj.append('model', model);
    formDataObj.append('license_plate', license_plate);
    formDataObj.append('seating_capacity', parseInt(seating_capacity) || 0);
    formDataObj.append('fuel_type', parseInt(fuel_type) || 0);
    formDataObj.append('status', parseInt(status) || 1);
    if (image) {
      formDataObj.append('image_url', image);
    }

    const url = selectedTour
      ? `http://localhost:5182/api/cars/${selectedTour.car_id}`
      : 'http://localhost:5182/api/cars';
    const method = selectedTour ? 'put' : 'post';

    axios({ method, url, data: formDataObj })
      .then((response) => {
        // Log success message and response data
        console.log('Success:', response.data);

        setTours((prev) => {
          if (selectedTour) {
            return prev.map((tour) =>
              tour.car_id === selectedTour.car_id ? response.data.car : tour
            );
          } else {
            return [...prev, response.data.car];
          }
        });

        handleCloseDialog();
      })
      .catch((error) => {
        console.error('Error saving the tour:', error);
      });
  };


  const handleDelete = (car_id) => {
    axios.delete(`http://localhost:5182/api/cars/${car_id}`)
      .then((response) => {
        console.log('API Response:', response.data); // ตรวจสอบข้อมูลที่ได้รับจาก API
        setTours((prev) => prev.filter((tour) => tour.car_id !== car_id));
        console.log(`Car with ID ${car_id} has been successfully deleted.`);
      })
      .catch((error) => {
        console.error('Error deleting the tour:', error);
      });
  };
  


  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Tours List
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
        Add New Tour
      </Button>

      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table sx={{ minWidth: 650 }} aria-label="tours table">
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>Model</TableCell>
              <TableCell>License Plate</TableCell>
              <TableCell>Seating Capacity</TableCell>
              <TableCell>Fuel Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tours.map((tour) => (
              <TableRow key={tour.id}>
                <TableCell>{tour.id}</TableCell>
                <TableCell>{tour.brand}</TableCell>
                <TableCell>{tour.model}</TableCell>
                <TableCell>{tour.license_plate}</TableCell>
                <TableCell>{tour.seating_capacity}</TableCell>
                <TableCell>{tour.fuel_type}</TableCell>
                <TableCell>{tour.status}</TableCell>
                <TableCell>
                  <img
                    src={`http://localhost:5182${tour.image_url}`}
                    alt={tour.name}
                    style={{ width: 100, height: 100 }}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleOpenDialog(tour)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDelete(tour.car_id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>{selectedTour ? 'Edit Tour' : 'Add New Tour'}</DialogTitle>
        <DialogContent>
          {['brand', 'model', 'license_plate', 'seating_capacity', 'fuel_type', 'status'].map((field) => (
            <TextField
              key={field}
              label={field.replace('_', ' ').toUpperCase()}
              name={field}
              fullWidth
              value={formData[field]}
              onChange={handleInputChange}
              sx={{ marginBottom: 2 }}
            />
          ))}
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            style={{ marginBottom: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            {selectedTour ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ToursPage;
