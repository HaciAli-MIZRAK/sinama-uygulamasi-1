/* global L, map, path, parser */
/**
 * Sabit Global Değişkenlerimiz.
 */
/* Sayfa ilk Yüklendiğinde LocalStorge Temizliği Yapıyoruz */
localStorage.clear(); 
/* ilk oluşturulan harita için gerekenler */
var L;
var __Lat       = '38.9297287'; /* enlem */
var __Lng       = '35.7744732'; /* boylam */
var __zoom      = 6;            /* zoom */
var tileLayer, googleStreets, hybrids, satalites, terrains, traffics, basarsoft;

/* -------------------------------------------------------------------------- */
$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});
/* -------------------------------------------------------------------------- */
/**
 * harita üzerine eklediğimiz araçlar ve bu araçların realTime
 * Takibi ve periyodik güncellemeleri için
 */
var marker;                /* Kullandık */


/* -------------------------------------------------------------------------- */

/**
 * Kendimize Ait harita linkini bu alana ekliyoruz.
 */
    
tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: false
});

/* Google TileLayer */
googleStreets = L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});

hybrids = L.tileLayer('https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});

satalites = L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});

terrains = L.tileLayer('https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});

traffics = L.tileLayer('https://{s}.google.com/vt/lyrs=m@221097413,traffic&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    minZoom: 2,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
});


/* -------------------------------------------------------------------------- */

/**
 * Bu function ile harita üzerinde sağ click işlemini kapatıyoruz.
 * ve yerine yaklaştırma zoom ekliyoruz.
 */
function zoomIn (e) {
    map.setView(e.latlng, 13);
}
/**
 * Bu function ile harita üzerinde sağ click işlemini kapatıyoruz.
 * ve yerine uzaklaştırma zoom ekliyoruz.
 */
function zoomOut (e) {
    map.zoomOut();
}


/**
 * Bu function ile ContextMenuden FullScreen Yapıyoruz.
 */
function fullSecrans() {
    
    map.toggleFullscreen();
    
} /* end fullSecrans() */

/* -------------------------------------------------------------------------- */

/**
 * Haritamızı Ekrana Basıyoruz.
 */
var map = L.map('maps-panele', {
    zoomControl: false,
    touchZoom: true,
    contextmenu: true,
    contextmenuWidth: 140,
    contextmenuItems: [{
        text: 'Yakınlaş',	
	callback: zoomIn
    }, {
        text: 'Uzaklaş',	
	callback: zoomOut
    }, {
        text: 'Tam Ekran Göster',
        callback: fullSecrans
    }],
    attributionControl: false,
    maxZoom: 18,
    minZoom: 3
}).setView([__Lat, __Lng], __zoom);

L.control.layers({
    'Open Street Map':  tileLayer,
    'Google Street':    googleStreets,
    'Google Hybrid':    hybrids,
    'Google Satalite':  satalites,
    'Google Terrain':   terrains,
    'Google Traffics':  traffics,
}).addTo(map);

map.addLayer(googleStreets);
    
$('.leaflet-control-layers-toggle').parent('div.leaflet-control-layers.leaflet-control').addClass('mapsSelectPosition');

/* Zoom Control Paneli Sağ Alt Köşeye Aldık. */
L.control.zoom({
     position:'bottomright'
}).addTo(map);
/* FullScrenn Control Paneli Sağ Alt Köşeye Aldık. */
L.control.fullscreen({
    position:'bottomright'
}).addTo(map);

$.get('http://127.0.0.1:2222/api/all-location-list', function( data ) {
    for (var i = 0; i < data.data.length; i++) {
        marker = new L.marker([data.data[i].latitude, data.data[i].longitude])
            .bindPopup(data.data[i].location_title)
            .addTo(map);
    }
});

function animateUpdate() {
    var now      = new Date();
    var timeDiff = now.getTime() - start.getTime();
    var perc     = Math.round((timeDiff/maxTime)*100);
    if (perc <= 100) {
        updateProgress(perc);
        window.setTimeout(animateUpdate, timeoutVal);
    }
}

$.get('http://127.0.0.1:2222/api/all-location-list', {}, function( data ) {
    var option = '';
    for(var i = 0;i < data.data.length;i++) {
        option += `<option value="${data.data[i].latitude + ',' + data.data[i].longitude}">${data.data[i].location_title}</option>`;
    }
    $('#locationsRoutesFirst').html(option);
    $('#locationsRoutesLast').html(option);
});
$('body').on('click', '#locationPolyline', function() {
    const latlong1 = document.getElementById('locationsRoutesFirst').value.split(',');
    const latlong2 = document.getElementById('locationsRoutesLast').value.split(',');
    L.Routing.control({
        waypoints: [
            L.latLng(parseFloat(latlong1[0]), parseFloat(latlong1[1])),
            L.latLng(parseFloat(latlong2[0]), parseFloat(latlong2[1]))
        ]
    }).addTo(map);
});
/*L.Routing.control({
    waypoints: [
        L.latLng(38.225425134685004, 26.807283314743785),
        L.latLng(38.20060041838293, 26.8464113317394)
    ]
}).addTo(map);*/
/*var deger = [[38.22516,26.80666],[38.22422,26.80721],[38.22376,26.80921],[38.22157,26.80957],[38.21853,26.81195],[38.21741,26.81367],[38.21691,26.81601],[38.21758,26.81742],[38.21654,26.82229],[38.21811,26.82453],[38.21837,26.82695],[38.20172,26.83286],[38.20515,26.8317],[38.20696,26.83598],[38.20519,26.83835],[38.20415,26.8405],[38.20101,26.84372],[38.20194,26.84473],[38.20227,26.84668],[38.2006,26.8464]];
let coordinates = deger;
new L.Polyline(coordinates, { color: "#2a3561", weight: 5 }).addTo(map);*/