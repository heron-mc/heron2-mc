
/* global ol,Ext,Heron */
/* global toString, isSet */

/**-----------------------------------------------------------------------------
 * General utilities.
 * <br><i>singleton</i>
 * 
 * @class Heron.Utils
 */
Ext.define("Heron.Utils", {
  singleton: true,
  requires: [
    "Ext.window.Toast"
  ],
  /**---------------------------------------------------------------------------
   * Sets to defaultValue if option is not defined or null.
   * 
   * @method checkOption
   * @param {String/Number/Object} option - The variable to check.
   * @param {String/Number/Object} defaultValue - The value to set when the 
   * variable is not defined or null.
   * - Default: null
   * @return {String/Number/Object}
   */
  checkOption: function(option,defaultValue=null) {
    if (Ext.isDefined(option)) {
      if (option === null) {
        return defaultValue;
      } else {
        return option;
      }
    } else {
      return defaultValue;
    }
  },
  /**---------------------------------------------------------------------------
   * Returns the short class name (i.e. MapPanel) of the component.
   * 
   * @method getClassName
   * @param {Ext.Component} cmp - The component.
   * @return {String}
   */
  getClassName: function(cmp) {
    let fullName;
    fullName = Heron.Utils.getFullClassName(cmp);
    if (fullName.indexOf(".")>=0) {
      return fullName.afterLast(".");
    } else {
      return fullName;    
    }
  },
  /**---------------------------------------------------------------------------
   * Returns the full class name (i.e. Heron.widgets.MapPanel) of the component.
   * Return an empty string when no class name found.
   * 
   * @method getFullClassName
   * @param {Ext.Component} cmp - The component.
   * @return {String}
   */
  getFullClassName: function(cmp) {
    if (Heron.Utils.isSet(cmp.$className)) {
      return cmp.$className;
    } else if (Heron.Utils.isSet(cmp.constructor)) {
      return cmp.constructor.name;    
    } else {
      return "";    
    }
  },
  /**---------------------------------------------------------------------------
   * Returns the alias of the caller.
   * 
   * @method getCallerAlias
   * @param {Object} caller - The caller.
   * @return {String}
   * @private
   */
  getCallerAlias: function(caller) {
    let alias = "";
    // Is the caller specified as String?
    if (Ext.isString(caller)) {
      if (isEmpty(caller)) {
        // Set empty string.
        alias = "";
      } else {
        // Set alias include.
        alias = " ("+caller+")";
      }
    } else if (Heron.Utils.isSet(caller)) {
      // Does the calles has an alias?
      if (Heron.Utils.isSet(caller.alias)) {
        // Get alias from array or string.
        if (Ext.isArray(caller.alias))
          alias = caller.alias[0];
        else
          alias = caller.alias;
        // Get last name of "xxx.yyy" full alias.
        alias = alias.split(".");
        alias = alias[alias.length-1];
        // Set alias include.
        alias = " ("+alias+")";
      } else if (Heron.Utils.isSet(caller.toString)) {
        // Set alias include.
        alias = " ("+caller.toString()+")";
      }
    }
    return  alias;
  },
  /**---------------------------------------------------------------------------
   * Returns the value of a url parameter.
   * 
   * @method getUrlParameter
   * @param {String} url - The url.
   * @param {String} name - The name of the parameter.
   * @return {String}
   * @private
   */
  getUrlParameter: function(url,name) {
    try {
      let urlParser;
      urlParser = new URL(url);
      return urlParser.searchParams.get(name);
    } catch(err) {
      console.error("Heron.Utils.getUrlParameter - "+err);
    }
  },
  /**---------------------------------------------------------------------------
   * Returns True when no value is assigned to a variable or when the 
   * variable is an empty String or Array, else False.
   * 
   * @method isEmpty
   * @param {Object} v - The variable to check.
   * @return {Boolean}
   */
  isEmpty: function(v) {
    if (typeof v === "undefined")
      return true;
    else if (v === null)
      return true;
    else if ((typeof v === "string") && (v.length===0))
      return true;
    else
      return (toString.call(v) === "[object Array]") && (v.length === 0);
  },
  /**---------------------------------------------------------------------------
   * Returns True when a value is assigned to a variable and the variable
   * is not null.
   * 
   * @method isSet
   * @param {Object} v - The variable to check.
   * @return {Boolean}
   */
  isSet: function(v) {
    if (typeof v === "undefined") {
      return false;
    } else {
      return (v !== null);
    }
  },
  /**---------------------------------------------------------------------------
   * Shows an information message box with a message.
   * 
   * @method msgBoxInfo
   * @param {String} msg - The message to show.
   */
  msgBoxInfo: function(msg) {
    Ext.MessageBox.show({
      title: __("Information"),
      msg: msg,
      icon: Ext.MessageBox["INFO"],
      buttons: Ext.MessageBox.OK,
      maskClickAction: "hide"
    });
  },
  /**---------------------------------------------------------------------------
   * Shows an error message box with a message.
   * 
   * @method msgBoxError
   * @param {String} msg - The message to show.
   */
  msgBoxError: function(msg) {
    Ext.MessageBox.show({
      title: __("Error"),
      msg: msg,
      icon: Ext.MessageBox["ERROR"],
      buttons: Ext.MessageBox.OK,
      maskClickAction: "hide"
    });
  },
  /**---------------------------------------------------------------------------
   * Shows an warning message box with a message.
   * 
   * @method msgBoxWarning
   * @param {String} msg - The message to show.
   */
  msgBoxWarning: function(msg) {
    Ext.MessageBox.show({
      title: __("Warning"),
      msg: msg,
      icon: Ext.MessageBox["WARNING"],
      buttons: Ext.MessageBox.OK,
      maskClickAction: "hide"
    });
  },
  /**---------------------------------------------------------------------------
   * Shows a config error message in a sliding popup. Also logs the message
   * to the console.
   * When the Heron.ENABLE_TRACEBACK is set also shows trace back info.
   * 
   * @method msgConfigError
   * @param {Object} caller - The caller (object,component) from which this
   * method is called.
   * @param {String} msg - The message to show.
   */
  msgConfigError: function(caller,msg) {
    let alias;
    // Get alias.
    alias = Heron.Utils.getCallerAlias(caller);
    // Show error.
    this.msgError(__("Configuration error")+alias+" - " + msg);
  },
  /**---------------------------------------------------------------------------
   * Shows a config warning message in a sliding popup. Also logs the message
   * to the console.
   * 
   * @example
   *  Use in panel:
   *    Heron.Utils.msgConfigWarning(this,__("No '{content}' tag found in html config."));
   *  Use in with custom alias:
   *    Heron.Utils.msgConfigWarning({alias: "sss"},__("No '{content}' tag found in html config."));
   *  Use in with custom alias:
   *    Heron.Utils.msgConfigWarning("yyy",__("No '{content}' tag found in html config."));
   *    
   * @method msgConfigWarning
   * @param {Object} caller - The caller (object,component) from which this
   * method is called.
   * @param {String} msg - The message to show.
   */
  msgConfigWarning: function(caller,msg) {
    let alias;
    // Get alias.
    alias = Heron.Utils.getCallerAlias(caller);
    if (Heron.Utils.isEmpty(alias)) {
      // Show warning.
      this.msgWarning(msg);
    } else {
      // Show warning.
      this.msgWarning(__("Configuration warning")+alias+" - " + msg);
    }
  },
  /**---------------------------------------------------------------------------
   * Shows an error message in a sliding popup. Also logs the message
   * to the console.
   * When the Heron.ENABLE_TRACEBACK is set also shows trace back info.
   * 
   * @method msgError
   * @param {String} msg - The message to show.
   */
  msgError: function(msg) {
    let duration;
    // Set default values if not defined or marked as default.
    duration = Heron.Utils.checkOption(Heron.app.errors.duration,4000);
    // Add a console warning.
    if (Heron.ENABLE_TRACEBACK===true) {
      // Add trace back info.
      consoleError(msg+"\n" + Heron.Utils.traceBack());
    } else {
      consoleError(msg);
    }
    // Show a sliding message.
    Ext.toast({
      html: msg,
      cls: "hr-error-popup",
      bodyCls: "hr-error-popup",
      hideDuration: duration,
      align: 'b'
    });
  },
  /**---------------------------------------------------------------------------
   * Shows an info message in a sliding popup.
   * 
   * @method msgInfo
   * @param {String} msg - The message to show.
   */
  msgInfo: function(msg) {
    let duration;
    // Set default values if not defined or marked as default.
    duration = Heron.Utils.checkOption(Heron.app.warnings.duration,4000);
    // Show a sliding message.
    Ext.toast({
      html: msg,
      cls: "hr-info-popup",
      bodyCls: "hr-info-popup",
      hideDuration: duration,
      align: 'b'
    });
  },
  /**---------------------------------------------------------------------------
   * Shows a warning message in a sliding popup. Also logs the message
   * to the console.
   * 
   * @method msgWarning
   * @param {String} msg - The message to show.
   */
  msgWarning: function(msg) {
    let duration;
    // Set default values if not defined or marked as default.
    duration = Heron.Utils.checkOption(Heron.app.warnings.duration,4000);
    // Add a console warning.
    consoleWarn(msg);
    // Show a sliding message.
    Ext.toast({
      html: msg,
      cls: "hr-warning-popup",
      bodyCls: "hr-warning-popup",
      hideDuration: duration,
      align: 'b'
    });
  },
  /**---------------------------------------------------------------------------
   * Parses a layerdef array with ["ol.<namespace>.<name>",config]
   * to create an OpenLayers layer instance.
   * Returns null when no valid layerdef is specified.
   * 
   * @method parseLayerDefArray
   * @param {Array} layerDefArray - The layer definition array.
   * @return {ol.layer.Layer}
   */
  parseLayerDefArray: function(layerDefArray) {
    let className;
    let classConfig;
    let layer;
    let subLayer;
    let property;

    // Check the array length, if length is one add empty config.
    if (layerDefArray.length===1) {
      // Add empty config.
      layerDefArray.push({});
    }

    // Check the array length, should be 2.
    if (layerDefArray.length!==2) {
      // Other than two.
      return null;
    }

    // First element is not a string?
    if (typeof layerDefArray[0]!== "string") {
      return null;
    }

    // Get the class name.
    className = layerDefArray[0];

    // Does not starts with "ol."?
    if (!className.startsWith("ol.")) {
      return null;
    }

    // Get the class config.
    classConfig = layerDefArray[1];

    // Loop all class config properties.
    for (property in classConfig) {
      if (classConfig.hasOwnProperty(property)) {
        // An array?
        if (classConfig[property] instanceof Array) {
          // Could be a layerdef.
          subLayer = Heron.Utils.parseLayerDefArray(classConfig[property]);
          // A valid layerdef, use the created layer.
          if (subLayer) {
            classConfig[property] = subLayer;
          }
        }
      }
    }
    // All properties are parsed, if needed.
    // Now the array can be converted to an ol instance.
    try {
      // Convert the classname and config to a class instance.
      layer = Heron.Utils.stringToClassInstance(className,classConfig);
    } catch (err) {
      console.log("Heron.Utils.parseLayerDefArray - " + err);
    }
    return layer;
  },
  /**---------------------------------------------------------------------------
   * Adds a value to the n-th element of the string.
   * The string should be like '0 1 2 3 4'.
   * Only integer values can be used.
   * Returns str when an invalid index is used or an invalid string is used.
   * The index is 0 based!
   * 
   * @example 
   * strElementAdd('0 1 2 3',3,2);         returns '0 1 2 5'
   *   
   * TODO: strElementAdd("a 1 2 3 4 5",0,2) geeft "NaN 1 2 3 4 5".
   *
   * @method strElementAdd
   * @param {String} str - The string with elements.
   * @param {Number} index - The index of the element to add value.
   * @param {Number} value - The value to add.
   * @return {String}
   */
  strElementAdd: function(str,index,value) {
    let elements;
    elements = str.split(" ");
    // Check length.
    if ((index < 0) || (index > elements.length - 1)) {
      return str;
    }
    try {
      elements[index] = parseInt(elements[index]) + value;
      return elements.join(" ");
    } catch (err) {
      return str;
    }
  },
  /**---------------------------------------------------------------------------
   * Creates a class instance from class name and class config.
   * 
   * @method stringToClassInstance
   * @param {String} className - The class to create (i.e. "<namespace>.<classname>").
   * @param {Object} classConfig - The class configuration.
   * @return {Object}
   */
  stringToClassInstance: function(className,classConfig) {
    let names;
    let aClass;
    let instance;
    names = className.split(".");
    aClass = (window || this);
    for (let i=0,len=names.length;i<len;i++) {
      aClass = aClass[names[i]];
    }
    if (typeof aClass !== "function") {
      throw new Error("Class function not found.");
    }
    instance = new aClass(classConfig);
    return  instance;
  },
  /**---------------------------------------------------------------------------
   * Creates trace back information.
   * 
   * @method traceBack
   * @return {String}
   */
  traceBack: function() {
    let stack;
    let line,lines;
    let newLines = [];
    let i,len;
    stack = new Error().stack;
    if (!Heron.Utils.isSet(stack))
      return "";
    lines = stack.split("\n");
    // Skip first 3 messages (are traceBack and Utils).
    for (i=3,len=lines.length;i<len;i++) {
      line = lines[i].trim();
      line = line.split(" ");
      if (line.length>=3) {
        line = line[2];
        if (line.indexOf("/ext-all")>=0)
          continue;
        line = line.replace("(","");
        line = line.replace(")","");
        newLines.push("  " +line);
      }
    }
    return "Traceback:\n"+newLines.join("\n");
  }  
});

