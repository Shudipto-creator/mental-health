import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Stars } from '@react-three/drei';
import { BrainModel } from './BrainModel';
import { Suspense } from 'react';

const Scene3D = () => {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <color attach="background" args={['#000']} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#ff69b4" />
      <spotLight
        position={[-10, -10, -10]}
        angle={0.3}
        penumbra={1}
        intensity={1}
        color="#4f46e5"
      />
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />
      <Suspense fallback={null}>
        <Float
          speed={2}
          rotationIntensity={1}
          floatIntensity={2}
        >
          <BrainModel />
        </Float>
      </Suspense>
      <OrbitControls 
        enableZoom={false}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
      />
    </Canvas>
  );
};

export default Scene3D;