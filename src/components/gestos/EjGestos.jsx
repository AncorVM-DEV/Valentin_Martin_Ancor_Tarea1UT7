import Webcam from "react-webcam";
import { useRef, useState } from "react";
import * as handTrack from 'handtrackjs';
import Texto from './Texto'


export default function EjGestos() {
  const [label, setLabel] = useState(null);
  // Aquí guardo el color del fondo, empieza en rosa como pedía el ejercicio
  const [colorFondo, setColorFondo] = useState('pink');
  // Este flag lo uso para que el cambio de color no se dispare mil veces seguidas
  // (porque la detección va en bucle cada 3 segundos y si no, parpadea como loco)
  const yaCambieRef = useRef(false);

  // Easter egg activo de Jujutsu Kaisen. Si vale 'gojo' o 'sukuna' muestro
  // el GIF correspondiente sobre la webcam.
  const [eggJJK, setEggJJK] = useState(null);

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const defaultParams = {
    flipHorizontal: false,
    outputStride: 16,
    imageScaleFactor: 1,
    maxNumBoxes: 20,
    iouThreshold: 0.2,
    scoreThreshold: 0.6,
    modelType: "ssd320fpnlite",
    modelSize: "large",
    bboxLineWidth: "2",
    fontSize: 17,
  };

  const runHandtrack = async () => {
    const model = await handTrack.load(defaultParams);
    console.log("Model loaded");
    setInterval(() => {
      runDetection(model);
    }, 3000);
  };

  const runDetection = async (model) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Hago las detecciones de la mano
      const predictions = await model.detect(video);
      predictions.map((prediction) => setLabel(prediction.label));

      // Si detecto que estoy señalando con el dedo (point) cambio el color
      // Lo hago así para que sólo cambie una vez por gesto y no cada 3 segundos
      if (label === "point") {
        if (!yaCambieRef.current) {
          // Si está rosa lo paso a un morado neón guapísimo, y si no, vuelve a rosa
          setColorFondo((anterior) => anterior === 'pink' ? '#9D4EDD' : 'pink');
          yaCambieRef.current = true;
        }
      } else {
        // En cuanto deje de señalar reseteo el flag para poder volver a alternar
        yaCambieRef.current = false;
      }

      // ===== EASTER EGGS DE JUJUTSU KAISEN =====
      // Meto este easter egg aquí también. Si hago el símbolo de la victoria
      // (que es lo más parecido a los dedos cruzados de Gojo que detecta la IA),
      // boom, expansión de dominio.
      // handtrackjs no tiene literal "victory" ni "thumbs_up", así que tiro de
      // los gestos que sí reconoce y son los más parecidos visualmente:
      //   - "pinch" (dos dedos juntos) lo asocio a la V de Gojo Satoru
      //   - "open" (mano abierta) lo asocio a Sukuna haciendo el sello
      if (label === "pinch") {
        setEggJJK("gojo");
      } else if (label === "open") {
        setEggJJK("sukuna");
      } else if (label === "closed") {
        // Mano cerrada -> hace scroll arriba como antes
        console.log("scrolling up");
        window.scrollBy(0, -window.innerHeight);
      } else {
        console.log("detecting...");
      }
    }
  };
  runHandtrack();

  // Función para cerrar el GIF del easter egg JJK manualmente
  const cerrarEgg = () => setEggJJK(null);

  return (
    <>
        <div style = {{
          alignItems: 'center',
          display: 'flex',
          backgroundColor: colorFondo,
          flexDirection: 'column',
          transition: 'background-color 0.5s ease',
          position: 'relative',
          }}>
            <div>
                <h3> Ejemplo Detección Gestos Mano + Easter Eggs JJK </h3>
                <p> Tienes que conceder acceso a la webcam </p>
                <p> 👉 Señala con el dedo (point) para cambiar el color del fondo </p>
                <p> ✌️ Haz el símbolo de la victoria (pinch) -> Expansión de Gojo </p>
                <p> ✋ Mano abierta -> Santuario Malévolo de Sukuna </p>
            </div>
            <div style={{ position: 'relative' }}>
                <Webcam
                    ref={webcamRef}
                    style={{
                    width: 320,
                    height: 240,
                    borderRadius: '12px',
                    boxShadow: '0 0 30px rgba(157, 78, 221, 0.5)'
                }}
            />
            <canvas
                ref={canvasRef}
                  style={{
                    width: 320,
                    height: 240,
                    position: 'absolute',
                    top: 0,
                    left: 0
                  }}
            />

            {/* Aquí monto el GIF encima de la webcam si hay easter egg activo.
                Lo absoluto-positiono justo sobre el vídeo para que dé rollo
                de "expansión de dominio en directo" */}
            {eggJJK && (
                <div
                    onClick={cerrarEgg}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: 320,
                        height: 240,
                        background: eggJJK === 'gojo'
                            ? 'radial-gradient(circle, rgba(30,58,138,0.95), #000 90%)'
                            : 'radial-gradient(circle, rgba(139,0,0,0.95), #000 90%)',
                        borderRadius: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        animation: 'aparecer-egg 0.6s ease-out',
                        boxShadow: eggJJK === 'gojo'
                            ? '0 0 40px rgba(94,234,212,0.7)'
                            : '0 0 40px rgba(255,0,0,0.8)'
                    }}
                >
                    <img
                        src={eggJJK === 'gojo' ? '/gojo.gif' : '/sukuna.gif'}
                        alt={eggJJK}
                        style={{
                            width: '85%',
                            maxHeight: '60%',
                            objectFit: 'contain',
                            borderRadius: '8px',
                            border: '2px solid rgba(255,255,255,0.4)'
                        }}
                    />
                    <p style={{
                        color: '#fff',
                        fontWeight: 900,
                        textAlign: 'center',
                        margin: '8px',
                        fontSize: '14px',
                        textShadow: '0 0 10px rgba(0,0,0,0.9)'
                    }}>
                        {eggJJK === 'gojo'
                            ? 'Expansión de dominio: Vacío Inconmensurable'
                            : 'Santuario Malévolo'}
                    </p>
                    <small style={{ color: '#bdbdbd' }}>(click para cerrar)</small>
                </div>
            )}
        </div>
      </div>

      <Texto />



    </>
  );
}
