import { useGLTF, OrbitControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

// Aquí cargo el modelo 3D que tengo metido en /public/modelo/Duck.glb
// He elegido el Pato porque es el modelo de prueba clásico de glTF y se ve bien
function ModeloGLTF() {
    const refModelo = useRef();
    // useGLTF me devuelve el modelo ya parseado, así me ahorro montar el loader a mano
    const { scene } = useGLTF('/modelo/Duck.glb');

    // Hago que el pato gire suavemente para que no parezca un peluche estático
    useFrame((state, delta) => {
        if (refModelo.current) {
            refModelo.current.rotation.y += delta * 0.6;
        }
    });

    return (
        <>
            <OrbitControls />
            {/* Luces para que el modelo se vea bonito y no salga negro */}
            <ambientLight intensity={0.7} />
            <directionalLight position={[3, 5, 2]} intensity={1.2} />
            <directionalLight position={[-3, -2, -2]} intensity={0.4} />
            {/* Meto el modelo en un primitive y lo escalo un poquito */}
            <primitive
                ref={refModelo}
                object={scene}
                scale={1.5}
                position={[0, -1, -4]}
            />
        </>
    );
}

// Le digo a drei que precargue el modelo (mejora la primera carga)
useGLTF.preload('/modelo/Duck.glb');

export default ModeloGLTF;
