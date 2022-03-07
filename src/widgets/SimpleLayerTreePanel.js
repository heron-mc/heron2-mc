
/* global ol,Ext,Heron */

/**-----------------------------------------------------------------------------
 * A panel with a simple layertree.
 * <br><small><i>xtype: "hr_SimpleLayerTreePanel"</i></small>
 * 
 * @class Heron.widgets.SimpleLayerTreePanel
 * @extends Ext.tree.Panel
 * @constructor constructor
 * @param {Object} config - The configuration.
 */
Ext.define("Heron.widgets.SimpleLayerTreePanel", {
  extend: "Ext.tree.Panel",
  alias: "widget.hr_SimpleLayerTreePanel",
  requires: [
    "Ext.tree.Panel",
    "Heron.base.Panel",
    "Heron.Utils"
  ],
  /**
   * The map. Can be null.
   * Is only present after the whole application layout is rendered i.e.
   * when the onAfterRender event is fired.
   * 
   * @property {ol.Map} map
   */
  map: null,
  /**
   * The layertree store.
   * 
   * @property {GeoExt.data.store.LayersTree} store
   */
  store: null,
  /**---------------------------------------------------------------------------
   * @method constructor
   * @param {Object} config - The configuration.
   */
  constructor: function(config) {
    let me = this;
    let layerGroup;

    console.log("Heron.widgets.SimpleLayerTreePanel.constructor");

    // Check the config and merges the default config with the user config.
    // Use the method from the base panel.
    config = Heron.base.Panel.prototype.checkConfig.call(me,config);
    if (!isSet(config))
      return;

    // Create an empty layergroup, needed because the mappanel and map may
    // not heve been created yet.
    layerGroup = new ol.layer.Group(/** @type {?} */{
      visible: false
    });

    // Create the layer store.
    config.store = Ext.create("GeoExt.data.store.LayersTree", {
      layerGroup: layerGroup
    });
    
    // Unbind layer events.
    config.store.unbindGroupLayerCollectionEvents(layerGroup);

    // Set the store.
    this.store = config.store;

    // Create this component.
    me.callParent([config]);
    
    // Create event handler.
    // Handles the loading of the map layers when the map is created.
    Heron.App.on("afterlayout",this.onAfterLayout,this);
  },
  /**---------------------------------------------------------------------------
   * This event handler sets the map when the layout is rendered (and the map
   * created). Gets the layers from the map and fills the layertree store.
   * 
   * @method onAfterLayout
   * @param {Object} evt - Event info.
   */
  onAfterLayout: function(evt) {
    let me = this;
    let layerGroup;
    let collection;
    
    console.log("Heron.widgets.SimpleLayerTreePanel.onAfterLayout " + evt);

    // Get the application map.
    if (!isSet(me.map))
      me.map = Heron.App.map;
    
    // Check the application map.
    if (!isSet(me.map)) {
      return;
    }

    // Get the map layergroup.
    layerGroup = me.map.getLayerGroup();

    // Set the store layergroup.
    me.store.setLayerGroup(layerGroup);

    // Add the map layers to the store.
    collection = layerGroup.getLayers();
    Ext.each(collection.getArray(), function(layer) {
      //console.log(layer);
      me.store.addLayerNode(layer);
    },me.store,me.store.inverseLayerOrder);

    // Bind the store layer events.
    me.store.bindGroupLayerCollectionEvents(layerGroup);

    // Install the store event handlers.
    me.store.on({
      remove: me.store.handleRemove,
      noderemove: me.store.handleNodeRemove,
      nodeappend: me.store.handleNodeAppend,
      nodeinsert: me.store.handleNodeInsert,
      scope: me.store
    });
  }
});
