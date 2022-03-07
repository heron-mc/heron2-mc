
/* global ol,Ext,Heron */

/**-----------------------------------------------------------------------------
 * A panel to show (html) text or content.
 * <br><small><i>xtype: "hr_HtmlPanel"</i></small>
 * 
 * Remarks: - To show a vertical scrollbar in the panel use 'scrollable: true;'
 *            in the config.
 * 
 * @class Heron.widgets.HtmlPanel
 * @extends Heron.base.Panel
 * @constructor constructor
 * @param {Object} config - The configuration.<br>
 * - For example:<br>
 *     config.map<br>
 *     config.html<br>
 *     config.url<br>
 *     config.options                            (merged)<br>
 *     config.options.HtmlPanel.*                (merged)<br>
 */
Ext.define("Heron.widgets.HtmlPanel", {
  extend: "Heron.base.Panel",
  alias: "widget.hr_HtmlPanel",
  requires: [
    "Ext.LoadMask",
    "Heron.base.Panel",
    "Heron.Utils"
  ],
  /**
   * The (html) text to show.
   * 
   * @property {String} html
   */
  html: "",
  /**
   * The html template string used when loading content from an url.
   * 
   * When loading content from an url this property can be used to specify
   * an html template to format/layout the loaded content. The template
   * string must contain the tag '{content}'. This tag will be replaced with
   * the content of the loaded file.
   * 
   * @property {String} htmlTemplate
   * @private
   */
  htmlTemplate: "",
  /**
   * The load mask showed when loading content from an url.
   * 
   * @property {String} loadMask
   * @private
   */
  loadMask: null,
  /**
   * The url used to load content from an url.
   * 
   * @property {String} url
   * @private
   */
  url: "",
  /**---------------------------------------------------------------------------
   * @method constructor
   * @param {Object} config - The configuration.
   */
  constructor: function(config) {
    
    console.log("Heron.widgets.HtmlPanel.constructor");

    // Check the config and merges the default config with the user config.
    config = this.checkConfig(config);
    if (!isSet(config))
      return;

    // Check additional panel config options.
    config.html = checkOption(config.html,this.html);
    config.url = checkOption(config.url,this.url);

    // Set local members.
    this.url = config.url;
    
    // Use an url?
    if (!isEmpty(config.url)) {
      // Is a html template specified by user?
      if (!isEmpty(config.html)) {
        // Check for the '{content}' tag.
        if (!config.html.includes("{content}")) {
          // Show warning.
          Heron.Utils.msgConfigWarning(this,
            __("No '{content}' tag found in html config."));
        }
        // Use this one.
        this.htmlTemplate = config.html;
        // Reset the html setting.
        config.html = "";
      } else {
        // Set the default html template.
        this.htmlTemplate = "<div>{content}</div>";
      }
    }

    // Create this component.
    this.callParent([config]);
  },
  /**---------------------------------------------------------------------------
   * This event handler is called after the panel is rendered.
   * Is shows an load mask when loading content from an url.
   * 
   * @method onAfterRender
   * @param {Object} evt - Event info.
   */
  onAfterRender: function(evt) {
    console.log("Heron.widgets.HtmlPanel.onAfterRender " + evt);
    // Call base onAfterRender method.
    this.superclass.onAfterRender();
    // Use url?
    if (!isEmpty(this.url)) {
      // Show a load message/icon.
      this.loadMask = new Ext.LoadMask({
        msg: __("Loading..."),
        target: this
      });
      // Show loading message.
      this.loadMask.show();
      // Load url.
      this.loadUrl(this.url);
    }
  },
  /**---------------------------------------------------------------------------
   * Uses the default or user specified html template. The tag '{content}' in
   * this template will be replaced with the content of the loaded file.
   *
   * @method loadUrl
   * @param {String} url - The url used to load content from an url.
   * @private
   */
  loadUrl: function(url) {
    let me = this;
    //console.log("Heron.widgets.HtmlPanel.loadUrl");
    Ext.Ajax.request({
      url: url,
      success: function(response) {
        let s;
        // Replace the content tag with the content of the loaded file.
        s = me.htmlTemplate.replace("{content}",response.responseText);
        // Set the content of the panel.
        me.setHtml(s);
        // Hide load message.
        if (me.loadMask) me.loadMask.hide();
      },
      failure: function(response) {
        console.log("Heron.widgets.HtmlPanel.loadUrl response.status: "+response.status);
        // Hide load message.
        if (me.loadMask) me.loadMask.hide();
        // Remote content not found?
        if (response.status===404) {
          // Show warning.
          Heron.Utils.msgConfigWarning(me,
            __("Could not load the specified url: ")+url);
        } else {
          // Show warning.
          Heron.Utils.msgConfigWarning(me,
            __("Unknown error when loading the specified url: ")+url);
        }
      }
    });
  }
});
