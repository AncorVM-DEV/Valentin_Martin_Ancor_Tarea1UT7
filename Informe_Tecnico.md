# Informe Técnico — Tarea 1 UT7

**Alumno:** Ancor Valentín Martín
**Curso:** 2º DAM
**Asignatura:** Aplicaciones Naturales de Usuario

---

## Introducción

En esta primera tarea he partido del proyecto base `nuialumni` que nos pasaste y le he metido las tres modificaciones que pedía el enunciado: alternar color con el gesto de señalar, cambiar la figura geométrica de la página de RA y crear una página nueva mía con un modelo 3D en formato GLTF. Lo he montado todo en React con Vite y he aprovechado para darle un lavado de cara visual al menú y a la home, porque la verdad es que el azul por defecto de MUI no me convencía nada.

## Tarea 1.1 — Alternar color al señalar (point)

He editado `src/components/gestos/EjGestos.jsx`. Lo que hice fue añadir un `useState` llamado `colorFondo` que arranca en `'pink'` (el color que ya tenía el ejercicio) y cuando la librería `handtrackjs` detecta el `label === "point"` cambio el color a un morado neón (`#9D4EDD`).

El problema con el que me topé fue que la detección se ejecuta cada 3 segundos en bucle, así que si yo me quedaba quieto señalando con el dedo, el color cambiaba sin parar. Para arreglarlo metí un `useRef` (`yaCambieRef`) que actúa como una bandera: la primera vez que detecta el `point` cambia el color y pone la bandera a `true`, y hasta que no detecta otro gesto distinto, no vuelve a cambiar. Así se evita que parpadee como una discoteca.

También le metí una transición CSS (`transition: 'background-color 0.5s ease'`) para que el cambio se vea suave en lugar de un corte brusco.

## Tarea 1.2 — Cambiar la figura geométrica

Aquí he tocado `src/components/ar/XrCube.jsx`. El proyecto base usaba un `boxGeometry` de color rosa (`hotpink`). Yo lo he cambiado por un **toroide** (un donut, vaya), usando `<torusGeometry args={[1.2, 0.4, 16, 100]} />`, y le he puesto color verde menta (`#5EEAD4`) que combina con la paleta general que estoy usando. Además le he añadido un `metalness` y `roughness` al material para que tenga un aspecto más metálico y brille un poco.

De paso le he metido una segunda luz (`directionalLight`) para que el toroide no quede plano, y rotarlo en los dos ejes (x e y) en lugar de solo uno, así se ve más dinámico cuando gira.

## Tarea 1.3 — Página ARAncor con modelo GLTF

Esta es la parte más currada. He hecho lo siguiente:

1. He creado tres archivos nuevos:
   - `src/components/ARAncor.jsx`: la página completa con el menú y el título.
   - `src/components/ar/EjARAncor.jsx`: el `Canvas` de three.js con el botón `ARButton`.
   - `src/components/ar/ModeloGLTF.jsx`: el componente que se encarga de cargar el modelo 3D y darle vida.

2. He metido un modelo GLTF en `public/modelo/Duck.glb`. He elegido el clásico **Duck.glb** de los samples de Khronos porque es el modelo de referencia para probar GLTF y se ve bien renderizado.

3. Para cargarlo uso `useGLTF` de `@react-three/drei`, que parsea el modelo y me devuelve la `scene`. Luego lo monto en un `<primitive>` y le aplico una rotación lenta con `useFrame` para que vaya girando solo. Lo he envuelto en `<Suspense>` por si tarda un poquito en cargar.

4. He añadido la ruta `/arancor` en `App.jsx` y el enlace correspondiente en el `Dashboard.jsx`. El menú ahora tiene 6 entradas.

## Mejoras de diseño

Aprovechando el tirón le he metido una paleta cyberpunk al proyecto:

- **Menú (Dashboard)**: degradado oscuro (negro/morado) con los enlaces en verde menta.
- **Home**: fondo radial oscuro, título con gradiente lineal animado de menta a morado.
- **ARAncor**: fondo degradado azul oscuro para que el modelo 3D resalte.

Esto no era obligatorio pero quedaba muy soso con los colores por defecto y me apetecía darle un toque más profesional.

## Cómo ejecutar

```bash
npm install
npm run dev
```

## Resumen de archivos modificados / creados

| Archivo | Acción |
|---|---|
| `src/components/gestos/EjGestos.jsx` | Modificado (alterna color con `point`) |
| `src/components/ar/XrCube.jsx` | Modificado (cubo → toroide verde menta) |
| `src/components/ARAncor.jsx` | **Nuevo** |
| `src/components/ar/EjARAncor.jsx` | **Nuevo** |
| `src/components/ar/ModeloGLTF.jsx` | **Nuevo** |
| `public/modelo/Duck.glb` | **Nuevo** (modelo 3D) |
| `src/App.jsx` | Modificado (ruta `/arancor`) |
| `src/components/Dashboard.jsx` | Modificado (enlace ARAncor + estilo) |
| `src/components/Home.jsx` | Modificado (rediseño visual) |
