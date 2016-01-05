module.exports = function(RED) {
  "use strict";
  /*import dependencies*/
  var nunchuckModules = require('nunchuck-js').nunchuck;
  var NunchuckDevice = nunchuckModules.device;
  var NunchuckDecoder = nunchuckModules.decoder;

  var NUNCHUCK_ADDRESS = 0x52;
  var center = 128;
  var threshholdX = 142-center;
  var threshholdY = 138-center;
  var currentX = center;
  var currentY = center;
  var lastXEvent = "";
  var lastYEvent = "";
  var connected = {fill:"green",shape:"dot",text:"connected"};
  var disconnected = {fill:"red",shape:"ring",text:"disconnected"};


  function nunchuckNode(config) {
    RED.nodes.createNode(this,config);
    /*read node configs */
    this.frequency = config.frequency ;
    var node = this;
    var nunchuck = new NunchuckDevice(NUNCHUCK_ADDRESS, 10,[threshholdX,threshholdY]);


    //register close handler
    this.on('close', function() {
      node.status(disconnected);
      nunchuck.stop();
    });
    nunchuck.init();
    var decoder = new NunchuckDecoder(nunchuck);
    decoder.start(function(stream){
      if(stream.length>0){
        node.status(connected);
      }
      var struct = {
        x: stream[0],
        y: stream[1],
        C: stream[2],
        Z: stream[3]     
      }
      var msg = { payload: struct };
      node.send(msg);
    });

  }

  RED.nodes.registerType("nunchuck",nunchuckNode);
}
