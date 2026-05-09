import Dashboard from './Dashboard'
import EjARAncor from './ar/EjARAncor'
import { Typography, Box } from '@mui/material'

// Esta es mi página personalizada que pedía el ejercicio 1.3
// Carga un modelo 3D en formato GLTF (un pato, el modelo de muestra de Khronos)
function ARAncor() {
    return (
        <>
            <Dashboard />
            <Box sx={{ p: 2, textAlign: 'center', backgroundColor: '#1a1a2e', color: '#5EEAD4' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    ARAncor — Mi página de RA con modelo GLTF
                </Typography>
                <Typography variant="body1" sx={{ color: '#e0e0e0' }}>
                    He cargado un modelo .glb en /public/modelo/. Pulsa Start AR si tu móvil soporta RA.
                </Typography>
            </Box>
            <EjARAncor />
        </>
    );
}

export default ARAncor;
