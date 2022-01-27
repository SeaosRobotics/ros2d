/**
 * @author David Molina - molina@seaos.co.jp
 */

/**
 * A navigation arrow is a directed triangle that can be used to display orientation.
 *
 * @constructor
 * @param options - object with following keys:
 *   * size (optional) - the size of the marker
 *   * strokeSize (optional) - the size of the outline
 *   * strokeColor (optional) - the createjs color for the stroke
 *   * fillColor (optional) - the createjs color for the fill
 *   * pulse (optional) - if the marker should "pulse" over time
 */
 ROS2D.NavigationShape = function(options) {
  var that = this;
  options  = options || {};

  var size        = options.size        || 10;
  var scaleX      = options.scaleX      || null;
  var scaleY      = options.scaleY      || null;
  var strokeSize  = options.strokeSize  || 3;
  var strokeColor = options.strokeColor || createjs.Graphics.getRGB(0, 0, 0);
  var fillColor   = options.fillColor   || createjs.Graphics.getRGB(255, 0, 0);
  var baseType    = options.baseType    || 'circle';
  var useHeading  = (options.useHeading === undefined ? true : false);
  var scale       = 1;
  var pulse       = options.pulse;

  var originals = {};

  var graphics = new createjs.Graphics();
  var draw = function() {
    // var graphics = new createjs.Graphics();
    if (baseType === 'cart') {
      // line width
      graphics.setStrokeStyle(strokeSize);
  
      graphics.beginFill(fillColor);
      graphics.beginStroke(strokeColor);
      graphics.drawRect(-(size*1.5), -(size/2), size*1.5, size);
      graphics.endFill();
      graphics.endStroke();
  
      graphics.setStrokeStyle(strokeSize/2);
      graphics.beginFill(createjs.Graphics.getRGB(100, 100, 100));
      graphics.beginStroke(strokeColor);
      graphics.arc(-(size*1.3),0,(size/5)/2,0,Math.PI*2,true);
      graphics.endFill();
      graphics.endStroke();
    } else if (baseType === 'circle') {
      // Outter circle
      graphics.setStrokeStyle(strokeSize);
      graphics.beginStroke(strokeColor);
      if (useHeading) {
        graphics.arc(0,0,size/2, -0.5, 0.5, true);
      } else {
        graphics.arc(0,0,size/2, 0.0, Math.PI*2, true);
      }
      
      graphics.endStroke();

      // Inner circle
      graphics.moveTo(size/2, size/2);
      graphics.beginFill(strokeColor);
      graphics.beginStroke(strokeColor);
      graphics.drawCircle(0,0,size/4);
      graphics.endFill();
      graphics.endStroke();

      if (useHeading) {
        // Triangle
        graphics.beginStroke(strokeColor);
        graphics.beginFill(strokeColor);
        graphics.lineTo(size-size/3, 0);
        graphics.lineTo(size*0.45, size*0.1);
        graphics.lineTo(size*0.45, -size*0.1);
        graphics.closePath();
        graphics.endFill();
        graphics.endStroke();
      }
      
    }
  
    // create the shape
    createjs.Shape.call(that, graphics);
  };
  draw();
  that.scaleX = scaleX || scale;
  that.scaleY = scaleY || scale;
  
  var growCount = 0;
  var growing = true;
  var SCALE_SIZE = 1.020;
  createjs.Ticker.addEventListener('tick', function() {
    if (originals['scaleX'] === undefined) {
      originals['scaleX'] = that.scaleX;
      originals['scaleY'] = that.scaleY;
    }
    
    // check if we are pulsing
    if (pulse) {
      // have the model "pulse"
      if (growing) {
        that.scaleX *= SCALE_SIZE;
        that.scaleY *= SCALE_SIZE;
        growing = (++growCount < 10);
      } else {
        that.scaleX /= SCALE_SIZE;
        that.scaleY /= SCALE_SIZE;
        growing = (--growCount < 0);
      }
    } else {
      that.scaleX = originals['scaleX'];
      that.scaleY = originals['scaleY'];
      growCount = 0;
      growing = true;
    }
  });

  that.update = function(options) {
    console.log(options);
    var changed = false;
    if (options.fillColor !== undefined) {
      fillColor = options.fillColor;
      changed = true;
    }
    if (options.strokeColor !== undefined) {
      strokeColor = options.strokeColor;
      changed = true;
    }
    if (options.useHeading !== undefined) {
      useHeading = options.useHeading;
      changed = true;
    }

    if (changed) {
      draw();
      that.scaleX = scaleX || scale;
      that.scaleY = scaleY || scale;
    }
  };

  that.pulse = function (_pulse) {
    pulse = _pulse;
  };

  that.pulsing = function () {
    return pulse;
  };
};
  ROS2D.NavigationShape.prototype.__proto__ = createjs.Shape.prototype;