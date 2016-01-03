module.exports = function(RED) {
  "use strict";
  /*import dependencies*/
  var NunchuckDevice = require('./nunchuck-device');

  var NUNCHUCK_ADDRESS = 0x52;
  var center = 128;
  var threshholdX = 142-center;
  var threshholdY = 133-center;
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
    var nunchuck = new NunchuckDevice(NUNCHUCK_ADDRESS, (this.frequency|| 1),[threshholdX]);
    nunchuck.init();
    nunchuck.start(function(stream){
      if(stream.length>0){
        node.status(connected);
      }
      var struct = {
        x: stream[0],
        y: stream[1],
      }
      var msg = { payload: struct };
      node.send(msg);
    });
  }

  RED.nodes.registerType("nunchuck",nunchuckNode);
}
