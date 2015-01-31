/**
 * Event class
 */
var Event = (function ($) {
    var constructor = function () {
        this.data = {};
        this.latlng = null;
        this.marker = null;
        this.infobox = null;
        this.infoboxtext = null;

        // Oh dear lord, browser detection. -10 Charisma. Is the browser android or iPhone or Blackberry or Windows mobile?
        this.isPhone = (navigator.userAgent.match(/iPhone/i) || (navigator.userAgent.toLowerCase()
            .indexOf("android") > -1) || (navigator.userAgent.toLowerCase()
            .indexOf("blackberry") > -1) || navigator.userAgent.match(/iemobile/i) || navigator.userAgent.match(/Windows Phone/i)) ? true : false;

        this.toggleInfoBox = function (Map, ThisEvent, i) {
            return function () {
                if (ThisEvent.infobox != null && ThisEvent.infobox.visible) {
                    ThisEvent.infobox.close(Map, ThisEvent.marker);
                } else {
                    ThisEvent.infoboxtext = '<div class="infoBox" style="border:2px solid rgb(16,16,16); margin-top:8px; background:#fff; color: black; padding:5px; font-family:Helvetica Neue,Helvetica,Arial,sans-serif; font-size: 20px;">';

		    var project_name = ThisEvent.data['1. Project Title/Name'];
                    ThisEvent.infoboxtext += '   <p>' + "\n";
                    ThisEvent.infoboxtext += '                   <b> ' + project_name + "</b><br \>\n";
                    ThisEvent.infoboxtext += '                   ' + ThisEvent.data['2. Project description'].substring(0, 200) + "<br>\n";
                    ThisEvent.infoboxtext += '                   <span style="color: grey;">Type: </span>' + ThisEvent.data['3. Project type'] + "<br>\n";
                    ThisEvent.infoboxtext += '                   <span style="color: grey;">Organization: </span>' + ThisEvent.data['17. Organization name'] + "<br>\n";
                    ThisEvent.infoboxtext += '                   <span style="color: grey;">Location: </span>';
                    if (ThisEvent.data['11. For area-wide projects, does this project have more specific boundaries?'].length != 0 ) {
                        ThisEvent.infoboxtext += ThisEvent.data['11. For area-wide projects, does this project have more specific boundaries?'] + "<br>\n";
                    } else {
                        ThisEvent.infoboxtext += ThisEvent.data['FullAddress'] + "<br>\n";
                    }

                    ThisEvent.infoboxtext += '        </p>' + "\n";
                    ThisEvent.infoboxtext += '<p><a id="#more' + i + '" onClick="_gaq.push([\'_trackEvent\', \'Pin\', \'More\', \'' + project_name + '\']); document.getElementById(\'link' + i + '\').click();" href="#heading' + i + '">more....</a></p>';

                    ThisEvent.infoboxtext += '</div>';
                    ThisEvent.infobox.setContent(ThisEvent.infoboxtext);
                    ThisEvent.infobox.open(Map, ThisEvent.marker);
                    _gaq.push(['_trackEvent', 'Pin', 'Open', project_name ]);
                }
            };
        };

        this.closeInfoBox = function (Map, Marker, InfoBox) {
            if (InfoBox.visible) {
                _gaq.push(['_trackEvent', 'Pin', 'Close', 'category-name']);
                console.log('cccc');
                InfoBox.close(Map, Marker);
            }
        };

    };
    return constructor;
})(jQuery);
