var startLocation = [40.98325785367988, 29.052819013595585],

    map = L.map('map', {fullscreenControl: true}).setView([startLocation[0], startLocation[1]], 16),
    osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map),

    markers = [], //Markers (Users)
    outerPolylines = [], //Polylines for Outside the Polygon
    innerPolylines = [], //Polylines for Inside the Polygon
    polygons = drawArea(), //Polygon Areas

    outerCoord = [[]], //Polyline Coordinates for Outside the Polygon
    innerCoord = [[[[]]]], //Polyline Coordinates for Inside the Polygon
    inx = [], //Represent Indexes from "innerCoord" | [i][0] Index1, Represent Polylines | [i][1] Index2, Represent Polyline Points
    entDate = [], //Last Date Markers Entered an Area
    time = [], //Timers [i][0] Represent Millisecond | [i][1] Represent Second | [i][2] Represent Minute | [i][3] Represent Hour
    lastArea = [], //Last Visited Areas
    
    control = false; //Marker - Polygon Contains Controller
    
// map.on('click', function(e) { 
//    alert(e.latlng.lat + ", " + e.latlng.lng);
// });

walk(10, 20, 100, 8000, polygons);

function walk(n, lineLength, intervalRate, dist, polygons) { //Make Move
    for (i = 0; i < n; i++) {
        markers.push(L.marker([startLocation[0], startLocation[1]], {title: "User " + i}));
        markers[i].addTo(map);
        
        outerPolylines.push(L.polyline([[0, 0], [0, 0]], {color: 'rgba(255, 0, 0, 0.6)', className: 'outer-polyline'}).addTo(map));
        innerPolylines.push(L.polyline([[0, 0], [0, 0]], {color: 'rgba(0, 0, 0, 0.6)', className: 'inner-polyline'}).addTo(map));
        outerCoord.push([[]]);
        innerCoord.push([[[]]]);
        inx.push([0, 0]);
        time.push(-1);
        entDate.push(-1);
        lastArea.push(-1);

    } outerCoord.shift(); innerCoord.shift();

    for (i = 0; i < n; i++) {
        outerCoord[i].shift();
        for(j = 0; j < (lineLength + 1); j++)
            outerCoord[i].push([startLocation[0], startLocation[1]]);
    } 

    setInterval(() => {
        for (q = 0; q < n; q++) {
            var lastAreaNum = "Area " + lastArea[q],
                lastAreaTime = "";
                
            if(lastAreaNum === "Area -1" ) lastAreaNum = "Nowhere";

            if(typeof time[q][0] === "undefined") lastAreaTime = "No Data";
            else lastAreaTime = time[q][3] + "h " + time[q][2] + "min " + time[q][1] + "sec";

            markers[q].bindPopup("<b>" + markers[q].options.title+ "</b><br/>Latitude: " + outerCoord[q][lineLength][0] + "<br/> Longitude: " + outerCoord[q][lineLength][1] + "<br/> Last Visited Place:" + lastAreaNum + "<br/> Last Time Spent in Area: " + lastAreaTime);

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
                outerPolylines[q].setLatLngs(0, 0);

            } else { //Temporary Polyline
                markers[q].setLatLng(outerCoord[q][lineLength]);
                outerPolylines[q].setLatLngs(outerCoord[q]);

            }

            if (control === -1 && isContain(polygons, q) !== -1) { //Entering the Polygon
                entDate[q] = new Date();
                lastArea[q] = isContain(polygons, q);

            } if (control !== -1 && isContain(polygons, q) === -1) { //Going Out from Polygon
                time[q] = getAreaTime(new Date().getTime() - entDate[q].getTime(), [1000, 60, 60]);
                lastAreaTime = time[q][3] + "h " + time[q][2] + "min " + time[q][1] + "sec"; 
                
                innerCoord[q].push([[]]);
                inx[q][0]++; inx[q][1] = 0;

            }
        }
    }, intervalRate);
}

function newLocation(dist, lineLength, q) { //Giving New Location to Marker
     var latV = (Math.random()) / dist,
        lonV = (Math.random()) / dist,
        direction = Math.floor(Math.random() * 20);
    if (direction > 7) direction = Math.floor(Math.random() * 4); //Reduce the Chance of Going Straight
    
    switch (direction) { //Set Direction
        case 0: outerCoord[q][lineLength][0] += latV; outerCoord[q][lineLength][1] += lonV; break; //Northeast
        case 1: outerCoord[q][lineLength][0] -= latV; outerCoord[q][lineLength][1] -= lonV; break; //Southwest
        case 2: outerCoord[q][lineLength][0] += latV; outerCoord[q][lineLength][1] -= lonV; break; //Northwest
        case 3: outerCoord[q][lineLength][0] -= latV; outerCoord[q][lineLength][1] += lonV; break; //Southeast
        case 4: outerCoord[q][lineLength][0] += latV; break; //North
        case 5: outerCoord[q][lineLength][0] -= latV; break; //South
        case 6: outerCoord[q][lineLength][1] += lonV; break; //East
        case 7: outerCoord[q][lineLength][1] -= lonV; break; //West
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
        [[40.98993353591273, 29.0515798330307],
        [40.98734410611007, 29.051145315170288],
        [40.9857680521782, 29.049010276794437],
        [40.98502260067399, 29.0514349937439],
        [40.984738937509256, 29.053387641906742],
        [40.98473083418041, 29.05444979667664],
        [40.985079276421196, 29.05442297458649],
        [40.9891267438206, 29.055120348930362],
        [40.98972634749166, 29.054546356201172]],

        [[40.98452301615978, 29.055077974550798],
        [40.98355870988021, 29.054863397829607],
        [40.98331155347965, 29.056129400484636],
        [40.98250930173115, 29.05579680656679],
        [40.98208791306527, 29.057867471926286],
        [40.98403276136791, 29.05876869415529],
        [40.9843974140397, 29.05679458832033]],

        [[40.98305504607841, 29.0497045216787],
        [40.981458630313966, 29.04885694362999],
        [40.98068066751155, 29.051249474071277],
        [40.98219606574853, 29.052241891406787]],
                    
        [[40.98120548183793, 29.055259823799137],
        [40.980776655924736, 29.05466973781586],
        [40.98025395777374, 29.053494930267338],
        [40.97809018647969, 29.052282571792603],
        [40.97787542628065, 29.053366184234623],
        [40.97902215660076, 29.06066715717316],
        [40.98078438575148, 29.056520462036136],
        [40.98078033384422, 29.05613958835602]]
    ],

    polygons = [];
    for (i = 0; i < polygonLatlngs.length; i++) {
        var polygon = L.polygon(polygonLatlngs[i], {color: 'rgb(0, 200, 0)', title: 'Area ' + i, className: 'area-polygon'});
        polygons.push(polygon);
        polygons[i].addTo(map);
    }

    return polygons;
}