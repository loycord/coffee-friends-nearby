import React from 'react';
import Presenter from './Presenter';
import { StoreToProps } from '.';
import { getLocations } from '../../redux/modules/gps';
import { GeoPoint, Cafe, Location } from '../../redux/types';

interface Region {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export interface State {
  isLoading: boolean;
  location: Location | null;
  region: Region | null;
  data: Array<any> | null;
  dataRegion: Region | null;
}

class MapContainer extends React.Component<StoreToProps, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      isLoading: false,
      location: null,
      region: null,
      dataRegion: null,
      data: null
    };

    this.getGeoData = this.getGeoData.bind(this);
    this.handleGetMarkerData = this.handleGetMarkerData.bind(this);
    this.onRegionChangeComplete = this.onRegionChangeComplete.bind(this);
    this.onPressMarker = this.onPressMarker.bind(this);
    this.onPressMap = this.onPressMap.bind(this);
  }

  static getDerivedStateFromProps(props: StoreToProps, state: State) {
    if (state.location === null && props.location) {
      return {
        location: props.location,
        region: {
          latitude: props.location.coords.latitude,
          longitude: props.location.coords.longitude,
          latitudeDelta: 0.0695,
          longitudeDelta: 0.0317
        },
        dataRegion: {
          latitude: props.location.coords.latitude,
          longitude: props.location.coords.longitude,
          latitudeDelta: 0.0695,
          longitudeDelta: 0.0317
        }
      };
    }
    return null;
  }

  componentDidUpdate(prevProps: StoreToProps) {
    if (
      prevProps.location === null &&
      this.props.location &&
      this.state.dataRegion
    ) {
      this.handleGetMarkerData(this.state.dataRegion);
    }
  }

  componentDidMount() {
    this.props.setGPS();
  }

  handleGetMarkerData(currentRegion: Region) {
    if (this.state.dataRegion) {
      const {
        dataRegion: { latitude, longitude }
      } = this.state;

      const xDiff = Math.abs(latitude - currentRegion.latitude);
      const yDiff = Math.abs(longitude - currentRegion.longitude);

      if (xDiff > 0.1 || yDiff > 0.1 || !this.state.data) {
        console.log('start handle GetMarker');
        this.getGeoData(currentRegion);
      }
    }
  }

  getGeoData(region: Region) {
    this.setState({ isLoading: true });
    const { latitude, longitude } = region;
    const area = { center: { latitude, longitude }, radius: 5 };
    getLocations(area, 'cafes')
      .then(data => {
        console.log('DATA UPDATE :: ', region);
        this.setState({ data, dataRegion: region, isLoading: false });
      })
      .catch(error => console.log(error));
  }

  onRegionChangeComplete(region: Region) {
    console.log('ON_REGION_CHANGE :: ', region);
    // this.setState({ region });
    this.handleGetMarkerData(region);
  }

  onPressMarker(coordinate: GeoPoint, data: Cafe) {
    console.log('PRESS MARKRKEEKR :: ', coordinate, data);
    if (data !== null) {
      this.props.selectCafe(data);
    }
  }

  onPressMap(e: any) {
    if (e.target < 200) {
      this.props.resetCafe();
    }
  }

  render() {
    return (
      <Presenter
        {...this.props}
        {...this.state}
        onPressMarker={this.onPressMarker}
        onRegionChangeComplete={this.onRegionChangeComplete}
        onPressMap={this.onPressMap}
      />
    );
  }
}

export default MapContainer;
