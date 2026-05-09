import { AppBar, Container, Toolbar } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Link } from "react-router-dom";

// Le he metido un poco de estilo al menú: un degradado oscuro con acento neón
// para que no quede el típico azul aburrido de MUI por defecto
function Dashboard() {

    const estiloEnlace = {
        textDecoration: 'none',
        color: '#5EEAD4',
        fontWeight: 600,
        letterSpacing: '0.5px'
    };

    return (
        <AppBar
            position="static"
            sx={{
                background: 'linear-gradient(90deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
                boxShadow: '0 4px 20px rgba(94, 234, 212, 0.25)'
            }}
        >
            <Container maxWidth="xl">
                <Toolbar>
                    <Grid container spacing={1} sx={{ width: '100%' }}>

                        <Grid size={{xs:12, md:2, lg:2}}>
                            <Link to={'/'} style={estiloEnlace}>Inicio</Link>
                        </Grid>

                        <Grid size={{xs:12, md:2, lg:2}}>
                            <Link to={'/gestos'} style={estiloEnlace}>Gestos</Link>
                        </Grid>

                        <Grid size={{xs:12, md:2, lg:2}}>
                            <Link to={'/vozej1'} style={estiloEnlace}>Voz: básico</Link>
                        </Grid>

                        <Grid size={{xs:12, md:2, lg:2}}>
                            <Link to={'/vozej2'} style={estiloEnlace}>Voz: comandos</Link>
                        </Grid>

                        <Grid size={{xs:12, md:2, lg:2}}>
                            <Link to={'/ar'} style={estiloEnlace}>AR</Link>
                        </Grid>

                        {/* Mi nueva página personalizada para la Tarea 1.3 */}
                        <Grid size={{xs:12, md:2, lg:2}}>
                            <Link to={'/arancor'} style={estiloEnlace}>ARAncor</Link>
                        </Grid>


                    </Grid>
                </Toolbar>
            </Container>
        </AppBar>

    );
  }

  export default Dashboard;
