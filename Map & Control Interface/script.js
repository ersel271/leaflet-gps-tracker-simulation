var startLocation = [40.98381739328393, 29.052041172981266],
    apiKey = 'YOUR_ARCGIS_API_KEY',

    map = L.map('map', {
        fullscreenControl: true,
        minZoom: 1
    }).setView(startLocation, 16),
    osm = L.tileLayer('https://tile.openstreetmap.bzh/br/{z}/{x}/{y}.png', {
	    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        noWrap: true,
        bounds: [
            [-90, -180],
            [90, 180]
        ]
    }).addTo(map),
    scale = L.control.scale().addTo(map),
    geocodeService = L.esri.Geocoding.geocodeService({
        apikey: apiKey
    }),
    
    markers = [], //Markers (Users)
    outerPolylines = [], //Polylines for Outside the Polygon
    innerPolylines = [], //Polylines for Inside the Polygon
    polygons = drawArea(), //Polygon Areas

    outerCoord = [[]], //Polyline Coordinates for Outside the Polygon
    innerCoord = [[[[]]]], //Polyline Coordinates for Inside the Polygon
    inx = [], //Represent Indexes from "innerCoord" | [i][0] Index1, Represent Polylines | [i][1] Index2, Represent Polyline Points
    entDate = [], //Last Date Markers Entered an Area
    time = [], //Timers [i][0] Represent Millisecond | [i][1] Represent Second | [i][2] Represent Minute | [i][3] Represent Hour
    
    control = false, //Marker - Polygon Contains Controller
    tInx = 0; //Repeat Number (Table Index) for Table Updates

// map.on('click', function(e) { 
//    alert(e.latlng.lat + ", " + e.latlng.lng);
// });


walk(15, 20, 150, 8000, polygons);

function walk(n, lineLength, intervalRate, dist, polygons) { //Make Move
    var redIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    }),
    violetIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    for (i = 0; i < n; i++) {
        markers.push(L.marker(startLocation, {
            icon: redIcon, 
            title: "User " + i
        }).addTo(map));
        
        outerPolylines.push(L.polyline([[-180, -180], [-180, -180]], {
            color: 'rgba(111, 56, 197, 0.8)',
            className: 'outer-polyline'
        }).addTo(map));
        innerPolylines.push(L.polyline([[-180, -180], [-180, -180]], {
            color: 'rgba(0, 0, 0, 0.6)', 
            className: 'inner-polyline'
        }).addTo(map));

        outerCoord.push([[]]);
        innerCoord.push([[[]]]);
        inx.push([0, 0]);
        time.push(-1);
        entDate.push(-1);

    } outerCoord.shift(); innerCoord.shift();

    for (i = 0; i < n; i++) {
        outerCoord[i].shift();
        for(j = 0; j < (lineLength + 1); j++)
            outerCoord[i].push([startLocation[0], startLocation[1]]);
    } 

    var areaLayers = L.layerGroup(), //Layer Control System
        emptyLayer = L.layerGroup();
    for (i = 0; i < innerPolylines.length; i++)
        areaLayers.addLayer(innerPolylines[i]);

    for (i = 0; i < polygons.length; i++)
        areaLayers.addLayer(polygons[i]);
    
    map.addLayer(areaLayers);
    L.control.layers({
        "Show Areas": areaLayers,
        "Hide Areas": emptyLayer
    }).addTo(map);

    empAdd(n); //Add All Users
    prepareGta(); //Add Areas "Go to Area" Button's Dropdown
    prepareGtu(n); //Add Users "Go to User" Button's Dropdown

    setInterval(() => {
        for (q = 0; q < n; q++) {
            empUpdate(true, q); //Update Employee Table - Location
            popup(q);

            control = isContain(polygons, q);
        
            for (i = 0; i < lineLength; i++)
                for(j = 0; j < 2; j++)
                    outerCoord[q][i][j] = outerCoord[q][i + 1][j];

            newLocation(dist, lineLength, q);
    
            if (isContain(polygons, q) !== -1) { //Permanent Polyline
                innerCoord[q][inx[q][0]][inx[q][1]] = ([outerCoord[q][lineLength][0], outerCoord[q][lineLength][1]]);
                inx[q][1]++;

                markers[q].setLatLng(innerCoord[q][inx[q][0]][innerCoord[q][inx[q][0]].length - 1]);
                innerPolylines[q].setLatLngs(innerCoord[q]);
                outerPolylines[q].setLatLngs(outerCoord[q]);

            } else { //Temporary Polyline
                markers[q].setLatLng(outerCoord[q][lineLength]).setIcon(redIcon);
                outerPolylines[q].setLatLngs(outerCoord[q]);

            }

            if (control === -1 && isContain(polygons, q) !== -1) { //Entering the Polygon
                markers[q].setIcon(violetIcon);
                entDate[q] = new Date();

                empUpdate(false, q); //Update Employee Table - Area
                tourAdd(q); //Add New Data Tour Table
                patAdd(q); //Add New Data Patrol Table
                
                tInx++;

            } else if (control !== -1 && isContain(polygons, q) === -1) { //Going Out from Polygon
                markers[q].setIcon(redIcon);
                time[q] = getAreaTime(new Date().getTime() - entDate[q].getTime(), [1000, 60, 60]);
                
                tourUpdate(q); //Update Tour Table
                patUpdate(q); //Update Patrol Table

                innerCoord[q].push([[]]);
                inx[q][0]++; inx[q][1] = 0;

            }
        }
    }, intervalRate);
}

