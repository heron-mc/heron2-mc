/* global Ext,Heron */

// Some panels, in Floating Window.
Heron.options.layout = {
  xtype: "window",
  width: "80%",
  height: "80%",
  layout: "border",
  border: false,
  padding: 2,
  title: "Map in Window",
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
      html: "<p>This example shows a heron app in a floating window.</p>"+
            "<p><em>Click+Drag</em> the window caption bar to <em>move</em> the window.</p>"+
            "<p><em>Click+Drag</em> the window border to <em>resize</em> the window.</p>"
    }]
  }]
};