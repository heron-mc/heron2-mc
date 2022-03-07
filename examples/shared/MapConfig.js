
/* global Heron */

Heron.options.map.settings = {
  center: [0,0],
  zoom: 2
};

Heron.options.map.toolbar.items = [
  {type: "pan"},
  {type: "zoomin"},
  {type: "zoomout"},
  {type: "zoomdefault"},
  {type: "zoomprevious"},
  {type: "zoomnext"},
  {type: " "},
  {type: "any",options: {
    text: "Show Warning",
    handler: function() {
      Heron.Utils.msgConfigWarning("",
          __("This is a config warning."));

    }
  }}
];

Heron.options.map.statusbar.items = [
  {type: "epsgpanel"},
  {type: "->"},
  {type: "xcoord",options: {
    width: 100,
    format: function(x,precision) {
      return "X: " + x.toFixed(precision) + " m.";
    }
  }},
  {type: "ycoord",options: {
    width: 100,
    format: function(y,precision) {
      return "Y: " + y.toFixed(precision) + " m.";
    }
  }}
];

Heron.options.map.statusbar.items = [
  {type: "epsgpanel"},
  {type: "->"},
  {type: "xcoord"},
  {type: "ycoord"}
];
