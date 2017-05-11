import React, { Component } from 'react';

import Places from './places/places'
import PlacePicker from './placePicker/placePicker'
import Welcome from './welcome/welcome'

import './App.css';

class App extends Component {

  constructor() {
    super();

    this.onPlaceAdded = this.onPlaceAdded.bind(this)
    this.onPlaceRemoved = this.onPlaceRemoved.bind(this)
    this.onTimeFormatChanged = this.onTimeFormatChanged.bind(this)

    this.state = {
      baseTime: null,
      showPlacePlicker: false,
      places: [],
      timeFormat: '24hour'
    }

    // Timer for rendering every minute
    let that = this;
    setInterval(function() {
      that.forceUpdate();
    }, 60 * 1000);
    
  }

  componentWillMount() {
    this.load();
  }

  onPlaceAdded(place) {

    if(this.state.places.find(p => p.referenceId === place.referenceId)) {
      return // Item already added
    }

    var updatedPlaces = this.state.places;
    updatedPlaces.push(place);
    updatedPlaces = updatedPlaces.sort((a, b) => a.name.localeCompare(b.name))

    this.setState({
      places: updatedPlaces,
      showPlacePlicker: false
    }, () => {
      this.store()
    })
  }

  onPlaceRemoved(place) {
    var updatedPlaces = this.state.places.filter(p => p.referenceId !== place.referenceId)

    this.setState({
      places: updatedPlaces
    }, () => {
      this.store()
    })  

  }

  onAddNewClick() {
    this.setState({
      showPlacePlicker: !this.state.showPlacePlicker
    }) 
  }

  onTimeFormatChanged(timeFormat) {
    this.setState({
      timeFormat: timeFormat
    })
  }

  load() {
    this.setState({
      places: JSON.parse(localStorage.getItem('places')) || []
    })
  }

  store() {
    localStorage.setItem('places', JSON.stringify(this.state.places));
  }
  
  render() {
    return (
      <div className={ this.state.showPlacePlicker ? 'app state-show-place-picker' : 'app'}>

        <PlacePicker onPlaceAdded={this.onPlaceAdded} isVisible={this.state.showPlacePlicker} />

        { this.state.places.length > 0 ?
          <Places 
            places={this.state.places} 
            baseTime={this.state.baseTime} 
            timeFormat={this.state.timeFormat}
            onPlaceRemoved={this.onPlaceRemoved} 
            onTimeFormatChanged={this.onTimeFormatChanged}
         /> : <Welcome />
        }

        <button className="add-new" onClick={this.onAddNewClick.bind(this)}>
          <img src="images/ic_add_black_48px.svg" width="24" alt="" />
        </button>
      </div>
    );
  }
}

export default App;
