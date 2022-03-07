
/* global Heron */

Heron.TEST = false;

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
    },{
      xtype: "hr_HtmlPanel",
      title: __("Information"),
      flex: 2,
      html: 
"<p>This example shows a simple layertree to switch layers on or off.</p>"+
"<p>In some cases additional layer info is shown when <em>hovering</em> with the "+
"cursor over a layer name.</p>"
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

