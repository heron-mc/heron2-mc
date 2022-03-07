
/* global ol,Ext,Heron */

/**-----------------------------------------------------------------------------
 * Gets the feature info from the first visibel WMS layer in the map
 * when clicking in the map and shows it in a panel.
 * When no panel is specified a the info is shown in a sliding popup.
 * <br><small><i>type: "simplefeatureinfo"</i></small>
 * 
 * @class Heron.controls.SimpleFeatureInfo
 * @extends Heron.base.Control
 * @constructor constructor
 * @param {Object} config - The configuration.
 * - For example:<br>
 *     config.map<br>
 *     config.infoPanelId<br>
 *     config.options<br>
 *     config.options.SimpleFeatureInfo.*<br>
 */
Ext.define("Heron.controls.SimpleFeatureInfo", {
  extend: "Heron.base.Control",
  requires: [
    "Heron.base.Control",
    "Heron.Utils"
  ],
  /**
   * The info panel which shows the info.
   * 
   * @property {String} infoPanel
   * @private
   */
  infoPanel: null,
  /**
   * The id of the info panel which shows the info.
   * 
   * @property {String} infoPanelId
   * @private
   */
  infoPanelId: null,
  /**---------------------------------------------------------------------------
   * @method constructor
   * @param {Object} config - The configuration.
   */
  constructor: function(config) {

    console.log("Heron.controls.SimpleFeatureInfo.constructor");

    // Check the config and merges the default config with the user config.
    config = this.checkConfig(config,true);
    if (!isSet(config))
      return;

    // Create this control.
    this.callParent([config]);
    
    // Set needed properties to local default values if not set.
    this.infoPanelId = checkOption(config.infoPanelId,this.infoPanelId);
  },
  /**---------------------------------------------------------------------------
   * Installs or deinstalls the event handlers.
   * 
   * @method setEventHandlers
   * @param {Boolean} flag - When True installs the event handlers else
   * deinstalls them.
   */
  setEventHandlers: function(flag) {
    console.log("Heron.controls.SimpleFeatureInfo.setEventHandlers");
    if (flag===true) {
      // Install event handlers.
      this.map.on("singleclick",this.onMouseClick,this);
      this.map.on("pointermove",this.onMouseMove,this);
    } else {
      // Deinstall event handlers.
      this.map.un("singleclick",this.onMouseClick,this);
      this.map.un("pointermove",this.onMouseMove,this);
    }
  },
  /**---------------------------------------------------------------------------
   * Shows a popup message.
   * 
   * @method msgFeatureInfo
   * @param {String} text - Whe message to show.
   */
  msgFeatureInfo: function(text) {
    let msg;
    msg = "<h2>Feature Info</h2>";
    Heron.Utils.msgInfo(msg+text);
  },
  /**---------------------------------------------------------------------------
   * Processes the feature info from the Ajax request.
   * 
   * @method onFeatureInfo
   * @param {Object} evt - Event info.
   */
  onFeatureInfo: function(evt) {
    let info;
    let bcolor;
    let color;

    console.log("Heron.controls.SimpleFeatureInfo.onFeatureInfo");
    
    // Get info.
    info = evt.currentTarget.responseText;
    
    // Change header colors.
    bcolor = "#666";
    color = "#fff";
    info = info.replace("background:#eee;",
                        "background:"+bcolor+";color:"+color+";");

    // Info panel not already set?
    if (!isSet(this.infoPanel)) {
      // No empty info panel id?
      if (!isEmpty(this.infoPanelId)) {
        // Get panel.
        this.infoPanel = Ext.getCmp(this.infoPanelId);
        // Found?
        if (isSet(this.infoPanel)) {
          // Set feature info.
          this.infoPanel.setInfo(info);
        } else {
          // Show popup message.
          this.msgFeatureInfo(info);
        }
      } else {
        // Show popup message.
        this.msgFeatureInfo(info);
      }
    } else {
      // Set feature info.
      this.infoPanel.setInfo(info);
    }
  },
  /**---------------------------------------------------------------------------
   * Gets the feature info from the first visibel WMS layer in the map
   * when clicking in the map.
   * 
   * @method onMouseClick
   * @param {Object} evt - Event info.
   */
  onMouseClick: function(evt) {
    let me = this;
    let resolution;
    let projection;
    let layers;
    let source;
    let infoFormat;
    let /** @type {ol.source.ImageWMS} */ infoSource = null;
    let request;
    let url;
    let i,len;
    console.log("Heron.controls.SimpleFeatureInfo.onMouseClick");
    // Get resolution.
    resolution = this.map.getView().getResolution();
    // Get projection.
    projection = this.map.getView().getProjection();
    // Get first layer.
    layers = this.map.getLayerGroup().getLayers().getArray();
    for (i=0,len=layers.length;i<len;i++) {
      // Get layer source.
      source = layers[i].getSource();
      // Is WMS layer and visible?
      if ((source instanceof ol.source.ImageWMS) && 
          (layers[i].getVisible()===true)) {
        infoSource = source;
        break;
      }
    }
    // Valid layer source found?
    if (infoSource) {
        // Set info format.
      infoFormat = "text/html";
      // Get GetFeatureInfo url.
      url = infoSource.getGetFeatureInfoUrl(
          evt.coordinate,resolution,projection,
          {"INFO_FORMAT": infoFormat});
      // Valid url?
      if (!isEmpty(url)) {
        // Get info using Ajax request.
        request = new XMLHttpRequest();
        request.open("GET",url);
        request.addEventListener("load",function(evt) {
          me.onFeatureInfo(evt);
        });
        request.send(url);
      }
    }
  },
  /**---------------------------------------------------------------------------
   * Sets the mouse pointer type when moving the mouse over the map.
   * 
   * @method onMouseMove
   * @param {Object} evt - Event info.
   */
  onMouseMove: function(evt) {
    let coord;
    let hasHit;
    // Dragging?
    if (evt.dragging) {
      return;
    }
    // Get coordinate.
    coord = this.map.getEventPixel(evt.originalEvent);
    try {
      // Check layer features at coordinate position.
      hasHit = this.map.forEachLayerAtPixel(coord,function() {
        return true;
      });
      // Set the mouse pointer.
      this.map.getTargetElement().style.cursor = hasHit ? "pointer" : "";
    } catch(err) {
    }
  }
});
