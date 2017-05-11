import React, { Component } from 'react';
import './placePicker.css';

class PlacePicker extends Component {

    componentDidMount() {
        this.elmSearchInput = document.querySelector('.new-city-input');

        if(window.google) {
            this.autocompleter = new window.google.maps.places.Autocomplete(this.elmSearchInput, {
                types: ['(regions)']
            });

            window.google.maps.event.addListener(this.autocompleter, 'place_changed', this.onAutoCompleteSuccess.bind(this));
        }
    }

    componentDidUpdate() {
        if(this.props.isVisible) {            
            this.elmSearchInput.focus()
        }
    }

    onAutoCompleteSuccess() {
        var place = this.autocompleter.getPlace();
        this.addNewPlace(place);

        setTimeout(() => {
            this.elmSearchInput.value = '';
        }, 1);        
    }

    addNewPlace(gPlace) {
        
        var req = window.fetch('https://timezoneapi.io/api/address/?' + gPlace.formatted_address);

        req.then( (response) => { return response.json()}).then( (response) => {

            // TODO: Fix .data.data
            var timeZoneName =  response.data.data.addresses ? response.data.addresses[0].timezone.id : ''

            var place = {
                referenceId: gPlace.reference,
                timezoneId: timeZoneName,
                name: gPlace.name,
                lng: gPlace.geometry.location.lng(),
                lat: gPlace.geometry.location.lat()
            }

            this.props.onPlaceAdded(place)

        }, function onError() {

        });
    }    

    render() {
        return (
            <div className="placePicker">
                <div className="map"></div>
                <input className="new-city-input" tabIndex="-1" type="text" size="50" placeholder="Type to add timezone..." autoComplete="on"  autoFocus/>'
            </div>
        )
    }
}

export default PlacePicker
