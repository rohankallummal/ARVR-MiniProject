import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Html } from '@react-three/drei';
import { BaseModel1 } from './models/BaseModel1';
import { BaseModel2 } from './models/BaseModel2';
import { BaseModel3 } from './models/BaseModel3';
import { BaseModel4 } from './models/BaseModel4';
import { BaseModel5 } from './models/BaseModel5';

const outfitPrices = {
  'Formals': { Shoes: 40.99, Pants: 54.99, Shirt: 49.99, Belt: 20.00 },
  'Dress': { Heels: 59.99, Dress: 79.99 },
  'Cool': { Sneakers: 39.99, Pants: 29.99, Hoodie: 19.99 },
  'Casual - Green': { Boots: 29.99, Sweatpants: 59.99, Tshirt: 89.99 },
  'Casual - Maroon': { Shoes: 74.99, Tshirt: 49.99, Jeans: 99.99 },
};

function App() {
  const [priceDetails, setPriceDetails] = useState(outfitPrices['Formals']);
  const [rotation, setRotation] = useState(0);
  const [animation, setAnimation] = useState('Standing');
  const [lightType, setLightType] = useState('Directional');
  const [lightPosition, setLightPosition] = useState({ x: 0, y: 3, z: 5 });
  const [outfit, setOutfit] = useState('Formals');
  const [showPrice, setShowPrice] = useState(true);

  const isTouching = useRef(false);
  const lastTouchX = useRef(0);

  useEffect(() => {
    setPriceDetails(outfitPrices[outfit]);
  }, [outfit]);

  const onTouchStart = (event) => {
    isTouching.current = true;
    lastTouchX.current = event.touches[0].clientX;
  };

  const onTouchMove = (event) => {
    if (isTouching.current) {
      const deltaX = event.touches[0].clientX - lastTouchX.current;
      setRotation((prevRotation) => prevRotation + deltaX * 0.01);
      lastTouchX.current = event.touches[0].clientX;
    }
  };

  const onTouchEnd = () => {
    isTouching.current = false;
  };

  useEffect(() => {
    document.addEventListener('touchstart', onTouchStart);
    document.addEventListener('touchmove', onTouchMove);
    document.addEventListener('touchend', onTouchEnd);

    return () => {
      document.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  const renderPriceDetails = (details) => (
    <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
      {Object.entries(details).map(([item, price]) => (
        <li key={item} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontWeight: 'bold', marginRight: '8px' }}>{item}:</span>
          <span>${price.toFixed(2)}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <div id="canvas-container" style={{ width: '100vw', height: '100vh' }}>
      <Canvas shadowmap="true" shadows="true" camera={{ position: [0, 2.75, 9], fov: 50 }}>
        {lightType === 'Directional' && (
          <directionalLight
            castShadow
            position={[lightPosition.x, lightPosition.y, lightPosition.z]}
            intensity={1}
          />
        )}
        {lightType === 'Point' && (
          <pointLight castShadow position={[lightPosition.x, lightPosition.y, lightPosition.z]} intensity={70} />
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

        {outfit === 'Formals' && <BaseModel1 animation={animation} rotation-y={rotation} />}
        {outfit === 'Dress' && <BaseModel2 animation={animation} rotation-y={rotation} />}
        {outfit === 'Cool' && <BaseModel3 animation={animation} rotation-y={rotation} />}
        {outfit === 'Casual - Green' && <BaseModel4 animation={animation} rotation-y={rotation} />}
        {outfit === 'Casual - Maroon' && <BaseModel5 animation={animation} rotation-y={rotation} />}

        <Environment files="/background/studio.hdr" background ground={{ height: 5, radius: 10, scale: 20 }} />

        {showPrice && (
          <Html position={[-2, 2, 0]} center distanceFactor={5} style={{ pointerEvents: 'none' }}>
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(44, 62, 80, 0.85), rgba(149, 165, 166, 0.85))',
                color: 'white',
                padding: '15px',
                borderRadius: '12px',
                fontSize: '18px',
                textAlign: 'left',
                boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                animation: 'fadeIn 0.5s ease-in',
              }}
            >
              <strong>Price Breakdown:</strong>
              {renderPriceDetails(priceDetails)}
            </div>
          </Html>
        )}
      </Canvas>
      
      {/* Mobile control panel */}
      <div style={{ position: 'absolute', bottom: 20, left: 20, right: 20, padding: '10px', background: '#333', color: 'white', borderRadius: '10px' }}>
        <div>
          <label>Animation:</label>
          <select value={animation} onChange={(e) => setAnimation(e.target.value)} style={{ margin: '5px', padding: '5px' }}>
            <option value="Standing">Standing</option>
            <option value="Dancing">Dancing</option>
            <option value="Posing">Posing</option>
          </select>
        </div>
        <div>
          <label>Light Type:</label>
          <select value={lightType} onChange={(e) => setLightType(e.target.value)} style={{ margin: '5px', padding: '5px' }}>
            <option value="Directional">Directional</option>
            <option value="Point">Point</option>
            <option value="Spot">Spot</option>
          </select>
        </div>
        <div>
          <label>Outfit:</label>
          <select value={outfit} onChange={(e) => setOutfit(e.target.value)} style={{ margin: '5px', padding: '5px' }}>
            {Object.keys(outfitPrices).map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Show Price:</label>
          <input type="checkbox" checked={showPrice} onChange={(e) => setShowPrice(e.target.checked)} style={{ marginLeft: '5px' }} />
        </div>
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default App;
