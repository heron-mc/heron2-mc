
/* global ol,Ext,Heron */

 /**----------------------------------------------------------------------------
 * This control saves the zoom history and has methods to go to previous and
 * next zoom extent. These methods can be called from a Previous and Next
 * button.
 * <br><small><i>type: "zoomprevious"</i></small>
 * <br><small><i>type: "zoomnext"</i></small>
 * 
 * @class Heron.controls.ZoomPreviousNext
 * @extends Heron.base.control
 * @constructor constructor
 * @param {Object} config - The configuration.
 * - For example:<br>
 *     config.map<br>
 *     config.zoomDuration<br>
 *     config.options<br>
 *     config.options.ZoomPreviousNext.*<br>
 */
Ext.define("Heron.controls.ZoomPreviousNext", {
  extend: "Heron.base.Control",
  requires: [
    "Heron.base.Control",
    "Heron.Utils"
  ],
  /**
   * The binded Next button.
   * 
   * @property {Heron.widgets.ToolButton} buttonNext 
   * @private
   */
  buttonNext: null,
  /**
   * The binded Previous button.
   * 
   * @property {Heron.widgets.ToolButton} buttonPrevious 
   * @private
   */
  buttonPrevious: null,
  /**
   * The saved zoom extents.
   * 
   * @property {Array<ol.Extent>} extents 
   * @private
   */
  extents: [],
  /**
   * The current zoom state index.
   * After startup this should be 0.
   * 
   * @property {Number} currIndex 
   * @private
   */
  currIndex: -1,
  /**
   * When True the OnMoveEnd event handler doesn't record the map extent.
   * Used when the <b>previous</b> and <b>next</b> methods are called.
   * 
   * @property {Boolean} disableEvent 
   * @private
   */
  disableEvent: false,
  /**
   * The duration (in msec.) of the zoom animation.
   * 
   * @property {Number} zoomDuration 
   * @default 250
   * @private
   */
  zoomDuration: 250,
  /**---------------------------------------------------------------------------
   * @method constructor
   * @param {Object} config - The configuration.
   */
  constructor: function(config) {

    console.log("Heron.controls.ZoomPreviousNext.constructor");

    // Check the config and merges the default config with the user config.
    config = this.checkConfig(config,true);
    if (!isSet(config))
      return;

    // Create this control.
    this.callParent([config]);

    console.log("Heron.controls.ZoomPreviousNext.constructor 2");

    // Set default values if not defined or marked as default.
    this.zoomDuration = checkOption(config.zoomDuration,this.zoomDuration);
    
    // Activate this control (always on).
    // THIS DOES NOT CALL this.setEventHandlers().
    this.isActive = true;

    console.log("Heron.controls.ZoomPreviousNext.constructor 3");

    // Install the event handlers.
    this.setEventHandlers(true);
  },
  /**---------------------------------------------------------------------------
   * Event handler that saves the map extent after the map is zoomed or panned.
   *
   * @method onMouseEnd
   */
  onMoveEnd: function() {
    let extent;

    console.log("Heron.controls.ZoomPreviousNext.onMoveEnd");
    
    // Don't get extent when zoomed by this control.
    if (this.disableEvent) {
      this.disableEvent = false;
      return;
    }
    
    // Resize extents?
    if (this.currIndex < this.extents.length-1) {
      this.extents.length = this.currIndex+1;
    }
    // Get current extent.
    extent = this.map.getView().calculateExtent(this.map.getSize());
    // Add new extent.    
    this.extents.push(extent);
    // Update current index.
    this.currIndex += 1;
    
    // Update buttons.
    this.updateButtons();
  },
  /**---------------------------------------------------------------------------
   * Zoom to next extent.
   * 
   * @method next
   */
  next: function() {
    let newExtent;
    this.currIndex += 1;
    // Get next extent.
    newExtent = this.extents[this.currIndex];
    // Zoom to extent.
    this.zoomToExtent(this.map,newExtent);
    // Update buttons.
    this.updateButtons();
  },
  /**---------------------------------------------------------------------------
   * Zoom to previous extent.
   * 
   * @method previous
   */
  previous: function() {
    let newExtent;
    this.currIndex -= 1;
    // Get previous extent.
    newExtent = this.extents[this.currIndex];
    // Zoom to extent.
    this.zoomToExtent(this.map,newExtent);
    // Update buttons.
    this.updateButtons();
  },
  /**---------------------------------------------------------------------------
   * Overrides the base setActive() method.
   * This control is always active, i.e. always capturing the map's 
   * MoveEnd event.
   * 
   * @method setActive
   * @param {Boolean} flag - When True activates the control else deactivates
   * the control.
   */
  setActive: function(flag) {
  },
  /**---------------------------------------------------------------------------
   * Sets the Next button.
   * 
   * @method setButtonNext
   * @param {Heron.widgets.ToolButton} button
   */
  setButtonNext: function(button) {
    this.buttonNext = button;
    this.buttonNext.disable();
  },
  /**---------------------------------------------------------------------------
   * Sets the Previous button.
   * 
   * @method setButtonPrevious
   * @param {Heron.widgets.ToolButton} button
   */
  setButtonPrevious: function(button) {
    this.buttonPrevious = button;
    this.buttonPrevious.disable();
  },
  /**---------------------------------------------------------------------------
   * Installs or deinstalls the <b>onMoveEnd</b> event handler.
   * 
   * @method setEventHandlers
   * @param {Boolean} flag - When True installs the event handler else
   * deinstall it.
   */
  setEventHandlers: function(flag) {
    console.log("Heron.controls.ZoomPreviousNext.setEventHandlers");
    if (flag===true) {
      // Install event handlers.
      this.map.on("moveend",this.onMoveEnd,this);
    } else {
      // Deinstall event handlers.
      this.map.un("moveend",this.onMoveEnd,this);
    }
  },
  /**---------------------------------------------------------------------------
   * Enables/disables the Previous and Next buttons when there are zoom extents
   * or not.
   * 
   * @method updateButtons
   */
  updateButtons: function() {
    if (this.extents.length<=1) {
      this.buttonPrevious.disable();
      this.buttonNext.disable();
    } else {
      if (this.currIndex>0) {
        this.buttonPrevious.enable();
      } else {  
        this.buttonPrevious.disable();
      }
      if (this.currIndex<this.extents.length-1) {
        this.buttonNext.enable();
      } else {  
        this.buttonNext.disable();
      }
    }
  },
  /**---------------------------------------------------------------------------
   * Zoom to extent.
   * 
   * @method zoomToExtent
   * @param {ol.Map} map - The map.
   * @param {ol.Extent} extent - The zoom extent.
   */
  zoomToExtent: function(map,extent) {
    this.disableEvent = true;
    map.getView().fit(extent,/** @type {?} */{
      duration: this.zoomDuration,
      easing: ol.easing.easeOut
    });
  }
});
