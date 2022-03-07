
/* global Ext, Heron, app */

app = {};
app.raster = null;
app.slider = null;
app.output = null;

/**-----------------------------------------------------------------------------
 * With upper bounds in meters NAP.
 *
 * @method getLevels
 */
app.getLevels = function() {
  return [
    -7,-6,-5,-4,-3,-2.5,-2,-1.5,-1,-0.5,
    0,0.5,1,1.5,2,2.5,3,3.5,4,4.5,5,6,7,8,9,10,
    12,14,16,18,20,25,30,35,40,45,50,60,70,80,90,100,
    125,150,175,200,250,300
  ];
};

/**-----------------------------------------------------------------------------
 * @method getColors
 */
app.getColors = function() {
  return [
    "8 56 123","8 69 132","16 81 132","16 93 132","16 105 140",
    "24 117 140","24 130 140","24 146 148","33 150 148","33 158 140",
    "24 162 132","24 170 123","24 178 107","16 186 99","16 190 82",
    "8 199 66","8 207 49","8 207 49","0 219 0","16 223 0",
    "41 227 0","66 231 0","99 235 0","123 239 0","148 243 0",
    "181 247 0","206 247 0","239 255 0","255 251 0","255 243 0",
    "255 231 0","247 215 0","247 207 8","247 199 8","147 190 8",
    "247 182 16","239 166 16","239 162 16","239 154 16","231 142 24",
    "231 134 33","222 121 33","214 109 41","214 105 41","206 97 49",
    "206 89 49","198 85 57","198 81 57"
  ];
};

/**-----------------------------------------------------------------------------
 * @method getColorIndex
 * @param {Number[]} pixel
 */
