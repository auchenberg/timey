import React, { Component } from 'react'
import Place from '../place/place'
import moment from 'moment'
import 'moment-timezone'

import './places.css'

class Places extends Component {
  constructor(props) {
    super(props)

    this.state = {
      baseTime: null
    }

    this._onKeyDown = this._onKeyDown.bind(this)
  }

  _onKeyDown(e) {
    if (!this.props.places.length) {
      return
    }

    if (!e.keyCode === 38 || !e.keyCode === 40) {
      return
    }

    if (!this.state.baseTime) {
      this.setState({
        baseTime: moment().tz(this.props.places[0].timezoneId)
      })
    }

    var currentHour = this.state.baseTime.hour()
    var newHour

    // TODO: Fix incrediment issue.
    if (e.keyCode === 38) {
      newHour = currentHour - 1
    } else if (e.keyCode === 40) {
      newHour = currentHour + 1
    }

    this.state.baseTime.hour(newHour)

    this.setState({
      baseTime: this.state.baseTime
    })
  }

  componentWillMount() {
    document.addEventListener('keydown', this._onKeyDown)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this._onKeyDown)
  }

  render() {
    return (
      <ul className="places">
        {this.props.places.map(place => {
          console.log('place: ' + place.name)
          console.error('Not an error')
          return (
            <Place
              key={place.name}
              date={new Date()}
              place={place}
              baseTime={this.state.baseTime}
              timeFormat={this.props.timeFormat}
              onPlaceRemoved={this.props.onPlaceRemoved}
              onTimeFormatChanged={this.props.onTimeFormatChanged}
            />
          )
        })}
      </ul>
    )
  }
}

export default Places