function popup(q) { //Adding Popup to Marker  
    if (apiKey.includes("API_KEY")) noAddress(); //If API Key is Not Entered, Reverse Geocoding Will Not Work.
    else { //If API Key is Entered, Reverse Geocoding Will Work.
        geocodeService.reverse().latlng(markers[q].getLatLng()).run(function (error, result) {
            if (error) {
                noAddress();
                console.log(error);
                return; 
            }
    
            markers[q].bindPopup(
                "<b style='font-size: 1.25rem'>" + markers[q].options.title + " - Information</b>" + //Header
                "<br><b>Latitude: </b>" + markers[q].getLatLng().lat +  //Lat
                "<br><b>Longitude: </b>" + markers[q].getLatLng().lng + //Lng
                "<br><b>Address: </b>" + result.address.LongLabel + //Address
                "<br><b>Last Visited Place: </b>" + tabEmployee.rows[q + 1].cells[2].innerText //Last Visited Area
            ); 
        });
    }

    function noAddress(){
        markers[q].bindPopup(
            "<b style='font-size: 1.25rem'>" + markers[q].options.title + " - Information</b>" + //Header
            "<br><b>Latitude: </b>" + markers[q].getLatLng().lat +  //Lat
            "<br><b>Longitude: </b>" + markers[q].getLatLng().lng + //Lng
            "<br><b>Last Visited Place: </b>" + tabEmployee.rows[q + 1].cells[2].innerText //Last Visited Area
        );
    }
}

function newLocation(dist, lineLength, q) { //Giving New Location to Marker
    var latV = (Math.random()) / dist,
        lngV = (Math.random()) / dist,
        direction = Math.floor(Math.random() * 20);
    if (direction > 7) direction = Math.floor(Math.random() * 4); //Reduce the Chance of Going Straight
    
    switch (direction) { //Set Direction
        case 0: outerCoord[q][lineLength][0] += latV; outerCoord[q][lineLength][1] += lngV; break; //Northeast
        case 1: outerCoord[q][lineLength][0] -= latV; outerCoord[q][lineLength][1] -= lngV; break; //Southwest
        case 2: outerCoord[q][lineLength][0] += latV; outerCoord[q][lineLength][1] -= lngV; break; //Northwest
        case 3: outerCoord[q][lineLength][0] -= latV; outerCoord[q][lineLength][1] += lngV; break; //Southeast
        case 4: outerCoord[q][lineLength][0] += latV; break; //North
        case 5: outerCoord[q][lineLength][0] -= latV; break; //South
        case 6: outerCoord[q][lineLength][1] += lngV; break; //East
        case 7: outerCoord[q][lineLength][1] -= lngV; break; //West
    }
}

function isContain(polygons, j) { //Control If the Area Contains Marker
    for(i = 0; i < polygons.length; i++)
            if (polygons[i].contains(markers[j].getLatLng())) return i;

    return -1;
}

function getAreaTime(baseValue, timeFractions) { //Clock
    var data = [baseValue];
    
    for (i = 0; i < timeFractions.length; i++) {
        data.push(parseInt(data[i] / timeFractions[i]));
        data[i] = data[i] % timeFractions[i];
    }

    return data;
}

function drawArea() { //Define Areas 
    var polygonLatlngs = //Coordinates for Areas
    [
        [[40.98993353591273, 29.051579833030700], //Area 0
        [40.98734410611007, 29.0511453151702880],
        [40.9857680521782, 29.04901027679443700],
        [40.98502260067399, 29.0514349937439000],
        [40.984738937509256, 29.053387641906742],
        [40.98473083418041, 29.0544497966766400],
        [40.985079276421196, 29.054422974586490],
        [40.9891267438206, 29.05512034893036200],
        [40.98972634749166, 29.0545463562011720]],

        [[40.98452301615978, 29.055077974550798], //Area 1
        [40.98355870988021, 29.0548633978296070],
        [40.98331155347965, 29.0561294004846360],
        [40.98250930173115, 29.0557968065667900],
        [40.98208791306527, 29.0578674719262860],
        [40.98403276136791, 29.0587686941552900],
        [40.9843974140397, 29.05679458832033000]],

        [[40.98143133792221, 29.048758149147037], //Area 2
        [40.98060069987966, 29.0512847900390660],
        [40.9822336027832, 29.05233085155487400],
        [40.98312482694568, 29.0497559309005770],
        [40.9842557213152, 29.05056059360504500],
        [40.98574672779907, 29.0483719110488930],
        [40.98514708793963, 29.0478193759918250],
        [40.98289461108739, 29.0464514493942300]],
                    
        [[40.98120548183793, 29.055259823799137], //Area 3
        [40.980776655924736, 29.054669737815860],
        [40.98025395777374, 29.0534949302673380],
        [40.97809018647969, 29.0522825717926030],
        [40.97787542628065, 29.0533661842346230],
        [40.97902215660076, 29.0606671571731600],
        [40.98078438575148, 29.0565204620361360],
        [40.98078033384422, 29.0561395883560200]]
    ],
    polygons = [];

    for (i = 0; i < polygonLatlngs.length; i++) {
        polygons.push(L.polygon(polygonLatlngs[i], {
            color: 'rgb(135, 162, 251)', 
            title: 'Area ' + i,
            className: 'area-polygon'
        }).addTo(map));

        polygons[i].bindPopup("This is " + polygons[i].options.title);
    }

    return polygons;
}