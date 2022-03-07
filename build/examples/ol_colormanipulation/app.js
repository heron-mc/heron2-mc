/* global Ext, Heron, app */

app = {};
app.raster = null;
app.ids = ["Hue","Chroma","Lightness"];
app.labels = [];
app.sliders = [];

/**-----------------------------------------------------------------------------
 * @method adjustColor
 * @param {Object} pixels
 * @param {Object} data
 * @param {Number} data.Hue
 * @param {Number} data.Chroma
 * @param {Number} data.Lightness
 */
app.adjustColor = function(pixels, data) {
  let hue = data.Hue;
  let chroma = data.Chroma;
  let lightness = data.Lightness;
  let hcl = rgb2hcl(pixels[0]);
  let h = hcl[0] + Math.PI * hue / 180;
  if (h < 0) {
    h += twoPi;
  } else if (h > twoPi) {
    h -= twoPi;
  }
  hcl[0] = h;
  hcl[1] *= (chroma / 100);
  hcl[2] *= (lightness / 100);
  return hcl2rgb(hcl);
};

/**-----------------------------------------------------------------------------
 * @method init
 */
app.init = function() {
  let me = this;
  
  this.initSliders();
  
  this.raster.setOperation(this.adjustColor,rasterLib);
  
  this.raster.on("beforeoperations", function(event) {
    let id,value,slider,i,len;
    for (i=0,len=me.ids.length;i<len;i++) {
      slider = me.sliders[i];
      id = slider.labelId;
      value = slider.getValue();
      event.data[id] = Number(value);
    }
  });
};

/**-----------------------------------------------------------------------------
 * @method initSliders
 */
app.initSliders = function() {
  let id;
  let slider,label;
  let value;
  let i,len;
  for (i=0,len=this.ids.length;i<len;i++) {
    id = this.ids[i];
    slider = Ext.getCmp("slider"+id);
    slider.labelIndex = i;
    slider.labelId = id;
    if (id === "Hue") {
      slider.labelUnit = "°";
    } else {
      slider.labelUnit = " %";
    }
    this.sliders.push(slider);
    label = Ext.getCmp("label"+id);
    this.labels.push(label);
    // Update labels.
    value = slider.getValue();
    this.updateLabel(slider.labelIndex,slider.labelId,value,slider.labelUnit);
  }
};

/**-----------------------------------------------------------------------------
 * @method updateLabel
 * @param {Number} index
 * @param {Number} id
 * @param {Number} value
 * @param {String} unit
 */
app.updateLabel = function(index,id,value,unit) {
  this.labels[index].setHtml(id + ": "+value+unit);
};
