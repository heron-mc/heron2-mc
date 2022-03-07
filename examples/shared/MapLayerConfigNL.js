
/* global ol,Heron */

// Override map settings.
Heron.options.map.settings = {
  projection: new ol.proj.Projection({code: Heron.epsg.RD_New}),
  //center: [83093.6,456432.32],
  center: Heron.options.locations.Amersfoort,
  //zoom: 14,
  zoom: 9
};

// Override statusbar settings.
Heron.options.map.statusbar.items = [
  {type: "epsgpanel"},
  {type: "->"},
  {type: "xcoord",options: {
    format: function(coord,precision) {
      return "X: " + coord.formatNL(precision);
    }
  }},
  {type: "ycoord",options: {
    width: 100,
    format: function(coord,precision) {
      return "Y: " + coord.formatNL(precision);
    }
  }}
];

/**-----------------------------------------------------------------------------
 * STYLES
 */
Heron.options.styles = {
  POLY_HOLLOW: new ol.style.Style({
                fill: new ol.style.Fill({
                  color: "rgba(255,255,255,0.6)"
                }),
                stroke: new ol.style.Stroke({
                  color: "#000000",
                  width: 1
                })
              }),
  POLY_URBAN: new ol.style.Style({
                fill: new ol.style.Fill({
                  color: "rgba(255,0,0,0.2)"
                }),
                stroke: new ol.style.Stroke({
                  color: "rgba(255,0,0,0.8)",
                  width: 1
                })
              })
};

/**-----------------------------------------------------------------------------
 * SERVICES
 */
Heron.options.services = {
  ALTERRA_WMS: "https://www.geodata.alterra.nl/topoxplorer/TopoXplorerServlet?",
  GS2_WFS: "https://kademo.nl/gs2/wfs?",
  GS2_OWS: "https://kademo.nl/gs2/ows?",
  GWC_WMS: "https://kademo.nl/gwc/service/wms?",
  GWC_TMS: "https://kademo.nl/gwc/service/tms/",
  OPENBASISKAART: "https://openbasiskaart.nl",
  NATGEOREG: "https://geodata.nationaalgeoregister.nl",
  PDOK: "https://service.pdok.nl",
  KNMI_WMS_RADAR: "https://geoservices.knmi.nl/cgi-bin/RADNL_OPER_R___25PCPRR_L3.cgi?",
  TNO_GRONDWATERSTANDEN: "https://www.dinoservices.nl/wms/dinomap/M07M0046?",
  TNO_BOORGATEN: "https://www.dinoservices.nl/wms/dinomap/M07M0044?",

  HERON_EXAMPLES: "/heron2_aris",

  dummy: ""
};

/**-----------------------------------------------------------------------------
 * URLS
 */
Heron.options.urls = {
  ADRESSEN: Heron.options.services.PDOK + "/inspireadressen/ows?",
  BAGVIEWER: Heron.options.services.PDOK + "/bagviewer/ows?",
  BAG: Heron.options.services.PDOK + "/bag/ows?",
  BRT: Heron.options.services.PDOK + "/brt/achtergrondkaart/wmts/v2_0",
  CBS_POSTCODE4: Heron.options.services.NATGEOREG + "/cbspostcode4/wms",
  NATGEOREG_WMTS: Heron.options.services.NATGEOREG + "/tiles/service/wmts",
  NATURA2000: Heron.options.services.NATGEOREG + "/natura2000/wms",
  NL: Heron.options.services.HERON_EXAMPLES + "/geojson/nl_min.json",
  OPENBASISKAART_TMS: Heron.options.services.OPENBASISKAART + "/mapcache/tms",
  RM_URBAN: Heron.options.services.HERON_EXAMPLES + "/geojson/rm_urban_min.json",
  dummy: ""
};

/**-----------------------------------------------------------------------------
 * OPTIONS - WMTS
 */

