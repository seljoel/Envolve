"use client";
import { Canvas } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshWobbleMaterial } from "@react-three/drei";
import * as THREE from "three";

// Geometry map
const geometryMap = {
  icosahedron: (args: [radius?: number, detail?: number]) => <icosahedronGeometry args={args} />,
  sphere: (args: [radius?: number, widthSegments?: number, heightSegments?: number, phiStart?: number, phiLength?: number, thetaStart?: number, thetaLength?: number]) => <sphereGeometry args={args} />,
  box: (args: [width?: number, height?: number, depth?: number, widthSegments?: number, heightSegments?: number, depthSegments?: number]) => <boxGeometry args={args} />,
  cone: (args: [radius?: number, height?: number, radialSegments?: number, heightSegments?: number, openEnded?: boolean, thetaStart?: number, thetaLength?: number]) => <coneGeometry args={args} />,
  torus: (args: [radius?: number, tube?: number, radialSegments?: number, tubularSegments?: number, arc?: number]) => <torusGeometry args={args} />,
  octahedron: (args: [radius?: number, detail?: number]) => <octahedronGeometry args={args} />,
};

const shapeNames = Object.keys(geometryMap);
const colorPalette = [
  "#2e8b57", "#1e90ff", "#ff6347", "#ff69b4", "#8a2be2", "#ffa500", "#00ced1",
];

function FloatingShapeMesh() {
  const meshRef = useRef<THREE.Mesh>(null);

  const {
    shape,
    color,
    args,
    floatSpeed,
    rotateSpeed,
    initialY,
    floatRange,
    scale,
  } = useMemo(() => {
    const shape = shapeNames[Math.floor(Math.random() * shapeNames.length)];
    const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    const args = {
      icosahedron: [0.6, 2],
      sphere: [0.7, 32, 32],
      box: [1, 1, 1],
      cone: [0.6, 1.2, 32],
      torus: [0.4, 0.15, 16, 100],
      octahedron: [0.8, 0],
    }[shape];
    return {
      shape,
      color,
      args,
      floatSpeed: Math.random() * 0.01 + 0.005,
      rotateSpeed: Math.random() * 0.01 + 0.005,
      initialY: Math.random() * 2,
      floatRange: 0.3 + Math.random() * 0.2,
      scale: [0.8 + Math.random(), 0.8 + Math.random(), 0.8 + Math.random()],
    };
  }, []);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const t = clock.getElapsedTime();
      meshRef.current.rotation.y += rotateSpeed;
      meshRef.current.position.y = initialY + Math.sin(t * floatSpeed * 100) * floatRange;
    }
  });

  return (
    <mesh ref={meshRef} scale={scale}>
      {geometryMap[shape](args)}
      <MeshWobbleMaterial
        color={color}
        speed={1}
        factor={0.2}
        roughness={0.5}
        transparent
        opacity={0.85}
      />
    </mesh>
  );
}

export default function FloatingShape({
  style = {},
}: {
  style?: React.CSSProperties;
}) {
  return (
    <Canvas style={{ width: 200, height: 200, ...style }}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[2, 2, 5]} intensity={0.6} />
      <FloatingShapeMesh />
    </Canvas>
  );
}
