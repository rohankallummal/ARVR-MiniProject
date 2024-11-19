// Import React and hooks for managing component lifecycle
import React, { useRef, useEffect } from 'react';

// Import Drei hooks for loading models and animations
import { useGLTF, useFBX, useAnimations } from '@react-three/drei';

export function BaseModel5(props) {
  // Extract and destructure the 'animation' prop passed from App.jsx
  const { animation } = props;

  // Create a reference to the group that will contain the model and animations
  const group = useRef();

  // Load the GLTF model
  const { nodes, materials } = useGLTF('/GLBs/outfit5.glb');

  // Load animations for the model
  const { animations: Standing } = useFBX('/animations/StandingIdle.fbx'); // Load the Standing animation
  const { animations: Dancing } = useFBX('/animations/Rumba Dancing.fbx'); // Load the Dancing animation
  const { animations: Posing } = useFBX('/animations/Catwalk Idle To Twist R.fbx'); // Load the Posing animation

  // Assign names to the animations to match the options provided
  Standing[0].name = "Standing";
  Dancing[0].name = "Dancing";
  Posing[0].name = "Posing";

  // Bind the animations to the model and get the actions object for controlling playback
  const { actions } = useAnimations([Standing[0], Dancing[0], Posing[0]], group);

  // Handle animation playback and cleanup
  useEffect(() => {
    if (actions && actions[animation]) {
      // Reset and play the selected animation when 'animation' prop changes
      actions[animation].reset().play();
    }

    // Cleanup function to stop the animation when the component unmounts or 'animation' changes
    return () => {
      if (actions && actions[animation]) {
        actions[animation].stop();
      }
    };
  }, [animation, actions]); // Dependencies array to re-run the effect when 'animation' or 'actions' change

  // Return the 3D model with animations
  return (
    <group
      {...props} // Spread any additional props passed to the component
      dispose={null} // Prevent automatic disposal of the model
      ref={group} // Attach the group reference for animation control
      scale={[2.5, 2.5, 2.5]} // Scale the model uniformly
      position={[0, -2, 0]} // Position the model in the scene
    >
      {/* Rotate the model to align it correctly in the 3D space */}
      <group rotation-x={-Math.PI / 2}>
        {/* Attach the skeleton root to the model */}
        <primitive object={nodes.Hips} />

        {/* Define the body parts of the model */}

        {/* Left eye */}
        <skinnedMesh
          name="EyeLeft"
          geometry={nodes.EyeLeft.geometry}
          material={materials.Wolf3D_Eye}
          skeleton={nodes.EyeLeft.skeleton} 
          morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary}
          morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences} 
        />

        {/* Right eye */}
        <skinnedMesh
          name="EyeRight"
          geometry={nodes.EyeRight.geometry} 
          material={materials.Wolf3D_Eye} 
          skeleton={nodes.EyeRight.skeleton} 
          morphTargetDictionary={nodes.EyeRight.morphTargetDictionary} 
          morphTargetInfluences={nodes.EyeRight.morphTargetInfluences} 
        />

        {/* Head */}
        <skinnedMesh
          name="Wolf3D_Head"
          geometry={nodes.Wolf3D_Head.geometry} 
          material={materials.Wolf3D_Skin} 
          skeleton={nodes.Wolf3D_Head.skeleton} 
          morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary} 
          morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences} 
        />

        {/* Teeth */}
        <skinnedMesh
          name="Wolf3D_Teeth"
          geometry={nodes.Wolf3D_Teeth.geometry} 
          material={materials.Wolf3D_Teeth} 
          skeleton={nodes.Wolf3D_Teeth.skeleton} 
          morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary} 
          morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences} 
        />

        {/* Hair */}
        <skinnedMesh
          geometry={nodes.Wolf3D_Hair.geometry}
          material={materials.Wolf3D_Hair} 
          skeleton={nodes.Wolf3D_Hair.skeleton} 
        />

        {/* Outfit Top */}
        <skinnedMesh
          geometry={nodes.Wolf3D_Outfit_Top.geometry} 
          material={materials.Wolf3D_Outfit_Top} 
          skeleton={nodes.Wolf3D_Outfit_Top.skeleton} 
        />

        {/* Outfit Bottom */}
        <skinnedMesh
          geometry={nodes.Wolf3D_Outfit_Bottom.geometry}
          material={materials.Wolf3D_Outfit_Bottom} 
          skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton}
        />

        {/* Footwear */}
        <skinnedMesh
          geometry={nodes.Wolf3D_Outfit_Footwear.geometry} 
          material={materials.Wolf3D_Outfit_Footwear} 
          skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton} 
        />

        {/* Body */}
        <skinnedMesh
          geometry={nodes.Wolf3D_Body.geometry} 
          material={materials.Wolf3D_Body}
          skeleton={nodes.Wolf3D_Body.skeleton} 
        />
      </group>

      {/* Notes:
        - geometry: Defines the 3D shape of a mesh.
        - material: Determines the visual appearance (textures, colors, etc.) of the mesh.
        - skeleton: Provides the bone structure for animating the mesh.
        - morphTargetDictionary: Maps morph target names to their respective indices for easy reference.
        - morphTargetInfluences: Controls the degree to which each morph target affects the mesh's shape.
      */}

    </group>
  );
}

// Preload the new GLTF model to improve performance and reduce loading times during runtime
useGLTF.preload('/GLBs/outfit5.glb');
