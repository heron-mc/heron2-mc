
/* global Heron */

Heron.TEST = false;

// Set the startup zoomlevel.
Heron.options.map.settings.zoom = 8;

// Define layers.
Heron.options.map.layers = [
  Heron.options.layerdefs.OPENBASISKAART,
  Heron.options.layerdefs.NATURA2000
];  

// Change layer visibility.
layerSetVisible(Heron.options.layerdefs.NATURA2000,true);

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
    layout: {
      type: "vbox",
      align: "stretch"
    },
    width: "20%",
    items: [{
      xtype: "hr_SimpleLayerTreePanel"
    }]
  },{
    xtype: "panel",
    region: "east",
    layout: "fit",
    resizable: true,
    width: "20%",
    items: [{
      xtype: "hr_HtmlPanel",
      title: __("Information"),
      flex: 2,
      html: 
"<p>This example lets you get information from objects from specific layers "+
"in the map. Not all layers can provide object information.</p>"+
"<p>To get information <em>activate the i-button</em> in the toolbar and "+
"<em>click in the map</em> on a 'Natura 2000' polygon.</p>"
    }]
  },{
    xtype: "panel",
    region: "south",
    resizable: true,
    layout: {
      type: "vbox",
      align: "stretch"
    },
    height: "20%",
    items: [{
      xtype: "hr_SimpleFeatureInfoPanel",
      title: __("Feature Info")
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
  {type: "zoomnext"},
  {type: " "},
  {type: "simplefeatureinfo"}
];

