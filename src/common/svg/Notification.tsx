import React from 'react';
import { Svg } from 'expo';
import Container from './Container';

interface Props {
  size: number;
  color: string;
  fill?: boolean;
  style?: {};
}

function Notification(props: Props) {
  return (
    <Container viewBox="0 0 24 24" {...props}>
      <Svg.G x={3.5} y={2}>
        <Svg.Path
          d="M11.7333333,18.366797 C11.7333333,19.9849415 10.4192,21.2982182 8.8,21.2982182 C7.1808,21.2982182 5.86666667,19.9849415 5.86666667,18.366797"
          stroke={props.color}
          fill={props.fill ? props.color : 'none'}
          strokeWidth={2}
          strokeLinecap="round"
          // strokeLinejoin="round"
        />
        <Svg.Path
          d="M2.93333333,6.64111256 C2.93333333,3.40335793 5.56013333,0.778270317 8.8,0.778270317 C12.0398667,0.778270317 14.6666667,3.40335793 14.6666667,6.64111256 L14.6666667,11.0382442 L17.5076,16.0260573 C17.7481333,16.5068103 17.5046667,16.9010865 16.9664,16.9010865 L0.6336,16.9010865 C0.0953333333,16.9010865 -0.148133333,16.5068103 0.0924,16.0260573 L2.93333333,11.0382442 L2.93333333,6.64111256 Z"
          stroke={props.color}
          fill={props.fill ? props.color : 'none'}
          strokeWidth={2}
          strokeLinecap="round"
        />
        <Svg.Circle stroke="#FFFFFF" fill="#00AC62" cx="15" cy="5" r="4" />
      </Svg.G>
    </Container>
  );
}

export default Notification;
