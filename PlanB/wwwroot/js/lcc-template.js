//https://github.com/alphagov/govuk_frontend_toolkit/blob/master/javascripts/govuk/modules.js
$(document).ready(function () {
  LCC.modules.start();
});

(function (global) {
  "use strict";


  var $ = global.jQuery;
  var LCC = global.LCC || {};
  LCC.Modules = LCC.Modules || {};


  LCC.modules = {
    find: function (container) {
      var modules,
        moduleSelector = '[data-module]',
        container = container || $('body');

      modules = container.find(moduleSelector);

      // Container could be a module too 
      if (container.is(moduleSelector)) {
        modules = modules.add(container);
      }

      return modules;
    },

    start: function (container, force) {
      var modules = this.find(container);
      force = force || false;

      for (var i = 0, l = modules.length; i < l; i++) {
        var module,
          element = $(modules[i]),
          type = camelCaseAndCapitalise(element.data('module')),
          started = element.data('module-started');

        if (typeof LCC.Modules[type] === "function" && (!started || force )) {
          module = new LCC.Modules[type]();
          module.start(element);
          element.data('module-started', true);
        }
      }

      // eg selectable-table to SelectableTable 
      function camelCaseAndCapitalise(string) {
        return capitaliseFirstLetter(camelCase(string));
      }

      // http://stackoverflow.com/questions/6660977/convert-hyphens-to-camel-case-camelcase 
      function camelCase(string) {
        return string.replace(/-([a-z])/g, function (g) {
          return g[1].toUpperCase();
        });
      }

      // http://stackoverflow.com/questions/1026069/capitalize-the-first-letter-of-string-in-javascript 
      function capitaliseFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }
    }
  }

  global.LCC = LCC;
})(window);(function (global, $) {
  "use strict";

  var LCC = global.LCC || {};
	  LCC.Cookie = LCC.Cookie || {};

  $(document).ready(function () {
    LCC.Cookie.addCookieMessage();
  });

  LCC.Cookie.addCookieMessage = function () {

    var message = document.getElementById('global-cookie-message');
    if (message) {
      $(message).on('click', '.js-seen-cookie-message', function (event) {
        LCC.Cookie.cookieCommand('seen_cookie_message', 'yes', { days: 28 });
      });

      if (LCC.Cookie.cookieCommand('seen_cookie_message') === null) {
        message.style.display = 'block';
      }
    }
  };

  /*
    Cookie methods
    ==============

    Usage:

      Setting a cookie:
      LCC.Cookie.cookieCommand('hobnob', 'tasty', { days: 30 });

      Reading a cookie:
      LCC.Cookie.cookieCommand('hobnob');

      Deleting a cookie:
      LCC.Cookie.cookieCommand('hobnob', null);
  */
  
  LCC.Cookie.cookieCommand = function (name, value, options) {
    if (typeof value !== 'undefined') {
      if (value === false || value === null) {
        return LCC.Cookie.setCookie(name, '', { days: -1 });
      } else {
        return LCC.Cookie.setCookie(name, value, options);
      }
    } else {
      return LCC.Cookie.getCookie(name);
    }
  };
  LCC.Cookie.setCookie = function (name, value, options) {
    if (typeof options === 'undefined') {
      options = {};
    }
    var cookieString = name + "=" + value + "; path=/";
    if (options.days) {
      var date = new Date();
      date.setTime(date.getTime() + (options.days * 24 * 60 * 60 * 1000));
      cookieString = cookieString + "; expires=" + date.toGMTString();
    }
    if (document.location.protocol == 'https:') {
      cookieString = cookieString + "; Secure";
    }
    document.cookie = cookieString;
  };
  LCC.Cookie.getCookie = function (name) {
    var nameEQ = name + "=";
    var cookies = document.cookie.split(';');
    for (var i = 0, len = cookies.length; i < len; i++) {
      var cookie = cookies[i];
      while (cookie.charAt(0) == ' ') {
        cookie = cookie.substring(1, cookie.length);
      }
      if (cookie.indexOf(nameEQ) === 0) {
        return decodeURIComponent(cookie.substring(nameEQ.length));
      }
    }
    return null;
  };

  global.LCC = LCC;
})(window, jQuery);(function (global, $) {
    "use strict";
    var LCC = global.LCC || {};
	    LCC.MainMenu = LCC.MainMenu || {};

    $(document).ready(function () {
        LCC.MainMenu.addActiveItemEvent();
    });

    LCC.MainMenu.addActiveItemEvent = function () {
        $('a.main-menu').click(function() {
            $('#main-menu').toggleClass("active");
            $(this).toggleClass("active");
            $('#main-menu ul.root li:nth-child(1) a').addClass("firstItem");
            $('#main-menu ul.root li ul li a').removeClass("firstItem");
            $('#main-menu ul.root li a.firstItem').focus();
        });
    };

    global.LCC = LCC;

})(window, jQuery);(function (global, $) {
    "use strict";
    var LCC = global.LCC || {};
	    LCC.GlobalSearch = LCC.GlobalSearch || {};

    $(document).ready(function () {
        LCC.GlobalSearch.addClickEvent();
    });

    LCC.GlobalSearch.addClickEvent = function () {
        $('a.search').click(function() {
            $('#nav-search').toggleClass("active");
            $(this).toggleClass("active");
            $('#nav-search input').focus();
        });
    };

    global.LCC = LCC;

})(window, jQuery);(function (global, $) {
    "use strict";
    var LCC = global.LCC || {};
	    LCC.EqualHeights = LCC.EqualHeights || {};

    $(global).on('load', function() {
        LCC.EqualHeights.applyEqualHeights();
    });

    $(global).on('resize', function(){
        LCC.EqualHeights.applyEqualHeights();
    });

    LCC.EqualHeights.applyEqualHeights = function () {
        var currentTallest = 0,
            currentRowStart = 0,
            rowDivs = new Array(),
            $el,
            topPosition = 0;

        $('.equal-item').each(function() {
            $el = $(this);
            $($el).height('auto')
            topPosition = $el.position().top;

            if (currentRowStart != topPosition) {
                for (var currentDiv = 0 ; currentDiv < rowDivs.length ; currentDiv++) {
                    rowDivs[currentDiv].height(currentTallest);
                }
                rowDivs.length = 0; // empty the array
                currentRowStart = topPosition;
                currentTallest = $el.height();
                rowDivs.push($el);
            } else {
                rowDivs.push($el);
                currentTallest = (currentTallest < $el.height()) ? ($el.height()) : (currentTallest);
            }
            for (var currentDiv = 0 ; currentDiv < rowDivs.length ; currentDiv++) {
                rowDivs[currentDiv].height(currentTallest);
            }
        });
    };

    global.LCC = LCC;

})(window, jQuery);/*! jQuery UI - v1.10.2 - 2013-03-19
 * http://jqueryui.com
 * Includes: jquery.ui.core.js, jquery.ui.widget.js, jquery.ui.mouse.js, jquery.ui.slider.js
 * Copyright 2013 jQuery Foundation and other contributors Licensed MIT */

