
/* global Heron */

Heron.TEST = false;

// Toolbar.
Heron.options.map.toolbar.items = [
  {type: "pan"},
  {type: "zoomin"},
  {type: "zoomout"},
  {type: "zoomdefault"},
  {type: "zoomprevious"},
  {type: "zoomnext"}
];

// With sliders.
Heron.options.layout = {
  xtype: "panel",
  layout: "border",
  items: [{
    xtype: "panel",
    region: "center",
    layout: {
      type: "vbox",
      align: "stretch"
    },
    items: [{
      xtype: "hr_MapPanel"
    },{
      xtype: "slider",
      id: "slider",
      width: "100%",
      height: 28,
      value: 50,
      increment: 1,
      minValue: 0,
      maxValue: 100,
      listeners: {
        change: function(slider, newValue, thumb, eOpts){
          Heron.App.map.render();
        }
      }
    }]
  },{
    xtype: "panel",
    region: "east",
    layout: {
      type: "vbox",
      align: "stretch"
    },
    width: "30%",
    items: [{
      xtype: "hr_HtmlPanel",
      title: __("Information"),
      html: 
"<p>Use the <em>slider</em> to 'swipe' the layers.</p>"+
"<p>In OpenLayers 4 you can use the 'precompose' event of a layer to manipulate "+
"the layer's appearance.</p>"
    }]
  }]
};

Heron.options.map.settings = {
  center: [0,0],
  zoom: 2
};

Heron.options.map.layers = [
  new ol.layer.Tile({
    source: new ol.source.OSM()
  }),
  new ol.layer.Tile({
    source: new ol.source.Stamen({
      layer: "toner",
    })
  })
];

swipeLayer = Heron.options.map.layers[1];

swipeLayer.on("precompose", function(event) {
  let ctx = event.context;
  let slider = Ext.getCmp("slider");
  let width = ctx.canvas.width * (slider.getValue() / 100);
  ctx.save();
  ctx.beginPath();
  ctx.rect(width, 0, ctx.canvas.width - width, ctx.canvas.height);
  ctx.clip();
});

swipeLayer.on("postcompose", function(event) {
  let ctx = event.context;
  ctx.restore();
});

