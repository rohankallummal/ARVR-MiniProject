import React, { useRef, useEffect } from 'react';
import { useGLTF, useFBX, useAnimations } from '@react-three/drei';

export function BaseModel5(props) {
  const { animation } = props;  // The animation passed from App.jsx
  const group = useRef();

  // Load the new outfit5.glb model and animations
  const { nodes, materials } = useGLTF('/GLBs/outfit5.glb');
  const { animations: Standing } = useFBX('/animations/StandingIdle.fbx');
  const { animations: Dancing } = useFBX('/animations/Rumba Dancing.fbx');
  const { animations: Posing } = useFBX('/animations/Catwalk Idle To Twist R.fbx');

  // Ensure animations are correctly named
  Standing[0].name = "Standing";
  Dancing[0].name = "Dancing";
  Posing[0].name = "Posing";

  // Load the animations and bind them to the model
  const { actions } = useAnimations([Standing[0], Dancing[0], Posing[0]], group);

  useEffect(() => {
    if (actions && actions[animation]) {
      // Play the selected animation and fade it in
      actions[animation].reset().play();
    }

    // Cleanup when component unmounts or animation changes
    return () => {
      if (actions && actions[animation]) {
        actions[animation].stop();
      }
    };
  }, [animation, actions]);  // Dependencies on animation and actions

  return (
    <group {...props} dispose={null} ref={group} scale={[2.5, 2.5, 2.5]} position={[0, -2, 0]}>
      <group rotation-x={-Math.PI / 2}>
        <primitive object={nodes.Hips} />
        <skinnedMesh
          name="EyeLeft"
          geometry={nodes.EyeLeft.geometry}
          material={materials.Wolf3D_Eye}
          skeleton={nodes.EyeLeft.skeleton}
          morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary}
          morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences}
        />
        <skinnedMesh
          name="EyeRight"
          geometry={nodes.EyeRight.geometry}
          material={materials.Wolf3D_Eye}
          skeleton={nodes.EyeRight.skeleton}
          morphTargetDictionary={nodes.EyeRight.morphTargetDictionary}
          morphTargetInfluences={nodes.EyeRight.morphTargetInfluences}
        />
        <skinnedMesh
          name="Wolf3D_Head"
          geometry={nodes.Wolf3D_Head.geometry}
          material={materials.Wolf3D_Skin}
          skeleton={nodes.Wolf3D_Head.skeleton}
          morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary}
          morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences}
        />
        <skinnedMesh
          name="Wolf3D_Teeth"
          geometry={nodes.Wolf3D_Teeth.geometry}
          material={materials.Wolf3D_Teeth}
          skeleton={nodes.Wolf3D_Teeth.skeleton}
          morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary}
          morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences}
        />
        <skinnedMesh
          geometry={nodes.Wolf3D_Hair.geometry}
          material={materials.Wolf3D_Hair}
          skeleton={nodes.Wolf3D_Hair.skeleton}
        />
        <skinnedMesh
          geometry={nodes.Wolf3D_Outfit_Top.geometry}
          material={materials.Wolf3D_Outfit_Top}
          skeleton={nodes.Wolf3D_Outfit_Top.skeleton}
        />
        <skinnedMesh
          geometry={nodes.Wolf3D_Outfit_Bottom.geometry}
          material={materials.Wolf3D_Outfit_Bottom}
          skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton}
        />
        <skinnedMesh
          geometry={nodes.Wolf3D_Outfit_Footwear.geometry}
          material={materials.Wolf3D_Outfit_Footwear}
          skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton}
        />
        <skinnedMesh
          geometry={nodes.Wolf3D_Body.geometry}
          material={materials.Wolf3D_Body}
          skeleton={nodes.Wolf3D_Body.skeleton}
        />
      </group>
    </group>
  );
}

// Preload the new GLTF model for faster loading
useGLTF.preload('/GLBs/outfit5.glb');