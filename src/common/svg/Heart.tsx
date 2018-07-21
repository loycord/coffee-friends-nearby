import React from 'react';
import { Svg } from 'expo';
import Container from './Container';

interface Props {
  size: number;
  color: string;
  fill?: boolean;
  style?: {};
}

function Heart(props: Props) {
  return (
    <Container viewBox="0 0 24 21" {...props}>
      <Svg.Path
        d="M24,6.27q0,3-3.07,6l-8.34,8a.84.84,0,0,1-1.18,0L3.05,12.27a4.42,4.42,0,0,1-.37-.35q-.23-.24-.74-.88A11.85,11.85,0,0,1,1,9.74,8.11,8.11,0,0,1,.31,8.12,5.87,5.87,0,0,1,0,6.27,6.14,6.14,0,0,1,1.7,1.66,6.44,6.44,0,0,1,6.4,0,5.34,5.34,0,0,1,8.1.29a6.86,6.86,0,0,1,1.61.78q.74.49,1.28.92a12.34,12.34,0,0,1,1,.91A12.34,12.34,0,0,1,13,2q.54-.43,1.28-.92A6.86,6.86,0,0,1,15.9.29,5.34,5.34,0,0,1,17.6,0a6.44,6.44,0,0,1,4.7,1.66A6.14,6.14,0,0,1,24,6.27Z"
        stroke={props.color}
        fill={props.fill ? props.color : 'none'}
        strokeWidth={1}
      />
    </Container>
  );
}

export default Heart;
