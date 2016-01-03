var i2c = require('i2c-bus');
var NUNCHUCK_DEVICE = 0x52;
var center = 128;
var def_threshholdX = 142-center;
var def_threshholdX = 133-center;
var currentX = center;
var currentY = center;
var lastXEvent = "";
var lastYEvent = "";

function NunchuckDevice(address, frequency, thresholds){
  this.address = address;
  this.threshholdX = thresholds[0];
  this.frequency = frequency;
  this.started = null;
  this.bus = "Bus not initialized";
}

NunchuckDevice.prototype.init = function(busNumber){
  this.bus = i2c.openSync(busNumber || 1);
  this.bus.i2cWriteSync(this.address, 2, new Buffer([0xF0, 0x55]));
  this.bus.i2cWriteSync(this.address, 2, new Buffer([0xFB, 0x00]));
  this.bus.i2cWriteSync(this.address, 2, new Buffer([0x40, 0x00]));
}

NunchuckDevice.prototype.start = function(ondata){
  var buffer = new Buffer(6);
  var device = this;
  this.started = setInterval(function(){
    device.bus.i2cWriteSync(device.address, 1, new Buffer([0x00]));
    device.bus.i2cReadSync(device.address, 6, buffer);
    var decoded = device.decode(buffer);
    ondata(decoded);
  },device.frequency||1);

  this.decode = function(buffer){
    var value = -1;
    //x -y..etc
    var i = -1;
    var values = [lastXEvent,'Y','aX','aY','aZ'];
    //buffer
    for(i=0; i<buffer.length; i++){
      value = buffer.readUInt8(i);
      switch(i){
        case 0:
          values[0] = device.decodeX(value);
          break;
        case 1:
          values[1] = device.decodeY(value);
          break;
        default:
        break;
      }
    }
    return values;
  }

  this.decodeY = function(newY){
    var diffY = newY - (center+(device.threshholdY||def_threshholdY));
    var yEvent;
    if(diffX==0 || diffX ==-1){
      xEvent = 'center';
    }
    else if(diffX>=0){
      //RIGHT
      xEvent = 'up'
    }
    else if(diffX<-1){
      //LEFT
      xEvent = 'down'
    }
    return yEvent;
  }

  this.decodeX = function(newX){
    var diffX = newX - (center+(device.threshholdX||def_threshholdX));
    var xEvent;
    if(diffX==0 || diffX ==-1){
      xEvent = 'center';
    }
    else if(diffX>=0){
      //RIGHT
      xEvent = 'right'
    }
    else if(diffX<-1){
      //LEFT
      xEvent = 'left'
    }
    return xEvent;
  }

}

NunchuckDevice.prototype.stop = function(){
  clearInterval(this.started);
  this.bus.closeSync();
}

module.exports = NunchuckDevice;
