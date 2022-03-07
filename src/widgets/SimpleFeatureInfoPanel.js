
/* global ol,Ext,Heron */

/**-----------------------------------------------------------------------------
 * A panel to show the info from the SimpleFeatureInfo control.
 * <br><small><i>xtype: "hr_SimpleFeatureInfoPanel"</i></small>
 * 
 * @class Heron.widgets.SimpleFeatureInfoPanel
 * @extends Heron.base.Panel
 * @constructor constructor
 * @param {Object} config - The configuration.<br>
 * - For example:<br>
 *     config.map<br>
 *     config.options                            (merged)<br>
 *     config.options.SimpleFeatureInfoPanel.*   (merged)<br>
 */
Ext.define("Heron.widgets.SimpleFeatureInfoPanel", {
  extend: "Heron.base.Panel",
  alias: "widget.hr_SimpleFeatureInfoPanel",
  requires: [
    "Ext.LoadMask",
    "Heron.base.Panel",
    "Heron.Utils"
  ],
  /**---------------------------------------------------------------------------
   * @method constructor
   * @param {Object} config - The configuration.
   */
  constructor: function(config) {
    
    console.log("Heron.widgets.SimpleFeatureInfoPanel.constructor");

    // Check the config and merges the default config with the user config.
    config = this.checkConfig(config);
    if (!isSet(config))
      return;

    // Create this component.
    this.callParent([config]);
  },
  /**---------------------------------------------------------------------------
   * Shows the text fetched by the SimpleFeatureInfo control.
   * 
   * @method setInfo
   * @param {String} text - The text to show.
   */
  setInfo: function(text) {
    this.setHtml(text);    
  }
});
