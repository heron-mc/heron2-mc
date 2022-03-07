
/* global Ext,Heron */

// Override default MapCoordinates settings.
Heron.options.map.MapCoordinateX.xy_precision = 3;

Heron.options.map.statusbar.items = [
  {type: "epsgpanel",options: {
    margin: "0 0 0 0",
    format: function(code) {
      return "Code: " + code;
    }
  }},
  {type: "->"},
  {type: "xcoord",options: {
    format: function(coord,precision) {
      return "X: " + coord.toFixed(precision) + " m";
    }
  }},
  {type: "ycoord",options: {
    format: function(coord,precision) {
      return "Y: " + coord.toFixed(precision) + " m";
    }
  }}
];

// Define layout.
Heron.options.layout = {
  xtype: "panel",
  renderTo: Ext.get("mapdiv"),
  width: "100%",
  height: "100%",
  layout: "border",
  border: false,
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
      xtype: "hr_HtmlPanel",
      title: __("Information"),
      flex: 1,
      html: "<p>This example shows a heron app in a <em>&lt;div&gt;</em> element in a "+
            "html page.</p>"
    }]
  }]
};
