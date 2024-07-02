// src/App.js
import React from 'react';
import { Canvas } from '@react-three/fiber';
import MovableBox from './MovableBox';
import './App.css';

function App() {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <MovableBox />
    </Canvas>
  );
}

export default App;