(function($, undefined) {

  var uuid = 0,
    runiqueId = /^ui-id-\d+$/;

  // $.ui might exist from components with no dependencies, e.g., $.ui.position
  $.ui = $.ui || {};

  $.extend($.ui, {
    version: "1.10.2",

    keyCode: {
      BACKSPACE: 8,
      COMMA: 188,
      DELETE: 46,
      DOWN: 40,
      END: 35,
      ENTER: 13,
      ESCAPE: 27,
      HOME: 36,
      LEFT: 37,
      NUMPAD_ADD: 107,
      NUMPAD_DECIMAL: 110,
      NUMPAD_DIVIDE: 111,
      NUMPAD_ENTER: 108,
      NUMPAD_MULTIPLY: 106,
      NUMPAD_SUBTRACT: 109,
      PAGE_DOWN: 34,
      PAGE_UP: 33,
      PERIOD: 190,
      RIGHT: 39,
      SPACE: 32,
      TAB: 9,
      UP: 38
    }
  });

  // plugins
  $.fn.extend({
    focus: (function(orig) {
      return function(delay, fn) {
        return typeof delay === "number" ?
          this.each(function() {
            var elem = this;
            setTimeout(function() {
              $(elem).focus();
              if (fn) {
                fn.call(elem);
              }
            }, delay);
          }) :
          orig.apply(this, arguments);
      };
    })($.fn.focus),

    scrollParent: function() {
      var scrollParent;
      if (($.ui.ie && (/(static|relative)/).test(this.css("position"))) || (/absolute/).test(this.css("position"))) {
        scrollParent = this.parents().filter(function() {
          return (/(relative|absolute|fixed)/).test($.css(this, "position")) && (/(auto|scroll)/).test($.css(this, "overflow") + $.css(this, "overflow-y") + $.css(this, "overflow-x"));
        }).eq(0);
      } else {
        scrollParent = this.parents().filter(function() {
          return (/(auto|scroll)/).test($.css(this, "overflow") + $.css(this, "overflow-y") + $.css(this, "overflow-x"));
        }).eq(0);
      }

      return (/fixed/).test(this.css("position")) || !scrollParent.length ? $(document) : scrollParent;
    },

    zIndex: function(zIndex) {
      if (zIndex !== undefined) {
        return this.css("zIndex", zIndex);
      }

      if (this.length) {
        var elem = $(this[0]),
          position, value;
        while (elem.length && elem[0] !== document) {
          // Ignore z-index if position is set to a value where z-index is ignored by the browser
          // This makes behavior of this function consistent across browsers
          // WebKit always returns auto if the element is positioned
          position = elem.css("position");
          if (position === "absolute" || position === "relative" || position === "fixed") {
            // IE returns 0 when zIndex is not specified
            // other browsers return a string
            // we ignore the case of nested elements with an explicit value of 0
            // <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
            value = parseInt(elem.css("zIndex"), 10);
            if (!isNaN(value) && value !== 0) {
              return value;
            }
          }
          elem = elem.parent();
        }
      }

      return 0;
    },

    uniqueId: function() {
      return this.each(function() {
        if (!this.id) {
          this.id = "ui-id-" + (++uuid);
        }
      });
    },

    removeUniqueId: function() {
      return this.each(function() {
        if (runiqueId.test(this.id)) {
          $(this).removeAttr("id");
        }
      });
    }
  });

  // selectors
  function focusable(element, isTabIndexNotNaN) {
    var map, mapName, img,
      nodeName = element.nodeName.toLowerCase();
    if ("area" === nodeName) {
      map = element.parentNode;
      mapName = map.name;
      if (!element.href || !mapName || map.nodeName.toLowerCase() !== "map") {
        return false;
      }
      img = $("img[usemap=#" + mapName + "]")[0];
      return !!img && visible(img);
    }
    return (/input|select|textarea|button|object/.test(nodeName) ?
        !element.disabled :
        "a" === nodeName ?
        element.href || isTabIndexNotNaN :
        isTabIndexNotNaN) &&
      // the element and all of its ancestors must be visible
      visible(element);
  }

  function visible(element) {
    return $.expr.filters.visible(element) &&
      !$(element).parents().addBack().filter(function() {
        return $.css(this, "visibility") === "hidden";
      }).length;
  }

  $.extend($.expr[":"], {
    data: $.expr.createPseudo ?
      $.expr.createPseudo(function(dataName) {
        return function(elem) {
          return !!$.data(elem, dataName);
        };
      }) :
      // support: jQuery <1.8
      function(elem, i, match) {
        return !!$.data(elem, match[3]);
      },

    focusable: function(element) {
      return focusable(element, !isNaN($.attr(element, "tabindex")));
    },

    tabbable: function(element) {
      var tabIndex = $.attr(element, "tabindex"),
        isTabIndexNaN = isNaN(tabIndex);
      return (isTabIndexNaN || tabIndex >= 0) && focusable(element, !isTabIndexNaN);
    }
  });

  // support: jQuery <1.8
  if (!$("<a>").outerWidth(1).jquery) {
    $.each(["Width", "Height"], function(i, name) {
      var side = name === "Width" ? ["Left", "Right"] : ["Top", "Bottom"],
        type = name.toLowerCase(),
        orig = {
          innerWidth: $.fn.innerWidth,
          innerHeight: $.fn.innerHeight,
          outerWidth: $.fn.outerWidth,
          outerHeight: $.fn.outerHeight
        };

      function reduce(elem, size, border, margin) {
        $.each(side, function() {
          size -= parseFloat($.css(elem, "padding" + this)) || 0;
          if (border) {
            size -= parseFloat($.css(elem, "border" + this + "Width")) || 0;
          }
          if (margin) {
            size -= parseFloat($.css(elem, "margin" + this)) || 0;
          }
        });
        return size;
      }

      $.fn["inner" + name] = function(size) {
        if (size === undefined) {
          return orig["inner" + name].call(this);
        }

        return this.each(function() {
          $(this).css(type, reduce(this, size) + "px");
        });
      };

      $.fn["outer" + name] = function(size, margin) {
        if (typeof size !== "number") {
          return orig["outer" + name].call(this, size);
        }

        return this.each(function() {
          $(this).css(type, reduce(this, size, true, margin) + "px");
        });
      };
    });
  }

  // support: jQuery <1.8
  if (!$.fn.addBack) {
    $.fn.addBack = function(selector) {
      return this.add(selector == null ?
        this.prevObject : this.prevObject.filter(selector)
      );
    };
  }

  // support: jQuery 1.6.1, 1.6.2 (http://bugs.jquery.com/ticket/9413)
  if ($("<a>").data("a-b", "a").removeData("a-b").data("a-b")) {
    $.fn.removeData = (function(removeData) {
      return function(key) {
        if (arguments.length) {
          return removeData.call(this, $.camelCase(key));
        } else {
          return removeData.call(this);
        }
      };
    })($.fn.removeData);
  }

  // deprecated
  $.ui.ie = !!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase());

  $.support.selectstart = "onselectstart" in document.createElement("div");
  $.fn.extend({
    disableSelection: function() {
      return this.bind(($.support.selectstart ? "selectstart" : "mousedown") +
        ".ui-disableSelection",
        function(event) {
          event.preventDefault();
        });
    },

    enableSelection: function() {
      return this.unbind(".ui-disableSelection");
    }
  });

  $.extend($.ui, {
    // $.ui.plugin is deprecated.  Use the proxy pattern instead.
    plugin: {
      add: function(module, option, set) {
        var i,
          proto = $.ui[module].prototype;
        for (i in set) {
          proto.plugins[i] = proto.plugins[i] || [];
          proto.plugins[i].push([option, set[i]]);
        }
      },
      call: function(instance, name, args) {
        var i,
          set = instance.plugins[name];
        if (!set || !instance.element[0].parentNode || instance.element[0].parentNode.nodeType === 11) {
          return;
        }

        for (i = 0; i < set.length; i++) {
          if (instance.options[set[i][0]]) {
            set[i][1].apply(instance.element, args);
          }
        }
      }
    },

    // only used by resizable
    hasScroll: function(el, a) {

      //If overflow is hidden, the element might have extra content, but the user wants to hide it
      if ($(el).css("overflow") === "hidden") {
        return false;
      }

      var scroll = (a && a === "left") ? "scrollLeft" : "scrollTop",
        has = false;

      if (el[scroll] > 0) {
        return true;
      }

      // TODO: determine which cases actually cause this to happen
      // if the element doesn't have the scroll set, see if it's possible to
      // set the scroll
      el[scroll] = 1;
      has = (el[scroll] > 0);
      el[scroll] = 0;
      return has;
    }
  });

})(jQuery);
(function($, undefined) {

  var uuid = 0,
    slice = Array.prototype.slice,
    _cleanData = $.cleanData;
  $.cleanData = function(elems) {
    for (var i = 0, elem;
      (elem = elems[i]) != null; i++) {
      try {
        $(elem).triggerHandler("remove");
        // http://bugs.jquery.com/ticket/8235
      } catch (e) {}
    }
    _cleanData(elems);
  };

  $.widget = function(name, base, prototype) {
    var fullName, existingConstructor, constructor, basePrototype,
      // proxiedPrototype allows the provided prototype to remain unmodified
      // so that it can be used as a mixin for multiple widgets (#8876)
      proxiedPrototype = {},
      namespace = name.split(".")[0];

    name = name.split(".")[1];
    fullName = namespace + "-" + name;

    if (!prototype) {
      prototype = base;
      base = $.Widget;
    }

    // create selector for plugin
    $.expr[":"][fullName.toLowerCase()] = function(elem) {
      return !!$.data(elem, fullName);
    };

    $[namespace] = $[namespace] || {};
    existingConstructor = $[namespace][name];
    constructor = $[namespace][name] = function(options, element) {
      // allow instantiation without "new" keyword
      if (!this._createWidget) {
        return new constructor(options, element);
      }

      // allow instantiation without initializing for simple inheritance
      // must use "new" keyword (the code above always passes args)
      if (arguments.length) {
        this._createWidget(options, element);
      }
    };
    // extend with the existing constructor to carry over any static properties
    $.extend(constructor, existingConstructor, {
      version: prototype.version,
      // copy the object used to create the prototype in case we need to
      // redefine the widget later
      _proto: $.extend({}, prototype),
      // track widgets that inherit from this widget in case this widget is
      // redefined after a widget inherits from it
      _childConstructors: []
    });

    basePrototype = new base();
    // we need to make the options hash a property directly on the new instance
    // otherwise we'll modify the options hash on the prototype that we're
    // inheriting from
    basePrototype.options = $.widget.extend({}, basePrototype.options);
    $.each(prototype, function(prop, value) {
      if (!$.isFunction(value)) {
        proxiedPrototype[prop] = value;
        return;
      }
      proxiedPrototype[prop] = (function() {
        var _super = function() {
            return base.prototype[prop].apply(this, arguments);
          },
          _superApply = function(args) {
            return base.prototype[prop].apply(this, args);
          };
        return function() {
          var __super = this._super,
            __superApply = this._superApply,
            returnValue;

          this._super = _super;
          this._superApply = _superApply;

          returnValue = value.apply(this, arguments);

          this._super = __super;
          this._superApply = __superApply;

          return returnValue;
        };
      })();
    });
    constructor.prototype = $.widget.extend(basePrototype, {
      // TODO: remove support for widgetEventPrefix
      // always use the name + a colon as the prefix, e.g., draggable:start
      // don't prefix for widgets that aren't DOM-based
      widgetEventPrefix: existingConstructor ? basePrototype.widgetEventPrefix : name
    }, proxiedPrototype, {
      constructor: constructor,
      namespace: namespace,
      widgetName: name,
      widgetFullName: fullName
    });

    // If this widget is being redefined then we need to find all widgets that
    // are inheriting from it and redefine all of them so that they inherit from
    // the new version of this widget. We're essentially trying to replace one
    // level in the prototype chain.
    if (existingConstructor) {
      $.each(existingConstructor._childConstructors, function(i, child) {
        var childPrototype = child.prototype;

        // redefine the child widget using the same prototype that was
        // originally used, but inherit from the new version of the base
        $.widget(childPrototype.namespace + "." + childPrototype.widgetName, constructor, child._proto);
      });
      // remove the list of existing child constructors from the old constructor
      // so the old child constructors can be garbage collected
      delete existingConstructor._childConstructors;
    } else {
      base._childConstructors.push(constructor);
    }

    $.widget.bridge(name, constructor);
  };

  $.widget.extend = function(target) {
    var input = slice.call(arguments, 1),
      inputIndex = 0,
      inputLength = input.length,
      key,
      value;
    for (; inputIndex < inputLength; inputIndex++) {
      for (key in input[inputIndex]) {
        value = input[inputIndex][key];
        if (input[inputIndex].hasOwnProperty(key) && value !== undefined) {
          // Clone objects
          if ($.isPlainObject(value)) {
            target[key] = $.isPlainObject(target[key]) ?
              $.widget.extend({}, target[key], value) :
              // Don't extend strings, arrays, etc. with objects
              $.widget.extend({}, value);
            // Copy everything else by reference
          } else {
            target[key] = value;
          }
        }
      }
    }
    return target;
  };

  $.widget.bridge = function(name, object) {
    var fullName = object.prototype.widgetFullName || name;
    $.fn[name] = function(options) {
      var isMethodCall = typeof options === "string",
        args = slice.call(arguments, 1),
        returnValue = this;

      // allow multiple hashes to be passed on init
      options = !isMethodCall && args.length ?
        $.widget.extend.apply(null, [options].concat(args)) :
        options;

      if (isMethodCall) {
        this.each(function() {
          var methodValue,
            instance = $.data(this, fullName);
          if (!instance) {
            return $.error("cannot call methods on " + name + " prior to initialization; " +
              "attempted to call method '" + options + "'");
          }
          if (!$.isFunction(instance[options]) || options.charAt(0) === "_") {
            return $.error("no such method '" + options + "' for " + name + " widget instance");
          }
          methodValue = instance[options].apply(instance, args);
          if (methodValue !== instance && methodValue !== undefined) {
            returnValue = methodValue && methodValue.jquery ?
              returnValue.pushStack(methodValue.get()) :
              methodValue;
            return false;
          }
        });
      } else {
        this.each(function() {
          var instance = $.data(this, fullName);
          if (instance) {
            instance.option(options || {})._init();
          } else {
            $.data(this, fullName, new object(options, this));
          }
        });
      }

      return returnValue;
    };
  };

  $.Widget = function( /* options, element */ ) {};
  $.Widget._childConstructors = [];

  $.Widget.prototype = {
    widgetName: "widget",
    widgetEventPrefix: "",
    defaultElement: "<div>",
    options: {
      disabled: false,

      // callbacks
      create: null
    },
    _createWidget: function(options, element) {
      element = $(element || this.defaultElement || this)[0];
      this.element = $(element);
      this.uuid = uuid++;
      this.eventNamespace = "." + this.widgetName + this.uuid;
      this.options = $.widget.extend({},
        this.options,
        this._getCreateOptions(),
        options);

      this.bindings = $();
      this.hoverable = $();
      this.focusable = $();

      if (element !== this) {
        $.data(element, this.widgetFullName, this);
        this._on(true, this.element, {
          remove: function(event) {
            if (event.target === element) {
              this.destroy();
            }
          }
        });
        this.document = $(element.style ?
          // element within the document
          element.ownerDocument :
          // element is window or document
          element.document || element);
        this.window = $(this.document[0].defaultView || this.document[0].parentWindow);
      }

      this._create();
      this._trigger("create", null, this._getCreateEventData());
      this._init();
    },
    _getCreateOptions: $.noop,
    _getCreateEventData: $.noop,
    _create: $.noop,
    _init: $.noop,

    destroy: function() {
      this._destroy();
      // we can probably remove the unbind calls in 2.0
      // all event bindings should go through this._on()
      this.element
        .unbind(this.eventNamespace)
        // 1.9 BC for #7810
        // TODO remove dual storage
        .removeData(this.widgetName)
        .removeData(this.widgetFullName)
        // support: jquery <1.6.3
        // http://bugs.jquery.com/ticket/9413
        .removeData($.camelCase(this.widgetFullName));
      this.widget()
        .unbind(this.eventNamespace)
        .removeAttr("aria-disabled")
        .removeClass(
          this.widgetFullName + "-disabled " +
          "ui-state-disabled");

      // clean up events and states
      this.bindings.unbind(this.eventNamespace);
      this.hoverable.removeClass("ui-state-hover");
      this.focusable.removeClass("ui-state-focus");
    },
    _destroy: $.noop,

    widget: function() {
      return this.element;
    },

    option: function(key, value) {
      var options = key,
        parts,
        curOption,
        i;

      if (arguments.length === 0) {
        // don't return a reference to the internal hash
        return $.widget.extend({}, this.options);
      }

      if (typeof key === "string") {
        // handle nested keys, e.g., "foo.bar" => { foo: { bar: ___ } }
        options = {};
        parts = key.split(".");
        key = parts.shift();
        if (parts.length) {
          curOption = options[key] = $.widget.extend({}, this.options[key]);
          for (i = 0; i < parts.length - 1; i++) {
            curOption[parts[i]] = curOption[parts[i]] || {};
            curOption = curOption[parts[i]];
          }
          key = parts.pop();
          if (value === undefined) {
            return curOption[key] === undefined ? null : curOption[key];
          }
          curOption[key] = value;
        } else {
          if (value === undefined) {
            return this.options[key] === undefined ? null : this.options[key];
          }
          options[key] = value;
        }
      }

      this._setOptions(options);

      return this;
    },
    _setOptions: function(options) {
      var key;

      for (key in options) {
        this._setOption(key, options[key]);
      }

      return this;
    },
    _setOption: function(key, value) {
      this.options[key] = value;

      if (key === "disabled") {
        this.widget()
          .toggleClass(this.widgetFullName + "-disabled ui-state-disabled", !!value)
          .attr("aria-disabled", value);
        this.hoverable.removeClass("ui-state-hover");
        this.focusable.removeClass("ui-state-focus");
      }

      return this;
    },

    enable: function() {
      return this._setOption("disabled", false);
    },
    disable: function() {
      return this._setOption("disabled", true);
    },

    _on: function(suppressDisabledCheck, element, handlers) {
      var delegateElement,
        instance = this;

      // no suppressDisabledCheck flag, shuffle arguments
      if (typeof suppressDisabledCheck !== "boolean") {
        handlers = element;
        element = suppressDisabledCheck;
        suppressDisabledCheck = false;
      }

      // no element argument, shuffle and use this.element
      if (!handlers) {
        handlers = element;
        element = this.element;
        delegateElement = this.widget();
      } else {
        // accept selectors, DOM elements
        element = delegateElement = $(element);
        this.bindings = this.bindings.add(element);
      }

      $.each(handlers, function(event, handler) {
        function handlerProxy() {
          // allow widgets to customize the disabled handling
          // - disabled as an array instead of boolean
          // - disabled class as method for disabling individual parts
          if (!suppressDisabledCheck &&
            (instance.options.disabled === true ||
              $(this).hasClass("ui-state-disabled"))) {
            return;
          }
          return (typeof handler === "string" ? instance[handler] : handler)
            .apply(instance, arguments);
        }

        // copy the guid so direct unbinding works
        if (typeof handler !== "string") {
          handlerProxy.guid = handler.guid =
            handler.guid || handlerProxy.guid || $.guid++;
        }

        var match = event.match(/^(\w+)\s*(.*)$/),
          eventName = match[1] + instance.eventNamespace,
          selector = match[2];
        if (selector) {
          delegateElement.delegate(selector, eventName, handlerProxy);
        } else {
          element.bind(eventName, handlerProxy);
        }
      });
    },

    _off: function(element, eventName) {
      eventName = (eventName || "").split(" ").join(this.eventNamespace + " ") + this.eventNamespace;
      element.unbind(eventName).undelegate(eventName);
    },

    _delay: function(handler, delay) {
      function handlerProxy() {
        return (typeof handler === "string" ? instance[handler] : handler)
          .apply(instance, arguments);
      }
      var instance = this;
      return setTimeout(handlerProxy, delay || 0);
    },

    _hoverable: function(element) {
      this.hoverable = this.hoverable.add(element);
      this._on(element, {
        mouseenter: function(event) {
          $(event.currentTarget).addClass("ui-state-hover");
        },
        mouseleave: function(event) {
          $(event.currentTarget).removeClass("ui-state-hover");
        }
      });
    },

    _focusable: function(element) {
      this.focusable = this.focusable.add(element);
      this._on(element, {
        focusin: function(event) {
          $(event.currentTarget).addClass("ui-state-focus");
        },
        focusout: function(event) {
          $(event.currentTarget).removeClass("ui-state-focus");
        }
      });
    },

    _trigger: function(type, event, data) {
      var prop, orig,
        callback = this.options[type];

      data = data || {};
      event = $.Event(event);
      event.type = (type === this.widgetEventPrefix ?
        type :
        this.widgetEventPrefix + type).toLowerCase();
      // the original event may come from any element
      // so we need to reset the target on the new event
      event.target = this.element[0];

      // copy original event properties over to the new event
      orig = event.originalEvent;
      if (orig) {
        for (prop in orig) {
          if (!(prop in event)) {
            event[prop] = orig[prop];
          }
        }
      }

      this.element.trigger(event, data);
      return !($.isFunction(callback) &&
        callback.apply(this.element[0], [event].concat(data)) === false ||
        event.isDefaultPrevented());
    }
  };

  $.each({
    show: "fadeIn",
    hide: "fadeOut"
  }, function(method, defaultEffect) {
    $.Widget.prototype["_" + method] = function(element, options, callback) {
      if (typeof options === "string") {
        options = {
          effect: options
        };
      }
      var hasOptions,
        effectName = !options ?
        method :
        options === true || typeof options === "number" ?
        defaultEffect :
        options.effect || defaultEffect;
      options = options || {};
      if (typeof options === "number") {
        options = {
          duration: options
        };
      }
      hasOptions = !$.isEmptyObject(options);
      options.complete = callback;
      if (options.delay) {
        element.delay(options.delay);
      }
      if (hasOptions && $.effects && $.effects.effect[effectName]) {
        element[method](options);
      } else if (effectName !== method && element[effectName]) {
        element[effectName](options.duration, options.easing, callback);
      } else {
        element.queue(function(next) {
          $(this)[method]();
          if (callback) {
            callback.call(element[0]);
          }
          next();
        });
      }
    };
  });

})(jQuery);
(function($, undefined) {

  var mouseHandled = false;
  $(document).mouseup(function() {
    mouseHandled = false;
  });

  $.widget("ui.mouse", {
    version: "1.10.2",
    options: {
      cancel: "input,textarea,button,select,option",
      distance: 1,
      delay: 0
    },
    _mouseInit: function() {
      var that = this;

      this.element
        .bind("mousedown." + this.widgetName, function(event) {
          return that._mouseDown(event);
        })
        .bind("click." + this.widgetName, function(event) {
          if (true === $.data(event.target, that.widgetName + ".preventClickEvent")) {
            $.removeData(event.target, that.widgetName + ".preventClickEvent");
            event.stopImmediatePropagation();
            return false;
      $.ui.ie    }
        });

      this.started = false;
    },

    // TODO: make sure destroying one instance of mouse doesn't mess with
    // other instances of mouse
    _mouseDestroy: function() {
      this.element.unbind("." + this.widgetName);
      if (this._mouseMoveDelegate) {
        $(document)
          .unbind("mousemove." + this.widgetName, this._mouseMoveDelegate)
          .unbind("mouseup." + this.widgetName, this._mouseUpDelegate);
      }
    },

    _mouseDown: function(event) {
      // don't let more than one widget handle mouseStart
      if (mouseHandled) {
        return;
      }

      // we may have missed mouseup (out of window)
      (this._mouseStarted && this._mouseUp(event));

      this._mouseDownEvent = event;

      var that = this,
        btnIsLeft = (event.which === 1),
        // event.target.nodeName works around a bug in IE 8 with
        // disabled inputs (#7620)
        elIsCancel = (typeof this.options.cancel === "string" && event.target.nodeName ? $(event.target).closest(this.options.cancel).length : false);
      if (!btnIsLeft || elIsCancel || !this._mouseCapture(event)) {
        return true;
      }

      this.mouseDelayMet = !this.options.delay;
      if (!this.mouseDelayMet) {
        this._mouseDelayTimer = setTimeout(function() {
          that.mouseDelayMet = true;
        }, this.options.delay);
      }

      if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
        this._mouseStarted = (this._mouseStart(event) !== false);
        if (!this._mouseStarted) {
          event.preventDefault();
          return true;
        }
      }

      // Click event may never have fired (Gecko & Opera)
      if (true === $.data(event.target, this.widgetName + ".preventClickEvent")) {
        $.removeData(event.target, this.widgetName + ".preventClickEvent");
      }

      // these delegates are required to keep context
      this._mouseMoveDelegate = function(event) {
        return that._mouseMove(event);
      };
      this._mouseUpDelegate = function(event) {
        return that._mouseUp(event);
      };
      $(document)
        .bind("mousemove." + this.widgetName, this._mouseMoveDelegate)
        .bind("mouseup." + this.widgetName, this._mouseUpDelegate);

      event.preventDefault();

      mouseHandled = true;
      return true;
    },

    _mouseMove: function(event) {
      // IE mouseup check - mouseup happened when mouse was out of window
      if ($.ui.ie && (!document.documentMode || document.documentMode < 9) && !event.button) {
        return this._mouseUp(event);
      }

      if (this._mouseStarted) {
        this._mouseDrag(event);
        return event.preventDefault();
      }

      if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
        this._mouseStarted =
          (this._mouseStart(this._mouseDownEvent, event) !== false);
        (this._mouseStarted ? this._mouseDrag(event) : this._mouseUp(event));
      }

      return !this._mouseStarted;
    },

    _mouseUp: function(event) {
      $(document)
        .unbind("mousemove." + this.widgetName, this._mouseMoveDelegate)
        .unbind("mouseup." + this.widgetName, this._mouseUpDelegate);

      if (this._mouseStarted) {
        this._mouseStarted = false;

        if (event.target === this._mouseDownEvent.target) {
          $.data(event.target, this.widgetName + ".preventClickEvent", true);
        }

        this._mouseStop(event);
      }

      return false;
    },

    _mouseDistanceMet: function(event) {
      return (Math.max(
        Math.abs(this._mouseDownEvent.pageX - event.pageX),
        Math.abs(this._mouseDownEvent.pageY - event.pageY)
      ) >= this.options.distance);
    },

    _mouseDelayMet: function( /* event */ ) {
      return this.mouseDelayMet;
    },

    // These are placeholder methods, to be overriden by extending plugin
    _mouseStart: function( /* event */ ) {},
    _mouseDrag: function( /* event */ ) {},
    _mouseStop: function( /* event */ ) {},
    _mouseCapture: function( /* event */ ) {
      return true;
    }
  });

})(jQuery);
(function($, undefined) {

  // number of pages in a slider
  // (how many times can you page up/down to go through the whole range)
  var numPages = 5;

  $.widget("ui.slider", $.ui.mouse, {
    version: "1.10.2",
    widgetEventPrefix: "slide",

    options: {
      animate: false,
      distance: 0,
      max: 100,
      min: 0,
      orientation: "horizontal",
      range: false,
      step: 1,
      value: 0,
      values: null,

      // callbacks
      change: null,
      slide: null,
      start: null,
      stop: null
    },

    _create: function() {
      this._keySliding = false;
      this._mouseSliding = false;
      this._animateOff = true;
      this._handleIndex = null;
      this._detectOrientation();
      this._mouseInit();

      this.element
        .addClass("ui-slider" +
          " ui-slider-" + this.orientation +
          " ui-widget" +
          " ui-widget-content" +
          " ui-corner-all");

      this._refresh();
      this._setOption("disabled", this.options.disabled);

      this._animateOff = false;
    },

    _refresh: function() {
      this._createRange();
      this._createHandles();
      this._setupEvents();
      this._refreshValue();
    },

    _createHandles: function() {
      var i, handleCount,
        options = this.options,
        existingHandles = this.element.find(".ui-slider-handle").addClass("ui-state-default ui-corner-all"),
        handle = "<a class='ui-slider-handle ui-state-default ui-corner-all' href='#'></a>",
        handles = [];

      handleCount = (options.values && options.values.length) || 1;

      if (existingHandles.length > handleCount) {
        existingHandles.slice(handleCount).remove();
        existingHandles = existingHandles.slice(0, handleCount);
      }

      for (i = existingHandles.length; i < handleCount; i++) {
        handles.push(handle);
      }

      this.handles = existingHandles.add($(handles.join("")).appendTo(this.element));

      this.handle = this.handles.eq(0);

      this.handles.each(function(i) {
        $(this).data("ui-slider-handle-index", i);
      });
    },

    _createRange: function() {
      var options = this.options,
        classes = "";

      if (options.range) {
        if (options.range === true) {
          if (!options.values) {
            options.values = [this._valueMin(), this._valueMin()];
          } else if (options.values.length && options.values.length !== 2) {
            options.values = [options.values[0], options.values[0]];
          } else if ($.isArray(options.values)) {
            options.values = options.values.slice(0);
          }
        }

        if (!this.range || !this.range.length) {
          this.range = $("<div></div>")
            .appendTo(this.element);

          classes = "ui-slider-range" +
            // note: this isn't the most fittingly semantic framework class for this element,
            // but worked best visually with a variety of themes
            " ui-widget-header ui-corner-all";
        } else {
          this.range.removeClass("ui-slider-range-min ui-slider-range-max")
            // Handle range switching from true to min/max
            .css({
              "left": "",
              "bottom": ""
            });
        }

        this.range.addClass(classes +
          ((options.range === "min" || options.range === "max") ? " ui-slider-range-" + options.range : ""));
      } else {
        this.range = $([]);
      }
    },

    _setupEvents: function() {
      var elements = this.handles.add(this.range).filter("a");
      this._off(elements);
      this._on(elements, this._handleEvents);
      this._hoverable(elements);
      this._focusable(elements);
    },

    _destroy: function() {
      this.handles.remove();
      this.range.remove();

      this.element
        .removeClass("ui-slider" +
          " ui-slider-horizontal" +
          " ui-slider-vertical" +
          " ui-widget" +
          " ui-widget-content" +
          " ui-corner-all");

      this._mouseDestroy();
    },

    _mouseCapture: function(event) {
      var position, normValue, distance, closestHandle, index, allowed, offset, mouseOverHandle,
        that = this,
        o = this.options;

      if (o.disabled) {
        return false;
      }

      this.elementSize = {
        width: this.element.outerWidth(),
        height: this.element.outerHeight()
      };
      this.elementOffset = this.element.offset();

      position = {
        x: event.pageX,
        y: event.pageY
      };
      normValue = this._normValueFromMouse(position);
      distance = this._valueMax() - this._valueMin() + 1;
      this.handles.each(function(i) {
        var thisDistance = Math.abs(normValue - that.values(i));
        if ((distance > thisDistance) ||
          (distance === thisDistance &&
            (i === that._lastChangedValue || that.values(i) === o.min))) {
          distance = thisDistance;
          closestHandle = $(this);
          index = i;
        }
      });

      allowed = this._start(event, index);
      if (allowed === false) {
        return false;
      }
      this._mouseSliding = true;

      this._handleIndex = index;

      closestHandle
        .addClass("ui-state-active")
        .focus();

      offset = closestHandle.offset();
      mouseOverHandle = !$(event.target).parents().addBack().is(".ui-slider-handle");
      this._clickOffset = mouseOverHandle ? {
        left: 0,
        top: 0
      } : {
        left: event.pageX - offset.left - (closestHandle.width() / 2),
        top: event.pageY - offset.top -
          (closestHandle.height() / 2) -
          (parseInt(closestHandle.css("borderTopWidth"), 10) || 0) -
          (parseInt(closestHandle.css("borderBottomWidth"), 10) || 0) +
          (parseInt(closestHandle.css("marginTop"), 10) || 0)
      };

      if (!this.handles.hasClass("ui-state-hover")) {
        this._slide(event, index, normValue);
      }
      this._animateOff = true;
      return true;
    },

    _mouseStart: function() {
      return true;
    },

    _mouseDrag: function(event) {
      var position = {
          x: event.pageX,
          y: event.pageY
        },
        normValue = this._normValueFromMouse(position);

      this._slide(event, this._handleIndex, normValue);

      return false;
    },

    _mouseStop: function(event) {
      this.handles.removeClass("ui-state-active");
      this._mouseSliding = false;

      this._stop(event, this._handleIndex);
      this._change(event, this._handleIndex);

      this._handleIndex = null;
      this._clickOffset = null;
      this._animateOff = false;

      return false;
    },

    _detectOrientation: function() {
      this.orientation = (this.options.orientation === "vertical") ? "vertical" : "horizontal";
    },

    _normValueFromMouse: function(position) {
      var pixelTotal,
        pixelMouse,
        percentMouse,
        valueTotal,
        valueMouse;

      if (this.orientation === "horizontal") {
        pixelTotal = this.elementSize.width;
        pixelMouse = position.x - this.elementOffset.left - (this._clickOffset ? this._clickOffset.left : 0);
      } else {
        pixelTotal = this.elementSize.height;
        pixelMouse = position.y - this.elementOffset.top - (this._clickOffset ? this._clickOffset.top : 0);
      }

      percentMouse = (pixelMouse / pixelTotal);
      if (percentMouse > 1) {
        percentMouse = 1;
      }
      if (percentMouse < 0) {
        percentMouse = 0;
      }
      if (this.orientation === "vertical") {
        percentMouse = 1 - percentMouse;
      }

      valueTotal = this._valueMax() - this._valueMin();
      valueMouse = this._valueMin() + percentMouse * valueTotal;

      return this._trimAlignValue(valueMouse);
    },

    _start: function(event, index) {
      var uiHash = {
        handle: this.handles[index],
        value: this.value()
      };
      if (this.options.values && this.options.values.length) {
        uiHash.value = this.values(index);
        uiHash.values = this.values();
      }
      return this._trigger("start", event, uiHash);
    },

    _slide: function(event, index, newVal) {
      var otherVal,
        newValues,
        allowed;

      if (this.options.values && this.options.values.length) {
        otherVal = this.values(index ? 0 : 1);

        if ((this.options.values.length === 2 && this.options.range === true) &&
          ((index === 0 && newVal > otherVal) || (index === 1 && newVal < otherVal))
        ) {
          newVal = otherVal;
        }

        if (newVal !== this.values(index)) {
          newValues = this.values();
          newValues[index] = newVal;
          // A slide can be canceled by returning false from the slide callback
          allowed = this._trigger("slide", event, {
            handle: this.handles[index],
            value: newVal,
            values: newValues
          });
          otherVal = this.values(index ? 0 : 1);
          if (allowed !== false) {
            this.values(index, newVal, true);
          }
        }
      } else {
        if (newVal !== this.value()) {
          // A slide can be canceled by returning false from the slide callback
          allowed = this._trigger("slide", event, {
            handle: this.handles[index],
            value: newVal
          });
          if (allowed !== false) {
            this.value(newVal);
          }
        }
      }
    },

    _stop: function(event, index) {
      var uiHash = {
        handle: this.handles[index],
        value: this.value()
      };
      if (this.options.values && this.options.values.length) {
        uiHash.value = this.values(index);
        uiHash.values = this.values();
      }

      this._trigger("stop", event, uiHash);
    },

    _change: function(event, index) {
      if (!this._keySliding && !this._mouseSliding) {
        var uiHash = {
          handle: this.handles[index],
          value: this.value()
        };
        if (this.options.values && this.options.values.length) {
          uiHash.value = this.values(index);
          uiHash.values = this.values();
        }

        //store the last changed value index for reference when handles overlap
        this._lastChangedValue = index;

        this._trigger("change", event, uiHash);
      }
    },

    value: function(newValue) {
      if (arguments.length) {
        this.options.value = this._trimAlignValue(newValue);
        this._refreshValue();
        this._change(null, 0);
        return;
      }

      return this._value();
    },

    values: function(index, newValue) {
      var vals,
        newValues,
        i;

      if (arguments.length > 1) {
        this.options.values[index] = this._trimAlignValue(newValue);
        this._refreshValue();
        this._change(null, index);
        return;
      }

      if (arguments.length) {
        if ($.isArray(arguments[0])) {
          vals = this.options.values;
          newValues = arguments[0];
          for (i = 0; i < vals.length; i += 1) {
            vals[i] = this._trimAlignValue(newValues[i]);
            this._change(null, i);
          }
          this._refreshValue();
        } else {
          if (this.options.values && this.options.values.length) {
            return this._values(index);
          } else {
            return this.value();
          }
        }
      } else {
        return this._values();
      }
    },

    _setOption: function(key, value) {
      var i,
        valsLength = 0;

      if (key === "range" && this.options.range === true) {
        if (value === "min") {
          this.options.value = this._values(0);
          this.options.values = null;
        } else if (value === "max") {
          this.options.value = this._values(this.options.values.length - 1);
          this.options.values = null;
        }
      }

      if ($.isArray(this.options.values)) {
        valsLength = this.options.values.length;
      }

      $.Widget.prototype._setOption.apply(this, arguments);

      switch (key) {
        case "orientation":
          this._detectOrientation();
          this.element
            .removeClass("ui-slider-horizontal ui-slider-vertical")
            .addClass("ui-slider-" + this.orientation);
          this._refreshValue();
          break;
        case "value":
          this._animateOff = true;
          this._refreshValue();
          this._change(null, 0);
          this._animateOff = false;
          break;
        case "values":
          this._animateOff = true;
          this._refreshValue();
          for (i = 0; i < valsLength; i += 1) {
            this._change(null, i);
          }
          this._animateOff = false;
          break;
        case "min":
        case "max":
          this._animateOff = true;
          this._refreshValue();
          this._animateOff = false;
          break;
        case "range":
          this._animateOff = true;
          this._refresh();
          this._animateOff = false;
          break;
      }
    },

    //internal value getter
    // _value() returns value trimmed by min and max, aligned by step
    _value: function() {
      var val = this.options.value;
      val = this._trimAlignValue(val);

      return val;
    },

    //internal values getter
    // _values() returns array of values trimmed by min and max, aligned by step
    // _values( index ) returns single value trimmed by min and max, aligned by step
    _values: function(index) {
      var val,
        vals,
        i;

      if (arguments.length) {
        val = this.options.values[index];
        val = this._trimAlignValue(val);

        return val;
      } else if (this.options.values && this.options.values.length) {
        // .slice() creates a copy of the array
        // this copy gets trimmed by min and max and then returned
        vals = this.options.values.slice();
        for (i = 0; i < vals.length; i += 1) {
          vals[i] = this._trimAlignValue(vals[i]);
        }

        return vals;
      } else {
        return [];
      }
    },

    // returns the step-aligned value that val is closest to, between (inclusive) min and max
    _trimAlignValue: function(val) {
      if (val <= this._valueMin()) {
        return this._valueMin();
      }
      if (val >= this._valueMax()) {
        return this._valueMax();
      }
      var step = (this.options.step > 0) ? this.options.step : 1,
        valModStep = (val - this._valueMin()) % step,
        alignValue = val - valModStep;

      if (Math.abs(valModStep) * 2 >= step) {
        alignValue += (valModStep > 0) ? step : (-step);
      }

      // Since JavaScript has problems with large floats, round
      // the final value to 5 digits after the decimal point (see #4124)
      return parseFloat(alignValue.toFixed(5));
    },

    _valueMin: function() {
      return this.options.min;
    },

    _valueMax: function() {
      return this.options.max;
    },

    _refreshValue: function() {
      var lastValPercent, valPercent, value, valueMin, valueMax,
        oRange = this.options.range,
        o = this.options,
        that = this,
        animate = (!this._animateOff) ? o.animate : false,
        _set = {};

      if (this.options.values && this.options.values.length) {
        this.handles.each(function(i) {
          valPercent = (that.values(i) - that._valueMin()) / (that._valueMax() - that._valueMin()) * 100;
          _set[that.orientation === "horizontal" ? "left" : "bottom"] = valPercent + "%";
          $(this).stop(1, 1)[animate ? "animate" : "css"](_set, o.animate);
          if (that.options.range === true) {
            if (that.orientation === "horizontal") {
              if (i === 0) {
                that.range.stop(1, 1)[animate ? "animate" : "css"]({
                  left: valPercent + "%"
                }, o.animate);
              }
              if (i === 1) {
                that.range[animate ? "animate" : "css"]({
                  width: (valPercent - lastValPercent) + "%"
                }, {
                  queue: false,
                  duration: o.animate
                });
              }
            } else {
              if (i === 0) {
                that.range.stop(1, 1)[animate ? "animate" : "css"]({
                  bottom: (valPercent) + "%"
                }, o.animate);
              }
              if (i === 1) {
                that.range[animate ? "animate" : "css"]({
                  height: (valPercent - lastValPercent) + "%"
                }, {
                  queue: false,
                  duration: o.animate
                });
              }
            }
          }
          lastValPercent = valPercent;
        });
      } else {
        value = this.value();
        valueMin = this._valueMin();
        valueMax = this._valueMax();
        valPercent = (valueMax !== valueMin) ?
          (value - valueMin) / (valueMax - valueMin) * 100 :
          0;
        _set[this.orientation === "horizontal" ? "left" : "bottom"] = valPercent + "%";
        this.handle.stop(1, 1)[animate ? "animate" : "css"](_set, o.animate);

        if (oRange === "min" && this.orientation === "horizontal") {
          this.range.stop(1, 1)[animate ? "animate" : "css"]({
            width: valPercent + "%"
          }, o.animate);
        }
        if (oRange === "max" && this.orientation === "horizontal") {
          this.range[animate ? "animate" : "css"]({
            width: (100 - valPercent) + "%"
          }, {
            queue: false,
            duration: o.animate
          });
        }
        if (oRange === "min" && this.orientation === "vertical") {
          this.range.stop(1, 1)[animate ? "animate" : "css"]({
            height: valPercent + "%"
          }, o.animate);
        }
        if (oRange === "max" && this.orientation === "vertical") {
          this.range[animate ? "animate" : "css"]({
            height: (100 - valPercent) + "%"
          }, {
            queue: false,
            duration: o.animate
          });
        }
      }
    },

    _handleEvents: {
      keydown: function(event) {
        /*jshint maxcomplexity:25*/
        var allowed, curVal, newVal, step,
          index = $(event.target).data("ui-slider-handle-index");

        switch (event.keyCode) {
          case $.ui.keyCode.HOME:
          case $.ui.keyCode.END:
          case $.ui.keyCode.PAGE_UP:
          case $.ui.keyCode.PAGE_DOWN:
          case $.ui.keyCode.UP:
          case $.ui.keyCode.RIGHT:
          case $.ui.keyCode.DOWN:
          case $.ui.keyCode.LEFT:
            event.preventDefault();
            if (!this._keySliding) {
              this._keySliding = true;
              $(event.target).addClass("ui-state-active");
              allowed = this._start(event, index);
              if (allowed === false) {
                return;
              }
            }
            break;
        }

        step = this.options.step;
        if (this.options.values && this.options.values.length) {
          curVal = newVal = this.values(index);
        } else {
          curVal = newVal = this.value();
        }

        switch (event.keyCode) {
          case $.ui.keyCode.HOME:
            newVal = this._valueMin();
            break;
          case $.ui.keyCode.END:
            newVal = this._valueMax();
            break;
          case $.ui.keyCode.PAGE_UP:
            newVal = this._trimAlignValue(curVal + ((this._valueMax() - this._valueMin()) / numPages));
            break;
          case $.ui.keyCode.PAGE_DOWN:
            newVal = this._trimAlignValue(curVal - ((this._valueMax() - this._valueMin()) / numPages));
            break;
          case $.ui.keyCode.UP:
          case $.ui.keyCode.RIGHT:
            if (curVal === this._valueMax()) {
              return;
            }
            newVal = this._trimAlignValue(curVal + step);
            break;
          case $.ui.keyCode.DOWN:
          case $.ui.keyCode.LEFT:
            if (curVal === this._valueMin()) {
              return;
            }
            newVal = this._trimAlignValue(curVal - step);
            break;
        }

        this._slide(event, index, newVal);
      },
      click: function(event) {
        event.preventDefault();
      },
      keyup: function(event) {
        var index = $(event.target).data("ui-slider-handle-index");

        if (this._keySliding) {
          this._keySliding = false;
          this._stop(event, index);
          this._change(event, index);
          $(event.target).removeClass("ui-state-active");
        }
      }
    }

  });

}(jQuery));
/**
 *    The Nomensa accessible media player is a flexible multimedia solution for websites and intranets.
 *    The core player consists of JavaScript wrapper responsible for generating an accessible HTML toolbar
 *    for interacting with a media player of your choice. We currently provide support for YouTube (default),
 *    Vimeo and JWPlayer although it should be possible to integrate the player with almost any media player on
 *    the web (provided a JavaScript api for the player in question is available).
 *
 *    Copyright (C) 2013  Nomensa Ltd
 *
 *    Version 2.1.2
 *
 *    This program is free software: you can redistribute it and/or modify
 *    it under the terms of the GNU General Public License as published by
 *    the Free Software Foundation, either version 3 of the License, or
 *    (at your option) any later version.
 *
 *    This program is distributed in the hope that it will be useful,
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *    GNU General Public License for more details.
 *
 *    You should have received a copy of the GNU General Public License
 *    along with this program.  If not, see <http://www.gnu.org/licenses/>.
 **/
