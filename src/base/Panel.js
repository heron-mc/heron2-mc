
/* global ol,Ext,Heron */
/* global __ */

/**-----------------------------------------------------------------------------
 * The base class for panels.
 * 
 * @class Heron.base.Panel
 * @extends Ext.panel.Panel
 * @constructor constructor
 * @param {Object} config - The configuration.
 */
Ext.define("Heron.base.Panel", {
  extend: "Ext.panel.Panel",
  requires: [
    "Ext.panel.Panel",
    "Heron.Utils"
  ],
  /**
   * The class name of the control.
   * 
   * @property {String} className
   */
  className: "",
  /**
   * The map. Can be null.
   * Is only present after the whole application layout is rendered i.e.
   * when the onAfterRender event is fired.
   * 
   * @property {ol.Map} map
   */
  map: null,
  /**---------------------------------------------------------------------------
   * @method constructor
   * @param {Object} config - The configuration.
   */
  constructor: function(config) {
    
    console.log("Heron.base.Panel.constructor");

    // Set class name.
    if (isEmpty(this.className))
      this.className = Heron.Utils.getClassName(this);

    // Create this component.
    this.callParent([config]);

    // Create event handler.
    // Handles the loading of the map layers when the map is created.
    Heron.App.on("afterlayout",this.onAfterLayout,this);
    
    // Create event handler.
    this.on("afterrender",this.onAfterRender,this);
  },
  /**---------------------------------------------------------------------------
   * Checks the panel config. Merges the default config with the user
   * config. Returns the merged config.
   * 
   * @method checkConfig
   * @param {Object} config - The configuration.<br>
   * @return {Object}
   */
  checkConfig: function(config) {
    let defaultConfig;
    let panelConfig;
    
    console.log("Heron.base.Panel.checkConfig");

    // Check config.
    if (!isSet(config)) config = {};

    // Get and check the default config.
    defaultConfig = Heron.options.map;
    if (!isSet(defaultConfig)) {
      Heron.Utils.msgConfigError(this,
        __("No 'Heron.options.map' found in the config."));
      return null;
    }

    // Set the class name.
    if (isEmpty(this.className))
      this.className = Heron.Utils.getClassName(this);

    // Check the default panel config.
    if (!isSet(defaultConfig[this.className])) {
      Heron.Utils.msgConfigError(this,
        __("No 'Heron.options.map.{0}' found in the config.").format(this.className));
      return null;
    }

    // Override the default panel config with the user settings.
    panelConfig = Ext.apply({},config,defaultConfig[this.className]);

    // Set .options property.
    if (isSet(config.options)) {
      // Override the default config with the user .options settings.
      panelConfig.options = Ext.apply({},config.options,defaultConfig);
    } else {
      // Set .options property to default.
      panelConfig.options = Ext.apply({},defaultConfig);
    }

    return panelConfig;
 },
  /**---------------------------------------------------------------------------
   * This event handler sets the map when the layout is rendered (and the map
   * created).
   * 
   * @method onAfterLayout
   * @param {Object} evt - Event info.
   */
  onAfterLayout: function(evt) {
    console.log("Heron.base.Panel.onAfterLayout - " + evt);
    // Get the application map.
    this.map = Heron.App.map;
  },
  /**---------------------------------------------------------------------------
   * This event handler is called after the panel is rendered.
   * 
   * @method onAfterRender
   * @param {Object} evt - Event info.
   */
  onAfterRender: function(evt) {
  }
});
