import React from 'react';
import styled from 'styled-components/native';

const Container = styled.View`
  width: 100%;
  height: 70px;
  justify-content: center;
  align-items: center;
`;

const SelectedText = styled.Text``;

function SelectHeader() {
  return (
    <Container>
      <SelectedText>201 Powell St, Sanfrancisco, California</SelectedText>
    </Container>
  );
}

export default SelectHeader;
