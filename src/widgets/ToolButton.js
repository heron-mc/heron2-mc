
/* global Ext, ol */

/**
 * @class Heron.widgets.ToolButton
 */
/**-----------------------------------------------------------------------------
 * A button which is shown in on the toolbar.
 * 
 * @class Heron.widgets.ToolButton
 * @extends Ext.button.Button
 * @constructor constructor
 * @param {Object} config - The configuration.
 */
Ext.define("Heron.widgets.ToolButton", {
  extend: "Ext.button.Button",
  alias : "widget.hr_ToolButton",
  /**
   * The binded control or interaction. Can be null.
   * 
   * @property {Heron.base.Control|ol.interaction.Interaction} control
   */
  control: null,
  /**
   * The map. Can be null.
   * 
   * @property {ol.Map} map
   */
  map: null,
  /**---------------------------------------------------------------------------
   * @method constructor
   * @param {Object} config - The configuration.
   */
  constructor: function(config){
    
    // Check config.
    if (!isSet(config)) config = {};

    // Check interaction.
    if (isSet(config.control)) {
      // Set local members.
      this.control = config.control;
      // Deactivate control.
      this.control.setActive(false);
    }

    // Create this component.
    this.callParent([config]);

    // Check toggleGroup.
    if (isSet(config.toggleGroup)) {
      // Create event handler.
      this.on("toggle",this.onToggle,this);
      // Check pressed.
      if (isSet(config.pressed)) {
        // Need to simulate a button press.
        if (config.pressed===true) {
          this.fireEvent("toggle",this,true);
        }
      }
    }
  },
  /**---------------------------------------------------------------------------
   * This event handler is called when the button is pressed or depressed.
   * Also called when in togglegroup when deactivated.
   * 
   * @method onToggle
   * @param {Heron.widget.ToolButton} sender - The button which was toggled.
   * @param {Boolean} pressed - True when pressed else False. .
   */
  onToggle: function(sender,pressed) {
    console.log("Heron.widgets.ToolButton.onToggle "+sender+" "+pressed);
    if (isSet(this.interaction)) {
      if (pressed) {
        if (!this.interaction.getActive())
          this.interaction.setActive(true);
      } else {
        if (this.interaction.getActive())
          this.interaction.setActive(false);
      }
    } else if (isSet(this.control)) {
      if (pressed) {
        if (!this.control.getActive())
          this.control.setActive(true);
      } else {
        if (this.control.getActive())
          this.control.setActive(false);
      }
    }
  }
});
