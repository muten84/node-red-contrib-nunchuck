var NunchuckDevice = require('./nunchuck-device');

  var NUNCHUCK_ADDRESS = 0x52;
  var center = 128;
  var threshholdX = 142-center;
  var currentX = center;
  var lastXEvent = "";


var nunchuck = new NunchuckDevice(NUNCHUCK_ADDRESS, 1,[threshholdX]);
nunchuck.init();
    nunchuck.start(function(stream){
          var struct = {
        x: stream[0]
      }
     console.log(struct);
    });