/**
 * @classDestription - Placeholder for Projects application variables and functions.
 * @class - Projects
 */
var Projects = (function($) {
    var constructor = function(infoboxoptions) {
        this.AddressMarker = null;

        this.Events = [];

        this.funcs = [ ];
        this.projfuncs = [ ];

        // Can we geolocate?
        this.geolocate = navigator.geolocation;

        this.getEvents = function(rows, Map, project_type_info, Default) {

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

                if (lla.length != 2) {
                } else {

                    var Lat = null;
                    var Lng = null;

                    // Create the Google LatLng object

                    Lat = lla[0];
                    Lng = lla[1];

                    var icon = '';
                    var panel_class = '';

                    var stripe = ['','','','','',''];
                    var stripe_offset = 0;


                    this.Events[i].latlng = new google.maps.LatLng(Lat, Lng);

                    var project_types = $.trim(this.Events[i].data['3. Project type']);      // Start project type

                    for (var project_type in project_type_info) {
                        var project = project_type_info[project_types];

                        if ( project_types.indexOf(project_type) > -1) {
                            panel_class += project_type_info[project_type].id + '-panel ';
                            stripe[ stripe_offset++ ] =  ' panel-strip panel-title-' + project_type_info[project_type].id.toString();

                            project_type_info[project_type].count++;
                            project_type_info['All'].count++;
                            icon = project_type_info[project_type].pin_url;
                        }

                    }

                    console.log(rows[i]['name']);
                    console.log(project_types);
                    console.log(panel_class);
                    console.log(stripe);

                    // Create the markers for each event

                    if (stripe_offset == 0) {                                               // We did not find one.
                        project_type_info['Other'].count++;
                        project_type_info['All'].count++;

                    }

                    this.Events[i].marker = new google.maps.Marker({                        // Create map marker
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

                    var accordion = '';
                    accordion += '           <div class="panel panel-default ' + panel_class + '">' + "\n";
                    accordion += '              <div class="panel-heading" role="tab" id="heading' + i + '">' + "\n";

                    accordion += '                <h4 class="panel-title">' + "\n";
                    accordion += '                <span class="title-stripe' + stripe[0] + '">&nbsp;</span>' + "\n";
                    accordion += '                <span class="title-stripe' + stripe[1] + '">&nbsp;</span>' + "\n";
                    accordion += '                <span class="title-stripe' + stripe[2] + '">&nbsp;</span>' + "\n";
                    accordion += '                <span class="title-stripe' + stripe[3] + '">&nbsp;</span>' + "\n";
                    accordion += '                  <a id="link' + i + '" class="collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapse' + i + '" aria-expanded="false" aria-controls="collapse' + i + '">' + "\n";
                    accordion += '                    ' + project_name + "\n";
                    accordion += '                  </a>' + "\n";
                    accordion += '                </h4>' + "\n";
                    accordion += '              </div>' + "\n";
                    accordion += '              <div id="collapse' + i + '" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading' + i + '">' + "\n";
                    accordion += '                <div class="panel-body">' + "\n";
                    accordion += '                <p>' + data['2. Project description'] + "\n";

                    accordion += '                <br />' + data['5. What is the start date of your project?'] + ' through ' + data['6. What is the finish date (or anticipated finish date)?'] + "\n";

                    accordion += '                <p><span style="color: grey;">Project Type: </span>' + data['3. Project type'] + '</p>' + "\n";

                    accordion += this.displayAsLink('', data['4. Project website or Facebook page ']);
                    accordion += this.displayIt('Phase:', data['7. What phase of the project are you in?']);
                    accordion += this.displayIt('Partners:', data['8. Who are your project partners?']);
                    accordion += this.displayIt('Neighborhood(s):', data['10. For area-wide projects, list the neighborhood(s) in which this project occurs.']);

                    var project_boundaries = data['11. For area-wide projects, does this project have more specific boundaries?'];
                    if (project_boundaries && project_boundaries.toLocaleLowerCase() != 'no') {
                        accordion += this.displayIt('Boundaries:', project_boundaries);
                    }

                    accordion += this.displayIt('Address:', data['FullAddress']);
                    accordion += this.displayIt('Neighborhood Assoc Support:', data['12. Does the project have the support of the neighborhood association?']);

                    accordion += this.displayIt('Organization name:', data['17. Organization name']);
                    accordion += this.displayAsLink('', data['18. Organization website or Facebook page']);
                    accordion += this.displayIt('Contact:', data['19. Name of lead contact person for project']);
                    accordion += this.displayIt('Phone:', data['20. Phone number of the project\'s contact person']);
                    accordion += this.displayIt('Email:', data['20. Email address of the project\'s contact person']);
                    accordion += this.displayIt('Type:', data['21. Which best describes your organization?']);
                    accordion += this.displayIt('Project Needs:', data['22. The project is in need of:']);
                    accordion += this.displayIt('Will share experience:', data['23. We are happy to talk to others about our project and experience!']);


                    var ga = "_gaq.push(['_trackEvent', 'Accordion', 'Fix-Map','" + project_name + "']);";
                    accordion += '' + "\n";
                    accordion += '        <br>' + "\n";
                    accordion += '                  <p><a id="show-on-map-' + i + '" type="button" class="btn btn-default" href="#">Show on map</a>' + "\n";
                    accordion += '                      <a  id="fix-map-' + i + '" onclick="' + ga + '" style="float: right;" href="mailto:info@communitykc.org?subject=Please Change ' + project_name + ' (' + i + ')">Request Change</a></p>' + "\n";
                    accordion += '                </p>' + "\n";
                    accordion += '                </div>' + "\n";
                    accordion += '              </div>' + "\n";
                    accordion += '            </div>' + "\n";

                    $('#accordion').append(accordion);
                    function createfunc(project_name) {
                        return function () {
                            $('#link' + i).on("click", function () {
                                _gaq.push(['_trackEvent', 'Accordion', 'Click', project_name]);
                            });
                        };
                    }

                    this.funcs[i] = createfunc(project_name);
                    this.funcs[i]();
                }
            }

            for (var i in this.Events) {

                var project_name  = this.Events[i].data['1. Project Title/Name'];

                // Listen for marker clicks

                if (this.Events[i].marker) { // If google map was able to create a map marker
                    google.maps.event.addListener(this.Events[i].marker, 'click', this.Events[i].toggleInfoBox(Map.Map, this.Events[i], i));
                    $('#show-on-map-' + i).on("click", null, {
                        map: Map.Map,
                        default: Default,
                        panel: this.Events[i].panel,
                        marker: this.Events[i].marker,
			            projectName: project_name
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

        this.displayAsLink = function(label, value) {
            if (label) {
                if (value) {
                    return '                <p><span style="color: grey">' + label + '</span> <a target="_blank" href="' + value + '">' + value + '</a></p>' + "\n";
                } else {
                    return '';
                }
            } else {
                if (value) {
                    return '                <p><a target="_blank" href="' + value + '">' + value + '</a></p>' + "\n";
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

                    function createprojfunc(project_type) {
                        return function() {
                		$('#' + project.id).on("click",function () { _gaq.push(['_trackEvent', 'Filter', 'Click', project_type]);});
                        };
                    }
            
                    this.projfuncs[i] = createprojfunc( project_type );
                    this.projfuncs[i]();

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

            _gaq.push(['_trackEvent', 'Accordion', 'Show-On-Map', e.data.projectName]);

            var Latlng = new google.maps.LatLng(
                e.data.panel.Lat,
                e.data.panel.Lng
            );
            e.data.map.setCenter(Latlng);
            e.data.map.setZoom(e.data.default.zoomaddress);
            toggleBounce(e.data.marker);
            setTimeout(function(){ e.data.marker.setAnimation(null); }, 6000);  // 750 is one bounce


        }

        function toggleBounce (marker) {
            if (marker.getAnimation() != null) {
                marker.setAnimation(null);
            } else {
                marker.setAnimation(google.maps.Animation.BOUNCE);
            }
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
                if (!project_type_info[(ptype)]) {
                    ptype = 'Other';
                }

                if (this.Events[i].marker) { // If google map was able to create a map marker
                    if (project_type_to_display == 'all') {
                        this.Events[i].marker.setIcon(project_type_info[(ptype)].pin_url);
                    } else if (project_type_info[(ptype)].id.toString() == project_type_to_display.toString()) {
                        this.Events[i].marker.setIcon(project_type_info[(ptype)].pin_url);
                    } else {
                        this.Events[i].marker.setIcon('img/grey-transparent.png');
                    }
                }
            }
        };
    };
    return constructor;
})(jQuery);
