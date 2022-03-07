
/* global Heron */

Heron.TEST = false;

// Set the startup zoomlevel.
Heron.options.map.settings.zoom = 11;

// Define layers.
Heron.options.map.layers = [
  Heron.options.layerdefs.BRT_ACHTERGROND,
  Heron.options.layerdefs.OPENBASISKAART,
  Heron.options.layerdefs.CBS_POSTCODE4
];  

// Change layer visibility.
layerSetVisible(Heron.options.layerdefs.CBS_POSTCODE4,true);

Heron.app.launch.beforeEnd = function() {
  app.init();
};

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
    width: "50%",
    items: [{
      xtype: "hr_SimpleLayerTreePanel",
      flex: 1
    },{
      xtype: "hr_HtmlPanel",
      title: "Information",
      border: false,
      flex: 1,
      bodyPadding: 20,
      html: "<em>Click</em> in the map to show the number of houses per period of construction."
    },{
      title: "Chart",
      border: false,
      layout: "fit",
      flex: 2,
      bodyPadding: 5,
      items: [
        Ext.create('Ext.chart.CartesianChart', {
          id: "app_chart",
          border: false,
          store: {
            fields: ["name", "cnt"],
            data: [
              {"name": "1945", "cnt": 0},
              {"name": "1965", "cnt": 0},
              {"name": "1975", "cnt": 0},
              {"name": "1985", "cnt": 0},
              {"name": "1995", "cnt": 0},
              {"name": "2005", "cnt": 0},
              {"name": "2015", "cnt": 0},
              {"name": "2099", "cnt": 0}
            ]
          },
          interactions: ["panzoom"],
          legend: {
            docked: "bottom"
          },
          axes: [{
            type: "numeric",
            position: "left"
          },{
            type: "category",
            visibleRange: [0, 2000],
            position: "bottom"
          }],
          series: [{
            type: "bar",
            xField: "name",
            yField: "cnt",
            title: "Number of houses per period of construction",
            style: {
              fill: "#00a9e6",
              stroke: "#00668c",
              fillOpacity: 1.0,
              miterLimit: 3,
              lineCap: "miter",
              lineWidth: 2
            }
          }]
        })
      ]
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
