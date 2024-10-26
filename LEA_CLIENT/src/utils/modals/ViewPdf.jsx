import React from 'react';
import { Modal, Box, Button } from '@mui/material';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    maxWidth: '600px',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const PdfModal = ({ isOpen, onClose, pdfUrl }) => {
    return (
        <Modal open={isOpen} onClose={onClose}>
            <Box sx={modalStyle}>
                <Button
                    variant="contained"
                    color="error"
                    onClick={onClose}
                    style={{ position: 'absolute', top: '10px', right: '10px' }}
                >
                    &times;
                </Button>
                <iframe src={pdfUrl} width="100%" height="500px" title="PDF Viewer" />
            </Box>
        </Modal>
    );
};

export default PdfModal;
