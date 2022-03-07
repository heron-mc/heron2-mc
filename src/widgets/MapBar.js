
/* global ol,Ext,Heron */
/* global __ */

/**-----------------------------------------------------------------------------
 * Class for building a toolbar of statusbar.
 * <br><i>singleton</i>
 * 
 * Remarks: - Config settings (Heron.options.map.*) are parsed here to the
 *            various components and controls.
 * @class Heron.widgets.MapBar
 * @constructor constructor
 * @param {Object} config - The configuration.
 */
Ext.define("Heron.widgets.MapBar", {
  singleton: true,
  requires: [
    "Heron.widgets.ToolButton",
    "Heron.controls.MapCoordinateX",
    "Heron.controls.MapCoordinateY",
    "Heron.controls.MapProjection",
    "Heron.controls.ZoomPreviousNext",
    "Heron.Utils"
  ],
  /**
   * The main map panel.
   * 
   * @property {Heron.widgets.MapPanel} mapPanel
   */
  mapPanel: null,
  /**
   * The item definitions..
   * 
   * @property {Array<Object>} itemDefs
   * @private
   */
  itemDefs: null,
  /**
   * The ZoomPreviousNextControl.
   * 
   * @property {Heron.controls.ZoomPreviousNext} zoomPreviousNextControl
   * @private
   */
  zoomPreviousNextControl: null,
  /**---------------------------------------------------------------------------
   * @method constructor
   */
  constructor: function(){
    console.log("Heron.widgets.MapBar.constructor");
  },
  /**---------------------------------------------------------------------------
   * Builds the toolbar or statusbar.
   * Supports also the "-", "->" and " " special tokens.
   *
   * @method build
   * @param {Heron.widgets.MapPanel} mapPanel - The map panel.
   * @param {Object} mapOptions - The map config (i.e. Heron.options.map).<br>
   * - For example:<br>
   *     mapOptions (i.e. Heron.options.map)<br>
   *     mapOptions.settings<br>
   *     mapOptions.MapCoordinates<br>
   * @param {Object} barOptions - The config for the toolbar or statusbar. 
   * - For example:<br>
   *     barOptions (i.e. Heron.options.map.toolbar or Heron.options.map.statusbar)<br>
   *     barOptions.type<br>
   *     barOptions.dockPosition<br>
   *     barOptions.items<br>
   *     barOptions.item.margin<br>
   *     barOptions.toggleGroup<br>
   * @private
   */
  build: function(mapPanel,mapOptions,barOptions) {
    let barItems = [];
    let items;
    let item;
    let predefinedItemDef;
    let createFunction;
    let itemOptions;
    let barItem;
    let addSeparation;
    let separation;
    let margin;
    let padding;
    let width;
    let cls;
    let iconCls;
    let allowDepress;
    let len,i;

    console.log("Heron.widgets.MapBar.build");

    // No mapPanel?
    if (!isSet(mapPanel)) {
      return;
    }
    
    // Check bar options (so no bar item definitions)?
    if (!isSet(barOptions)) {
      return;
    }

    // Check the bar item definitions?
    if (isEmpty(barOptions.items)) {
      return;
    }
    if (!Ext.isArray(barOptions.items)) {
      return;
    }

    // Check map options?
    if (!isSet(mapOptions)) {
      return;
    }

    // Set default values if not defined or marked as default.
    barOptions.dockPosition = checkOption(barOptions.dockPosition,"top");
    barOptions.padding = checkOption(barOptions.padding,null);
    barOptions.plugins = checkOption(barOptions.plugins,null);
    barOptions.responsiveConfig = checkOption(barOptions.responsiveConfig,null);

    // Set local members.
    this.mapPanel = mapPanel;
    
    // Set the bar items.
    items = barOptions.items;

    // Loop the bar items to install.
    for (i=0,len=items.length;i<len;i++) {
      
      // Get item.
      item = items[i];

      // Check type property.
      if (isEmpty(item.type)) {
        Heron.Utils.msgWarning(
          __("Invalid {0} config. Item with no 'type' found. Skipping.").format(barOptions.type));
        continue;
      }
      
      //------------------------------------------------------------------------
      // Check special types.
      //------------------------------------------------------------------------

      // Check for separators (ExtJS convention to use "-").
      if ((item.type === "-") || (item.type === "tbseparator")) {
        barItems.push("-");
        continue;
      }
      // Check for spacers (ExtJS convention to use " ").
      if ((item.type === " ") || (item.type === "tbspacer")) {
        barItems.push(" ");
        continue;
      }
      // Check for alignment modifiers (ExtJS convention to use "->").
      if ((item.type === "->") || (item.type === "tbfill")) {
        barItems.push("->");
        continue;
      }

      //------------------------------------------------------------------------
      // Check for invalid type.
      //------------------------------------------------------------------------

      // Check type property.
      if (!isSet(this.itemDefs[item.type])) {
        Heron.Utils.msgWarning(
          __("Invalid {0} config. Item type '{1}' not found. Skipping.").format(
                                                 barOptions.type,item.type));
        continue;
      }

      //------------------------------------------------------------------------
      // Check types with create function, ignore when not available.
      //------------------------------------------------------------------------

      // Create function in config type?
      if (isSet(item.create)) {
        createFunction = item.create;
      } else {
        // Get predefined definition.
        predefinedItemDef = this.itemDefs[item.type];
        // Found and with create function?
        if (isSet(predefinedItemDef.create)) {
          createFunction = predefinedItemDef.create;
        }
      }

      // Ignore bar item definition with no function to create it.
      if (!isSet(createFunction)) {
        continue;
      }

      //------------------------------------------------------------------------
      // FOR TESTING
      //------------------------------------------------------------------------
      if (item.type === "xcoord") {
        console.log("Heron.widgets.MapBar.build - type="+item.type);
      }

      //------------------------------------------------------------------------
      // Collect build options:
      // - Set default settings.
      // - Add predefined options (from MapBar).
      // - Add user supplied options (overrides previous settings).
      //------------------------------------------------------------------------

      // Set default settings.
      margin = checkOption(barOptions.item.margin,null);
      padding = checkOption(barOptions.item.padding,null);
      width = checkOption(barOptions.item.width,null);
      cls = checkOption(barOptions.item.cls,null);
      iconCls = checkOption(barOptions.item.iconCls,null);
      allowDepress = false;
              
      // Set button/component options which are always needed.
      itemOptions = {
        map: mapPanel.map,
        scope: mapPanel,
        margin: margin,
        padding: padding,
        width: width,
        cls: cls,
        iconCls: iconCls,
        allowDepress: allowDepress
      }

      // Add configured predefined options (from MapBar).
      if (isSet(predefinedItemDef.options)) {
        itemOptions = Ext.apply(itemOptions,predefinedItemDef.options);
      }
      
      // Add user supplied options (overrides previous settings).
      if (isSet(item.options)) {
        itemOptions = Ext.apply({},item.options,itemOptions);
      }

      if (!isSet(itemOptions.options))
        itemOptions.options = {};
      itemOptions.options = Ext.apply({},mapOptions,itemOptions.options);
        
      // Need to create a separation?
      addSeparation = checkOption(itemOptions.addSeparation,false);
      if (addSeparation) {
        // Adjust the left margin.
        separation = barOptions.item.separation;
        itemOptions.margin = Heron.Utils.strElementAdd(itemOptions.margin,3,separation);
      }
      
      // Reset iconCls if no glyph is set.
      if (!isSet(itemOptions.glyph)) {
        itemOptions.iconCls = null;
      }
      
      //------------------------------------------------------------------------
      // Build the bar item.
      //------------------------------------------------------------------------
 
      // Create the bar item and add it to the list.
      //  The collected itemOptions are parsed through.
      barItem = createFunction(mapPanel,itemOptions);
      if (isSet(barItem)) {
        barItems.push(barItem);
      }
    }

    // No bar items found?
    if (barItems.length === 0) {
      return;
    }
    
    //------------------------------------------------------------------------
    // Create the bar.
    //------------------------------------------------------------------------

    // Set config.
    barOptions.xtype = "toolbar";
    barOptions.dock = barOptions.dockPosition;
    barOptions.items = barItems;

    // Create the tool/statusbar.
    this.mapPanel.addDocked(barOptions);
  },
  /**---------------------------------------------------------------------------
   * Builds the statusbar.
   *
   * @method buildStatusbar
   * @param {Heron.widgets.MapPanel} mapPanel - The map panel.
   * @param {Object} options - The config for the statusbar.<br>
   * - For example:<br>
   *     options (i.e. Heron.options.map)<br>
   *     options.statusbar<br>
   *     options.MapCoordinateX<br>
   *     options.MapCoordinateY<br>
   */
  buildStatusbar: function(mapPanel,options) {
    // Default item definitions not yet initialized?
    if (!isSet(this.itemDefs)) {
      // Initialize default item definitions.
      if (!this.initItemDefinitions(options))
        return;
    }
    try {
      // Set the bar type.
      options.statusbar.type = "statusbar";
      // Check the dockposition.
      options.statusbar.dockPosition = checkOption(options.statusbar.dockPosition,"bottom");
      // Build statusbar (if specified).
      this.build(mapPanel,options,options.statusbar);
    } catch(err) {
      Heron.Utils.msgError(__("Error while building the statusbar - ")+err);
    } 
  },
  /**---------------------------------------------------------------------------
   * Builds the toolbar.
   *
   * @method buildToolbar
   * @param {Heron.widgets.MapPanel} mapPanel - The map panel.
   * @param {Object} options - The config for the toolbar.<br>
   * - For example:<br>
   *     options (i.e. Heron.options.map)<br>
   *     options.toolbar<br>
   *     options.Pan<br>
   *     options.ZoomIn<br>
   */
  buildToolbar: function(mapPanel,options) {
    // Default item definitions not yet initialized?
    if (!isSet(this.itemDefs)) {
      // Initialize default item definitions.
      if (!this.initItemDefinitions(options))
        return;
    }
    try {
      // Set the bar type.
      options.toolbar.type = "toolbar";
      // Check the dockposition.
      options.toolbar.dockPosition = checkOption(options.toolbar.dockPosition,"top");
      // Build toolbar (if specified).
      this.build(mapPanel,options,options.toolbar);
    } catch(err) {
      Heron.Utils.msgError(__("Error while building the toolbar - ")+err);
    } 
  },
  /**---------------------------------------------------------------------------
   * Creates a toolbar button.
   *
   * @method buildToolbar
   * @param {Heron.widgets.MapPanel} mapPanel - The map panel.
   * @param {Object} options - The config for the toolbar. 
   * @return {Heron.widgets.ToolButton}
   * @private
   */
  createToolbarButton: function(mapPanel,options){
    options.map = mapPanel.map;
    return new Heron.widgets.ToolButton(options);
  },
  /**---------------------------------------------------------------------------
   * Initializes the predefined bar item definitions.
   * Returns True on success else False.
   *
   * @method initItemDefinitions
   * @param {Object} options - The config for the items. 
   * - For example:<br>
   *     options (i.e. Heron.options.map)<br>
   *     options.Pan<br>
   *     options.ZoomIn<br>
   *     options.statusbar<br>
   *     options.MapCoordinateX<br>
   *     options.MapCoordinateY<br>
   * @return {Boolean}
   * @private
   */
  initItemDefinitions: function(options){
    let me = this;
    try {
      me.itemDefs = {
        pan: {
          options: {
            xtype: "hr_ToolButton",
            id: "pan",
            iconCls: options.toolbar.item.iconCls,
            tooltip: __("Pan"),
            glyph: Heron.icons.pan,
            pressed: true,
            toggleGroup: options.toolbar.toggleGroup,
            control: new ol.interaction.DragPan(/** @type {?} */ {
              kinetic: new ol.Kinetic(-0.01,0.1,200)
            })
          },
          create: function(mapPanel,options) {
            // Add interaction to map.
            mapPanel.map.addInteraction(options.control);
            // Create button.
            return Ext.create(options);
          }
        },
        zoomin: {
          options: {
            xtype: "hr_ToolButton",
            id: "zoomin",
            tooltip: __("Zoom in"),
            glyph: Heron.icons.zoomIn,
            toggleGroup: options.toolbar.toggleGroup,
            control: new ol.interaction.DragZoom(/** @type {?} */ {
              condition: ol.events.condition.always
            })
          },
          create: function(mapPanel,options) {
            // Add interaction to map.
            mapPanel.map.addInteraction(options.control);
            // Create button.
            return Ext.create(options);
          }
        },
        zoomout: {
          options: {
            xtype: "hr_ToolButton",
            id: "zoomout",
            tooltip: __("Zoom out"),
            glyph: Heron.icons.zoomOut,
            control: new ol.interaction.DragZoom(/** @type {?} */ {
              condition: ol.events.condition.always,
              out: true
            }),
            toggleGroup: options.toolbar.toggleGroup
          },
          create: function(mapPanel,options) {
            // Add interaction to map.
            mapPanel.map.addInteraction(options.control);
            // Create button.
            return Ext.create(options);
          }
        },
        zoomdefault: {
          options: {
            xtype: "hr_ToolButton",
            id: "zoomdefault",
            tooltip: __("Zoom to default extent"),
            glyph: Heron.icons.zoomDefault,
            handler: function() {
              me.mapPanel.zoomToDefault();
            }
          },
          create: function(mapPanel,options) {
            // Create button.
            return Ext.create(options);
          }
        },
        zoomprevious: {
          // TWO BUTTONS - ONE CONTROL.
          options: {
            xtype: "hr_ToolButton",
            id: "zoomprevious",
            tooltip: __("Zoom previous"),
            glyph: Heron.icons.zoomPrevious,
            handler: function() {
              me.zoomPreviousNextControl.previous();
            }
          },
          create: function(mapPanel, options) {
            let button;
            // Because zoomprevious and zoomnext are sharing the same control.
            if (!isSet(me.zoomPreviousNextControl)) {
              me.zoomPreviousNextControl = Ext.create("Heron.controls.ZoomPreviousNext",options);
            }
            // Set the control.
            options.control = me.zoomPreviousNextControl;
            // Create the button.
            button = Ext.create(options);
            // Set the previous button.
            options.control.setButtonPrevious(button);
            return button;
          }
        },
        zoomnext: {
          // TWO BUTTONS - ONE CONTROL.
          options: {
            xtype: "hr_ToolButton",
            id: "zoomnext",
            tooltip: __("Zoom next"),
            glyph: Heron.icons.zoomNext,
            handler: function() {
              me.zoomPreviousNextControl.next();
            }
          },
          create: function(mapPanel, options) {
            let button;
            // Because zoomprevious and zoomnext are sharing the same control.
            if (!isSet(me.zoomPreviousNextControl)) {
                me.zoomPreviousNextControl = Ext.create("Heron.controls.ZoomPreviousNext",options);
            }
            // Set the control.
            options.control = me.zoomPreviousNextControl;
            // Create the button.
            button = Ext.create(options);
            // Set the next button.
            me.zoomPreviousNextControl.setButtonNext(button);
            return button;
          }
        },
        simplefeatureinfo: {
          options: {
            xtype: "hr_ToolButton",
            id: "simplefeatureinfo",
            tooltip: __("Get information"),
            glyph: Heron.icons.info,
            //glyph: "i",
            toggleGroup: options.toolbar.toggleGroup
          },
          create: function(mapPanel,options) {
            // Create and set the control.
            options.control = Ext.create("Heron.controls.SimpleFeatureInfo", options);
            // Create the button.
            return Ext.create(options);
          }
        },
        any: {
          // Add your own stuff like a Menu config.
          options: {
            tooltip: __("Anything is allowed here"),
            text: __("Any valid Toolbar.add() config goes here")
          },
          create: function(mapPanel, options) {
            return options;
          }
        },
        epsgpanel: {
          options: {
            xtype: "tbtext",
            id: "epsg"
          },
          // Merging defaults and user configs are already handled.
          create: function(mapPanel,options) {
            let control,cmp;
            // Create the control.
            control = Ext.create("Heron.controls.MapProjection",options);
            // Create the ui component.
            cmp = Ext.create(options);
            // Bind the ui component to the control.
            control.bind(cmp);
            return cmp;
          }
        },
        xcoord: {
          options: {
            xtype: "tbtext",
            id: "x-coord"
          },
          create: function(mapPanel, options) {
            let control,cmp;
            console.log("Heron.widgets.MapBar.itemDefs xcoord.create() ");
            // Create the control.
            control = Ext.create("Heron.controls.MapCoordinateX",options);
            // Create the ui component.
            cmp = Ext.create(options);
            // Bind the ui component to the control.
            control.bind(cmp,true);
            return cmp;
          }
        },
        ycoord: {
          options: {
            xtype: "tbtext",
            id: "y-coord"
          },
          create: function(mapPanel, options) {
            let control,cmp;
            // Create the control.
            control = Ext.create("Heron.controls.MapCoordinateY",options);
            // Create the ui component.
            cmp = Ext.create(options);
            // Bind the ui component to the control.
            control.bind(cmp,true);
            return cmp;
          }
        }
      };

      // For backwardscompatibility.
      me.itemDefs.zoomvisible = {
        options: me.itemDefs.zoomdefault.options,
        create: me.itemDefs.zoomdefault.create
      };
      return true;
    } catch(err) {
      Heron.Utils.msgError(
           __("Error while creating toolbar/statusbar item definitions - ")+err);
      return false;
    }
  },
  /**---------------------------------------------------------------------------
   * Adds or replaces a toolbar or statusbar item.
   *
   * @method setItemDef
   * @param {*} type - The item type.
   * @param {function} createFunction - The "create" function.
   * @param {Object} defaultOptions - The default config.
   * @private
   */
  setItemDef: function(type,createFunction,defaultOptions) {
    defaultOptions = defaultOptions ? defaultOptions : {};
    this.defs[type].create = createFunction;
    this.defs[type].options = defaultOptions;
  }
});
