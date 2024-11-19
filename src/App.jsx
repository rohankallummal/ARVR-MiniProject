// Importing React and hooks for managing state and lifecycle methods
import React, { useState, useEffect, useRef } from 'react';

// Importing Three.js components for rendering 3D content
import { Canvas } from '@react-three/fiber';
import { Environment, Html } from '@react-three/drei';

// Importing 3D models representing different outfits
import { BaseModel1 } from './models/BaseModel1';
import { BaseModel2 } from './models/BaseModel2';
import { BaseModel3 } from './models/BaseModel3';
import { BaseModel4 } from './models/BaseModel4';
import { BaseModel5 } from './models/BaseModel5';

// Price details for each outfit
const outfitPrices = {
  'Formals': { Shoes: 40.99, Pants: 54.99, Shirt: 49.99, Belt: 20.00 },
  'Dress': { Heels: 59.99, Dress: 79.99 },
  'Cool': { Sneakers: 39.99, Pants: 29.99, Hoodie: 19.99 },
  'Casual - Green': { Boots: 29.99, Sweatpants: 59.99, Tshirt: 89.99 },
  'Casual - Maroon': { Shoes: 74.99, Tshirt: 49.99, Jeans: 99.99 },
};

function App() {
  // State variables
  const [priceDetails, setPriceDetails] = useState(outfitPrices['Formals']); // Current price details of the selected outfit
  const [rotation, setRotation] = useState(0); // Rotation angle of the 3D model
  const [animation, setAnimation] = useState('Standing'); // Selected animation for the model
  const [lightType, setLightType] = useState('Directional'); // Type of light in the scene
  const [lightPosition, setLightPosition] = useState({ x: 0, y: 3, z: 5 }); // Position of the light source
  const [outfit, setOutfit] = useState('Formals'); // Currently selected outfit
  const [showPrice, setShowPrice] = useState(true); // Toggle to show or hide price details
  const [showControls, setShowControls] = useState(true); // Toggle to show or hide the control panel

  // References for handling touch and mouse events
  const isTouching = useRef(false);
  const lastTouchX = useRef(0);
  const isDragging = useRef(false);
  const lastMouseX = useRef(0);

  // Update the price details whenever the selected outfit changes
  useEffect(() => {
    setPriceDetails(outfitPrices[outfit]);
  }, [outfit]);

  // Touch event handlers for rotating the model on phone
  const onTouchStart = (event) => {
    isTouching.current = true; 
    lastTouchX.current = event.touches[0].clientX; // Record the initial touch position
  };

  const onTouchMove = (event) => {
    if (isTouching.current) {
      // Calculate the change in touch position
      const deltaX = event.touches[0].clientX - lastTouchX.current;
      // Update the rotation state based on touch movement
      setRotation((prevRotation) => prevRotation + deltaX * 0.01);
      lastTouchX.current = event.touches[0].clientX; // Update the last touch position
    }
  };

  const onTouchEnd = () => {
    isTouching.current = false;
  };

  // Mouse event handlers for rotating the model 
  const onMouseDown = (event) => {
    isDragging.current = true; 
    lastMouseX.current = event.clientX; // Record the initial mouse position
  };

  const onMouseMove = (event) => {
    if (isDragging.current) {
      // Calculate the change in mouse position
      const deltaX = event.clientX - lastMouseX.current;
      // Update the rotation state based on mouse movement
      setRotation((prevRotation) => prevRotation + deltaX * 0.01);
      lastMouseX.current = event.clientX; // Update the last mouse position
    }
  };

  const onMouseUp = () => {
    isDragging.current = false; // Reset the dragging state
  };

  // Attach event listeners for touch and mouse events when the component mounts
  useEffect(() => {
    // Mouse events
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    // Touch events
    document.addEventListener('touchstart', onTouchStart);
    document.addEventListener('touchmove', onTouchMove);
    document.addEventListener('touchend', onTouchEnd);

    // Cleanup event listeners when the component unmounts
    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      document.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  // Function to render the price details as a list
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
      {/* Canvas for rendering 3D content */}
      <Canvas receiveShadow shadowmap="true" shadows="true" camera={{ position: [0, 2.75, 9], fov: 50 }}>
        {/* Conditionally render the light source based on selected light type */}
        {lightType === 'Directional' && (
          <directionalLight
            castShadow
            position={[lightPosition.x, lightPosition.y, lightPosition.z]}
            intensity={1}
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

        {/* Render the selected 3D model with the specified rotation and animation */}
        {outfit === 'Formals' && (
          <BaseModel1 animation={animation} rotation-y={rotation} frustumCulled={false} />
        )}
        {outfit === 'Dress' && (
          <BaseModel2 animation={animation} rotation-y={rotation} frustumCulled={false} />
        )}
        {outfit === 'Cool' && (
          <BaseModel3 animation={animation} rotation-y={rotation} frustumCulled={false} />
        )}
        {outfit === 'Casual - Green' && (
          <BaseModel4 animation={animation} rotation-y={rotation} frustumCulled={false} />
        )}
        {outfit === 'Casual - Maroon' && (
          <BaseModel5 animation={animation} rotation-y={rotation} frustumCulled={false} />
        )}

        {/* HDRI background */}
        <Environment
          receiveShadow
          files="/background/studio.hdr"
          background
          ground={{ height: 5, radius: 10, scale: 20 }}
        />

        {/* Display the price details if showPrice is true */}
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

      {/* Button to toggle the visibility of the control panel */}
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
          border: 'none',
        }}
      >
        {showControls ? 'Hide Controls' : 'Show Controls'}
      </button>

      {/* Button to open the AR view in a new window */}
      <button
        onClick={() => window.open('/ar.html', '_blank', 'noopener,noreferrer')}
        style={{
          position: 'absolute',
          top: '50px',
          right: '10px',
          background: '#444',
          color: 'white',
          padding: '8px',
          borderRadius: '8px',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <ion-icon name="camera-outline" style={{ marginRight: '8px' }}></ion-icon>
        Camera
      </button>

      {/* Control panel for adjusting settings, visible when showControls is true */}
      {showControls && (
        <div
          style={{
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
          }}
        >
          {/* Dropdown for selecting animation */}
          <div
            style={{
              marginBottom: '6px',
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <label style={{ marginRight: '8px' }}>Animation:</label>
            <select
              value={animation}
              onChange={(e) => setAnimation(e.target.value)}
              style={{ margin: '0', padding: '4px', width: '70%' }}
            >
              <option value="Standing">Standing</option>
              <option value="Dancing">Dancing</option>
              <option value="Posing">Posing</option>
            </select>
          </div>

          {/* Dropdown for selecting light type */}
          <div
            style={{
              marginBottom: '6px',
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <label style={{ marginRight: '8px' }}>Light Type:</label>
            <select
              value={lightType}
              onChange={(e) => setLightType(e.target.value)}
              style={{ margin: '0', padding: '4px', width: '70%' }}
            >
              <option value="Directional">Directional</option>
              <option value="Point">Point</option>
              <option value="Spot">Spot</option>
            </select>
          </div>

          {/* Dropdown for selecting outfit */}
          <div
            style={{
              marginBottom: '6px',
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <label style={{ marginRight: '8px' }}>Outfit:</label>
            <select
              value={outfit}
              onChange={(e) => setOutfit(e.target.value)}
              style={{ margin: '0', padding: '4px', width: '70%' }}
            >
              {Object.keys(outfitPrices).map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>

          {/* Checkbox to toggle price details visibility */}
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <label style={{ marginRight: '8px' }}>Show Price:</label>
            <input
              type="checkbox"
              checked={showPrice}
              onChange={(e) => setShowPrice(e.target.checked)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
