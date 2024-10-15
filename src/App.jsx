import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky } from '@react-three/drei';
import { BaseModel } from './models/BaseModel'; 
import { useControls } from 'leva';

function App() {
  // Leva controls: animation, light type, light position, and outfit selection
  const { animation, lightType, lightPosition, outfit } = useControls({
    animation: { value: 'Standing', options: ['Standing', 'WalkStop', 'WalkTurn'] },
    lightType: { value: 'Directional', options: ['Directional', 'Point', 'Spot'] },
    lightPosition: { 
      value: { x: 0, y: 3, z: 5 },  
      step: 0.1,
      min: -10,
      max: 10
    },
    outfit: { 
      value: 'outfit1.glb', 
      options: [ 'outfit1.glb', 'outfit2.glb', 'outfit3.glb', 'outfit4.glb', 'outfit5.glb']
    }
  });

  return (
    <div id="canvas-container" style={{ width: '100vw', height: '100vh' }}>
      <Canvas shadowMap shadows="true" camera={{ position: [0, 2, 8], fov: 50 }}>
        {/* Conditional Lighting */}
        {lightType === 'Directional' && (
          <directionalLight
            castShadow
            position={[lightPosition.x, lightPosition.y, lightPosition.z]}
            intensity={1}
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-far={50}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />
        )}
        {lightType === 'Point' && (
          <pointLight 
            castShadow 
            position={[lightPosition.x, lightPosition.y, lightPosition.z]} 
            intensity={70}
          />
        )}
        {lightType === 'Spot' && (
          <spotLight 
            castShadow 
            position={[lightPosition.x, lightPosition.y, lightPosition.z]} 
            intensity={200} 
            angle={Math.PI / 6} 
            penumbra={1}
          />
        )}

        {/* Fashion Runway Plane */}
        <mesh receiveShadow={true} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} >
          <planeGeometry args={[20, 10]} />
          <meshStandardMaterial color="#555555" />
        </mesh>

        {/* Fashion Model - Pass selected outfit to BaseModel */}
        <BaseModel animation={animation} outfit={outfit} />

        {/* OrbitControls */}
        <OrbitControls enableRotate={true} enableZoom={true} />

        {/* Sky background */}
        <Sky
          castShadow
          distance={450000}
          sunPosition={[100, 10, 100]}
          inclination={0}
          azimuth={0.25}
        />
      </Canvas>
    </div>
  );
}

export default App;
