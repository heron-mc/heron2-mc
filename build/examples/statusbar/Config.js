
/* global Heron */

Heron.TEST = false;

// OK, no statusbar.
Heron.options.map.statusbar.items = [];

// OK, using default settings.
Heron.options.map.statusbar.items = [
  {type: "->"},
  {type: "xcoord"},
  {type: "ycoord"}
];

// OK, using default settings.
Heron.options.map.statusbar.items = [
  {type: "epsgpanel"},
  {type: "->"},
  {type: "xcoord"},
  {type: "ycoord"}
];

// OK, using default settings (with epsgpanel, but hidden).
Heron.options.map.statusbar.items = [
  {type: "epsgpanel",options: {
    cls: "hr-statusbar-item-bold",
    hidden: true,
    width: 120,
    format: function(code) {
      return "Projection - " + code;
    }
  }},
  {type: "->"},
  {type: "xcoord"},
  {type: "ycoord"}
];

// OK, overrides some default settings.
Heron.options.map.statusbar.items = [
  {type: "epsgpanel",options: {
    format: function(code) {
      return "Projection - " + code;
    }
  }},
  {type: "->"},
  {type: "xcoord",options: {
    format: function(coord,precision) {
      return "X: " + coord.formatNL(precision) + " m.";
    }
  }},
  {type: "ycoord",options: {
    format: function(coord,precision) {
      return "Y: " + coord.formatNL(precision) + " m.";
    }
  }}
];

// OK, default items.
Heron.options.map.statusbar.items = [
  {type: "epsgpanel"},
  {type: "->"},
  {type: "xcoord"},
  {type: "ycoord"}
];

// OK, overrides the format method.
Heron.options.map.statusbar.items = [
  {type: "epsgpanel",options: {
    format: function(code) {
      return "Projection - " + code;
    }
  }},
  {type: "->"},
  {type: "xcoord",options: {
    width: 120,
    format: function(coord,precision) {
      return "X: " + coord.formatNL(precision) + " meter";
    }
  }},
  {type: "ycoord",options: {
    width: 120,
    format: function(coord,precision) {
      return "Y: " + coord.formatNL(precision) + " meter";
    }
  }}
];

// OK, variable width.
Heron.options.map.statusbar.item.width = null;
