var nunchuckModules = require('nunchuck-js').nunchuck;
var NunchuckDevice = nunchuckModules.device;
var NunchuckDecoder = nunchuckModules.decoder;


var NUNCHUCK_ADDRESS = 0x52;
var center = 128;
var threshholdX = 142-center;
var threshholdY = 138-center;
var currentX = center;
var lastXEvent = "";
var idx = 0;


var nunchuck = new NunchuckDevice(NUNCHUCK_ADDRESS, 10,[threshholdX,threshholdY]);
nunchuck.init();
var decoder = new NunchuckDecoder(nunchuck);

decoder.start(function(stream){
  // var axB = new Buffer(1);
  // var chunkSize = 4;
  // var struct = {
  //   x: stream[0],
  //   y: stream[1],
  //   C: stream[2],
  //   Z: stream[3],
  //   aX: stream[4],
  //   aY: stream[5],
  //   aZ: stream[6]
  // }
  //try this http://www.jonathan-petitcolas.com/2013/04/02/create-rotating-cube-in-webgl-with-threejs.html
  //console.log(stream[4],stream[5],stream[6],stream[7],stream[8]);
  var o = decoder.asObject(stream);
  d = function(radians){
    pi= 3.14;
    degrees = radians * (180/pi)
    return degrees
  }
  //console.log(d(o.rotation.x),d(o.rotation.y),d(o.rotation.z));
  console.log(o);
});
