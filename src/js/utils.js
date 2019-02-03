'use-strict';

export const ArrayUtils = {
  intersection: (arr1, arr2) => arr1.filter(element => arr2.includes(element)),
  randomPick: array => {
    if(Array.isArray(array))
      return array[Math.floor(Math.random() * myArray.length)];
    else
      throw new TypeError('Param "array" is not an array');
  }
}
export const CanvasUtils = {
  createDOMCanvas: ({...args}) => DOMUtils.createElement({
    tag: 'canvas',
    ...args
  }),
  CanvasView: class {
    constructor(canvasElem, {...options} = {}) {
      const { root } = options;
      this.DOMElem = canvasElem || CanvasUtils.createDOMCanvas(...options);
      this.root = canvasElem?canvasElem.parentNode:root
    }
    get DOMElem() {
      return this._DOMElem;
    }
    get root() {
      return this._root;
    }
    set DOMElem(el) {
      if(el instanceof HTMLCanvasElement)
        this._DOMElem = el;
    }
    set root(el) {
      if(el instanceof HTMLElement)
        this._root = el;
    }
    render() {
      
    }
  },
}
export const DOMUtils = {
  /**
  * @param el: Node
  * @param cb: Function
  * @param evts: Array
  * @param bubble: Boolean
  *
  * @return void
  **/
  attachEvts: (el, cb, evts, bubble = false) => {
    if(bubble) bubble = true;
    else bubble = false;
    if(el instanceof HTMLElement)
      if(typeof cb == 'function') {
        if(Array.isArray(evts))
          for(let e of evts) {
            if(typeof e == 'string')
              el.addEventListener(e, cb, bubble);
          }
        else
          throw new TypeError('Param 3 "evts", is not an array')
      }else
        throw new TypeError('Param 2 "cb", is not a function')  
    else
      throw new TypeError('Param 1 "el", is not an instance of HTMLElement');
  },
  /**
  * @param el: Node
  * @param cb: Function
  * @param evts: Array
  * @param bubble: Boolean
  *
  * @return void
  **/
  detachEvts: (el, cb, evts, bubble = false) => {
    if(bubble) bubble = true;
    else bubble = false;
    if(el instanceof HTMLElement)
      if(typeof cb == 'function') {
        if(!Array.isArray(evts))
          for(let e of evts) {
            if(typeof e == 'string')
              el.removeEventListener(e, cb, bubble);
          }
        else
          throw new Error('TypeError: Param 3 "evts", is not an array')
      }
      else
        throw new Error('TypeError: Param 2 "cb", is not a function')  
    else
      throw new Error('TypeError: Param 1 "el", is not an instance of HTMLElement');
  },
  /**
  * @param options: {attributes: object, styles: object, classes: string[]}
  * @return instance of HTMLElement
  **/
  createElement({...options}) {
    const {classes = [], attributes = {}, styles = {}, ...rest} = options;
    let {tag} = rest;
    
    if(!tag || typeof tag != 'string' )
      tag = 'div';
    
    const elem = document.createElement(tag);
    
    if(typeof attributes == 'string'|| Object.entries(attributes).length > 0) {
      DOMUtils.setAttributes(elem, attributes);
    }
    if(typeof styles == 'string' || Object.entries(styles).length > 0) {
      DOMUtils.setStyles(elem, styles);
    }
    if(classes.length > 0) {
      console.log(classes)
      DOMUtils.setClasses(elem, classes);
    }
    
    return elem
  },
  /**
  * @param el: Node
  *
  * @return obj
  **/
  getBoundEvents: el => {
    if(el instanceof HTMLElement) {
      const obj = {};
      for(let prop in el) {
        if(prop.substring(0, 2) == 'on' && el[prop] != null)
          obj[prop] = el[prop];
      }
      return obj;
    }
  },
  /* 
  * @param el Node
  * @param newParent Node
  */
  moveNode: (el, newParent) => {
    if(el instanceof HTMLElement)
      if(newParent instanceof HTMLElement)
        if(!newParent.contains(el)) {
          if(el.parentNode) 
            el.parentNode.removeChild(el);
          newParent.appendChild(el);
        }
      else
        throw new Error('TypeError: Param 2 "newParent", is not an instance of HTMLElement');  
    else
      throw new Error('TypeError: Param 1 "el", is not an instance of HTMLElement');
  },
  /**
  * @param el: Node
  * @param classes: string[];
  *
  * @return void
  **/
  setClasses: (el, classes = []) => {
    if(el instanceof HTMLElement) {
      if(Array.isArray(classes)) {
        if(el.classList.length == 0) {
          el.classList = classes.join(' ');
          return;
        }
        else 
          for(let c of classes) {
            if(typeof c == 'string')
              el.classList.add(c);
          }
      }else if(typeof classes == 'string') {
        el.classList += `${el.classList.length>0?' ':''}${classes}`;    
      }
      return;
    }
    else
      throw new Error('Param 1 "el", is not an instance of HTMLElement');
  },
  /**
  *
  *
  **/
  removeClasses: (el, classes) => {
    if(el instanceof HTMLElement)
      if(Array.isArray(classes))
        for(let s in classes) {
            el.classList.remove(classes[s]);
        }
      else if(classes = 'all')
        el.classList = '';
      else 
        throw new Error('TypeError: Param 2 "styles", is not an array')
    else
      throw new Error('TypeError: Param 1 "el", is not an instance of HTMLElement');
  },
  /**
  * @param el: Node
  * @param attrs: Object
  *
  * @return void
  **/
  setAttributes: (el, {...attrs}) => {
    if(el instanceof HTMLElement)
      for(let attr in attrs) {
        if(attr.substring(0, 4) != 'data')
          el.setAttribute(attr, attrs[attr]);
        else
          el.dataset[attr.substring(4).toLowerCase()] = attrs[attr];
      }
    else
      throw new Error('Param 1 "el", is not an instance of HTMLElement');
  },
  /**
  * @param el
  * @param attrs
  *
  * @return void
  **/
  removeAttributes: (el, attrs) => {
    if(el instanceof HTMLElement)
      if(Array.isArray(attrs))
        for(let attr of attrs) {
          if(typeof attr == 'string')
            el.removeAttribute(attr)
        }
      else if(attrs == 'all') 
        for(let attr of el.attributes) {
          if(attr.name != 'class' && attr.name != 'style') {
            el.removeAttribute(attr.name);
          }
        }
      else
        throw new Error('TypeError: Param 2 "attrs", is not an array')
    else
      throw new Error('TypeError: Param 1 "el", is not an instance of HTMLElement')
  },
  /**
  * @param el: Node
  * @param attrs: Object
  *
  * @return void
  **/
  setDataAttributes: (el, {...attrs}) => {
    if(el instanceof HTMLElement)
      for(let attr in attrs) {
        el.dataset[attr] = attrs[attr];
      }
    else
      throw new Error('Param 1 "el", is not an instance of HTMLElement');
  },
  /**
  * @param el: Node
  * @param attrs: string[]
  *
  * @return void
  **/
  removeDataAttributes: (el, attrs) => {
    typeof attrs == 'string' ? attrs = [attrs]:attrs;
    if(el instanceof HTMLElement)
      if(Array.isArray(attrs))
        for(let attr of attrs) {
          if(el.dataset[attr]) {
            el.removeAttribute(['data-' + attr]);
          }
        }
      else
        throw new Error('Param 2 "attrs", is not an array');
    else
      throw new Error('Param 1 "el", is not an instance of HTMLElement');
  },
  setProperties(el, {...props}) {
    if(el instanceof HTMLElement)
      for(let prop in props) {
        el.style.setProperty(`--${prop}`, props[prop].value?props[prop].value:'', props[prop].priority?props[prop].priority:undefined);
      }
  },
  removeProperties(el, props) {
    if(el instanceof HTMLElement)
      if(Array.isArray(props))
        for(let prop of props) {
          if(typeof prop == 'string')
            el.style.removeProperty(`--${prop}`);
        }
      else if(typeof props == 'string')
        el.style.removeProperty(`--${props}`);
  },
  /**
  * @param el: Node
  * @param attrs: Object
  *
  * @return void
  **/
  setStyles: (el, {...styles} = {}) => {
    if(el instanceof HTMLElement)
      for(let s in styles) {
        if(el.style[s] != undefined) {
          el.style[s] = styles[s];
        }
      }
    else
      throw new Error('Param 1 "el", is not an instance of HTMLElement');
  },
  /**
  * @param el: Node
  * @param styles: string[]
  *
  * @return void
  **/
  removeStyles: (el, styles) => {
    if(el instanceof HTMLElement)
      if(Array.isArray(styles))
        for(let s of styles) {
          if(el.style[s] != undefined) {
            el.style[s] = '';
          }
        }
      else if(styles == 'all') {
        Object.keys(el.style).filter(s => {
          if(el.style[s] && isNaN(Number(s)))
            el.style[s] = '';
        })
        for(let s in el.style) {
        }
        // el.styles.map(s => {
        //   typeof s != 'undefined'?s='':s;
        // });
      }
      else 
        throw new Error('TypeError: Param 2 "styles", is not an array')
    else
      throw new Error('TypeError: Param 1 "el", is not an instance of HTMLElement');
  },
  /**
  *  
  *
  **/
  wrapNode: (el, {...options} = {}) => {
    if(el instanceof HTMLElement) {
      const wrap = DOMUtils.createElement({...options});
      el.parentNode.replaceChild(wrap, el);
      wrap.appendChild(el);
    }
    else
      throw new Error('TypeError: Param 1 "el", is not an instance of HTMLElement');
  },
}
export const EventUtils = {
    debounce: function(fn, time = 250, immediate = false) {
      let timeout;
  
      return (...args) => {
        const functionCall = () => fn.apply(this, args);
  
        clearTimeout(timeout);
        timeout = setTimeout(functionCall, time);
      }
    },
    throttle: function(fn, delay = 250) {
      let lastCall = 0;
      return function (...args) {
        const now = (new Date).getTime();
        if (now - lastCall < delay) {
          return;
        }
        lastCall = now;
        return fn(...args);
      }
    },
  }
