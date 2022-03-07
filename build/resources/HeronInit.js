/**-----------------------------------------------------------------------------
 * 
 * Local methods:
 *   copyConsole()          - internal.
 *   disableConsole()       - internal.
 *   getVersion()           - returns the two digit version.
 *   clone()                - clones an object.
 *   layerSetVisible()      - sets the visibility of a layer after definition.
 * 
 * 
 * Remarks: 
 *          - Caution, do not use __(str) here.
 *----------------------------------------------------------------------------*/

// Global definitions for JsHint to prevent warning.
/* global proj4,ol,Ext,Heron */

window.consoleError = null;
window.consoleLog = null;
window.consoleWarn = null;

/**-----------------------------------------------------------------------------
 * Helper Functions
 */

// Creates a new object with a copy of some original console methods.
let copyConsole = function() {
  if (console) {
    window.consoleError = console["error"];
    window.consoleLog = console["log"];
    window.consoleWarn = console["warn"];
  }
};

// Disable the default console methods.
let disableConsole = function() {
  if (!console) return;
  //console["error"] = function(){};
  console["log"] = function(){};
  console["warn"] = function(){};
  console["debug"] = function(){};
  console["info"] = function(){};
};

// Extract two digit version number from "1.2.3.4".
let getVersion = function(s) {
  let nrs = s.split(".");
  return nrs[0]+"."+nrs[1];
};

// Clones an object.
let clone = function(obj) {
  return Ext.apply({},obj);
};

// Sets the visibility of a layer after definition in the config.
let layerSetVisible = function(layerDef,visible) {
  // Is layer definition an object definition?
  if (Ext.isArray(layerDef)) {
    layerDef[1].visible = true;
  } else {
    layerDef.setVisible(visible);
  }
};

/**-----------------------------------------------------------------------------
 * Heron Main Object
 */

// Define the Heron main object.
Heron = {};

/**-----------------------------------------------------------------------------
 * Debug, Testing And Logging
 */

// Define and set DEBUG/TEST/LOGGING flags.
Heron.DEBUG = true;
//Heron.DEBUG = false;
// Show Test button.
//Heron.TEST = true;
Heron.TEST = false;
Heron.ENABLE_TRACEBACK = true;

// Configurate the debug environment and process DEBUG dependences.
if (Heron.DEBUG) {
  // Copy console.log etc. methods to __console object.
  copyConsole();
  // Remove the _dc=... tags from the source urls.
  Heron.disableCaching = false;
} else {
  // Copy console.log etc. methods to __console object.
  copyConsole();
  // Disable console.log etc. methods.
  disableConsole();
  // Add the _dc=... tags to the source urls.
  Heron.disableCaching = true;
  // Disable testing.
  Heron.TEST = false;
}

/**-----------------------------------------------------------------------------
 * App Reference
 */
Heron.App = null;

/**-----------------------------------------------------------------------------
 * App Settings
 */
Heron.app = {};

Heron.app.fullVersion = "2.0.0.8";
Heron.app.version = getVersion(Heron.app.fullVersion);
Heron.app.title = "Heron " + Heron.app.version;
Heron.app.date = "14 feb 2022";
Heron.app.author = "Eddy Scheper, ARIS B.V., The Netherlands";

Heron.app.paths = {};
Heron.app.paths.src = "../../src";
Heron.app.paths.geoext = "/geoext310/src";

Heron.app.errors = {};
Heron.app.errors.duration = 4000;

Heron.app.warnings = {};
Heron.app.warnings.duration = 4000;

Heron.app.launch = {};
Heron.app.launch.afterStart = null;
Heron.app.launch.beforeEnd = null;

/**-----------------------------------------------------------------------------
 * Language (i18n)
 */
Heron.i18n = {};
Heron.i18n.dict = {};

// Needed here for use in the (user) configuration.
function __(str) {
  let dict = Heron.i18n.dict;
  if (dict && dict[str]) {
    return dict[str];
  } else {
    return str;
  }
}

/**-----------------------------------------------------------------------------
 * EPSG Constants
 */
Heron.epsg = {};
Heron.epsg.RD_New = "EPSG:28992";

/**-----------------------------------------------------------------------------
 * Projections
 */
