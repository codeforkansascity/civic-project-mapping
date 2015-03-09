var local_default = {
    // City
    city: 'Kansas City',
    // DOM ID of where the Google Map is to be rendered
    domid: 'map-canvas',
    // Google maps API key
    googlemapsapikey: 'AIzaSyDQNzkJUiUJBqI_pex-Xe9_1JD4sf2KZS8',
    // Spread Sheet key
    spread_sheet_key: '1IFbDEk5cRKP3WuQX7gMl6XDxLYuVZ4eeq0XRluxqmEQ',   // code4kc civic-project-mapping/Information Questionaire for Project Database Responses Final

    infoboxoptions: {
        disableAutoPan: false,
        maxWidth: 0,
        pixelOffset: new google.maps.Size(-121, 0),
        zIndex: null,
        boxStyle: {
            background: "url('img/tipbox.gif') no-repeat",
            opacity: 0.92,
            width: "370px",
            height: "370px"
        },
        closeBoxMargin: "11px 4px 4px 4px",
        closeBoxURL: "img/close-button.png",
        infoBoxClearance: new google.maps.Size(25, 60),
        visible: false,
        pane: "floatPane",
        enableEventPropagation: false
    },
    // Start center latutude of the Google map
    lat: 39.0997,
    // Start center longitude of the Google map
    lng: -94.5783,
    // State
    state: 'Missouri',
    // Defined style types passed to TkMap
    styles: 'grey minlabels',
    // Initial zoom level for the Google map
    zoom: 12,
    // Zoom for finding address
    zoomaddress: 16
};
