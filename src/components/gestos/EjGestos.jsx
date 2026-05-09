import Webcam from "react-webcam";
import { useRef, useState, useEffect } from "react";
import * as handpose from "@tensorflow-models/handpose";
import "@tensorflow/tfjs-backend-webgl";
import * as fp from "fingerpose";
import Texto from "./Texto";


// =====================================================================
//   GESTOS PERSONALIZADOS PARA EL GestureEstimator
//   fingerpose ya trae VictoryGesture y ThumbsUpGesture de fábrica,
//   pero los demás (pulgar abajo, mano abierta, señalar) los he tenido
//   que construir yo a base de "qué dedos están estirados y hacia dónde".
// =====================================================================

// Pulgar abajo: pulgar estirado apuntando para abajo + el resto cerrados
const ThumbsDownGesture = new fp.GestureDescription("thumbs_down");
ThumbsDownGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.NoCurl, 1.0);
ThumbsDownGesture.addDirection(fp.Finger.Thumb, fp.FingerDirection.VerticalDown, 1.0);
ThumbsDownGesture.addDirection(fp.Finger.Thumb, fp.FingerDirection.DiagonalDownLeft, 0.9);
ThumbsDownGesture.addDirection(fp.Finger.Thumb, fp.FingerDirection.DiagonalDownRight, 0.9);
for (const dedo of [fp.Finger.Index, fp.Finger.Middle, fp.Finger.Ring, fp.Finger.Pinky]) {
    ThumbsDownGesture.addCurl(dedo, fp.FingerCurl.FullCurl, 1.0);
    ThumbsDownGesture.addCurl(dedo, fp.FingerCurl.HalfCurl, 0.9);
}

// Mano abierta (Stop): los 5 dedos estirados como una palma de "para"
const OpenHandGesture = new fp.GestureDescription("open_hand");
for (const dedo of [fp.Finger.Thumb, fp.Finger.Index, fp.Finger.Middle, fp.Finger.Ring, fp.Finger.Pinky]) {
    OpenHandGesture.addCurl(dedo, fp.FingerCurl.NoCurl, 1.0);
    OpenHandGesture.addCurl(dedo, fp.FingerCurl.HalfCurl, 0.5);
}

// Señalar (Point): solo el índice estirado, el resto cerrados
const PointGesture = new fp.GestureDescription("point");
PointGesture.addCurl(fp.Finger.Index, fp.FingerCurl.NoCurl, 1.0);
PointGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.HalfCurl, 0.7);
PointGesture.addCurl(fp.Finger.Thumb, fp.FingerCurl.NoCurl, 0.5);
for (const dedo of [fp.Finger.Middle, fp.Finger.Ring, fp.Finger.Pinky]) {
    PointGesture.addCurl(dedo, fp.FingerCurl.FullCurl, 1.0);
    PointGesture.addCurl(dedo, fp.FingerCurl.HalfCurl, 0.7);
}

// Registro todos los gestos en el estimador
const GE = new fp.GestureEstimator([
    fp.Gestures.VictoryGesture,
    fp.Gestures.ThumbsUpGesture,
    ThumbsDownGesture,
    OpenHandGesture,
    PointGesture,
]);

// Mi paleta de colores aleatorios brillantes para cuando hago el gesto de señalar.
// Le tiro uno random de esta lista para que no salgan colores cutres tipo gris.
const PALETA = [
    "#ff006e", "#9D4EDD", "#5EEAD4", "#fb923c",
    "#facc15", "#06b6d4", "#a855f7", "#10b981", "#f43f5e"
];
function colorAleatorio() {
    return PALETA[Math.floor(Math.random() * PALETA.length)];
}