Heron.projections = {};
if (proj4) {

  //---------------------------------------------------------------------------
  // Add additional Proj4 projections.
  //---------------------------------------------------------------------------

  // Dutch RD_New.
  proj4.defs([Heron.epsg.RD_New],"+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.999908 +x_0=155000 +y_0=463000 +ellps=bessel +units=m +towgs84=565.2369,50.0087,465.658,-0.406857330322398,0.350732676542563,-1.8703473836068,4.0812 +no_defs");  
}

/**-----------------------------------------------------------------------------
 * Icons
 */
Heron.icons = {};
Heron.icons.pan = "xf0a6@FontAwesome";
Heron.icons.zoomDefault = "xf0ac@FontAwesome";
Heron.icons.zoomIn = "xf00e@FontAwesome";
Heron.icons.zoomOut = "xf010@FontAwesome";
Heron.icons.zoomIn = "xf00e@FontAwesome";
Heron.icons.zoomOut = "xf010@FontAwesome";
Heron.icons.zoomPrevious = "xf060@FontAwesome";
Heron.icons.zoomNext = "xf061@FontAwesome";
Heron.icons.info = "xf129@FontAwesome";
Heron.icons.plus = "xf067@FontAwesome";
Heron.icons.minus = "xf068@FontAwesome";
Heron.icons.angle_down = "xf107@FontAwesome";
Heron.icons.angle_left = "xf104@FontAwesome";
Heron.icons.angle_right = "xf105@FontAwesome";
Heron.icons.angle_up = "xf106@FontAwesome";
Heron.icons.bars = "xf0c9@FontAwesome";
Heron.icons.bolt = "xf0e7@FontAwesome";   // schicht
Heron.icons.comment = "xf075@FontAwesome";   // ballon
Heron.icons.compass = "xf14e@FontAwesome";
Heron.icons.crosshairs = "xf05b@FontAwesome";
Heron.icons.download = "xf019@FontAwesome";
Heron.icons.edit = "xf044@FontAwesome";
Heron.icons.ellipsis_h = "xf141@FontAwesome";
Heron.icons.ellipsis_v = "xf142@FontAwesome";
Heron.icons.exclamation = "xf12a@FontAwesome";
Heron.icons.eye = "xf06e@FontAwesome";
Heron.icons.file = "xf15b@FontAwesome";
Heron.icons.globe = "xf0ac@FontAwesome";
Heron.icons.handpointer = "xf25a@FontAwesome";
Heron.icons.home = "xf015@FontAwesome";
Heron.icons.mouse_pointer = "xf245@FontAwesome";
Heron.icons.question = "xf128@FontAwesome";

/**-----------------------------------------------------------------------------
 * OPTIONS
 */
Heron.options = {};

/**-----------------------------------------------------------------------------
 * OPTIONS - map
 *
 * All Heron.options.map settings are passed to the MapPanel and MapBar
 * modules to be used to configure the panel, map, controls, toolbar and
 * statusbar.
 */
Heron.options.map = {};

/**-----------------------------------------------------------------------------
 * OPTIONS - map.settings
 */
Heron.options.map.settings = {};
Heron.options.map.settings.center = null;
Heron.options.map.settings.constrainRotation = null;
Heron.options.map.settings.enableRotation = null;
Heron.options.map.settings.extent = null;
Heron.options.map.settings.maxResolution = null;
Heron.options.map.settings.minResolution = null;
Heron.options.map.settings.maxZoom = null;
Heron.options.map.settings.minZoom = null;
Heron.options.map.settings.projection = null;
Heron.options.map.settings.resolution = null;
Heron.options.map.settings.resolutions = null;
Heron.options.map.settings.rotation = null;
Heron.options.map.settings.zoom = null;
Heron.options.map.settings.zoomFactor = null;
// Additional settings.
Heron.options.map.settings.zoomExtent = null;
// Not used yet.
Heron.options.map.settings.zoomDuration = 250;

/**-----------------------------------------------------------------------------
 * OPTIONS - map.controls
 */
//Heron.options.map.controls = [];
//Heron.options.map.controls = ol.control.defaults();
//Heron.options.map.controls = ol.control.defaults(
//  {
//    attributionOptions: {
//      collapsible: false
//    }
//  }
//);
Heron.options.map.controls = [];

/**-----------------------------------------------------------------------------
 * OPTIONS - map.interactions
 */
