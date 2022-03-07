
/* global ol,Ext,Heron */

/**-----------------------------------------------------------------------------
 * Logs some map info after the map extents is changed.
 * 
 * Remarks: - Even logs the info when Heron.DEBUG is false.
 * 
 * @class Heron.debug.LogMapInfo
 * @constructor constructor
 * - For example:<br>
 *     config.map<br>
 */
Ext.define("Heron.debug.LogMapInfo", {
  /**
   * The map. Can be null.
   * 
   * @property {ol.Map} map
   */
  map: null,
  /**---------------------------------------------------------------------------
   * @method constructor
   * @param {Object} config - The configuration.
   */
  constructor: function(config) {

    console.log("Heron.debug.LogMapInfo.constructor");

    // Check config.
    if (!isSet(config)) config = {};

    // Check map.
    if (!isSet(config.map))
      return;

    // Set local members.
    this.map = config.map;

    // Create this control.
    this.callParent([config]);

    // Create event handler.
    this.map.on("moveend",this.onMoveEnd,this);
  },
  /**---------------------------------------------------------------------------
   * Event handler that shows the current zoomlevel and resolution after
   * the map is zoomed or panned.
   *
   * @method onMouseEnd
   */
  onMoveEnd: function() {
    let s = "";
    s += __("Current zoomlevel: ")+this.map.getView().getZoom();
    s += "   ";
    s += __("Current resolution: ")+this.map.getView().getResolution();
    console.log(s);
  }
});
