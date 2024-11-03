import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Html } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
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
  const [showControls, setShowControls] = useState(true);
  const navigate = useNavigate();

  const isTouching = useRef(false);
  const lastTouchX = useRef(0);
  const isDragging = useRef(false);
  const lastMouseX = useRef(0);

  useEffect(() => {
    setPriceDetails(outfitPrices[outfit]);
  }, [outfit]);

  // Touch event handlers
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

  // Mouse event handlers
  const onMouseDown = (event) => {
    isDragging.current = true;
    lastMouseX.current = event.clientX;
  };

  const onMouseMove = (event) => {
    if (isDragging.current) {
      const deltaX = event.clientX - lastMouseX.current;
      setRotation((prevRotation) => prevRotation + deltaX * 0.01);
      lastMouseX.current = event.clientX;
    }
  };

  const onMouseUp = () => {
    isDragging.current = false;
  };

  // Attach both mouse and touch event listeners to the document
  useEffect(() => {
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    document.addEventListener('touchstart', onTouchStart);
    document.addEventListener('touchmove', onTouchMove);
    document.addEventListener('touchend', onTouchEnd);

    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      document.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  const renderPriceDetails = (details) => (
    <ul style={{ listStyleType: 'none', padding: 0, margin: 0, fontSize: '0.9em' }}>
      {Object.entries(details).map(([item, price]) => (
        <li key={item} style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
          <span style={{ fontWeight: 'bold', marginRight: '8px' }}>{item}:</span>
          <span>${price.toFixed(2)}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <div id="canvas-container" style={{ width: '100vw', height: '100vh', position: 'relative' }}>
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

        {outfit === 'Formals' && <BaseModel1 animation={animation} rotation-y={rotation} frustumCulled={false} />}
        {outfit === 'Dress' && <BaseModel2 animation={animation} rotation-y={rotation} frustumCulled={false} />}
        {outfit === 'Cool' && <BaseModel3 animation={animation} rotation-y={rotation} frustumCulled={false} />}
        {outfit === 'Casual - Green' && <BaseModel4 animation={animation} rotation-y={rotation} frustumCulled={false} />}
        {outfit === 'Casual - Maroon' && <BaseModel5 animation={animation} rotation-y={rotation} frustumCulled={false} />}

        <Environment files="/background/studio.hdr" background ground={{ height: 5, radius: 10, scale: 20 }} />

        {showPrice && (
          <Html position={[-1.25, 3, 0]} center distanceFactor={6} style={{ pointerEvents: 'none' }}>
            <div
              style={{
                background: 'rgba(44, 62, 80, 0.85)',
                color: 'white',
                padding: '10px',
                borderRadius: '8px',
                fontSize: '14px',
                textAlign: 'left',
                boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                width: '150px',
                maxWidth: '90vw',
                wordWrap: 'break-word',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <strong>Price Breakdown:</strong>
              {renderPriceDetails(priceDetails)}
            </div>
          </Html>
        )}
      </Canvas>
      
      <button 
        onClick={() => setShowControls(!showControls)} 
        style={{
          position: 'absolute', 
          top: '10px', 
          right: '10px', 
          background: '#444', 
          color: 'white', 
          padding: '8px 12px', 
          borderRadius: '8px', 
          border: 'none'
        }}
      >
        {showControls ? 'Hide Controls' : 'Show Controls'}
      </button>

      {/* Camera Button for AR */}
      <button
        onClick={() => navigate('/ar-camera')}
        style={{
          position: 'absolute',
          top: '50px', // Positioned below the controls toggle
          right: '10px',
          background: '#444',
          color: 'white',
          padding: '8px',
          borderRadius: '8px',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center', // Centering text inside the button
          textAlign: 'center'
        }}
      >
        <ion-icon name="camera-outline" style={{ marginRight: '8px' }}></ion-icon>
        Camera
      </button>

      {showControls && (
        <div style={{
          position: 'absolute',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '90vw',
          maxWidth: '350px',
          padding: '8px',
          background: 'rgba(51, 51, 51, 0.85)',
          color: 'white',
          borderRadius: '10px',
          boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.4)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}>
          <div style={{ marginBottom: '6px', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ marginRight: '8px' }}>Animation:</label>
            <select value={animation} onChange={(e) => setAnimation(e.target.value)} style={{ margin: '0', padding: '4px', width: '70%' }}>
              <option value="Standing">Standing</option>
              <option value="Dancing">Dancing</option>
              <option value="Posing">Posing</option>
            </select>
          </div>
          <div style={{ marginBottom: '6px', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ marginRight: '8px' }}>Light Type:</label>
            <select value={lightType} onChange={(e) => setLightType(e.target.value)} style={{ margin: '0', padding: '4px', width: '70%' }}>
              <option value="Directional">Directional</option>
              <option value="Point">Point</option>
              <option value="Spot">Spot</option>
            </select>
          </div>
          <div style={{ marginBottom: '6px', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ marginRight: '8px' }}>Outfit:</label>
            <select value={outfit} onChange={(e) => setOutfit(e.target.value)} style={{ margin: '0', padding: '4px', width: '70%' }}>
              {Object.keys(outfitPrices).map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ marginRight: '8px' }}>Show Price:</label>
            <input type="checkbox" checked={showPrice} onChange={(e) => setShowPrice(e.target.checked)} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