//Heron.options.map.interactions = [];            // No mouse interaction at all.
//Heron.options.map.interactions = [new ol.interaction.MouseWheelZoom()];
Heron.options.map.interactions = [
  new ol.interaction.MouseWheelZoom(),
  new ol.interaction.PinchZoom(),
  new ol.interaction.PinchRotate()
];

/**-----------------------------------------------------------------------------
 * OPTIONS - map.keyboardeventtarget
 */
Heron.options.map.keyboardEventTarget = document;

/**-----------------------------------------------------------------------------
 * OPTIONS - map.layers
 */
Heron.options.map.layers = [];

/**-----------------------------------------------------------------------------
 * OPTIONS - map.toolbar
 */
Heron.options.map.toolbar = {};
Heron.options.map.toolbar.item = {};
Heron.options.map.toolbar.item.margin = "0 0 0 1";
Heron.options.map.toolbar.item.padding = null;
Heron.options.map.toolbar.item.width = null;
Heron.options.map.toolbar.item.separation = 8;
Heron.options.map.toolbar.item.cls = "hr-toolbar-item";
Heron.options.map.toolbar.item.iconCls = "hr-toolbar-item-icon";
Heron.options.map.toolbar.dockPosition = "top";
Heron.options.map.toolbar.height = 36;
Heron.options.map.toolbar.style = "background: #F5F5F5;";
Heron.options.map.toolbar.padding = "2 2 2 2";
Heron.options.map.toolbar.toggleGroup = "toolGroup";
Heron.options.map.toolbar.items = [];

/**-----------------------------------------------------------------------------
 * OPTIONS - map.statusbar
 */
Heron.options.map.statusbar = {};
Heron.options.map.statusbar.item = {};
Heron.options.map.statusbar.item.margin = "0 0 0 2";
Heron.options.map.statusbar.item.padding = null;
Heron.options.map.statusbar.item.width = 180;
Heron.options.map.statusbar.item.separation = 8;
Heron.options.map.statusbar.item.cls = "hr-statusbar-item";
Heron.options.map.statusbar.item.iconCls = "hr-statusbar-item-icon";
Heron.options.map.statusbar.item.xy_precision = 0;
Heron.options.map.statusbar.dockPosition = "bottom";
Heron.options.map.statusbar.padding = "5 2 5 2";
Heron.options.map.statusbar.plugins = null;
Heron.options.map.statusbar.responsiveConfig = null;
Heron.options.map.statusbar.items = [];

/**-----------------------------------------------------------------------------
 * OPTIONS - map.panel (common/default settings)
 */
Heron.options.map.panel = {};
Heron.options.map.panel.flex = 1;
Heron.options.map.panel.height = 200;
Heron.options.map.panel.border = false;
Heron.options.map.panel.componentCls = "hr-panel";
Heron.options.map.panel.region = "";
Heron.options.map.panel.layout = "";

/**-----------------------------------------------------------------------------
 * OPTIONS - map.MapPanel
 */
//Heron.options.map.MapPanel = {};
// Standaard geen title.
//Heron.options.map.MapPanel.title = null;
//Heron.options.map.MapPanel.region = "center";
//Heron.options.map.MapPanel.layout = "fit";
//Heron.options.map.MapPanel.border = false;
Heron.options.map.MapPanel = clone(Heron.options.map.panel);
// Standaard geen title.
Heron.options.map.MapPanel.title = null;
Heron.options.map.MapPanel.region = "center";
Heron.options.map.MapPanel.layout = "fit";

/**-----------------------------------------------------------------------------
 * OPTIONS - map.HtmlPanel
 */
Heron.options.map.HtmlPanel = clone(Heron.options.map.panel);
Heron.options.map.HtmlPanel.title = __("Info");
Heron.options.map.HtmlPanel.cls = "hr-htmlpanel";
Heron.options.map.HtmlPanel.bodyPadding = 5;
Heron.options.map.HtmlPanel.scrollable = true;

/**-----------------------------------------------------------------------------
 * OPTIONS - map.SimpleLayerTreePanel
 */
Heron.options.map.SimpleLayerTreePanel = clone(Heron.options.map.panel);
Heron.options.map.SimpleLayerTreePanel.title = __("Layers");
Heron.options.map.SimpleLayerTreePanel.defViewConfig = {plugins: {ptype: "treeviewdragdrop"}};
Heron.options.map.SimpleLayerTreePanel.rootVisible = false;
Heron.options.map.SimpleLayerTreePanel.disableSelection = true;

