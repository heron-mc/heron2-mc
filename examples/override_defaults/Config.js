
/* global Heron */

Heron.TEST = false;

Heron.options.map.toolbar.items = [
  {type: "pan"},
  {type: "zoomin"},
  {type: "zoomout"},
  {type: "zoomdefault"},
  {type: "zoomprevious"},
  {type: "zoomnext"},
  {type: " "},
  {type: "any",
    options: {
      // Button configs.
      text: "Show Message",
      glyph: Heron.icons.exclamation,
      handler: function() {
        Heron.Utils.msgBoxInfo("This is a message.");
      }
    }
  }
];

// Modify epsg panel content and style.
Heron.options.map.statusbar.items = [
  { type: "epsgpanel",
    options: {
      // TextItem and Control configs.
      width: 140,
      style: "background: darkgray; color: white;",
      format: function(code) {
        return "Projection - " + code;
      }
    }
  }
];

// Some panels, in Floating Window.
Heron.options.layout = {
  xtype: "panel",
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
      html: "<p>This example how to add a <em>custom</em> toolbar button "+
            "and how to change the statusbar EPSG panel <em>styling</em> "+
            "by overriding the default configuration.</p>"
    }]
  }]
};