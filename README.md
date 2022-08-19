# leaflet-live-location-simulation
A simple simulation of what a live location app looks like with Leaflet.js

<h2>How it Works?</h2>
<p>We have a function that works with 5 parameters and named <i>"walk"</i>.</br>

<ul> 
<li><b>First Parameter (n): </b>User count (Marker count).</li>
<li><b>Second Parameter (lineLength): </b>Length of the trace.</li>
<li><b>Third Parameter (intervalRate): </b>Speed of location updates (millisecond).</li>
<li><b>Fourth Parameter (dist): </b>Distance for each new location.</li>
<li><b>Fifth Parameter (polygons): </b>Custom defined region (polygon).</li>
</ul>
</br>
All the markers added the array called <i>"markers"</i> and we also open other arrays called,
<ul> 
<li><b>coord: </b>Holds the coordinates of the temporary traces left by the movement.</li>
<li><b>inCoord: </b>Holds the coordinates of the permanent (inside the polygon) traces left by the movement.</li>
<li><b>inx: </b>Keeps the indexes in the define algorithm used for the <i>"inCoord"</i>.</li>
<li><b>time </b>Keeps the time that each marker stays in the area (inside the polygon).</li>
</ul>
</br>
We also have a function called <i>"drawArea"</i> and it help us for drawing a special area with polygons. The trace left by the markers in this area becomes permanent.
</br>
<ul><li><b>polygonLatlngs: </b>We write the coordinates of the area we have determined into this array. Each area must be an element of this array. In other words, each index of the array contains other arrays containing the coordinates of that area. It returns the <i>"polygons"</i> array.</li></ul>
</br>

<b>Try this: </b></br>
`walk(10, 20, 250, 10000, drawArea());`
<h2>Future Updates</h2>
<ul>
<li>Updating the code entirely using Leaflet objects (arrays holding locations etc).</li>
<li>User and Admin Interface (with Bootstrap).</li>
<li>Focus on selected users.</li>
<li>An application that works with real locations from the database and real users.</li>
<li>Preparing a new <i>README.md</i> describing the code and variables with details.</li>
</ul>
