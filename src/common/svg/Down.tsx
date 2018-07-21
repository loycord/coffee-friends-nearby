import React from 'react';
import { Svg } from 'expo';
import Container from './Container';

interface Props {
  size: number;
  color: string;
  fill?: boolean;
  style?: {};
}

function Down(props: Props) {
  return (
    <Container viewBox="0 0 10 6" {...props}>
      <Svg.Path
        d="M6.94280904,8 L10.4714045,4.47140452 C10.731754,4.21105499 10.731754,3.78894501 10.4714045,3.52859548 C10.211055,3.26824595 9.78894501,3.26824595 9.52859548,3.52859548 L5.52859548,7.52859548 C5.26824595,7.78894501 5.26824595,8.21105499 5.52859548,8.47140452 L9.52859548,12.4714045 C9.78894501,12.731754 10.211055,12.731754 10.4714045,12.4714045 C10.731754,12.211055 10.731754,11.788945 10.4714045,11.5285955 L6.94280904,8 Z"
        stroke={props.color}
        fill="none"
        strokeWidth={2}
      />
    </Container>
  );
}

export default Down;
