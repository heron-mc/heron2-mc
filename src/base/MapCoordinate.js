
/* global ol,Ext,Heron */

/**-----------------------------------------------------------------------------
 * The base class for the MapCoordinateX and MapCoordinateY controls.
 * 
 * @class Heron.base.MapCoordinate
 * @extends Heron.base.Control
 * @constructor constructor
 * @param {Object} config - The configuration.
 * - For example:<br>
 *     config.map<br>
 *     config.format<br>
 *     config.xy_precision<br>
 *     config.options<br>
 */
Ext.define("Heron.base.MapCoordinate", {
  extend: "Heron.base.Control",
  requires: [
    "Heron.base.Control",
    "Heron.Utils"
  ],
  /**
   * The x or y coordinate to show.
   * 
   * @property {Number} xy_precision 
   */
  coord: 0,
  /**
   * The precision for the x- and y-coordinate.
   * 
   * @property {Number} xy_precision 
   */
  xy_precision: 0,
  /**
   * @method constructor
   * @param {Object} config - The configuration.
   */
  constructor: function(config) {
    console.log("Heron.base.MapCoordinate.constructor");

    // Check the config and merges the default config with the user config.
    config = this.checkConfig(config,true);
    if (!isSet(config))
      return;

    // Create this control.
    this.callParent([config]);

    // Set needed properties to local default values if not set.
    this.xy_precision = checkOption(config.xy_precision,this.xy_precision);
    this.format = checkOption(config.format,this.format);

    // Install event handlers.
    this.setEventHandlers();
  },
  /**---------------------------------------------------------------------------
   * Formats the coordinate text.
   * This method can be overridden in the user config.
   * 
   * @method format
   * @param {Number} coord - The coordinate to show.
   * @param {Number} precision - The precision with which the coordinate is shown.
   */
  format: function(coord,precision) {
    return coord.toFixed(precision);
  },
  /**---------------------------------------------------------------------------
   * Extracts the x or y coordinate from the event info.
   * This method can be overridden in the user config.
   * 
   * @method getCoordinate
   * @param {Object} evt - Event info.
   * @Return {Number}
   */
  getCoordinate: function(evt) {
    return evt.coordinate[0];
  },
  /**---------------------------------------------------------------------------
   * Updates the x or y coordinate when moving the mouse over the map.
   * 
   * @method onMouseMove
   * @param {Object} evt              - Event info.
   */
  onMouseMove: function(evt) {
    // Set coordinate.
    this.coord = this.getCoordinate(evt);
    this.updateComponent();
  },
  /**---------------------------------------------------------------------------
   * Installs the onMouseMove event handler.
   * 
   * @method setEventHandlers
   */
  setEventHandlers: function() {
    let me = this;

    // Create the pointer interaction.
    this.interaction = new ol.interaction.Pointer(/** @type {?} */ {
      handleMoveEvent: function(evt) {
        me.onMouseMove(evt);
      }
    });
    
    // Add the interaction to the map.
    this.map.addInteraction(this.interaction);

    // Activate interaction.
    this.interaction.setActive(true);
  },
  /**---------------------------------------------------------------------------
   * Updates the coordinate text. Uses the <b>format</b> method to format
   * the text.
   * 
   * @method updateComponent
   */
  updateComponent: function() {
    // Is the component not set?
    if (!isSet(this.component))
      return;
    if (!isSet(this.coord))
      return;
    // Set the text.
    this.component.setHtml(this.format(this.coord,this.xy_precision));
  }
});
