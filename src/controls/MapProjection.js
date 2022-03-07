
/* global ol,Ext,Heron */

/**-----------------------------------------------------------------------------
 * Show the projection EPSG code (in the statusbar).
 * <br><small><i>type: "epsgpanel"</i></small>
 * 
 * @class Heron.controls.MapProjection
 * @extends Heron.base.Control
 * @constructor constructor
 * @param {Object} config - The configuration.
 * - For example:<br>
 *     config.map<br>
 *     config.format<br>
 *     config.options<br>
 *     config.options.MapProjection.*<br>
*/
Ext.define("Heron.controls.MapProjection", {
  extend: "Heron.base.Control",
  requires: [
    "Heron.base.Control",
    "Heron.Utils"
  ],
  /**---------------------------------------------------------------------------
   * @method constructor
   * @param {Object} config - The configuration.
   */
  constructor: function(config) {

    console.log("Heron.controls.MapProjection.constructor");

    // Check the config and merges the default config with the user config.
    config = this.checkConfig(config,true);
    if (!isSet(config))
      return;

    // Create this control.
    this.callParent([config]);
    
    // Set needed properties to local default values if not set.
    this.format = checkOption(config.format,this.format);
  },
  /**---------------------------------------------------------------------------
   * Gets the projection code and shows it.
   * 
   * @method updateComponent
   */
  updateComponent: function() {
    let code;
    // Is the component not set?
    if (!isSet(this.component))
      return;
    // Get the EPSG code.
    if (this.map && this.map.getView() && this.map.getView().getProjection()) {
      code = this.map.getView().getProjection().getCode();
    } else {
      code = "--";
    }
    // Show the code.
    this.component.setHtml(this.format(code));
  }
});
