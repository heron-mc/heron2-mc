
/* global ol,Ext,Heron */

/**-----------------------------------------------------------------------------
 * A panel to show the map.
 * <br><small><i>xtype: "hr_MapPanel"</i></small>
 * 
 * @class Heron.widgets.MapPanel
 * @extends Heron.base.Panel
 * @constructor constructor
 * @param {Object} config - The configuration.<br>
 * - For example:<br>
 *     config.map<br>
 *     config.options                            (merged)<br>
 *     config.options.map                        (merged)<br>
 *     config.options.map.layers                 (merged)<br>
 *     config.options.map.settings               (merged)<br>
 *     config.options.map.settings.center        (merged)<br>
 *     config.options.map.settings.zoom          (merged)<br>
 *     config.options.map.settings.zoomExtent    (merged)<br>
 *     config.options.statusbar                  (merged)<br>
 *     config.options.toolbar                    (merged)<br>
 */
Ext.define("Heron.widgets.MapPanel", {
  extend: "Heron.base.Panel",
  alias: "widget.hr_MapPanel",
  requires: [
    "Heron.debug.LogMapInfo",
    "Heron.base.Panel",
    "Heron.widgets.MapBar",
    "Heron.Utils"
  ],
  /**
   * The map center used at startup.
   * 
   * @property {ol.Coordinate} center
   * @private
   */
  center: null,
  /**
   * The zoom level used at startup.
   * 
   * @property {Number} zoom
   * @private
   */
  zoom: null,
  /**
   * The LogMapInfo control.
   * 
   * @property {LogMapInfo} logMapInfoControl
   * @private
   */
  logMapInfoControl: null,
  /**
   * Is True when using a map context.
   * 
   * @property {Boolean} useMapContext
   * @default false
   * @private
   */
  useMapContext: false,
  /**---------------------------------------------------------------------------
   * @method constructor
   * @param {Object} config - The configuration.
   */
  constructor: function(config) {
    let me = this;
    let mapComponent;
    let zoomExtent;
    let mapOptions;
    let newLayers;
    let layer;
    let i,len;

    console.log("Heron.widgets.MapPanel.constructor");

    // Check the config and merges the default config with the user config.
    config = this.checkConfig(config);
    if (!isSet(config))
      return;

    // Get the map options.
    mapOptions = config.options;
    
    // Set additional default values if not defined or marked as default.
    mapOptions.settings = checkOption(mapOptions.settings,{});
    mapOptions.layers = checkOption(mapOptions.layers,[]);
    
    // Check if we need to zoom to extent.
    if (isSet(mapOptions.settings.center) && isSet(mapOptions.settings.zoom)) {
      zoomExtent = null;
    } else {
      if (isSet(mapOptions.settings.zoomExtent)) {
        zoomExtent = mapOptions.settings.zoomExtent;
        mapOptions.settings.center = ol.extent.getCenter(mapOptions.settings.zoomExtent);
        mapOptions.settings.zoom = 0;
      }
    }

    // Convert layers defined by layerdef arrays to layer instances.
    // Invalid layerdefs are skipped.
    newLayers = [];
    for (i=0,len=mapOptions.layers.length;i<len;i++) {
      // Defined by array?
      if (mapOptions.layers[i] instanceof Array) {
        // Convert to layer instance.
        layer=Heron.Utils.parseLayerDefArray(mapOptions.layers[i]);
        // A valid layer?
        if (layer) {
          newLayers.push(layer)
        }
      } else {
        newLayers.push(mapOptions.layers[i])
      }
    }
    mapOptions.layers = newLayers;

    try {
      // Create map with options.map.
      this.map = this.createMap(mapOptions);
    } catch(err) {
      Heron.Utils.msgError(__("Error while creating the map: ")+err);
    }

    // Create and add GeoExt map component.
    mapComponent = Ext.create("GeoExt.component.Map", {
      map: this.map
    });
    
    // Add map component to the items of this panel.
    config.items = [mapComponent];

    // Create this component.
    me.callParent([config]);

    // Debugging?
    if (Heron.DEBUG) {
      // Create the map logging control.
      this.logMapInfoControl = Ext.create("Heron.debug.LogMapInfo",{
        map: this.map
      });
    }

    // Set the global OpenLayers map variable, everyone needs it.
    Heron.App.map = this.map;

    // Set the global MapPanel variable, some need it.
    Heron.App.mapPanel = this;
    
    // Need to zoom to extent?
    if (isSet(zoomExtent)) {
      // Zoom to extent.
      Heron.OLUtils.zoomToExtent(this.map,zoomExtent);
      // Set local members to the initial center and zoomlevel.
      this.center = this.map.getView().getCenter();
      this.zoom = this.map.getView().getZoom();
    } else {
      // Set local members.
      this.center = mapOptions.settings.center;
      this.zoom = mapOptions.settings.zoom;
    }
    
    // Build the toolbar (if specified).
    Heron.widgets.MapBar.buildToolbar(this,mapOptions);
    
    // Build the statusbar (if specified).
    Heron.widgets.MapBar.buildStatusbar(this,mapOptions);
  },
  /**---------------------------------------------------------------------------
   * Creates the map.
   * 
   * @method createMap
   * @param {Object} options - The map configuration.<br>
   * - For example:<br>
   *     config.controls<br>
   *     config.interactions<br>
   *     config.layers<br>
   *     config.settings<br>
   */
  createMap: function(options) {
    let viewOptions = {};
    let map;

    // Collect view options which are set.
    if (isSet(options.settings.center))
      viewOptions.center = options.settings.center;
    if (isSet(options.settings.constrainRotation))
      viewOptions.constrainRotation = options.settings.constrainRotation;
    if (isSet(options.settings.enableRotation))
      viewOptions.enableRotation = options.settings.enableRotation;
    if (isSet(options.settings.extent))
      viewOptions.extent = options.settings.extent;
    if (isSet(options.settings.maxResolution))
      viewOptions.maxResolution = options.settings.maxResolution;
    if (isSet(options.settings.minResolution))
      viewOptions.minResolution = options.settings.minResolution;
    if (isSet(options.settings.maxZoom))
      viewOptions.maxZoom = options.settings.maxZoom;
    if (isSet(options.settings.minZoom))
      viewOptions.minZoom = options.settings.minZoom;
    if (isSet(options.settings.projection))
      viewOptions.projection = options.settings.projection;
    if (isSet(options.settings.resolution))
      viewOptions.resolution = options.settings.resolution;
    if (isSet(options.settings.resolutions))
      viewOptions.resolutions = options.settings.resolutions;
    if (isSet(options.settings.rotation))
      viewOptions.rotation = options.settings.rotation;
    if (isSet(options.settings.zoom))
      viewOptions.zoom = options.settings.zoom;
    if (isSet(options.settings.zoomFactor))
      viewOptions.zoomFactor = options.settings.zoomFactor;
    
    // Create the map.
    map = new ol.Map(/** @type {?} */{
      layers: options.layers,
      controls: options.controls,
      interactions: options.interactions,
      keyboardEventTarget: options.keyboardEventTarget,
      view: new ol.View(viewOptions)
    });
    return map;
  },
  /**
   * Zoom to default center/zoom.
   * @method zoomToDefault
   */
  zoomToDefault: function() {
    // Reset map rotation.
    this.map.getView().setRotation(0);
    // Zoom to default center and zoom level.
    Heron.OLUtils.zoomToCenter(this.map,this.center,this.zoom);
  }
});
    