
/* global Heron */

Heron.TEST = false;

// OK, no toolbar.
Heron.options.map.toolbar.items = [];

// OK, with three tools.
Heron.options.map.toolbar.items = [
  {type: "pan"},
  {type: "zoomin"},
  {type: "zoomout"}
];

// OK, with three tools and empty options.
Heron.options.map.toolbar.items = [
  // This has no effect.
  {type: "pan",options: {}},
  {type: "zoomin"},
  {type: "zoomout"}
];

// OK, overrides some default settings.
Heron.options.map.toolbar.items = [
  {type: "pan",options: {
    tooltip: "De kaart verschuiven"
  }},
  {type: "zoomin",options: {
    tooltip: "Zoom in op gebied",
    glyph: Heron.icons.plus
  }},
  {type: "zoomout",options: {
    tooltip: "Zoom uit op gebied",
    glyph: Heron.icons.minus
  }}
];

// OK, disable responsive config.
Heron.options.map.toolbar.plugins = null;
Heron.options.map.toolbar.responsiveConfig = null;

// OK, with zoomDuration.
Heron.options.map.toolbar.items = [
  {type: "pan"},
  {type: "zoomin"},
  {type: "zoomout"},
  {type: "zoomdefault"},
  {type: "zoomprevious",options: {zoomDuration: 2000}},
  {type: "zoomnext",options: {zoomDuration: 2000}}
];

// OK, with all buttons and with separations.
Heron.options.map.toolbar.items = [
  {type: "pan"},
  {type: "zoomin"},
  {type: "zoomout"},
  {type: "zoomdefault"},
  {type: "zoomprevious"},
  {type: "zoomnext"},
  {type: " "},
  {type: "simplefeatureinfo"},
  {type: " "},
  {type: "any",options: {
    text: "Show Warning",
    handler: function() {
      Heron.Utils.msgConfigWarning("",
          __("This is a warning."));
    }
  }}
];

// OK, just one button.
Heron.options.map.toolbar.items = [
  {type: "any",options: {
    text: "Show Warning",
    handler: function() {
      Heron.Utils.msgConfigWarning("",
          __("This is a warning."));
    }
  }}
];

// OK, with all buttons and with spacers.
Heron.options.map.toolbar.items = [
  {type: "pan"},
  {type: "zoomin"},
  {type: "zoomout"},
  {type: "zoomdefault"},
  {type: "zoomprevious"},
  {type: "zoomnext"},
  {type: " "},
  {type: "simplefeatureinfo"},
  {type: " "},
  {type: "any",options: {
    text: "Show Warning",
    handler: function() {
      Heron.Utils.msgConfigWarning("",
          __("This is a warning."));
    }
  }},
  {type: " "},
  {type: "any",options: {
    text: "Show Message",
    handler: function() {
      Heron.Utils.msgBoxInfo("This is a message.");
    }
  }}
];

