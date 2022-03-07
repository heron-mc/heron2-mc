
/* global Heron */

Heron.TEST = false;

// Define layers.
Heron.options.map.layers = [
  Heron.options.layerdefs.OSM
];

// Change layer visibility.
layerSetVisible(Heron.options.layerdefs.OSM,true);

Heron.app.launch.beforeEnd = function() {
  app.init();
};

// Default buttons.
Heron.options.map.toolbar.items = [
  {type: "pan"},
  {type: "zoomin"},
  {type: "zoomout"},
  {type: "zoomdefault"},
  {type: "zoomprevious"},
  {type: "zoomnext"}
];

// Layout.
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
    width: "20%",
    items: [{
      xtype: "hr_SimpleLayerTreePanel",
      flex: 1
    },{
      xtype: "hr_HtmlPanel",
      title: __("Information"),
      flex: 1,
      html: "<p>OpenLayers 4 supports client-side clustering.</p>"+
            "<p><em>Zoomin</em> and <em>Zoomout</em> to show different "+
            "levels of feature clustering.</p>"
    }]
  }]
};

