import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Stars } from '@react-three/drei';
import { BrainModel } from './BrainModel';
import { Suspense, useState, useEffect } from 'react';
import ErrorBoundary from './ErrorBoundary';

const Scene3D = () => {
  const [webGLSupported, setWebGLSupported] = useState<boolean | null>(null);
  
  useEffect(() => {
    // Check if WebGL is supported
    const checkWebGLSupport = () => {
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        setWebGLSupported(!!gl);
      } catch (e) {
        console.error('WebGL detection failed:', e);
        setWebGLSupported(false);
      }
    };
    
    checkWebGLSupport();
  }, []);
  
  // Fallback content when WebGL is not supported
  if (webGLSupported === false) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg p-4">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-white">3D Visualization Unavailable</h3>
          <p className="text-sm text-gray-300 mt-2">Your browser doesn't support WebGL, which is required for 3D visualizations.</p>
        </div>
      </div>
    );
  }
  
  // Loading state
  if (webGLSupported === null) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }
  
  return (
    <ErrorBoundary
      fallback={
        <div className="h-full w-full flex items-center justify-center bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg p-4">
          <div className="text-center">
            <h3 className="text-lg font-medium text-white">Visualization Error</h3>
            <p className="text-sm text-gray-300 mt-2">There was a problem loading the 3D visualization.</p>
          </div>
        </div>
      }
    >
      <Canvas camera={{ position: [0, 0, 5] }} dpr={[1, 2]} gl={{ antialias: false, powerPreference: 'default' }}>
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
          count={2000} /* Reduced count for better performance */
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
    </ErrorBoundary>
  );
};

export default Scene3D;