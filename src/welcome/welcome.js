import React, { Component } from 'react'
import Clock from '../clock/clock'

import './welcome.css'

class Welcome extends Component {
  render() {
    return (
      <div className="welcome">
        <div className="inner">
          <div className="clock-container">
            <Clock />
          </div>

          <h1>Add timezones to get started</h1>
          <h2>Scheduling a meeting? Send a link.</h2>
        </div>
      </div>
    )
  }
}

export default Welcome
