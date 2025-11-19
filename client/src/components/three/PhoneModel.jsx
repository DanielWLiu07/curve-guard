import React from 'react';
import GLTFModel from './GLTFModel';

const PhoneModel = ({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1.2 }) => {
  return (
    <GLTFModel
      url="/minimal_phone.glb"
      position={position}
      rotation={rotation}
      scale={scale}
    />
  );
};

export default PhoneModel;