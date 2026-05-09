// Esta es mi página personalizada: ARAncor
// Aquí cargo un modelo 3D en formato .gltf usando react-three/fiber y drei
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { ARButton, XR } from "@react-three/xr";
import ModeloGLTF from "./ModeloGLTF";

function EjARAncor() {
    return (
        <>
            {/* Botón para entrar en RA si el dispositivo lo soporta */}
            <ARButton />
            <div style={{
                width: '100%',
                height: '80vh',
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
            }}>
                <Canvas camera={{ position: [0, 0, 0], fov: 60 }}>
                    <XR>
                        {/* Suspense porque el modelo tarda un poquito en cargarse */}
                        <Suspense fallback={null}>
                            <ModeloGLTF />
                        </Suspense>
                    </XR>
                </Canvas>
            </div>
        </>
    );
}

export default EjARAncor;
