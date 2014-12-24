/**
 * @classDestription - Placeholder for Projects application variables and functions.
 * @class - Projects
 */
var Projects = (function($) {
	var constructor = function(infoboxoptions){
		this.AddressMarker = null;
		
		// Now
		this.now = Date.parse('now');
		
		this.Events = [];
		
		// Can we geolocate?
		this.geolocate = navigator.geolocation;
		
		this.getEvents = function( columns, rows, Map, Default )
		{
            var pin_counts = {};
            pin_counts[ 'Capacity Building' ] = 0;
            pin_counts[ 'Environmental and Public Health' ] = 0;
            pin_counts[ 'Arts and Culture' ] = 0;
            var total_pin_count = 0;
			// Copy the flu shot data to the Event object
			for (var i in rows)
			{
				this.Events[i] = new Event();
				for(var j in columns)
				{
					var colname = columns[j];
					this.Events[i].data[colname] = rows[i][j];
				}

                var ll = this.Events[i].data['Location'];
                var lla = ll.split(',');


                if ( lla.length == 2 ) {

                    var Lat = null;
                    var Lng = null;

                    // Create the Google LatLng object

                    Lat = lla[0];
                    Lng = lla[1];

                    this.Events[i].latlng = new google.maps.LatLng(Lat,Lng);

                    var project_type = $.trim(this.Events[i].data[ 'Project type' ]);
                    console.log( project_type );
                    // Create the markers for each event

                    var icon = '';
                    var panel_class = '';

                    if ( typeof project_type_info[ project_type ] !== undefined ) {

                        icon = project_type_info[ project_type ].pin_url;
                        pin_counts[ project_type ]++;

                        panel_class = project_type_info[ project_type ].id + '-panel';
                        total_pin_count++;


                        this.Events[i].marker = new google.maps.Marker({
                            position: this.Events[i].latlng,
                            map: Map.Map,
                            icon:icon,
                            shadow:'img/shadow.png',
                            clickable:true
                        });

                        this.Events[i].panel = {
                            Lat: Lat,
                            Lng: Lng,
                            map: Map.Map
                        };


                        // Make the info box
                        this.Events[i].infobox = new InfoBox(infoboxoptions);

                        var p_description = rows[i][9];

                        var accordion = '';
                        accordion += '           <div class="panel panel-default ' + panel_class + '">' + "\n";
                        accordion += '              <div class="panel-heading" role="tab" id="heading' + i + '">' + "\n";
                        accordion += '                <h4 class="panel-title">' + "\n";
                        accordion += '                  <a class="collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapse' + i + '" aria-expanded="false" aria-controls="collapse' + i + '">' + "\n";
                        accordion += '                    ' + p_description + "\n";
                        accordion += '                  </a>' + "\n";
                        accordion += '                </h4>' + "\n";
                        accordion += '              </div>' + "\n";
                        accordion += '              <div id="collapse' + i + '" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading' + i + '">' + "\n";
                        accordion += '                <div class="panel-body">' + "\n";
                        accordion += '' + "\n";
                        accordion += '        <dl>' + "\n";
                        accordion += '                   <dt>Organization: </dt><dd>' + this.Events[i].data[ 'Organization name' ] + '<span style="color:gray">(' + this.Events[i].data[ 'Which best describes your type of organization?' ] + ')</style></dd>' + "\n";
                        accordion += '                   <dt>Location: </dt><dd>' + this.Events[i].data[ 'Address of the project' ] + '</dd>' + "\n";
                        accordion += '                   <dt>Project Type: </dt><dd>' + this.Events[i].data[ 'Project type' ] + '</dd>' + "\n";
                        accordion += '        </dl>' + "\n";
                        accordion += '        <br>' + "\n";
                        accordion += '        <br>' + "\n";
                        accordion += '                  <p><button id="show-on-map-' + i + '" type="button" class="btn btn-default">Show on map</button></p>' + "\n";
                        accordion += '                </div>' + "\n";
                        accordion += '              </div>' + "\n";
                        accordion += '            </div>' + "\n";


                        $('#accordion').append(accordion);
                    }




                }
			}
			for(var i in this.Events)
			{
				// Listen for marker clicks
				google.maps.event.addListener(this.Events[i].marker, 'click', this.Events[i].toggleInfoBox(Map.Map,this.Events[i]));

                $('#show-on-map-' + i).on( "click", null, {  map: Map.Map, default: Default, panel: this.Events[i].panel }, this.centerPin );

			}

            $('#cnt-all').html( total_pin_count );
            $('#cnt-capacity-building').html( pin_counts[ 'Capacity Building' ] );
            $('#cnt-environmental').html( pin_counts[ 'Environmental and Public Health' ] );
            $('#cnt-arts-and-culture').html( pin_counts[ 'Arts and Culture' ] );
            console.dir(pin_counts);
		};

        this.centerPin = function ( e ) {
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
		this.codeLatLng = function(Latlng)
		{
			var Geocoder = new google.maps.Geocoder();
			Geocoder.geocode(
				{'latLng': Latlng},
				function(Results,Status)
				{
					if (Status == google.maps.GeocoderStatus.OK)
					{
						if (Results[0])
						{
							var formattedAddress = Results[0].formatted_address.split(',');
							$('#nav-address').val(formattedAddress[0]);
							
							// Mask the exact address before recording
							// Example: '1456 W Greenleaf Ave' becomes '1400 W Greenleaf Ave'
							var addarray = $.trim($('#nav-address').val()).split(' ');
							// Chicago addresses start with numbers. So look for them and mask them.
							if(addarray[0].match(/^[0-9]+$/) !== null)
							{
								var replacement = addarray[0].substr(0,addarray[0].length-2)+'00';
								if(replacement !== '00')
								{
									addarray[0] = replacement;
								}
								else
								{
									addarray[0] = '0';
								}
							}
							var maskedAddress = addarray.join(' ');
							//_gaq.push(['_trackEvent', 'Find Me', 'Address', maskedAddress]);
						}
						else
						{
							alert('We\'re sorry. We could not find an address for this location.');
						}
					}
					else
					{
						alert('We\'re sorry. We could not find an address for this location.');
					}
				}
			);
		};
		
		// Put a Pan/Zoom control on the map
		this.setFindMeControl = function(controlDiv,Map,Flu,Default)
		{
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
				if(navigator.geolocation)
				{
					navigator.geolocation.getCurrentPosition(
						// Success
						function(position)
						{
							//_gaq.push(['_trackEvent', 'GPS', 'Success']);
							var Latlng = new google.maps.LatLng(
								position.coords.latitude,
								position.coords.longitude
							);
							Map.Map.setCenter(Latlng);
							Map.Map.setZoom(Default.zoomaddress);
							// Make a map marker if none exists yet
							if(Flu.AddressMarker === null)
							{
								Flu.AddressMarker = new google.maps.Marker({
									position:Latlng,
									map: Map.Map,
									icon:Default.iconlocation,
									clickable:false
								});
							}
							else
							{
								// Move the marker to the new location
								Flu.AddressMarker.setPosition(Latlng);
								// If the marker is hidden, unhide it
								if(Flu.AddressMarker.getMap() === null)
								{
									Flu.AddressMarker.setMap(Map.Map);
								}
							}
							Flu.codeLatLng(Latlng);
						},
						// Failure
						function()
						{
							alert('We\'re sorry. We could not find you. Please type in an address.');
						},
						{
							timeout:5000,
							enableHighAccuracy:true
						}
					);
				}
			});
		};
		
		this.setMapLegend = function(controlDiv,Map,Flu,Default)
		{
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
		
		this.setMarkersByProjectType = function( project_type_to_display )
		{
            if ( project_type_to_display == 'all' ) {
                $('.panel-default').css("display", "block");
            } else {
                $('.panel-default').css("display", "none");
                $('.' + project_type_to_display + '-panel').css("display", "block");
            }

			for(var i in this.Events)
			{

                var ptype = this.Events[i].data[ 'Project type' ];

                if ( project_type_to_display == 'all'
                || ( typeof project_type_info[ (ptype) ] !== 'undefined' && project_type_info[ (ptype) ].id == project_type_to_display )) {
                    this.Events[i].marker.setIcon( project_type_info[ (ptype) ].pin_url );
                } else {
					this.Events[i].marker.setIcon('img/grey-transparent.png');
				}


			}
		};
	};
	return constructor;
})(jQuery);
