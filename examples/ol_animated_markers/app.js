
/* global ol,Ext,Heron */

let app = {
  map: null,
  source: null,
  vector: null
};

/**-----------------------------------------------------------------------------
 * Initializes the app.
 * 
 * @method init
 */
app.init = function() {
  let me = this;
  
  // Set map.  
  this.map = Heron.App.map;
  
  this.source = new ol.source.Vector(/** @type {?} */{
    wrapX: false
  });
  this.vector = new ol.layer.Vector(/** @type {?} */{
    name: "Markers",
    source: this.source
  });
  this.map.addLayer(this.vector);

  this.source.on("addfeature", function(e) {
    me.flash(e.feature);
  });

  window.setInterval(this.addRandomFeature,1000);
};

/**-----------------------------------------------------------------------------
 * @method addRandomFeature
 */
app.addRandomFeature = function() {
  let map;
  let extent;
  let dx,dy,x,y;
  let geom;
  let feature;
  map = app.map;
  extent = map.getView().calculateExtent();
  dx = extent[2]-extent[0];
  dy = extent[3]-extent[1];
  x = extent[0] + Math.random() * dx;
  y = extent[1] + Math.random() * dy;
  geom = new ol.geom.Point([x, y]);
  feature = new ol.Feature(geom);
  app.source.addFeature(feature);
};

/**-----------------------------------------------------------------------------
 * @method flash
 * @param {Object} feature
 */
app.flash = function(feature) {
  let me = this;
  let start = new Date().getTime();
  let listenerKey;

  function animate(event) {
    let vectorContext = event.vectorContext;
    let frameState = event.frameState;
    let flashGeom = feature.getGeometry().clone();
    let elapsed = frameState.time - start;
    let duration = 3000;
    let elapsedRatio = elapsed / duration;
    // Radius will be 5 at start and 30 at end.
    let radius = ol.easing.easeOut(elapsedRatio) * 25 + 5;
    let opacity = ol.easing.easeOut(1 - elapsedRatio);

    let style = new ol.style.Style(/** @type {?} */{
      image: new ol.style.Circle(/** @type {?} */{
        radius: radius,
        snapToPixel: false,
        stroke: new ol.style.Stroke(/** @type {?} */{
          color: "rgba(255, 0, 0, " + opacity + ")",
          width: 0.25 + opacity
        })
      })
    });

    vectorContext.setStyle(style);
    vectorContext.drawGeometry(flashGeom);
    if (elapsed > duration) {
      ol.Observable.unByKey(listenerKey);
      return;
    }
    // Tell OpenLayers to continue postcompose animation.
    me.map.render();
  }
  listenerKey = this.map.on("postcompose", animate);
};
