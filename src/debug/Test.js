
/* global Ext,NaN */

/**-----------------------------------------------------------------------------
 * For testing.
 * <br><i>singleton</i>
 * @class Heron.debug.Test
 * @constructor constructor
 */
Ext.define("Heron.debug.Test", {
  singleton: true,
  requires: [
    "Ext.window.Toast"
  ],
  /**---------------------------------------------------------------------------
   * Initializes the test environment. Install a test button in the toolbar.
   * 
   * @method init
   */
  init: function() {
    let me = this;
    console.log("Heron.debug.Test.init")
    if (!isSet(Heron.options.map.toolbar.items)) {
      Heron.options.map.toolbar.items = [];
    }
    if (Heron.options.map.toolbar.items.length>0) {
      Heron.options.map.toolbar.items.push({type: " "});
    }
    Heron.options.map.toolbar.items.push({
      type: "any",
      options: {
        tooltip: __("Test"),
        text: __("Test"),
        handler: function() {
          me.test(); 
        }
      }
    });
  },
  /**---------------------------------------------------------------------------
   * Main test method.
   * @method test
   */
  //---------------------------------------------------------------------------
  test: function() {
    let me = this;
    me.test_ConsoleLog();
  },
  /**---------------------------------------------------------------------------
   * @method test_ConsoleLog
   */
  test_ConsoleLog: function() {
    console.log("test_ConsoleLog");
  },
});
