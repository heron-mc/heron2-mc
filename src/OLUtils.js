
/* global ol, Ext, Heron */

/**-----------------------------------------------------------------------------
 * OpenLayers utilities.
 * <br><i>singleton</i>
 * 
 * @class Heron.OLUtils
 */
Ext.define("Heron.OLUtils", {
  singleton: true,
  /**---------------------------------------------------------------------------
   * Zooms in/out by a delta zoomlevel step.
   * 
   * @method zoomByDelta
   * @param {ol.Map} map - The map.
   * @param {Number} delta - Delta zoomlevel step.
   * @param {Number} [duration] - Easing duration.
   * - Default: 250
   */
  zoomByDelta: function(map,delta,duration=250) {
    let view;
    let currentResolution;
    let newResolution;
    view = map.getView();
    if (!view) {
      return;
    }
    currentResolution = view.getResolution();
    if (currentResolution) {
      newResolution = view.constrainResolution(currentResolution,delta);
      if (duration > 0) {
        if (view.getAnimating()) {
          view.cancelAnimations();
        }
        view.animate(/** @type {?} */{
          resolution: newResolution,
          duration: duration,
          easing: ol.easing.easeOut
        });
      } else {
        view.setResolution(newResolution);
      }
    }
  },
  /**---------------------------------------------------------------------------
   * Zoom in 1 zoomlevel.
   * 
   * @method zoomIn
   * @param {ol.Map} map - The map.
   * @param {Number} [duration] - Easing duration.
   * - Default: 250
   */
  zoomIn: function(map,duration=250) {
    this.zoomByDelta(map,1,duration);
  },
  /**---------------------------------------------------------------------------
   * Zoom out 1 zoomlevel.
   * 
   * @method zoomOut
   * @param {ol.Map} map - The map.
   * @param {Number} [duration] - Easing duration.
   * - Default: 250
   */
  zoomOut: function(map,duration=250) {
    this.zoomByDelta(map,-1,duration);
  },
  /**---------------------------------------------------------------------------
   * Zoom to center.
   * 
   * @method zoomToCenter
   * @param {ol.Map} map - The map.
   * @param {ol.Coordinate} center - Center to zoom to.
   * @param {Number} zoom - Zoomlevel to zoom to.
   * @param {Number} [duration] - Easing duration.
   * - Default: 250
   */
  zoomToCenter: function(map,center,zoom,duration=250) {
    let view;
    view = map.getView();
    if (!view) {
      return;
    }
    if (duration > 0) {
      if (view.getAnimating()) {
        view.cancelAnimations();
      }
      view.animate(/** @type {?} */{
        zoom: zoom,
        center: center,
        duration: duration,
        easing: ol.easing.easeOut
      });
    } else {
      view.animate(/** @type {?} */{
        zoom: zoom,
        center: center
      });
    }
  },
  /**---------------------------------------------------------------------------
   * Zoom to extent.
   * 
   * @method zoomToExtent
   * @param {ol.Map} map - The map.
   * @param {ol.Extent|Object} extent - Extent to zoom to.
   * - Example: [minx,miny,maxx,maxy] or {minx,miny,maxx,maxy}.
   * @param {Number} [duration] - Easing duration.
   * - Default: 250
   */
  zoomToExtent: function(map,extent,duration=250) {
    let newExtent = null;

    // Check extent.
    if (!extent) {
      return;
    }

    // Do we have an array?
    if (Array.isArray(extent)) {
      // We have an array.
      newExtent = extent;
    } else {
      // We have an object with a minx property?
      if (isSet(extent.minx) && isSet(extent.miny) &&
          isSet(extent.maxx) && isSet(extent.maxx) ) {
        newExtent =  [Number(/** @type {?} */extent.minx),
                      Number(/** @type {?} */extent.miny),
                      Number(/** @type {?} */extent.maxx),
                      Number(/** @type {?} */extent.maxy)];
      }
    }

    // Check new extent.
    if (!newExtent) {
      return;
    }
    // Zoom to extent.
    map.getView().fit(newExtent,/** @type {?} */{
      duration: duration,
      easing: ol.easing.easeOut
    });
  }
});
