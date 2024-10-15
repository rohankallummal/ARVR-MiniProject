import React, { useRef, useEffect } from 'react';
import { useGLTF, useFBX, useAnimations } from '@react-three/drei';

export function BaseModel({ animation, outfit }) {
  const group = useRef();

  // Dynamically load the selected GLB file
  const { scene, nodes, materials } = useGLTF(`/GLBs/${outfit}`);

  // Load animations only once (these can be reused across outfits)
  const { animations: Standing } = useFBX('/animations/StandingIdle.fbx');
  const { animations: WalkStop } = useFBX('/animations/WalkStop.fbx');
  const { animations: WalkTurn } = useFBX('/animations/Walk180Turn.fbx');

  // Ensure animation names are consistent
  Standing[0].name = "Standing";
  WalkStop[0].name = "WalkStop";
  WalkTurn[0].name = "WalkTurn";

  const { actions } = useAnimations([Standing[0], WalkStop[0], WalkTurn[0]], group);

  useEffect(() => {
    if (actions && actions[animation]) {
      actions[animation].reset().fadeIn(0.5).play();
    }

    return () => {
      if (actions && actions[animation]) {
        actions[animation].fadeOut(0.5).stop();
      }
    };
  }, [animation, actions]);

  return (
    <group ref={group} dispose={null} scale={[2.5, 2.5, 2.5]} position={[0, -2, 0]}>
      {/* Render all objects in the loaded scene */}
      <primitive object={scene} />
    </group>
  );
}

// Preload all GLTF models
useGLTF.preload('/GLBs/outfit1.glb');
useGLTF.preload('/GLBs/outfit2.glb');
useGLTF.preload('/GLBs/outfit3.glb');
useGLTF.preload('/GLBs/outfit4.glb');
useGLTF.preload('/GLBs/outfit5.glb');