
/* global Heron */

Heron.TEST = false;

// Layout.
Heron.options.layout = {
  xtype: "hr_MapPanel",
  options: {
    layers: [
      ["ol.layer.Tile",{
        name: "OSM",
        description: "Open Street Map - Color.",
        source: ["ol.source.OSM"]
      }]
    ]
  }
};

