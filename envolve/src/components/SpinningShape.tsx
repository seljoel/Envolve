"use client";
import { Canvas } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshWobbleMaterial } from "@react-three/drei";
import * as THREE from "three";

// Only support one shape that resembles a leaf — a flat icosahedron
const geometryMap = {
  icosahedron: (args: [number?, number?]) => <icosahedronGeometry args={args} />,
};

interface SpinningShapeProps {
  color?: string;
  size?: [number, number, number];
  speed?: number;
  factor?: number;
  style?: React.CSSProperties;
}

function SpinningShapeMesh({
  color = "#2e8b57",
  size = [0.5, 1.0, 0.05], // Leaf-like proportions
  speed = 0.8,
  factor = 0.3,
}: SpinningShapeProps) {
  const ref = useRef<THREE.Mesh>(null);

  const position = useMemo(() => {
    // Random position in a visible range
    const x = Math.random() * 4 - 2;
    const y = Math.random() * 4 - 2;
    const z = Math.random() * 2 - 1;
    return [x, y, z] as [number, number, number];
  }, []);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.01;
      ref.current.rotation.z += 0.005;
    }
  });

  return (
    <mesh ref={ref} scale={size} position={position}>
      {geometryMap.icosahedron([0.6, 2])}
      <MeshWobbleMaterial
        color={color}
        speed={speed}
        factor={factor}
        roughness={0.6}
        metalness={0.1}
        transparent
        opacity={0.5}
      />
    </mesh>
  );
}

export default function SpinningShape(props: SpinningShapeProps) {
  return (
    <Canvas style={{ width: "100%", height: "100%", ...props.style }}>
      <ambientLight intensity={1} />
      <directionalLight position={[3, 3, 5]} intensity={0.8} />
      <SpinningShapeMesh {...props} />
    </Canvas>
  );
}
