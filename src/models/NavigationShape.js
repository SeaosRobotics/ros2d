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
    var baseType    = options.baseType    || 'kobuki';
    var scale       = 1;
    var pulse       = options.pulse;
  
    var originals = {};
  
  
    // draw the shape
    var graphics = new createjs.Graphics();
    if (baseType === 'keycart') {
      // line width
      graphics.setStrokeStyle(strokeSize);
  
      graphics.beginFill(fillColor);
      graphics.beginStroke(strokeColor);
      graphics.drawRect(-(size*1.5), -(size/2), size*2, size);
      graphics.endFill();
      graphics.endStroke();
  
      graphics.setStrokeStyle(2);
      graphics.beginFill(createjs.Graphics.getRGB(255, 0, 0));
      graphics.beginStroke(strokeColor);
      graphics.arc((size/2)-(size/5),0,(size/5)/2,0,Math.PI*2,true);
      graphics.endFill();
      graphics.endStroke();
  
      graphics.beginFill(strokeColor);
      graphics.beginStroke(strokeColor);
      graphics.arc((size/2)-(size/5),0,((size/5)/2)/2,0,Math.PI*2,true);
      graphics.endFill();
      graphics.endStroke();
    } else {
      // line width
      graphics.setStrokeStyle(strokeSize);
  
      graphics.beginFill(fillColor);
      graphics.beginStroke(strokeColor);
      var halfPi = Math.PI / 2;
      graphics.arc(0,0,size/2,Math.PI-halfPi,Math.PI+halfPi,true);
      graphics.endStroke();
      
      graphics.beginStroke(strokeColor);
      
      graphics.moveTo(0, -size/2);
      graphics.lineTo(-size/2, -size/2);
      graphics.lineTo(-size/2, size/2);
      graphics.lineTo(0, size/2);
      graphics.endFill();
      graphics.endStroke();
      
      graphics.setStrokeStyle(2);
      graphics.beginFill(createjs.Graphics.getRGB(255, 0, 0));
      graphics.beginStroke(strokeColor);
      graphics.arc((size/2)-(size/5),0,(size/5)/2,0,Math.PI*2,true);
      graphics.endFill();
      graphics.endStroke();
      
      graphics.beginFill(strokeColor);
      graphics.beginStroke(strokeColor);
      graphics.arc((size/2)-(size/5),0,((size/5)/2)/2,0,Math.PI*2,true);
      graphics.endFill();
      graphics.endStroke();
    }
  
    // create the shape
    createjs.Shape.call(this, graphics);
  
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
  
    that.pulse = function (_pulse) {
      pulse = _pulse;
    };
  
    that.pulsing = function () {
      return pulse;
    };
  };
  ROS2D.NavigationShape.prototype.__proto__ = createjs.Shape.prototype;