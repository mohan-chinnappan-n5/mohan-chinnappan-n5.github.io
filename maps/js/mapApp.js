// mapApp.js
// mohan chinnappan
// -------------------
let map;

        document.getElementById('cityForm').addEventListener('submit', async function(event) {
            event.preventDefault();
            const city1 = document.getElementById('city1').value;
            const city2 = document.getElementById('city2').value;

            const geocode = async (city) => {
                const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${city}`);
                return response.data[0];
            };

            if (map) {
                map.remove();
                document.getElementById('map').innerHTML = "<div id='map' class='h-96'></div>";
            }

            map = L.map('map').setView([0, 0], 2);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(map);

            const city1Location = await geocode(city1);
            const marker1 = L.marker([city1Location.lat, city1Location.lon]).addTo(map)
                .bindPopup(city1).openPopup();

            if (city2) {
                const city2Location = await geocode(city2);
                const marker2 = L.marker([city2Location.lat, city2Location.lon]).addTo(map)
                    .bindPopup(city2).openPopup();

                const latlngs = [
                    [city1Location.lat, city1Location.lon],
                    [city2Location.lat, city2Location.lon]
                ];
                const polyline = L.polyline(latlngs, {color: 'blue'}).addTo(map);
                map.fitBounds(polyline.getBounds());
            } else {
                map.setView([city1Location.lat, city1Location.lon], 10);
            }
        });
