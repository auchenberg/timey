import React, { Component } from 'react'
import Rainbow from 'rainbowvis.js'
import moment from 'moment'
import 'moment-timezone'

import './place.css'

class Place extends Component {
  constructor(props) {
    super(props)

    this.onRemoveClicked = this.onRemoveClicked.bind(this)
    this.onTimeDoubleClick = this.onTimeDoubleClick.bind(this)

    this.rainbow = new Rainbow()
    this.rainbow.setSpectrum('#00000C', '#ffd895', '#ffffff', '#487a9f', '#000c32')
    this.rainbow.setNumberRange(0, 100)
  }

  getGradient() {
    var localTime = this.getLocalTime(this.props.place)
    var secondsOfDay = localTime.seconds() + 60 * (localTime.minutes() + 60 * localTime.hours())
    var secondsInDay = 86400
    var procentageOfDay = 100 * (secondsOfDay / secondsInDay)

    var color1 = '#' + this.rainbow.colourAt(-8 + procentageOfDay)
    var color2 = '#' + this.rainbow.colourAt(8 + procentageOfDay)

    return 'linear-gradient(to right, ' + color1 + ' 0%, ' + color2 + ' 100%)'
  }

  getActivityInfo(time) {
    var timeThere = parseInt(time.format('HH'), 10)
    var thisActivity = ''
    var cssClasses = ['activity']

    if (timeThere >= 22) {
      thisActivity = 'going to bed'
      cssClasses.push('state-bed')
    } else if (timeThere >= 20) {
      thisActivity = 'out for a drink'
      cssClasses.push('state-drink')
    } else if (timeThere >= 17) {
      thisActivity = 'having dinner'
      cssClasses.push('state-dinner')
    } else if (timeThere >= 14) {
      thisActivity = 'at the office'
      cssClasses.push('state-office')
    } else if (timeThere >= 11) {
      thisActivity = 'at lunch'
      cssClasses.push('state-lunch')
    } else if (timeThere >= 10) {
      thisActivity = 'at the office'
      cssClasses.push('state-office')
    } else if (timeThere >= 6) {
      thisActivity = 'having breakfast'
      cssClasses.push('state-breakfast')
    } else if (timeThere >= 0) {
      thisActivity = 'sleeping'
      cssClasses.push('state-sleeping')
    }

    return {
      text: 'is ' + thisActivity,
      cssClass: cssClasses.join(' ')
    }
  }

  getActivityInfoClass() {
    var localTime = this.getLocalTime()
    return this.getActivityInfo(localTime).cssClass
  }

  getActivityInfoText() {
    var localTime = this.getLocalTime()
    return this.getActivityInfo(localTime).text
  }

  getTimeHour = function(place) {
    var time = this.getLocalTime()
    return this.props.timeFormat === '12hours' ? time.format('hh') : time.format('HH')
  }

  getLocalTime() {
    var place = this.props.place
    var localTime = moment().tz(place.timezoneId)

    if (this.props.baseTime) {
      localTime = this.props.baseTime.tz(place.timezoneId)
    }

    return localTime
  }

  onRemoveClicked() {
    this.props.onPlaceRemoved(this.props.place)
  }

  onTimeDoubleClick(item) {
    var newTimeFormat = this.props.timeFormat === '12hours' ? '24hours' : '12hours'
    this.props.onTimeFormatChanged(newTimeFormat)
  }

  render() {
    const gradientBackground = this.getGradient()
    const activityName = this.getActivityInfoText()
    const activityClassName = this.getActivityInfoClass()
    const hourLabel = this.getTimeHour()
    const minuteLabel = this.getLocalTime().format('mm')
    const postfixLabel = this.getLocalTime().format('A')
    const dateLabel = this.getLocalTime().format('dddd, MMMM D YYYY')
    const timezoneLabel = this.getLocalTime().format('(Z zz)')

    return (
      <li style={{ background: gradientBackground }} className={'place ' + activityClassName}>
        <div className="time" onDoubleClick={this.onTimeDoubleClick}>
          <input type="number" size="1" className="hour" value={hourLabel} readOnly />
          <input type="number" size="1" tabIndex="-1" className="minute" value={minuteLabel} readOnly />
          {this.props.timeFormat === '12hours' &&
            <input type="text" size="1" tabIndex="-1" className="am-pm" value={postfixLabel} readOnly />}
         
          <div className="timezone">
            {timezoneLabel}
          </div>          
        </div>

        <div className="body">
          <span className="name">
            {this.props.place.name}
          </span>

          <span className="activity">
            {activityName}
          </span>

          <div className="date">
            {dateLabel}
          </div>               
        </div>

        <button tabIndex="-1" className="remove" onClick={this.onRemoveClicked} />
      </li>
    )
  }
}

export default Place