app.getColorIndex = function(pixel) {
  let distR,distG,distB;
  let threshold;
  let colors;
  let color;
  let colorObjs = {};
  let colorObj;
  let i,len;
  colorObjs["8 56 123"]={idx:0,r:8,g:56,b:123};
  colorObjs["8 69 132"]={idx:1,r:8,g:69,b:132};
  colorObjs["16 81 132"]={idx:2,r:16,g:81,b:132};
  colorObjs["16 93 132"]={idx:3,r:16,g:93,b:132};
  colorObjs["16 105 140"]={idx:4,r:16,g:105,b:140};
  colorObjs["24 117 140"]={idx:5,r:24,g:117,b:140};
  colorObjs["24 130 140"]={idx:6,r:24,g:130,b:140};
  colorObjs["24 146 148"]={idx:7,r:24,g:146,b:148};
  colorObjs["33 150 148"]={idx:8,r:33,g:150,b:148};
  colorObjs["33 158 140"]={idx:9,r:33,g:158,b:140};
  colorObjs["24 162 132"]={idx:10,r:24,g:162,b:132};
  colorObjs["24 170 123"]={idx:11,r:24,g:170,b:123};
  colorObjs["24 178 107"]={idx:12,r:24,g:178,b:107};
  colorObjs["16 186 99"]={idx:13,r:16,g:186,b:99};
  colorObjs["16 190 82"]={idx:14,r:16,g:190,b:82};
  colorObjs["8 199 66"]={idx:15,r:8,g:199,b:66};
  colorObjs["8 207 49"]={idx:16,r:8,g:207,b:49};
  colorObjs["8 207 49"]={idx:17,r:8,g:207,b:49};
  colorObjs["0 219 0"]={idx:18,r:0,g:219,b:0};
  colorObjs["16 223 0"]={idx:19,r:16,g:223,b:0};
  colorObjs["41 227 0"]={idx:20,r:41,g:227,b:0};
  colorObjs["66 231 0"]={idx:21,r:66,g:231,b:0};
  colorObjs["99 235 0"]={idx:22,r:99,g:235,b:0};
  colorObjs["123 239 0"]={idx:23,r:123,g:239,b:0};
  colorObjs["148 243 0"]={idx:24,r:148,g:243,b:0};
  colorObjs["181 247 0"]={idx:25,r:181,g:247,b:0};
  colorObjs["206 247 0"]={idx:26,r:206,g:247,b:0};
  colorObjs["239 255 0"]={idx:27,r:239,g:255,b:0};
  colorObjs["255 251 0"]={idx:28,r:255,g:251,b:0};
  colorObjs["255 243 0"]={idx:29,r:255,g:243,b:0};
  colorObjs["255 231 0"]={idx:30,r:255,g:231,b:0};
  colorObjs["247 215 0"]={idx:31,r:247,g:215,b:0};
  colorObjs["247 207 8"]={idx:32,r:247,g:207,b:8};
  colorObjs["247 199 8"]={idx:33,r:247,g:199,b:8};
  colorObjs["147 190 8"]={idx:34,r:147,g:190,b:8};
  colorObjs["247 182 16"]={idx:35,r:247,g:182,b:16};
  colorObjs["239 166 16"]={idx:36,r:239,g:166,b:16};
  colorObjs["239 162 16"]={idx:37,r:239,g:162,b:16};
  colorObjs["239 154 16"]={idx:38,r:239,g:154,b:16};
  colorObjs["231 142 24"]={idx:39,r:231,g:142,b:24};
  colorObjs["231 134 33"]={idx:40,r:231,g:134,b:33};
  colorObjs["222 121 33"]={idx:41,r:222,g:121,b:33};
  colorObjs["214 109 41"]={idx:42,r:214,g:109,b:41};
  colorObjs["214 105 41"]={idx:43,r:214,g:105,b:41};
  colorObjs["206 97 49"]={idx:44,r:206,g:97,b:49};
  colorObjs["206 89 49"]={idx:45,r:206,g:89,b:49};
  colorObjs["198 85 57"]={idx:46,r:198,g:85,b:57};
  colorObjs["198 81 57"]={idx:47,r:198,g:81,b:57};
  threshold = 20;
  // Get color by r,g,b.
  color = pixel[0]+" "+pixel[1]+" "+pixel[2];
  colorObj = colorObjs[color];
  // Found?
  if (typeof colorObj !== "undefined") {
    // Return index.
    return colorObj.idx;
  } else {
    // Get colors.
    colors = getColors();
    // Get nearest color.
    for (i=0,len=colors.length;i<len;i++) {
      // Get color r,g,b.
      colorObj = colorObjs[colors[i]];
      // Get color distance.
      distR = Math.abs(colorObj.r - pixel[0]);
      distG = Math.abs(colorObj.g - pixel[1]);
      distB = Math.abs(colorObj.b - pixel[2]);
      // Distance sum less than threshold?
      if ((distR+distG+distB)<=threshold) {
        // Return index.
        return colorObj.idx;
      }
    }
    // Not found.
    return -1;
  }
};

/**-----------------------------------------------------------------------------
 * @method flood
 * @param {Object} pixels
 * @param {Object} data
 */
app.flood = function(pixels, data) {
  let pixel;
  let height;
  pixel = pixels[0];
  if (pixel[3]) {
    height = getColorIndex(pixel);
    if ((height>0) && (height<=data.level)) {
      pixel[0] = 181;
      pixel[1] = 199;
      pixel[2] = 214;
      pixel[3] = 225;
    } else {
      pixel[3] = 0;
    }
  }
  return pixel;
};

// Slider settings.
app.value = 0;
app.valueIncrement = 1;
app.minValue = 0;
app.maxValue = app.getColors().length-1;

/**-----------------------------------------------------------------------------
 * @method init
 */
app.init = function() {
  let me = this;
  let rasterLib;

  this.slider = Ext.getCmp("level");
  this.output = Ext.getCmp("output");

  rasterLib = {};
  rasterLib.getColors = this.getColors;
  rasterLib.getColorIndex = this.getColorIndex;

  this.raster.setOperation(this.flood,rasterLib);
  
  this.raster.on("beforeoperations", function(event) {
    event.data.level = me.slider.getValue();
  });
  
  this.raster.changed();
};
