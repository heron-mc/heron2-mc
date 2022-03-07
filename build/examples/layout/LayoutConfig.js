
/* global Heron */

Heron.TEST = false;

// With 3 panels, resizable.
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
    width: "20%",
    layout: {
      type: "vbox",
      align: "stretch"
    },
    items: [{
      xtype: "hr_SimpleLayerTreePanel",
      flex: 1
    },{
      xtype: "hr_HtmlPanel",
      flex: 1,
      html: "Some info..."
    }]
  }]
};

// With 3 panels, resizable.
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
    width: "20%",
    layout: {
      type: "vbox",
      align: "stretch"
    },
    items: [{
      xtype: "hr_SimpleLayerTreePanel",
      flex: 1
    },{
      xtype: "hr_HtmlPanel",
      title: "Information",
      flex: 1,
      html: "<p>This examples shows a layout with three panels and a "+
            "<em>bar</em> to resize the panels.</p>"
    }]
  }]
};