//------------------------------------------------------------------------------
// Define Heron shortcuts.
//------------------------------------------------------------------------------

/**-----------------------------------------------------------------------------
 * Heron shortcuts.
 * 
 * @module Heron
 * @submodule shortcuts
 */

/**-----------------------------------------------------------------------------
 * Shortcut for Heron.Utils.{{#crossLink "Heron.Utils/checkOption:method"}}{{/crossLink}}
 * @method checkOption
 * @for shortcuts
 */
let checkOption = Heron.Utils.checkOption;
/**-----------------------------------------------------------------------------
 * Shortcut for Heron.Utils.{{#crossLink "Heron.Utils/isSet:method"}}{{/crossLink}}
 * @method isSet
 * @for shortcuts
 */
let isSet = Heron.Utils.isSet;
/**-----------------------------------------------------------------------------
 * Shortcut for Heron.Utils.{{#crossLink "Heron.Utils/isEmpty:method"}}{{/crossLink}}
 * @method isEmpty
 * @for shortcuts
 */
let isEmpty = Heron.Utils.isEmpty;

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------

/**-----------------------------------------------------------------------------
 * Number prototypes.
 *
 * @module Heron
 * @submodule Number
 */

/**-----------------------------------------------------------------------------
 * Formats a number with a decimal and a thousand separator.
 * 
 * @method format
 * @for Number
 * @param {Number} decimals - Number of decimals.
 * - Default: 0
 * @return {String}
 */
