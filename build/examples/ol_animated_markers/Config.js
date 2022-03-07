
/* global Heron */

Heron.TEST = false;

// Set the startup zoomlevel.
Heron.options.map.settings.zoom = 11;

// Define layers.
Heron.options.map.layers = [
  //Heron.options.layerdefs.BRT_ACHTERGROND,
  Heron.options.layerdefs.OPENBASISKAART
];  

Heron.app.launch.beforeEnd = function() {
  app.init();
};

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
    resizable: true,
    split: true,
    layout: {
      type: "vbox",
      align: "stretch"
    },
    width: "30%",
    items: [{
      xtype: "hr_SimpleLayerTreePanel",
      flex: 1
    }]
  }]
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
