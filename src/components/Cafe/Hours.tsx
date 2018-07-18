import React from 'react';
import styled from 'styled-components/native';

const HoursTimeView = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
`;
const HoursTimeText = styled.Text`
  font-size: 13px;
  color: #5c6979;
  ${(props: any) => props.bold && `font-weight: 800;`};
  padding-top: 8px;
`;

const HoursTime = ({ day, time, bold }: any) => (
  <HoursTimeView>
    <HoursTimeText bold={bold}>{day}</HoursTimeText>
    <HoursTimeText bold={bold}>{time}</HoursTimeText>
  </HoursTimeView>
);

function Hours(data: any) {
  return (
    <React.Fragment>
      <HoursTime bold day="Today" time="5:30 AM to 10:00 PM" />
      <HoursTime day="Tomorrow" time="5:00 AM to 10:30 PM" />
      <HoursTime day="Tuesday" time="4:30 AM to 10:30 PM" />
      <HoursTime day="Wednesday" time="4:30 AM to 10:30 PM" />
      <HoursTime day="Thursday" time="4:30 AM to 10:30 PM" />
      <HoursTime day="Friday" time="4:30 AM to 11:00 PM" />
      <HoursTime day="Saturday" time="5:00 AM to 10:30 PM" />
    </React.Fragment>
  );
}


export default Hours;
