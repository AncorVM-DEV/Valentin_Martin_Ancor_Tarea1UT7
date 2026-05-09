import Dashboard from "./Dashboard"
import { Typography, Box } from "@mui/material"

// Página de inicio. Le he dado un toque más moderno con un fondo oscuro
// y un acento en verde menta neón para que no parezca una web del 2005
function Home() {
    return (
        <>
            <Dashboard />
            <Box
                sx={{
                    minHeight: '90vh',
                    background: 'radial-gradient(circle at top, #1a1a2e 0%, #0f0c29 100%)',
                    color: '#e0e0e0',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 4
                }}
            >
                <Typography
                    variant="h2"
                    sx={{
                        fontWeight: 'bold',
                        background: 'linear-gradient(90deg, #5EEAD4, #9D4EDD)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textAlign: 'center'
                    }}
                >
                    Aplicaciones Naturales de Usuario
                </Typography>
                <Typography variant="h5" sx={{ mt: 2, color: '#5EEAD4' }}>
                    Tarea UT7 — Ancor Valentín Martín (2º DAM)
                </Typography>
                <Typography variant="body1" sx={{ mt: 3, maxWidth: 700, textAlign: 'center', color: '#bdbdbd' }}>
                    Aquí tengo los ejercicios de gestos con la mano, voz y RA. He añadido la página
                    <strong style={{ color: '#5EEAD4' }}> ARAncor </strong>
                    para cargar un modelo 3D en formato GLTF.
                </Typography>
            </Box>
        </>
    )
}

export default Home
