# leaflet-gps-tracker-simulation
A simple simulation of what a gps tracker app looks like with [Leaflet.js](https://github.com/Leaflet/Leaflet "Leaflet.js").

## :star: Try
You can try this repo in [here.](https://codepen.io/ersel420/pen/eYrEBYN "here.")

## :star: Variables
### Leaflet Object Variables
- **`markers`**  &rarr; Holds user markers as a HTML collection.
- **`outerPolylines`**  &rarr; Holds polylines for outside the polygon as a HTML collection.
- **`innerPolylines`**  &rarr; Holds polylines for outside the polygon as a HTML collection.
- **`polygons`**  &rarr; Holds areas as a HTML collection.

### Array Variables
- **`outerCoord`**  &rarr; Holds the coordinates to use for **outerPolylines**. It has an index for each user, and these indexes contain arrays in which the coordinates are kept.

	- **outerCoord[q]:** qth user.
	- **outerCoord[q][m]:** mth point of the polyline drawn for the qth user.
	- **outerCoord[q][m][0]**: Latitude of this point.
	- **outerCoord[q][m][1]:** Longitude of this point.

- **`innerCoord`**  &rarr; Holds the coordinates to use for **innerPolylines**. Each index is a separate array and each of these arrays contains the coordinates of its users. When exiting an area, a new array is added to the required index inside the **innerCoord** for the next entry. In the next entry, the coordinates taken inside the area are kept in this array.
	- **innerCoord[q]:** qh user.
	- **innerCoord[q][m]:** Coordinates to be used in the mth entry of the are for qth user.
	- **innerCoord[q][m][n]:** nth moves coordinate in the mth area for qth user 
	- **innerCoord[q][m][n][0]:** Latitude of this point.
	- **innerCoord[q][m][n][1]:** Longitude of this point.

- **`inx`** &rarr; It used to determine of new arrays to be added to the **innerCoord**.  It has an index for each user. Each index contains a two-element array.
	- **inx[q]:** qth user.
	- **inx[q][0]:** Represent different permanent polylines for qth user. Incremented by one each time you exit the area.
	- **inx[q][1]:** Represent points of these polylines. Incremented by one every move inside of area. Reset every time you exit the area.

- **`entDate`** &rarr; Holds the last date entered in the area. It has an index for each user.
- **`time`** &rarr; Holds the last time spent in the area. It has an index for each user. Each index contains a four-element array.
	- **time[q]:** qth user.
	- **time[q][0]:** Represent milliseconds.
	- **time[q][1]:** Represent seconds.
	- **time[q][2]:** Represent minutes.
	- **time[q][3]:** Represent hours.

- **`lastArea`** &rarr; Last visited area. It has an index for each user.

### Other Variables
- **`startLocation`**  &rarr; Variable that holds the starting position.
- **`control`**  &rarr; Control variable required to capture the moment of entry and exit into the area.
- **`tInx`** &rarr; Holds the row index that needs to be updated in the tables.


## :star: Functions
- **`walk(n, lineLength, intervalRate, dist, polygons)`** &rarr; Function that does main work like updating arrays, shifting polylines etc... It takes five parameters:

1. **n** &rarr; Number of users.
2. **lineLength** &rarr; Number of points to use to draw **outerPolylines**.
3. **intervalRate** &rarr; Speed of *setInterval* for operations.
4. **dist** &rarr; Distance from which the new location will be selected. Larger the value, smaller the distance between the new location and the old location.
5. **polygons** &rarr; Defined areas.

**Local Variables:** Nothing.

**return:** No.

------------
- **`popup(q)`** &rarr; Function that adds popup to markers. It takes one parameter:

1. **q**  &rarr; User index.

**Local Variables:** Nothing.

**return:** No.

------------
- **`newLocation(dist, lineLength, q)`** &rarr; Function that selects the direction and new location of the users. It takes three parameters:

1. **dist** &rarr; Same as other.
2. **lineLength** &rarr; Same as other.
3. **q** &rarr; User index.

**Local Variables:** `latV`, Number to add latitude. `lngV`, Number to add longitude. `direction`, Direction of new location.

**return:** No.

------------
- **`isContain(polygons, j)`** &rarr; Function that checks if the user is inside an area or not. It takes two parameters:

1. **polygons** &rarr; Defined areas.
2. **j** &rarr; User index.

**Local Variables:** Nothing.

**return:** Yes. If user is inside an area, it returns the index of that area. Otherwise it returns -1.

------------
- **`getAreaTime(baseValue, timeFractions)`** &rarr; Function that converts the millisecond difference of the entry and exit dates of the area to other time fractions. It takes two parameters:

1. **baseValue** &rarr; Raw millisecond data.
2. **timeFractions** &rarr;  Time fractions. For example **[1000, 60, 60]**. **1000**, converts milliseconds to seconds. **60**, converts seconds to minutes. **2nd 60**, converts minutes to hours. If a **24** is added to the end, the hours are converted to days.

**Local Variables:** Nothing.

**return:** Yes. Returns the edited duration data. **Index 0** represents milliseconds, **Index 1** represents seconds, **Index 2** represents minutes,  **Index 3** represents hours etc...

------------
- **`drawArea()`** &rarr; Function that draw areas.

**Local Variables:** `polygonLatlngs`, Coordinates of the areas are manually entered into the this array. Each index of this array must contain an array containing the coordinates of the area.
- **polygonLatlngs[m]:** mth area.
- **polygonLatlngs[m][n]:** nth point of the mth area.
- **polygonLatlngs[m][n][0]:** Latitude of this point.
- **polygonLatlngs[m][n][1]:** Longitude of this point.

**return:** Yes. Returns an array containing the Leaflet objects of the areas.

## :star: References
- [**Leaflet.js:**](https://github.com/Leaflet/Leaflet "**Leaflet.js:**") Javascript library for mobile-friendly interactive maps.
- [**Leaflet.PointInPolygon:**](https://github.com/hayeswise/Leaflet.PointInPolygon "**Leaflet.PointInPolygon**") Leaflet plugin/extension that provides point-in-polygon functions based on Dan Sunday's C++ winding number implementation.
- [**Leaflet.fullscreen:**](https://github.com/Leaflet/Leaflet.fullscreen "**Leaflet.fullscreen**") A fullscreen control for Leaflet.
- [**esri-leaflet:**](https://github.com/Esri/esri-leaflet "**esri-leaflet:**") A lightweight set of tools for working with ArcGIS services in Leaflet.
- [**leaflet-color-markers:**]( https://github.com/pointhi/leaflet-color-markers "**leaflet-color-markers:**") Color variations of the standard Leaflet marker.
