
/* global Heron */

Heron.TEST = false;

Heron.app.launch.beforeEnd = function() {
  app.init();
};

// With buttons.
Heron.options.map.toolbar.items = [
  {type: "pan"},
  {type: "zoomin"},
  {type: "zoomout"},
  {type: "zoomdefault"},
  {type: "zoomprevious"},
  {type: "zoomnext"}
];

// With slider
Heron.options.layout = {
  xtype: "panel",
  layout: "border",
  items: [{
    xtype: "panel",
    region: "center",
    layout: "fit",
    items: [{
      xtype: "hr_MapPanel"
    }]
  },{
    xtype: "panel",
    region: "west",
    layout: {
      type: "vbox",
      align: "stretch"
    },
    width: "30%",
    items: [{
      xtype: "panel",
      title: "Sea level",
      flex: 1,
      border: false,
      bodyPadding: 5,
      items: [{
        xtype: "label",
        text: "Current sea level:"
      },{
        xtype: "slider",
        id: "level",
        width: "100%",
        value: app.value,
        increment: app.minIncrement,
        minValue: app.minValue,
        maxValue: app.maxValue,
        hideLabel: true,
        listeners: {
          change: function(slider, newValue, thumb, eOpts){
            var levels,level;
            levels = app.getLevels();
            level = levels[newValue];
            app.output.setHtml(level+" m. NAP");
            app.raster.changed();
          }
        }
      },{
        xtype: "label",
        id: "output",
        text: app.getLevels()[app.value]+" m. NAP"
      }]
    }]
  },{
    xtype: "panel",
    region: "east",
    layout: "fit",
    width: "30%",
    items: [{
      xtype: "hr_HtmlPanel",
      title: __("Information"),
      flex: 2,
      html: 
"<p>Use the <em>slider</em> to adjust the sea level in meters below or above NAP "+
"(Normaal Amsterdams Peil).</p>"+
"<p>In OpenLayers 4 a raster source allows arbitrary manipulation of pixel "+
"values.</p>"+
"<p>This example uses a 'ol.source.Raster' with the Dutch elevation dataset "+
"AHN2 to show the situation of areas compared to the sea level.</p>"+
"<p>This example does not take into account the many dykes and flood defenses "+
"that are present in the Netherlands.</p>"
    }]
  }]
};
//This example uses a ol.source.Raster with Mapbox Terrain-RGB tiles to "flood" areas below the elevation shown on the sea level slider. 
        
Heron.options.map.settings = {
  projection: new ol.proj.Projection({code: Heron.epsg.RD_New}),
  center: Heron.options.locations.Amersfoort,
  zoom: 9
};

Heron.options.layerdefs = {
  OPENBASISKAART: new ol.layer.Tile({
    name: "OpenBasisKaart",
    extent: [0,310000,300000,630000],
    visible: true,
    source: new ol.source.XYZ({
      url: Heron.options.urls.OPENBASISKAART_TMS+"1.0.0/osm@rd/{z}/{x}/{-y}.png",
      minZoon: 0,
      maxZoom: 13,
      projection: Heron.options.map.settings.projection,
      tileGrid: new ol.tilegrid.TileGrid({
        resolutions: Heron.options.wmts.resolutions,
        extent: [-285401.920000,22598.080000,
                 595401.920000,903401.920000]
      })
    })
  })
};

app.raster = new ol.source.Raster({
  sources: [new ol.source.WMTS({
    url: Heron.options.urls.NATGEOREG_WMTS,
    layer: "ahn2_5m",
    matrixSet: "EPSG:28992",
    format: "image/png",
    projection: Heron.options.map.settings.projection,
    crossOrigin: "anonymous",
    tileGrid: new ol.tilegrid.WMTS({
      origin: ol.extent.getTopLeft(Heron.options.wmts.projectionExtent),
      resolutions: Heron.options.wmts.resolutions,
      matrixIds: Heron.options.wmts.matrixIds
    })
  })]
});

Heron.options.map.layers = [
  Heron.options.layerdefs.OPENBASISKAART,
  new ol.layer.Image({
    opacity: 1.0,
    source: app.raster
  })
];
