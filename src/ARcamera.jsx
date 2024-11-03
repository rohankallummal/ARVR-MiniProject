import React from "react";

const ARCamera = () => {
  return (
    <div style={{ margin: 0, overflow: "hidden" }}>
      <a-scene
        vr-mode-ui="enabled: false"
        loading-screen="enabled: false"
        renderer="logarithmicDepthBuffer: true"
        arjs="trackingMethod: best; sourceType: webcam; debugUIEnabled: false"
        id="scene"
        embedded
        gesture-detector=""
      >
        <a-assets>
          <a-asset-item id="animated-asset" src="/assets/asset.glb"></a-asset-item>
        </a-assets>

        <a-marker
          id="animated-marker"
          type="pattern"
          preset="custom"
          url="/assets/marker.patt"
          raycaster="objects: .clickable"
          emitevents="true"
          cursor="fuse: false; rayOrigin: mouse"
          markerhandler=""
        >
          <a-entity
            id="bowser-model"
            scale="0.5 0.5 0.5"
            animation-mixer="loop: repeat"
            gltf-model="#animated-asset"
            className="clickable"
            gesture-handler=""
          ></a-entity>
        </a-marker>

        <a-entity camera></a-entity>
      </a-scene>
    </div>
  );
};

export default ARCamera;
