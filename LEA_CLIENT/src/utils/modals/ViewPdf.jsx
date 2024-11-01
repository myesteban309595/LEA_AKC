import React, { useState } from 'react';
import { Modal, Box, Button } from '@mui/material';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

// Configura el worker de pdf.js
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

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
    const [pageNumber, setPageNumber] = useState(1);
    const [numPages, setNumPages] = useState(null);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

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
                <Document
                    file={pdfUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                >
                    <Page pageNumber={pageNumber} width={500} />
                </Document>
                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <Button
                        disabled={pageNumber <= 1}
                        onClick={() => setPageNumber(pageNumber - 1)}
                    >
                        Anterior
                    </Button>
                    <span style={{ margin: '0 10px' }}>
                        Página {pageNumber} de {numPages}
                    </span>
                    <Button
                        disabled={pageNumber >= numPages}
                        onClick={() => setPageNumber(pageNumber + 1)}
                    >
                        Siguiente
                    </Button>
                </div>
            </Box>
        </Modal>
    );
};

export default PdfModal;
