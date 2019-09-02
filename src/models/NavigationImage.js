/**
 * @author Inigo Gonzalez - ingonza85@gmail.com
 */

 /**
 * Modified by David Molina molina@seaos.co.jp
 */

/**
 * A navigation image that can be used to display orientation.
 *
 * @constructor
 * @param options - object with following keys:
 *   * size (optional) - the size of the marker
 *   * image - the image to use as a marker
 *   * pulse (optional) - if the marker should "pulse" over time
 */
ROS2D.NavigationImage = function(options) {
  var that = this;
  options = options || {};
  var size = options.size || 10;
  var scaleX = options.scaleX || null;
  var scaleY = options.scaleY || null;
  var image_url = options.image;
  var pulse = options.pulse;
  var alpha = options.alpha || 1;

  var originals = {};

  var paintImage = function(){
    createjs.Bitmap.call(that, image);
    var scale = calculateScale(size);
    that.alpha = alpha;
    that.scaleX = scaleX || scale;
    that.scaleY = scaleY || scale;
    that.regY = that.image.height/2;
    that.regX = that.image.width/2;
    originals['rotation'] = that.rotation;
    Object.defineProperty( that, 'rotation', {
      get: function(){ return originals['rotation'] + 90; },
      set: function(value){ originals['rotation'] = value; }
    });
    var growCount = 0;
    var growing = true;
    var SCALE_SIZE = 1.020;
    createjs.Ticker.addEventListener('tick', function() {
      if (originals['scaleX'] === undefined) {
        originals['scaleX'] = that.scaleX;
        originals['scaleY'] = that.scaleY;
      }
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
  };

   var calculateScale = function(_size){
      return _size / image.width;
  };

  var image = new Image();
  image.onload = paintImage;
  image.src = image_url;

};

ROS2D.NavigationImage.prototype.__proto__ = createjs.Bitmap.prototype;
