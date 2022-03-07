
/* global ol,Ext,Heron,console.log */

/**-----------------------------------------------------------------------------
 * The Heron Application.
 * 
 * @class Heron.Application
 * @extends Ext.Component
 */
Ext.define("Heron.Application", {
  extend: "Ext.Component",
  requires: [
    "Heron.widgets.HtmlPanel",
    "Heron.widgets.MapPanel",
    "Heron.widgets.SimpleFeatureInfoPanel",
    "Heron.widgets.SimpleLayerTreePanel",
    "Heron.debug.Test",
    "Heron.OLUtils",
    "Heron.Theme",
    "Heron.Utils"
  ],
  /**
   * The map context.
   * 
   * @property {undefined} mapContext
   * @default null
   */
  mapContext: null,
  /**
   * The map.
   * 
   * @property {ol.Map} map
   */
  map: null,
  /**
   * The mappanel.
   * 
   * @property {Heron.widgets.MapPanel} mapPanel 
   */
  mapPanel: null,
  /**---------------------------------------------------------------------------
   * Starts the Heron application.
   * 
   * @method launch
   * @param {Object} config - The application configuration (i.e. Heron.app).
   * - For example:
   *   - config.fullVersion
   *   - config.launch.afterStart
   *   - config.launch.beforeEnd
   * @param {Object} options - Additional configuration (i.e. Heron.options).
   * - For example:
   *   - options.layout
   *   - options.map
   *   - options.mapContext
   */
  launch: function(config,options) {

    console.log("Heron.Application.launch");

    // Show log message with Heron version.
    consoleLog("Heron Version: " + config.fullVersion);

    // Check TEST settings.
    if (Heron.TEST) {
      // Initialize the Heron test facilities.
      Heron.debug.Test.init();
    }
    
    // Is the afterStart function defined?
    if (isSet(config.launch.afterStart)) {
      config.launch.afterStart(this);
    }

    // Update default toolbar layout and style based on the current loaded theme.
    Heron.Theme.updateToolbarLayoutAndStyle();

    // Check the layout.
    if (!isSet(options.layout)) {
      Heron.Utils.msgConfigError(null,__("No Heron.options.layout specified in the config!"));
      return;
    }

    // If a Heron.context URL was specified (mapContext.url), load the 
    // context file first (async).
    if (!isEmpty(options.mapContext.url)) {
      // Load the Heron mapContext.
      // Then via the callback perform the rest of the initialization.
      this.loadMapContext(options.mapContext);
    } else {
      // No mapContext, just create layout.
      this.createLayout(options.layout);
    }

    // Fire the afterlayout event.
    this.fireEvent("afterlayout",this);
    
    // Is the launch.beforeEnd function defined?
    if (isSet(config.launch.beforeEnd)) {
      config.launch.beforeEnd(this);
    }
  },
  /**---------------------------------------------------------------------------
   * This event handler is fired after the layout (and the map) is created.
   * Components can use this event handler when a map reference is needed.
   *
   * @example 
   * Heron.App.on("afterlayout",this.onAfterLayout,this);
   *
   * @method onAfterLayout
   */
  onAfterLayout: function() {
    console.log("Heron.Application.onAfterLayout");
  },
  /**---------------------------------------------------------------------------
   * Parses the layout configuration and creates the application layout.
   * 
   * @method createLayout
   * @param {Object} layout - The layout configuration (i.e. Heron.options.layout).
   */
  createLayout: function(layout) {
    let me = this;
    let elem;
    console.log("Heron.Application.createLayout");
    try {
      // Standard Heron application with top Container widget.
      if (isSet(layout.renderTo) || layout.xtype === "window") {
        console.log("Heron.Application.createLayout - creating Heron Layout");
        // Render topComponent into a page div element or floating window.
        me.topComponent = Ext.create(layout);
        // Render to dom-element?
        if (isSet(layout.renderTo)) {
          // Add a resize-handler to update the size of the Heron app.
          elem = Ext.get(layout.renderTo);
          if (elem) {
            elem.on("resize", function() {
              me.topComponent.updateLayout();
            });          
          }
        }
      } else {
        console.log("Heron.Application.createLayout - creating Viewport");
        // Default: render top component into an ExtJS ViewPort (full screen).
        me.topComponent = new Ext.Viewport({
          id: "hr_MainWindow",
          layout: "fit",
          hideBorders: true,
          // This creates the entire layout from the config!
          items: [layout]
        });
      }
      // Show if not visible yet.
      if ((isSet(this.topComponent)) && (!this.topComponent.isVisible())) {
        this.topComponent.show();
      }
    } catch(err) {
      Heron.Utils.msgError(__("Error while creating the app layout - ")+err);
    }
  },
  /**---------------------------------------------------------------------------
   * Loads the Heron mapContext.
   * 
   * @method loadMapContext
   * @param {Object} config - The configuration.
   * - Example:
   *   - config.url
   *   - config.options
   */
  loadMapContext: function(config) {
    console.log(config);
    Heron.Utils.msgBoxInfo("Not yet implemented.");
  }
});
