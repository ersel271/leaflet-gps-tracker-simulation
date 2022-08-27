var startLocation = [41.06812073522929, 28.80712749218404], //41.05111255794263, 29.01896953582764
    //Start | Latitude 41.051994533247054  | 41.0540724388416  | Inside: 41.04916303115243
    //Start | Longitude 29.018325805664066 | 29.01448488235474 | Inside: 29.017210006713867

    map = L.map('map').setView([startLocation[0], startLocation[1]], 17),
    osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

// map.on('click', function(e) { 
//     alert(e.latlng.lat + ", " + e.latlng.lng);
// }); 

if(!navigator.geolocation){ //Geolocation Support Control (Not necessary as we don't use geolocation for now)
    console.log("No Browser Support"); 
} else {
    //Number of Users (Markers), Line Length, Rotation Speed for SetInterval (Milliseconds), Distance Setting, Polygon (Area)
    walk(10, 10, 100, 8000, drawArea());
}
       
function walk(n, lineLength, intervalRate, dist, polygons){
    var polyline = L.polyline([[0, 0], [0, 0]], {color: 'rgba(255, 0, 0, 0.6)'}), //Polyline for Outside the Polygon
        innerPolyline = L.polyline([[0, 0], [0, 0]], {color: 'rgba(0, 0, 0, 0.6)'}), //Polyline for Inside the Polygon

        markers = [], //Markers
        coord = [[]], //Polyline Coordinates for Outside the Polygon
        inCoord = [[[[]]]], //Polyline Coordinates for Inside the Polygon
        inx = [], //Represent Indexes from "inCoord" | [i][0] = Index1, Represent Polylines | [i][1] = Index2, Represent Polyline Points
        time = [], //Timers | [i][0] Represent Second | [i][1] Represent Minute | [i][2] Represent Hour

        control = false; //Marker - Polygon Contains Controller

    for(i = 0; i < n; i++){
        markers.push(L.marker([startLocation[0], startLocation[1]], {title: "User " + i}));
        markers[i].addTo(map);
        
        coord.push([[]]);
        inCoord.push([[[]]]);
        inx.push([0, 0]);
        time.push([0, 0, 0]);
    }coord.shift(); inCoord.shift();

    for(i = 0; i < n; i++){
        coord[i].shift();
        for(j = 0; j < (lineLength + 1); j++)
            coord[i].push([startLocation[0], startLocation[1]]);
    }
         
    setInterval(() => {
        for(i = 0; i < n; i++){
            control = isContain(polygons, i)[0];
        
            markers[i].addTo(map);
            polyline.addTo(map);
            innerPolyline.addTo(map);
        
            for(j = 0; j < lineLength; j++)
                for(k = 0; k < 2; k++)
                    coord[i][j][k] = coord[i][j + 1][k];

            var latV = (Math.random()) / dist,
                lonV = (Math.random()) / dist,
            direction = Math.floor(Math.random() * 20);
            if(direction > 7) direction = Math.floor(Math.random() * 4); //Reduce the Chance of Going Straight
            switch(direction){
                case 0: coord[i][lineLength][0] += latV; coord[i][lineLength][1] += lonV; break; //Northeast
                case 1: coord[i][lineLength][0] -= latV; coord[i][lineLength][1] -= lonV; break; //Southwest
                case 2: coord[i][lineLength][0] += latV; coord[i][lineLength][1] -= lonV; break; //Northwest
                case 3: coord[i][lineLength][0] -= latV; coord[i][lineLength][1] += lonV; break; //Southeast
                case 4: coord[i][lineLength][0] += latV; break; //North
                case 5: coord[i][lineLength][0] -= latV; break; //South
                case 6: coord[i][lineLength][1] += lonV; break; //East
                case 7: coord[i][lineLength][1] -= lonV; break; //West
            }
        
            if(isContain(polygons, i)[0]){ //Permanent Polyline
                inCoord[i][inx[i][0]][inx[i][1]] = ([coord[i][lineLength][0], coord[i][lineLength][1]]);
                inx[i][1]++;

                markers[i].setLatLng(inCoord[i][inx[i][0]][inCoord[i][inx[i][0]].length - 1]);
                innerPolyline.setLatLngs(inCoord);
            
            } else { //Temporary Polyline
                markers[i].setLatLng(coord[i][lineLength]);
                polyline.setLatLngs(coord);

            }
        
            if(control == false && isContain(polygons, i)[0] == true){ //Entering the Polygon
                //We Will Use Here When the User Interface is Ready
            }
            if(control == true && isContain(polygons, i)[0] == false){ //Going Out from Polygon
                if(!(time[i][0] == 0 && time[i][1] == 0 && time[i][2] == 0)) //Momentary In-Out Protection
                console.log("User " + i + "'s area time:.. " + time[i][2] + " Hour, " + time[i][1] + 
                " Minute, " + time[i][0] + " Second");
                
                time[i][0] = 0; time[i][1] = 0; time[i][2] = 0;

                inCoord[i].push([[]]);
                inx[i][0]++; inx[i][1] = 0;
            }
        
            markers[i].bindPopup("<b>" + markers[i].options.title + "'s Location</b><br/>Latitude: "+ coord[i][lineLength][0] +
            "<br/> Longitude: " + coord[i][lineLength][1] + "");

        }
    }, intervalRate); 

    setInterval(() => { //Clock
        for(i = 0; i < n; i++){
            if(isContain(polygons, i)[0]){
                time[i][0]++;
                if(time[i][0] == 59) { time[i][0] = 0; time[i][1] +=1; }
                if(time[i][1] == 59) { time[i][1] = 0; time[i][2] +=1; }
            }            
        }
    }, 1000);

    function isContain(polygons, i){
        for(j = 0; j < polygons.length; j++)
                if (polygons[j].contains(markers[i].getLatLng())) return [true, j];

        return [false, -1];
    }
}  

function drawArea(){
    var polygonLatlngs = [[[41.0697429223744, 28.808513195580787], //Coordinates for Polygons
                           [41.0697429223744, 28.80996130994058],
                           [41.067885138094944, 28.80996130994058],
                           [41.067885138094944, 28.80787430940058],
                           [41.06822472099828, 28.807881574194127],
                           [41.06822472099828, 28.809574271091257],
                           [41.06871218373997, 28.809574271091257],
                           [41.06871218373997, 28.808513195580787]],

                          [[41.06749894364841, 28.80433202507794],
                           [41.067358716772375, 28.80825478362011],
                           [41.066479104942516, 28.808220966736027],
                           [41.066612959666045, 28.80428129975705]],
                            
                          [[41.07020774886032, 28.80849301188299],
                           [41.068852289267156, 28.805596395803942],
                           [41.07220323574246, 28.803598729542536]]],
    polygons = [];
    for(i = 0; i < polygonLatlngs.length; i++){
        var polygon = new L.polygon(polygonLatlngs[i], {color: "rgb(0, 200, 0)", title: "Area " + i});
        polygons.push(polygon);
        polygons[i].addTo(map);
    }

    return polygons;

}

L.DomEvent.on(document.getElementById('backTo'),'click',(e)=>{ //Comeback to Area;
	pauseAutoMove = false;
    map.setView([startLocation[0], startLocation[1]], 17);
})