// Define WMTS default settings.
Heron.options.wmts = {
  //projection: new ol.proj.Projection({code: Heron.epsg.RD_New}),
  projectionExtent: [-285401.920, 22598.08, 595401.920, 903401.920],
  //size: ol.extent.getWidth(projectionExtent) / 256,
  resolutions: [3440.64, 1720.32, 860.16, 430.08, 215.04,
                107.52, 53.76, 26.88, 13.44, 6.72,
                3.36, 1.68, 0.84, 0.42],
  matrixIds: new Array(14)
};

// Generate resolutions and matrixIds arrays for this WMTS.
(function() {
  for (let i=0;i<14;++i) {
    Heron.options.wmts.matrixIds[i] = Heron.epsg.RD_New+":"+i;
  }
})();

/**-----------------------------------------------------------------------------
 * LAYERDEFS
 */
Heron.options.layerdefs = {
  AHN2: new ol.layer.Tile({
    name: "AHN2",
    description: "",
    // Prevent invalid service requests.
    extent: [0,310000,300000,630000],
    visible: false,
    source: new ol.source.WMTS({
      url: Heron.options.urls.NATGEOREG_WMTS,
      layer: "ahn2_5m",
      matrixSet: "EPSG:28992",
      format: "image/png",
      projection: Heron.options.map.settings.projection,
      tileGrid: new ol.tilegrid.WMTS({
        origin: ol.extent.getTopLeft(Heron.options.wmts.projectionExtent),
        resolutions: Heron.options.wmts.resolutions,
        matrixIds: Heron.options.wmts.matrixIds
      })
    })
  }),
  // WMTS - BRT Achtergrond.
  BRT_ACHTERGROND: new ol.layer.Tile({
    name: "BRT Achtergrond",
    description: "This is a layer description that will be visible as a tooltip.",
    // Prevent invalid service requests.
    extent: [0,310000,300000,630000],
    visible: false,
    source: new ol.source.WMTS({
      url: Heron.options.urls.BRT,
      layer: "standaard",
      matrixSet: "EPSG:28992",
      format: "image/png",
      style: "default",
      projection: Heron.options.map.settings.projection,
      tileGrid: new ol.tilegrid.WMTS({
        origin: ol.extent.getTopLeft(Heron.options.wmts.projectionExtent),
        resolutions: Heron.options.wmts.resolutions,
        matrixIds: Heron.options.wmts.matrixIds
      })
    })
  }),
  // WMS - CBS Postcode 4.
  CBS_POSTCODE4: new ol.layer.Image({
    name: "CBS Postcode 4",
    visible: false,
    source: new ol.source.ImageWMS({
      url: Heron.options.urls.CBS_POSTCODE4,
      params: {'LAYERS': 'postcode42017'}
    })
  }),
  // TMS - OpenBasisKaart.
  OPENBASISKAART: new ol.layer.Tile({
    name: "OpenBasisKaart",
    extent: [0,310000,300000,630000],
    visible: true,
    source: new ol.source.XYZ({
      url: Heron.options.urls.OPENBASISKAART_TMS+"1.0.0/osm@rd/{z}/{x}/{-y}.png",
      minZoon: 0,
      maxZoom: 13, // eigenlijk 21
      projection: Heron.options.map.settings.projection,
      tileGrid: new ol.tilegrid.TileGrid({
        resolutions: Heron.options.wmts.resolutions,
        extent: [-285401.920000,22598.080000,
                 595401.920000,903401.920000]
      })
    })
  }),
  // WMS - Natura2000.
  NATURA2000: new ol.layer.Image({
    name: "Natura 2000",
    visible: false,
    source: new ol.source.ImageWMS({
      url: Heron.options.urls.NATURA2000,
      params: {'LAYERS': 'natura2000'}
    })
  })
};

/**-----------------------------------------------------------------------------
 * OPTIONS - MAP - LAYERS
 */
Heron.options.map.layers = [
  Heron.options.layerdefs.AHN2,
  Heron.options.layerdefs.BRT_ACHTERGROND,
  Heron.options.layerdefs.OPENBASISKAART,
  Heron.options.layerdefs.NATURA2000,
  Heron.options.layerdefs.CBS_POSTCODE4
];  
