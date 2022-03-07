/* global Ext,Heron */

/**-----------------------------------------------------------------------------
 * Theme utilities.
 * <br><i>singleton</i>
 * 
 * @class Heron.Theme
 */
Ext.define("Heron.Theme", {
  singleton: true,
  requires: [
    "Heron.Utils"
  ],
  /**
   * False when not yet initialized.
   * 
   * @property {Boolean} isInitialized
   * @private
   */
  isInitialized: false,
  /**
   * The style of the toolbar.
   * 
   * @property {Object} toolbarStyle
   */
  toolbarStyle: null,
  /**
   * The height of the toolbar, aligned to the height of the theme's panel
   * header height.
   * 
   * @property {Number} toolbarHeight
   */
  toolbarHeight: 0,
  /**---------------------------------------------------------------------------
   * Returns the current theme name based on the loaded css file with the
   * filename 'theme-<name>-all.css'.
   * Returns an empty string when the css link is not found.
   * 
   * @method getCurrentThemeName
   * @return {String}
   */
  getCurrentThemeName: function() {
    let linkTags;
    let linkTag;
    let href,css;
    let themeName;
    let i,len;
    themeName="";
    // Get the last css file with the matching filename.
    linkTags = document.getElementsByTagName("link");
    for (i=0,len=linkTags.length;i<len;i++) {
      linkTag = linkTags[i];
      if (isSet(linkTag.href)) {
        href = linkTag.href.replace("\\","/");
        css = href.afterLast("/");
        if (!isEmpty(css)) {
          if (css.startsWith("theme-") && css.endsWith("-all.css")) {
            themeName = css.after("theme-");
            themeName = themeName.before("-all.css");
          }
        }
      }
    }
    return themeName;
  },
  /**---------------------------------------------------------------------------
   * Initializes theme dependent properties.
   * 
   * @method init
   */
  init: function() {
    let themeName;
    
    // Already initialized?
    if (this.isInitialized)
      return;

    // Get the current theme name.
    themeName = this.getCurrentThemeName();
    
    console.log("Heron.Theme.init themeName="+themeName);
    
    // Set theme dependent properties.
    if (themeName === "crisp") {
      this.toolbarHeight = 36;
      this.toolbarStyle = "background: #F5F5F5;";
    }
    else if (themeName === "gray") {
      this.toolbarHeight = 27;
      this.toolbarStyle = "background-color: #D7D2D2;background-image:-webkit-linear-gradient(top,#F0F0F0,#D7D7D7);";
    }
    else if (themeName === "neptune") {
      this.toolbarHeight = 36;
      this.toolbarStyle = "background:#157FCC;";
    }
    else if (themeName === "triton") {
      this.toolbarHeight = 45;
      this.toolbarStyle = "background:#5FA2DD;";
    } else {
      // Set to default values.
      this.toolbarHeight = Heron.options.map.toolbar.height;
      this.toolbarStyle = Heron.options.map.toolbar.style;
    }
    
    this.isInitialized = true;
  },
  /**---------------------------------------------------------------------------
   * Update the toolbar layout and style based on the current loaded theme.
   * This method is called in the Application.launch method.
   * 
   * @method updateToolbarLayoutAndStyle
   */
  updateToolbarLayoutAndStyle: function() {
    // Initialize theme dependent properties for the current loaded theme.
    this.init();
    // Update the default properties.
    Heron.options.map.toolbar.height = this.toolbarHeight;
    Heron.options.map.toolbar.style = this.toolbarStyle;
  }
});

