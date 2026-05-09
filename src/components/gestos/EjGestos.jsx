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

      if (label === "open") {
        console.log("scrolling down");
        window.scrollBy(0, window.innerHeight);
      } else if (label === "closed") {
        console.log("scrolling up");
        window.scrollBy(0, -window.innerHeight);
      }
      else
      {
        console.log("detecting...");
      }
    }
  };
  runHandtrack();
  return (
    <>
        <div style = {{
          alignItems: 'center',
          display: 'flex',
          backgroundColor: colorFondo,
          flexDirection: 'column',
          transition: 'background-color 0.5s ease',
          }}>
            <div>
                <h3> Ejemplo Detección Gestos Mano: abierta, cerrada y señalando </h3>
                <p> Tienes que conceder acceso a la webcam </p>
                <p> Señala con el dedo (point) para cambiar el color del fondo </p>
            </div>
            <div >
                <Webcam
                    ref={webcamRef}
                    style={{
                    width: 100,
                    height: 100,
                }}
            />
            <canvas
                ref={canvasRef}
                  style={{
                    width: 100,
                    height: 100,
                  }}
            />
        </div>
      </div>

      <Texto />



    </>
  );
}
