import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Html } from '@react-three/drei';
import { useControls } from 'leva';
import { BaseModel1 } from './models/BaseModel1';
import { BaseModel2 } from './models/BaseModel2';
import { BaseModel3 } from './models/BaseModel3';
import { BaseModel4 } from './models/BaseModel4';
import { BaseModel5 } from './models/BaseModel5';

const outfitPrices = {
  'Formals': {
    Shoes: 40.99,
    Pants: 54.99,
    Shirt: 49.99,
    Belt:  20.00
  },
  'Dress': {
    Heels: 59.99,
    Dress: 79.99,
  },
  'Cool': {
    Sneakers: 39.99,
    Pants: 29.99,
    Hoodie: 19.99,
  },
  'Casual - Green': {
    Boots: 29.99,
    Sweatpants: 59.99,
    Tshirt: 89.99,
  },
  'Casual - Maroon': {
    Shoes: 74.99,
    Tshirt: 49.99,
    Jeans: 99.99,
  },
};

function App() {
  const [priceDetails, setPriceDetails] = useState(outfitPrices['Formals']); // Default to 'Formals'

  // Leva controls: animation, light type, light position, outfit selection, and price toggle
  const { animation, lightType, lightPosition, outfit, showPrice } = useControls({
    animation: { value: 'Standing', options: ['Standing', 'Dancing', 'Posing'] },
    lightType: { value: 'Directional', options: ['Directional', 'Point', 'Spot'] },
    lightPosition: { value: { x: 0, y: 3, z: 5 }, step: 0.1, min: -10, max: 10 },
    outfit: { value: 'Formals', options: Object.keys(outfitPrices) },
    showPrice: { value: true, label: 'Show Price' }, // Toggle for displaying price
  });

  useEffect(() => {
    setPriceDetails(outfitPrices[outfit]);
  }, [outfit]);

  // Helper function to render detailed price breakdown
  const renderPriceDetails = (details) => (
    <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
      {Object.entries(details).map(([item, price]) => (
        <li key={item} style={{ marginBottom: '5px' }}>
          <strong>{item}:</strong> ${price.toFixed(2)}
        </li>
      ))}
    </ul>
  );

  return (
    <div id="canvas-container" style={{ width: '100vw', height: '100vh' }}>
      <Canvas shadowmap="true" shadows="true" camera={{ position: [0, 2, 8], fov: 50 }}>
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

        {/* Fashion Model - Pass selected outfit to BaseModel */}
        {outfit === 'Formals' && <BaseModel1 animation={animation} />}
        {outfit === 'Dress' && <BaseModel2 animation={animation} />}
        {outfit === 'Cool' && <BaseModel3 animation={animation} />}
        {outfit === 'Casual - Green' && <BaseModel4 animation={animation} />}
        {outfit === 'Casual - Maroon' && <BaseModel5 animation={animation} />}

        <Environment
          files="/background/studio.hdr"
          background
          ground={{ height: 5, radius: 10, scale: 20 }}
        />

        {/* Conditional Price Display */}
        {showPrice && (
          <Html position={[-2, 2, 0]} center distanceFactor={5} style={{ pointerEvents: 'none' }}>
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                padding: '15px',
                borderRadius: '8px',
                fontSize: '18px',
                textAlign: 'left',
                boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)',
              }}
            >
              <strong>Price Breakdown:</strong>
              {renderPriceDetails(priceDetails)}
            </div>
          </Html>
        )}

        {/* OrbitControls */}
        <OrbitControls enableRotate={true} enableZoom={true} />
      </Canvas>
    </div>
  );
}

export default App;
