import React from 'react';
import { useBarcode } from '@createnextapp/react-barcode';

const  Barcodec = (props) => {
  const { inputRef } = useBarcode({
    value: props.value,
    options: {
      background: '#ffff',
    }
  });

  return <img ref={inputRef} />;
};

export default Barcodec;