const searchParam = new URLSearchParams(location.search)
navigator.geolocation.getCurrentPosition((position) => {
    // console.log(searchParam.get('lat'))
    // console.log(atob(searchParam.get('lat')))
    var lat
    var lng
    if (searchParam.get('lat') !== null) {
        if (/^\d+(\.\d+)?$/.test(searchParam.get('lat'))) {
            lat = parseFloat(searchParam.get('lat'))
        }
        else {
            lat = parseFloat(atob(searchParam.get('lat')))
        }
    }
    else {
        lat = position.coords.latitude
    }
    if (searchParam.get('lng') !== null) {
        if (/^\d+(\.\d+)?$/.test(searchParam.get('lng'))) {
            lng = parseFloat(searchParam.get('lng'))
        }
        else {
            lng = parseFloat(atob(searchParam.get('lng')))
        }
    }
    else {
        lng = position.coords.longitude
    }
    const z = parseInt(searchParam.get('z')) || 17
    console.log(lat,lng,z)
    var map = L.map('map').setView([lat, lng], z);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);
    const defaultText = `The Spot`
    var text = searchParam.get('text') || defaultText
    const dt = searchParam.get('dt') || `${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}`
    if (text !== defaultText) {
        document.title = `MeetUp ${text}@${dt}`
    }
    L.marker([lat, lng]).bindPopup(`<h1>${text} @${dt}</h1>`).addTo(map);
    const url = new URL(location)
    url.searchParams.set(`lat`, btoa(lat))
    url.searchParams.set(`lng`, btoa(lng))
    history.pushState({}, '', url)
})