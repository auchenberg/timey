import React, { Component } from 'react'
import './clock.css'

class Clock extends Component {
  constructor() {
    super()

    this.state = {
      hour: {
        x1: null,
        x2: null,
        y1: null,
        y2: null
      },
      minute: {
        x1: null,
        x2: null,
        y1: null,
        y2: null
      },
      second: {
        x1: null,
        x2: null,
        y1: null,
        y2: null
      }
    }
  }

  render() {
    return (
      <svg className="clock" viewBox="0 0 106 106">
        <circle cx="53" cy="53" className="clock" r="50" />
        <circle className=" edge" cx="53" cy="53" r="45.7" />

        <g className="hands">
          <line
            className="hour"
            x1={this.state.hour.x1}
            x2={this.state.hour.x2}
            y1={this.state.hour.y1}
            y2={this.state.hour.y2}
          />
          <line
            className="minute"
            x1={this.state.minute.x1}
            x2={this.state.minute.x2}
            y1={this.state.minute.y1}
            y2={this.state.minute.y2}
          />
          <line
            className="second"
            x1={this.state.second.x1}
            x2={this.state.second.x2}
            y1={this.state.second.y1}
            y2={this.state.second.y2}
          />
        </g>

        <g className="ticks">
          <g>
            <rect fill="#414042" height="1.6" width="5.9" x="11.6" y="52.2" />
            <rect fill="#414042" height="1.6" width="5.9" x="88.5" y="52.2" />
          </g>
          <g>
            <rect fill="#414042" height="5.9" width="1.6" x="52.2" y="88.5" />
            <rect fill="#414042" height="5.9" width="1.6" x="52.2" y="11.6" />
          </g>
          <g>
            <rect
              fill="#414042"
              height="5.9"
              transform="matrix(0.7071 0.7071 -0.7071 0.7071 64.2584 5.227)"
              width="1.6"
              x="25"
              y="77.2"
            />
            <rect
              fill="#414042"
              height="5.9"
              transform="matrix(0.7071 0.7071 -0.7071 0.7071 41.7416 -49.1336)"
              width="1.6"
              x="79.4"
              y="22.9"
            />
          </g>
          <g>
            <rect
              fill="#414042"
              height="1.6"
              transform="matrix(0.7071 0.7071 -0.7071 0.7071 80.1803 -33.2118)"
              width="5.9"
              x="77.2"
              y="79.4"
            />
            <rect
              fill="#414042"
              height="1.6"
              transform="matrix(0.7071 0.7071 -0.7071 0.7071 25.8197 -10.6949)"
              width="5.9"
              x="22.9"
              y="25"
            />
          </g>
        </g>

        <g className="center">
          <circle cx="53" cy="53" fill="#414042" r="3.1" />
          <circle cx="53" cy="53" fill="#F1F2F2" r="2.4" />
          <circle cx="53" cy="53" fill="#CF2257" r="1.8" />
        </g>
      </svg>
    )
  }

  componentDidMount() {
    var that = this
    setInterval(() => {
      that.drawHands()
    }, 1000)

    this.drawHands()
  }

  drawHands() {
    // Constants for hand's sizes.
    var SECONDS_HAND_SIZE = 0.65,
      MINUTES_HAND_SIZE = 0.55,
      HOURS_HAND_SIZE = 0.4

    var circle = document.querySelector('.edge')

    if(!circle) {
      return
    }

    // Clock Circle's Properties
    var r = circle.getAttribute('r'),
      cx = parseInt(circle.getAttribute('cx')),
      cy = parseInt(circle.getAttribute('cy'))

    // Current time.
    var currentTime = new Date()

    // // Draw Hands
    this.drawHand('second', currentTime.getSeconds(), SECONDS_HAND_SIZE, 6, r, cx, cy)
    this.drawHand('minute', currentTime.getMinutes(), MINUTES_HAND_SIZE, 6, r, cx, cy)
    this.drawHand('hour', currentTime.getHours(), HOURS_HAND_SIZE, 6, r, cx, cy)
  }

  drawHand(hand, value, size, degrees, r, cx, cy) {
    var deg = degrees * value
    var x2 = getX(deg, r, size, cx)
    var y2 = getY(deg, r, size, cy)

    var state = {}
    state[hand] = {}
    state[hand].x1 = cx
    state[hand].x2 = x2

    state[hand].y1 = cy
    state[hand].y2 = y2

    this.setState(state)
  }
}

function getX(degrees, r, adjust, x) {
  var x = x || r,
    adj = adjust || 1
  return x + r * adj * Math.cos(getRad(degrees))
}

function getY(degrees, r, adjust, y) {
  var y = y || r,
    adj = adjust || 1
  return y + r * adj * Math.sin(getRad(degrees))
}

function getRad(degrees) {
  var adjust = Math.PI / 2
  return degrees * Math.PI / 180 - adjust
}

export default Clock
