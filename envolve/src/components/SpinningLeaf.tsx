"use client";
import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshWobbleMaterial } from "@react-three/drei";
import * as THREE from "three";

function Leaf() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.01;
      ref.current.rotation.z += 0.005;
    }
  });

  return (
    <mesh ref={ref} scale={[1.5, 2.5, 0.1]}>
      {/* More leaf-like: icosahedron stretched and flattened */}
      <icosahedronGeometry args={[0.6, 2]} />
      <MeshWobbleMaterial
        color="#2e8b57" // sea green
        speed={0.8}
        factor={0.3}
        roughness={0.6}
        metalness={0.1}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
}

export default function SpinningLeaf() {
  return (
    <Canvas style={{ width: "300px", height: "300px" }}>
      <ambientLight intensity={1} />
      <directionalLight position={[3, 3, 5]} intensity={0.8} />
      <Leaf />
    </Canvas>
  );
}
