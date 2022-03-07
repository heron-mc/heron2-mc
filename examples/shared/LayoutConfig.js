/* global Heron */

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
    },{
      xtype: "hr_HtmlPanel",
      title: __("Info"),
      flex: 1,
      html: "Some information..."
    }]
  }]
};

