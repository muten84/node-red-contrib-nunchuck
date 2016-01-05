var streamBuffers = require('stream-buffers');
var NunchuckDevice = require('./nunchuck-device');

var NUNCHUCK_ADDRESS = 0x52;
var center = 128;
var threshholdX = 142-center;
var threshholdY = 138-center;
var currentX = center;
var lastXEvent = "";


var nunchuck = new NunchuckDevice(NUNCHUCK_ADDRESS, 1,[threshholdX,threshholdY]);
nunchuck.init();
var axStream = new streamBuffers.ReadableStreamBuffer({
	frequency: 10,   // in milliseconds.
	chunkSize: 5  // in bytes.
});
// axStream.on('data', function(data) {
//   console.log(data);
//   var i = -1;
//   for(i=0; i<data.length; i++){
//     console.log(data.readUInt8(i));
//   }
// });
axStream.on('readable', function(data) {
  var chunk;
  while((chunk = axStream.read()) !== null) {
    console.log(chunk);
  }
});
nunchuck.start(function(stream){
  var struct = {
    x: stream[0],
    y: stream[1],
    C: stream[2],
    Z: stream[3],
    aX: stream[4],
    aY: stream[5],
    aZ: stream[6]
  }
  axStream.put(stream[4]toString(16),'hex');
  console.log(stream);
});
