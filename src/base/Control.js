
/* global ol,Ext,Heron */
/* global __ */

/**-----------------------------------------------------------------------------
 * The base class for controls (i.e. a toolbar or statusbar item).
 * 
 * @class Heron.base.Control
 * @constructor constructor
 * @param {Object} config - The configuration.
 */
Ext.define("Heron.base.Control", {
  requires: [
    "Heron.Utils"
  ],
  /**
   * The class name of the control.
   * 
   * @property {String} className
   */
  className: "",
  /**
   * The binded ui component. Can be null.
   * 
   * @property {Ext.Component} component 
   */
  component: null,
  /**
   * True if the control is active.
   * 
   * @property {Boolean} isActive
   * @default false
   */
  isActive: false,
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

    console.log("Heron.base.Control.constructor");

    // Set class name.
    if (isEmpty(this.className))
      this.className = Heron.Utils.getClassName(this);

    // Create this control.
    this.callParent([config]);
  },
  /**---------------------------------------------------------------------------
   * Binds this control to an ExtJS component i.e. for example an
   * Ext.toolbar.TextItem, and updates the code.
   * 
   * @method bind
   * @param {Ext.Component} cmp - The ui component.
   * @param {Boolean} [update] - When True updates the ui component.
   * - Default: true
   */
  bind: function(cmp,update=true) {
    // Set local component.
    this.component = cmp;
    // Need to update the component?
    if (update) {
      // Update the component.
      this.updateComponent();
    }
  },
  /**---------------------------------------------------------------------------
   * Checks the control config. Merges the default config with the user
   * config. Returns the merged config.
   * 
   * @method checkConfig
   * @param {Object} config - The configuration.
   * - For example:<br>
   *     config.map<br>
   *     config.options<br>
   * @param {Boolean} [needMap] - When True checks if the map is set in the
   * configuration.
   * - Default: false
   * @return {Object}
   */
  checkConfig: function(config,needMap=false) {
    let controlConfig;
    
    console.log("Heron.base.Control.checkConfig");

    // Check config.
    if (!isSet(config)) config = {};

    // Check config options.
    if (!isSet(config.options)) {
      Heron.Utils.msgConfigError(this,
        __("No 'options' found in the config."));
      return null;
    }

    // Need to check the map?
    if (needMap) {
      // Check map.
      if (!isSet(config.map)) {
        Heron.Utils.msgConfigError(this,
          __("No '{0}' found in the config.").format("map"));
        return null;
      }
    }

    // Get and set class name.
    if (isEmpty(this.className))
      this.className = Heron.Utils.getClassName(this);

    // Do we have control default settings?
    if (isSet(config.options[this.className])) {
      // Override the default panel config with the user settings.
      controlConfig = Ext.apply({},config,config.options[this.className]);
    } else {
      // Copy user config.
      controlConfig = Ext.apply({},config);
    }

    // Set local members.
    if (needMap) {
      this.map = config.map;
    }

    return controlConfig;
  },
  /**---------------------------------------------------------------------------
   * Formats the text.
   * This method can be overridden in the user config.
   * 
   * @method format
   * @param {String} text - The text to show.
   */
  format: function(text) {
    return text;
  },
  /**---------------------------------------------------------------------------
   * Returns True when the control is active else returns False.
   * 
   * @method getActive
   * @return {Boolean}
   */
  getActive: function() {
    return this.isActive;
  },
  /**---------------------------------------------------------------------------
   * Activates or deactivates the control.
   * 
   * @method setActive
   * @param {Boolean} flag - When True activates the control else deactivates
   * the control.
   */
  setActive: function(flag) {
    console.log("Heron.base.Control.setActive "+flag);
    // Is already active?
    if ((flag===true) && (this.isActive))
      return;
    // Not active?
    if ((flag===false) && (!this.isActive))
      return;
    if (flag===true) {
      // Install event handlers.
      this.setEventHandlers(true);
    } else {
      // Deinstall event handlers.
      this.setEventHandlers(false);
    }
    // Update active flag.
    this.isActive = flag;
  },
  /**---------------------------------------------------------------------------
   * Installs or deinstalls the event handler(s).
   * Can be overridden in subclasses.
   * 
   * @example
   *   if (flag===true) {<br>
   *     this.map.on("singleclick",this.onMouseClick,this);<br>
   *   } else {<br>
   *     this.map.un("singleclick",this.onMouseClick,this);<br>
   *   };
   *
   * @method setEventHandlers
   * @param {Boolean} flag - When True installs the event handlers else
   * deinstalls them.
   */
  setEventHandlers: function(flag) {
  },
  /**---------------------------------------------------------------------------
   * Updates the ui component. Is called in method <b>bind</b>.
   * Can be overridden in subclasses.
   * 
   * @method updateComponent
   */
  updateComponent: function() {
  }
});
        
