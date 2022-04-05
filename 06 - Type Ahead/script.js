const endpoint = 'https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json';
const cities = [];
const R = 6371; // Earths mean radius in meters
fetch(endpoint)
.then(blob => blob.json())
.then(data => cities.push(...data));

function findMatches(wordToMatch, cities) {
return cities.filter(place => {
    const regex = new RegExp(wordToMatch, 'gi');
    return place.city.match(regex) || place.state.match(regex);
})
}

function numberWithCommas(x) {
return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}


function displayMatches() {
const matchArray = findMatches(this.value, cities);
handleSort(matchArray); // Sorts by sort type
const html = matchArray.map(place => {
        const regex = new RegExp(this.value, "i"); 
        const cityName = place.city.replace(regex, `<span class="hl">${this.value}</span>`)
        const stateName = place.state.replace(regex, `<span class="hl">${this.value}</span>`)
        const population = numberWithCommas(place.population);
        elem =  `
            <li>
                <span class="name">${cityName}, ${stateName}</span>
                <span class="population"><div>${population} Population</div></span>
                
            `;
        if (place.distance) {
            elem += `<span class="result-distance"> ${place.distance} </span>`
        }
        elem += `</li>`;
        return elem;
    }).join('');
    suggestions.innerHTML = html;
}

function showHiddenInput() {
    distanceInput.hidden = !distanceInput.hidden;
    distanceInput.disabled = !distanceInput.disabled;
}

function getCity(city) {
    return cities.filter(place => place.city === city)[0];
}

function getDistance(city1, city2) {
    // Implement Haversine's formula to compute distance between two points in a sphere
    const φ1 = city1.latitude * Math.PI/180; // φ, λ in radians
    const φ2 = city1.latitude * Math.PI/180;
    const Δφ = (city2.latitude-city1.latitude) * Math.PI/180;
    const Δλ = (city2.longitude-city1.longitude) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    const d = R * c; // in metres
    return d
}

function handleSort(arr) {
    const sortByVal = sortByInput.value;
    // Sort by distance || population
    if (sortByVal === "distance") { 
        const city = getCity(distanceInput.value) || "";
        if (city) { 
            arr.sort((city1, city2) => {
                let dist1 = getDistance(city1, city);
                let dist2 = getDistance(city2, city);
                city1.distance = dist1.toFixed(2) + " km";
                city2.distance = dist2.toFixed(2) + " km";
                console.log(dist1, dist2)
                return dist1 < dist2 ? -1 : 1;
            })
        }
    } else if (sortByVal === "population") {
        // Can skip this as the data is sorted by population as is \o/
    }
}

const searchInput = document.querySelector('.search');
const suggestions = document.querySelector('.suggestions');
const distanceInput = document.querySelector('.distance');
const sortByInput = document.querySelector('.sort-by');


searchInput.addEventListener('change', displayMatches);
searchInput.addEventListener('keyup', displayMatches);
sortByInput.addEventListener('change', showHiddenInput)

