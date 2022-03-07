
/* global ol,Ext,Heron */

let app = {
  map: null,
  source: null,
  clusterSource: null,
  vector: null
};

/**-----------------------------------------------------------------------------
 * Initializes the app.
 * 
 * @method init
 */
app.init = function() {
  let count;
  let distance;
  let coordinates;
  let features;
  let styleCache = {};
  let i,k;
  
  count = 20000;
  distance = 50;
  k = 4500000;
  
  // Set map.  
  this.map = Heron.App.map;
  
  this.source = new ol.source.Vector(/** @type {?} */{
    wrapX: false
  });
  
  // Create points.  
  features = new Array(count);
  for (i=0;i<count;++i) {
    coordinates = [2 * k * Math.random() - k, 2 * k * Math.random() - k];
    features[i] = new ol.Feature(new ol.geom.Point(coordinates));
  }

  this.source = new ol.source.Vector(/** @type {?} */{
    features: features
  });

  this.clusterSource = new ol.source.Cluster(/** @type {?} */{
    distance: distance,
    source: this.source
  });

  this.vector = new ol.layer.Vector(/** @type {?} */{
    name: "Points",
    source: this.clusterSource,
    style: function(feature) {
      let size;
      let style;
      size = feature.get("features").length;
      style = styleCache[size];
      if (!style) {
        style = new ol.style.Style(/** @type {?} */{
          image: new ol.style.Circle(/** @type {?} */{
            radius: 10,
            stroke: new ol.style.Stroke(/** @type {?} */{
              color: "#fff"
            }),
            fill: new ol.style.Fill(/** @type {?} */{
              color: "#3399CC"
            })
          }),
          text: new ol.style.Text(/** @type {?} */{
            text: size.toString(),
            fill: new ol.style.Fill(/** @type {?} */{
              color: "#fff"
            })
          })
        });
        styleCache[size] = style;
      }
      return style;
    }
  });
      
  this.map.addLayer(this.vector);
};
