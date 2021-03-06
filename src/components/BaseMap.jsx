import React, { Component } from 'react';
import 'whatwg-fetch';
import R from 'ramda';
import FetchHelper from '../utils/FetchHelper';
import Chart from './Chart';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/map';

class BaseMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mapName:this.props.mapName,
      option: this.props.option,
      loadedMap: this.isLoadedMap(this.props)
    };
  }
  componentWillMount() {
    if (!this.state.loadedMap) {
      this.requestMap(this.getMapName(this.state));
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!R.equals(nextProps, this.props)) {
      this.setState({
        mapName:nextProps.mapName,
        option: nextProps.option,
        loadedMap: this.isLoadedMap(nextProps)
      })
    }
  }
  shouldComponentUpdate(nextProps, nextState) {    
    if (!nextState.loadedMap) {
      this.requestMap(this.getMapName(nextProps));
      return false;
    }
    return true;
  }
  requestMap(mapName) {
    fetch(window.dominContext.staticPath + '/assets/map/' + mapName + '.json')
      .then(FetchHelper.checkStatus)
      .then(FetchHelper.parseJSON)
      .then((geoJson) => {
        echarts.registerMap(mapName, geoJson);
        this.setState({ loadedMap: true });
      })
      .catch(FetchHelper.fetchDataFailed);
  }

  getMapName(props) {
    return props.mapName;
  }
  isLoadedMap(props) {
    let mapName = this.getMapName(props);
    if (mapName == null) {
      return true;
    } else {
      if (echarts.getMap(mapName) != null) {
        return true;
      } else {
        return false;
      }
    }
  }
  render() {
    if (this.state.loadedMap) {
      return <Chart option={this.state.option} style={this.props.style} className={this.props.className} />
    } else {
      return null;
    }
  }
}

export default BaseMap;