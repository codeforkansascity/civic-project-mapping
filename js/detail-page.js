/**
 * @classDestription - Placeholder for Projects application variables and functions.
 * @class - Projects
 */
var DetailPage = (function($) {
    var constructor = function(infoboxoptions) {
        this.AddressMarker = null;

        this.Events = [];

        // Can we geolocate?
        this.geolocate = navigator.geolocation;

        this.getEvents = function(rows, Map, Default) {

            for (var i in rows) {
                rows[i]['name'] = rows[i]['1. Project Title/Name'];
            }
            rows.sort(function(a, b) {
                if (a.name > b.name) {
                    return 1;
                }
                if (a.name < b.name) {
                    return -1;
                }
                // a must be equal to b
                return 0;
            });

            // Copy the Project data to the Event object
            for (var i in rows) {
                this.Events[i] = new Event();
                for (var colname in rows[i]) {
                    this.Events[i].data[colname] = rows[i][colname];
                }

                var ll = this.Events[i].data['Location'];
                var lla = ll.split(',');

                if (lla.length != 2) {} else {

                    var Lat = null;
                    var Lng = null;

                    // Create the Google LatLng object

                    Lat = lla[0];
                    Lng = lla[1];

                    this.Events[i].latlng = new google.maps.LatLng(Lat, Lng);

                    var project_type = $.trim(this.Events[i].data['3. Project type']);

                    // Create the markers for each event

                    var icon = '';
                    var panel_class = '';

                    if (!(project_type in project_type_info)) {
                        project_type = 'Other';
                    }

                    icon = project_type_info[project_type].pin_url;

                    project_type_info[project_type].count++;
                    project_type_info['All'].count++;

                    panel_class = project_type_info[project_type].id + '-panel';

                    this.Events[i].marker = new google.maps.Marker({
                        position: this.Events[i].latlng,
                        map: Map.Map,
                        icon: icon,
                        shadow: 'img/shadow.png',
                        clickable: true
                    });

                    this.Events[i].panel = {
                        Lat: Lat,
                        Lng: Lng,
                        map: Map.Map
                    };

                    // Make the info box
                    this.Events[i].infobox = new InfoBox(infoboxoptions);

                    var data = this.Events[i].data;
                    var project_name = data['1. Project Title/Name'];

                    //
                    ptype = data['3. Project type'];
                    if ((typeof project_type_info[(ptype)] === 'undefined')) {
                        ptype = 'Other';
                    }

                    var title_class = 'panel-title-' + project_type_info[ptype].id;

                    var accordion = '';
                    accordion += '           <div class="panel panel-default ' + panel_class + '">' + "\n";
                    accordion += '              <div class="panel-heading ' + title_class + '" role="tab" id="heading' + i + '">' + "\n";
                    accordion += '                <h4 class="panel-title">' + "\n";
                    accordion += '                  <a class="collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapse' + i + '" aria-expanded="false" aria-controls="collapse' + i + '">' + "\n";
                    accordion += '                    ' + project_name + "\n";
                    accordion += '                  </a>' + "\n";
                    accordion += '                </h4>' + "\n";
                    accordion += '              </div>' + "\n";
                    accordion += '              <div id="collapse' + i + '" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading' + i + '">' + "\n";
                    accordion += '                <div class="panel-body">' + "\n";
                    accordion += '                <p>' + data['2. Project description'] + "\n";

                    accordion += '                <br />' + data['5. What is the start date of your project?'] + ' through ' + data['6. What is the finish date (or anticipated finish date)?'] + "\n";

                    accordion += '                <p><span style="color: grey;">Project Type: </span>' + data['3. Project type'] + '</p>' + "\n";

                    accordion += this.displayIt('', data['4. Project website or Facebook page ']);
                    accordion += this.displayIt('Phase:', data['7. What phase of the project are you in?']);
                    accordion += this.displayIt('Partners:', data['8. Who are your project partners?']);
                    accordion += this.displayIt('Neighborhood(s):', data['10. For area-wide projects, list the neighborhood(s) in which this project occurs.']);

                    var project_boundaries = data['11. For area-wide projects, does this project have more specific boundaries?'];
                    if ( project_boundaries && project_boundaries.toLocaleLowerCase() != 'no') {
                        accordion += this.displayIt('Boundaries:', project_boundaries);
                    }

                    accordion += this.displayIt('Address:', data['FullAddress']);
                    accordion += this.displayIt('Neighborhood Assoc Support:', data['12. Does the project have the support of the neighborhood association?']);

                    accordion += this.displayIt('Organization name:', data['17. Organization name']);
                    accordion += this.displayIt('', data['18. Organization website or Facebook page']);
                    accordion += this.displayIt('Contact:', data['19. Name of lead contact person for project']);
                    accordion += this.displayIt('Phone:', data['20. Phone number of the project\'s contact person']);
                    accordion += this.displayIt('Email:', data['20. Email address of the project\'s contact person']);
                    accordion += this.displayIt('Type:', data['21. Which best describes your organization?']);
                    accordion += this.displayIt('Project Needs:', data['22. The project is in need of:']);
                    accordion += this.displayIt('Will share experience:', data['23. We are happy to talk to others about our project and experience!']);



                    accordion += '' + "\n";
                    accordion += '        <br>' + "\n";
                    accordion += '                  <p><a id="show-on-map-' + i + '" type="button" class="btn btn-default" href="#">Show on map</a>' + "\n";
                    accordion += '                      <a  style="float: right;" href="mailto:info@communitykc.org?subject=Please Change ' + project_name + ' (' + i + ')">Request Change</a></p>' + "\n";
                    accordion += '                </p>' + "\n";
                    accordion += '                </div>' + "\n";
                    accordion += '              </div>' + "\n";
                    accordion += '            </div>' + "\n";

                    $('#accordion').append(accordion);
                }
            }
            for (var i in this.Events) {
                // Listen for marker clicks
                if ( this.Events[i].marker ) {              // We create events with out lat and lng and marker so we need to handle it here
                    google.maps.event.addListener(this.Events[i].marker, 'click', this.Events[i].toggleInfoBox(Map.Map, this.Events[i]));
                    $('#show-on-map-' + i).on("click", null, {
                        map: Map.Map,
                        default: Default,
                        panel: this.Events[i].panel
                    }, this.centerPin);
                }
            }

        };

        this.displayIt = function(label, value) {
            if (label) {
                if (value) {
                    return '                <p><span style="color: grey">' + label + '</span> ' + value + '</p>' + "\n";
                } else {
                    return '';
                }
            } else {
                if (value) {
                    return '                <p>' + value + '</p>' + "\n";
                } else {
                    return '';
                }
            }

        }

        /**
         * PROJECT FILTER functions
         */
        this.displayProjectTypeFilters = function() {
            for (var project_type in project_type_info) {
                var project = project_type_info[project_type];
                var li = '<li role="presentation" id="' + project.id + '" class="proj-type"><a href="#">' + project_type + '<span id="cnt-' + project.id + '" class="badge">' + project.count + '</span></a></li>';
                $("#project-type-filter-buttons").append(li);
            }
        }

        this.displayProjectTypeCounts = function() {
            for (var project_type in project_type_info) {
                var project = project_type_info[project_type];
                $('#cnt-' + project.id).html(project.count);
            }
        }

        /**
         * MAP functions
         */
        this.centerPin = function(e) {
            var Latlng = new google.maps.LatLng(
                e.data.panel.Lat,
                e.data.panel.Lng
            );
            e.data.map.setCenter(Latlng);
            e.data.map.setZoom(e.data.default.zoomaddress);
        }

        /**
         * Set the address for a latlng
         */
        this.codeLatLng = function(Latlng) {
            var Geocoder = new google.maps.Geocoder();
            Geocoder.geocode({
                    'latLng': Latlng
                },
                function(Results, Status) {
                    if (Status == google.maps.GeocoderStatus.OK) {
                        if (Results[0]) {
                            var formattedAddress = Results[0].formatted_address.split(',');
                            $('#nav-address').val(formattedAddress[0]);

                            // Mask the exact address before recording
                            // Example: '1456 W Greenleaf Ave' becomes '1400 W Greenleaf Ave'
                            var addarray = $.trim($('#nav-address').val()).split(' ');
                            // Chicago addresses start with numbers. So look for them and mask them.
                            if (addarray[0].match(/^[0-9]+$/) !== null) {
                                var replacement = addarray[0].substr(0, addarray[0].length - 2) + '00';
                                if (replacement !== '00') {
                                    addarray[0] = replacement;
                                } else {
                                    addarray[0] = '0';
                                }
                            }
                            var maskedAddress = addarray.join(' ');
                            //_gaq.push(['_trackEvent', 'Find Me', 'Address', maskedAddress]);
                        } else {
                            alert('We\'re sorry. We could not find an address for this location.');
                        }
                    } else {
                        alert('We\'re sorry. We could not find an address for this location.');
                    }
                }
            );
        };

        // Put a Pan/Zoom control on the map
        this.setFindMeControl = function(controlDiv, Map, Project, Default) {
            // Set CSS styles for the DIV containing the control
            // Setting padding to 5 px will offset the control
            // from the edge of the map.
            controlDiv.style.padding = '1em';
            // Set CSS for the control border.
            var controlUI = document.createElement('div');
            controlUI.style.backgroundColor = '#333';
            //controlUI.style.color = 'white';
            controlUI.style.borderStyle = 'solid';
            controlUI.style.borderWidth = '0px';
            controlUI.style.cursor = 'pointer';
            controlUI.style.textAlign = 'center';
            controlUI.style.borderRadius = '6px';
            controlUI.title = 'Click to find your location.';
            controlDiv.appendChild(controlUI);
            // Set CSS for the control interior.
            var controlText = document.createElement('div');
            controlText.style.fontFamily = '"Helvetica Neue",Helvetica,Arial,sans-serif';
            controlText.style.fontSize = '12px';
            controlText.style.color = '#fff';
            controlText.style.paddingLeft = '.5em';
            controlText.style.paddingRight = '.5em';
            controlText.style.paddingTop = '.3em';
            controlText.style.paddingBottom = '.3em';
            controlText.innerHTML = 'Find Me';
            controlUI.appendChild(controlText);
            // Setup the click event listeners.
            google.maps.event.addDomListener(controlUI, 'click', function() {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        // Success
                        function(position) {
                            //_gaq.push(['_trackEvent', 'GPS', 'Success']);
                            var Latlng = new google.maps.LatLng(
                                position.coords.latitude,
                                position.coords.longitude
                            );
                            Map.Map.setCenter(Latlng);
                            Map.Map.setZoom(Default.zoomaddress);
                            // Make a map marker if none exists yet
                            if (Project.AddressMarker === null) {
                                Project.AddressMarker = new google.maps.Marker({
                                    position: Latlng,
                                    map: Map.Map,
                                    icon: Default.iconlocation,
                                    clickable: false
                                });
                            } else {
                                // Move the marker to the new location
                                Project.AddressMarker.setPosition(Latlng);
                                // If the marker is hidden, unhide it
                                if (Project.AddressMarker.getMap() === null) {
                                    Project.AddressMarker.setMap(Map.Map);
                                }
                            }
                            Project.codeLatLng(Latlng);
                        },
                        // Failure
                        function() {
                            alert('We\'re sorry. We could not find you. Please type in an address.');
                        }, {
                            timeout: 5000,
                            enableHighAccuracy: true
                        }
                    );
                }
            });
        };

        this.setMapLegend = function(controlDiv, Map, Project, Default) {
            // Set CSS styles for the DIV containing the control
            // Setting padding to 5 px will offset the control
            // from the edge of the map.
            controlDiv.style.padding = '1em';
            // Set CSS for the control border.
            var controlUI = document.createElement('div');
            controlUI.style.backgroundColor = 'rgba(255,255,255,0.7)';
            //controlUI.style.color = 'white';
            controlUI.style.borderStyle = 'solid';
            controlUI.style.borderWidth = '0px';
            controlUI.style.cursor = 'pointer';
            controlUI.style.textAlign = 'center';
            controlUI.style.borderRadius = '6px';
            controlUI.title = 'Click to hide.';
            controlDiv.appendChild(controlUI);
            // Set CSS for the control interior.
            var controlText = document.createElement('div');
            controlText.style.fontFamily = '"Helvetica Neue",Helvetica,Arial,sans-serif';
            controlText.style.fontSize = '12px';
            controlText.style.color = '#333';
            controlText.style.paddingLeft = '.5em';
            controlText.style.paddingRight = '.5em';
            controlText.style.paddingTop = '.3em';
            controlText.style.paddingBottom = '.3em';
            controlText.innerHTML = '<div>Free<img src="img/blue.png" /></div>';
            controlUI.appendChild(controlText);
            // Setup the click event listeners.
            google.maps.event.addDomListener(controlUI, 'click', function() {
                Map.Map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].clear();
            });
        };

        this.setMarkersByProjectType = function(project_type_to_display) {
            if (project_type_to_display == 'all') {
                $('.panel-default').css("display", "block");
            } else {
                $('.panel-default').css("display", "none");
                $('.' + project_type_to_display + '-panel').css("display", "block");
            }

            for (var i in this.Events) {

                var ptype = this.Events[i].data['3. Project type'];

                if (project_type_to_display == 'all' || ((typeof project_type_info[(ptype)] !== 'undefined') && (project_type_info[(ptype)].id == project_type_to_display))) {
                    if ((typeof project_type_info[(ptype)] === 'undefined')) {
                        ptype = 'Other';
                    }
                    this.Events[i].marker.setIcon(project_type_info[(ptype)].pin_url);
                } else {
                    this.Events[i].marker.setIcon('img/grey-transparent.png');
                }


            }
        };
    };
    return constructor;
})(jQuery);
