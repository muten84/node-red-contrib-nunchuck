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
	frequency: 1,   // in milliseconds.
	chunkSize: 10  // in bytes.
});
axStream.on('data', function(data) {
  // streams1.x style data
  //assert.isTrue(data instanceof Buffer);
  console.log(data);
});
// readStream.on('readable', function(data) {
//   var chunk;
//   while((chunk = readStream.read()) !== null) {
//     console.log(chunk);
//   }
// });
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
  axStream.put(stream[4]);
  //console.log(stream);
});