/**-----------------------------------------------------------------------------
 * OPTIONS - map.SimpleFeatureInfoPanel
 */
Heron.options.map.SimpleFeatureInfoPanel = clone(Heron.options.map.panel);
Heron.options.map.SimpleFeatureInfoPanel.title = __("Feature Info");
Heron.options.map.SimpleFeatureInfoPanel.id = "hr_SimpleFeatureInfoPanel";

/**-----------------------------------------------------------------------------
 * OPTIONS - map.control (common/default settings)
 */
//Heron.options.map.control = {};
//Heron.options.map.control.toggleGroup = "toolGroup";

/**-----------------------------------------------------------------------------
 * OPTIONS - map.Pan Control
 */
//Heron.options.map.Pan = clone(Heron.options.map.control);
//Heron.options.map.Pan.tooltip = __("Pan");
//Heron.options.map.Pan.glyph = Heron.icons.pan;
//Heron.options.map.Pan.pressed = true;

/**-----------------------------------------------------------------------------
 * OPTIONS - map.ZoomPreviousNext Control
 */
//Heron.options.map.ZoomPreviousNext = clone(Heron.options.map.control);

/**-----------------------------------------------------------------------------
 * OPTIONS - map.MapCoordinates Control
 */
//Heron.options.map.MapCoordinates = {};
//Heron.options.map.MapCoordinates = clone(Heron.options.map.statusbar.item)
//Heron.options.map.MapCoordinates.x_text = "X: 0";
//Heron.options.map.MapCoordinates.x_width = 90;
//Heron.options.map.MapCoordinates.y_text = "Y: 0";
//Heron.options.map.MapCoordinates.y_width = 90;
//Heron.options.map.MapCoordinates.xy_precision = 0;
//
//Heron.options.map.MapCoordinates.x_width = 150;
//Heron.options.map.MapCoordinates.y_width = 150;

Heron.options.map.MapCoordinateX = clone(Heron.options.map.statusbar.item);
Heron.options.map.statusbar.item.width = 90;

Heron.options.map.MapCoordinateY = clone(Heron.options.map.statusbar.item);
Heron.options.map.statusbar.item.width = 90;

/**-----------------------------------------------------------------------------
 * OPTIONS - map.MapProjection Control
 */
//Heron.options.map.MapProjection = {};
Heron.options.map.MapProjection = clone(Heron.options.map.statusbar.item)
Heron.options.map.MapProjection.margin = "0 0 0 0";

/**-----------------------------------------------------------------------------
 * OPTIONS - map.SimpleFeatureInfo Control
 */
Heron.options.map.SimpleFeatureInfo = {};
Heron.options.map.SimpleFeatureInfo.infoPanelId = Heron.options.map.SimpleFeatureInfoPanel.id;

/**-----------------------------------------------------------------------------
 * OPTIONS - layout
 */
Heron.options.layout = {};

/**-----------------------------------------------------------------------------
 * OPTIONS - mapContext
 */
Heron.options.mapContext = {};
Heron.options.mapContext.url = null;
Heron.options.mapContext.options = null;

/**-----------------------------------------------------------------------------
 * OPTIONS - locations
 */
Heron.options.locations = {};
// RD_NEW.
Heron.options.locations.Amersfoort = [155000,463000];

/**-----------------------------------------------------------------------------
 * OPTIONS - services
 */
Heron.options.services = {};

/**-----------------------------------------------------------------------------
 * OPTIONS - urls
 */
Heron.options.urls = {};

/**-----------------------------------------------------------------------------
 * OPTIONS - styles
 */
Heron.options.styles = {};

/**-----------------------------------------------------------------------------
 * OPTIONS - layerdefs
 */
Heron.options.layerdefs = {};

/**-----------------------------------------------------------------------------
 * OPTIONS - wmts
 */
Heron.options.wmts = {};

/**-----------------------------------------------------------------------------
 * SET MINIMAL CONFIGURATION
 */
// Layout.
Heron.options.layout = {
  xtype: "hr_MapPanel"
};
// Map.
Heron.options.map.settings = {
  center: [0,0],
  zoom: 2
};
// Layers.
Heron.options.map.layers = [
  // Stamen GroupLayer
  new ol.layer.Tile({
    name: "Stamen Watercolor",
    visible: true,
    source: new ol.source.Stamen({layer: "watercolor"})
  })
];