export const GeomUtils = {
  /**
  * @param a: {x: number, y: number}
  * @param b: {x: number, y: number}
  * @return number
  **/
  distBetweenTwoPts: (a, b) => {
    if(a.x && a.y && b.x && b.y)
      return Math.sqrt( Math.pow(b.y - a.y, 2) + Math.pow(b.x - a.x, 2) );
    else
      return NaN;
  },
  /**
  * @param radius: number
  * @return number
  **/
  getCirclePerimeter: (radius) => {
    const r = Number(radius);
    if(!isNaN(r))
      return 2 * Math.PI * r;
    else
      throw new Error('TypeError: Param "radius" is not a valid number')
  },
  /**
  * @param radius: number
  * @return number
  **/
  getDiscArea: (radius) => {
    const r = Number(radius);
    if(!isNaN(r))
      return Math.PI * Math.pow(r, 2);
    else
      throw new Error('TypeError: Param "radius" is not a valid number')
  }
}
export const MathUtils = {
  random(min, max) {
    return Math.random() * (max - min) + min;
  },
  randomInt: (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  clampNumber: (num, min, max) => {
    return num <= min ? min : num >= max ? max : num;
  }
}
export const ObjectUtils = {
  mergeDeep: (target, source) => {
    let output = Object.assign({}, target);
    if (isObject(target) && isObject(source)) {
      Object.keys(source).forEach(key => {
        if (isObject(source[key])) {
          if (!(key in target))
            Object.assign(output, { [key]: source[key] });
          else
            output[key] = mergeDeep(target[key], source[key]);
        } else {
          Object.assign(output, { [key]: source[key] });
        }
      });
    }
    return output;
  }
}
export const StringUtils = {
  capitalize: s => {
    return s && s[0].toUpperCase() + s.slice(1);
  },
  capitalizeWords: s => {
    return  s.split(' ').map(s => StringUtils.capitalize(s)).join(' ');
  },
  replaceAll: (str, search, replacement) => {
    return str.replace(new RegExp(search, 'g'), replacement);
  },
  stringToFunction: str => {
    let arr = str.split("."),
        fn = (window || this);
    for (let i = 0, len = arr.length; i < len; i++) {
      fn = fn[arr[i]];
    }
    if (typeof fn !== "function") {
      throw new Error("function not found");
    }
    return fn;
  },
  secsToMin: d => {
    let hrs = ~~(d / 3600);
    let mins = ~~((d % 3600) / 60);
    let secs = ~~d % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    let ret = "";

    if (hrs > 0) {
      ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }

    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
  }
}
export const Validators = {
  /**
   * Simple object check.
   * @param item
   * @returns {boolean}
   */
  isObject: (Item) => {
    return (item && typeof item === 'object' && !Array.isArray(item));
  },
  isValidEmail(email) {
    const regExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regExp.test(String(email).toLowerCase());
  },
  isValidPhone(number) {
    const regExp = /^((?:\+|00)[17](?: |\-)?|(?:\+|00)[1-9]\d{0,2}(?: |\-)?|(?:\+|00)1\-\d{3}(?: |\-)?)?(0\d|\([0-9]{3}\)|[1-9]{0,3})(?:((?: |\-)[0-9]{2}){4}|((?:[0-9]{2}){4})|((?: |\-)[0-9]{3}(?: |\-)[0-9]{4})|([0-9]{7})){1}$/gm
    return String(number).match(regExp);
  }
}
export const OtherUtils = {
  getInlineTransforms: HTMLElem => {
    const transformTypes = [
      {
        name: 'scale',
        variants: ['X', 'Y', 'Z', '3d'],                  
      },
      {
        name: 'translate',
        variants: ['X', 'Y', 'Z', '3d'],
      },
      {
        name: 'rotate',
        variants: ['X', 'Y', 'Z', '3d'],
      }, 
      {
        name: 'skew',
        variants: ['X', 'Y'],
      },
      {
        name: 'perspective',
        variants: [],
      },
      {
        name: 'matrix',
        variants: ['3d'],
      },
    ],
          elemTransformStr = HTMLElem.style.transform.toLowerCase();
          
    return transformTypes.map(t => {
      const transformModel = {
        name: '',
        transform: {
          X: 0,
          Y: 0,
          Z: 0,
        }
      },
            transformPosition = elemTransformStr.indexOf(t.name);
      transformModel.name = t.name;
      if(transformPosition != -1) {
        let transformVariant = elemTransformStr.charAt(transformPosition + t.name.length).toUpperCase();
        if(transformVariant === '3') transformVariant = '3d';
        if(t.variants.includes(transformVariant) && transformVariant != '3d') {
          transformModel.transform[transformVariant] = elemTransformStr.substring(transformPosition + t.name.length + 2, elemTransformStr.indexOf(')', transformPosition))
        }
        else if(transformVariant == '3d' && t.name != 'matrix') {
          const transformValues = elemTransformStr.substring(transformPosition + t.name.length + 3, elemTransformStr.indexOf(')', transformPosition));
          let X = Y = Z = 0,
              unit;
          let valuesArray = StringUtils.replaceAll(transformValues, ' ', '').split(',');
          X = valuesArray[0] ? valuesArray[0] : 0;
          Y = valuesArray[1] ? valuesArray[1] : 0;
          Z = valuesArray[2] ? valuesArray[2] : 0;
          unit = valuesArray[3] ? valuesArray[3] : 0;
          transformModel.transform = {X, Y, Z, unit};
        }
        else {
          const transformValues = elemTransformStr.substring(transformPosition + t.name.length + 1, elemTransformStr.indexOf(')', transformPosition));
          let X = Y = Z = 0;
          if(transformValues.indexOf(',') != -1) {
            let valuesArray = StringUtils.replaceAll(transformValues, ' ', '').split(',');
            if(t.name != 'matrix') {
              X = valuesArray[0] ? valuesArray[0] : 0;
              Y = valuesArray[1] ? valuesArray[1] : 0;
              Z = valuesArray[2] ? valuesArray[2] : 0;
              transformModel.transform = {X, Y, Z};
            }
            else {
              transformModel.transform = valuesArray;
            }
          }
          else if(transformValues.length > 0) {
            if(t.name != 'rotate' && t.name != 'perspective') {
              X = transformValues;
              Y = transformValues;
              Z = 0;
              transformModel.transform = {X, Y, Z};
            }else {
              X = 0;
              Y = 0;
              Z = transformValues;
              transformModel.transform = {X, Y, Z};
            }
          }
        }
      }
      return transformModel;
    });
  },
  mouseTouchOffset: event => {
    const type = event.type?event.type:null;
    if(event instanceof MouseEvent) {
      const elemBCR = event.currentTarget.getBoundingClientRect();
      return {
        x: event.x - elemBCR.x,
        y: event.y - elemBCR.y,
      }
    }
    else if(event instanceof TouchEvent) {
      const elemBCR = event.currentTarget.getBoundingClientRect();
      if(event.touches && event.touches[0])
        return {
          x: event.touches[0].clientX - elemBCR.x,
          y: event.touches[0].clientY - elemBCR.y,
          // parentTop: ,
        }
      else 
        return {
          x: null,
          y: null
        }
    }
  },
};
export default {
    ArrayUtils,
    CanvasUtils,
    DOMUtils,
    EventUtils,
    GeomUtils,
    MathUtils,
    ObjectUtils,
    StringUtils,
    Validators,
    OtherUtils,
}