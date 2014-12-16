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
		
		this.setIcal = function(Event)
		{
			return function(){
				$('#ical-'+Event.data.id).icalendar({
					start: new Date(Date._parse(Event.data.begin_date+' '+Event.data.begin_time)),
					end: new Date(Date._parse(Event.data.begin_date+' '+Event.data.end_time)),
					title: 'Flu Shot',
					summary: 'Get a Flu Shot',
					description: "Please remember to bring your immunization/shot records with you.",
					location: Event.data.facility_name+' - '+Event.data.street1+' - '+Event.data.city+' '+Event.data.state+' '+Event.data.postal_code,
					iconSize: 16,
					sites: ['google']
				});
			};
		};
		
		this.getEvents = function(columns,rows,Map)
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

                    // Create the Google LatLng object
                    this.Events[i].latlng = new google.maps.LatLng(lla[0],lla[1]);

                    var organization_type = $.trim(this.Events[i].data[ 'Project type' ]);
                    console.log( organization_type );
                    // Create the markers for each event

                    var icon = '';
                    if ( organization_type == 'Capacity Building') {
                        icon = 'img/6F4682.png';
                        pin_counts[ organization_type ]++;
                    } else if ( organization_type == 'Environmental and Public Health') {
                        icon = 'img/4951FF.png';
                        pin_counts[ organization_type ]++;
                    } else if ( organization_type == 'Arts and Culture') {
                        icon = 'img/FFC355.png';
                        pin_counts[ organization_type ]++;
                    } else {
                        icon = 'img/blue.png';
                    }

                    total_pin_count++;


                    this.Events[i].marker = new google.maps.Marker({
                        position: this.Events[i].latlng,
                        map: Map.Map,
                        icon:icon,
                        shadow:'img/shadow.png',
                        clickable:true
                    });
                    // Make the info box
    				this.Events[i].infobox = new InfoBox(infoboxoptions);

                  var p_description = rows[i][9];

                  var accordion = '';
                  accordion += '           <div class="panel panel-default">' + "\n";
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
                  accordion += '        </dl>' + "\n";
                  accordion += '        <br>' + "\n";
                  accordion += '        <br>' + "\n";
                  accordion += '                  <p><button type="button" class="btn btn-default">Show on map</button></p>' + "\n";
                  accordion += '                </div>' + "\n";
                  accordion += '              </div>' + "\n";
                  accordion += '            </div>' + "\n";


                  $('#accordion').append(accordion);


                }
			}
			for(var i in this.Events)
			{
				// Listen for marker clicks
				google.maps.event.addListener(this.Events[i].marker, 'click', this.Events[i].toggleInfoBox(Map.Map,this.Events[i]));

			}

            $('#cnt-all').html( total_pin_count );
            $('#cnt-capacity-building').html( pin_counts[ 'Capacity Building' ] );
            $('#cnt-environmental').html( pin_counts[ 'Environmental and Public Health' ] );
            $('#cnt-arts-and-culture').html( pin_counts[ 'Arts and Culture' ] );
            console.dir(pin_counts);
		};
		
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
		
		this.setMarkersByDay = function(day)
		{
/*			for(var i in this.Events)
			{
				// Let's see if 'day' is in the day of week list for this event.
				var dayArray = this.Events[i].data.recurrence_days.split(',');
				var onDay = false;
				for(var j in dayArray)
				{
					if (
						$.trim(day.toLowerCase()) === 'all'
						||
						(
							// If 'today'
							$.trim(day.toLowerCase()) === 'today'
							&& Date.getDayNumberFromName(this.now.toString('dddd')) === Date.getDayNumberFromName($.trim(dayArray[j]))
						)
						||
						(
							// If a day of the week
							Date.getDayNumberFromName(day) === Date.getDayNumberFromName($.trim(dayArray[j]))
						)
					)
					{
						onDay = true;
					}
				}
				// If event is after begin date and before end date, and is in the list of days of the week...
				if (
					// If 'day' is in the recurrence days list.
					onDay === true
					&& (
						// When 'day is a day of week, don't worry if event has not begun. 
						// We are looking for today as well as future events.
						$.trim(day.toLowerCase()) !== 'today'
						// Make sure today is on of after event start date.
						|| parseInt(this.now.toString('yyyyMMdd'),10) >= parseInt(Date.parse(this.Events[i].data.begin_date).toString('yyyyMMdd'),10)
					)
					// If today is before or on event end date
					&& parseInt(this.now.toString('yyyyMMdd'),10) <= parseInt(Date.parse(this.Events[i].data.end_date).toString('yyyyMMdd'),10)
				)
				{
					// See if it is a free event
					if($.trim(this.Events[i].data.cost.toLowerCase()) === 'free')
					{
						this.Events[i].marker.setIcon('img/blue.png');
					}
					else
					{
						// Hand over some dead presidents.
						this.Events[i].marker.setIcon('img/red.png');
					}
				}
				else if
				(
					$.trim(day.toLowerCase()) === 'seven'
					&& onDay === false
					// If today is before or on event end date
					&& (
						(
							// Event end date is on or after today & event end date is before or is 7 days from now
							parseInt(Date.parse(this.Events[i].data.end_date).toString('yyyyMMdd'),10) >= parseInt(Date.today().toString('yyyyMMdd'),10)
							&& parseInt(Date.parse(this.Events[i].data.end_date).toString('yyyyMMdd'),10) <= parseInt(Date.today().add({days:6}).toString('yyyyMMdd'),10)
						)
						||
						(
							// 
							(
								// Event begin date is before or on today & event end date is after or on today
								parseInt(Date.parse(this.Events[i].data.begin_date).toString('yyyyMMdd'),10) <= parseInt(Date.today().toString('yyyyMMdd'),10)
								&& parseInt(Date.parse(this.Events[i].data.end_date).toString('yyyyMMdd'),10) >= parseInt(Date.today().toString('yyyyMMdd'),10)
							)
							||
							(
								// event begin date is on or before 7 days from now & event end date is on or after today
								parseInt(Date.parse(this.Events[i].data.begin_date).toString('yyyyMMdd'),10) <= parseInt(Date.today().add({days:6}).toString('yyyyMMdd'),10)
								&& parseInt(Date.parse(this.Events[i].data.end_date).toString('yyyyMMdd'),10)  >= parseInt(Date.today().add({days:6}).toString('yyyyMMdd'),10)
							)
						)
					)
				)
				{
					// See if it is a free event
					if($.trim(this.Events[i].data.cost.toLowerCase()) === 'free')
					{
						this.Events[i].marker.setIcon('img/blue.png');
					}
					else
					{
						// Hand over some dead presidents.
						this.Events[i].marker.setIcon('img/red.png');
					}
				}
				else
				{
					this.Events[i].marker.setIcon('img/grey-transparent.png');
				}
			}*/
		};
	};
	return constructor;
})(jQuery);
