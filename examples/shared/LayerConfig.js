
/* global ol,Heron */

/**-----------------------------------------------------------------------------
 * LAYERDEFS
 */
Heron.options.layerdefs = {
  OSM: new ol.layer.Tile({
    name: "OSM",
    description: "Open Street Map - Color.",
    source: new ol.source.OSM(),
    visible: false
  }),
  OSM_GRAY: new ol.layer.Tile({
    name: "OSM Gray WMS",
    description: "Open Street Map - Gray WMS.",
    source: new ol.source.TileWMS({
      url: "https://ows.terrestris.de/osm-gray/service",
      params: {"LAYERS": "OSM-WMS", "TILED": true}
    }),
    visible: false
  }),
  STAMEN: new ol.layer.Tile({
    name: "Stamen Watercolor",
    source: new ol.source.Stamen({layer: "watercolor"})
  }),
  STAMEN_LABELS: new ol.layer.Tile({
    name: "Stamen Terrain Labels",
    source: new ol.source.Stamen({layer: "terrain-labels"})
  })
};

// Needed here because of the references.
Heron.options.layerdefs.STAMEN_GROUP = new ol.layer.Group({
  name: "Stamen Layers",
  visible: true,
  layers: [
    Heron.options.layerdefs.STAMEN,
    Heron.options.layerdefs.STAMEN_LABELS
  ]
});

Heron.options.map.layers = [
  Heron.options.layerdefs.STAMEN_GROUP,
  Heron.options.layerdefs.OSM_GRAY,
  Heron.options.layerdefs.OSM
];
