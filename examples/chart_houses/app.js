
/* global ol,Ext,Heron */

let app = {
  map: null
};

/**-----------------------------------------------------------------------------
 * Casts to feature data.
 *
 * @method asFeaureData
 * @param {Object} data
 * @param {Number} data.aantal_woningen_bouwjaar_voor_1945
 * @param {Number} data.aantal_woningen_bouwjaar_45_tot_65
 * @param {Number} data.aantal_woningen_bouwjaar_65_tot_75
 * @param {Number} data.aantal_woningen_bouwjaar_75_tot_85
 * @param {Number} data.aantal_woningen_bouwjaar_85_tot_95
 * @param {Number} data.aantal_woningen_bouwjaar_95_tot_05
 * @param {Number} data.aantal_woningen_bouwjaar_05_tot_15
 * @param {Number} data.aantal_woningen_bouwjaar_15_en_later
 */
app.asFeaureData = function(data) {
  return data;
}

/**-----------------------------------------------------------------------------
 * Casts to info source.
 *
 * @method asInfoSource
 * @param {?Object} source
 * @param {Object} source.getGetFeatureInfoUrl
 */
app.asInfoSource = function(source) {
  return source;
}

/**-----------------------------------------------------------------------------
 * Initializes the app.
 * 
 * @method init
 */
app.init = function() {
  
  // Set map.  
  this.map = Heron.App.map;

  // Install event handlers.
  this.map.on("singleclick",this.onMouseClick,this);
}

/**-----------------------------------------------------------------------------
 * Processes the feature info from the Ajax request.
 * 
 * @method onFeatureInfo
 * @param {Object} evt - Event info.
 */
app.onFeatureInfo = function(evt) {
  let chart;
  let json;
  let data;
  let fdata;
  let i,len;

  chart = Ext.getCmp("app_chart");

  // Get response.
  json = JSON.parse(evt.currentTarget.response);

  // Get feature data.
  fdata = this.asFeaureData(json.features[0].properties);

  // Set chart data.
  data = [
    {"name": "1945", "cnt": fdata.aantal_woningen_bouwjaar_voor_1945},
    {"name": "1965", "cnt": fdata.aantal_woningen_bouwjaar_45_tot_65},
    {"name": "1975", "cnt": fdata.aantal_woningen_bouwjaar_65_tot_75},
    {"name": "1985", "cnt": fdata.aantal_woningen_bouwjaar_75_tot_85},
    {"name": "1995", "cnt": fdata.aantal_woningen_bouwjaar_85_tot_95},
    {"name": "2005", "cnt": fdata.aantal_woningen_bouwjaar_95_tot_05},
    {"name": "2015", "cnt": fdata.aantal_woningen_bouwjaar_05_tot_15},
    {"name": "2099", "cnt": fdata.aantal_woningen_bouwjaar_15_en_later}
  ];
  // Replace negative values.
  for (i=0,len=data.length;i<len;i++) {
    if (data[i].cnt < 0) data[i].cnt = 0;
  }
  chart.getStore().loadData(data);
};
/**-----------------------------------------------------------------------------
 * @method onMouseClick
 * @param {Object} evt - Event info.
 */
app.onMouseClick = function(evt) {
  let me = this;
  let resolution;
  let projection;
  let layers;
  let source;
  let infoFormat;
  let infoSource;
  let request;
  let url;
  let i,len;
  console.log("Heron.controls.SimpleFeatureInfo.onMouseClick");

  // Initialize info source.
  infoSource = this.asInfoSource(null);

  // Get resolution.
  resolution = this.map.getView().getResolution();
  // Get projection.
  projection = this.map.getView().getProjection();
  // Get first layer.
  layers = this.map.getLayerGroup().getLayers().getArray();
  for (i=0,len=layers.length;i<len;i++) {
    // Get layer source.
    source = layers[i].getSource();
    // Is WMS layer and visible?
    if ((source instanceof ol.source.ImageWMS) && 
        (layers[i].getVisible()===true)) {
      // Cast to info source.
      infoSource = this.asInfoSource(source)
      break;
    }
  }

  // Valid layer source found?
  if (infoSource) {
    // Set info format.
    infoFormat = "application/json";
    // Get GetFeatureInfo url.
    url = infoSource.getGetFeatureInfoUrl(evt.coordinate,resolution,projection,
                                          {"INFO_FORMAT": infoFormat});
    // Valid url?
    if (!isEmpty(url)) {
      // Get info using Ajax request.
      request = new XMLHttpRequest();
      request.open("GET",url);
      request.addEventListener("load",function(evt) {
        //console.log(evt);
        me.onFeatureInfo(evt);
      });
      request.send(url);
    }
  }
};