export default function EjGestos() {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);

    // Aquí guardo el gesto que tengo activo ahora mismo
    const [gesto, setGesto] = useState(null);
    // Color del fondo (arranca en 'pink' como en el ejercicio original)
    const [colorFondo, setColorFondo] = useState("pink");
    // Esto me dice si el modelo está cargando aún (para mostrar un mensajito)
    const [cargando, setCargando] = useState(true);

    // OPTIMIZACIÓN BESTIA: este ref guarda el último gesto fuera del estado de React.
    // Antes el componente se re-renderizaba cada vez que detectaba algo (60 veces por seg)
    // y el navegador iba a tirones. Ahora SOLO actualizo el estado si el gesto ha cambiado
    // de verdad respecto al anterior. Diferencia abismal en rendimiento.
    const ultimoGestoRef = useRef(null);

    useEffect(() => {
        let cancelado = false;
        let intervalo;

        const arrancar = async () => {
            // Cargo el modelo de handpose una sola vez al montar el componente
            const net = await handpose.load();
            if (cancelado) return;
            setCargando(false);
            console.log("Handpose cargado correctamente");

            // 250 ms es suficiente para detectar gestos sin freír la CPU.
            // Antes el código original detectaba cada 3 segundos pero pintaba mil
            // veces, ahora pinto solo cuando cambia el gesto: lo mejor de los dos mundos.
            intervalo = setInterval(async () => {
                if (cancelado) return;
                if (webcamRef.current?.video?.readyState !== 4) return;

                const video = webcamRef.current.video;
                const manos = await net.estimateHands(video);

                if (manos.length === 0) {
                    // No veo manos -> limpio el gesto si había alguno
                    if (ultimoGestoRef.current !== null) {
                        ultimoGestoRef.current = null;
                        setGesto(null);
                    }
                    return;
                }

                // Bajo el umbral a 7.5 (más permisivo) para que detecte mejor en
                // habitaciones con poca luz. Por defecto está en 8.5 y era muy estricto.
                const estimacion = GE.estimate(manos[0].landmarks, 7.5);
                if (estimacion.gestures.length === 0) return;

                // Cojo el gesto con la confianza más alta de los detectados
                const top = estimacion.gestures.reduce((a, b) =>
                    a.confidence > b.confidence ? a : b
                );

                // Solo actualizo el estado si el gesto es DIFERENTE al anterior.
                // Esta es la clave de la optimización.
                if (ultimoGestoRef.current !== top.name) {
                    ultimoGestoRef.current = top.name;
                    setGesto(top.name);

                    // Cuando hago el gesto de señalar le doy un color aleatorio nuevo
                    if (top.name === "point") {
                        setColorFondo(colorAleatorio());
                    }
                }
            }, 250);
        };

        arrancar();

        // Limpieza al desmontar el componente
        return () => {
            cancelado = true;
            if (intervalo) clearInterval(intervalo);
        };
    }, []);


    // Calculo los modos especiales según el gesto activo
    const enModoHacker = gesto === "thumbs_down";
    const enModoZen = gesto === "open_hand";
    const enModoGojo = gesto === "victory";
    const enModoSukuna = gesto === "thumbs_up";

    // Color de fondo según el modo
    let fondo = colorFondo;
    let colorTexto = "inherit";
    if (enModoHacker) {
        fondo = "#000";
        colorTexto = "#22c55e"; // verde matrix bestial
    }
    if (enModoGojo)   fondo = "#0f172a"; // azul oscuro de Gojo
    if (enModoSukuna) fondo = "#7f1d1d"; // rojo sangre de Sukuna

    // Determino el GIF y el texto épico que toca mostrar
    let eggGif = null;
    let eggTexto = null;
    if (enModoGojo) {
        eggGif = "/gojo.gif";
        eggTexto = "DOMINIO INCONMENSURABLE";
    } else if (enModoSukuna) {
        eggGif = "/sukuna.gif";
        eggTexto = "SANTUARIO MALÉVOLO";
    }

    return (
        <>
            <div
                style={{
                    alignItems: "center",
                    display: "flex",
                    backgroundColor: fondo,
                    color: colorTexto,
                    flexDirection: "column",
                    transition: "all 0.5s ease", // transición suave entre modos
                    position: "relative",
                    minHeight: "70vh",
                    padding: "16px",
                    fontFamily: enModoHacker ? "'Courier New', monospace" : "inherit",
                }}
            >
                {/* En modo Zen oculto la cabecera y los textos para que solo se vea la cámara */}
                {!enModoZen && (
                    <div style={{ textAlign: "center", maxWidth: 720 }}>
                        <h3>
                            {enModoHacker
                                ? "> SISTEMA HACKEADO_"
                                : "Detección de Gestos + Easter Eggs JJK"}
                        </h3>
                        {cargando ? (
                            <p>⏳ Cargando modelo de manos... (la primera vez tarda un poco)</p>
                        ) : (
                            <>
                                <p>👉 <strong>Señalar</strong>: cambia el fondo a un color aleatorio</p>
                                <p>👎 <strong>Pulgar abajo</strong>: Modo Hacker (negro + verde Matrix)</p>
                                <p>✋ <strong>Mano abierta</strong>: Modo Zen (oculta los textos)</p>
                                <p>✌️ <strong>Victory</strong>: GOJO — Dominio Inconmensurable</p>
                                <p>👍 <strong>Pulgar arriba</strong>: SUKUNA — Santuario Malévolo</p>
                                <p style={{ fontSize: "12px", opacity: 0.7 }}>
                                    Gesto detectado: <strong>{gesto || "—"}</strong>
                                </p>
                            </>
                        )}
                    </div>
                )}

                <div
                    style={{
                        position: "relative",
                        marginTop: 12,
                        border: enModoZen ? "4px solid #5EEAD4" : "none",
                        borderRadius: enModoZen ? "16px" : "0",
                        boxShadow: enModoZen ? "0 0 60px rgba(94,234,212,0.7)" : "none",
                        transition: "all 0.5s ease",
                    }}
                >
                    <Webcam
                        ref={webcamRef}
                        style={{
                            width: 480,
                            height: 360,
                            borderRadius: enModoZen ? "12px" : "8px",
                        }}
                    />
                    <canvas
                        ref={canvasRef}
                        style={{
                            width: 480,
                            height: 360,
                            position: "absolute",
                            top: 0,
                            left: 0,
                        }}
                    />

                    {/* Si estoy en modo Gojo o Sukuna, monto el GIF a lo bestia sobre la webcam */}
                    {eggGif && (
                        <div
                            style={{
                                position: "absolute",
                                inset: 0,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                background: "rgba(0, 0, 0, 0.55)",
                                animation: "aparecer-egg 0.6s ease-out",
                                borderRadius: "8px",
                            }}
                        >
                            <img
                                src={eggGif}
                                alt={gesto}
                                style={{
                                    width: "85%",
                                    maxHeight: "60%",
                                    objectFit: "contain",
                                    border: "3px solid rgba(255,255,255,0.5)",
                                    borderRadius: "12px",
                                    boxShadow: enModoSukuna
                                        ? "0 0 40px rgba(255, 0, 0, 0.85)"
                                        : "0 0 40px rgba(94, 234, 212, 0.85)",
                                }}
                            />
                            <h2
                                style={{
                                    color: "#fff",
                                    fontWeight: 900,
                                    marginTop: "10px",
                                    fontSize: "26px",
                                    letterSpacing: "3px",
                                    textShadow:
                                        "0 0 14px rgba(0,0,0,0.95), 0 0 20px " +
                                        (enModoSukuna ? "#ff0000" : "#5EEAD4"),
                                    textAlign: "center",
                                }}
                            >
                                {eggTexto}
                            </h2>
                        </div>
                    )}
                </div>
            </div>

            {/* En modo Zen oculto también el lorem ipsum largo */}
            {!enModoZen && <Texto />}
        </>
    );
}
