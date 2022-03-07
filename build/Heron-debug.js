var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.ASSUME_ES5 = false;
$jscomp.ASSUME_NO_NATIVE_MAP = false;
$jscomp.ASSUME_NO_NATIVE_SET = false;
$jscomp.defineProperty = $jscomp.ASSUME_ES5 || typeof Object.defineProperties == 'function' ? Object.defineProperty : function(target, property, descriptor) {
  descriptor = descriptor;
  if (target == Array.prototype || target == Object.prototype) {
    return;
  }
  target[property] = descriptor.value;
};
$jscomp.getGlobal = function(maybeGlobal) {
  return typeof window != 'undefined' && window === maybeGlobal ? maybeGlobal : typeof global != 'undefined' && global != null ? global : maybeGlobal;
};
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.polyfill = function(target, polyfill, fromLang, toLang) {
  if (!polyfill) {
    return;
  }
  var obj = $jscomp.global;
  var split = target.split('.');
  for (var i = 0; i < split.length - 1; i++) {
    var key = split[i];
    if (!(key in obj)) {
      obj[key] = {};
    }
    obj = obj[key];
  }
  var property = split[split.length - 1];
  var orig = obj[property];
  var impl = polyfill(orig);
  if (impl == orig || impl == null) {
    return;
  }
  $jscomp.defineProperty(obj, property, {configurable:true, writable:true, value:impl});
};
$jscomp.polyfill('Array.prototype.copyWithin', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(target, start, opt_end) {
    var len = this.length;
    target = Number(target);
    start = Number(start);
    opt_end = Number(opt_end != null ? opt_end : len);
    if (target < start) {
      opt_end = Math.min(opt_end, len);
      while (start < opt_end) {
        if (start in this) {
          this[target++] = this[start++];
        } else {
          delete this[target++];
          start++;
        }
      }
    } else {
      opt_end = Math.min(opt_end, len + start - target);
      target += opt_end - start;
      while (opt_end > start) {
        if (--opt_end in this) {
          this[--target] = this[opt_end];
        } else {
          delete this[target];
        }
      }
    }
    return this;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.SYMBOL_PREFIX = 'jscomp_symbol_';
$jscomp.initSymbol = function() {
  $jscomp.initSymbol = function() {
  };
  if (!$jscomp.global['Symbol']) {
    $jscomp.global['Symbol'] = $jscomp.Symbol;
  }
};
$jscomp.Symbol = function() {
  var counter = 0;
  function Symbol(opt_description) {
    return $jscomp.SYMBOL_PREFIX + (opt_description || '') + counter++;
  }
  return Symbol;
}();
$jscomp.initSymbolIterator = function() {
  $jscomp.initSymbol();
  var symbolIterator = $jscomp.global['Symbol'].iterator;
  if (!symbolIterator) {
    symbolIterator = $jscomp.global['Symbol'].iterator = $jscomp.global['Symbol']('iterator');
  }
  if (typeof Array.prototype[symbolIterator] != 'function') {
    $jscomp.defineProperty(Array.prototype, symbolIterator, {configurable:true, writable:true, value:function() {
      return $jscomp.arrayIterator(this);
    }});
  }
  $jscomp.initSymbolIterator = function() {
  };
};
$jscomp.arrayIterator = function(array) {
  var index = 0;
  return $jscomp.iteratorPrototype(function() {
    if (index < array.length) {
      return {done:false, value:array[index++]};
    } else {
      return {done:true};
    }
  });
};
$jscomp.iteratorPrototype = function(next) {
  $jscomp.initSymbolIterator();
  var iterator = {next:next};
  iterator[$jscomp.global['Symbol'].iterator] = function() {
    return this;
  };
  return iterator;
};
$jscomp.iteratorFromArray = function(array, transform) {
  $jscomp.initSymbolIterator();
  if (array instanceof String) {
    array = array + '';
  }
  var i = 0;
  var iter = {next:function() {
    if (i < array.length) {
      var index = i++;
      return {value:transform(index, array[index]), done:false};
    }
    iter.next = function() {
      return {done:true, value:void 0};
    };
    return iter.next();
  }};
  $jscomp.initSymbol();
  $jscomp.initSymbolIterator();
  iter[Symbol.iterator] = function() {
    return iter;
  };
  return iter;
};
$jscomp.polyfill('Array.prototype.entries', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function() {
    return $jscomp.iteratorFromArray(this, function(i, v) {
      return [i, v];
    });
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Array.prototype.fill', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(value, opt_start, opt_end) {
    var length = this.length || 0;
    if (opt_start < 0) {
      opt_start = Math.max(0, length + opt_start);
    }
    if (opt_end == null || opt_end > length) {
      opt_end = length;
    }
    opt_end = Number(opt_end);
    if (opt_end < 0) {
      opt_end = Math.max(0, length + opt_end);
    }
    for (var i = Number(opt_start || 0); i < opt_end; i++) {
      this[i] = value;
    }
    return this;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.findInternal = function(array, callback, thisArg) {
  if (array instanceof String) {
    array = String(array);
  }
  var len = array.length;
  for (var i = 0; i < len; i++) {
    var value = array[i];
    if (callback.call(thisArg, value, i, array)) {
      return {i:i, v:value};
    }
  }
  return {i:-1, v:void 0};
};
$jscomp.polyfill('Array.prototype.find', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(callback, opt_thisArg) {
    return $jscomp.findInternal(this, callback, opt_thisArg).v;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Array.prototype.findIndex', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(callback, opt_thisArg) {
    return $jscomp.findInternal(this, callback, opt_thisArg).i;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Array.from', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(arrayLike, opt_mapFn, opt_thisArg) {
    $jscomp.initSymbolIterator();
    opt_mapFn = opt_mapFn != null ? opt_mapFn : function(x) {
      return x;
    };
    var result = [];
    $jscomp.initSymbol();
    $jscomp.initSymbolIterator();
    var iteratorFunction = arrayLike[Symbol.iterator];
    if (typeof iteratorFunction == 'function') {
      arrayLike = iteratorFunction.call(arrayLike);
      var next;
      while (!(next = arrayLike.next()).done) {
        result.push(opt_mapFn.call(opt_thisArg, next.value));
      }
    } else {
      var len = arrayLike.length;
      for (var i = 0; i < len; i++) {
        result.push(opt_mapFn.call(opt_thisArg, arrayLike[i]));
      }
    }
    return result;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Object.is', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(left, right) {
    if (left === right) {
      return left !== 0 || 1 / left === 1 / right;
    } else {
      return left !== left && right !== right;
    }
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Array.prototype.includes', function(orig) {
  if (orig) {
    return orig;
  }
  var includes = function(searchElement, opt_fromIndex) {
    var array = this;
    if (array instanceof String) {
      array = String(array);
    }
    var len = array.length;
    for (var i = opt_fromIndex || 0; i < len; i++) {
      if (array[i] == searchElement || Object.is(array[i], searchElement)) {
        return true;
      }
    }
    return false;
  };
  return includes;
}, 'es7', 'es3');
$jscomp.polyfill('Array.prototype.keys', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function() {
    return $jscomp.iteratorFromArray(this, function(i) {
      return i;
    });
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Array.of', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(var_args) {
    return Array.from(arguments);
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Array.prototype.values', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function() {
    return $jscomp.iteratorFromArray(this, function(k, v) {
      return v;
    });
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.makeIterator = function(iterable) {
  $jscomp.initSymbolIterator();
  $jscomp.initSymbol();
  $jscomp.initSymbolIterator();
  var iteratorFunction = iterable[Symbol.iterator];
  return iteratorFunction ? iteratorFunction.call(iterable) : $jscomp.arrayIterator(iterable);
};
$jscomp.FORCE_POLYFILL_PROMISE = false;
$jscomp.polyfill('Promise', function(NativePromise) {
  if (NativePromise && !$jscomp.FORCE_POLYFILL_PROMISE) {
    return NativePromise;
  }
  function AsyncExecutor() {
    this.batch_ = null;
  }
  AsyncExecutor.prototype.asyncExecute = function(f) {
    if (this.batch_ == null) {
      this.batch_ = [];
      this.asyncExecuteBatch_();
    }
    this.batch_.push(f);
    return this;
  };
  AsyncExecutor.prototype.asyncExecuteBatch_ = function() {
    var self = this;
    this.asyncExecuteFunction(function() {
      self.executeBatch_();
    });
  };
  var nativeSetTimeout = $jscomp.global['setTimeout'];
  AsyncExecutor.prototype.asyncExecuteFunction = function(f) {
    nativeSetTimeout(f, 0);
  };
  AsyncExecutor.prototype.executeBatch_ = function() {
    while (this.batch_ && this.batch_.length) {
      var executingBatch = this.batch_;
      this.batch_ = [];
      for (var i = 0; i < executingBatch.length; ++i) {
        var f = executingBatch[i];
        delete executingBatch[i];
        try {
          f();
        } catch (error) {
          this.asyncThrow_(error);
        }
      }
    }
    this.batch_ = null;
  };
  AsyncExecutor.prototype.asyncThrow_ = function(exception) {
    this.asyncExecuteFunction(function() {
      throw exception;
    });
  };
  var PromiseState = {PENDING:0, FULFILLED:1, REJECTED:2};
  var PolyfillPromise = function(executor) {
    this.state_ = PromiseState.PENDING;
    this.result_ = undefined;
    this.onSettledCallbacks_ = [];
    var resolveAndReject = this.createResolveAndReject_();
    try {
      executor(resolveAndReject.resolve, resolveAndReject.reject);
    } catch (e) {
      resolveAndReject.reject(e);
    }
  };
  PolyfillPromise.prototype.createResolveAndReject_ = function() {
    var thisPromise = this;
    var alreadyCalled = false;
    function firstCallWins(method) {
      return function(x) {
        if (!alreadyCalled) {
          alreadyCalled = true;
          method.call(thisPromise, x);
        }
      };
    }
    return {resolve:firstCallWins(this.resolveTo_), reject:firstCallWins(this.reject_)};
  };
  PolyfillPromise.prototype.resolveTo_ = function(value) {
    if (value === this) {
      this.reject_(new TypeError('A Promise cannot resolve to itself'));
    } else {
      if (value instanceof PolyfillPromise) {
        this.settleSameAsPromise_(value);
      } else {
        if (isObject(value)) {
          this.resolveToNonPromiseObj_(value);
        } else {
          this.fulfill_(value);
        }
      }
    }
  };
  PolyfillPromise.prototype.resolveToNonPromiseObj_ = function(obj) {
    var thenMethod = undefined;
    try {
      thenMethod = obj.then;
    } catch (error) {
      this.reject_(error);
      return;
    }
    if (typeof thenMethod == 'function') {
      this.settleSameAsThenable_(thenMethod, obj);
    } else {
      this.fulfill_(obj);
    }
  };
  function isObject(value) {
    switch(typeof value) {
      case 'object':
        return value != null;
      case 'function':
        return true;
      default:
        return false;
    }
  }
  PolyfillPromise.prototype.reject_ = function(reason) {
    this.settle_(PromiseState.REJECTED, reason);
  };
  PolyfillPromise.prototype.fulfill_ = function(value) {
    this.settle_(PromiseState.FULFILLED, value);
  };
  PolyfillPromise.prototype.settle_ = function(settledState, valueOrReason) {
    if (this.state_ != PromiseState.PENDING) {
      throw new Error('Cannot settle(' + settledState + ', ' + valueOrReason | '): Promise already settled in state' + this.state_);
    }
    this.state_ = settledState;
    this.result_ = valueOrReason;
    this.executeOnSettledCallbacks_();
  };
  PolyfillPromise.prototype.executeOnSettledCallbacks_ = function() {
    if (this.onSettledCallbacks_ != null) {
      var callbacks = this.onSettledCallbacks_;
      for (var i = 0; i < callbacks.length; ++i) {
        callbacks[i].call();
        callbacks[i] = null;
      }
      this.onSettledCallbacks_ = null;
    }
  };
  var asyncExecutor = new AsyncExecutor;
  PolyfillPromise.prototype.settleSameAsPromise_ = function(promise) {
    var methods = this.createResolveAndReject_();
    promise.callWhenSettled_(methods.resolve, methods.reject);
  };
  PolyfillPromise.prototype.settleSameAsThenable_ = function(thenMethod, thenable) {
    var methods = this.createResolveAndReject_();
    try {
      thenMethod.call(thenable, methods.resolve, methods.reject);
    } catch (error) {
      methods.reject(error);
    }
  };
  PolyfillPromise.prototype.then = function(onFulfilled, onRejected) {
    var resolveChild;
    var rejectChild;
    var childPromise = new PolyfillPromise(function(resolve, reject) {
      resolveChild = resolve;
      rejectChild = reject;
    });
    function createCallback(paramF, defaultF) {
      if (typeof paramF == 'function') {
        return function(x) {
          try {
            resolveChild(paramF(x));
          } catch (error) {
            rejectChild(error);
          }
        };
      } else {
        return defaultF;
      }
    }
    this.callWhenSettled_(createCallback(onFulfilled, resolveChild), createCallback(onRejected, rejectChild));
    return childPromise;
  };
  PolyfillPromise.prototype['catch'] = function(onRejected) {
    return this.then(undefined, onRejected);
  };
  PolyfillPromise.prototype.callWhenSettled_ = function(onFulfilled, onRejected) {
    var thisPromise = this;
    function callback() {
      switch(thisPromise.state_) {
        case PromiseState.FULFILLED:
          onFulfilled(thisPromise.result_);
          break;
        case PromiseState.REJECTED:
          onRejected(thisPromise.result_);
          break;
        default:
          throw new Error('Unexpected state: ' + thisPromise.state_);
      }
    }
    if (this.onSettledCallbacks_ == null) {
      asyncExecutor.asyncExecute(callback);
    } else {
      this.onSettledCallbacks_.push(function() {
        asyncExecutor.asyncExecute(callback);
      });
    }
  };
  function resolvingPromise(opt_value) {
    if (opt_value instanceof PolyfillPromise) {
      return opt_value;
    } else {
      return new PolyfillPromise(function(resolve, reject) {
        resolve(opt_value);
      });
    }
  }
  PolyfillPromise['resolve'] = resolvingPromise;
  PolyfillPromise['reject'] = function(opt_reason) {
    return new PolyfillPromise(function(resolve, reject) {
      reject(opt_reason);
    });
  };
  PolyfillPromise['race'] = function(thenablesOrValues) {
    return new PolyfillPromise(function(resolve, reject) {
      var iterator = $jscomp.makeIterator(thenablesOrValues);
      for (var iterRec = iterator.next(); !iterRec.done; iterRec = iterator.next()) {
        resolvingPromise(iterRec.value).callWhenSettled_(resolve, reject);
      }
    });
  };
  PolyfillPromise['all'] = function(thenablesOrValues) {
    var iterator = $jscomp.makeIterator(thenablesOrValues);
    var iterRec = iterator.next();
    if (iterRec.done) {
      return resolvingPromise([]);
    } else {
      return new PolyfillPromise(function(resolveAll, rejectAll) {
        var resultsArray = [];
        var unresolvedCount = 0;
        function onFulfilled(i) {
          return function(ithResult) {
            resultsArray[i] = ithResult;
            unresolvedCount--;
            if (unresolvedCount == 0) {
              resolveAll(resultsArray);
            }
          };
        }
        do {
          resultsArray.push(undefined);
          unresolvedCount++;
          resolvingPromise(iterRec.value).callWhenSettled_(onFulfilled(resultsArray.length - 1), rejectAll);
          iterRec = iterator.next();
        } while (!iterRec.done);
      });
    }
  };
  return PolyfillPromise;
}, 'es6', 'es3');
$jscomp.executeAsyncGenerator = function(generator) {
  function passValueToGenerator(value) {
    return generator.next(value);
  }
  function passErrorToGenerator(error) {
    return generator['throw'](error);
  }
  return new Promise(function(resolve, reject) {
    function handleGeneratorRecord(genRec) {
      if (genRec.done) {
        resolve(genRec.value);
      } else {
        Promise.resolve(genRec.value).then(passValueToGenerator, passErrorToGenerator).then(handleGeneratorRecord, reject);
      }
    }
    handleGeneratorRecord(generator.next());
  });
};
$jscomp.owns = function(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
};
$jscomp.polyfill('WeakMap', function(NativeWeakMap) {
  function isConformant() {
    if (!NativeWeakMap || !Object.seal) {
      return false;
    }
    try {
      var x = Object.seal({});
      var y = Object.seal({});
      var map = new NativeWeakMap([[x, 2], [y, 3]]);
      if (map.get(x) != 2 || map.get(y) != 3) {
        return false;
      }
      map['delete'](x);
      map.set(y, 4);
      return !map.has(x) && map.get(y) == 4;
    } catch (err) {
      return false;
    }
  }
  if (isConformant()) {
    return NativeWeakMap;
  }
  var prop = '$jscomp_hidden_' + Math.random().toString().substring(2);
  function insert(target) {
    if (!$jscomp.owns(target, prop)) {
      var obj = {};
      $jscomp.defineProperty(target, prop, {value:obj});
    }
  }
  function patch(name) {
    var prev = Object[name];
    if (prev) {
      Object[name] = function(target) {
        insert(target);
        return prev(target);
      };
    }
  }
  patch('freeze');
  patch('preventExtensions');
  patch('seal');
  var index = 0;
  var PolyfillWeakMap = function(opt_iterable) {
    this.id_ = (index += Math.random() + 1).toString();
    if (opt_iterable) {
      $jscomp.initSymbol();
      $jscomp.initSymbolIterator();
      var iter = $jscomp.makeIterator(opt_iterable);
      var entry;
      while (!(entry = iter.next()).done) {
        var item = entry.value;
        this.set(item[0], item[1]);
      }
    }
  };
  PolyfillWeakMap.prototype.set = function(key, value) {
    insert(key);
    if (!$jscomp.owns(key, prop)) {
      throw new Error('WeakMap key fail: ' + key);
    }
    key[prop][this.id_] = value;
    return this;
  };
  PolyfillWeakMap.prototype.get = function(key) {
    return $jscomp.owns(key, prop) ? key[prop][this.id_] : undefined;
  };
  PolyfillWeakMap.prototype.has = function(key) {
    return $jscomp.owns(key, prop) && $jscomp.owns(key[prop], this.id_);
  };
  PolyfillWeakMap.prototype['delete'] = function(key) {
    if (!$jscomp.owns(key, prop) || !$jscomp.owns(key[prop], this.id_)) {
      return false;
    }
    return delete key[prop][this.id_];
  };
  return PolyfillWeakMap;
}, 'es6', 'es3');
$jscomp.MapEntry = function() {
  this.previous;
  this.next;
  this.head;
  this.key;
  this.value;
};
$jscomp.polyfill('Map', function(NativeMap) {
  var isConformant = !$jscomp.ASSUME_NO_NATIVE_MAP && function() {
    if (!NativeMap || !NativeMap.prototype.entries || typeof Object.seal != 'function') {
      return false;
    }
    try {
      NativeMap = NativeMap;
      var key = Object.seal({x:4});
      var map = new NativeMap($jscomp.makeIterator([[key, 's']]));
      if (map.get(key) != 's' || map.size != 1 || map.get({x:4}) || map.set({x:4}, 't') != map || map.size != 2) {
        return false;
      }
      var iter = map.entries();
      var item = iter.next();
      if (item.done || item.value[0] != key || item.value[1] != 's') {
        return false;
      }
      item = iter.next();
      if (item.done || item.value[0].x != 4 || item.value[1] != 't' || !iter.next().done) {
        return false;
      }
      return true;
    } catch (err) {
      return false;
    }
  }();
  if (isConformant) {
    return NativeMap;
  }
  $jscomp.initSymbol();
  $jscomp.initSymbolIterator();
  var idMap = new WeakMap;
  var PolyfillMap = function(opt_iterable) {
    this.data_ = {};
    this.head_ = createHead();
    this.size = 0;
    if (opt_iterable) {
      var iter = $jscomp.makeIterator(opt_iterable);
      var entry;
      while (!(entry = iter.next()).done) {
        var item = entry.value;
        this.set(item[0], item[1]);
      }
    }
  };
  PolyfillMap.prototype.set = function(key, value) {
    var r = maybeGetEntry(this, key);
    if (!r.list) {
      r.list = this.data_[r.id] = [];
    }
    if (!r.entry) {
      r.entry = {next:this.head_, previous:this.head_.previous, head:this.head_, key:key, value:value};
      r.list.push(r.entry);
      this.head_.previous.next = r.entry;
      this.head_.previous = r.entry;
      this.size++;
    } else {
      r.entry.value = value;
    }
    return this;
  };
  PolyfillMap.prototype['delete'] = function(key) {
    var r = maybeGetEntry(this, key);
    if (r.entry && r.list) {
      r.list.splice(r.index, 1);
      if (!r.list.length) {
        delete this.data_[r.id];
      }
      r.entry.previous.next = r.entry.next;
      r.entry.next.previous = r.entry.previous;
      r.entry.head = null;
      this.size--;
      return true;
    }
    return false;
  };
  PolyfillMap.prototype.clear = function() {
    this.data_ = {};
    this.head_ = this.head_.previous = createHead();
    this.size = 0;
  };
  PolyfillMap.prototype.has = function(key) {
    return !!maybeGetEntry(this, key).entry;
  };
  PolyfillMap.prototype.get = function(key) {
    var entry = maybeGetEntry(this, key).entry;
    return entry && entry.value;
  };
  PolyfillMap.prototype.entries = function() {
    return makeIterator(this, function(entry) {
      return [entry.key, entry.value];
    });
  };
  PolyfillMap.prototype.keys = function() {
    return makeIterator(this, function(entry) {
      return entry.key;
    });
  };
  PolyfillMap.prototype.values = function() {
    return makeIterator(this, function(entry) {
      return entry.value;
    });
  };
  PolyfillMap.prototype.forEach = function(callback, opt_thisArg) {
    var iter = this.entries();
    var item;
    while (!(item = iter.next()).done) {
      var entry = item.value;
      callback.call(opt_thisArg, entry[1], entry[0], this);
    }
  };
  $jscomp.initSymbol();
  $jscomp.initSymbolIterator();
  PolyfillMap.prototype[Symbol.iterator] = PolyfillMap.prototype.entries;
  var maybeGetEntry = function(map, key) {
    var id = getId(key);
    var list = map.data_[id];
    if (list && $jscomp.owns(map.data_, id)) {
      for (var index = 0; index < list.length; index++) {
        var entry = list[index];
        if (key !== key && entry.key !== entry.key || key === entry.key) {
          return {id:id, list:list, index:index, entry:entry};
        }
      }
    }
    return {id:id, list:list, index:-1, entry:undefined};
  };
  var makeIterator = function(map, func) {
    var entry = map.head_;
    return $jscomp.iteratorPrototype(function() {
      if (entry) {
        while (entry.head != map.head_) {
          entry = entry.previous;
        }
        while (entry.next != entry.head) {
          entry = entry.next;
          return {done:false, value:func(entry)};
        }
        entry = null;
      }
      return {done:true, value:void 0};
    });
  };
  var createHead = function() {
    var head = {};
    head.previous = head.next = head.head = head;
    return head;
  };
  var mapIndex = 0;
  var getId = function(obj) {
    var type = obj && typeof obj;
    if (type == 'object' || type == 'function') {
      obj = obj;
      if (!idMap.has(obj)) {
        var id = '' + ++mapIndex;
        idMap.set(obj, id);
        return id;
      }
      return idMap.get(obj);
    }
    return 'p_' + obj;
  };
  return PolyfillMap;
}, 'es6', 'es3');
$jscomp.polyfill('Math.acosh', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    x = Number(x);
    return Math.log(x + Math.sqrt(x * x - 1));
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Math.asinh', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    x = Number(x);
    if (x === 0) {
      return x;
    }
    var y = Math.log(Math.abs(x) + Math.sqrt(x * x + 1));
    return x < 0 ? -y : y;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Math.log1p', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    x = Number(x);
    if (x < 0.25 && x > -0.25) {
      var y = x;
      var d = 1;
      var z = x;
      var zPrev = 0;
      var s = 1;
      while (zPrev != z) {
        y *= x;
        s *= -1;
        z = (zPrev = z) + s * y / ++d;
      }
      return z;
    }
    return Math.log(1 + x);
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Math.atanh', function(orig) {
  if (orig) {
    return orig;
  }
  var log1p = Math.log1p;
  var polyfill = function(x) {
    x = Number(x);
    return (log1p(x) - log1p(-x)) / 2;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Math.cbrt', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    if (x === 0) {
      return x;
    }
    x = Number(x);
    var y = Math.pow(Math.abs(x), 1 / 3);
    return x < 0 ? -y : y;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Math.clz32', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    x = Number(x) >>> 0;
    if (x === 0) {
      return 32;
    }
    var result = 0;
    if ((x & 4294901760) === 0) {
      x <<= 16;
      result += 16;
    }
    if ((x & 4278190080) === 0) {
      x <<= 8;
      result += 8;
    }
    if ((x & 4026531840) === 0) {
      x <<= 4;
      result += 4;
    }
    if ((x & 3221225472) === 0) {
      x <<= 2;
      result += 2;
    }
    if ((x & 2147483648) === 0) {
      result++;
    }
    return result;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Math.cosh', function(orig) {
  if (orig) {
    return orig;
  }
  var exp = Math.exp;
  var polyfill = function(x) {
    x = Number(x);
    return (exp(x) + exp(-x)) / 2;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Math.expm1', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    x = Number(x);
    if (x < .25 && x > -.25) {
      var y = x;
      var d = 1;
      var z = x;
      var zPrev = 0;
      while (zPrev != z) {
        y *= x / ++d;
        z = (zPrev = z) + y;
      }
      return z;
    }
    return Math.exp(x) - 1;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Math.hypot', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x, y, var_args) {
    x = Number(x);
    y = Number(y);
    var i, z, sum;
    var max = Math.max(Math.abs(x), Math.abs(y));
    for (i = 2; i < arguments.length; i++) {
      max = Math.max(max, Math.abs(arguments[i]));
    }
    if (max > 1e100 || max < 1e-100) {
      x = x / max;
      y = y / max;
      sum = x * x + y * y;
      for (i = 2; i < arguments.length; i++) {
        z = Number(arguments[i]) / max;
        sum += z * z;
      }
      return Math.sqrt(sum) * max;
    } else {
      sum = x * x + y * y;
      for (i = 2; i < arguments.length; i++) {
        z = Number(arguments[i]);
        sum += z * z;
      }
      return Math.sqrt(sum);
    }
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Math.imul', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(a, b) {
    a = Number(a);
    b = Number(b);
    var ah = a >>> 16 & 65535;
    var al = a & 65535;
    var bh = b >>> 16 & 65535;
    var bl = b & 65535;
    var lh = ah * bl + al * bh << 16 >>> 0;
    return al * bl + lh | 0;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Math.log10', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    return Math.log(x) / Math.LN10;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Math.log2', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    return Math.log(x) / Math.LN2;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Math.sign', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    x = Number(x);
    return x === 0 || isNaN(x) ? x : x > 0 ? 1 : -1;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Math.sinh', function(orig) {
  if (orig) {
    return orig;
  }
  var exp = Math.exp;
  var polyfill = function(x) {
    x = Number(x);
    if (x === 0) {
      return x;
    }
    return (exp(x) - exp(-x)) / 2;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Math.tanh', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    x = Number(x);
    if (x === 0) {
      return x;
    }
    var y = Math.exp(-2 * Math.abs(x));
    var z = (1 - y) / (1 + y);
    return x < 0 ? -z : z;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Math.trunc', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    x = Number(x);
    if (isNaN(x) || x === Infinity || x === -Infinity || x === 0) {
      return x;
    }
    var y = Math.floor(Math.abs(x));
    return x < 0 ? -y : y;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Number.EPSILON', function(orig) {
  return Math.pow(2, -52);
}, 'es6', 'es3');
$jscomp.polyfill('Number.MAX_SAFE_INTEGER', function() {
  return 9007199254740991;
}, 'es6', 'es3');
$jscomp.polyfill('Number.MIN_SAFE_INTEGER', function() {
  return -9007199254740991;
}, 'es6', 'es3');
$jscomp.polyfill('Number.isFinite', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    if (typeof x !== 'number') {
      return false;
    }
    return !isNaN(x) && x !== Infinity && x !== -Infinity;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Number.isInteger', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    if (!Number.isFinite(x)) {
      return false;
    }
    return x === Math.floor(x);
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Number.isNaN', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    return typeof x === 'number' && isNaN(x);
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Number.isSafeInteger', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(x) {
    return Number.isInteger(x) && Math.abs(x) <= Number.MAX_SAFE_INTEGER;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Object.assign', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(target, var_args) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      if (!source) {
        continue;
      }
      for (var key in source) {
        if ($jscomp.owns(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Object.entries', function(orig) {
  if (orig) {
    return orig;
  }
  var entries = function(obj) {
    var result = [];
    for (var key in obj) {
      if ($jscomp.owns(obj, key)) {
        result.push([key, obj[key]]);
      }
    }
    return result;
  };
  return entries;
}, 'es8', 'es3');
$jscomp.polyfill('Object.getOwnPropertySymbols', function(orig) {
  if (orig) {
    return orig;
  }
  return function() {
    return [];
  };
}, 'es6', 'es5');
$jscomp.polyfill('Reflect.ownKeys', function(orig) {
  if (orig) {
    return orig;
  }
  var symbolPrefix = 'jscomp_symbol_';
  function isSymbol(key) {
    return key.substring(0, symbolPrefix.length) == symbolPrefix;
  }
  var polyfill = function(target) {
    var keys = [];
    var names = Object.getOwnPropertyNames(target);
    var symbols = Object.getOwnPropertySymbols(target);
    for (var i = 0; i < names.length; i++) {
      (isSymbol(names[i]) ? symbols : keys).push(names[i]);
    }
    return keys.concat(symbols);
  };
  return polyfill;
}, 'es6', 'es5');
$jscomp.polyfill('Object.getOwnPropertyDescriptors', function(orig) {
  if (orig) {
    return orig;
  }
  var getOwnPropertyDescriptors = function(obj) {
    var result = {};
    var keys = Reflect.ownKeys(obj);
    for (var i = 0; i < keys.length; i++) {
      result[keys[i]] = Object.getOwnPropertyDescriptor(obj, keys[i]);
    }
    return result;
  };
  return getOwnPropertyDescriptors;
}, 'es8', 'es5');
$jscomp.underscoreProtoCanBeSet = function() {
  var x = {a:true};
  var y = {};
  try {
    y.__proto__ = x;
    return y.a;
  } catch (e) {
  }
  return false;
};
$jscomp.setPrototypeOf = typeof Object.setPrototypeOf == 'function' ? Object.setPrototypeOf : $jscomp.underscoreProtoCanBeSet() ? function(target, proto) {
  target.__proto__ = proto;
  if (target.__proto__ !== proto) {
    throw new TypeError(target + ' is not extensible');
  }
  return target;
} : null;
$jscomp.polyfill('Object.setPrototypeOf', function(orig) {
  return orig || $jscomp.setPrototypeOf;
}, 'es6', 'es5');
$jscomp.polyfill('Object.values', function(orig) {
  if (orig) {
    return orig;
  }
  var values = function(obj) {
    var result = [];
    for (var key in obj) {
      if ($jscomp.owns(obj, key)) {
        result.push(obj[key]);
      }
    }
    return result;
  };
  return values;
}, 'es8', 'es3');
$jscomp.polyfill('Reflect.apply', function(orig) {
  if (orig) {
    return orig;
  }
  var apply = Function.prototype.apply;
  var polyfill = function(target, thisArg, argList) {
    return apply.call(target, thisArg, argList);
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.objectCreate = $jscomp.ASSUME_ES5 || typeof Object.create == 'function' ? Object.create : function(prototype) {
  var ctor = function() {
  };
  ctor.prototype = prototype;
  return new ctor;
};
$jscomp.construct = function() {
  function reflectConstructWorks() {
    function Base() {
    }
    function Derived() {
    }
    new Base;
    Reflect.construct(Base, [], Derived);
    return new Base instanceof Base;
  }
  if (typeof Reflect != 'undefined' && Reflect.construct) {
    if (reflectConstructWorks()) {
      return Reflect.construct;
    }
    var brokenConstruct = Reflect.construct;
    var patchedConstruct = function(target, argList, opt_newTarget) {
      var out = brokenConstruct(target, argList);
      if (opt_newTarget) {
        Reflect.setPrototypeOf(out, opt_newTarget.prototype);
      }
      return out;
    };
    return patchedConstruct;
  }
  function construct(target, argList, opt_newTarget) {
    if (opt_newTarget === undefined) {
      opt_newTarget = target;
    }
    var proto = opt_newTarget.prototype || Object.prototype;
    var obj = $jscomp.objectCreate(proto);
    var apply = Function.prototype.apply;
    var out = apply.call(target, obj, argList);
    return out || obj;
  }
  return construct;
}();
$jscomp.polyfill('Reflect.construct', function(orig) {
  return $jscomp.construct;
}, 'es6', 'es3');
$jscomp.polyfill('Reflect.defineProperty', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(target, propertyKey, attributes) {
    try {
      Object.defineProperty(target, propertyKey, attributes);
      var desc = Object.getOwnPropertyDescriptor(target, propertyKey);
      if (!desc) {
        return false;
      }
      return desc.configurable === (attributes.configurable || false) && desc.enumerable === (attributes.enumerable || false) && ('value' in desc ? desc.value === attributes.value && desc.writable === (attributes.writable || false) : desc.get === attributes.get && desc.set === attributes.set);
    } catch (err) {
      return false;
    }
  };
  return polyfill;
}, 'es6', 'es5');
$jscomp.polyfill('Reflect.deleteProperty', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(target, propertyKey) {
    if (!$jscomp.owns(target, propertyKey)) {
      return true;
    }
    try {
      return delete target[propertyKey];
    } catch (err) {
      return false;
    }
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Reflect.getOwnPropertyDescriptor', function(orig) {
  return orig || Object.getOwnPropertyDescriptor;
}, 'es6', 'es5');
$jscomp.polyfill('Reflect.getPrototypeOf', function(orig) {
  return orig || Object.getPrototypeOf;
}, 'es6', 'es5');
$jscomp.findDescriptor = function(target, propertyKey) {
  var obj = target;
  while (obj) {
    var property = Reflect.getOwnPropertyDescriptor(obj, propertyKey);
    if (property) {
      return property;
    }
    obj = Reflect.getPrototypeOf(obj);
  }
  return undefined;
};
$jscomp.polyfill('Reflect.get', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(target, propertyKey, opt_receiver) {
    if (arguments.length <= 2) {
      return target[propertyKey];
    }
    var property = $jscomp.findDescriptor(target, propertyKey);
    if (property) {
      return property.get ? property.get.call(opt_receiver) : property.value;
    }
    return undefined;
  };
  return polyfill;
}, 'es6', 'es5');
$jscomp.polyfill('Reflect.has', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(target, propertyKey) {
    return propertyKey in target;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Reflect.isExtensible', function(orig) {
  if (orig) {
    return orig;
  }
  if ($jscomp.ASSUME_ES5 || typeof Object.isExtensible == 'function') {
    return Object.isExtensible;
  }
  return function() {
    return true;
  };
}, 'es6', 'es3');
$jscomp.polyfill('Reflect.preventExtensions', function(orig) {
  if (orig) {
    return orig;
  }
  if (!($jscomp.ASSUME_ES5 || typeof Object.preventExtensions == 'function')) {
    return function() {
      return false;
    };
  }
  var polyfill = function(target) {
    Object.preventExtensions(target);
    return !Object.isExtensible(target);
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('Reflect.set', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(target, propertyKey, value, opt_receiver) {
    var property = $jscomp.findDescriptor(target, propertyKey);
    if (!property) {
      if (Reflect.isExtensible(target)) {
        target[propertyKey] = value;
        return true;
      }
      return false;
    }
    if (property.set) {
      property.set.call(arguments.length > 3 ? opt_receiver : target, value);
      return true;
    } else {
      if (property.writable && !Object.isFrozen(target)) {
        target[propertyKey] = value;
        return true;
      }
    }
    return false;
  };
  return polyfill;
}, 'es6', 'es5');
$jscomp.polyfill('Reflect.setPrototypeOf', function(orig) {
  if (orig) {
    return orig;
  } else {
    if ($jscomp.setPrototypeOf) {
      var setPrototypeOf = $jscomp.setPrototypeOf;
      var polyfill = function(target, proto) {
        try {
          setPrototypeOf(target, proto);
          return true;
        } catch (e) {
          return false;
        }
      };
      return polyfill;
    } else {
      return null;
    }
  }
}, 'es6', 'es5');
$jscomp.polyfill('Set', function(NativeSet) {
  var isConformant = !$jscomp.ASSUME_NO_NATIVE_SET && function() {
    if (!NativeSet || !NativeSet.prototype.entries || typeof Object.seal != 'function') {
      return false;
    }
    try {
      NativeSet = NativeSet;
      var value = Object.seal({x:4});
      var set = new NativeSet($jscomp.makeIterator([value]));
      if (!set.has(value) || set.size != 1 || set.add(value) != set || set.size != 1 || set.add({x:4}) != set || set.size != 2) {
        return false;
      }
      var iter = set.entries();
      var item = iter.next();
      if (item.done || item.value[0] != value || item.value[1] != value) {
        return false;
      }
      item = iter.next();
      if (item.done || item.value[0] == value || item.value[0].x != 4 || item.value[1] != item.value[0]) {
        return false;
      }
      return iter.next().done;
    } catch (err) {
      return false;
    }
  }();
  if (isConformant) {
    return NativeSet;
  }
  $jscomp.initSymbol();
  $jscomp.initSymbolIterator();
  var PolyfillSet = function(opt_iterable) {
    this.map_ = new Map;
    if (opt_iterable) {
      var iter = $jscomp.makeIterator(opt_iterable);
      var entry;
      while (!(entry = iter.next()).done) {
        var item = entry.value;
        this.add(item);
      }
    }
    this.size = this.map_.size;
  };
  PolyfillSet.prototype.add = function(value) {
    this.map_.set(value, value);
    this.size = this.map_.size;
    return this;
  };
  PolyfillSet.prototype['delete'] = function(value) {
    var result = this.map_['delete'](value);
    this.size = this.map_.size;
    return result;
  };
  PolyfillSet.prototype.clear = function() {
    this.map_.clear();
    this.size = 0;
  };
  PolyfillSet.prototype.has = function(value) {
    return this.map_.has(value);
  };
  PolyfillSet.prototype.entries = function() {
    return this.map_.entries();
  };
  PolyfillSet.prototype.values = function() {
    return this.map_.values();
  };
  PolyfillSet.prototype.keys = PolyfillSet.prototype.values;
  $jscomp.initSymbol();
  $jscomp.initSymbolIterator();
  PolyfillSet.prototype[Symbol.iterator] = PolyfillSet.prototype.values;
  PolyfillSet.prototype.forEach = function(callback, opt_thisArg) {
    var set = this;
    this.map_.forEach(function(value) {
      return callback.call(opt_thisArg, value, value, set);
    });
  };
  return PolyfillSet;
}, 'es6', 'es3');
$jscomp.checkStringArgs = function(thisArg, arg, func) {
  if (thisArg == null) {
    throw new TypeError("The 'this' value for String.prototype." + func + ' must not be null or undefined');
  }
  if (arg instanceof RegExp) {
    throw new TypeError('First argument to String.prototype.' + func + ' must not be a regular expression');
  }
  return thisArg + '';
};
$jscomp.polyfill('String.prototype.codePointAt', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(position) {
    var string = $jscomp.checkStringArgs(this, null, 'codePointAt');
    var size = string.length;
    position = Number(position) || 0;
    if (!(position >= 0 && position < size)) {
      return void 0;
    }
    position = position | 0;
    var first = string.charCodeAt(position);
    if (first < 55296 || first > 56319 || position + 1 === size) {
      return first;
    }
    var second = string.charCodeAt(position + 1);
    if (second < 56320 || second > 57343) {
      return first;
    }
    return (first - 55296) * 1024 + second + 9216;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('String.prototype.endsWith', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(searchString, opt_position) {
    var string = $jscomp.checkStringArgs(this, searchString, 'endsWith');
    searchString = searchString + '';
    if (opt_position === void 0) {
      opt_position = string.length;
    }
    var i = Math.max(0, Math.min(opt_position | 0, string.length));
    var j = searchString.length;
    while (j > 0 && i > 0) {
      if (string[--i] != searchString[--j]) {
        return false;
      }
    }
    return j <= 0;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('String.fromCodePoint', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(var_args) {
    var result = '';
    for (var i = 0; i < arguments.length; i++) {
      var code = Number(arguments[i]);
      if (code < 0 || code > 1114111 || code !== Math.floor(code)) {
        throw new RangeError('invalid_code_point ' + code);
      }
      if (code <= 65535) {
        result += String.fromCharCode(code);
      } else {
        code -= 65536;
        result += String.fromCharCode(code >>> 10 & 1023 | 55296);
        result += String.fromCharCode(code & 1023 | 56320);
      }
    }
    return result;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('String.prototype.includes', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(searchString, opt_position) {
    var string = $jscomp.checkStringArgs(this, searchString, 'includes');
    return string.indexOf(searchString, opt_position || 0) !== -1;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.polyfill('String.prototype.repeat', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(copies) {
    var string = $jscomp.checkStringArgs(this, null, 'repeat');
    if (copies < 0 || copies > 1342177279) {
      throw new RangeError('Invalid count value');
    }
    copies = copies | 0;
    var result = '';
    while (copies) {
      if (copies & 1) {
        result += string;
      }
      if (copies >>>= 1) {
        string += string;
      }
    }
    return result;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.stringPadding = function(padString, padLength) {
  var padding = padString !== undefined ? String(padString) : ' ';
  if (!(padLength > 0) || !padding) {
    return '';
  }
  var repeats = Math.ceil(padLength / padding.length);
  return padding.repeat(repeats).substring(0, padLength);
};
$jscomp.polyfill('String.prototype.padEnd', function(orig) {
  if (orig) {
    return orig;
  }
  var padEnd = function(targetLength, opt_padString) {
    var string = $jscomp.checkStringArgs(this, null, 'padStart');
    var padLength = targetLength - string.length;
    return string + $jscomp.stringPadding(opt_padString, padLength);
  };
  return padEnd;
}, 'es8', 'es3');
$jscomp.polyfill('String.prototype.padStart', function(orig) {
  if (orig) {
    return orig;
  }
  var padStart = function(targetLength, opt_padString) {
    var string = $jscomp.checkStringArgs(this, null, 'padStart');
    var padLength = targetLength - string.length;
    return $jscomp.stringPadding(opt_padString, padLength) + string;
  };
  return padStart;
}, 'es8', 'es3');
$jscomp.polyfill('String.prototype.startsWith', function(orig) {
  if (orig) {
    return orig;
  }
  var polyfill = function(searchString, opt_position) {
    var string = $jscomp.checkStringArgs(this, searchString, 'startsWith');
    searchString = searchString + '';
    var strLen = string.length;
    var searchLen = searchString.length;
    var i = Math.max(0, Math.min(opt_position | 0, string.length));
    var j = 0;
    while (j < searchLen && i < strLen) {
      if (string[i++] != searchString[j++]) {
        return false;
      }
    }
    return j >= searchLen;
  };
  return polyfill;
}, 'es6', 'es3');
$jscomp.arrayFromIterator = function(iterator) {
  var i;
  var arr = [];
  while (!(i = iterator.next()).done) {
    arr.push(i.value);
  }
  return arr;
};
$jscomp.arrayFromIterable = function(iterable) {
  if (iterable instanceof Array) {
    return iterable;
  } else {
    return $jscomp.arrayFromIterator($jscomp.makeIterator(iterable));
  }
};
$jscomp.inherits = function(childCtor, parentCtor) {
  childCtor.prototype = $jscomp.objectCreate(parentCtor.prototype);
  childCtor.prototype.constructor = childCtor;
  if ($jscomp.setPrototypeOf) {
    var setPrototypeOf = $jscomp.setPrototypeOf;
    setPrototypeOf(childCtor, parentCtor);
  } else {
    for (var p in parentCtor) {
      if (p == 'prototype') {
        continue;
      }
      if (Object.defineProperties) {
        var descriptor = Object.getOwnPropertyDescriptor(parentCtor, p);
        if (descriptor) {
          Object.defineProperty(childCtor, p, descriptor);
        }
      } else {
        childCtor[p] = parentCtor[p];
      }
    }
  }
  childCtor.superClass_ = parentCtor.prototype;
};
$jscomp.polyfill('WeakSet', function(NativeWeakSet) {
  function isConformant() {
    if (!NativeWeakSet || !Object.seal) {
      return false;
    }
    try {
      var x = Object.seal({});
      var y = Object.seal({});
      var set = new NativeWeakSet([x]);
      if (!set.has(x) || set.has(y)) {
        return false;
      }
      set['delete'](x);
      set.add(y);
      return !set.has(x) && set.has(y);
    } catch (err) {
      return false;
    }
  }
  if (isConformant()) {
    return NativeWeakSet;
  }
  var PolyfillWeakSet = function(opt_iterable) {
    this.map_ = new WeakMap;
    if (opt_iterable) {
      $jscomp.initSymbol();
      $jscomp.initSymbolIterator();
      var iter = $jscomp.makeIterator(opt_iterable);
      var entry;
      while (!(entry = iter.next()).done) {
        var item = entry.value;
        this.add(item);
      }
    }
  };
  PolyfillWeakSet.prototype.add = function(elem) {
    this.map_.set(elem, true);
    return this;
  };
  PolyfillWeakSet.prototype.has = function(elem) {
    return this.map_.has(elem);
  };
  PolyfillWeakSet.prototype['delete'] = function(elem) {
    return this.map_['delete'](elem);
  };
  return PolyfillWeakSet;
}, 'es6', 'es3');
try {
  if (Array.prototype.values.toString().indexOf('[native code]') == -1) {
    delete Array.prototype.values;
  }
} catch (e) {
}
Ext.define('Heron.Utils', {singleton:true, requires:['Ext.window.Toast'], checkOption:function(option, defaultValue) {
  defaultValue = defaultValue === undefined ? null : defaultValue;
  if (Ext.isDefined(option)) {
    if (option === null) {
      return defaultValue;
    } else {
      return option;
    }
  } else {
    return defaultValue;
  }
}, getClassName:function(cmp) {
  var fullName;
  fullName = Heron.Utils.getFullClassName(cmp);
  if (fullName.indexOf('.') >= 0) {
    return fullName.afterLast('.');
  } else {
    return fullName;
  }
}, getFullClassName:function(cmp) {
  if (Heron.Utils.isSet(cmp.$className)) {
    return cmp.$className;
  } else {
    if (Heron.Utils.isSet(cmp.constructor)) {
      return cmp.constructor.name;
    } else {
      return '';
    }
  }
}, getCallerAlias:function(caller) {
  var alias = '';
  if (Ext.isString(caller)) {
    if (isEmpty(caller)) {
      alias = '';
    } else {
      alias = ' (' + caller + ')';
    }
  } else {
    if (Heron.Utils.isSet(caller)) {
      if (Heron.Utils.isSet(caller.alias)) {
        if (Ext.isArray(caller.alias)) {
          alias = caller.alias[0];
        } else {
          alias = caller.alias;
        }
        alias = alias.split('.');
        alias = alias[alias.length - 1];
        alias = ' (' + alias + ')';
      } else {
        if (Heron.Utils.isSet(caller.toString)) {
          alias = ' (' + caller.toString() + ')';
        }
      }
    }
  }
  return alias;
}, getUrlParameter:function(url, name) {
  try {
    var urlParser;
    urlParser = new URL(url);
    return urlParser.searchParams.get(name);
  } catch (err) {
    console.error('Heron.Utils.getUrlParameter - ' + err);
  }
}, isEmpty:function(v) {
  if (typeof v === 'undefined') {
    return true;
  } else {
    if (v === null) {
      return true;
    } else {
      if (typeof v === 'string' && v.length === 0) {
        return true;
      } else {
        return toString.call(v) === '[object Array]' && v.length === 0;
      }
    }
  }
}, isSet:function(v) {
  if (typeof v === 'undefined') {
    return false;
  } else {
    return v !== null;
  }
}, msgBoxInfo:function(msg) {
  Ext.MessageBox.show({title:__('Information'), msg:msg, icon:Ext.MessageBox['INFO'], buttons:Ext.MessageBox.OK, maskClickAction:'hide'});
}, msgBoxError:function(msg) {
  Ext.MessageBox.show({title:__('Error'), msg:msg, icon:Ext.MessageBox['ERROR'], buttons:Ext.MessageBox.OK, maskClickAction:'hide'});
}, msgBoxWarning:function(msg) {
  Ext.MessageBox.show({title:__('Warning'), msg:msg, icon:Ext.MessageBox['WARNING'], buttons:Ext.MessageBox.OK, maskClickAction:'hide'});
}, msgConfigError:function(caller, msg) {
  var alias;
  alias = Heron.Utils.getCallerAlias(caller);
  this.msgError(__('Configuration error') + alias + ' - ' + msg);
}, msgConfigWarning:function(caller, msg) {
  var alias;
  alias = Heron.Utils.getCallerAlias(caller);
  if (Heron.Utils.isEmpty(alias)) {
    this.msgWarning(msg);
  } else {
    this.msgWarning(__('Configuration warning') + alias + ' - ' + msg);
  }
}, msgError:function(msg) {
  var duration;
  duration = Heron.Utils.checkOption(Heron.app.errors.duration, 4000);
  if (Heron.ENABLE_TRACEBACK === true) {
    consoleError(msg + '\n' + Heron.Utils.traceBack());
  } else {
    consoleError(msg);
  }
  Ext.toast({html:msg, cls:'hr-error-popup', bodyCls:'hr-error-popup', hideDuration:duration, align:'b'});
}, msgInfo:function(msg) {
  var duration;
  duration = Heron.Utils.checkOption(Heron.app.warnings.duration, 4000);
  Ext.toast({html:msg, cls:'hr-info-popup', bodyCls:'hr-info-popup', hideDuration:duration, align:'b'});
}, msgWarning:function(msg) {
  var duration;
  duration = Heron.Utils.checkOption(Heron.app.warnings.duration, 4000);
  consoleWarn(msg);
  Ext.toast({html:msg, cls:'hr-warning-popup', bodyCls:'hr-warning-popup', hideDuration:duration, align:'b'});
}, parseLayerDefArray:function(layerDefArray) {
  var className;
  var classConfig;
  var layer;
  var subLayer;
  var property;
  if (layerDefArray.length === 1) {
    layerDefArray.push({});
  }
  if (layerDefArray.length !== 2) {
    return null;
  }
  if (typeof layerDefArray[0] !== 'string') {
    return null;
  }
  className = layerDefArray[0];
  if (!className.startsWith('ol.')) {
    return null;
  }
  classConfig = layerDefArray[1];
  for (property in classConfig) {
    if (classConfig.hasOwnProperty(property)) {
      if (classConfig[property] instanceof Array) {
        subLayer = Heron.Utils.parseLayerDefArray(classConfig[property]);
        if (subLayer) {
          classConfig[property] = subLayer;
        }
      }
    }
  }
  try {
    layer = Heron.Utils.stringToClassInstance(className, classConfig);
  } catch (err) {
    console.log('Heron.Utils.parseLayerDefArray - ' + err);
  }
  return layer;
}, strElementAdd:function(str, index, value) {
  var elements;
  elements = str.split(' ');
  if (index < 0 || index > elements.length - 1) {
    return str;
  }
  try {
    elements[index] = parseInt(elements[index]) + value;
    return elements.join(' ');
  } catch (err) {
    return str;
  }
}, stringToClassInstance:function(className, classConfig) {
  var names;
  var aClass;
  var instance;
  names = className.split('.');
  aClass = window || this;
  for (var i = 0, len = names.length; i < len; i++) {
    aClass = aClass[names[i]];
  }
  if (typeof aClass !== 'function') {
    throw new Error('Class function not found.');
  }
  instance = new aClass(classConfig);
  return instance;
}, traceBack:function() {
  var stack;
  var line, lines;
  var newLines = [];
  var i, len;
  stack = (new Error).stack;
  if (!Heron.Utils.isSet(stack)) {
    return '';
  }
  lines = stack.split('\n');
  for (i = 3, len = lines.length; i < len; i++) {
    line = lines[i].trim();
    line = line.split(' ');
    if (line.length >= 3) {
      line = line[2];
      if (line.indexOf('/ext-all') >= 0) {
        continue;
      }
      line = line.replace('(', '');
      line = line.replace(')', '');
      newLines.push('  ' + line);
    }
  }
  return 'Traceback:\n' + newLines.join('\n');
}});
var checkOption = Heron.Utils.checkOption;
var isSet = Heron.Utils.isSet;
var isEmpty = Heron.Utils.isEmpty;
Number.prototype.format = function(decimals) {
  decimals = decimals === undefined ? 0 : decimals;
  var s;
  if (decimals <= 3) {
    return this.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  } else {
    s = this.toFixed(decimals).split('.');
    return s[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.' + s[1];
  }
};
Number.prototype.formatNL = function(decimals) {
  decimals = decimals === undefined ? 0 : decimals;
  var s;
  if (decimals <= 3) {
    return this.toFixed(decimals).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  } else {
    s = this.toFixed(decimals).split('.');
    return s[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ',' + s[1];
  }
};
String.prototype.after = function(str) {
  var index = this.indexOf(str);
  if (index === -1) {
    return '';
  }
  return this.substr(index + str.length);
};
String.prototype.afterLast = function(str) {
  var index = this.lastIndexOf(str);
  if (index === -1) {
    return '';
  }
  return this.substr(index + str.length);
};
String.prototype.before = function(str) {
  var index = this.indexOf(str);
  if (index === -1) {
    return '';
  }
  return this.substr(0, index);
};
String.prototype.format = function(args) {
  var $jscomp$restParams = [];
  for (var $jscomp$restIndex = 0; $jscomp$restIndex < arguments.length; ++$jscomp$restIndex) {
    $jscomp$restParams[$jscomp$restIndex - 0] = arguments[$jscomp$restIndex];
  }
  {
    var args$0 = $jscomp$restParams;
    return this.replace(/{(\d+)}/g, function(match, number) {
      return typeof args$0[number] !== 'undefined' ? args$0[number] : match;
    });
  }
};
String.prototype.padLeft = function(len, c) {
  c = c === undefined ? ' ' : c;
  var tmp = Array(len).join(c);
  return (tmp + this).slice(-tmp.length);
};
String.prototype.padRight = function(len, c) {
  c = c === undefined ? ' ' : c;
  var tmp = Array(len).join(c);
  return (this + tmp).substring(0, tmp.length);
};
Ext.define('Heron.base.Panel', {extend:'Ext.panel.Panel', requires:['Ext.panel.Panel', 'Heron.Utils'], className:'', map:null, constructor:function(config) {
  console.log('Heron.base.Panel.constructor');
  if (isEmpty(this.className)) {
    this.className = Heron.Utils.getClassName(this);
  }
  this.callParent([config]);
  Heron.App.on('afterlayout', this.onAfterLayout, this);
  this.on('afterrender', this.onAfterRender, this);
}, checkConfig:function(config) {
  var defaultConfig;
  var panelConfig;
  console.log('Heron.base.Panel.checkConfig');
  if (!isSet(config)) {
    config = {};
  }
  defaultConfig = Heron.options.map;
  if (!isSet(defaultConfig)) {
    Heron.Utils.msgConfigError(this, __("No 'Heron.options.map' found in the config."));
    return null;
  }
  if (isEmpty(this.className)) {
    this.className = Heron.Utils.getClassName(this);
  }
  if (!isSet(defaultConfig[this.className])) {
    Heron.Utils.msgConfigError(this, __("No 'Heron.options.map.{0}' found in the config.").format(this.className));
    return null;
  }
  panelConfig = Ext.apply({}, config, defaultConfig[this.className]);
  if (isSet(config.options)) {
    panelConfig.options = Ext.apply({}, config.options, defaultConfig);
  } else {
    panelConfig.options = Ext.apply({}, defaultConfig);
  }
  return panelConfig;
}, onAfterLayout:function(evt) {
  console.log('Heron.base.Panel.onAfterLayout - ' + evt);
  this.map = Heron.App.map;
}, onAfterRender:function(evt) {
}});
Ext.define('Heron.widgets.HtmlPanel', {extend:'Heron.base.Panel', alias:'widget.hr_HtmlPanel', requires:['Ext.LoadMask', 'Heron.base.Panel', 'Heron.Utils'], html:'', htmlTemplate:'', loadMask:null, url:'', constructor:function(config) {
  console.log('Heron.widgets.HtmlPanel.constructor');
  config = this.checkConfig(config);
  if (!isSet(config)) {
    return;
  }
  config.html = checkOption(config.html, this.html);
  config.url = checkOption(config.url, this.url);
  this.url = config.url;
  if (!isEmpty(config.url)) {
    if (!isEmpty(config.html)) {
      if (!config.html.includes('{content}')) {
        Heron.Utils.msgConfigWarning(this, __("No '{content}' tag found in html config."));
      }
      this.htmlTemplate = config.html;
      config.html = '';
    } else {
      this.htmlTemplate = '\x3cdiv\x3e{content}\x3c/div\x3e';
    }
  }
  this.callParent([config]);
}, onAfterRender:function(evt) {
  console.log('Heron.widgets.HtmlPanel.onAfterRender ' + evt);
  this.superclass.onAfterRender();
  if (!isEmpty(this.url)) {
    this.loadMask = new Ext.LoadMask({msg:__('Loading...'), target:this});
    this.loadMask.show();
    this.loadUrl(this.url);
  }
}, loadUrl:function(url) {
  var me = this;
  Ext.Ajax.request({url:url, success:function(response) {
    var s;
    s = me.htmlTemplate.replace('{content}', response.responseText);
    me.setHtml(s);
    if (me.loadMask) {
      me.loadMask.hide();
    }
  }, failure:function(response) {
    console.log('Heron.widgets.HtmlPanel.loadUrl response.status: ' + response.status);
    if (me.loadMask) {
      me.loadMask.hide();
    }
    if (response.status === 404) {
      Heron.Utils.msgConfigWarning(me, __('Could not load the specified url: ') + url);
    } else {
      Heron.Utils.msgConfigWarning(me, __('Unknown error when loading the specified url: ') + url);
    }
  }});
}});
Ext.define('Heron.debug.LogMapInfo', {map:null, constructor:function(config) {
  console.log('Heron.debug.LogMapInfo.constructor');
  if (!isSet(config)) {
    config = {};
  }
  if (!isSet(config.map)) {
    return;
  }
  this.map = config.map;
  this.callParent([config]);
  this.map.on('moveend', this.onMoveEnd, this);
}, onMoveEnd:function() {
  var s = '';
  s += __('Current zoomlevel: ') + this.map.getView().getZoom();
  s += '   ';
  s += __('Current resolution: ') + this.map.getView().getResolution();
  console.log(s);
}});
Ext.define('Heron.widgets.ToolButton', {extend:'Ext.button.Button', alias:'widget.hr_ToolButton', control:null, map:null, constructor:function(config) {
  if (!isSet(config)) {
    config = {};
  }
  if (isSet(config.control)) {
    this.control = config.control;
    this.control.setActive(false);
  }
  this.callParent([config]);
  if (isSet(config.toggleGroup)) {
    this.on('toggle', this.onToggle, this);
    if (isSet(config.pressed)) {
      if (config.pressed === true) {
        this.fireEvent('toggle', this, true);
      }
    }
  }
}, onToggle:function(sender, pressed) {
  console.log('Heron.widgets.ToolButton.onToggle ' + sender + ' ' + pressed);
  if (isSet(this.interaction)) {
    if (pressed) {
      if (!this.interaction.getActive()) {
        this.interaction.setActive(true);
      }
    } else {
      if (this.interaction.getActive()) {
        this.interaction.setActive(false);
      }
    }
  } else {
    if (isSet(this.control)) {
      if (pressed) {
        if (!this.control.getActive()) {
          this.control.setActive(true);
        }
      } else {
        if (this.control.getActive()) {
          this.control.setActive(false);
        }
      }
    }
  }
}});
Ext.define('Heron.base.Control', {requires:['Heron.Utils'], className:'', component:null, isActive:false, map:null, constructor:function(config) {
  console.log('Heron.base.Control.constructor');
  if (isEmpty(this.className)) {
    this.className = Heron.Utils.getClassName(this);
  }
  this.callParent([config]);
}, bind:function(cmp, update) {
  update = update === undefined ? true : update;
  this.component = cmp;
  if (update) {
    this.updateComponent();
  }
}, checkConfig:function(config, needMap) {
  needMap = needMap === undefined ? false : needMap;
  var controlConfig;
  console.log('Heron.base.Control.checkConfig');
  if (!isSet(config)) {
    config = {};
  }
  if (!isSet(config.options)) {
    Heron.Utils.msgConfigError(this, __("No 'options' found in the config."));
    return null;
  }
  if (needMap) {
    if (!isSet(config.map)) {
      Heron.Utils.msgConfigError(this, __("No '{0}' found in the config.").format('map'));
      return null;
    }
  }
  if (isEmpty(this.className)) {
    this.className = Heron.Utils.getClassName(this);
  }
  if (isSet(config.options[this.className])) {
    controlConfig = Ext.apply({}, config, config.options[this.className]);
  } else {
    controlConfig = Ext.apply({}, config);
  }
  if (needMap) {
    this.map = config.map;
  }
  return controlConfig;
}, format:function(text) {
  return text;
}, getActive:function() {
  return this.isActive;
}, setActive:function(flag) {
  console.log('Heron.base.Control.setActive ' + flag);
  if (flag === true && this.isActive) {
    return;
  }
  if (flag === false && !this.isActive) {
    return;
  }
  if (flag === true) {
    this.setEventHandlers(true);
  } else {
    this.setEventHandlers(false);
  }
  this.isActive = flag;
}, setEventHandlers:function(flag) {
}, updateComponent:function() {
}});
Ext.define('Heron.base.MapCoordinate', {extend:'Heron.base.Control', requires:['Heron.base.Control', 'Heron.Utils'], coord:0, xy_precision:0, constructor:function(config) {
  console.log('Heron.base.MapCoordinate.constructor');
  config = this.checkConfig(config, true);
  if (!isSet(config)) {
    return;
  }
  this.callParent([config]);
  this.xy_precision = checkOption(config.xy_precision, this.xy_precision);
  this.format = checkOption(config.format, this.format);
  this.setEventHandlers();
}, format:function(coord, precision) {
  return coord.toFixed(precision);
}, getCoordinate:function(evt) {
  return evt.coordinate[0];
}, onMouseMove:function(evt) {
  this.coord = this.getCoordinate(evt);
  this.updateComponent();
}, setEventHandlers:function() {
  var me = this;
  this.interaction = new ol.interaction.Pointer({handleMoveEvent:function(evt) {
    me.onMouseMove(evt);
  }});
  this.map.addInteraction(this.interaction);
  this.interaction.setActive(true);
}, updateComponent:function() {
  if (!isSet(this.component)) {
    return;
  }
  if (!isSet(this.coord)) {
    return;
  }
  this.component.setHtml(this.format(this.coord, this.xy_precision));
}});
Ext.define('Heron.controls.MapCoordinateX', {extend:'Heron.base.MapCoordinate', requires:['Heron.base.MapCoordinate', 'Heron.Utils'], constructor:function(config) {
  console.log('Heron.controls.MapCoordinateX.constructor');
  this.callParent([config]);
}, format:function(coord, precision) {
  return 'X: ' + coord.format(precision);
}, getCoordinate:function(evt) {
  return evt.coordinate[0];
}});
Ext.define('Heron.controls.MapCoordinateY', {extend:'Heron.base.MapCoordinate', requires:['Heron.base.MapCoordinate', 'Heron.Utils'], constructor:function(config) {
  console.log('Heron.controls.MapCoordinateY.constructor');
  this.callParent([config]);
}, format:function(coord, precision) {
  return 'Y: ' + coord.format(precision);
}, getCoordinate:function(evt) {
  return evt.coordinate[1];
}});
Ext.define('Heron.controls.MapProjection', {extend:'Heron.base.Control', requires:['Heron.base.Control', 'Heron.Utils'], constructor:function(config) {
  console.log('Heron.controls.MapProjection.constructor');
  config = this.checkConfig(config, true);
  if (!isSet(config)) {
    return;
  }
  this.callParent([config]);
  this.format = checkOption(config.format, this.format);
}, updateComponent:function() {
  var code;
  if (!isSet(this.component)) {
    return;
  }
  if (this.map && this.map.getView() && this.map.getView().getProjection()) {
    code = this.map.getView().getProjection().getCode();
  } else {
    code = '--';
  }
  this.component.setHtml(this.format(code));
}});
Ext.define('Heron.controls.ZoomPreviousNext', {extend:'Heron.base.Control', requires:['Heron.base.Control', 'Heron.Utils'], buttonNext:null, buttonPrevious:null, extents:[], currIndex:-1, disableEvent:false, zoomDuration:250, constructor:function(config) {
  console.log('Heron.controls.ZoomPreviousNext.constructor');
  config = this.checkConfig(config, true);
  if (!isSet(config)) {
    return;
  }
  this.callParent([config]);
  console.log('Heron.controls.ZoomPreviousNext.constructor 2');
  this.zoomDuration = checkOption(config.zoomDuration, this.zoomDuration);
  this.isActive = true;
  console.log('Heron.controls.ZoomPreviousNext.constructor 3');
  this.setEventHandlers(true);
}, onMoveEnd:function() {
  var extent;
  console.log('Heron.controls.ZoomPreviousNext.onMoveEnd');
  if (this.disableEvent) {
    this.disableEvent = false;
    return;
  }
  if (this.currIndex < this.extents.length - 1) {
    this.extents.length = this.currIndex + 1;
  }
  extent = this.map.getView().calculateExtent(this.map.getSize());
  this.extents.push(extent);
  this.currIndex += 1;
  this.updateButtons();
}, next:function() {
  var newExtent;
  this.currIndex += 1;
  newExtent = this.extents[this.currIndex];
  this.zoomToExtent(this.map, newExtent);
  this.updateButtons();
}, previous:function() {
  var newExtent;
  this.currIndex -= 1;
  newExtent = this.extents[this.currIndex];
  this.zoomToExtent(this.map, newExtent);
  this.updateButtons();
}, setActive:function(flag) {
}, setButtonNext:function(button) {
  this.buttonNext = button;
  this.buttonNext.disable();
}, setButtonPrevious:function(button) {
  this.buttonPrevious = button;
  this.buttonPrevious.disable();
}, setEventHandlers:function(flag) {
  console.log('Heron.controls.ZoomPreviousNext.setEventHandlers');
  if (flag === true) {
    this.map.on('moveend', this.onMoveEnd, this);
  } else {
    this.map.un('moveend', this.onMoveEnd, this);
  }
}, updateButtons:function() {
  if (this.extents.length <= 1) {
    this.buttonPrevious.disable();
    this.buttonNext.disable();
  } else {
    if (this.currIndex > 0) {
      this.buttonPrevious.enable();
    } else {
      this.buttonPrevious.disable();
    }
    if (this.currIndex < this.extents.length - 1) {
      this.buttonNext.enable();
    } else {
      this.buttonNext.disable();
    }
  }
}, zoomToExtent:function(map, extent) {
  this.disableEvent = true;
  map.getView().fit(extent, {duration:this.zoomDuration, easing:ol.easing.easeOut});
}});
Ext.define('Heron.widgets.MapBar', {singleton:true, requires:['Heron.widgets.ToolButton', 'Heron.controls.MapCoordinateX', 'Heron.controls.MapCoordinateY', 'Heron.controls.MapProjection', 'Heron.controls.ZoomPreviousNext', 'Heron.Utils'], mapPanel:null, itemDefs:null, zoomPreviousNextControl:null, constructor:function() {
  console.log('Heron.widgets.MapBar.constructor');
}, build:function(mapPanel, mapOptions, barOptions) {
  var barItems = [];
  var items;
  var item;
  var predefinedItemDef;
  var createFunction;
  var itemOptions;
  var barItem;
  var addSeparation;
  var separation;
  var margin;
  var padding;
  var width;
  var cls;
  var iconCls;
  var allowDepress;
  var len, i;
  console.log('Heron.widgets.MapBar.build');
  if (!isSet(mapPanel)) {
    return;
  }
  if (!isSet(barOptions)) {
    return;
  }
  if (isEmpty(barOptions.items)) {
    return;
  }
  if (!Ext.isArray(barOptions.items)) {
    return;
  }
  if (!isSet(mapOptions)) {
    return;
  }
  barOptions.dockPosition = checkOption(barOptions.dockPosition, 'top');
  barOptions.padding = checkOption(barOptions.padding, null);
  barOptions.plugins = checkOption(barOptions.plugins, null);
  barOptions.responsiveConfig = checkOption(barOptions.responsiveConfig, null);
  this.mapPanel = mapPanel;
  items = barOptions.items;
  for (i = 0, len = items.length; i < len; i++) {
    item = items[i];
    if (isEmpty(item.type)) {
      Heron.Utils.msgWarning(__("Invalid {0} config. Item with no 'type' found. Skipping.").format(barOptions.type));
      continue;
    }
    if (item.type === '-' || item.type === 'tbseparator') {
      barItems.push('-');
      continue;
    }
    if (item.type === ' ' || item.type === 'tbspacer') {
      barItems.push(' ');
      continue;
    }
    if (item.type === '-\x3e' || item.type === 'tbfill') {
      barItems.push('-\x3e');
      continue;
    }
    if (!isSet(this.itemDefs[item.type])) {
      Heron.Utils.msgWarning(__("Invalid {0} config. Item type '{1}' not found. Skipping.").format(barOptions.type, item.type));
      continue;
    }
    if (isSet(item.create)) {
      createFunction = item.create;
    } else {
      predefinedItemDef = this.itemDefs[item.type];
      if (isSet(predefinedItemDef.create)) {
        createFunction = predefinedItemDef.create;
      }
    }
    if (!isSet(createFunction)) {
      continue;
    }
    if (item.type === 'xcoord') {
      console.log('Heron.widgets.MapBar.build - type\x3d' + item.type);
    }
    margin = checkOption(barOptions.item.margin, null);
    padding = checkOption(barOptions.item.padding, null);
    width = checkOption(barOptions.item.width, null);
    cls = checkOption(barOptions.item.cls, null);
    iconCls = checkOption(barOptions.item.iconCls, null);
    allowDepress = false;
    itemOptions = {map:mapPanel.map, scope:mapPanel, margin:margin, padding:padding, width:width, cls:cls, iconCls:iconCls, allowDepress:allowDepress};
    if (isSet(predefinedItemDef.options)) {
      itemOptions = Ext.apply(itemOptions, predefinedItemDef.options);
    }
    if (isSet(item.options)) {
      itemOptions = Ext.apply({}, item.options, itemOptions);
    }
    if (!isSet(itemOptions.options)) {
      itemOptions.options = {};
    }
    itemOptions.options = Ext.apply({}, mapOptions, itemOptions.options);
    addSeparation = checkOption(itemOptions.addSeparation, false);
    if (addSeparation) {
      separation = barOptions.item.separation;
      itemOptions.margin = Heron.Utils.strElementAdd(itemOptions.margin, 3, separation);
    }
    if (!isSet(itemOptions.glyph)) {
      itemOptions.iconCls = null;
    }
    barItem = createFunction(mapPanel, itemOptions);
    if (isSet(barItem)) {
      barItems.push(barItem);
    }
  }
  if (barItems.length === 0) {
    return;
  }
  barOptions.xtype = 'toolbar';
  barOptions.dock = barOptions.dockPosition;
  barOptions.items = barItems;
  this.mapPanel.addDocked(barOptions);
}, buildStatusbar:function(mapPanel, options) {
  if (!isSet(this.itemDefs)) {
    if (!this.initItemDefinitions(options)) {
      return;
    }
  }
  try {
    options.statusbar.type = 'statusbar';
    options.statusbar.dockPosition = checkOption(options.statusbar.dockPosition, 'bottom');
    this.build(mapPanel, options, options.statusbar);
  } catch (err) {
    Heron.Utils.msgError(__('Error while building the statusbar - ') + err);
  }
}, buildToolbar:function(mapPanel, options) {
  if (!isSet(this.itemDefs)) {
    if (!this.initItemDefinitions(options)) {
      return;
    }
  }
  try {
    options.toolbar.type = 'toolbar';
    options.toolbar.dockPosition = checkOption(options.toolbar.dockPosition, 'top');
    this.build(mapPanel, options, options.toolbar);
  } catch (err) {
    Heron.Utils.msgError(__('Error while building the toolbar - ') + err);
  }
}, createToolbarButton:function(mapPanel, options) {
  options.map = mapPanel.map;
  return new Heron.widgets.ToolButton(options);
}, initItemDefinitions:function(options) {
  var me = this;
  try {
    me.itemDefs = {pan:{options:{xtype:'hr_ToolButton', id:'pan', iconCls:options.toolbar.item.iconCls, tooltip:__('Pan'), glyph:Heron.icons.pan, pressed:true, toggleGroup:options.toolbar.toggleGroup, control:new ol.interaction.DragPan({kinetic:new ol.Kinetic(-0.01, 0.1, 200)})}, create:function(mapPanel, options) {
      mapPanel.map.addInteraction(options.control);
      return Ext.create(options);
    }}, zoomin:{options:{xtype:'hr_ToolButton', id:'zoomin', tooltip:__('Zoom in'), glyph:Heron.icons.zoomIn, toggleGroup:options.toolbar.toggleGroup, control:new ol.interaction.DragZoom({condition:ol.events.condition.always})}, create:function(mapPanel, options) {
      mapPanel.map.addInteraction(options.control);
      return Ext.create(options);
    }}, zoomout:{options:{xtype:'hr_ToolButton', id:'zoomout', tooltip:__('Zoom out'), glyph:Heron.icons.zoomOut, control:new ol.interaction.DragZoom({condition:ol.events.condition.always, out:true}), toggleGroup:options.toolbar.toggleGroup}, create:function(mapPanel, options) {
      mapPanel.map.addInteraction(options.control);
      return Ext.create(options);
    }}, zoomdefault:{options:{xtype:'hr_ToolButton', id:'zoomdefault', tooltip:__('Zoom to default extent'), glyph:Heron.icons.zoomDefault, handler:function() {
      me.mapPanel.zoomToDefault();
    }}, create:function(mapPanel, options) {
      return Ext.create(options);
    }}, zoomprevious:{options:{xtype:'hr_ToolButton', id:'zoomprevious', tooltip:__('Zoom previous'), glyph:Heron.icons.zoomPrevious, handler:function() {
      me.zoomPreviousNextControl.previous();
    }}, create:function(mapPanel, options) {
      var button;
      if (!isSet(me.zoomPreviousNextControl)) {
        me.zoomPreviousNextControl = Ext.create('Heron.controls.ZoomPreviousNext', options);
      }
      options.control = me.zoomPreviousNextControl;
      button = Ext.create(options);
      options.control.setButtonPrevious(button);
      return button;
    }}, zoomnext:{options:{xtype:'hr_ToolButton', id:'zoomnext', tooltip:__('Zoom next'), glyph:Heron.icons.zoomNext, handler:function() {
      me.zoomPreviousNextControl.next();
    }}, create:function(mapPanel, options) {
      var button;
      if (!isSet(me.zoomPreviousNextControl)) {
        me.zoomPreviousNextControl = Ext.create('Heron.controls.ZoomPreviousNext', options);
      }
      options.control = me.zoomPreviousNextControl;
      button = Ext.create(options);
      me.zoomPreviousNextControl.setButtonNext(button);
      return button;
    }}, simplefeatureinfo:{options:{xtype:'hr_ToolButton', id:'simplefeatureinfo', tooltip:__('Get information'), glyph:Heron.icons.info, toggleGroup:options.toolbar.toggleGroup}, create:function(mapPanel, options) {
      options.control = Ext.create('Heron.controls.SimpleFeatureInfo', options);
      return Ext.create(options);
    }}, any:{options:{tooltip:__('Anything is allowed here'), text:__('Any valid Toolbar.add() config goes here')}, create:function(mapPanel, options) {
      return options;
    }}, epsgpanel:{options:{xtype:'tbtext', id:'epsg'}, create:function(mapPanel, options) {
      var control, cmp;
      control = Ext.create('Heron.controls.MapProjection', options);
      cmp = Ext.create(options);
      control.bind(cmp);
      return cmp;
    }}, xcoord:{options:{xtype:'tbtext', id:'x-coord'}, create:function(mapPanel, options) {
      var control, cmp;
      console.log('Heron.widgets.MapBar.itemDefs xcoord.create() ');
      control = Ext.create('Heron.controls.MapCoordinateX', options);
      cmp = Ext.create(options);
      control.bind(cmp, true);
      return cmp;
    }}, ycoord:{options:{xtype:'tbtext', id:'y-coord'}, create:function(mapPanel, options) {
      var control, cmp;
      control = Ext.create('Heron.controls.MapCoordinateY', options);
      cmp = Ext.create(options);
      control.bind(cmp, true);
      return cmp;
    }}};
    me.itemDefs.zoomvisible = {options:me.itemDefs.zoomdefault.options, create:me.itemDefs.zoomdefault.create};
    return true;
  } catch (err) {
    Heron.Utils.msgError(__('Error while creating toolbar/statusbar item definitions - ') + err);
    return false;
  }
}, setItemDef:function(type, createFunction, defaultOptions) {
  defaultOptions = defaultOptions ? defaultOptions : {};
  this.defs[type].create = createFunction;
  this.defs[type].options = defaultOptions;
}});
Ext.define('Heron.widgets.MapPanel', {extend:'Heron.base.Panel', alias:'widget.hr_MapPanel', requires:['Heron.debug.LogMapInfo', 'Heron.base.Panel', 'Heron.widgets.MapBar', 'Heron.Utils'], center:null, zoom:null, logMapInfoControl:null, useMapContext:false, constructor:function(config) {
  var me = this;
  var mapComponent;
  var zoomExtent;
  var mapOptions;
  var newLayers;
  var layer;
  var i, len;
  console.log('Heron.widgets.MapPanel.constructor');
  config = this.checkConfig(config);
  if (!isSet(config)) {
    return;
  }
  mapOptions = config.options;
  mapOptions.settings = checkOption(mapOptions.settings, {});
  mapOptions.layers = checkOption(mapOptions.layers, []);
  if (isSet(mapOptions.settings.center) && isSet(mapOptions.settings.zoom)) {
    zoomExtent = null;
  } else {
    if (isSet(mapOptions.settings.zoomExtent)) {
      zoomExtent = mapOptions.settings.zoomExtent;
      mapOptions.settings.center = ol.extent.getCenter(mapOptions.settings.zoomExtent);
      mapOptions.settings.zoom = 0;
    }
  }
  newLayers = [];
  for (i = 0, len = mapOptions.layers.length; i < len; i++) {
    if (mapOptions.layers[i] instanceof Array) {
      layer = Heron.Utils.parseLayerDefArray(mapOptions.layers[i]);
      if (layer) {
        newLayers.push(layer);
      }
    } else {
      newLayers.push(mapOptions.layers[i]);
    }
  }
  mapOptions.layers = newLayers;
  try {
    this.map = this.createMap(mapOptions);
  } catch (err) {
    Heron.Utils.msgError(__('Error while creating the map: ') + err);
  }
  mapComponent = Ext.create('GeoExt.component.Map', {map:this.map});
  config.items = [mapComponent];
  me.callParent([config]);
  if (Heron.DEBUG) {
    this.logMapInfoControl = Ext.create('Heron.debug.LogMapInfo', {map:this.map});
  }
  Heron.App.map = this.map;
  Heron.App.mapPanel = this;
  if (isSet(zoomExtent)) {
    Heron.OLUtils.zoomToExtent(this.map, zoomExtent);
    this.center = this.map.getView().getCenter();
    this.zoom = this.map.getView().getZoom();
  } else {
    this.center = mapOptions.settings.center;
    this.zoom = mapOptions.settings.zoom;
  }
  Heron.widgets.MapBar.buildToolbar(this, mapOptions);
  Heron.widgets.MapBar.buildStatusbar(this, mapOptions);
}, createMap:function(options) {
  var viewOptions = {};
  var map;
  if (isSet(options.settings.center)) {
    viewOptions.center = options.settings.center;
  }
  if (isSet(options.settings.constrainRotation)) {
    viewOptions.constrainRotation = options.settings.constrainRotation;
  }
  if (isSet(options.settings.enableRotation)) {
    viewOptions.enableRotation = options.settings.enableRotation;
  }
  if (isSet(options.settings.extent)) {
    viewOptions.extent = options.settings.extent;
  }
  if (isSet(options.settings.maxResolution)) {
    viewOptions.maxResolution = options.settings.maxResolution;
  }
  if (isSet(options.settings.minResolution)) {
    viewOptions.minResolution = options.settings.minResolution;
  }
  if (isSet(options.settings.maxZoom)) {
    viewOptions.maxZoom = options.settings.maxZoom;
  }
  if (isSet(options.settings.minZoom)) {
    viewOptions.minZoom = options.settings.minZoom;
  }
  if (isSet(options.settings.projection)) {
    viewOptions.projection = options.settings.projection;
  }
  if (isSet(options.settings.resolution)) {
    viewOptions.resolution = options.settings.resolution;
  }
  if (isSet(options.settings.resolutions)) {
    viewOptions.resolutions = options.settings.resolutions;
  }
  if (isSet(options.settings.rotation)) {
    viewOptions.rotation = options.settings.rotation;
  }
  if (isSet(options.settings.zoom)) {
    viewOptions.zoom = options.settings.zoom;
  }
  if (isSet(options.settings.zoomFactor)) {
    viewOptions.zoomFactor = options.settings.zoomFactor;
  }
  map = new ol.Map({layers:options.layers, controls:options.controls, interactions:options.interactions, keyboardEventTarget:options.keyboardEventTarget, view:new ol.View(viewOptions)});
  return map;
}, zoomToDefault:function() {
  this.map.getView().setRotation(0);
  Heron.OLUtils.zoomToCenter(this.map, this.center, this.zoom);
}});
Ext.define('Heron.widgets.SimpleFeatureInfoPanel', {extend:'Heron.base.Panel', alias:'widget.hr_SimpleFeatureInfoPanel', requires:['Ext.LoadMask', 'Heron.base.Panel', 'Heron.Utils'], constructor:function(config) {
  console.log('Heron.widgets.SimpleFeatureInfoPanel.constructor');
  config = this.checkConfig(config);
  if (!isSet(config)) {
    return;
  }
  this.callParent([config]);
}, setInfo:function(text) {
  this.setHtml(text);
}});
Ext.define('Heron.widgets.SimpleLayerTreePanel', {extend:'Ext.tree.Panel', alias:'widget.hr_SimpleLayerTreePanel', requires:['Ext.tree.Panel', 'Heron.base.Panel', 'Heron.Utils'], map:null, store:null, constructor:function(config) {
  var me = this;
  var layerGroup;
  console.log('Heron.widgets.SimpleLayerTreePanel.constructor');
  config = Heron.base.Panel.prototype.checkConfig.call(me, config);
  if (!isSet(config)) {
    return;
  }
  layerGroup = new ol.layer.Group({visible:false});
  config.store = Ext.create('GeoExt.data.store.LayersTree', {layerGroup:layerGroup});
  config.store.unbindGroupLayerCollectionEvents(layerGroup);
  this.store = config.store;
  me.callParent([config]);
  Heron.App.on('afterlayout', this.onAfterLayout, this);
}, onAfterLayout:function(evt) {
  var me = this;
  var layerGroup;
  var collection;
  console.log('Heron.widgets.SimpleLayerTreePanel.onAfterLayout ' + evt);
  if (!isSet(me.map)) {
    me.map = Heron.App.map;
  }
  if (!isSet(me.map)) {
    return;
  }
  layerGroup = me.map.getLayerGroup();
  me.store.setLayerGroup(layerGroup);
  collection = layerGroup.getLayers();
  Ext.each(collection.getArray(), function(layer) {
    me.store.addLayerNode(layer);
  }, me.store, me.store.inverseLayerOrder);
  me.store.bindGroupLayerCollectionEvents(layerGroup);
  me.store.on({remove:me.store.handleRemove, noderemove:me.store.handleNodeRemove, nodeappend:me.store.handleNodeAppend, nodeinsert:me.store.handleNodeInsert, scope:me.store});
}});
Ext.define('Heron.debug.Test', {singleton:true, requires:['Ext.window.Toast'], init:function() {
  var me = this;
  console.log('Heron.debug.Test.init');
  if (!isSet(Heron.options.map.toolbar.items)) {
    Heron.options.map.toolbar.items = [];
  }
  if (Heron.options.map.toolbar.items.length > 0) {
    Heron.options.map.toolbar.items.push({type:' '});
  }
  Heron.options.map.toolbar.items.push({type:'any', options:{tooltip:__('Test'), text:__('Test'), handler:function() {
    me.test();
  }}});
}, test:function() {
  var me = this;
  me.test_ConsoleLog();
}, test_ConsoleLog:function() {
  console.log('test_ConsoleLog');
}});
Ext.define('Heron.OLUtils', {singleton:true, zoomByDelta:function(map, delta, duration) {
  duration = duration === undefined ? 250 : duration;
  var view;
  var currentResolution;
  var newResolution;
  view = map.getView();
  if (!view) {
    return;
  }
  currentResolution = view.getResolution();
  if (currentResolution) {
    newResolution = view.constrainResolution(currentResolution, delta);
    if (duration > 0) {
      if (view.getAnimating()) {
        view.cancelAnimations();
      }
      view.animate({resolution:newResolution, duration:duration, easing:ol.easing.easeOut});
    } else {
      view.setResolution(newResolution);
    }
  }
}, zoomIn:function(map, duration) {
  duration = duration === undefined ? 250 : duration;
  this.zoomByDelta(map, 1, duration);
}, zoomOut:function(map, duration) {
  duration = duration === undefined ? 250 : duration;
  this.zoomByDelta(map, -1, duration);
}, zoomToCenter:function(map, center, zoom, duration) {
  duration = duration === undefined ? 250 : duration;
  var view;
  view = map.getView();
  if (!view) {
    return;
  }
  if (duration > 0) {
    if (view.getAnimating()) {
      view.cancelAnimations();
    }
    view.animate({zoom:zoom, center:center, duration:duration, easing:ol.easing.easeOut});
  } else {
    view.animate({zoom:zoom, center:center});
  }
}, zoomToExtent:function(map, extent, duration) {
  duration = duration === undefined ? 250 : duration;
  var newExtent = null;
  if (!extent) {
    return;
  }
  if (Array.isArray(extent)) {
    newExtent = extent;
  } else {
    if (isSet(extent.minx) && isSet(extent.miny) && isSet(extent.maxx) && isSet(extent.maxx)) {
      newExtent = [Number(extent.minx), Number(extent.miny), Number(extent.maxx), Number(extent.maxy)];
    }
  }
  if (!newExtent) {
    return;
  }
  map.getView().fit(newExtent, {duration:duration, easing:ol.easing.easeOut});
}});
Ext.define('Heron.Theme', {singleton:true, requires:['Heron.Utils'], isInitialized:false, toolbarStyle:null, toolbarHeight:0, getCurrentThemeName:function() {
  var linkTags;
  var linkTag;
  var href, css;
  var themeName;
  var i, len;
  themeName = '';
  linkTags = document.getElementsByTagName('link');
  for (i = 0, len = linkTags.length; i < len; i++) {
    linkTag = linkTags[i];
    if (isSet(linkTag.href)) {
      href = linkTag.href.replace('\\', '/');
      css = href.afterLast('/');
      if (!isEmpty(css)) {
        if (css.startsWith('theme-') && css.endsWith('-all.css')) {
          themeName = css.after('theme-');
          themeName = themeName.before('-all.css');
        }
      }
    }
  }
  return themeName;
}, init:function() {
  var themeName;
  if (this.isInitialized) {
    return;
  }
  themeName = this.getCurrentThemeName();
  console.log('Heron.Theme.init themeName\x3d' + themeName);
  if (themeName === 'crisp') {
    this.toolbarHeight = 36;
    this.toolbarStyle = 'background: #F5F5F5;';
  } else {
    if (themeName === 'gray') {
      this.toolbarHeight = 27;
      this.toolbarStyle = 'background-color: #D7D2D2;background-image:-webkit-linear-gradient(top,#F0F0F0,#D7D7D7);';
    } else {
      if (themeName === 'neptune') {
        this.toolbarHeight = 36;
        this.toolbarStyle = 'background:#157FCC;';
      } else {
        if (themeName === 'triton') {
          this.toolbarHeight = 45;
          this.toolbarStyle = 'background:#5FA2DD;';
        } else {
          this.toolbarHeight = Heron.options.map.toolbar.height;
          this.toolbarStyle = Heron.options.map.toolbar.style;
        }
      }
    }
  }
  this.isInitialized = true;
}, updateToolbarLayoutAndStyle:function() {
  this.init();
  Heron.options.map.toolbar.height = this.toolbarHeight;
  Heron.options.map.toolbar.style = this.toolbarStyle;
}});
Ext.define('Heron.Application', {extend:'Ext.Component', requires:['Heron.widgets.HtmlPanel', 'Heron.widgets.MapPanel', 'Heron.widgets.SimpleFeatureInfoPanel', 'Heron.widgets.SimpleLayerTreePanel', 'Heron.debug.Test', 'Heron.OLUtils', 'Heron.Theme', 'Heron.Utils'], mapContext:null, map:null, mapPanel:null, launch:function(config, options) {
  console.log('Heron.Application.launch');
  consoleLog('Heron Version: ' + config.fullVersion);
  if (Heron.TEST) {
    Heron.debug.Test.init();
  }
  if (isSet(config.launch.afterStart)) {
    config.launch.afterStart(this);
  }
  Heron.Theme.updateToolbarLayoutAndStyle();
  if (!isSet(options.layout)) {
    Heron.Utils.msgConfigError(null, __('No Heron.options.layout specified in the config!'));
    return;
  }
  if (!isEmpty(options.mapContext.url)) {
    this.loadMapContext(options.mapContext);
  } else {
    this.createLayout(options.layout);
  }
  this.fireEvent('afterlayout', this);
  if (isSet(config.launch.beforeEnd)) {
    config.launch.beforeEnd(this);
  }
}, onAfterLayout:function() {
  console.log('Heron.Application.onAfterLayout');
}, createLayout:function(layout) {
  var me = this;
  var elem;
  console.log('Heron.Application.createLayout');
  try {
    if (isSet(layout.renderTo) || layout.xtype === 'window') {
      console.log('Heron.Application.createLayout - creating Heron Layout');
      me.topComponent = Ext.create(layout);
      if (isSet(layout.renderTo)) {
        elem = Ext.get(layout.renderTo);
        if (elem) {
          elem.on('resize', function() {
            me.topComponent.updateLayout();
          });
        }
      }
    } else {
      console.log('Heron.Application.createLayout - creating Viewport');
      me.topComponent = new Ext.Viewport({id:'hr_MainWindow', layout:'fit', hideBorders:true, items:[layout]});
    }
    if (isSet(this.topComponent) && !this.topComponent.isVisible()) {
      this.topComponent.show();
    }
  } catch (err) {
    Heron.Utils.msgError(__('Error while creating the app layout - ') + err);
  }
}, loadMapContext:function(config) {
  console.log(config);
  Heron.Utils.msgBoxInfo('Not yet implemented.');
}});
Ext.Loader.setConfig({disableCaching:Heron.disableCaching, enabled:true, paths:{'GeoExt':Heron.app.paths.geoext, 'Heron':Heron.app.paths.src}});
Ext.application({requires:['Heron.Application'], launch:function() {
  Heron.App = Ext.create('Heron.Application');
  Heron.App.launch(Heron.app, Heron.options);
}});
Ext.define('Heron.controls.SimpleFeatureInfo', {extend:'Heron.base.Control', requires:['Heron.base.Control', 'Heron.Utils'], infoPanel:null, infoPanelId:null, constructor:function(config) {
  console.log('Heron.controls.SimpleFeatureInfo.constructor');
  config = this.checkConfig(config, true);
  if (!isSet(config)) {
    return;
  }
  this.callParent([config]);
  this.infoPanelId = checkOption(config.infoPanelId, this.infoPanelId);
}, setEventHandlers:function(flag) {
  console.log('Heron.controls.SimpleFeatureInfo.setEventHandlers');
  if (flag === true) {
    this.map.on('singleclick', this.onMouseClick, this);
    this.map.on('pointermove', this.onMouseMove, this);
  } else {
    this.map.un('singleclick', this.onMouseClick, this);
    this.map.un('pointermove', this.onMouseMove, this);
  }
}, msgFeatureInfo:function(text) {
  var msg;
  msg = '\x3ch2\x3eFeature Info\x3c/h2\x3e';
  Heron.Utils.msgInfo(msg + text);
}, onFeatureInfo:function(evt) {
  var info;
  var bcolor;
  var color;
  console.log('Heron.controls.SimpleFeatureInfo.onFeatureInfo');
  info = evt.currentTarget.responseText;
  bcolor = '#666';
  color = '#fff';
  info = info.replace('background:#eee;', 'background:' + bcolor + ';color:' + color + ';');
  if (!isSet(this.infoPanel)) {
    if (!isEmpty(this.infoPanelId)) {
      this.infoPanel = Ext.getCmp(this.infoPanelId);
      if (isSet(this.infoPanel)) {
        this.infoPanel.setInfo(info);
      } else {
        this.msgFeatureInfo(info);
      }
    } else {
      this.msgFeatureInfo(info);
    }
  } else {
    this.infoPanel.setInfo(info);
  }
}, onMouseClick:function(evt) {
  var me = this;
  var resolution;
  var projection;
  var layers;
  var source;
  var infoFormat;
  var infoSource = null;
  var request;
  var url;
  var i, len;
  console.log('Heron.controls.SimpleFeatureInfo.onMouseClick');
  resolution = this.map.getView().getResolution();
  projection = this.map.getView().getProjection();
  layers = this.map.getLayerGroup().getLayers().getArray();
  for (i = 0, len = layers.length; i < len; i++) {
    source = layers[i].getSource();
    if (source instanceof ol.source.ImageWMS && layers[i].getVisible() === true) {
      infoSource = source;
      break;
    }
  }
  if (infoSource) {
    infoFormat = 'text/html';
    url = infoSource.getGetFeatureInfoUrl(evt.coordinate, resolution, projection, {'INFO_FORMAT':infoFormat});
    if (!isEmpty(url)) {
      request = new XMLHttpRequest;
      request.open('GET', url);
      request.addEventListener('load', function(evt) {
        me.onFeatureInfo(evt);
      });
      request.send(url);
    }
  }
}, onMouseMove:function(evt) {
  var coord;
  var hasHit;
  if (evt.dragging) {
    return;
  }
  coord = this.map.getEventPixel(evt.originalEvent);
  try {
    hasHit = this.map.forEachLayerAtPixel(coord, function() {
      return true;
    });
    this.map.getTargetElement().style.cursor = hasHit ? 'pointer' : '';
  } catch (err) {
  }
}});
