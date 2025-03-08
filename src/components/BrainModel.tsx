import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';

export function BrainModel() {
  const meshRef = useRef();
  const heartShape = new THREE.Shape();

  // Create heart shape (flipped vertically)
  const x = 0, y = 0;
  heartShape.moveTo(x + 5, y - 5);
  heartShape.bezierCurveTo(x + 5, y - 5, x + 4, y, x, y);
  heartShape.bezierCurveTo(x - 6, y, x - 6, y - 7, x - 6, y - 7);
  heartShape.bezierCurveTo(x - 6, y - 11, x - 3, y - 15.4, x + 5, y - 19);
  heartShape.bezierCurveTo(x + 12, y - 15.4, x + 16, y - 11, x + 16, y - 7);
  heartShape.bezierCurveTo(x + 16, y - 7, x + 16, y, x + 10, y);
  heartShape.bezierCurveTo(x + 7, y, x + 5, y - 5, x + 5, y - 5);

  const springs = useSpring({
    from: { scale: [0, 0, 0], rotation: [0, 0, 0] },
    to: { scale: [0.15, 0.15, 0.15], rotation: [0, Math.PI * 2, 0] },
    config: { mass: 2, tension: 170, friction: 12 },
    loop: { reverse: true },
  });

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.003;
    }
  });

  const geometry = new THREE.ExtrudeGeometry(heartShape, {
    depth: 2,
    bevelEnabled: true,
    bevelSegments: 3,
    bevelSize: 0.5,
    bevelThickness: 0.5
  });

  return (
    <animated.group
      ref={meshRef}
      scale={springs.scale}
      rotation={springs.rotation}
    >
      <mesh geometry={geometry}>
        <meshPhongMaterial
          color="#ff69b4"
          emissive="#ff1493"
          emissiveIntensity={0.2}
          specular="#ffffff"
          shininess={100}
        />
      </mesh>
    </animated.group>
  );
}