# leaflet-gps-tracker-simulation
A simple simulation of what a gps tracker app looks like with [Leaflet.js](https://github.com/Leaflet/Leaflet "Leaflet.js").

## :star: Variables
#### Leaflet Object Variables
- **`markers = []`**  &rarr; Holds user markers as a HTML collection.
- **`outerPolylines = []`**  &rarr; Holds polylines for outside the polygon as a HTML collection.
- **`innerPolylines = []`**  &rarr; Holds polylines for outside the polygon as a HTML collection.
- **`polygons = []`**  &rarr; Holds areas as a HTML collection.

#### Array Variables
- **`outerCoord = [[]]`**  &rarr; Holds the coordinates to use for **outerPolylines**. It has an index for each user, and these indexes contain arrays in which the coordinates are kept.
- **`innerCoord = [[[[]]]]`**  &rarr; Holds the coordinates to use for **innerPolylines**. Each index is a separate array and each of these arrays contains the coordinates of its users. When exiting an area, a new array is added to the required index inside the **innerCoord** for the next entry. In the next entry, the coordinates taken inside the area are kept in this array.
- **`inx = []`**  &rarr; Its used to determine of new arrays to be added to the **innerCoord**.  It has an index for each user. Each index contains a two-element array. **[q][0]** represents polylines. **[q][1]** represents polyline points. **[q][1]** is updated for every move within the area. **[q][1]** is reset and **[q][0]** is incremented by one each time you exit the area.
- **`entDate = []`**  &rarr; Holds the last date entered in the area. It has an index for each user.
- **`time = []`**  &rarr; Holds the last time spent in the area. It has an index for each user. Each index contains a four-element array. **[q][0]** represents millisecond, **[q][1]** represents second, **[q][2]** epresents minute, **[q][3]** represent hour.
- **`lastArea = []`** &rarr; Last visited area. It has an index for each user.

#### Other Variables
- **`startLocation`**  &rarr; Variable that holds the starting position.
- **`control`**  &rarr; Control variable required to capture the moment of entry and exit into the area.

## :star: Functions
- **`walk(n, lineLength, intervalRate, dist, polygons)`** &rarr; Function that does main work like updating arrays, shifting polylines etc... It takes five parameters:

1. **n** &rarr; Number of users.
2. **lineLength** &rarr; Number of points to use to draw **outerPolylines**.
3. **intervalRate** &rarr; Speed of *setInterval* for operations.
4. **dist** &rarr; Distance from which the new location will be selected. Larger the value, smaller the distance between the new location and the old location.
5. **polygons** &rarr; Defined areas.

**return:** No.

------------
- **`popup(q)`** &rarr; Adds popups to markers. It takes one parameter:

1. **q**  &rarr; User index.

**return:** No.

------------
- **`newLocation(dist, lineLength, q)`** &rarr; Function that selects the direction and new location of the users. It takes three parameters:

1. **dist** &rarr; Same as other.
2. **lineLength** &rarr; Same as other.
3. **q** &rarr; User index.

**return:** No.

------------
- **`isContain(polygons, j)`** &rarr; Function that checks if the user is inside an area or not. It takes two parameters:

1. **polygons** &rarr; Defined areas.
2. **j** &rarr; User index.

**return:** Yes. If user is inside an area, it returns the index of that area. Otherwise it returns -1.

------------
- **`getAreaTime(baseValue, timeFractions)`** &rarr; Function that converts the millisecond difference of the entry and exit dates of the area to other time fractions. It takes two parameters:

1. **baseValue** &rarr; Raw millisecond data.
2. **timeFractions** &rarr;  Time fractions. For example **[1000, 60, 60]**. **1000**, converts milliseconds to seconds. **60**, converts seconds to minutes. **2nd 60**, converts minutes to hours. If a **24** is added to the end, the hours are converted to days.

**return:** Yes. Returns the edited duration data. **Index 0** represents milliseconds, **Index 1** represents seconds, **Index 2** represents minutes,  **Index 3** represents hours etc...

------------
- **`drawArea()`** &rarr; Function that draw areas. Coordinates of the areas are manually entered into the **polygonLatngs** array inside the function. Each index of this array must contain an array containing the coordinates of the area. It takes no parameter.

**return:** Yes. Returns an array containing the Leaflet objects of the areas.

## :star: Try
Click [here](https://codepen.io/ersel420/pen/eYrEBYN "here") to try this demo.

## :star: References
- [**Leaflet.js:**](https://github.com/Leaflet/Leaflet "**Leaflet.js:**") Javascript library for mobile-friendly interactive maps.
- [**Leaflet.PointInPolygon:**](https://github.com/hayeswise/Leaflet.PointInPolygon "**Leaflet.PointInPolygon**") Leaflet plugin/extension that provides point-in-polygon functions based on Dan Sunday's C++ winding number implementation.
- [**Leaflet.fullscreen:**](https://github.com/Leaflet/Leaflet.fullscreen "**Leaflet.fullscreen**") A fullscreen control for Leaflet.
- [**esri-leaflet:**](https://github.com/Esri/esri-leaflet "**esri-leaflet:**") A lightweight set of tools for working with ArcGIS services in Leaflet.
- [**esri-leaflet-geocoder:**](https://github.com/Esri/esri-leaflet-geocoder "**esri-leaflet-geocoder:**") Helpers for using the ArcGIS World Geocoding Service in Leaflet.
- [**leaflet-color-markers:**]( https://github.com/pointhi/leaflet-color-markers "**leaflet-color-markers:**") Color variations of the standard Leaflet marker.
- [**leaflet-providers:**](https://github.com/leaflet-extras/leaflet-providers "**leaflet-providers:**") An extension to Leaflet that contains configurations for various free tile providers.
