
/* global Ext,Heron */

/**-----------------------------------------------------------------------------
 * Loader configuration.
 *
 * @method setConfig
 */
Ext.Loader.setConfig({
  // When true, adds the _dc=... tags to the source urls.
  disableCaching: Heron.disableCaching,
  enabled: true,
  paths: {
    "GeoExt": Heron.app.paths.geoext,
    "Heron": Heron.app.paths.src
  }
});

/**-----------------------------------------------------------------------------
 * Main application (HeronStart).
 * 
 * @class Ext.application
 */
Ext.application({
  requires: [
    "Heron.Application"
  ],
  /**---------------------------------------------------------------------------
   * Starts the Heron application.
   *
   * @method launch
   */
  launch: function() {
    // Create the Heron application and set the global reference.
    Heron.App = Ext.create("Heron.Application");
    // Start the application with the application configuration (i.e. Heron.app)
    // and the additional configuration (i.e. Heron.options).
    Heron.App.launch(Heron.app,Heron.options);
  }
});

