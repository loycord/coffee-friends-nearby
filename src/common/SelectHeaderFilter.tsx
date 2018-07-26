import React from 'react';
import { LayoutAnimation, UIManager, Platform } from 'react-native';
import styled from 'styled-components/native';
import Location from './svg/Location';
import Down from './svg/Down';
import Tick from './svg/Tick';
// types
import { Cafe } from '../redux/types';

const Container = styled.View`
  margin-top: 32px;
`;
const FilterButtonContainer = styled.TouchableOpacity`
  width: 100%;
  padding: 15px;
  padding-top: 0px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
const SelectedText = styled.Text`
  margin-left: 10px;
  margin-right: 8px;
`;
const FilterContainer = styled.View`
  padding-left: 25px;
  padding-right: 25px;
  margin-bottom: 22px;
`;
const FilterRow = styled.TouchableOpacity`
  background-color: #f1f1f1;
  border-bottom-width: 1px;
  border-bottom-color: #fff;
  padding: 15px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const FilterText = styled.Text`
  font-size: 12px;
  color: #676464;
`;

function FilterItem({
  isSelected,
  text,
  onPress
}: {
  isSelected: boolean;
  text: string;
  onPress: () => void;
}) {
  return (
    <FilterRow onPress={isSelected ? () => {} : onPress}>
      <FilterText>{text}</FilterText>
      {isSelected && <Tick size={13} color="#5c6979" />}
    </FilterRow>
  );
}

interface Props {
  filter: 'cafeId' | 'city' | 'countryCode' | 'all';
  favoriteCafe: Cafe;
  handleChangeFilter: (
    filter: 'cafeId' | 'city' | 'countryCode' | 'all'
  ) => void;
  isFilterOpen: boolean;
  handleOnPressFilter: () => void;
  style?: {};
}

function findCurrentFilter(filter: string, favoriteCafe: Cafe) {
  switch (filter) {
    case 'cafeId':
      if (favoriteCafe.name.length > 20) {
        return favoriteCafe.name.slice(0, 17) + '...';
      }
      return favoriteCafe.name;
    case 'city':
      return favoriteCafe.city;
    case 'cafeCity':
      return favoriteCafe.city;
    case 'countryCode':
      return favoriteCafe.countryCode;
    case 'cafeCountryCode':
      return favoriteCafe.countryCode;
    case 'all':
      return 'Around the world';
    default:
      break;
  }
}

class SelectHeaderFilter extends React.PureComponent<Props> {
  constructor(props: any) {
    super(props);
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental &&
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    this.handleAnimationFun = this.handleAnimationFun.bind(this);
  }

  handleAnimationFun(fun: any) {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    fun();
  }

  render() {
    return (
      <Container style={this.props.style}>
        <FilterButtonContainer
          onPress={() => {
            LayoutAnimation.configureNext(
              LayoutAnimation.Presets.easeInEaseOut
            );
            this.props.handleOnPressFilter();
          }}
        >
          <Location size={20} color="#676464" fill />
          <SelectedText>
            {findCurrentFilter(this.props.filter, this.props.favoriteCafe)}
          </SelectedText>
          <Down size={14} color="#676464" isOpen={this.props.isFilterOpen} />
        </FilterButtonContainer>
        {this.props.isFilterOpen && (
          <FilterContainer>
            <FilterItem
              isSelected={this.props.filter === 'cafeId'}
              text={this.props.favoriteCafe.name}
              onPress={() =>
                this.handleAnimationFun(() =>
                  this.props.handleChangeFilter('cafeId')
                )
              }
            />
            <FilterItem
              isSelected={this.props.filter === 'city'}
              text={this.props.favoriteCafe.city}
              onPress={() =>
                this.handleAnimationFun(() =>
                  this.props.handleChangeFilter('city')
                )
              }
            />
            <FilterItem
              isSelected={this.props.filter === 'countryCode'}
              text={this.props.favoriteCafe.countryCode}
              onPress={() =>
                this.handleAnimationFun(() =>
                  this.props.handleChangeFilter('countryCode')
                )
              }
            />
            <FilterItem
              isSelected={this.props.filter === 'all'}
              text="Around the world"
              onPress={() =>
                this.handleAnimationFun(() =>
                  this.props.handleChangeFilter('all')
                )
              }
            />
          </FilterContainer>
        )}
      </Container>
    );
  }
}

export default SelectHeaderFilter;
