import React from 'react';
import Presenter from './Presenter';
import { StoreToProps } from '.';

class MapContainer extends React.Component<StoreToProps> {
  constructor(props: any) {
    super(props);
    this.updateUserCafe = this.updateUserCafe.bind(this);
  }

  updateUserCafe() {
    const { selectedCafe } = this.props;
    if (selectedCafe) {
      this.props.updateUserFavoriteCafe(selectedCafe);
    }
  }

  render() {
    return (
      <Presenter
        selectedCafe={this.props.selectedCafe}
        updateUserCafe={this.updateUserCafe}
      />
    );
  }
}

export default MapContainer;
