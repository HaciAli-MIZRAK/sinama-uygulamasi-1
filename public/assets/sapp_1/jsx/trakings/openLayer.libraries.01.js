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
var __zoom      = 7;            /* zoom */
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


function animateUpdate() {
    var now      = new Date();
    var timeDiff = now.getTime() - start.getTime();
    var perc     = Math.round((timeDiff/maxTime)*100);
    if (perc <= 100) {
        updateProgress(perc);
        window.setTimeout(animateUpdate, timeoutVal);
    }
}
