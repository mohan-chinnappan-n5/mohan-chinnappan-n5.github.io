
const getEle = id => document.getElementById(id);
const initValue =
    ` 1  192.168.1.1 (192.168.1.1)  93.076 ms  3.909 ms  4.102 ms
2  * * *
3  67.59.237.125 (67.59.237.125)  55.569 ms  12.583 ms  12.862 ms
4  67.59.254.244 (67.59.254.244)  57.816 ms  17.923 ms  97.692 ms
5  64.15.5.142 (64.15.5.142)  63.911 ms
64.15.4.56 (64.15.4.56)  58.648 ms  19.834 ms
6  64.15.5.70 (64.15.5.70)  80.136 ms
64.15.5.80 (64.15.5.80)  62.303 ms
451be0c2.cst.lightpath.net (65.19.120.194)  64.529 ms
7  72.14.215.203 (72.14.215.203)  136.646 ms  25.070 ms  25.534 ms
8  * * *
9  142.251.64.4 (142.251.64.4)  61.020 ms
108.170.236.88 (108.170.236.88)  58.083 ms
142.251.53.150 (142.251.53.150)  58.596 ms
10  108.170.248.66 (108.170.248.66)  74.283 ms
142.251.65.99 (142.251.65.99)  62.208 ms  22.591 ms
11  lga34s34-in-f14.1e100.net (142.250.80.46)  62.763 ms
142.250.57.139 (142.250.57.139)  66.758 ms
lga34s34-in-f14.1e100.net (142.250.80.46)  21.104 ms`

// store location lookups in a database to prevent duplicate lookups
let db = {};

// thanks to : Stefan Sundin
const readTraceroute = async (text) => {
    let hosts = [];
    let ips = [];
    text.split("\n").forEach(function (line) {
        let r1, r2;
        if (
            (r1 = /^ *(\d+) /.exec(line)) !== null && (
                (r2 = /\(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\)/.exec(line)) !== null ||
                (r2 = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/.exec(line)) !== null ||
                (r2 = /\((?:[0-9a-f]{1,4}::?){1,7}[0-9a-f]{1,4}\)/.exec(line)) !== null ||
                (r2 = /\b(?:[0-9a-f]{1,4}::?){1,7}[0-9a-f]{1,4}\b/.exec(line)) !== null
            )
        ) {
            const n = parseInt(r1[1]);
            let ip = r2[0];
            if (ip[0] === "(") {
                ip = ip.substring(1, r2[0].length - 1);
            }
            // Filter out RFC1918 private IP ranges
            // ipinfo returns an "Invalid Token" error on these
            // Maybe some IPv6 addresses should also be filtered?
            if (ip.startsWith("10.") || ip.startsWith("192.168.")) {
                console.warn("Skipping private IP", ip);
                return;
            }
            else if (ip.startsWith("172.")) {
                const byte = parseInt(ip.split(".")[1], 10);
                if (byte >= 16 && byte < 32) {
                    console.warn("Skipping private IP", ip);
                    return;
                }
            }
            // Add IP to hosts if not already present
            if (!ips.includes(ip)) {
                ips.push(ip);
                hosts.push({ n: n, ip: ip });
            }
        }
    });

    let requestBody = hosts.filter(host => !(host.ip in db)).map(host => `${host.ip}/loc`);

    const url = `https://ipinfo.io/batch?token=b20b80964e4797`;
    const response = await fetch(url, {
        method: "POST",
        headers: new Headers({
            "Content-Type": "application/json",
        }),
        body: JSON.stringify(requestBody),
    }).then(response => {
        if (response.ok) {

            return response.json();
        }
        console.error(response);
        throw new Error(response.status);
    });
    return response;

}






// Initialize Monaco Editor

require.config({
    paths: {
        vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.27.0/min/vs",
    },
});


require(['vs/editor/editor.main'], function () {
    var editor = monaco.editor.create(document.getElementById('editor'), {
        value: initValue,
        language: 'plaintext',
        theme: 'vs-dark'
    });

    var jsonEditor = monaco.editor.create(document.getElementById('json-editor'), {
        value: '',
        language: 'json',
        theme: 'vs-dark'
    });

    // Create Leaflet Map
    var map = L.map('map').setView([0, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,

    }).addTo(map);

    const keyPoints = {
        'NY': { 'latLng': [40.7128, -74.0060], 'text': 'New York' },
        'WDC': { 'latLng': [38.9072, -77.0369], 'text': 'Washington DC' },


    }

    for (const keyPoint in keyPoints) {
        const latLng = keyPoints[keyPoint].latLng;
        const text = keyPoints[keyPoint].text;
        L.circle(latLng, {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5,
            radius: 1000
        }).addTo(map);
        L.popup()
            .setLatLng(latLng)
            .setContent(text)
            .openOn(map);

    }








    // Initialize Leaflet.draw
    var drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);
    var drawControl = new L.Control.Draw({
        edit: {
            featureGroup: drawnItems
        }
    });
    map.addControl(drawControl);

    map.on('draw:created', function (e) {
        var layer = e.layer;
        drawnItems.addLayer(layer);
    });


    document.getElementById('parse-button').addEventListener('click',  async function () {
        await parse();
    });

    document.getElementById('draw-button').addEventListener('click', function () {
        updateMap();

    });

    document.getElementById('clear-button').addEventListener('click', function () {
        drawnItems.clearLayers();

      /* map.eachLayer(function (layer) {
            if (layer !== drawnItems) {
                map.removeLayer(layer);
            }
        }); */
       

    });


    const parse = async () => {
        var coordinatesText = editor.getValue();

        const llObj = await readTraceroute(coordinatesText);


        // const uitems = items.filter((item, index) => items.indexOf(item) === index);

        jsonEditor.setValue(JSON.stringify(llObj, null, 4));



    }

    // Function to update the map
    const updateMap =  () => {



        const content = JSON.parse(jsonEditor.getValue());


        const keys = Object.keys(content);


        let lines = [];
        for (const key of keys) {
            const item = content[key];
            lines.push(item);
        }


        var latLngArray = [];
        for (var i = 1; i < lines.length; i++) {
            var latLng = lines[i].split(',');
            var lat = parseFloat(latLng[0].trim());
            var lng = parseFloat(latLng[1].trim());
            if (!isNaN(lat) && !isNaN(lng)) {
                latLngArray.push([lat, lng]);
            }
        }




        // Draw new lines on the map if there are valid coordinates
        if (latLngArray.length > 1) {
            const polyline = L.polyline(latLngArray, { color: '#0d6efd' }).addTo(map);
            map.fitBounds(polyline.getBounds());
        }
    }


    getEle('parse-button').click()


    // Update the map whenever the editor content changes
    //editor.onDidChangeModelContent(updateMap);



});





