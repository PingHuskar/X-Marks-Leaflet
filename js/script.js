const searchParam = new URLSearchParams(location.search)
const zeroPad = (num, places) => String(num).padStart(places, '0')
const decodeLatLng = (encodeHex) => parseInt(encodeHex,16)/10**6
const encodeLatLng = (num) => zeroPad((num*10**6).toString(16), 8)

const getCoor = (param) => {
    if (searchParam.get(param) !== null) {
        if (/^\d+\.(\d+)?$/.test(searchParam.get(param))) {
            return parseFloat(searchParam.get(param)).toFixed(6)
        } else if (/^\d+$/.test(searchParam.get(param))) {
            return parseFloat(searchParam.get(param))/10**6
        } else {
            return decodeLatLng(searchParam.get(param))
        }
    }
}

navigator.geolocation.getCurrentPosition((position) => {
    const lat = getCoor('lat') || position.coords.latitude.toFixed(6)
    const lng = getCoor('lng') || position.coords.longitude.toFixed(6)
    const z = parseInt(searchParam.get('z')) || 17
    console.log(lat,lng,z)
    console.log(encodeLatLng(lat),encodeLatLng(lng))
    var map = L.map('map').setView([lat, lng], z);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);
    const defaultText = `Meet Up`
    var text = searchParam.get('text') || defaultText
    const dt = searchParam.get('dt') || `${new Date().getDate()}/${new Date().getMonth()+1}/${new Date().getFullYear()}`
    if (text !== defaultText) {
        document.title = `MeetUp ${text}@${dt}`
    }
    L.marker([lat, lng]).bindPopup(`<h1>${text} @${dt}</h1>`).addTo(map);
    const url = new URL(location)
    url.searchParams.set(`lat`, encodeLatLng(lat))
    url.searchParams.set(`lng`, encodeLatLng(lng))
    history.pushState({}, '', url)
})