var swfobject = function() {
  var aq = "undefined",
    aD = "object",
    ab = "Shockwave Flash",
    X = "ShockwaveFlash.ShockwaveFlash",
    aE = "application/x-shockwave-flash",
    ac = "SWFObjectExprInst",
    ax = "onreadystatechange",
    af = window,
    aL = document,
    aB = navigator,
    aa = false,
    Z = [aN],
    aG = [],
    ag = [],
    al = [],
    aJ, ad, ap, at, ak = false,
    aU = false,
    aH, an, aI = true,
    ah = function() {
      var a = typeof aL.getElementById != aq && typeof aL.getElementsByTagName != aq && typeof aL.createElement != aq,
        e = aB.userAgent.toLowerCase(),
        c = aB.platform.toLowerCase(),
        h = c ? /win/.test(c) : /win/.test(e),
        j = c ? /mac/.test(c) : /mac/.test(e),
        g = /webkit/.test(e) ? parseFloat(e.replace(/^.*webkit\/(\d+(\.\d+)?).*$/, "$1")) : false,
        d = !+"\v1",
        f = [0, 0, 0],
        k = null;
      if (typeof aB.plugins != aq && typeof aB.plugins[ab] == aD) {
        k = aB.plugins[ab].description;
        if (k && !(typeof aB.mimeTypes != aq && aB.mimeTypes[aE] && !aB.mimeTypes[aE].enabledPlugin)) {
          aa = true;
          d = false;
          k = k.replace(/^.*\s+(\S+\s+\S+$)/, "$1");
          f[0] = parseInt(k.replace(/^(.*)\..*$/, "$1"), 10);
          f[1] = parseInt(k.replace(/^.*\.(.*)\s.*$/, "$1"), 10);
          f[2] = /[a-zA-Z]/.test(k) ? parseInt(k.replace(/^.*[a-zA-Z]+(.*)$/, "$1"), 10) : 0;
        }
      } else {
        if (typeof af.ActiveXObject != aq) {
          try {
            var i = new ActiveXObject(X);
            if (i) {
              k = i.GetVariable("$version");
              if (k) {
                d = true;
                k = k.split(" ")[1].split(",");
                f = [parseInt(k[0], 10), parseInt(k[1], 10), parseInt(k[2], 10)];
              }
            }
          } catch (b) {}
        }
      }
      return {
        w3: a,
        pv: f,
        wk: g,
        ie: d,
        win: h,
        mac: j
      };
    }(),
    aK = function() {
      if (!ah.w3) {
        return;
      }
      if ((typeof aL.readyState != aq && aL.readyState == "complete") || (typeof aL.readyState == aq && (aL.getElementsByTagName("body")[0] || aL.body))) {
        aP();
      }
      if (!ak) {
        if (typeof aL.addEventListener != aq) {
          aL.addEventListener("DOMContentLoaded", aP, false);
        }
        if (ah.ie && ah.win) {
          aL.attachEvent(ax, function() {
            if (aL.readyState == "complete") {
              aL.detachEvent(ax, arguments.callee);
              aP();
            }
          });
          if (af == top) {
            (function() {
              if (ak) {
                return;
              }
              try {
                aL.documentElement.doScroll("left");
              } catch (a) {
                setTimeout(arguments.callee, 0);
                return;
              }
              aP();
            })();
          }
        }
        if (ah.wk) {
          (function() {
            if (ak) {
              return;
            }
            if (!/loaded|complete/.test(aL.readyState)) {
              setTimeout(arguments.callee, 0);
              return;
            }
            aP();
          })();
        }
        aC(aP);
      }
    }();

  function aP() {
    if (ak) {
      return;
    }
    try {
      var b = aL.getElementsByTagName("body")[0].appendChild(ar("span"));
      b.parentNode.removeChild(b);
    } catch (a) {
      return;
    }
    ak = true;
    var d = Z.length;
    for (var c = 0; c < d; c++) {
      Z[c]();
    }
  }

  function aj(a) {
    if (ak) {
      a();
    } else {
      Z[Z.length] = a;
    }
  }

  function aC(a) {
    if (typeof af.addEventListener != aq) {
      af.addEventListener("load", a, false);
    } else {
      if (typeof aL.addEventListener != aq) {
        aL.addEventListener("load", a, false);
      } else {
        if (typeof af.attachEvent != aq) {
          aM(af, "onload", a);
        } else {
          if (typeof af.onload == "function") {
            var b = af.onload;
            af.onload = function() {
              b();
              a();
            };
          } else {
            af.onload = a;
          }
        }
      }
    }
  }

  function aN() {
    if (aa) {
      Y();
    } else {
      am();
    }
  }

  function Y() {
    var d = aL.getElementsByTagName("body")[0];
    var b = ar(aD);
    b.setAttribute("type", aE);
    var a = d.appendChild(b);
    if (a) {
      var c = 0;
      (function() {
        if (typeof a.GetVariable != aq) {
          var e = a.GetVariable("$version");
          if (e) {
            e = e.split(" ")[1].split(",");
            ah.pv = [parseInt(e[0], 10), parseInt(e[1], 10), parseInt(e[2], 10)];
          }
        } else {
          if (c < 10) {
            c++;
            setTimeout(arguments.callee, 10);
            return;
          }
        }
        d.removeChild(b);
        a = null;
        am();
      })();
    } else {
      am();
    }
  }

  function am() {
    var g = aG.length;
    if (g > 0) {
      for (var h = 0; h < g; h++) {
        var c = aG[h].id;
        var l = aG[h].callbackFn;
        var a = {
          success: false,
          id: c
        };
        if (ah.pv[0] > 0) {
          var i = aS(c);
          if (i) {
            if (ao(aG[h].swfVersion) && !(ah.wk && ah.wk < 312)) {
              ay(c, true);
              if (l) {
                a.success = true;
                a.ref = av(c);
                l(a);
              }
            } else {
              if (aG[h].expressInstall && au()) {
                var e = {};
                e.data = aG[h].expressInstall;
                e.width = i.getAttribute("width") || "0";
                e.height = i.getAttribute("height") || "0";
                if (i.getAttribute("class")) {
                  e.styleclass = i.getAttribute("class");
                }
                if (i.getAttribute("align")) {
                  e.align = i.getAttribute("align");
                }
                var f = {};
                var d = i.getElementsByTagName("param");
                var k = d.length;
                for (var j = 0; j < k; j++) {
                  if (d[j].getAttribute("name").toLowerCase() != "movie") {
                    f[d[j].getAttribute("name")] = d[j].getAttribute("value");
                  }
                }
                ae(e, f, c, l);
              } else {
                aF(i);
                if (l) {
                  l(a);
                }
              }
            }
          }
        } else {
          ay(c, true);
          if (l) {
            var b = av(c);
            if (b && typeof b.SetVariable != aq) {
              a.success = true;
              a.ref = b;
            }
            l(a);
          }
        }
      }
    }
  }

  function av(b) {
    var d = null;
    var c = aS(b);
    if (c && c.nodeName == "OBJECT") {
      if (typeof c.SetVariable != aq) {
        d = c;
      } else {
        var a = c.getElementsByTagName(aD)[0];
        if (a) {
          d = a;
        }
      }
    }
    return d;
  }

  function au() {
    return !aU && ao("6.0.65") && (ah.win || ah.mac) && !(ah.wk && ah.wk < 312);
  }

  function ae(f, d, h, e) {
    aU = true;
    ap = e || null;
    at = {
      success: false,
      id: h
    };
    var a = aS(h);
    if (a) {
      if (a.nodeName == "OBJECT") {
        aJ = aO(a);
        ad = null;
      } else {
        aJ = a;
        ad = h;
      }
      f.id = ac;
      if (typeof f.width == aq || (!/%$/.test(f.width) && parseInt(f.width, 10) < 310)) {
        f.width = "310";
      }
      if (typeof f.height == aq || (!/%$/.test(f.height) && parseInt(f.height, 10) < 137)) {
        f.height = "137";
      }
      aL.title = aL.title.slice(0, 47) + " - Flash Player Installation";
      var b = ah.ie && ah.win ? "ActiveX" : "PlugIn",
        c = "MMredirectURL=" + af.location.toString().replace(/&/g, "%26") + "&MMplayerType=" + b + "&MMdoctitle=" + aL.title;
      if (typeof d.flashvars != aq) {
        d.flashvars += "&" + c;
      } else {
        d.flashvars = c;
      }
      if (ah.ie && ah.win && a.readyState != 4) {
        var g = ar("div");
        h += "SWFObjectNew";
        g.setAttribute("id", h);
        a.parentNode.insertBefore(g, a);
        a.style.display = "none";
        (function() {
          if (a.readyState == 4) {
            a.parentNode.removeChild(a);
          } else {
            setTimeout(arguments.callee, 10);
          }
        })();
      }
      aA(f, d, h);
    }
  }

  function aF(a) {
    if (ah.ie && ah.win && a.readyState != 4) {
      var b = ar("div");
      a.parentNode.insertBefore(b, a);
      b.parentNode.replaceChild(aO(a), b);
      a.style.display = "none";
      (function() {
        if (a.readyState == 4) {
          a.parentNode.removeChild(a);
        } else {
          setTimeout(arguments.callee, 10);
        }
      })();
    } else {
      a.parentNode.replaceChild(aO(a), a);
    }
  }

  function aO(b) {
    var d = ar("div");
    if (ah.win && ah.ie) {
      d.innerHTML = b.innerHTML;
    } else {
      var e = b.getElementsByTagName(aD)[0];
      if (e) {
        var a = e.childNodes;
        if (a) {
          var f = a.length;
          for (var c = 0; c < f; c++) {
            if (!(a[c].nodeType == 1 && a[c].nodeName == "PARAM") && !(a[c].nodeType == 8)) {
              d.appendChild(a[c].cloneNode(true));
            }
          }
        }
      }
    }
    return d;
  }

  function aA(e, g, c) {
    var d, a = aS(c);
    if (ah.wk && ah.wk < 312) {
      return d;
    }
    if (a) {
      if (typeof e.id == aq) {
        e.id = c;
      }
      if (ah.ie && ah.win) {
        var f = "";
        for (var i in e) {
          if (e[i] != Object.prototype[i]) {
            if (i.toLowerCase() == "data") {
              g.movie = e[i];
            } else {
              if (i.toLowerCase() == "styleclass") {
                f += ' class="' + e[i] + '"';
              } else {
                if (i.toLowerCase() != "classid") {
                  f += " " + i + '="' + e[i] + '"';
                }
              }
            }
          }
        }
        var h = "";
        for (var j in g) {
          if (g[j] != Object.prototype[j]) {
            h += '<param name="' + j + '" value="' + g[j] + '" />';
          }
        }
        a.outerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"' + f + ">" + h + "</object>";
        ag[ag.length] = e.id;
        d = aS(e.id);
      } else {
        var b = ar(aD);
        b.setAttribute("type", aE);
        for (var k in e) {
          if (e[k] != Object.prototype[k]) {
            if (k.toLowerCase() == "styleclass") {
              b.setAttribute("class", e[k]);
            } else {
              if (k.toLowerCase() != "classid") {
                b.setAttribute(k, e[k]);
              }
            }
          }
        }
        for (var l in g) {
          if (g[l] != Object.prototype[l] && l.toLowerCase() != "movie") {
            aQ(b, l, g[l]);
          }
        }
        a.parentNode.replaceChild(b, a);
        d = b;
      }
    }
    return d;
  }

  function aQ(b, d, c) {
    var a = ar("param");
    a.setAttribute("name", d);
    a.setAttribute("value", c);
    b.appendChild(a);
  }

  function aw(a) {
    var b = aS(a);
    if (b && b.nodeName == "OBJECT") {
      if (ah.ie && ah.win) {
        b.style.display = "none";
        (function() {
          if (b.readyState == 4) {
            aT(a);
          } else {
            setTimeout(arguments.callee, 10);
          }
        })();
      } else {
        b.parentNode.removeChild(b);
      }
    }
  }

  function aT(a) {
    var b = aS(a);
    if (b) {
      for (var c in b) {
        if (typeof b[c] == "function") {
          b[c] = null;
        }
      }
      b.parentNode.removeChild(b);
    }
  }

  function aS(a) {
    var c = null;
    try {
      c = aL.getElementById(a);
    } catch (b) {}
    return c;
  }

  function ar(a) {
    return aL.createElement(a);
  }

  function aM(a, c, b) {
    a.attachEvent(c, b);
    al[al.length] = [a, c, b];
  }

  function ao(a) {
    var b = ah.pv,
      c = a.split(".");
    c[0] = parseInt(c[0], 10);
    c[1] = parseInt(c[1], 10) || 0;
    c[2] = parseInt(c[2], 10) || 0;
    return (b[0] > c[0] || (b[0] == c[0] && b[1] > c[1]) || (b[0] == c[0] && b[1] == c[1] && b[2] >= c[2])) ? true : false;
  }

  function az(b, f, a, c) {
    if (ah.ie && ah.mac) {
      return;
    }
    var e = aL.getElementsByTagName("head")[0];
    if (!e) {
      return;
    }
    var g = (a && typeof a == "string") ? a : "screen";
    if (c) {
      aH = null;
      an = null;
    }
    if (!aH || an != g) {
      var d = ar("style");
      d.setAttribute("type", "text/css");
      d.setAttribute("media", g);
      aH = e.appendChild(d);
      if (ah.ie && ah.win && typeof aL.styleSheets != aq && aL.styleSheets.length > 0) {
        aH = aL.styleSheets[aL.styleSheets.length - 1];
      }
      an = g;
    }
    if (ah.ie && ah.win) {
      if (aH && typeof aH.addRule == aD) {
        aH.addRule(b, f);
      }
    } else {
      if (aH && typeof aL.createTextNode != aq) {
        aH.appendChild(aL.createTextNode(b + " {" + f + "}"));
      }
    }
  }

  function ay(a, c) {
    if (!aI) {
      return;
    }
    var b = c ? "visible" : "hidden";
    if (ak && aS(a)) {
      aS(a).style.visibility = b;
    } else {
      az("#" + a, "visibility:" + b);
    }
  }

  function ai(b) {
    var a = /[\\\"<>\.;]/;
    var c = a.exec(b) != null;
    return c && typeof encodeURIComponent != aq ? encodeURIComponent(b) : b;
  }
  var aR = function() {
    if (ah.ie && ah.win) {
      window.attachEvent("onunload", function() {
        var a = al.length;
        for (var b = 0; b < a; b++) {
          al[b][0].detachEvent(al[b][1], al[b][2]);
        }
        var d = ag.length;
        for (var c = 0; c < d; c++) {
          aw(ag[c]);
        }
        for (var e in ah) {
          ah[e] = null;
        }
        ah = null;
        for (var f in swfobject) {
          swfobject[f] = null;
        }
        swfobject = null;
      });
    }
  }();
  return {
    registerObject: function(a, e, c, b) {
      if (ah.w3 && a && e) {
        var d = {};
        d.id = a;
        d.swfVersion = e;
        d.expressInstall = c;
        d.callbackFn = b;
        aG[aG.length] = d;
        ay(a, false);
      } else {
        if (b) {
          b({
            success: false,
            id: a
          });
        }
      }
    },
    getObjectById: function(a) {
      if (ah.w3) {
        return av(a);
      }
    },
    embedSWF: function(k, e, h, f, c, a, b, i, g, j) {
      var d = {
        success: false,
        id: e
      };
      if (ah.w3 && !(ah.wk && ah.wk < 312) && k && e && h && f && c) {
        ay(e, false);
        aj(function() {
          h += "";
          f += "";
          var q = {};
          if (g && typeof g === aD) {
            for (var o in g) {
              q[o] = g[o];
            }
          }
          q.data = k;
          q.width = h;
          q.height = f;
          var n = {};
          if (i && typeof i === aD) {
            for (var p in i) {
              n[p] = i[p];
            }
          }
          if (b && typeof b === aD) {
            for (var l in b) {
              if (typeof n.flashvars != aq) {
                n.flashvars += "&" + l + "=" + b[l];
              } else {
                n.flashvars = l + "=" + b[l];
              }
            }
          }
          if (ao(c)) {
            var m = aA(q, n, e);
            if (q.id == e) {
              ay(e, true);
            }
            d.success = true;
            d.ref = m;
          } else {
            if (a && au()) {
              q.data = a;
              ae(q, n, e, j);
              return;
            } else {
              ay(e, true);
            }
          }
          if (j) {
            j(d);
          }
        });
      } else {
        if (j) {
          j(d);
        }
      }
    },
    switchOffAutoHideShow: function() {
      aI = false;
    },
    ua: ah,
    getFlashPlayerVersion: function() {
      return {
        major: ah.pv[0],
        minor: ah.pv[1],
        release: ah.pv[2]
      };
    },
    hasFlashPlayerVersion: ao,
    createSWF: function(a, b, c) {
      if (ah.w3) {
        return aA(a, b, c);
      } else {
        return undefined;
      }
    },
    showExpressInstall: function(b, a, d, c) {
      if (ah.w3 && au()) {
        ae(b, a, d, c);
      }
    },
    removeSWF: function(a) {
      if (ah.w3) {
        aw(a);
      }
    },
    createCSS: function(b, a, c, d) {
      if (ah.w3) {
        az(b, a, c, d);
      }
    },
    addDomLoadEvent: aj,
    addLoadEvent: aC,
    getQueryParamValue: function(b) {
      var a = aL.location.search || aL.location.hash;
      if (a) {
        if (/\?/.test(a)) {
          a = a.split("?")[1];
        }
        if (b == null) {
          return ai(a);
        }
        var c = a.split("&");
        for (var d = 0; d < c.length; d++) {
          if (c[d].substring(0, c[d].indexOf("=")) == b) {
            return ai(c[d].substring((c[d].indexOf("=") + 1)));
          }
        }
      }
      return "";
    },
    expressInstallCallback: function() {
      if (aU) {
        var a = aS(ac);
        if (a && aJ) {
          a.parentNode.replaceChild(aJ, a);
          if (ad) {
            ay(ad, true);
            if (ah.ie && ah.win) {
              aJ.style.display = "block";
            }
          }
          if (ap) {
            ap(at);
          }
        }
        aU = false;
      }
    }
  };
}();
(function(d) {
  d.NOMENSA = d.NOMENSA || {};
  var a, c, b;
  d.NOMENSA.uaMatch = function(f) {
    f = f.toLowerCase();
    var e = /(webkit)[ \/]([\w.]+)/.exec(f) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(f) || /(msie) ([\w.]+)/.exec(f) || f.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(f) || [];
    return {
      browser: e[1] || "",
      version: e[2] || "0"
    };
  };
  a = d.NOMENSA.uaMatch(d.navigator.userAgent);
  c = {};
  if (a.browser) {
    c[a.browser] = true;
    c.version = a.version;
  }
  d.NOMENSA.browser = c;
})(window);
window.NOMENSA = window.NOMENSA || {};
window.NOMENSA.player = window.NOMENSA.player || {};
window.NOMENSA.player.YoutubePlayer = function(a) {
  this.config = a;
  this.config.playerVars = {
    controls: 0,
    showinfo: 0,
    origin: window.location.protocol + "//" + window.location.hostname,
    rel: 0
  };
};
window.NOMENSA.player.YoutubePlayer.apiLoaded = false;
window.NOMENSA.player.YoutubePlayer.prototype = {
  getYTOptions: function() {
    var b = this,
      a = {
        height: this.config.flashHeight,
        width: this.config.flashWidth,
        videoId: this.config.media,
        events: {
          onReady: function(c) {
            b.$html.find("iframe").attr({
              id: b.config.id,
              role: "presentation"
            });
            b.onPlayerReady(c);
          },
          onStateChange: function(c) {
            b.onPlayerStateChange(c.data);
          }
        }
      };
    a.playerVars = this.config.playerVars;
    if (this.config.repeat) {
      a.playerVars.playlist = this.config.media;
    }
    return a;
  },
  init: function() {
    if (typeof window.postMessage !== "undefined") {
      return function(d) {
        var a = document.createElement("script"),
          b = document.getElementsByTagName("script")[0],
          c = this;
        this.$html = this.assembleHTML();
        if (this.config.captions) {
          this.getCaptions();
        }
        d.html(this.$html);
        window.NOMENSA.player.PlayerDaemon.addPlayer(this);
        if (!window.NOMENSA.player.YoutubePlayer.apiLoaded) {
          if (typeof window.onYouTubeIframeAPIReady === "undefined") {
            window.onYouTubeIframeAPIReady = function() {
              window.NOMENSA.player.PlayerDaemon.map(function(e) {
                if (typeof e.getYTOptions !== "undefined") {
                  e.player = new YT.Player("player-" + e.config.id, e.getYTOptions());
                }
              });
              window.NOMENSA.player.YoutubePlayer.apiLoaded = true;
            };
            a.src = "//www.youtube.com/iframe_api";
            b.parentNode.insertBefore(a, b);
          }
        } else {
          this.player = YT.Player("player-" + player.config.id, getOptions(player));
        }
      };
    } else {
      return function(b) {
        var a = this;
        this.$html = this.assembleHTML();
        if (this.config.captions) {
          this.getCaptions();
        }
        b.html(this.$html);
        window.NOMENSA.player.PlayerDaemon.addPlayer(this);
        window.NOMENSA.player.stateHandlers[this.config.id] = function(d) {
          var c = window.NOMENSA.player.PlayerDaemon.getPlayer(a.config.id);
          c.onPlayerStateChange(d);
        };
        window.onYouTubePlayerReady = function(c) {
          var d = window.NOMENSA.player.PlayerDaemon.getPlayer(c);
          var e = document.getElementById(d.config.id);
          d.player = e;
          d.cue();
          d.getPlayer().addEventListener("onStateChange", "window.NOMENSA.player.stateHandlers." + a.config.id);
          d.onPlayerReady();
        };
      };
    }
  }(),
  state: {
    ended: 0,
    playing: 1,
    paused: 2,
    unstarted: -1
  },
  onPlayerReady: (function() {
    var b = [],
      a;
    return function(d) {
      var c = b.length;
      if (typeof d === "function") {
        b.push(d);
      } else {
        if (c === 0) {
          return false;
        }
        for (a = 0; a < c; a++) {
          b[a].apply(this, arguments);
        }
      }
    };
  }()),
  onPlayerStateChange: function(a) {
    if (a == 1) {
      this.play();
      if (this.config.buttons.toggle) {
        this.$html.find(".play").removeClass("play").addClass("pause").text("Pause");
      }
    } else {
      if (this.config.repeat && (a == 0)) {
        this.play();
      }
    }
  },
  getFlashVars: function() {
    var a = {
      controlbar: "none",
      file: this.config.media
    };
    if (this.config.image != "") {
      a.image = this.config.image;
    }
    if (this.config.repeat) {
      a.repeat = this.config.repeat;
    }
    return a;
  },
  getFlashParams: function() {
    return {
      allowScriptAccess: "always",
      wmode: "transparent"
    };
  },
  generateFlashPlayer: function(c) {
    var g = this;
    var a = this.getFlashVars();
    var f = this.getFlashParams();
    var h = {
      id: this.config.id,
      name: this.config.id
    };
    var e = $("<" + this.config.flashContainer + " />").attr("id", "player-" + this.config.id).addClass("flashReplace").html('This content requires Macromedia Flash Player. You can <a href="http://get.adobe.com/flashplayer/">install or upgrade the Adobe Flash Player here</a>.');
    var d = $("<span />").addClass("video");
    var b = this.getURL();
    setTimeout(function() {
      swfobject.embedSWF(b, e.attr("id"), g.config.flashWidth, g.config.flashHeight, "9.0.115", null, a, f, h, g.config.swfCallback);
      if (window.NOMENSA.browser.mozilla && (parseInt(window.NOMENSA.browser.version, 10) >= 2)) {
        g.$html.find("object").attr("tabindex", "-1");
      }
    }, 0);
    c.append(d.append(e));
    return c;
  },
  generateVideoPlayer: function(b) {
    if (typeof window.postMessage === "undefined") {
      return this.generateFlashPlayer(b);
    } else {
      var a = $("<" + this.config.flashContainer + " />").attr("id", "player-" + this.config.id);
      var c = $("<span />").addClass("video");
      b.append(c.append(a));
      return b;
    }
  },
  getPlayer: function() {
    return this.player;
  },
  is_html5: false,
  play: function() {
    this.player.playVideo();
    this.setSliderTimeout();
    if (this.config.captionsOn && this.captions) {
      this.setCaptionTimeout();
    }
  },
  pause: function() {
    this.player.pauseVideo();
    this.clearSliderTimeout();
    if (this.config.captionsOn && this.captions) {
      this.clearCaptionTimeout();
    }
  },
  ffwd: function() {
    var b = this.getCurrentTime() + this.config.playerSkip,
      a = this.getDuration();
    if (b > a) {
      b = a;
    }
    this.seek(b);
  },
  rewd: function() {
    var a = this.getCurrentTime() - this.config.playerSkip;
    if (a < 0) {
      a = 0;
    }
    this.seek(a);
  },
  mute: function() {
    var a = this.$html.find("button.mute");
    if (this.player.isMuted()) {
      this.player.unMute();
      if (a.hasClass("muted")) {
        a.removeClass("muted");
      }
    } else {
      this.player.mute();
      a.addClass("muted");
    }
  },
  volup: function() {
    var a = this.player.getVolume();
    if (a >= 100) {
      a = 100;
    } else {
      a = a + this.config.volumeStep;
    }
    this.player.setVolume(a);
    this.updateVolume(a);
  },
  voldwn: function() {
    var a = this.player.getVolume();
    if (a <= 0) {
      a = 0;
    } else {
      a = a - this.config.volumeStep;
    }
    this.player.setVolume(a);
    this.updateVolume(a);
  },
  getDuration: function() {
    return this.player.getDuration();
  },
  getCurrentTime: function() {
    return this.player.getCurrentTime();
  },
  getBytesLoaded: function() {
    return this.player.getVideoBytesLoaded();
  },
  getBytesTotal: function() {
    return this.player.getVideoBytesTotal();
  },
  seek: function(a) {
    this.player.seekTo(a, true);
    if (this.config.captionsOn && this.captions) {
      this.$html.find(".caption").remove();
      this.clearCaptionTimeout();
      this.setCaptionTimeout();
      this.getPreviousCaption();
    }
  },
  cue: function() {
    this.player.cueVideoById(this.config.media);
  },
  toggleCaptions: function() {
    var a = this;
    var b = this.$html.find(".captions");
    if (b.hasClass("captions-off")) {
      b.removeClass("captions-off").addClass("captions-on");
      a.getPreviousCaption();
      a.setCaptionTimeout();
      a.config.captionsOn = true;
    } else {
      b.removeClass("captions-on").addClass("captions-off");
      a.clearCaptionTimeout();
      a.$html.find(".caption").remove();
      a.config.captionsOn = false;
    }
  }
};
window.NOMENSA = window.NOMENSA || {};
window.NOMENSA.player = window.NOMENSA.player || {};
window.NOMENSA.player.MediaplayerDecorator = function(a) {
  var b = a;
  this.config = b.config;
  this.player = b.player;
  this.state = b.state;
  for (var c in b) {
    if (typeof b[c] === "function") {
      this[c] = (function(d) {
        return function() {
          return b[d].apply(this, arguments);
        };
      }(c));
    }
  }
};
window.NOMENSA.player.MediaplayerDecorator.prototype.generatePlayerContainer = function() {
  var a = $("<" + this.config.playerContainer + " />").css(this.config.playerStyles).addClass("player-container");
  if (window.NOMENSA.browser.msie) {
    a.addClass("player-container-ie player-container-ie-" + window.NOMENSA.browser.version.substring(0, 1));
  }
  return a;
};
window.NOMENSA.player.MediaplayerDecorator.prototype.assembleHTML = function() {
  var a = this.generatePlayerContainer();
  var c = this.generateVideoPlayer(a);
  var b = c.append(this.getControls());
  return b;
};
window.NOMENSA.player.MediaplayerDecorator.prototype.getURL = function() {
  return [this.config.url, this.config.id].join("");
};
window.NOMENSA.player.MediaplayerDecorator.prototype.createButton = function(d, b) {
  var a = 0;
  var e = [d, this.config.id].join("-");
  var c = $("<button />").append(b).addClass(d).attr({
    title: d,
    id: e
  }).addClass("ui-corner-all ui-state-default").hover(function() {
    $(this).addClass("ui-state-hover");
  }, function() {
    $(this).removeClass("ui-state-hover");
  }).focus(function() {
    $(this).addClass("ui-state-focus");
  }).blur(function() {
    $(this).removeClass("ui-state-focus");
  }).click(function(f) {
    f.preventDefault();
  });
  return c;
};
window.NOMENSA.player.MediaplayerDecorator.prototype.getFuncControls = function() {
  var l = this;
  var j = $("<div>");
  j[0].className = "player-controls";
  var g = [];
  if (l.config.buttons.toggle) {
    var a = l.createButton("play", "Play").attr({
      "aria-live": "assertive"
    }).click(function() {
      if ($(this).hasClass("play")) {
        $(this).removeClass("play").addClass("pause").attr({
          title: "Pause",
          id: "pause-" + l.config.id
        }).text("Pause");
        l.play();
      } else {
        $(this).removeClass("pause").addClass("play").attr({
          title: "Play",
          id: "play-" + l.config.id
        }).text("Play");
        l.pause();
      }
    });
    g.push(a);
  } else {
    var c = l.createButton("play", "Play").click(function() {
      l.play();
    });
    var k = l.createButton("pause", "Pause").click(function() {
      l.pause();
    });
    g.push(c);
    g.push(k);
  }
  if (l.config.buttons.rewind) {
    var f = l.createButton("rewind", "Rewind").click(function() {
      l.rewd();
    });
    g.push(f);
  }
  if (l.config.buttons.forward) {
    var h = l.createButton("forward", "Forward").click(function() {
      l.ffwd();
    });
    g.push(h);
  }
  if (l.config.captions) {
    var b = l.createButton("captions", "Captions").click(function() {
      l.toggleCaptions();
    });
    var d = (l.config.captionsOn == true) ? "captions-on" : "captions-off";
    b.addClass(d);
    g.push(b);
  }
  for (var e = 0; e < g.length; e = e + 1) {
    j[0].appendChild(g[e][0]);
  }
  return j;
};
window.NOMENSA.player.MediaplayerDecorator.prototype.getVolControls = function() {
  var c = this;
  var g = $("<div>").addClass("volume-controls");
  var b = c.createButton("mute", "Mute").click(function() {
    c.mute();
  });
  var h = c.createButton("vol-up", '+<span class="ui-helper-hidden-accessible"> Volume Up</span>').click(function() {
    c.volup();
  });
  var e = c.createButton("vol-down", '-<span class="ui-helper-hidden-accessible"> Volume Down</span>').click(function() {
    c.voldwn();
  });
  var f = $("<span />").attr({
    id: "vol-" + c.config.id,
    "class": "vol-display"
  }).text("100%");
  var a = [b, e, h, f];
  for (var d = 0; d < a.length; d = d + 1) {
    g[0].appendChild(a[d][0]);
  }
  return g;
};
window.NOMENSA.player.MediaplayerDecorator.prototype.getSliderBar = function() {
  var c = $("<span />").addClass("ui-helper-hidden-accessible").html("<p>The timeline slider below uses WAI ARIA. Please use the documentation for your screen reader to find out more.</p>");
  var a = $("<span />").addClass("current-time").attr({
    id: "current-" + this.config.id
  }).text("00:00:00");
  var g = this.getSlider();
  var f = $("<span />").addClass("duration-time").attr({
    id: "duration-" + this.config.id
  }).text("00:00:00");
  var e = $("<div />").addClass("timer-bar").append(c);
  var d = [a, g, f];
  for (var b = 0; b < d.length; b = b + 1) {
    e[0].appendChild(d[b][0]);
  }
  return e;
};
window.NOMENSA.player.MediaplayerDecorator.prototype.getSlider = function() {
  var d = this;
  var a = $("<span />").attr("id", "slider-" + this.config.id).slider({
    orientation: "horizontal",
    change: function(f, g) {
      var e = g.value;
      var h = (e / 100) * d.getDuration();
      d.seek(h);
    }
  });
  a.find("a.ui-slider-handle").attr({
    role: "slider",
    "aria-valuemin": "0",
    "aria-valuemax": "100",
    "aria-valuenow": "0",
    "aria-valuetext": "0 percent",
    title: "Slider Control"
  });
  var c = $("<span />").addClass("progress-bar").attr({
    id: "progress-bar-" + this.config.id,
    tabindex: "-1"
  }).addClass("ui-progressbar-value ui-widget-header ui-corner-left").css({
    width: "0%",
    height: "95%"
  });
  var b = $("<span />").attr({
    id: "loaded-bar-" + this.config.id,
    tabindex: "-1"
  }).addClass("loaded-bar ui-progressbar-value ui-widget-header ui-corner-left").css({
    height: "95%",
    width: "0%"
  });
  return a.append(c, b);
};
window.NOMENSA.player.MediaplayerDecorator.prototype.setSliderTimeout = function() {
  var a = this;
  if (a.sliderInterval == undefined) {
    a.sliderInterval = setInterval(function() {
      a.updateSlider();
    }, a.config.sliderTimeout);
  }
};
window.NOMENSA.player.MediaplayerDecorator.prototype.clearSliderTimeout = function() {
  var a = this;
  if (a.sliderInterval != undefined) {
    a.sliderInterval = clearInterval(a.sliderInterval);
  }
};
window.NOMENSA.player.MediaplayerDecorator.prototype.updateSlider = function() {
  var c = (typeof(this.duration) != "undefined") ? this.duration : this.getDuration();
  var a = (typeof(this.duration_found) == "boolean") ? this.duration_found : false;
  var d = this.getCurrentTime();
  var b = 0;
  if (c > 0) {
    b = (d / c) * 100;
    b = parseInt(b, 10);
  } else {
    c = 0;
  }
  if (!a) {
    $("#duration-" + this.config.id).html(this.formatTime(parseInt(c, 10)));
    this.duration_found = true;
  }
  $("#slider-" + this.config.id).find("a.ui-slider-handle").attr({
    "aria-valuenow": b,
    "aria-valuetext": b.toString() + " percent"
  }).css("left", b.toString() + "%");
  $("#progress-bar-" + this.config.id).attr({
    "aria-valuenow": b,
    "aria-valuetext": b.toString() + " percent"
  }).css("width", b.toString() + "%");
  this.updateLoaderBar();
  this.updateTime(d);
};
window.NOMENSA.player.MediaplayerDecorator.prototype.updateLoaderBar = function() {
  var a = (this.getBytesLoaded() / this.getBytesTotal()) * 100;
  a = parseInt(a, 10);
  if (!isFinite(a)) {
    a = 0;
  }
  $("#loaded-bar-" + this.config.id).attr({
    "aria-valuetext": a.toString() + " percent",
    "aria-valuenow": a
  }).css("width", a.toString() + "%");
};
window.NOMENSA.player.MediaplayerDecorator.prototype.formatTime = function(e) {
  var a = 0;
  var d = 0;
  var f = 0;
  if (e >= 60) {
    d = parseInt(e / 60, 10);
    f = e - (d * 60);
    if (d >= 60) {
      a = parseInt(d / 60, 10);
      d -= parseInt(a * 60, 10);
    }
  } else {
    f = e;
  }
  var c = [a, d, f];
  for (var b = 0; b < c.length; b = b + 1) {
    c[b] = (c[b] < 10) ? "0" + c[b].toString() : c[b].toString();
  }
  return c.join(":");
};
window.NOMENSA.player.MediaplayerDecorator.prototype.updateTime = function(b) {
  var a = this.formatTime(parseInt(b, 10));
  this.$html.find("#current-" + this.config.id).html(a);
};
window.NOMENSA.player.MediaplayerDecorator.prototype.getControls = function() {
  var a = $("<span />").addClass("ui-corner-bottom").addClass("control-bar");
  var d = $("<a />").attr("href", "http://www.nomensa.com?ref=logo").html("Accessible Media Player by Nomensa").addClass("logo");
  a.append(d);
  var b = this.getFuncControls();
  var e = this.getVolControls();
  var g = this.getSliderBar();
  var f = [b, e, g];
  for (var c = 0; c < f.length; c = c + 1) {
    a[0].appendChild(f[c][0]);
  }
  return a;
};
window.NOMENSA.player.MediaplayerDecorator.prototype.updateVolume = function(b) {
  $("#vol-" + this.config.id).text(b.toString() + "%");
  var a = this.$html.find("button.mute");
  if (b == 0) {
    a.addClass("muted");
  } else {
    if (a.hasClass("muted")) {
      a.removeClass("muted");
    }
  }
};
window.NOMENSA.player.MediaplayerDecorator.prototype.getCaptions = function() {
  var b = this;
  if (b.config.captions) {
    var a = [];
    $.ajax({
      url: b.config.captions,
      success: function(c) {
        if ($(c).find("p").length > 0) {
          b.captions = $(c).find("p");
        }
      }
    });
  }
};
window.NOMENSA.player.MediaplayerDecorator.prototype.toggleCaptions = function() {
  var a = this;
  var b = this.$html.find(".captions");
  if (b.hasClass("captions-off")) {
    b.removeClass("captions-off").addClass("captions-on");
    a.getPreviousCaption();
    a.setCaptionTimeout();
    a.config.captionsOn = true;
  } else {
    b.removeClass("captions-on").addClass("captions-off");
    a.clearCaptionTimeout();
    a.$html.find(".caption").remove();
    a.config.captionsOn = false;
  }
};
window.NOMENSA.player.MediaplayerDecorator.prototype.syncCaptions = function() {
  var a;
  if (this.captions) {
    var b = this.getCurrentTime();
    b = this.formatTime(parseInt(b, 10));
    a = this.captions.filter('[begin="' + b + '"]');
    if (a.length == 1) {
      this.insertCaption(a);
    }
  }
};
window.NOMENSA.player.MediaplayerDecorator.prototype.insertCaption = function(a) {
  if (this.$html.find(".caption").length == 1) {
    this.$html.find(".caption").text(a.text());
  } else {
    var b = $("<div>").text(a.text());
    b[0].className = "caption";
    this.$html.find(".video").prepend(b);
  }
};
window.NOMENSA.player.MediaplayerDecorator.prototype.getPreviousCaption = function(c) {
  var a;
  if (c == undefined) {
    c = this.getCurrentTime();
  }
  var b = this.formatTime(parseInt(c, 10));
  if (this.captions) {
    a = this.captions.filter('[begin="' + b + '"]');
    while ((a.length != 1) && (c > 0)) {
      c--;
      b = this.formatTime(parseInt(c, 10));
      a = this.captions.filter('[begin="' + b + '"]');
    }
    if (a.length == 1) {
      this.insertCaption(a);
    }
  }
};
window.NOMENSA.player.MediaplayerDecorator.prototype.destroyPlayerInstance = function() {
  return false;
};
window.NOMENSA.player.MediaplayerDecorator.prototype.destroy = function() {
  this.clearSliderTimeout();
  this.clearCaptionTimeout();
  this.destroyPlayerInstance();
  this.$html.remove();
};
window.NOMENSA.player.MediaplayerDecorator.prototype.setCaptionTimeout = function() {
  var a = this;
  if (a.captionInterval == undefined) {
    a.captionInterval = setInterval(function() {
      a.syncCaptions();
    }, 500);
  }
};
window.NOMENSA.player.MediaplayerDecorator.prototype.clearCaptionTimeout = function() {
  if (this.captionInterval != undefined) {
    this.captionInterval = clearInterval(this.captionInterval);
  }
};
window.NOMENSA = window.NOMENSA || {};
window.NOMENSA.player = window.NOMENSA.player || {};
jQuery(function(a) {
  a(window).resize(function() {
    a(".player-container").each(function() {
      if (a(this).width() > 580) {
        a(this).addClass("player-wide");
      } else {
        a(this).removeClass("player-wide");
      }
    });
  });
});
if (typeof window.postMessage === "undefined") {
  window.NOMENSA.player.stateHandlers = {};
}
window.NOMENSA.player.PlayerManager = function() {
  var a = {};
  this.getPlayer = function(b) {
    if (a[b] != undefined) {
      return a[b];
    }
    return null;
  };
  this.addPlayer = function(b) {
    a[b.config.id] = b;
    return true;
  };
  this.removePlayer = function(b) {
    if (a[b] != undefined) {
      a[b].destroy();
      delete a[b];
    }
  };
  this.map = function(c) {
    var b;
    for (b in a) {
      c(a[b]);
    }
  };
};
window.NOMENSA.player.PlayerDaemon = new window.NOMENSA.player.PlayerManager();
var html5_methods = {
  play: function() {
    this.player.play();
    this.setSliderTimeout();
    if (this.config.captionsOn && this.captions) {
      this.setCaptionTimeout();
    }
  },
  pause: function() {
    this.player.pause();
    this.clearSliderTimeout();
    if (this.config.captionsOn && this.captions) {
      this.clearCaptionTimeout();
    }
  },
  ffwd: function() {
    var a = this.getCurrentTime() + this.config.playerSkip;
    this.seek(a);
  },
  rewd: function() {
    var a = this.getCurrentTime() - this.config.playerSkip;
    if (a < 0) {
      a = 0;
    }
    this.seek(a);
  },
  mute: function() {
    var a = this.$html.find("button.mute");
    if (this.player.muted) {
      this.player.muted = false;
      if (a.hasClass("muted")) {
        a.removeClass("muted");
      }
    } else {
      this.player.muted = true;
      a.addClass("muted");
    }
  },
  volup: function() {
    var a = this.player.volume * 100;
    if (a < (100 - this.config.volumeStep)) {
      a += this.config.volumeStep;
    } else {
      a = 100;
    }
    this.player.volume = (a / 100);
    this.updateVolume(Math.round(a));
  },
  voldwn: function() {
    var a = this.player.volume * 100;
    if (a > this.config.volumeStep) {
      a -= this.config.volumeStep;
    } else {
      a = 0;
    }
    this.player.volume = (a / 100);
    this.updateVolume(Math.round(a));
  },
  getDuration: function() {
    return this.player.duration;
  },
  getCurrentTime: function() {
    return this.player.currentTime;
  },
  getBytesLoaded: function() {
    return this.player.buffered.end(0);
  },
  getBytesTotal: function() {
    return this.player.duration;
  },
  seek: function(a) {
    this.player.currentTime = a;
  },
  cue: function() {
    return;
  }
};
(function(a) {
  a.fn.player = function(k, f) {
    var e = {
      id: "media_player",
      url: window.location.protocol + "//www.youtube.com/apiplayer?enablejsapi=1&version=3&playerapiid=",
      media: "8LiQ-bLJaM4",
      repeat: false,
      captions: null,
      captionsOn: true,
      flashWidth: "100%",
      flashHeight: "300px",
      playerStyles: {
        height: "100%",
        width: "100%"
      },
      sliderTimeout: 350,
      flashContainer: "span",
      playerContainer: "span",
      image: "",
      playerSkip: 10,
      volumeStep: 10,
      buttons: {
        forward: true,
        rewind: true,
        toggle: true
      },
      logoURL: "http://www.nomensa.com?ref=logo",
      useHtml5: true,
      swfCallback: null
    };
    var c = a.extend(true, {}, e, k);
    var i = function(p) {
      var s = p.config.media,
        r, o, q, n, m, l;
      n = function(t) {
        r = document.createElement(t.container);
        if (r.canPlayType != undefined) {
          q = r.canPlayType(t.mimetype);
          if ((q.toLowerCase() == "maybe") || (q.toLowerCase() == "probably")) {
            return true;
          }
        }
      };
      if (typeof s === "string") {
        o = g(s);
        if (n(o)) {
          o.src = s;
          return o;
        }
      }
      if ((s instanceof Array) && (typeof s.push !== "undefined")) {
        for (m = 0, l = s.length; m < l; m++) {
          o = g(s[m]);
          if (n(o)) {
            o.src = s[m];
            return o;
          }
        }
      }
      return false;
    };
    var h = function(n) {
      var m = "";
      var l = "video";
      switch (n) {
        case "mp4":
          m = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
          break;
        case "m4v":
          m = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
          break;
        case "ogg":
          m = 'video/ogg; codecs="theora, vorbis"';
          break;
        case "ogv":
          m = 'video/ogg; codecs="theora, vorbis"';
          break;
        case "webm":
          m = 'video/webm; codecs="vp8, vorbis"';
          break;
        case "mp3":
          m = "audio/mpeg";
          l = "audio";
          break;
      }
      return {
        mimetype: m,
        container: l
      };
    };
    var g = function(o) {
      var m = o.lastIndexOf(".");
      if (m != -1) {
        var l = o.substring(m + 1);
        var n = h(l);
        return n;
      }
      return null;
    };
    var b = function() {
      if (window.NOMENSA.browser.mozilla) {
        return (parseInt(window.NOMENSA.browser.version, 10) >= 2) ? true : false;
      }
      return false;
    };
    var d = {
      generatePlayerContainer: function() {
        var l = a("<" + this.config.playerContainer + " />").css(this.config.playerStyles).addClass("player-container");
        if (window.NOMENSA.browser.msie) {
          l.addClass("player-container-ie player-container-ie-" + window.NOMENSA.browser.version.substring(0, 1));
        }
        return l;
      },
      getFlashVars: function() {
        var l = {
          controlbar: "none",
          file: this.config.media
        };
        if (this.config.image != "") {
          l.image = this.config.image;
        }
        if (this.config.repeat) {
          l.repeat = this.config.repeat;
        }
        return l;
      },
      getFlashParams: function() {
        return {
          allowScriptAccess: "always",
          wmode: "transparent"
        };
      },
      getURL: function() {
        return [this.config.url, this.config.id].join("");
      },
      generateFlashPlayer: function(n) {
        var r = this;
        var l = this.getFlashVars();
        var q = this.getFlashParams();
        var s = {
          id: this.config.id,
          name: this.config.id
        };
        var p = a("<" + this.config.flashContainer + " />").attr("id", "player-" + this.config.id).addClass("flashReplace").html('This content requires Macromedia Flash Player. You can <a href="http://get.adobe.com/flashplayer/">install or upgrade the Adobe Flash Player here</a>.');
        var o = a("<span />").addClass("video");
        var m = this.getURL();
        setTimeout(function() {
          swfobject.embedSWF(m, p.attr("id"), r.config.flashWidth, r.config.flashHeight, "9.0.115", null, l, q, s, r.config.swfCallback);
          if (b()) {
            r.$html.find("object").attr("tabindex", "-1");
          }
        }, 0);
        n.append(o.append(p));
        return n;
      },
      generateHTML5Player: function(m, p, o) {
        var n = a("<span />");
        n[0].className = "video";
        var l = a("<" + p + " />").attr({
          id: this.config.id,
          src: this.config.media,
          type: o
        }).css({
          width: "100%",
          height: "50%"
        });
        if (a.trim(this.config.image) != "") {
          l.attr({
            poster: a.trim(this.config.image)
          });
        }
        return m.append(n.append(l));
      },
      createButton: function(o, m) {
        var l = 0;
        var p = [o, this.config.id].join("-");
        var n = a("<button />").append(m).addClass(o).attr({
          title: o,
          id: p
        }).addClass("ui-corner-all ui-state-default").hover(function() {
          a(this).addClass("ui-state-hover");
        }, function() {
          a(this).removeClass("ui-state-hover");
        }).focus(function() {
          a(this).addClass("ui-state-focus");
        }).blur(function() {
          a(this).removeClass("ui-state-focus");
        }).click(function(q) {
          q.preventDefault();
        });
        return n;
      },
      getFuncControls: function() {
        var v = this;
        var t = a("<div>");
        t[0].className = "player-controls";
        var r = [];
        if (v.config.buttons.toggle) {
          var l = v.createButton("play", "Play").attr({
            "aria-live": "assertive"
          }).click(function() {
            if (a(this).hasClass("play")) {
              a(this).removeClass("play").addClass("pause").attr({
                title: "Pause",
                id: "pause-" + v.config.id
              }).text("Pause");
              v.play();
            } else {
              a(this).removeClass("pause").addClass("play").attr({
                title: "Play",
                id: "play-" + v.config.id
              }).text("Play");
              v.pause();
            }
          });
          r.push(l);
        } else {
          var n = v.createButton("play", "Play").click(function() {
            v.play();
          });
          var u = v.createButton("pause", "Pause").click(function() {
            v.pause();
          });
          r.push(n);
          r.push(u);
        }
        if (v.config.buttons.rewind) {
          var q = v.createButton("rewind", "Rewind").click(function() {
            v.rewd();
          });
          r.push(q);
        }
        if (v.config.buttons.forward) {
          var s = v.createButton("forward", "Forward").click(function() {
            v.ffwd();
          });
          r.push(s);
        }
        if (v.config.captions) {
          var m = v.createButton("captions", "Captions").click(function() {
            v.toggleCaptions();
          });
          var o = (v.config.captionsOn == true) ? "captions-on" : "captions-off";
          m.addClass(o);
          r.push(m);
        }
        var p;
        for (p = 0; p < r.length; p = p + 1) {
          t[0].appendChild(r[p][0]);
        }
        return t;
      },
      getVolControls: function() {
        var n = this;
        var r = a("<div>").addClass("volume-controls");
        var m = n.createButton("mute", "Mute").click(function() {
          n.mute();
        });
        var s = n.createButton("vol-up", '+<span class="ui-helper-hidden-accessible"> Volume Up</span>').click(function() {
          n.volup();
        });
        var p = n.createButton("vol-down", '-<span class="ui-helper-hidden-accessible"> Volume Down</span>').click(function() {
          n.voldwn();
        });
        var q = a("<span />").attr({
          id: "vol-" + n.config.id,
          "class": "vol-display"
        }).text("100%");
        var l = [m, p, s, q];
        var o;
        for (o = 0; o < l.length; o = o + 1) {
          r[0].appendChild(l[o][0]);
        }
        return r;
      },
      getSliderBar: function() {
        var n = a("<span />").addClass("ui-helper-hidden-accessible").html("<p>The timeline slider below uses WAI ARIA. Please use the documentation for your screen reader to find out more.</p>");
        var l = a("<span />").addClass("current-time").attr({
          id: "current-" + this.config.id
        }).text("00:00:00");
        var r = this.getSlider();
        var q = a("<span />").addClass("duration-time").attr({
          id: "duration-" + this.config.id
        }).text("00:00:00");
        var p = a("<div />").addClass("timer-bar").append(n);
        var o = [l, r, q];
        var m;
        for (m = 0; m < o.length; m = m + 1) {
          p[0].appendChild(o[m][0]);
        }
        return p;
      },
      getSlider: function() {
        var o = this;
        var l = a("<span />").attr("id", "slider-" + this.config.id).slider({
          orientation: "horizontal",
          change: function(q, r) {
            var p = r.value;
            var s = (p / 100) * o.getDuration();
            o.seek(s);
          }
        });
        l.find("a.ui-slider-handle").attr({
          role: "slider",
          "aria-valuemin": "0",
          "aria-valuemax": "100",
          "aria-valuenow": "0",
          "aria-valuetext": "0 percent",
          title: "Slider Control"
        });
        var n = a("<span />").addClass("progress-bar").attr({
          id: "progress-bar-" + this.config.id,
          tabindex: "-1"
        }).addClass("ui-progressbar-value ui-widget-header ui-corner-left").css({
          width: "0%",
          height: "95%"
        });
        var m = a("<span />").attr({
          id: "loaded-bar-" + this.config.id,
          tabindex: "-1"
        }).addClass("loaded-bar ui-progressbar-value ui-widget-header ui-corner-left").css({
          height: "95%",
          width: "0%"
        });
        return l.append(n, m);
      },
      setSliderTimeout: function() {
        var l = this;
        if (l.sliderInterval == undefined) {
          l.sliderInterval = setInterval(function() {
            l.updateSlider();
          }, l.config.sliderTimeout);
        }
      },
      clearSliderTimeout: function() {
        var l = this;
        if (l.sliderInterval != undefined) {
          l.sliderInterval = clearInterval(l.sliderInterval);
        }
      },
      updateSlider: function() {
        var n = (typeof(this.duration) != "undefined") ? this.duration : this.getDuration();
        var l = (typeof(this.duration_found) == "boolean") ? this.duration_found : false;
        var o = this.getCurrentTime();
        var m = 0;
        if (n > 0) {
          m = (o / n) * 100;
          m = parseInt(m, 10);
        } else {
          n = 0;
        }
        if (!l) {
          a("#duration-" + this.config.id).html(this.formatTime(parseInt(n, 10)));
          this.duration_found = true;
        }
        a("#slider-" + this.config.id).find("a.ui-slider-handle").attr({
          "aria-valuenow": m,
          "aria-valuetext": m.toString() + " percent"
        }).css("left", m.toString() + "%");
        a("#progress-bar-" + this.config.id).attr({
          "aria-valuenow": m,
          "aria-valuetext": m.toString() + " percent"
        }).css("width", m.toString() + "%");
        this.updateLoaderBar();
        this.updateTime(o);
      },
      updateLoaderBar: function() {
        var l = (this.getBytesLoaded() / this.getBytesTotal()) * 100;
        l = parseInt(l, 10);
        if (!isFinite(l)) {
          l = 0;
        }
        a("#loaded-bar-" + this.config.id).attr({
          "aria-valuetext": l.toString() + " percent",
          "aria-valuenow": l
        }).css("width", l.toString() + "%");
      },
      formatTime: function(p) {
        var l = 0;
        var o = 0;
        var q = 0;
        if (p >= 60) {
          o = parseInt(p / 60, 10);
          q = p - (o * 60);
          if (o >= 60) {
            l = parseInt(o / 60, 10);
            o -= parseInt(l * 60, 10);
          }
        } else {
          q = p;
        }
        var n = [l, o, q];
        var m;
        for (m = 0; m < n.length; m = m + 1) {
          n[m] = (n[m] < 10) ? "0" + n[m].toString() : n[m].toString();
        }
        return n.join(":");
      },
      updateTime: function(m) {
        var l = this.formatTime(parseInt(m, 10));
        this.$html.find("#current-" + this.config.id).html(l);
      },
      getControls: function() {
        var l = a("<span />").addClass("ui-corner-bottom").addClass("control-bar");
        var o = a("<a />").attr("href", "http://www.nomensa.com?ref=logo").html("Accessible Media Player by Nomensa").addClass("logo");
        l.append(o);
        var m = this.getFuncControls();
        var p = this.getVolControls();
        var r = this.getSliderBar();
        var q = [m, p, r];
        var n;
        for (n = 0; n < q.length; n = n + 1) {
          l[0].appendChild(q[n][0]);
        }
        return l;
      },
      assembleHTML: function() {
        var l = this.generatePlayerContainer();
        var n = this.generateFlashPlayer(l);
        var m = n.append(this.getControls());
        return m;
      },
      assembleHTML5: function(p, o) {
        var l = this.generatePlayerContainer();
        var n = this.generateHTML5Player(l, p, o);
        var m = n.append(this.getControls());
        return m;
      },
      updateVolume: function(m) {
        a("#vol-" + this.config.id).text(m.toString() + "%");
        var l = this.$html.find("button.mute");
        if (m == 0) {
          l.addClass("muted");
        } else {
          if (l.hasClass("muted")) {
            l.removeClass("muted");
          }
        }
      },
      getCaptions: function() {
        var m = this;
        if (m.config.captions) {
          var l = [];
          a.ajax({
            url: m.config.captions,
            success: function(n) {
              if (a(n).find("p").length > 0) {
                m.captions = a(n).find("p");
              }
            }
          });
        }
      },
      syncCaptions: function() {
        var l;
        if (this.captions) {
          var m = this.getCurrentTime();
          m = this.formatTime(parseInt(m, 10));
          l = this.captions.filter('[begin="' + m + '"]');
          if (l.length == 1) {
            this.insertCaption(l);
          }
        }
      },
      insertCaption: function(l) {
        if (this.$html.find(".caption").length == 1) {
          this.$html.find(".caption").text(l.text());
        } else {
          var m = a("<div>").text(l.text());
          m[0].className = "caption";
          this.$html.find(".video").prepend(m);
        }
      },
      getPreviousCaption: function(n) {
        var l;
        if (n == undefined) {
          n = this.getCurrentTime();
        }
        var m = this.formatTime(parseInt(n, 10));
        if (this.captions) {
          l = this.captions.filter('[begin="' + m + '"]');
          while ((l.length != 1) && (n > 0)) {
            n--;
            m = this.formatTime(parseInt(n, 10));
            l = this.captions.filter('[begin="' + m + '"]');
          }
          if (l.length == 1) {
            this.insertCaption(l);
          }
        }
      },
      destroyPlayerInstance: function() {
        return false;
      },
      destroy: function() {
        this.clearSliderTimeout();
        this.clearCaptionTimeout();
        this.destroyPlayerInstance();
        this.$html.remove();
      },
      setCaptionTimeout: function() {
        var l = this;
        if (l.captionInterval == undefined) {
          l.captionInterval = setInterval(function() {
            l.syncCaptions();
          }, 500);
        }
      },
      clearCaptionTimeout: function() {
        if (this.captionInterval != undefined) {
          this.captionInterval = clearInterval(this.captionInterval);
        }
      },
      play: function() {
        this.player.playVideo();
        this.setSliderTimeout();
        if (this.config.captionsOn && this.captions) {
          this.setCaptionTimeout();
        }
      },
      pause: function() {
        this.player.pauseVideo();
        this.clearSliderTimeout();
        if (this.config.captionsOn && this.captions) {
          this.clearCaptionTimeout();
        }
      },
      ffwd: function() {
        var l = this.getCurrentTime() + this.config.playerSkip;
        this.seek(l);
      },
      rewd: function() {
        var l = this.getCurrentTime() - this.config.playerSkip;
        if (l < 0) {
          l = 0;
        }
        this.seek(l);
      },
      mute: function() {
        var l = this.$html.find("button.mute");
        if (this.player.isMuted()) {
          this.player.unMute();
          if (l.hasClass("muted")) {
            l.removeClass("muted");
          }
        } else {
          this.player.mute();
          l.addClass("muted");
        }
      },
      volup: function() {
        var l = this.player.getVolume();
        if (l < (100 - this.config.volumeStep)) {
          l += this.config.volumeStep;
        } else {
          l = 100;
        }
        this.player.setVolume(l);
        this.updateVolume(l);
      },
      voldwn: function() {
        var l = this.player.getVolume();
        if (l > this.config.volumeStep) {
          l -= this.config.volumeStep;
        } else {
          l = 0;
        }
        this.player.setVolume(l);
        this.updateVolume(l);
      },
      getDuration: function() {
        return this.player.getDuration();
      },
      getCurrentTime: function() {
        return this.player.getCurrentTime();
      },
      getBytesLoaded: function() {
        return this.player.getVideoBytesLoaded();
      },
      getBytesTotal: function() {
        return this.player.getVideoBytesTotal();
      },
      seek: function(l) {
        this.player.seekTo(l);
        if (this.config.captionsOn && this.captions) {
          this.$html.find(".caption").remove();
          this.clearCaptionTimeout();
          this.setCaptionTimeout();
          this.getPreviousCaption();
        }
      },
      cue: function() {
        this.player.cueVideoById(this.config.media);
      },
      toggleCaptions: function() {
        var l = this;
        var m = this.$html.find(".captions");
        if (m.hasClass("captions-off")) {
          m.removeClass("captions-off").addClass("captions-on");
          l.getPreviousCaption();
          l.setCaptionTimeout();
          l.config.captionsOn = true;
        } else {
          m.removeClass("captions-on").addClass("captions-off");
          l.clearCaptionTimeout();
          l.$html.find(".caption").remove();
          l.config.captionsOn = false;
        }
      }
    };

    function j(l) {
      this.config = c;
      a.extend(true, this, d, f);
      this.is_html5 = false;
      var m = i(this);
      if (m && this.config.useHtml5) {
        this.config.media = m.src;
        this.is_html5 = true;
        this.$html = this.assembleHTML5(m.container, m.mimetype);
        a.extend(this, html5_methods);
      } else {
        if ((this.config.media instanceof Array) && (typeof this.config.media.push !== "undefined")) {
          this.config.media = this.config.media[0];
        }
        this.$html = this.assembleHTML();
      }
      if (this.config.captions) {
        this.getCaptions();
      }
    }
    return this.each(function(n) {
      var p = a(this),
        o, m, l = function(q) {
          if (q.$html.width() > 580) {
            q.$html.addClass("player-wide");
          }
          if (q.is_html5) {
            q.player = document.getElementById(q.config.id);
          }
        };
      if (c.url.match(/^(http|https)\:\/\/www\.youtube\.com/)) {
        o = new window.NOMENSA.player.YoutubePlayer(c);
        m = new window.NOMENSA.player.MediaplayerDecorator(o);
        m.onPlayerReady(function() {
          l(m);
          this.getPlayer().setLoop(true);
        });
        m.init(p);
      } else {
        m = new j(n);
        p.html(m.$html);
        l(m);
        window.NOMENSA.player.PlayerDaemon.addPlayer(m);
      }
    });
  };
}(jQuery));
(function ($) {
  window.LCC = window.LCC || {};

  function parseYoutubeVideoId(string){
    if(string.indexOf('youtube.com') > -1){
      var i, _i, part, parts, params = {};
      parts = string.split('?');
      if (parts.length === 1){
        return;
      }
      parts = parts[1].split('&');
      for(i=0,_i=parts.length; i<_i; i++){
        part = parts[i].split('=');
        params[part[0]] = part[1];
      }
      return params.v;
    }
    if(string.indexOf('youtu.be') > -1){
      var parts = string.split('/');
      return parts.pop();
    }
  }

  function enhanceYoutubeVideoLinks($el){
    $el.find("a[href*='youtube.com']").each(function(i){
      var $link = $(this),
          videoId = parseYoutubeVideoId($link.attr('href')),
          $holder = $('<span class="media-player" />'),
          $captions = $link.siblings('.captions');

      if ($(this).attr("data-youtube-player") == "off") {
        // Don't convert this link to an embedded player
      } else {
        if(typeof videoId !== 'undefined'){
          $link.parent().replaceWith($holder);

          $holder.player({
            id: 'youtube-'+i,
            media: videoId,
            captions: $captions.length > 0 ? $captions.attr('href') : null,
            url: (document.location.protocol + '//www.youtube.com/apiplayer?enablejsapi=1&version=3&playerapiid=')
          });
        }
      }
    });
  }

  LCC.enhanceYoutubeVideoLinks = enhanceYoutubeVideoLinks;

  $(function(){
    LCC.enhanceYoutubeVideoLinks($('.media-container'));
  });
})(jQuery);(function(global, $) {
    "use strict";
    $(document).ready(function() {
        if($('#ms-designer-ribbon').length === 0) {
            return;
        }

        var elementPosTop = $('#ms-designer-ribbon').position().top;
        
        $(global).scroll(function() {
            var wintop = $(global).scrollTop(), docheight = $(document).height(), winheight = $(global).height();
            //if top of element is in view
            if (wintop > elementPosTop) {
                $('#ms-designer-ribbon').css({ "position":"fixed", "top":"0", "z-index":"700" });
            }
            else {
                $('#ms-designer-ribbon').css({ "position":"inherit" });
            }
        });
    });
})(window, jQuery);/*! jQuery UI - v1.12.1 - 2016-11-23
* http://jqueryui.com
* Includes: keycode.js, widgets/datepicker.js
* Copyright jQuery Foundation and other contributors; Licensed MIT */

(function( factory ) {
	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define([ "jquery" ], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}
}(function( $ ) {

$.ui = $.ui || {};

var version = $.ui.version = "1.12.1";


/*!
 * jQuery UI Keycode 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Keycode
//>>group: Core
//>>description: Provide keycodes as keynames
//>>docs: http://api.jqueryui.com/jQuery.ui.keyCode/


var keycode = $.ui.keyCode = {
	BACKSPACE: 8,
	COMMA: 188,
	DELETE: 46,
	DOWN: 40,
	END: 35,
	ENTER: 13,
	ESCAPE: 27,
	HOME: 36,
	LEFT: 37,
	PAGE_DOWN: 34,
	PAGE_UP: 33,
	PERIOD: 190,
	RIGHT: 39,
	SPACE: 32,
	TAB: 9,
	UP: 38
};


// jscs:disable maximumLineLength
/* jscs:disable requireCamelCaseOrUpperCaseIdentifiers */
/*!
 * jQuery UI Datepicker 1.12.1
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Datepicker
//>>group: Widgets
//>>description: Displays a calendar from an input or inline for selecting dates.
//>>docs: http://api.jqueryui.com/datepicker/
//>>demos: http://jqueryui.com/datepicker/
//>>css.structure: ../../themes/base/core.css
//>>css.structure: ../../themes/base/datepicker.css
//>>css.theme: ../../themes/base/theme.css



$.extend( $.ui, { datepicker: { version: "1.12.1" } } );

var datepicker_instActive;

function datepicker_getZindex( elem ) {
	var position, value;
	while ( elem.length && elem[ 0 ] !== document ) {

		// Ignore z-index if position is set to a value where z-index is ignored by the browser
		// This makes behavior of this function consistent across browsers
		// WebKit always returns auto if the element is positioned
		position = elem.css( "position" );
		if ( position === "absolute" || position === "relative" || position === "fixed" ) {

			// IE returns 0 when zIndex is not specified
			// other browsers return a string
			// we ignore the case of nested elements with an explicit value of 0
			// <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
			value = parseInt( elem.css( "zIndex" ), 10 );
			if ( !isNaN( value ) && value !== 0 ) {
				return value;
			}
		}
		elem = elem.parent();
	}

	return 0;
}
/* Date picker manager.
   Use the singleton instance of this class, $.datepicker, to interact with the date picker.
   Settings for (groups of) date pickers are maintained in an instance object,
   allowing multiple different settings on the same page. */

function Datepicker() {
	this._curInst = null; // The current instance in use
	this._keyEvent = false; // If the last event was a key event
	this._disabledInputs = []; // List of date picker inputs that have been disabled
	this._datepickerShowing = false; // True if the popup picker is showing , false if not
	this._inDialog = false; // True if showing within a "dialog", false if not
	this._mainDivId = "ui-datepicker-div"; // The ID of the main datepicker division
	this._inlineClass = "ui-datepicker-inline"; // The name of the inline marker class
	this._appendClass = "ui-datepicker-append"; // The name of the append marker class
	this._triggerClass = "ui-datepicker-trigger"; // The name of the trigger marker class
	this._dialogClass = "ui-datepicker-dialog"; // The name of the dialog marker class
	this._disableClass = "ui-datepicker-disabled"; // The name of the disabled covering marker class
	this._unselectableClass = "ui-datepicker-unselectable"; // The name of the unselectable cell marker class
	this._currentClass = "ui-datepicker-current-day"; // The name of the current day marker class
	this._dayOverClass = "ui-datepicker-days-cell-over"; // The name of the day hover marker class
	this.regional = []; // Available regional settings, indexed by language code
	this.regional[ "" ] = { // Default regional settings
		closeText: "Done", // Display text for close link
		prevText: "Prev", // Display text for previous month link
		nextText: "Next", // Display text for next month link
		currentText: "Today", // Display text for current month link
		monthNames: [ "January","February","March","April","May","June",
			"July","August","September","October","November","December" ], // Names of months for drop-down and formatting
		monthNamesShort: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ], // For formatting
		dayNames: [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ], // For formatting
		dayNamesShort: [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ], // For formatting
		dayNamesMin: [ "Su","Mo","Tu","We","Th","Fr","Sa" ], // Column headings for days starting at Sunday
		weekHeader: "Wk", // Column header for week of the year
		dateFormat: "mm/dd/yy", // See format options on parseDate
		firstDay: 0, // The first day of the week, Sun = 0, Mon = 1, ...
		isRTL: false, // True if right-to-left language, false if left-to-right
		showMonthAfterYear: false, // True if the year select precedes month, false for month then year
		yearSuffix: "" // Additional text to append to the year in the month headers
	};
	this._defaults = { // Global defaults for all the date picker instances
		showOn: "focus", // "focus" for popup on focus,
			// "button" for trigger button, or "both" for either
		showAnim: "fadeIn", // Name of jQuery animation for popup
		showOptions: {}, // Options for enhanced animations
		defaultDate: null, // Used when field is blank: actual date,
			// +/-number for offset from today, null for today
		appendText: "", // Display text following the input box, e.g. showing the format
		buttonText: "...", // Text for trigger button
		buttonImage: "", // URL for trigger button image
		buttonImageOnly: false, // True if the image appears alone, false if it appears on a button
		hideIfNoPrevNext: false, // True to hide next/previous month links
			// if not applicable, false to just disable them
		navigationAsDateFormat: false, // True if date formatting applied to prev/today/next links
		gotoCurrent: false, // True if today link goes back to current selection instead
		changeMonth: false, // True if month can be selected directly, false if only prev/next
		changeYear: false, // True if year can be selected directly, false if only prev/next
		yearRange: "c-10:c+10", // Range of years to display in drop-down,
			// either relative to today's year (-nn:+nn), relative to currently displayed year
			// (c-nn:c+nn), absolute (nnnn:nnnn), or a combination of the above (nnnn:-n)
		showOtherMonths: false, // True to show dates in other months, false to leave blank
		selectOtherMonths: false, // True to allow selection of dates in other months, false for unselectable
		showWeek: false, // True to show week of the year, false to not show it
		calculateWeek: this.iso8601Week, // How to calculate the week of the year,
			// takes a Date and returns the number of the week for it
		shortYearCutoff: "+10", // Short year values < this are in the current century,
			// > this are in the previous century,
			// string value starting with "+" for current year + value
		minDate: null, // The earliest selectable date, or null for no limit
		maxDate: null, // The latest selectable date, or null for no limit
		duration: "fast", // Duration of display/closure
		beforeShowDay: null, // Function that takes a date and returns an array with
			// [0] = true if selectable, false if not, [1] = custom CSS class name(s) or "",
			// [2] = cell title (optional), e.g. $.datepicker.noWeekends
		beforeShow: null, // Function that takes an input field and
			// returns a set of custom settings for the date picker
		onSelect: null, // Define a callback function when a date is selected
		onChangeMonthYear: null, // Define a callback function when the month or year is changed
		onClose: null, // Define a callback function when the datepicker is closed
		numberOfMonths: 1, // Number of months to show at a time
		showCurrentAtPos: 0, // The position in multipe months at which to show the current month (starting at 0)
		stepMonths: 1, // Number of months to step back/forward
		stepBigMonths: 12, // Number of months to step back/forward for the big links
		altField: "", // Selector for an alternate field to store selected dates into
		altFormat: "", // The date format to use for the alternate field
		constrainInput: true, // The input is constrained by the current date format
		showButtonPanel: false, // True to show button panel, false to not show it
		autoSize: false, // True to size the input for the date format, false to leave as is
		disabled: false // The initial disabled state
	};
	$.extend( this._defaults, this.regional[ "" ] );
	this.regional.en = $.extend( true, {}, this.regional[ "" ] );
	this.regional[ "en-US" ] = $.extend( true, {}, this.regional.en );
	this.dpDiv = datepicker_bindHover( $( "<div id='" + this._mainDivId + "' class='ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>" ) );
}

$.extend( Datepicker.prototype, {
	/* Class name added to elements to indicate already configured with a date picker. */
	markerClassName: "hasDatepicker",

	//Keep track of the maximum number of rows displayed (see #7043)
	maxRows: 4,

	// TODO rename to "widget" when switching to widget factory
	_widgetDatepicker: function() {
		return this.dpDiv;
	},

	/* Override the default settings for all instances of the date picker.
	 * @param  settings  object - the new settings to use as defaults (anonymous object)
	 * @return the manager object
	 */
	setDefaults: function( settings ) {
		datepicker_extendRemove( this._defaults, settings || {} );
		return this;
	},

	/* Attach the date picker to a jQuery selection.
	 * @param  target	element - the target input field or division or span
	 * @param  settings  object - the new settings to use for this date picker instance (anonymous)
	 */
	_attachDatepicker: function( target, settings ) {
		var nodeName, inline, inst;
		nodeName = target.nodeName.toLowerCase();
		inline = ( nodeName === "div" || nodeName === "span" );
		if ( !target.id ) {
			this.uuid += 1;
			target.id = "dp" + this.uuid;
		}
		inst = this._newInst( $( target ), inline );
		inst.settings = $.extend( {}, settings || {} );
		if ( nodeName === "input" ) {
			this._connectDatepicker( target, inst );
		} else if ( inline ) {
			this._inlineDatepicker( target, inst );
		}
	},

	/* Create a new instance object. */
	_newInst: function( target, inline ) {
		var id = target[ 0 ].id.replace( /([^A-Za-z0-9_\-])/g, "\\\\$1" ); // escape jQuery meta chars
		return { id: id, input: target, // associated target
			selectedDay: 0, selectedMonth: 0, selectedYear: 0, // current selection
			drawMonth: 0, drawYear: 0, // month being drawn
			inline: inline, // is datepicker inline or not
			dpDiv: ( !inline ? this.dpDiv : // presentation div
			datepicker_bindHover( $( "<div class='" + this._inlineClass + " ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>" ) ) ) };
	},

	/* Attach the date picker to an input field. */
	_connectDatepicker: function( target, inst ) {
		var input = $( target );
		inst.append = $( [] );
		inst.trigger = $( [] );
		if ( input.hasClass( this.markerClassName ) ) {
			return;
		}
		this._attachments( input, inst );
		input.addClass( this.markerClassName ).on( "keydown", this._doKeyDown ).
			on( "keypress", this._doKeyPress ).on( "keyup", this._doKeyUp );
		this._autoSize( inst );
		$.data( target, "datepicker", inst );

		//If disabled option is true, disable the datepicker once it has been attached to the input (see ticket #5665)
		if ( inst.settings.disabled ) {
			this._disableDatepicker( target );
		}
	},

	/* Make attachments based on settings. */
	_attachments: function( input, inst ) {
		var showOn, buttonText, buttonImage,
			appendText = this._get( inst, "appendText" ),
			isRTL = this._get( inst, "isRTL" );

		if ( inst.append ) {
			inst.append.remove();
		}
		if ( appendText ) {
			inst.append = $( "<span class='" + this._appendClass + "'>" + appendText + "</span>" );
			input[ isRTL ? "before" : "after" ]( inst.append );
		}

		input.off( "focus", this._showDatepicker );

		if ( inst.trigger ) {
			inst.trigger.remove();
		}

		showOn = this._get( inst, "showOn" );
		if ( showOn === "focus" || showOn === "both" ) { // pop-up date picker when in the marked field
			input.on( "focus", this._showDatepicker );
		}
		if ( showOn === "button" || showOn === "both" ) { // pop-up date picker when button clicked
			buttonText = this._get( inst, "buttonText" );
			buttonImage = this._get( inst, "buttonImage" );
			inst.trigger = $( this._get( inst, "buttonImageOnly" ) ?
				$( "<img/>" ).addClass( this._triggerClass ).
					attr( { src: buttonImage, alt: buttonText, title: buttonText } ) :
				$( "<button type='button'></button>" ).addClass( this._triggerClass ).
					html( !buttonImage ? buttonText : $( "<img/>" ).attr(
					{ src:buttonImage, alt:buttonText, title:buttonText } ) ) );
			input[ isRTL ? "before" : "after" ]( inst.trigger );
			inst.trigger.on( "click", function() {
				if ( $.datepicker._datepickerShowing && $.datepicker._lastInput === input[ 0 ] ) {
					$.datepicker._hideDatepicker();
				} else if ( $.datepicker._datepickerShowing && $.datepicker._lastInput !== input[ 0 ] ) {
					$.datepicker._hideDatepicker();
					$.datepicker._showDatepicker( input[ 0 ] );
				} else {
					$.datepicker._showDatepicker( input[ 0 ] );
				}
				return false;
			} );
		}
	},

	/* Apply the maximum length for the date format. */
	_autoSize: function( inst ) {
		if ( this._get( inst, "autoSize" ) && !inst.inline ) {
			var findMax, max, maxI, i,
				date = new Date( 2009, 12 - 1, 20 ), // Ensure double digits
				dateFormat = this._get( inst, "dateFormat" );

			if ( dateFormat.match( /[DM]/ ) ) {
				findMax = function( names ) {
					max = 0;
					maxI = 0;
					for ( i = 0; i < names.length; i++ ) {
						if ( names[ i ].length > max ) {
							max = names[ i ].length;
							maxI = i;
						}
					}
					return maxI;
				};
				date.setMonth( findMax( this._get( inst, ( dateFormat.match( /MM/ ) ?
					"monthNames" : "monthNamesShort" ) ) ) );
				date.setDate( findMax( this._get( inst, ( dateFormat.match( /DD/ ) ?
					"dayNames" : "dayNamesShort" ) ) ) + 20 - date.getDay() );
			}
			inst.input.attr( "size", this._formatDate( inst, date ).length );
		}
	},

	/* Attach an inline date picker to a div. */
	_inlineDatepicker: function( target, inst ) {
		var divSpan = $( target );
		if ( divSpan.hasClass( this.markerClassName ) ) {
			return;
		}
		divSpan.addClass( this.markerClassName ).append( inst.dpDiv );
		$.data( target, "datepicker", inst );
		this._setDate( inst, this._getDefaultDate( inst ), true );
		this._updateDatepicker( inst );
		this._updateAlternate( inst );

		//If disabled option is true, disable the datepicker before showing it (see ticket #5665)
		if ( inst.settings.disabled ) {
			this._disableDatepicker( target );
		}

		// Set display:block in place of inst.dpDiv.show() which won't work on disconnected elements
		// http://bugs.jqueryui.com/ticket/7552 - A Datepicker created on a detached div has zero height
		inst.dpDiv.css( "display", "block" );
	},

	/* Pop-up the date picker in a "dialog" box.
	 * @param  input element - ignored
	 * @param  date	string or Date - the initial date to display
	 * @param  onSelect  function - the function to call when a date is selected
	 * @param  settings  object - update the dialog date picker instance's settings (anonymous object)
	 * @param  pos int[2] - coordinates for the dialog's position within the screen or
	 *					event - with x/y coordinates or
	 *					leave empty for default (screen centre)
	 * @return the manager object
	 */
	_dialogDatepicker: function( input, date, onSelect, settings, pos ) {
		var id, browserWidth, browserHeight, scrollX, scrollY,
			inst = this._dialogInst; // internal instance

		if ( !inst ) {
			this.uuid += 1;
			id = "dp" + this.uuid;
			this._dialogInput = $( "<input type='text' id='" + id +
				"' style='position: absolute; top: -100px; width: 0px;'/>" );
			this._dialogInput.on( "keydown", this._doKeyDown );
			$( "body" ).append( this._dialogInput );
			inst = this._dialogInst = this._newInst( this._dialogInput, false );
			inst.settings = {};
			$.data( this._dialogInput[ 0 ], "datepicker", inst );
		}
		datepicker_extendRemove( inst.settings, settings || {} );
		date = ( date && date.constructor === Date ? this._formatDate( inst, date ) : date );
		this._dialogInput.val( date );

		this._pos = ( pos ? ( pos.length ? pos : [ pos.pageX, pos.pageY ] ) : null );
		if ( !this._pos ) {
			browserWidth = document.documentElement.clientWidth;
			browserHeight = document.documentElement.clientHeight;
			scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
			scrollY = document.documentElement.scrollTop || document.body.scrollTop;
			this._pos = // should use actual width/height below
				[ ( browserWidth / 2 ) - 100 + scrollX, ( browserHeight / 2 ) - 150 + scrollY ];
		}

		// Move input on screen for focus, but hidden behind dialog
		this._dialogInput.css( "left", ( this._pos[ 0 ] + 20 ) + "px" ).css( "top", this._pos[ 1 ] + "px" );
		inst.settings.onSelect = onSelect;
		this._inDialog = true;
		this.dpDiv.addClass( this._dialogClass );
		this._showDatepicker( this._dialogInput[ 0 ] );
		if ( $.blockUI ) {
			$.blockUI( this.dpDiv );
		}
		$.data( this._dialogInput[ 0 ], "datepicker", inst );
		return this;
	},

	/* Detach a datepicker from its control.
	 * @param  target	element - the target input field or division or span
	 */
	_destroyDatepicker: function( target ) {
		var nodeName,
			$target = $( target ),
			inst = $.data( target, "datepicker" );

		if ( !$target.hasClass( this.markerClassName ) ) {
			return;
		}

		nodeName = target.nodeName.toLowerCase();
		$.removeData( target, "datepicker" );
		if ( nodeName === "input" ) {
			inst.append.remove();
			inst.trigger.remove();
			$target.removeClass( this.markerClassName ).
				off( "focus", this._showDatepicker ).
				off( "keydown", this._doKeyDown ).
				off( "keypress", this._doKeyPress ).
				off( "keyup", this._doKeyUp );
		} else if ( nodeName === "div" || nodeName === "span" ) {
			$target.removeClass( this.markerClassName ).empty();
		}

		if ( datepicker_instActive === inst ) {
			datepicker_instActive = null;
		}
	},

	/* Enable the date picker to a jQuery selection.
	 * @param  target	element - the target input field or division or span
	 */
	_enableDatepicker: function( target ) {
		var nodeName, inline,
			$target = $( target ),
			inst = $.data( target, "datepicker" );

		if ( !$target.hasClass( this.markerClassName ) ) {
			return;
		}

		nodeName = target.nodeName.toLowerCase();
		if ( nodeName === "input" ) {
			target.disabled = false;
			inst.trigger.filter( "button" ).
				each( function() { this.disabled = false; } ).end().
				filter( "img" ).css( { opacity: "1.0", cursor: "" } );
		} else if ( nodeName === "div" || nodeName === "span" ) {
			inline = $target.children( "." + this._inlineClass );
			inline.children().removeClass( "ui-state-disabled" );
			inline.find( "select.ui-datepicker-month, select.ui-datepicker-year" ).
				prop( "disabled", false );
		}
		this._disabledInputs = $.map( this._disabledInputs,
			function( value ) { return ( value === target ? null : value ); } ); // delete entry
	},

	/* Disable the date picker to a jQuery selection.
	 * @param  target	element - the target input field or division or span
	 */
	_disableDatepicker: function( target ) {
		var nodeName, inline,
			$target = $( target ),
			inst = $.data( target, "datepicker" );

		if ( !$target.hasClass( this.markerClassName ) ) {
			return;
		}

		nodeName = target.nodeName.toLowerCase();
		if ( nodeName === "input" ) {
			target.disabled = true;
			inst.trigger.filter( "button" ).
				each( function() { this.disabled = true; } ).end().
				filter( "img" ).css( { opacity: "0.5", cursor: "default" } );
		} else if ( nodeName === "div" || nodeName === "span" ) {
			inline = $target.children( "." + this._inlineClass );
			inline.children().addClass( "ui-state-disabled" );
			inline.find( "select.ui-datepicker-month, select.ui-datepicker-year" ).
				prop( "disabled", true );
		}
		this._disabledInputs = $.map( this._disabledInputs,
			function( value ) { return ( value === target ? null : value ); } ); // delete entry
		this._disabledInputs[ this._disabledInputs.length ] = target;
	},

	/* Is the first field in a jQuery collection disabled as a datepicker?
	 * @param  target	element - the target input field or division or span
	 * @return boolean - true if disabled, false if enabled
	 */
	_isDisabledDatepicker: function( target ) {
		if ( !target ) {
			return false;
		}
		for ( var i = 0; i < this._disabledInputs.length; i++ ) {
			if ( this._disabledInputs[ i ] === target ) {
				return true;
			}
		}
		return false;
	},

	/* Retrieve the instance data for the target control.
	 * @param  target  element - the target input field or division or span
	 * @return  object - the associated instance data
	 * @throws  error if a jQuery problem getting data
	 */
	_getInst: function( target ) {
		try {
			return $.data( target, "datepicker" );
		}
		catch ( err ) {
			throw "Missing instance data for this datepicker";
		}
	},

	/* Update or retrieve the settings for a date picker attached to an input field or division.
	 * @param  target  element - the target input field or division or span
	 * @param  name	object - the new settings to update or
	 *				string - the name of the setting to change or retrieve,
	 *				when retrieving also "all" for all instance settings or
	 *				"defaults" for all global defaults
	 * @param  value   any - the new value for the setting
	 *				(omit if above is an object or to retrieve a value)
	 */
	_optionDatepicker: function( target, name, value ) {
		var settings, date, minDate, maxDate,
			inst = this._getInst( target );

		if ( arguments.length === 2 && typeof name === "string" ) {
			return ( name === "defaults" ? $.extend( {}, $.datepicker._defaults ) :
				( inst ? ( name === "all" ? $.extend( {}, inst.settings ) :
				this._get( inst, name ) ) : null ) );
		}

		settings = name || {};
		if ( typeof name === "string" ) {
			settings = {};
			settings[ name ] = value;
		}

		if ( inst ) {
			if ( this._curInst === inst ) {
				this._hideDatepicker();
			}

			date = this._getDateDatepicker( target, true );
			minDate = this._getMinMaxDate( inst, "min" );
			maxDate = this._getMinMaxDate( inst, "max" );
			datepicker_extendRemove( inst.settings, settings );

			// reformat the old minDate/maxDate values if dateFormat changes and a new minDate/maxDate isn't provided
			if ( minDate !== null && settings.dateFormat !== undefined && settings.minDate === undefined ) {
				inst.settings.minDate = this._formatDate( inst, minDate );
			}
			if ( maxDate !== null && settings.dateFormat !== undefined && settings.maxDate === undefined ) {
				inst.settings.maxDate = this._formatDate( inst, maxDate );
			}
			if ( "disabled" in settings ) {
				if ( settings.disabled ) {
					this._disableDatepicker( target );
				} else {
					this._enableDatepicker( target );
				}
			}
			this._attachments( $( target ), inst );
			this._autoSize( inst );
			this._setDate( inst, date );
			this._updateAlternate( inst );
			this._updateDatepicker( inst );
		}
	},

	// Change method deprecated
	_changeDatepicker: function( target, name, value ) {
		this._optionDatepicker( target, name, value );
	},

	/* Redraw the date picker attached to an input field or division.
	 * @param  target  element - the target input field or division or span
	 */
	_refreshDatepicker: function( target ) {
		var inst = this._getInst( target );
		if ( inst ) {
			this._updateDatepicker( inst );
		}
	},

	/* Set the dates for a jQuery selection.
	 * @param  target element - the target input field or division or span
	 * @param  date	Date - the new date
	 */
	_setDateDatepicker: function( target, date ) {
		var inst = this._getInst( target );
		if ( inst ) {
			this._setDate( inst, date );
			this._updateDatepicker( inst );
			this._updateAlternate( inst );
		}
	},

	/* Get the date(s) for the first entry in a jQuery selection.
	 * @param  target element - the target input field or division or span
	 * @param  noDefault boolean - true if no default date is to be used
	 * @return Date - the current date
	 */
	_getDateDatepicker: function( target, noDefault ) {
		var inst = this._getInst( target );
		if ( inst && !inst.inline ) {
			this._setDateFromField( inst, noDefault );
		}
		return ( inst ? this._getDate( inst ) : null );
	},

	/* Handle keystrokes. */
	_doKeyDown: function( event ) {
		var onSelect, dateStr, sel,
			inst = $.datepicker._getInst( event.target ),
			handled = true,
			isRTL = inst.dpDiv.is( ".ui-datepicker-rtl" );

		inst._keyEvent = true;
		if ( $.datepicker._datepickerShowing ) {
			switch ( event.keyCode ) {
				case 9: $.datepicker._hideDatepicker();
						handled = false;
						break; // hide on tab out
				case 13: sel = $( "td." + $.datepicker._dayOverClass + ":not(." +
									$.datepicker._currentClass + ")", inst.dpDiv );
						if ( sel[ 0 ] ) {
							$.datepicker._selectDay( event.target, inst.selectedMonth, inst.selectedYear, sel[ 0 ] );
						}

						onSelect = $.datepicker._get( inst, "onSelect" );
						if ( onSelect ) {
							dateStr = $.datepicker._formatDate( inst );

							// Trigger custom callback
							onSelect.apply( ( inst.input ? inst.input[ 0 ] : null ), [ dateStr, inst ] );
						} else {
							$.datepicker._hideDatepicker();
						}

						return false; // don't submit the form
				case 27: $.datepicker._hideDatepicker();
						break; // hide on escape
				case 33: $.datepicker._adjustDate( event.target, ( event.ctrlKey ?
							-$.datepicker._get( inst, "stepBigMonths" ) :
							-$.datepicker._get( inst, "stepMonths" ) ), "M" );
						break; // previous month/year on page up/+ ctrl
				case 34: $.datepicker._adjustDate( event.target, ( event.ctrlKey ?
							+$.datepicker._get( inst, "stepBigMonths" ) :
							+$.datepicker._get( inst, "stepMonths" ) ), "M" );
						break; // next month/year on page down/+ ctrl
				case 35: if ( event.ctrlKey || event.metaKey ) {
							$.datepicker._clearDate( event.target );
						}
						handled = event.ctrlKey || event.metaKey;
						break; // clear on ctrl or command +end
				case 36: if ( event.ctrlKey || event.metaKey ) {
							$.datepicker._gotoToday( event.target );
						}
						handled = event.ctrlKey || event.metaKey;
						break; // current on ctrl or command +home
				case 37: if ( event.ctrlKey || event.metaKey ) {
							$.datepicker._adjustDate( event.target, ( isRTL ? +1 : -1 ), "D" );
						}
						handled = event.ctrlKey || event.metaKey;

						// -1 day on ctrl or command +left
						if ( event.originalEvent.altKey ) {
							$.datepicker._adjustDate( event.target, ( event.ctrlKey ?
								-$.datepicker._get( inst, "stepBigMonths" ) :
								-$.datepicker._get( inst, "stepMonths" ) ), "M" );
						}

						// next month/year on alt +left on Mac
						break;
				case 38: if ( event.ctrlKey || event.metaKey ) {
							$.datepicker._adjustDate( event.target, -7, "D" );
						}
						handled = event.ctrlKey || event.metaKey;
						break; // -1 week on ctrl or command +up
				case 39: if ( event.ctrlKey || event.metaKey ) {
							$.datepicker._adjustDate( event.target, ( isRTL ? -1 : +1 ), "D" );
						}
						handled = event.ctrlKey || event.metaKey;

						// +1 day on ctrl or command +right
						if ( event.originalEvent.altKey ) {
							$.datepicker._adjustDate( event.target, ( event.ctrlKey ?
								+$.datepicker._get( inst, "stepBigMonths" ) :
								+$.datepicker._get( inst, "stepMonths" ) ), "M" );
						}

						// next month/year on alt +right
						break;
				case 40: if ( event.ctrlKey || event.metaKey ) {
							$.datepicker._adjustDate( event.target, +7, "D" );
						}
						handled = event.ctrlKey || event.metaKey;
						break; // +1 week on ctrl or command +down
				default: handled = false;
			}
		} else if ( event.keyCode === 36 && event.ctrlKey ) { // display the date picker on ctrl+home
			$.datepicker._showDatepicker( this );
		} else {
			handled = false;
		}

		if ( handled ) {
			event.preventDefault();
			event.stopPropagation();
		}
	},

	/* Filter entered characters - based on date format. */
	_doKeyPress: function( event ) {
		var chars, chr,
			inst = $.datepicker._getInst( event.target );

		if ( $.datepicker._get( inst, "constrainInput" ) ) {
			chars = $.datepicker._possibleChars( $.datepicker._get( inst, "dateFormat" ) );
			chr = String.fromCharCode( event.charCode == null ? event.keyCode : event.charCode );
			return event.ctrlKey || event.metaKey || ( chr < " " || !chars || chars.indexOf( chr ) > -1 );
		}
	},

	/* Synchronise manual entry and field/alternate field. */
	_doKeyUp: function( event ) {
		var date,
			inst = $.datepicker._getInst( event.target );

		if ( inst.input.val() !== inst.lastVal ) {
			try {
				date = $.datepicker.parseDate( $.datepicker._get( inst, "dateFormat" ),
					( inst.input ? inst.input.val() : null ),
					$.datepicker._getFormatConfig( inst ) );

				if ( date ) { // only if valid
					$.datepicker._setDateFromField( inst );
					$.datepicker._updateAlternate( inst );
					$.datepicker._updateDatepicker( inst );
				}
			}
			catch ( err ) {
			}
		}
		return true;
	},

	/* Pop-up the date picker for a given input field.
	 * If false returned from beforeShow event handler do not show.
	 * @param  input  element - the input field attached to the date picker or
	 *					event - if triggered by focus
	 */
	_showDatepicker: function( input ) {
		input = input.target || input;
		if ( input.nodeName.toLowerCase() !== "input" ) { // find from button/image trigger
			input = $( "input", input.parentNode )[ 0 ];
		}

		if ( $.datepicker._isDisabledDatepicker( input ) || $.datepicker._lastInput === input ) { // already here
			return;
		}

		var inst, beforeShow, beforeShowSettings, isFixed,
			offset, showAnim, duration;

		inst = $.datepicker._getInst( input );
		if ( $.datepicker._curInst && $.datepicker._curInst !== inst ) {
			$.datepicker._curInst.dpDiv.stop( true, true );
			if ( inst && $.datepicker._datepickerShowing ) {
				$.datepicker._hideDatepicker( $.datepicker._curInst.input[ 0 ] );
			}
		}

		beforeShow = $.datepicker._get( inst, "beforeShow" );
		beforeShowSettings = beforeShow ? beforeShow.apply( input, [ input, inst ] ) : {};
		if ( beforeShowSettings === false ) {
			return;
		}
		datepicker_extendRemove( inst.settings, beforeShowSettings );

		inst.lastVal = null;
		$.datepicker._lastInput = input;
		$.datepicker._setDateFromField( inst );

		if ( $.datepicker._inDialog ) { // hide cursor
			input.value = "";
		}
		if ( !$.datepicker._pos ) { // position below input
			$.datepicker._pos = $.datepicker._findPos( input );
			$.datepicker._pos[ 1 ] += input.offsetHeight; // add the height
		}

		isFixed = false;
		$( input ).parents().each( function() {
			isFixed |= $( this ).css( "position" ) === "fixed";
			return !isFixed;
		} );

		offset = { left: $.datepicker._pos[ 0 ], top: $.datepicker._pos[ 1 ] };
		$.datepicker._pos = null;

		//to avoid flashes on Firefox
		inst.dpDiv.empty();

		// determine sizing offscreen
		inst.dpDiv.css( { position: "absolute", display: "block", top: "-1000px" } );
		$.datepicker._updateDatepicker( inst );

		// fix width for dynamic number of date pickers
		// and adjust position before showing
		offset = $.datepicker._checkOffset( inst, offset, isFixed );
		inst.dpDiv.css( { position: ( $.datepicker._inDialog && $.blockUI ?
			"static" : ( isFixed ? "fixed" : "absolute" ) ), display: "none",
			left: offset.left + "px", top: offset.top + "px" } );

		if ( !inst.inline ) {
			showAnim = $.datepicker._get( inst, "showAnim" );
			duration = $.datepicker._get( inst, "duration" );
			inst.dpDiv.css( "z-index", datepicker_getZindex( $( input ) ) + 1 );
			$.datepicker._datepickerShowing = true;

			if ( $.effects && $.effects.effect[ showAnim ] ) {
				inst.dpDiv.show( showAnim, $.datepicker._get( inst, "showOptions" ), duration );
			} else {
				inst.dpDiv[ showAnim || "show" ]( showAnim ? duration : null );
			}

			if ( $.datepicker._shouldFocusInput( inst ) ) {
				inst.input.trigger( "focus" );
			}

			$.datepicker._curInst = inst;
		}
	},

	/* Generate the date picker content. */
	_updateDatepicker: function( inst ) {
		this.maxRows = 4; //Reset the max number of rows being displayed (see #7043)
		datepicker_instActive = inst; // for delegate hover events
		inst.dpDiv.empty().append( this._generateHTML( inst ) );
		this._attachHandlers( inst );

		var origyearshtml,
			numMonths = this._getNumberOfMonths( inst ),
			cols = numMonths[ 1 ],
			width = 17,
			activeCell = inst.dpDiv.find( "." + this._dayOverClass + " a" );

		if ( activeCell.length > 0 ) {
			datepicker_handleMouseover.apply( activeCell.get( 0 ) );
		}

		inst.dpDiv.removeClass( "ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4" ).width( "" );
		if ( cols > 1 ) {
			inst.dpDiv.addClass( "ui-datepicker-multi-" + cols ).css( "width", ( width * cols ) + "em" );
		}
		inst.dpDiv[ ( numMonths[ 0 ] !== 1 || numMonths[ 1 ] !== 1 ? "add" : "remove" ) +
			"Class" ]( "ui-datepicker-multi" );
		inst.dpDiv[ ( this._get( inst, "isRTL" ) ? "add" : "remove" ) +
			"Class" ]( "ui-datepicker-rtl" );

		if ( inst === $.datepicker._curInst && $.datepicker._datepickerShowing && $.datepicker._shouldFocusInput( inst ) ) {
			inst.input.trigger( "focus" );
		}

		// Deffered render of the years select (to avoid flashes on Firefox)
		if ( inst.yearshtml ) {
			origyearshtml = inst.yearshtml;
			setTimeout( function() {

				//assure that inst.yearshtml didn't change.
				if ( origyearshtml === inst.yearshtml && inst.yearshtml ) {
					inst.dpDiv.find( "select.ui-datepicker-year:first" ).replaceWith( inst.yearshtml );
				}
				origyearshtml = inst.yearshtml = null;
			}, 0 );
		}
	},

	// #6694 - don't focus the input if it's already focused
	// this breaks the change event in IE
	// Support: IE and jQuery <1.9
	_shouldFocusInput: function( inst ) {
		return inst.input && inst.input.is( ":visible" ) && !inst.input.is( ":disabled" ) && !inst.input.is( ":focus" );
	},

	/* Check positioning to remain on screen. */
	_checkOffset: function( inst, offset, isFixed ) {
		var dpWidth = inst.dpDiv.outerWidth(),
			dpHeight = inst.dpDiv.outerHeight(),
			inputWidth = inst.input ? inst.input.outerWidth() : 0,
			inputHeight = inst.input ? inst.input.outerHeight() : 0,
			viewWidth = document.documentElement.clientWidth + ( isFixed ? 0 : $( document ).scrollLeft() ),
			viewHeight = document.documentElement.clientHeight + ( isFixed ? 0 : $( document ).scrollTop() );

		offset.left -= ( this._get( inst, "isRTL" ) ? ( dpWidth - inputWidth ) : 0 );
		offset.left -= ( isFixed && offset.left === inst.input.offset().left ) ? $( document ).scrollLeft() : 0;
		offset.top -= ( isFixed && offset.top === ( inst.input.offset().top + inputHeight ) ) ? $( document ).scrollTop() : 0;

		// Now check if datepicker is showing outside window viewport - move to a better place if so.
		offset.left -= Math.min( offset.left, ( offset.left + dpWidth > viewWidth && viewWidth > dpWidth ) ?
			Math.abs( offset.left + dpWidth - viewWidth ) : 0 );
		offset.top -= Math.min( offset.top, ( offset.top + dpHeight > viewHeight && viewHeight > dpHeight ) ?
			Math.abs( dpHeight + inputHeight ) : 0 );

		return offset;
	},

	/* Find an object's position on the screen. */
	_findPos: function( obj ) {
		var position,
			inst = this._getInst( obj ),
			isRTL = this._get( inst, "isRTL" );

		while ( obj && ( obj.type === "hidden" || obj.nodeType !== 1 || $.expr.filters.hidden( obj ) ) ) {
			obj = obj[ isRTL ? "previousSibling" : "nextSibling" ];
		}

		position = $( obj ).offset();
		return [ position.left, position.top ];
	},

	/* Hide the date picker from view.
	 * @param  input  element - the input field attached to the date picker
	 */
	_hideDatepicker: function( input ) {
		var showAnim, duration, postProcess, onClose,
			inst = this._curInst;

		if ( !inst || ( input && inst !== $.data( input, "datepicker" ) ) ) {
			return;
		}

		if ( this._datepickerShowing ) {
			showAnim = this._get( inst, "showAnim" );
			duration = this._get( inst, "duration" );
			postProcess = function() {
				$.datepicker._tidyDialog( inst );
			};

			// DEPRECATED: after BC for 1.8.x $.effects[ showAnim ] is not needed
			if ( $.effects && ( $.effects.effect[ showAnim ] || $.effects[ showAnim ] ) ) {
				inst.dpDiv.hide( showAnim, $.datepicker._get( inst, "showOptions" ), duration, postProcess );
			} else {
				inst.dpDiv[ ( showAnim === "slideDown" ? "slideUp" :
					( showAnim === "fadeIn" ? "fadeOut" : "hide" ) ) ]( ( showAnim ? duration : null ), postProcess );
			}

			if ( !showAnim ) {
				postProcess();
			}
			this._datepickerShowing = false;

			onClose = this._get( inst, "onClose" );
			if ( onClose ) {
				onClose.apply( ( inst.input ? inst.input[ 0 ] : null ), [ ( inst.input ? inst.input.val() : "" ), inst ] );
			}

			this._lastInput = null;
			if ( this._inDialog ) {
				this._dialogInput.css( { position: "absolute", left: "0", top: "-100px" } );
				if ( $.blockUI ) {
					$.unblockUI();
					$( "body" ).append( this.dpDiv );
				}
			}
			this._inDialog = false;
		}
	},

	/* Tidy up after a dialog display. */
	_tidyDialog: function( inst ) {
		inst.dpDiv.removeClass( this._dialogClass ).off( ".ui-datepicker-calendar" );
	},

	/* Close date picker if clicked elsewhere. */
	_checkExternalClick: function( event ) {
		if ( !$.datepicker._curInst ) {
			return;
		}

		var $target = $( event.target ),
			inst = $.datepicker._getInst( $target[ 0 ] );

		if ( ( ( $target[ 0 ].id !== $.datepicker._mainDivId &&
				$target.parents( "#" + $.datepicker._mainDivId ).length === 0 &&
				!$target.hasClass( $.datepicker.markerClassName ) &&
				!$target.closest( "." + $.datepicker._triggerClass ).length &&
				$.datepicker._datepickerShowing && !( $.datepicker._inDialog && $.blockUI ) ) ) ||
			( $target.hasClass( $.datepicker.markerClassName ) && $.datepicker._curInst !== inst ) ) {
				$.datepicker._hideDatepicker();
		}
	},

	/* Adjust one of the date sub-fields. */
	_adjustDate: function( id, offset, period ) {
		var target = $( id ),
			inst = this._getInst( target[ 0 ] );

		if ( this._isDisabledDatepicker( target[ 0 ] ) ) {
			return;
		}
		this._adjustInstDate( inst, offset +
			( period === "M" ? this._get( inst, "showCurrentAtPos" ) : 0 ), // undo positioning
			period );
		this._updateDatepicker( inst );
	},

	/* Action for current link. */
	_gotoToday: function( id ) {
		var date,
			target = $( id ),
			inst = this._getInst( target[ 0 ] );

		if ( this._get( inst, "gotoCurrent" ) && inst.currentDay ) {
			inst.selectedDay = inst.currentDay;
			inst.drawMonth = inst.selectedMonth = inst.currentMonth;
			inst.drawYear = inst.selectedYear = inst.currentYear;
		} else {
			date = new Date();
			inst.selectedDay = date.getDate();
			inst.drawMonth = inst.selectedMonth = date.getMonth();
			inst.drawYear = inst.selectedYear = date.getFullYear();
		}
		this._notifyChange( inst );
		this._adjustDate( target );
	},

	/* Action for selecting a new month/year. */
	_selectMonthYear: function( id, select, period ) {
		var target = $( id ),
			inst = this._getInst( target[ 0 ] );

		inst[ "selected" + ( period === "M" ? "Month" : "Year" ) ] =
		inst[ "draw" + ( period === "M" ? "Month" : "Year" ) ] =
			parseInt( select.options[ select.selectedIndex ].value, 10 );

		this._notifyChange( inst );
		this._adjustDate( target );
	},

	/* Action for selecting a day. */
	_selectDay: function( id, month, year, td ) {
		var inst,
			target = $( id );

		if ( $( td ).hasClass( this._unselectableClass ) || this._isDisabledDatepicker( target[ 0 ] ) ) {
			return;
		}

		inst = this._getInst( target[ 0 ] );
		inst.selectedDay = inst.currentDay = $( "a", td ).html();
		inst.selectedMonth = inst.currentMonth = month;
		inst.selectedYear = inst.currentYear = year;
		this._selectDate( id, this._formatDate( inst,
			inst.currentDay, inst.currentMonth, inst.currentYear ) );
	},

	/* Erase the input field and hide the date picker. */
	_clearDate: function( id ) {
		var target = $( id );
		this._selectDate( target, "" );
	},

	/* Update the input field with the selected date. */
	_selectDate: function( id, dateStr ) {
		var onSelect,
			target = $( id ),
			inst = this._getInst( target[ 0 ] );

		dateStr = ( dateStr != null ? dateStr : this._formatDate( inst ) );
		if ( inst.input ) {
			inst.input.val( dateStr );
		}
		this._updateAlternate( inst );

		onSelect = this._get( inst, "onSelect" );
		if ( onSelect ) {
			onSelect.apply( ( inst.input ? inst.input[ 0 ] : null ), [ dateStr, inst ] );  // trigger custom callback
		} else if ( inst.input ) {
			inst.input.trigger( "change" ); // fire the change event
		}

		if ( inst.inline ) {
			this._updateDatepicker( inst );
		} else {
			this._hideDatepicker();
			this._lastInput = inst.input[ 0 ];
			if ( typeof( inst.input[ 0 ] ) !== "object" ) {
				inst.input.trigger( "focus" ); // restore focus
			}
			this._lastInput = null;
		}
	},

	/* Update any alternate field to synchronise with the main field. */
	_updateAlternate: function( inst ) {
		var altFormat, date, dateStr,
			altField = this._get( inst, "altField" );

		if ( altField ) { // update alternate field too
			altFormat = this._get( inst, "altFormat" ) || this._get( inst, "dateFormat" );
			date = this._getDate( inst );
			dateStr = this.formatDate( altFormat, date, this._getFormatConfig( inst ) );
			$( altField ).val( dateStr );
		}
	},

	/* Set as beforeShowDay function to prevent selection of weekends.
	 * @param  date  Date - the date to customise
	 * @return [boolean, string] - is this date selectable?, what is its CSS class?
	 */
	noWeekends: function( date ) {
		var day = date.getDay();
		return [ ( day > 0 && day < 6 ), "" ];
	},

	/* Set as calculateWeek to determine the week of the year based on the ISO 8601 definition.
	 * @param  date  Date - the date to get the week for
	 * @return  number - the number of the week within the year that contains this date
	 */
	iso8601Week: function( date ) {
		var time,
			checkDate = new Date( date.getTime() );

		// Find Thursday of this week starting on Monday
		checkDate.setDate( checkDate.getDate() + 4 - ( checkDate.getDay() || 7 ) );

		time = checkDate.getTime();
		checkDate.setMonth( 0 ); // Compare with Jan 1
		checkDate.setDate( 1 );
		return Math.floor( Math.round( ( time - checkDate ) / 86400000 ) / 7 ) + 1;
	},

	/* Parse a string value into a date object.
	 * See formatDate below for the possible formats.
	 *
	 * @param  format string - the expected format of the date
	 * @param  value string - the date in the above format
	 * @param  settings Object - attributes include:
	 *					shortYearCutoff  number - the cutoff year for determining the century (optional)
	 *					dayNamesShort	string[7] - abbreviated names of the days from Sunday (optional)
	 *					dayNames		string[7] - names of the days from Sunday (optional)
	 *					monthNamesShort string[12] - abbreviated names of the months (optional)
	 *					monthNames		string[12] - names of the months (optional)
	 * @return  Date - the extracted date value or null if value is blank
	 */
	parseDate: function( format, value, settings ) {
		if ( format == null || value == null ) {
			throw "Invalid arguments";
		}

		value = ( typeof value === "object" ? value.toString() : value + "" );
		if ( value === "" ) {
			return null;
		}

		var iFormat, dim, extra,
			iValue = 0,
			shortYearCutoffTemp = ( settings ? settings.shortYearCutoff : null ) || this._defaults.shortYearCutoff,
			shortYearCutoff = ( typeof shortYearCutoffTemp !== "string" ? shortYearCutoffTemp :
				new Date().getFullYear() % 100 + parseInt( shortYearCutoffTemp, 10 ) ),
			dayNamesShort = ( settings ? settings.dayNamesShort : null ) || this._defaults.dayNamesShort,
			dayNames = ( settings ? settings.dayNames : null ) || this._defaults.dayNames,
			monthNamesShort = ( settings ? settings.monthNamesShort : null ) || this._defaults.monthNamesShort,
			monthNames = ( settings ? settings.monthNames : null ) || this._defaults.monthNames,
			year = -1,
			month = -1,
			day = -1,
			doy = -1,
			literal = false,
			date,

			// Check whether a format character is doubled
			lookAhead = function( match ) {
				var matches = ( iFormat + 1 < format.length && format.charAt( iFormat + 1 ) === match );
				if ( matches ) {
					iFormat++;
				}
				return matches;
			},

			// Extract a number from the string value
			getNumber = function( match ) {
				var isDoubled = lookAhead( match ),
					size = ( match === "@" ? 14 : ( match === "!" ? 20 :
					( match === "y" && isDoubled ? 4 : ( match === "o" ? 3 : 2 ) ) ) ),
					minSize = ( match === "y" ? size : 1 ),
					digits = new RegExp( "^\\d{" + minSize + "," + size + "}" ),
					num = value.substring( iValue ).match( digits );
				if ( !num ) {
					throw "Missing number at position " + iValue;
				}
				iValue += num[ 0 ].length;
				return parseInt( num[ 0 ], 10 );
			},

			// Extract a name from the string value and convert to an index
			getName = function( match, shortNames, longNames ) {
				var index = -1,
					names = $.map( lookAhead( match ) ? longNames : shortNames, function( v, k ) {
						return [ [ k, v ] ];
					} ).sort( function( a, b ) {
						return -( a[ 1 ].length - b[ 1 ].length );
					} );

				$.each( names, function( i, pair ) {
					var name = pair[ 1 ];
					if ( value.substr( iValue, name.length ).toLowerCase() === name.toLowerCase() ) {
						index = pair[ 0 ];
						iValue += name.length;
						return false;
					}
				} );
				if ( index !== -1 ) {
					return index + 1;
				} else {
					throw "Unknown name at position " + iValue;
				}
			},

			// Confirm that a literal character matches the string value
			checkLiteral = function() {
				if ( value.charAt( iValue ) !== format.charAt( iFormat ) ) {
					throw "Unexpected literal at position " + iValue;
				}
				iValue++;
			};

		for ( iFormat = 0; iFormat < format.length; iFormat++ ) {
			if ( literal ) {
				if ( format.charAt( iFormat ) === "'" && !lookAhead( "'" ) ) {
					literal = false;
				} else {
					checkLiteral();
				}
			} else {
				switch ( format.charAt( iFormat ) ) {
					case "d":
						day = getNumber( "d" );
						break;
					case "D":
						getName( "D", dayNamesShort, dayNames );
						break;
					case "o":
						doy = getNumber( "o" );
						break;
					case "m":
						month = getNumber( "m" );
						break;
					case "M":
						month = getName( "M", monthNamesShort, monthNames );
						break;
					case "y":
						year = getNumber( "y" );
						break;
					case "@":
						date = new Date( getNumber( "@" ) );
						year = date.getFullYear();
						month = date.getMonth() + 1;
						day = date.getDate();
						break;
					case "!":
						date = new Date( ( getNumber( "!" ) - this._ticksTo1970 ) / 10000 );
						year = date.getFullYear();
						month = date.getMonth() + 1;
						day = date.getDate();
						break;
					case "'":
						if ( lookAhead( "'" ) ) {
							checkLiteral();
						} else {
							literal = true;
						}
						break;
					default:
						checkLiteral();
				}
			}
		}

		if ( iValue < value.length ) {
			extra = value.substr( iValue );
			if ( !/^\s+/.test( extra ) ) {
				throw "Extra/unparsed characters found in date: " + extra;
			}
		}

		if ( year === -1 ) {
			year = new Date().getFullYear();
		} else if ( year < 100 ) {
			year += new Date().getFullYear() - new Date().getFullYear() % 100 +
				( year <= shortYearCutoff ? 0 : -100 );
		}

		if ( doy > -1 ) {
			month = 1;
			day = doy;
			do {
				dim = this._getDaysInMonth( year, month - 1 );
				if ( day <= dim ) {
					break;
				}
				month++;
				day -= dim;
			} while ( true );
		}

		date = this._daylightSavingAdjust( new Date( year, month - 1, day ) );
		if ( date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day ) {
			throw "Invalid date"; // E.g. 31/02/00
		}
		return date;
	},

	/* Standard date formats. */
	ATOM: "yy-mm-dd", // RFC 3339 (ISO 8601)
	COOKIE: "D, dd M yy",
	ISO_8601: "yy-mm-dd",
	RFC_822: "D, d M y",
	RFC_850: "DD, dd-M-y",
	RFC_1036: "D, d M y",
	RFC_1123: "D, d M yy",
	RFC_2822: "D, d M yy",
	RSS: "D, d M y", // RFC 822
	TICKS: "!",
	TIMESTAMP: "@",
	W3C: "yy-mm-dd", // ISO 8601

	_ticksTo1970: ( ( ( 1970 - 1 ) * 365 + Math.floor( 1970 / 4 ) - Math.floor( 1970 / 100 ) +
		Math.floor( 1970 / 400 ) ) * 24 * 60 * 60 * 10000000 ),

	/* Format a date object into a string value.
	 * The format can be combinations of the following:
	 * d  - day of month (no leading zero)
	 * dd - day of month (two digit)
	 * o  - day of year (no leading zeros)
	 * oo - day of year (three digit)
	 * D  - day name short
	 * DD - day name long
	 * m  - month of year (no leading zero)
	 * mm - month of year (two digit)
	 * M  - month name short
	 * MM - month name long
	 * y  - year (two digit)
	 * yy - year (four digit)
	 * @ - Unix timestamp (ms since 01/01/1970)
	 * ! - Windows ticks (100ns since 01/01/0001)
	 * "..." - literal text
	 * '' - single quote
	 *
	 * @param  format string - the desired format of the date
	 * @param  date Date - the date value to format
	 * @param  settings Object - attributes include:
	 *					dayNamesShort	string[7] - abbreviated names of the days from Sunday (optional)
	 *					dayNames		string[7] - names of the days from Sunday (optional)
	 *					monthNamesShort string[12] - abbreviated names of the months (optional)
	 *					monthNames		string[12] - names of the months (optional)
	 * @return  string - the date in the above format
	 */
	formatDate: function( format, date, settings ) {
		if ( !date ) {
			return "";
		}

		var iFormat,
			dayNamesShort = ( settings ? settings.dayNamesShort : null ) || this._defaults.dayNamesShort,
			dayNames = ( settings ? settings.dayNames : null ) || this._defaults.dayNames,
			monthNamesShort = ( settings ? settings.monthNamesShort : null ) || this._defaults.monthNamesShort,
			monthNames = ( settings ? settings.monthNames : null ) || this._defaults.monthNames,

			// Check whether a format character is doubled
			lookAhead = function( match ) {
				var matches = ( iFormat + 1 < format.length && format.charAt( iFormat + 1 ) === match );
				if ( matches ) {
					iFormat++;
				}
				return matches;
			},

			// Format a number, with leading zero if necessary
			formatNumber = function( match, value, len ) {
				var num = "" + value;
				if ( lookAhead( match ) ) {
					while ( num.length < len ) {
						num = "0" + num;
					}
				}
				return num;
			},

			// Format a name, short or long as requested
			formatName = function( match, value, shortNames, longNames ) {
				return ( lookAhead( match ) ? longNames[ value ] : shortNames[ value ] );
			},
			output = "",
			literal = false;

		if ( date ) {
			for ( iFormat = 0; iFormat < format.length; iFormat++ ) {
				if ( literal ) {
					if ( format.charAt( iFormat ) === "'" && !lookAhead( "'" ) ) {
						literal = false;
					} else {
						output += format.charAt( iFormat );
					}
				} else {
					switch ( format.charAt( iFormat ) ) {
						case "d":
							output += formatNumber( "d", date.getDate(), 2 );
							break;
						case "D":
							output += formatName( "D", date.getDay(), dayNamesShort, dayNames );
							break;
						case "o":
							output += formatNumber( "o",
								Math.round( ( new Date( date.getFullYear(), date.getMonth(), date.getDate() ).getTime() - new Date( date.getFullYear(), 0, 0 ).getTime() ) / 86400000 ), 3 );
							break;
						case "m":
							output += formatNumber( "m", date.getMonth() + 1, 2 );
							break;
						case "M":
							output += formatName( "M", date.getMonth(), monthNamesShort, monthNames );
							break;
						case "y":
							output += ( lookAhead( "y" ) ? date.getFullYear() :
								( date.getFullYear() % 100 < 10 ? "0" : "" ) + date.getFullYear() % 100 );
							break;
						case "@":
							output += date.getTime();
							break;
						case "!":
							output += date.getTime() * 10000 + this._ticksTo1970;
							break;
						case "'":
							if ( lookAhead( "'" ) ) {
								output += "'";
							} else {
								literal = true;
							}
							break;
						default:
							output += format.charAt( iFormat );
					}
				}
			}
		}
		return output;
	},

	/* Extract all possible characters from the date format. */
	_possibleChars: function( format ) {
		var iFormat,
			chars = "",
			literal = false,

			// Check whether a format character is doubled
			lookAhead = function( match ) {
				var matches = ( iFormat + 1 < format.length && format.charAt( iFormat + 1 ) === match );
				if ( matches ) {
					iFormat++;
				}
				return matches;
			};

		for ( iFormat = 0; iFormat < format.length; iFormat++ ) {
			if ( literal ) {
				if ( format.charAt( iFormat ) === "'" && !lookAhead( "'" ) ) {
					literal = false;
				} else {
					chars += format.charAt( iFormat );
				}
			} else {
				switch ( format.charAt( iFormat ) ) {
					case "d": case "m": case "y": case "@":
						chars += "0123456789";
						break;
					case "D": case "M":
						return null; // Accept anything
					case "'":
						if ( lookAhead( "'" ) ) {
							chars += "'";
						} else {
							literal = true;
						}
						break;
					default:
						chars += format.charAt( iFormat );
				}
			}
		}
		return chars;
	},

	/* Get a setting value, defaulting if necessary. */
	_get: function( inst, name ) {
		return inst.settings[ name ] !== undefined ?
			inst.settings[ name ] : this._defaults[ name ];
	},

	/* Parse existing date and initialise date picker. */
	_setDateFromField: function( inst, noDefault ) {
		if ( inst.input.val() === inst.lastVal ) {
			return;
		}

		var dateFormat = this._get( inst, "dateFormat" ),
			dates = inst.lastVal = inst.input ? inst.input.val() : null,
			defaultDate = this._getDefaultDate( inst ),
			date = defaultDate,
			settings = this._getFormatConfig( inst );

		try {
			date = this.parseDate( dateFormat, dates, settings ) || defaultDate;
		} catch ( event ) {
			dates = ( noDefault ? "" : dates );
		}
		inst.selectedDay = date.getDate();
		inst.drawMonth = inst.selectedMonth = date.getMonth();
		inst.drawYear = inst.selectedYear = date.getFullYear();
		inst.currentDay = ( dates ? date.getDate() : 0 );
		inst.currentMonth = ( dates ? date.getMonth() : 0 );
		inst.currentYear = ( dates ? date.getFullYear() : 0 );
		this._adjustInstDate( inst );
	},

	/* Retrieve the default date shown on opening. */
	_getDefaultDate: function( inst ) {
		return this._restrictMinMax( inst,
			this._determineDate( inst, this._get( inst, "defaultDate" ), new Date() ) );
	},

	/* A date may be specified as an exact value or a relative one. */
	_determineDate: function( inst, date, defaultDate ) {
		var offsetNumeric = function( offset ) {
				var date = new Date();
				date.setDate( date.getDate() + offset );
				return date;
			},
			offsetString = function( offset ) {
				try {
					return $.datepicker.parseDate( $.datepicker._get( inst, "dateFormat" ),
						offset, $.datepicker._getFormatConfig( inst ) );
				}
				catch ( e ) {

					// Ignore
				}

				var date = ( offset.toLowerCase().match( /^c/ ) ?
					$.datepicker._getDate( inst ) : null ) || new Date(),
					year = date.getFullYear(),
					month = date.getMonth(),
					day = date.getDate(),
					pattern = /([+\-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g,
					matches = pattern.exec( offset );

				while ( matches ) {
					switch ( matches[ 2 ] || "d" ) {
						case "d" : case "D" :
							day += parseInt( matches[ 1 ], 10 ); break;
						case "w" : case "W" :
							day += parseInt( matches[ 1 ], 10 ) * 7; break;
						case "m" : case "M" :
							month += parseInt( matches[ 1 ], 10 );
							day = Math.min( day, $.datepicker._getDaysInMonth( year, month ) );
							break;
						case "y": case "Y" :
							year += parseInt( matches[ 1 ], 10 );
							day = Math.min( day, $.datepicker._getDaysInMonth( year, month ) );
							break;
					}
					matches = pattern.exec( offset );
				}
				return new Date( year, month, day );
			},
			newDate = ( date == null || date === "" ? defaultDate : ( typeof date === "string" ? offsetString( date ) :
				( typeof date === "number" ? ( isNaN( date ) ? defaultDate : offsetNumeric( date ) ) : new Date( date.getTime() ) ) ) );

		newDate = ( newDate && newDate.toString() === "Invalid Date" ? defaultDate : newDate );
		if ( newDate ) {
			newDate.setHours( 0 );
			newDate.setMinutes( 0 );
			newDate.setSeconds( 0 );
			newDate.setMilliseconds( 0 );
		}
		return this._daylightSavingAdjust( newDate );
	},

	/* Handle switch to/from daylight saving.
	 * Hours may be non-zero on daylight saving cut-over:
	 * > 12 when midnight changeover, but then cannot generate
	 * midnight datetime, so jump to 1AM, otherwise reset.
	 * @param  date  (Date) the date to check
	 * @return  (Date) the corrected date
	 */
	_daylightSavingAdjust: function( date ) {
		if ( !date ) {
			return null;
		}
		date.setHours( date.getHours() > 12 ? date.getHours() + 2 : 0 );
		return date;
	},

	/* Set the date(s) directly. */
	_setDate: function( inst, date, noChange ) {
		var clear = !date,
			origMonth = inst.selectedMonth,
			origYear = inst.selectedYear,
			newDate = this._restrictMinMax( inst, this._determineDate( inst, date, new Date() ) );

		inst.selectedDay = inst.currentDay = newDate.getDate();
		inst.drawMonth = inst.selectedMonth = inst.currentMonth = newDate.getMonth();
		inst.drawYear = inst.selectedYear = inst.currentYear = newDate.getFullYear();
		if ( ( origMonth !== inst.selectedMonth || origYear !== inst.selectedYear ) && !noChange ) {
			this._notifyChange( inst );
		}
		this._adjustInstDate( inst );
		if ( inst.input ) {
			inst.input.val( clear ? "" : this._formatDate( inst ) );
		}
	},

	/* Retrieve the date(s) directly. */
	_getDate: function( inst ) {
		var startDate = ( !inst.currentYear || ( inst.input && inst.input.val() === "" ) ? null :
			this._daylightSavingAdjust( new Date(
			inst.currentYear, inst.currentMonth, inst.currentDay ) ) );
			return startDate;
	},

	/* Attach the onxxx handlers.  These are declared statically so
	 * they work with static code transformers like Caja.
	 */
	_attachHandlers: function( inst ) {
		var stepMonths = this._get( inst, "stepMonths" ),
			id = "#" + inst.id.replace( /\\\\/g, "\\" );
		inst.dpDiv.find( "[data-handler]" ).map( function() {
			var handler = {
				prev: function() {
					$.datepicker._adjustDate( id, -stepMonths, "M" );
				},
				next: function() {
					$.datepicker._adjustDate( id, +stepMonths, "M" );
				},
				hide: function() {
					$.datepicker._hideDatepicker();
				},
				today: function() {
					$.datepicker._gotoToday( id );
				},
				selectDay: function() {
					$.datepicker._selectDay( id, +this.getAttribute( "data-month" ), +this.getAttribute( "data-year" ), this );
					return false;
				},
				selectMonth: function() {
					$.datepicker._selectMonthYear( id, this, "M" );
					return false;
				},
				selectYear: function() {
					$.datepicker._selectMonthYear( id, this, "Y" );
					return false;
				}
			};
			$( this ).on( this.getAttribute( "data-event" ), handler[ this.getAttribute( "data-handler" ) ] );
		} );
	},

	/* Generate the HTML for the current state of the date picker. */
	_generateHTML: function( inst ) {
		var maxDraw, prevText, prev, nextText, next, currentText, gotoDate,
			controls, buttonPanel, firstDay, showWeek, dayNames, dayNamesMin,
			monthNames, monthNamesShort, beforeShowDay, showOtherMonths,
			selectOtherMonths, defaultDate, html, dow, row, group, col, selectedDate,
			cornerClass, calender, thead, day, daysInMonth, leadDays, curRows, numRows,
			printDate, dRow, tbody, daySettings, otherMonth, unselectable,
			tempDate = new Date(),
			today = this._daylightSavingAdjust(
				new Date( tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate() ) ), // clear time
			isRTL = this._get( inst, "isRTL" ),
			showButtonPanel = this._get( inst, "showButtonPanel" ),
			hideIfNoPrevNext = this._get( inst, "hideIfNoPrevNext" ),
			navigationAsDateFormat = this._get( inst, "navigationAsDateFormat" ),
			numMonths = this._getNumberOfMonths( inst ),
			showCurrentAtPos = this._get( inst, "showCurrentAtPos" ),
			stepMonths = this._get( inst, "stepMonths" ),
			isMultiMonth = ( numMonths[ 0 ] !== 1 || numMonths[ 1 ] !== 1 ),
			currentDate = this._daylightSavingAdjust( ( !inst.currentDay ? new Date( 9999, 9, 9 ) :
				new Date( inst.currentYear, inst.currentMonth, inst.currentDay ) ) ),
			minDate = this._getMinMaxDate( inst, "min" ),
			maxDate = this._getMinMaxDate( inst, "max" ),
			drawMonth = inst.drawMonth - showCurrentAtPos,
			drawYear = inst.drawYear;

		if ( drawMonth < 0 ) {
			drawMonth += 12;
			drawYear--;
		}
		if ( maxDate ) {
			maxDraw = this._daylightSavingAdjust( new Date( maxDate.getFullYear(),
				maxDate.getMonth() - ( numMonths[ 0 ] * numMonths[ 1 ] ) + 1, maxDate.getDate() ) );
			maxDraw = ( minDate && maxDraw < minDate ? minDate : maxDraw );
			while ( this._daylightSavingAdjust( new Date( drawYear, drawMonth, 1 ) ) > maxDraw ) {
				drawMonth--;
				if ( drawMonth < 0 ) {
					drawMonth = 11;
					drawYear--;
				}
			}
		}
		inst.drawMonth = drawMonth;
		inst.drawYear = drawYear;

		prevText = this._get( inst, "prevText" );
		prevText = ( !navigationAsDateFormat ? prevText : this.formatDate( prevText,
			this._daylightSavingAdjust( new Date( drawYear, drawMonth - stepMonths, 1 ) ),
			this._getFormatConfig( inst ) ) );

		prev = ( this._canAdjustMonth( inst, -1, drawYear, drawMonth ) ?
			"<a class='ui-datepicker-prev ui-corner-all' data-handler='prev' data-event='click'" +
			" title='" + prevText + "'><span class='ui-icon ui-icon-circle-triangle-" + ( isRTL ? "e" : "w" ) + "'>" + prevText + "</span></a>" :
			( hideIfNoPrevNext ? "" : "<a class='ui-datepicker-prev ui-corner-all ui-state-disabled' title='" + prevText + "'><span class='ui-icon ui-icon-circle-triangle-" + ( isRTL ? "e" : "w" ) + "'>" + prevText + "</span></a>" ) );

		nextText = this._get( inst, "nextText" );
		nextText = ( !navigationAsDateFormat ? nextText : this.formatDate( nextText,
			this._daylightSavingAdjust( new Date( drawYear, drawMonth + stepMonths, 1 ) ),
			this._getFormatConfig( inst ) ) );

		next = ( this._canAdjustMonth( inst, +1, drawYear, drawMonth ) ?
			"<a class='ui-datepicker-next ui-corner-all' data-handler='next' data-event='click'" +
			" title='" + nextText + "'><span class='ui-icon ui-icon-circle-triangle-" + ( isRTL ? "w" : "e" ) + "'>" + nextText + "</span></a>" :
			( hideIfNoPrevNext ? "" : "<a class='ui-datepicker-next ui-corner-all ui-state-disabled' title='" + nextText + "'><span class='ui-icon ui-icon-circle-triangle-" + ( isRTL ? "w" : "e" ) + "'>" + nextText + "</span></a>" ) );

		currentText = this._get( inst, "currentText" );
		gotoDate = ( this._get( inst, "gotoCurrent" ) && inst.currentDay ? currentDate : today );
		currentText = ( !navigationAsDateFormat ? currentText :
			this.formatDate( currentText, gotoDate, this._getFormatConfig( inst ) ) );

		controls = ( !inst.inline ? "<button type='button' class='ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all' data-handler='hide' data-event='click'>" +
			this._get( inst, "closeText" ) + "</button>" : "" );

		buttonPanel = ( showButtonPanel ) ? "<div class='ui-datepicker-buttonpane ui-widget-content'>" + ( isRTL ? controls : "" ) +
			( this._isInRange( inst, gotoDate ) ? "<button type='button' class='ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all' data-handler='today' data-event='click'" +
			">" + currentText + "</button>" : "" ) + ( isRTL ? "" : controls ) + "</div>" : "";

		firstDay = parseInt( this._get( inst, "firstDay" ), 10 );
		firstDay = ( isNaN( firstDay ) ? 0 : firstDay );

		showWeek = this._get( inst, "showWeek" );
		dayNames = this._get( inst, "dayNames" );
		dayNamesMin = this._get( inst, "dayNamesMin" );
		monthNames = this._get( inst, "monthNames" );
		monthNamesShort = this._get( inst, "monthNamesShort" );
		beforeShowDay = this._get( inst, "beforeShowDay" );
		showOtherMonths = this._get( inst, "showOtherMonths" );
		selectOtherMonths = this._get( inst, "selectOtherMonths" );
		defaultDate = this._getDefaultDate( inst );
		html = "";

		for ( row = 0; row < numMonths[ 0 ]; row++ ) {
			group = "";
			this.maxRows = 4;
			for ( col = 0; col < numMonths[ 1 ]; col++ ) {
				selectedDate = this._daylightSavingAdjust( new Date( drawYear, drawMonth, inst.selectedDay ) );
				cornerClass = " ui-corner-all";
				calender = "";
				if ( isMultiMonth ) {
					calender += "<div class='ui-datepicker-group";
					if ( numMonths[ 1 ] > 1 ) {
						switch ( col ) {
							case 0: calender += " ui-datepicker-group-first";
								cornerClass = " ui-corner-" + ( isRTL ? "right" : "left" ); break;
							case numMonths[ 1 ] - 1: calender += " ui-datepicker-group-last";
								cornerClass = " ui-corner-" + ( isRTL ? "left" : "right" ); break;
							default: calender += " ui-datepicker-group-middle"; cornerClass = ""; break;
						}
					}
					calender += "'>";
				}
				calender += "<div class='ui-datepicker-header ui-widget-header ui-helper-clearfix" + cornerClass + "'>" +
					( /all|left/.test( cornerClass ) && row === 0 ? ( isRTL ? next : prev ) : "" ) +
					( /all|right/.test( cornerClass ) && row === 0 ? ( isRTL ? prev : next ) : "" ) +
					this._generateMonthYearHeader( inst, drawMonth, drawYear, minDate, maxDate,
					row > 0 || col > 0, monthNames, monthNamesShort ) + // draw month headers
					"</div><table class='ui-datepicker-calendar'><thead>" +
					"<tr>";
				thead = ( showWeek ? "<th class='ui-datepicker-week-col'>" + this._get( inst, "weekHeader" ) + "</th>" : "" );
				for ( dow = 0; dow < 7; dow++ ) { // days of the week
					day = ( dow + firstDay ) % 7;
					thead += "<th scope='col'" + ( ( dow + firstDay + 6 ) % 7 >= 5 ? " class='ui-datepicker-week-end'" : "" ) + ">" +
						"<span title='" + dayNames[ day ] + "'>" + dayNamesMin[ day ] + "</span></th>";
				}
				calender += thead + "</tr></thead><tbody>";
				daysInMonth = this._getDaysInMonth( drawYear, drawMonth );
				if ( drawYear === inst.selectedYear && drawMonth === inst.selectedMonth ) {
					inst.selectedDay = Math.min( inst.selectedDay, daysInMonth );
				}
				leadDays = ( this._getFirstDayOfMonth( drawYear, drawMonth ) - firstDay + 7 ) % 7;
				curRows = Math.ceil( ( leadDays + daysInMonth ) / 7 ); // calculate the number of rows to generate
				numRows = ( isMultiMonth ? this.maxRows > curRows ? this.maxRows : curRows : curRows ); //If multiple months, use the higher number of rows (see #7043)
				this.maxRows = numRows;
				printDate = this._daylightSavingAdjust( new Date( drawYear, drawMonth, 1 - leadDays ) );
				for ( dRow = 0; dRow < numRows; dRow++ ) { // create date picker rows
					calender += "<tr>";
					tbody = ( !showWeek ? "" : "<td class='ui-datepicker-week-col'>" +
						this._get( inst, "calculateWeek" )( printDate ) + "</td>" );
					for ( dow = 0; dow < 7; dow++ ) { // create date picker days
						daySettings = ( beforeShowDay ?
							beforeShowDay.apply( ( inst.input ? inst.input[ 0 ] : null ), [ printDate ] ) : [ true, "" ] );
						otherMonth = ( printDate.getMonth() !== drawMonth );
						unselectable = ( otherMonth && !selectOtherMonths ) || !daySettings[ 0 ] ||
							( minDate && printDate < minDate ) || ( maxDate && printDate > maxDate );
						tbody += "<td class='" +
							( ( dow + firstDay + 6 ) % 7 >= 5 ? " ui-datepicker-week-end" : "" ) + // highlight weekends
							( otherMonth ? " ui-datepicker-other-month" : "" ) + // highlight days from other months
							( ( printDate.getTime() === selectedDate.getTime() && drawMonth === inst.selectedMonth && inst._keyEvent ) || // user pressed key
							( defaultDate.getTime() === printDate.getTime() && defaultDate.getTime() === selectedDate.getTime() ) ?

							// or defaultDate is current printedDate and defaultDate is selectedDate
							" " + this._dayOverClass : "" ) + // highlight selected day
							( unselectable ? " " + this._unselectableClass + " ui-state-disabled" : "" ) +  // highlight unselectable days
							( otherMonth && !showOtherMonths ? "" : " " + daySettings[ 1 ] + // highlight custom dates
							( printDate.getTime() === currentDate.getTime() ? " " + this._currentClass : "" ) + // highlight selected day
							( printDate.getTime() === today.getTime() ? " ui-datepicker-today" : "" ) ) + "'" + // highlight today (if different)
							( ( !otherMonth || showOtherMonths ) && daySettings[ 2 ] ? " title='" + daySettings[ 2 ].replace( /'/g, "&#39;" ) + "'" : "" ) + // cell title
							( unselectable ? "" : " data-handler='selectDay' data-event='click' data-month='" + printDate.getMonth() + "' data-year='" + printDate.getFullYear() + "'" ) + ">" + // actions
							( otherMonth && !showOtherMonths ? "&#xa0;" : // display for other months
							( unselectable ? "<span class='ui-state-default'>" + printDate.getDate() + "</span>" : "<a class='ui-state-default" +
							( printDate.getTime() === today.getTime() ? " ui-state-highlight" : "" ) +
							( printDate.getTime() === currentDate.getTime() ? " ui-state-active" : "" ) + // highlight selected day
							( otherMonth ? " ui-priority-secondary" : "" ) + // distinguish dates from other months
							"' href='#'>" + printDate.getDate() + "</a>" ) ) + "</td>"; // display selectable date
						printDate.setDate( printDate.getDate() + 1 );
						printDate = this._daylightSavingAdjust( printDate );
					}
					calender += tbody + "</tr>";
				}
				drawMonth++;
				if ( drawMonth > 11 ) {
					drawMonth = 0;
					drawYear++;
				}
				calender += "</tbody></table>" + ( isMultiMonth ? "</div>" +
							( ( numMonths[ 0 ] > 0 && col === numMonths[ 1 ] - 1 ) ? "<div class='ui-datepicker-row-break'></div>" : "" ) : "" );
				group += calender;
			}
			html += group;
		}
		html += buttonPanel;
		inst._keyEvent = false;
		return html;
	},

	/* Generate the month and year header. */
	_generateMonthYearHeader: function( inst, drawMonth, drawYear, minDate, maxDate,
			secondary, monthNames, monthNamesShort ) {

		var inMinYear, inMaxYear, month, years, thisYear, determineYear, year, endYear,
			changeMonth = this._get( inst, "changeMonth" ),
			changeYear = this._get( inst, "changeYear" ),
			showMonthAfterYear = this._get( inst, "showMonthAfterYear" ),
			html = "<div class='ui-datepicker-title'>",
			monthHtml = "";

		// Month selection
		if ( secondary || !changeMonth ) {
			monthHtml += "<span class='ui-datepicker-month'>" + monthNames[ drawMonth ] + "</span>";
		} else {
			inMinYear = ( minDate && minDate.getFullYear() === drawYear );
			inMaxYear = ( maxDate && maxDate.getFullYear() === drawYear );
			monthHtml += "<select class='ui-datepicker-month' data-handler='selectMonth' data-event='change'>";
			for ( month = 0; month < 12; month++ ) {
				if ( ( !inMinYear || month >= minDate.getMonth() ) && ( !inMaxYear || month <= maxDate.getMonth() ) ) {
					monthHtml += "<option value='" + month + "'" +
						( month === drawMonth ? " selected='selected'" : "" ) +
						">" + monthNamesShort[ month ] + "</option>";
				}
			}
			monthHtml += "</select>";
		}

		if ( !showMonthAfterYear ) {
			html += monthHtml + ( secondary || !( changeMonth && changeYear ) ? "&#xa0;" : "" );
		}

		// Year selection
		if ( !inst.yearshtml ) {
			inst.yearshtml = "";
			if ( secondary || !changeYear ) {
				html += "<span class='ui-datepicker-year'>" + drawYear + "</span>";
			} else {

				// determine range of years to display
				years = this._get( inst, "yearRange" ).split( ":" );
				thisYear = new Date().getFullYear();
				determineYear = function( value ) {
					var year = ( value.match( /c[+\-].*/ ) ? drawYear + parseInt( value.substring( 1 ), 10 ) :
						( value.match( /[+\-].*/ ) ? thisYear + parseInt( value, 10 ) :
						parseInt( value, 10 ) ) );
					return ( isNaN( year ) ? thisYear : year );
				};
				year = determineYear( years[ 0 ] );
				endYear = Math.max( year, determineYear( years[ 1 ] || "" ) );
				year = ( minDate ? Math.max( year, minDate.getFullYear() ) : year );
				endYear = ( maxDate ? Math.min( endYear, maxDate.getFullYear() ) : endYear );
				inst.yearshtml += "<select class='ui-datepicker-year' data-handler='selectYear' data-event='change'>";
				for ( ; year <= endYear; year++ ) {
					inst.yearshtml += "<option value='" + year + "'" +
						( year === drawYear ? " selected='selected'" : "" ) +
						">" + year + "</option>";
				}
				inst.yearshtml += "</select>";

				html += inst.yearshtml;
				inst.yearshtml = null;
			}
		}

		html += this._get( inst, "yearSuffix" );
		if ( showMonthAfterYear ) {
			html += ( secondary || !( changeMonth && changeYear ) ? "&#xa0;" : "" ) + monthHtml;
		}
		html += "</div>"; // Close datepicker_header
		return html;
	},

	/* Adjust one of the date sub-fields. */
	_adjustInstDate: function( inst, offset, period ) {
		var year = inst.selectedYear + ( period === "Y" ? offset : 0 ),
			month = inst.selectedMonth + ( period === "M" ? offset : 0 ),
			day = Math.min( inst.selectedDay, this._getDaysInMonth( year, month ) ) + ( period === "D" ? offset : 0 ),
			date = this._restrictMinMax( inst, this._daylightSavingAdjust( new Date( year, month, day ) ) );

		inst.selectedDay = date.getDate();
		inst.drawMonth = inst.selectedMonth = date.getMonth();
		inst.drawYear = inst.selectedYear = date.getFullYear();
		if ( period === "M" || period === "Y" ) {
			this._notifyChange( inst );
		}
	},

	/* Ensure a date is within any min/max bounds. */
	_restrictMinMax: function( inst, date ) {
		var minDate = this._getMinMaxDate( inst, "min" ),
			maxDate = this._getMinMaxDate( inst, "max" ),
			newDate = ( minDate && date < minDate ? minDate : date );
		return ( maxDate && newDate > maxDate ? maxDate : newDate );
	},

	/* Notify change of month/year. */
	_notifyChange: function( inst ) {
		var onChange = this._get( inst, "onChangeMonthYear" );
		if ( onChange ) {
			onChange.apply( ( inst.input ? inst.input[ 0 ] : null ),
				[ inst.selectedYear, inst.selectedMonth + 1, inst ] );
		}
	},

	/* Determine the number of months to show. */
	_getNumberOfMonths: function( inst ) {
		var numMonths = this._get( inst, "numberOfMonths" );
		return ( numMonths == null ? [ 1, 1 ] : ( typeof numMonths === "number" ? [ 1, numMonths ] : numMonths ) );
	},

	/* Determine the current maximum date - ensure no time components are set. */
	_getMinMaxDate: function( inst, minMax ) {
		return this._determineDate( inst, this._get( inst, minMax + "Date" ), null );
	},

	/* Find the number of days in a given month. */
	_getDaysInMonth: function( year, month ) {
		return 32 - this._daylightSavingAdjust( new Date( year, month, 32 ) ).getDate();
	},

	/* Find the day of the week of the first of a month. */
	_getFirstDayOfMonth: function( year, month ) {
		return new Date( year, month, 1 ).getDay();
	},

	/* Determines if we should allow a "next/prev" month display change. */
	_canAdjustMonth: function( inst, offset, curYear, curMonth ) {
		var numMonths = this._getNumberOfMonths( inst ),
			date = this._daylightSavingAdjust( new Date( curYear,
			curMonth + ( offset < 0 ? offset : numMonths[ 0 ] * numMonths[ 1 ] ), 1 ) );

		if ( offset < 0 ) {
			date.setDate( this._getDaysInMonth( date.getFullYear(), date.getMonth() ) );
		}
		return this._isInRange( inst, date );
	},

	/* Is the given date in the accepted range? */
	_isInRange: function( inst, date ) {
		var yearSplit, currentYear,
			minDate = this._getMinMaxDate( inst, "min" ),
			maxDate = this._getMinMaxDate( inst, "max" ),
			minYear = null,
			maxYear = null,
			years = this._get( inst, "yearRange" );
			if ( years ) {
				yearSplit = years.split( ":" );
				currentYear = new Date().getFullYear();
				minYear = parseInt( yearSplit[ 0 ], 10 );
				maxYear = parseInt( yearSplit[ 1 ], 10 );
				if ( yearSplit[ 0 ].match( /[+\-].*/ ) ) {
					minYear += currentYear;
				}
				if ( yearSplit[ 1 ].match( /[+\-].*/ ) ) {
					maxYear += currentYear;
				}
			}

		return ( ( !minDate || date.getTime() >= minDate.getTime() ) &&
			( !maxDate || date.getTime() <= maxDate.getTime() ) &&
			( !minYear || date.getFullYear() >= minYear ) &&
			( !maxYear || date.getFullYear() <= maxYear ) );
	},

	/* Provide the configuration settings for formatting/parsing. */
	_getFormatConfig: function( inst ) {
		var shortYearCutoff = this._get( inst, "shortYearCutoff" );
		shortYearCutoff = ( typeof shortYearCutoff !== "string" ? shortYearCutoff :
			new Date().getFullYear() % 100 + parseInt( shortYearCutoff, 10 ) );
		return { shortYearCutoff: shortYearCutoff,
			dayNamesShort: this._get( inst, "dayNamesShort" ), dayNames: this._get( inst, "dayNames" ),
			monthNamesShort: this._get( inst, "monthNamesShort" ), monthNames: this._get( inst, "monthNames" ) };
	},

	/* Format the given date for display. */
	_formatDate: function( inst, day, month, year ) {
		if ( !day ) {
			inst.currentDay = inst.selectedDay;
			inst.currentMonth = inst.selectedMonth;
			inst.currentYear = inst.selectedYear;
		}
		var date = ( day ? ( typeof day === "object" ? day :
			this._daylightSavingAdjust( new Date( year, month, day ) ) ) :
			this._daylightSavingAdjust( new Date( inst.currentYear, inst.currentMonth, inst.currentDay ) ) );
		return this.formatDate( this._get( inst, "dateFormat" ), date, this._getFormatConfig( inst ) );
	}
} );

/*
 * Bind hover events for datepicker elements.
 * Done via delegate so the binding only occurs once in the lifetime of the parent div.
 * Global datepicker_instActive, set by _updateDatepicker allows the handlers to find their way back to the active picker.
 */
function datepicker_bindHover( dpDiv ) {
	var selector = "button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a";
	return dpDiv.on( "mouseout", selector, function() {
			$( this ).removeClass( "ui-state-hover" );
			if ( this.className.indexOf( "ui-datepicker-prev" ) !== -1 ) {
				$( this ).removeClass( "ui-datepicker-prev-hover" );
			}
			if ( this.className.indexOf( "ui-datepicker-next" ) !== -1 ) {
				$( this ).removeClass( "ui-datepicker-next-hover" );
			}
		} )
		.on( "mouseover", selector, datepicker_handleMouseover );
}

function datepicker_handleMouseover() {
	if ( !$.datepicker._isDisabledDatepicker( datepicker_instActive.inline ? datepicker_instActive.dpDiv.parent()[ 0 ] : datepicker_instActive.input[ 0 ] ) ) {
		$( this ).parents( ".ui-datepicker-calendar" ).find( "a" ).removeClass( "ui-state-hover" );
		$( this ).addClass( "ui-state-hover" );
		if ( this.className.indexOf( "ui-datepicker-prev" ) !== -1 ) {
			$( this ).addClass( "ui-datepicker-prev-hover" );
		}
		if ( this.className.indexOf( "ui-datepicker-next" ) !== -1 ) {
			$( this ).addClass( "ui-datepicker-next-hover" );
		}
	}
}

/* jQuery extend now ignores nulls! */
function datepicker_extendRemove( target, props ) {
	$.extend( target, props );
	for ( var name in props ) {
		if ( props[ name ] == null ) {
			target[ name ] = props[ name ];
		}
	}
	return target;
}

/* Invoke the datepicker functionality.
   @param  options  string - a command, optionally followed by additional parameters or
					Object - settings for attaching new datepicker functionality
   @return  jQuery object */
$.fn.datepicker = function( options ) {

	/* Verify an empty collection wasn't passed - Fixes #6976 */
	if ( !this.length ) {
		return this;
	}

	/* Initialise the date picker. */
	if ( !$.datepicker.initialized ) {
		$( document ).on( "mousedown", $.datepicker._checkExternalClick );
		$.datepicker.initialized = true;
	}

	/* Append datepicker main container to body if not exist. */
	if ( $( "#" + $.datepicker._mainDivId ).length === 0 ) {
		$( "body" ).append( $.datepicker.dpDiv );
	}

	var otherArgs = Array.prototype.slice.call( arguments, 1 );
	if ( typeof options === "string" && ( options === "isDisabled" || options === "getDate" || options === "widget" ) ) {
		return $.datepicker[ "_" + options + "Datepicker" ].
			apply( $.datepicker, [ this[ 0 ] ].concat( otherArgs ) );
	}
	if ( options === "option" && arguments.length === 2 && typeof arguments[ 1 ] === "string" ) {
		return $.datepicker[ "_" + options + "Datepicker" ].
			apply( $.datepicker, [ this[ 0 ] ].concat( otherArgs ) );
	}
	return this.each( function() {
		typeof options === "string" ?
			$.datepicker[ "_" + options + "Datepicker" ].
				apply( $.datepicker, [ this ].concat( otherArgs ) ) :
			$.datepicker._attachDatepicker( this, options );
	} );
};

$.datepicker = new Datepicker(); // singleton instance
$.datepicker.initialized = false;
$.datepicker.uuid = new Date().getTime();
$.datepicker.version = "1.12.1";

var widgetsDatepicker = $.datepicker;




}));(function(global, $) {
    "use strict";
	var LCC = global.LCC || {};
    LCC.MaxCharacters = LCC.MaxCharacters || {};
	
	LCC.MaxCharacters.setMaxCharacters = function (element, maxlimit) {
		var new_length = element.val().length;
		if (new_length >= maxlimit) {
			element.val(element.val().substring(0, maxlimit));
			new_length = maxlimit;
		}
		return (maxlimit - new_length) + ' characters left';						
	}
	
    global.LCC = LCC;
})(window, jQuery);(function (global, $) {
    "use strict";
    var LCC = global.LCC || {};
	    LCC.Datepicker = LCC.Datepicker || {};

    $(document).ready(function () {
        $("input[data-type='datepicker-start']").datepicker({
            defaultDate: null,
            dateFormat: "dd/mm/yy",
            changeMonth: true,
            minDate: 0,
            onSelect: function(selected) {
                $("input[data-type='datepicker-end']").datepicker("option", "minDate", selected)
            }
        });
        $("input[data-type='datepicker-end']").datepicker({
            defaultDate: null,
            dateFormat: "dd/mm/yy",
            changeMonth: true,
            minDate: 0,
            onSelect: function (selected) {
                $("input[data-type='datepicker-start']").datepicker("option", "maxDate", selected)
            }
        }); 
        $("input[data-type='datepicker-start-nomin']").datepicker({
            defaultDate: null,
            dateFormat: "yy/mm/dd",
            changeMonth: true,
            onSelect: function(selected) {
                $("input[data-type='datepicker-end-nomin']").datepicker("option", "minDate", selected)
            }
        });
        $("input[data-type='datepicker-end-nomin']").datepicker({
            defaultDate: null,
            dateFormat: "yy/mm/dd",
            changeMonth: true,
            onSelect: function (selected) {
                $("input[data-type='datepicker-start-nomin']").datepicker("option", "maxDate", selected)
            }
        });
    });

    global.LCC = LCC;

})(window, jQuery);(function (global) {
    "use strict";

	var $ = global.jQuery
	var LCC = global.LCC || {}
		LCC.Modules = LCC.Modules || {}
		
 	LCC.Modules.BackToTop = function () {
		this.start = function (element) {
			// browser window scroll (in pixels) after which the "back to top" link is shown
			var offset = element.data('offset') ? element.data('offset') : 300,
				//browser window scroll (in pixels) after which the "back to top" link opacity is reduced
				offset_opacity = element.data('offset-opacity') ? element.data('offset-opacity') : 1200,
				//duration of the top scrolling animation (in ms)
				scroll_top_duration = element.data('scroll-top-duration') ? element.data('scroll-top-duration') : 700;
	
			//hide or show the "back to top" link
			$(global).scroll(function() {
				($(this).scrollTop() > offset) ? element.addClass('cd-is-visible') : element.removeClass('cd-is-visible cd-fade-out');		
				if($(this).scrollTop() > offset_opacity) { 
					element.addClass('cd-fade-out');
				}
			});

			//smooth scroll to top
			element.on('click', function(event){
				event.preventDefault();
				$('body,html').animate({
				   scrollTop: 0 ,
				}, scroll_top_duration);
			});
		}   
	};
   
	global.LCC = LCC
  
})(window);(function (global, $) {
    "use strict";
    
    var LCC = global.LCC || {}
        LCC.Modules = LCC.Modules || {}
                                
    LCC.Modules.Accordion = function () {
        this.start = function (element) {
            var drawer_panel = element.data('accordion-drawer-panel') ? element.data('accordion-drawer-panel') : '.accordion-drawer a ~ div',
                drawer_header = element.data('accordion-drawer-header') ? element.data('accordion-drawer-header') : '.accordion-drawer > a';

            $(element).find(drawer_panel).hide();
            $(element).find(drawer_header).on("click", function()
            {
                $(this).toggleClass("active");
                $(this).next('div').slideToggle();                                                                
                if ($(this).children().find('#tooltip').text() === "Click to expand") {
                    $(this).children().find('#tooltip').text('Click to hide')
                }
                else {
                    $(this).children().find('#tooltip').text('Click to expand')
                }
                return false;
            });  
        }   
    };
   
    global.LCC = LCC
})(window, jQuery)
;
(function (global, $) {
    "use strict";
    
    var LCC = global.LCC || {}
        LCC.Modules = LCC.Modules || {}

    //relies on bootstrap so make sure bootstrap is loaded before this module is used                          
    LCC.Modules.Carousel = function () {
        this.start = function (element) {    
            if($(element).find('ol.carousel-indicators').length) {
                var $indicators = $(element).find('ol.carousel-indicators');
                $(element).find('.item').each(function(index) {
                    $indicators.append('<li data-target="#' + element[0].id + '" data-slide-to="' + index + '" class="' + (index === 0 ? "active" : "")  + '"></li>');
                });
            }

            //add prev button
            element.find('.carousel-inner').append('<a class="left carousel-control" href="#' + element[0].id + '" data-slide="prev"><span class="icon-prev"><span class="sr-only">Previous slide</span></span></a>');
            //add next button
            element.find('.carousel-inner').append('<a class="right carousel-control" href="#' + element[0].id + '" data-slide="next"><span class="icon-next"></span><span class="sr-only">Next slide</span></a>');  
            
            //add play and pause button
            element.find('.carousel-inner').append('<div id="carouselButtons"> \
                                                <button id="playButton" type="button" class="btn btn-default btn-sm"> \
                                                    <span class="glyphicon glyphicon-play"></span> \
                                                    <span class="sr-only">Play carousel</span> \
                                                </button> \
                                                <button id="pauseButton" type="button" class="btn btn-default btn-sm"> \
                                                    <span class="glyphicon glyphicon-pause"></span> \
                                                    <span class="sr-only">Pause carousel</span> \
                                                </button> \
                                            </div>');
            $(element).find('.item:first-child').addClass('active');
            //add events
            $(element).find('#playButton').click(function () {
                $(element).carousel('cycle');
            });
            $(element).find('#pauseButton').click(function () {
                $(element).carousel('pause');
            });
        }   
    };
   
    global.LCC = LCC
})(window, jQuery);(function (global, $) {
    "use strict";

	var LCC = global.LCC || {}
		LCC.Modules = LCC.Modules || {}
		
 	LCC.Modules.ScrollTo = function () {
		this.start = function (element) {
		    // bind a click event to the 'skip' link
            $(element).click(function (event) {
                var scrollTo = '#' + this.href.split('#')[1]
                $("body, html").animate({ scrollTop: $(scrollTo).offset().top }, 600, function () {
                    $(scrollTo).attr('tabindex', '-1').on('blur focusout', function () {
                        // when focus leaves this element, 
                        // remove the tabindex attribute
                        $(this).removeAttr('tabindex');
                    }).focus(); // focus on the content container           
                });
            });
		}   
	};
   
	global.LCC = LCC
  
})(window, jQuery);(function (global, $) {
    "use strict";

	var LCC = global.LCC || {}
		LCC.Modules = LCC.Modules || {}
		
 	LCC.Modules.PreventDefault = function () {
		this.start = function (element) {
            var children = element.data('prevent-default-children') ? element.data('prevent-default-children') : "";
            if(children !== "") {
                element.find(children).on('click', function (e) { e.preventDefault(); return true; });
            } else {
                element.on('click', function (e) { e.preventDefault(); return true; });
            }
		}   
	};
   
	global.LCC = LCC
  
})(window, jQuery);//(=) require modules
//(=) require cookie-bar
//(=) require main-menu
//(=) require global-search
//(=) require equal-heights
//(=) require accessible-media-player
//(=) require sticky-ribbon
//(=) require jquery-ui-datepicker
//(=) require max-characters
//(=) require datepicker
//(=) require modules/back-to-top
//(=) require modules/accordion
//(=) require modules/carousel
//(=) require modules/scroll-to
//(=) require modules/prevent-default
;
