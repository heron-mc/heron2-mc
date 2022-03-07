
/* global Heron */

Heron.TEST = false;

Heron.app.launch.beforeEnd = function() {
  app.init();
};

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
    width: "30%",
    items: [{
      xtype: "panel",
      title: "Color settings",
      flex: 1,
      bodyPadding: 5,
      defaults: {
        width: "100%",
        value: 100,
        increment: 10,
        minValue: 0,
        maxValue: 100
      },
      items: [{
        xtype: "label",
        id: "labelHue",
        text: "Hue: 0°"
      },{
        xtype: "slider",
        id: "sliderHue",
        value: 0,
        minValue: -180,
        maxValue: 180,
        listeners: {
          change: function(slider, newValue, thumb, eOpts){
            app.updateLabel(slider.labelIndex,slider.labelId,newValue,slider.labelUnit);
            app.raster.changed();
          }
        }
      },{
        xtype: "label",
        id: "labelChroma",
        text: "Chroma:"
      },{
        xtype: "slider",
        id: "sliderChroma",
        listeners: {
          change: function(slider, newValue, thumb, eOpts){
            app.updateLabel(slider.labelIndex,slider.labelId,newValue,slider.labelUnit);
            app.raster.changed();
          }
        }
      },{
        xtype: "label",
        id: "labelLightness",
        text: "Lightness:"
      },{
        xtype: "slider",
        id: "sliderLightness",
        listeners: {
          change: function(slider, newValue, thumb, eOpts){
            app.updateLabel(slider.labelIndex,slider.labelId,newValue,slider.labelUnit);
            app.raster.changed();
          }
        }
      }]
    }]
  },{
    xtype: "panel",
    region: "east",
    layout: "fit",
    width: "30%",
    items: [{
      xtype: "hr_HtmlPanel",
      title: __("Information"),
      flex: 2,
      html: 
  "<p>In OpenLayers 4 a raster source allows arbitrary manipulation of pixel "+
  "values.</p>"+
  "<p>In this example, RGB values on the input tile source are adjusted "+
  "in a pixel-wise operation before being rendered with a second raster source.</p>"+
  "<p>The raster operation takes pixels in in RGB space, converts them to HCL "+
  "color space, adjusts the values based on the controls above, and then "+
  "converts them back to RGB space for rendering.</p>"
    }]
  }]
};

app.raster = new ol.source.Raster({
  name: "Stamen Watercolor",
  sources: [new ol.source.Stamen({
    layer: 'watercolor',
    transition: 0
  })]
});

Heron.options.map.layers = [
  new ol.layer.Image({
    source: app.raster
  })
];
