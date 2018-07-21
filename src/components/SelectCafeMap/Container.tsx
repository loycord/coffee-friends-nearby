import React from 'react';
import Presenter from './Presenter';
import { StoreToProps } from '.';

class MapContainer extends React.Component<StoreToProps> {
  constructor(props: any) {
    super(props);
    this.updateUserCafe = this.updateUserCafe.bind(this);
    this.navigateCafe = this.navigateCafe.bind(this);
  }

  updateUserCafe() {
    const { selectedCafe } = this.props;
    if (selectedCafe) {
      this.props.updateUserFavoriteCafe(selectedCafe);
    }
  }

  navigateCafe() {
    const { selectedCafe } = this.props;
    if (selectedCafe) {
      this.props.navigation.navigate('Cafe', {
        cafeId: selectedCafe.docId,
        isFavoriteCafeSelect: true
      });
    }
  }

  render() {
    return (
      <Presenter
        selectedCafe={this.props.selectedCafe}
        updateUserCafe={this.updateUserCafe}
        navigateCafe={this.navigateCafe}
      />
    );
  }
}

export default MapContainer;
