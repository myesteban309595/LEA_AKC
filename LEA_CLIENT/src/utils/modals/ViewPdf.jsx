import React from 'react';
import { Modal, Box, Button } from '@mui/material';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: '1300px',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const PdfModal = ({ isOpen, onClose, pdfUrl }) => {

    console.log("pdf url: ",pdfUrl);
    
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
                <Document file={pdfUrl}>
                    <Page pageNumber={1} width={500} />
                </Document>
            </Box>
        </Modal>
    );
};

export default PdfModal;
