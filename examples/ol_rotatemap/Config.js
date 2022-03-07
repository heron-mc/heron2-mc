
/* global Heron */

Heron.TEST = false;

// Enable map rotation.
Heron.options.map.interactions = [
  new ol.interaction.MouseWheelZoom(),
  new ol.interaction.DragRotateAndZoom()
];

// Define toolbar with reset rotation button.
Heron.options.map.toolbar.items = [
  {type: "pan"},
  {type: "zoomin"},
  {type: "zoomout"},
  {type: "zoomdefault"},
  {type: "zoomprevious"},
  {type: "zoomnext"},
  {type: " "},
  {type: "any",options: {
    text: "Reset Rotation",
    tooltip: "Reset map orientation to noth-up",
    glyph: Heron.icons.compass,
    handler: function() {
      Heron.App.map.getView().setRotation(0);
    }
  }}
];

// Define layout.
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
    }]
  },{
    xtype: "panel",
    region: "east",
    layout: "fit",
    width: "20%",
    items: [{
      xtype: "hr_HtmlPanel",
      title: __("Information"),
      flex: 2,
      html: 
  "<p>In OpenLayers 4 a map can be rotated.</p>"+
  "<p>Activate the <em>Pan</em> button and use <em>Shift+Drag</em> to "+
  "rotate and zoom the map around its center.</p>"+
  "<p>Use the <em>Reset Rotation</em> button to reset the map "+
  "orientation to north-up.</p>"
    }]
  }]
};
