import { OrbitControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";


// He cambiado el cubo original por un toroide (un donut de toda la vida)
// y le he puesto un verde menta neón para que pegue con la onda del proyecto
function XrCube() {

    // useRef para tener acceso directo a la figura y poder rotarla
    const figuraRef = useRef();

    // Con useFrame hago que el toroide gire en los ejes x e y, así se ve más chulo
    useFrame((state, delta) => {
        figuraRef.current.rotation.y += delta;
        figuraRef.current.rotation.x += delta * 0.5;
    });

return (<>
    {/* OrbitControls me deja mover la cámara con el ratón cuando NO estoy en RA */}
    <OrbitControls />
    {/* Pongo dos luces para que el toroide brille mejor */}
    <ambientLight intensity={0.6} />
    <directionalLight position={[2, 5, 2]} intensity={1} />
    {/* Aquí está la figura nueva: un toroide en verde menta */}
    <mesh ref={figuraRef} position={[0, 0, -5]}>
        <torusGeometry args={[1.2, 0.4, 16, 100]}/>
        <meshStandardMaterial color='#5EEAD4' metalness={0.4} roughness={0.3} />
    </mesh>


    </>

)
}

export default XrCube;
