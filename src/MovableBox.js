// src/MovableBox.js
import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

function MovableBox() {
  const ref = useRef();
  const [position, setPosition] = useState(new THREE.Vector3(0, 0, 0));
  const [targetPosition, setTargetPosition] = useState(new THREE.Vector3(0, 0, 0));
  const [scale, setScale] = useState(1);
  const [showRay, setShowRay] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(null);
  const { size, camera } = useThree();
  const speed = 0.05; // Adjust this value to change the speed of the movement

  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'f':
        case 'F':
          setScale(prev => prev * 2);
          break;
        case 'g':
        case 'G':
          setScale(prev => Math.max(prev * 0.5, 0.1));
          break;
        case 'q':
        case 'Q':
          setShowRay(prev => !prev);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const onClick = (event) => {
    const x = (event.clientX / size.width) * 2 - 1;
    const y = -(event.clientY / size.height) * 2 + 1;
    const vector = new THREE.Vector3(x, y, 0);
    vector.unproject(camera);
    const dir = vector.sub(camera.position).normalize();
    const distance = -camera.position.z / dir.z;
    const pos = camera.position.clone().add(dir.multiplyScalar(distance));
    setTargetPosition(new THREE.Vector3(pos.x, pos.y, 0));
    setCursorPosition([pos.x, pos.y, 0]);
  };

  useFrame(() => {
    if (ref.current) {
      position.lerp(targetPosition, speed); // Smoothly interpolate the position
      ref.current.position.copy(position);
      ref.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <>
      <mesh ref={ref} position={position.toArray()} scale={[scale, scale, scale]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="royalblue" />
      </mesh>
      {showRay && (
        <mesh position={position.toArray()} scale={[1, 1, 10]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.05, 0.05, 10, 32]} />
          <meshBasicMaterial color="yellow" />
        </mesh>
      )}
      {cursorPosition && (
        <mesh position={cursorPosition}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshBasicMaterial color="green" />
        </mesh>
      )}
      <mesh onClick={onClick} position={[0, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial visible={false} />
      </mesh>
    </>
  );
}

export default MovableBox;