Number.prototype.format = function(decimals=0) {
  let s;
  if (decimals<=3) {
    // Just format.
    return this.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } else {
    // Convert to string and split on decimal sign.
    s = this.toFixed(decimals).split(".");
    // Add thousand separators to first part and concat.
    return s[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "." + s[1];
  }
};

/**-----------------------------------------------------------------------------
 * Formats a number with a decimal and a thousand separator using ',' as 
 * decimal separator and '.' as thousand separator.
 * 
 * @method formatNL
 * @for Number
 * @param {Number} decimals - Number of decimals.
 * - Default: 0
 * @return {String}
 */
Number.prototype.formatNL = function(decimals=0) {
  let s;
  if (decimals<=3) {
    // Just format.
    return this.toFixed(decimals).replace(".",",").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  } else {
    // Convert to string and split on decimal sign.
    s = this.toFixed(decimals).split(".");
    // Add thousand separators to first part and concat.
    return s[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "," + s[1];
  }
};

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------

/**-----------------------------------------------------------------------------
 * String prototypes.
 *
 * @module Heron
 * @submodule String
 */

/**-----------------------------------------------------------------------------
 * Returns the part after 'str'.
 * Returns an empty string if 'str' is not found.
 * 
 * @method after
 * @for String
 * @param {String} str - The string to search for.
 * @return {String}
 */
String.prototype.after = function(str) {
  let index = this.indexOf(str);
  if (index === -1) return "";
  return this.substr(index+str.length);
};

/**-----------------------------------------------------------------------------
 * Returns the part after the last 'str'.
 * Returns an empty string if 'str' is not found.
 * 
 * @method afterLast
 * @for String
 * @param {String} str - The string to search for.
 * @return {String}
 */
String.prototype.afterLast = function(str) {
  let index = this.lastIndexOf(str);
  if (index === -1) return "";
  return this.substr(index+str.length);
};

/**-----------------------------------------------------------------------------
 * Returns the part before 'str'.
 * Returns an empty string if 'str' is not found.
 * 
 * @method before
 * @for String
 * @param {String} str - The string to search for.
 * @return {String}
 */
String.prototype.before = function(str) {
  let index = this.indexOf(str);
  if (index === -1) return "";
  return this.substr(0,index);
};

/**-----------------------------------------------------------------------------
 * Formats a list of arguments to a string.
 * 
 * @example
 *   "{1} and {0}".format("a","b") gives "b and a".
 *   
 * @method format
 * @for String
 * @param {String|Number} args - The arguments.
 * @return {String}
 */
String.prototype.format = function(...args) {
  return this.replace(/{(\d+)}/g, function(match,number) {
    return typeof args[number] !== "undefined" ? args[number] : match;
  });
};

/**-----------------------------------------------------------------------------
 * Adds a padding character on the left side to create a string of maximum
 * length.
 * 
 * @example
 *   "34".padLeft(10,"-")     returns -------34.
 * 
 * @method padLeft
 * @for String
 * @param {Number} len - The maximum length of the returned string.
 * @param {String} c - The character for padding.
 * @return {String}
 */
String.prototype.padLeft = function(len,c=" ") {
  let tmp = Array(len).join(c);
  return (tmp + this).slice(-tmp.length);
};

/**-----------------------------------------------------------------------------
 * Adds a padding character on the right side to create a string of maximum
 * length.
 * 
 * @example
 *   "34".padRight(10,"-")     returns 34-------.
 * 
 * @method padRight
 * @for String
 * @param {Number} len - The maximum length of the returned string.
 * @param {String} c - The character for padding.
 * @return {String}
 */
String.prototype.padRight = function(len,c=" ") {
  let tmp = Array(len).join(c);
  return (this + tmp).substring(0,tmp.length);
};
