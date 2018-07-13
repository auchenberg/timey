import React, { Component } from 'react'

import Places from './places/places'
import PlacePicker from './placePicker/placePicker'
import Welcome from './welcome/welcome'

import './App.css'

class App extends Component {
  constructor() {
    super()

    this.onPlaceAdded = this.onPlaceAdded.bind(this)
    this.onPlaceRemoved = this.onPlaceRemoved.bind(this)
    this.onTimeFormatChanged = this.onTimeFormatChanged.bind(this)

    this.defaultState = {
      baseTime: null,
      timeFormat: '24hour',
      showPlacePlicker: false
    }

    // Timer for rendering every minute
    let that = this
    setInterval(function() {
      that.forceUpdate()
    }, 60 * 1000)
  }

  componentWillMount() {
    this.load()
  }

  onPlaceAdded(place) {
    if (this.state.places.find(p => p.referenceId === place.referenceId)) {
      return // Item already added
    }

    var updatedPlaces = this.state.places
    updatedPlaces.push(place)
    updatedPlaces = updatedPlaces.sort((a, b) => a.name.localeCompare(b.name))

    var settings = {...this.state.settings}
    settings.showPlacePlicker = false;

    this.setState({
      places: updatedPlaces,
      settings: settings
    }, this.store)
  }

  onPlaceRemoved(place) {
    var updatedPlaces = this.state.places.filter(p => p.referenceId !== place.referenceId)

    this.setState({
      places: updatedPlaces
    }, this.store)
  }

  onAddNewClick() {
    var settings = {...this.state.settings}
    settings.showPlacePlicker = !this.state.settings.showPlacePlicker;

    this.setState({settings}, this.store)
  }

  onTimeFormatChanged(timeFormat) {
    var settings = {...this.state.settings}
    settings.timeFormat = timeFormat;

    this.setState({settings}, this.store)
  }

  load() {
    this.setState({
      places: JSON.parse(localStorage.getItem('places')) || [],
      settings: JSON.parse(localStorage.getItem('settings')) || this.defaultState
    })
  }

  store() {
    localStorage.setItem('settings', JSON.stringify(this.state.settings))
    localStorage.setItem('places', JSON.stringify(this.state.places))
  }

  render() {
    return (
      <div className={this.state.settings.showPlacePlicker ? 'app state-show-place-picker' : 'app'}>
        <PlacePicker onPlaceAdded={this.onPlaceAdded} isVisible={this.state.settings.showPlacePlicker} />

        {this.state.places.length > 0
          ? <Places
              places={this.state.places}
              baseTime={this.state.settings.baseTime}
              timeFormat={this.state.settings.timeFormat}
              onPlaceRemoved={this.onPlaceRemoved}
              onTimeFormatChanged={this.onTimeFormatChanged}
            />
          : <Welcome />}

        <button className="add-new" onClick={this.onAddNewClick.bind(this)}>
          <img src="images/ic_add_black_48px.svg" width="24" alt="" />
        </button>
      </div>
    )
  }
}

export default App
