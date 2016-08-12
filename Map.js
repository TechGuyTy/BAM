var globalMap;

var allMarkers = [];

var objArray = [];

var getMarkerUniqueId = function(lat, lng) {
    return lat + '_' + lng;
}

$(function() {

    var MapFcns = {
        loadSiteList: function() {
            var airportList = $('#airport-list');
            airportList.html('');
            airportList.append('<option value=""></option>');
            //creating an array of the airport objects
            for (var i in sites) {
                var obj = {
                    Code: (sites[i].Code),
                    City: (sites[i].City),
                    State: (sites[i].State),
                    FullSiteName: (sites[i].FullSiteName),
                    Latitude: (sites[i].Latitude),
                    Longitude: (sites[i].Longitude),
                }
                objArray.push(obj);
            }

            for (var i in objArray) {
                // console.log(objArray[i].Code)
            }

            for (var i in sites) {
                var newOption = $('<option value="' + sites[i].Code + '">' + sites[i].Code + '</option>');
                airportList.append(newOption);
            }



            function sortDropDownListByText() {
                // Loop for each select element on the page.
                $("#airport-list").each(function() {

                    // Keep track of the selected option.
                    var selectedValue = $(this).val();

                    // Sort all the options by text.
                    $(this).html($("option", $(this)).sort(function(a, b) {
                        return a.text == b.text ? 0 : a.text < b.text ? -1 : 1
                    }));
                    $(this).val(selectedValue);
                });
            }

            sortDropDownListByText();


        },
        // {Code: "ANC", City: "Anchorage", State: "AK", FullSiteName: "AIRPORT_ANC_Ted Stevens Anchorage International", Latitude: 61.1744, Longitude: -149.996},
        //Here I added additional selectors to get the data needed to fill out the rest of the information needed below. Had to double check IDs to make sure they matched
        siteListChange: function() {
            var ctl = $(this),
                airportCode = ctl.val();
            if (airportCode) {
                var currAirport = _.findWhere(sites, {
                    Code: airportCode
                });
                $('#setting-code').text(currAirport.Code);
                $('#setting-city').text(currAirport.City);
                $('#setting-state').text(currAirport.State);
                $('#setting-fullName').text(currAirport.FullSiteName);
                $('#setting-lat').text(currAirport.Latitude);
                $('#setting-long').text(currAirport.Longitude);
            }

            var markerId = getMarkerUniqueId(currAirport.Latitude, currAirport.Longitude);
            var marker = new google.maps.Marker({
                position: {
                    lat: currAirport.Latitude,
                    lng: currAirport.Longitude
                },
                map: globalMap,
                id: 'marker_' + markerId,
                title: trimName(currAirport)
            });
            allMarkers.push(marker);
            addToSide(marker);
            marker.addListener('click', function() {
                toggleInfo(currAirport, marker);
            });

        }
    }



    function addToSide(marker) {
        var sideDiv = $('#sideDiv');
        document.getElementById('sideDiv').innerHTML = '';
        sideDiv.append('<ul>');
        for (var i in allMarkers) {
            var newPort = $('<li><span onclick="removeMarker(allMarkers['+ i +'] )">' + allMarkers[i].title + '</span><span id="'+allMarkers[i].code+'" onclick="zoomPoint(allMarkers['+ i +'])">FIND</span></li>');
            sideDiv.append(newPort);
        }
        sideDiv.append('</ul>');
    }

    MapFcns.loadSiteList();
    $('#airport-list').change(MapFcns.siteListChange);
    $('#exercise-toggle').click(function() {
        var toggleCtl = $(this),
            toggleVal = toggleCtl.text();
        if (toggleVal == '-') {
            toggleCtl.text('+');
            $('#exercise-instructions').hide();
        } else {
            toggleCtl.text('-');
            $('#exercise-instructions').show();
        }
    });

});
// panTo(latLng:currAirport.Latitude, currAirport.Longitude);
function zoomPoint(point){
  globalMap.setCenter(point.position);

// $("#sideDiv").on("click", "#" + point.code + "", function() {
//         var laLatLng = new google.maps.LatLng(point.position);
//         console.log(laLatLng);
//         globalMap.panTo(laLatLng);
//         globalMap.setZoom(5);
//      });
   }



function removeMarker(marker) {
  console.dir(marker);
  for (i=0; i< allMarkers.length; i++) {
    if (marker == marker) {
      marker.setMap(null);
    }
  }
  };


function clearMarkers() {
    allMarkers.forEach(function(element, index, array) {
        element.setMap(null);
    });
    $('#sideDiv').empty();


    allMarkers = [];

}

//function created to remove the first 12 letters of the Full site name.
function trimName(currAirport) {
    var n = (currAirport.FullSiteName).slice(12);

    return n;
}

function toggleInfo(currAirport, marker) {

    var contentString =
        '<div id="content">' +
        '<div id="siteNotice"></div>' +
        '<p>Code:' + (currAirport.Code) + '</p>' +
        '<p>City:' + (currAirport.City) + '</p>' +
        '<p>State:' + (currAirport.State) + '</p>' +
        '<p>Full Site Name:' + trimName(currAirport) + '</p>' +
        '<p>Coordinates:' + (currAirport.Latitude) + ',' + (currAirport.Longitude) + '</p>' +
        '</div>';



    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });
    infowindow.open(map, marker);
}

function initMap() {
    // Callback function to create a map object and specify the DOM element for display.
    globalMap = new google.maps.Map(document.getElementById('map'), {
        //Changed Center and Zoom to be default US
        center: {
            lat: 37.09024,
            lng: -95.712891
        },
        scrollwheel: true,
        zoom: 4
    });



}
