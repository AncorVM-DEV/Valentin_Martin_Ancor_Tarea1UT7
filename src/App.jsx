import 'regenerator-runtime/runtime';
import React from 'react'
//import './App.css';
import VozEj1 from './components/VozEj1'
import VozEj2 from './components/VozEj2'
import Gestos from './components/Gestos'
import AR from './components/AR'
import ARAncor from './components/ARAncor'
import Home from './components/Home'

import {createBrowserRouter, RouterProvider} from 'react-router-dom'


const router = createBrowserRouter([
  {
    path: '/',
    children: [

      {
        index: true,
        element: <Home />
      },
      {
        path: '/vozej1',
        element: <VozEj1 />
      },
      {
        path: '/vozej2',
        element: <VozEj2 />
      },
      {
        path: '/gestos',
        element: <Gestos />
      },
      {
        path: '/ar',
        element: <AR />
      },
      // Aquí añado mi ruta nueva ARAncor con el modelo .gltf
      {
        path: '/arancor',
        element: <ARAncor />
      }


    ]
  }
])

function App() {
  return (

    <RouterProvider router={router} />
  );
}

export default App;
