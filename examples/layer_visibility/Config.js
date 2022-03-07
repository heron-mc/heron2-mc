
/* global Heron */

Heron.TEST = false;

// Set the startup zoomlevel.
Heron.options.map.settings.zoom = 8;

// Define layers.
Heron.options.map.layers = [
  Heron.options.layerdefs.BRT_ACHTERGROND,
  Heron.options.layerdefs.OPENBASISKAART,
  Heron.options.layerdefs.NATURA2000
];  

// Change layer visibility.
layerSetVisible(Heron.options.layerdefs.BRT_ACHTERGROND,true);
layerSetVisible(Heron.options.layerdefs.OPENBASISKAART,false);
layerSetVisible(Heron.options.layerdefs.NATURA2000,true);

// Layout with simple layer tree.
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
    //split: true,
    layout: {
      type: "vbox",
      align: "stretch"
    },
    width: "30%",
    items: [{
      xtype: "hr_SimpleLayerTreePanel"
    }]
  },{
    xtype: "panel",
    region: "east",
    layout: "fit",
    width: "20%",
    items: [{
      xtype: "hr_HtmlPanel",
      title: "Information",
      html: "<p>This examples shows how to use <em>layerSetVisible()</em> "+
            "to change the visibility of predefined layers before startup.</p>"+
            "<p><a href='./Config.js' target='_blank'><i>(Config.js)</i></a></p>"
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

