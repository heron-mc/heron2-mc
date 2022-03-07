
/* global ol,Ext,Heron */

 /**----------------------------------------------------------------------------
 * Shows the y coordinate (in the statusbar).
 * <br><small><i>type: "ycoord"</i></small>
 * 
 * @class Heron.controls.MapCoordinateY
 * @extends Heron.controls.MapCoordinate
 * @constructor constructor
 * @param {Object} config - The configuration.
 * - For example:<br>
 *     config.map<br>
 *     config.format<br>
 *     config.xy_precision<br>
 *     config.options<br>
 *     config.options.MapCoordinateY.*<br>
 */
Ext.define("Heron.controls.MapCoordinateY", {
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
    console.log("Heron.controls.MapCoordinateY.constructor");
    // Create this control.
    this.callParent([config]);
  },
  /**---------------------------------------------------------------------------
   * Formats the y coordinate text.
   * 
   * @method format
   * @param {Number} coord - The coordinate to show.
   * @param {Number} precision - The precision with which the coordinate is shown.
   */
  format: function(coord,precision) {
    return "Y: " + coord.format(precision);
  },
  /**---------------------------------------------------------------------------
   * Extracts the y coordinate from the event info.
   * 
   * @method getCoordinate
   * @param {Object} evt - Event info.
   * @Return {Number}
   */
  getCoordinate: function(evt) {
    return evt.coordinate[1];
  }
});
