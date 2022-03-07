
/* global ol,Ext,Heron */

 /**----------------------------------------------------------------------------
 * Shows the x coordinate (in the statusbar).
 * <br><small><i>type: "xcoord"</i></small>
 * 
 * @class Heron.controls.MapCoordinateX
 * @extends Heron.controls.MapCoordinate
 * @constructor constructor
 * @param {Object} config - The configuration.
 * - For example:<br>
 *     config.map<br>
 *     config.format<br>
 *     config.xy_precision<br>
 *     config.options<br>
 *     config.options.MapCoordinateX.*<br>
 */
Ext.define("Heron.controls.MapCoordinateX", {
  extend: "Heron.base.MapCoordinate",
  requires: [
    "Heron.base.MapCoordinate",
    "Heron.Utils"
  ],
  /**---------------------------------------------------------------------------
   * @method constructor
   * @param {Object} config - The configuration.
   */
  constructor: function(config) {
    console.log("Heron.controls.MapCoordinateX.constructor");
    // Create this control.
    this.callParent([config]);
  },
  /**---------------------------------------------------------------------------
   * Formats the x coordinate text.
   * 
   * @method format
   * @param {Number} coord - The coordinate to show.
   * @param {Number} precision - The precision with which the coordinate is shown.
   */
  format: function(coord,precision) {
    return "X: " + coord.format(precision);
  },
  /**---------------------------------------------------------------------------
   * Extracts the x coordinate from the event info.
   * 
   * @method getCoordinate
   * @param {Object} evt - Event info.
   * @Return {Number}
   */
  getCoordinate: function(evt) {
    return evt.coordinate[0];
  }
});
