var i2c = require('i2c-bus');
var NUNCHUCK_DEVICE = 0x52;
var center = 128;
var def_threshholdX = 142-center;
var def_threshholdY = 133-center;
var currentX = center;
var currentY = center;
var lastXEvent = "";
var lastYEvent = "";

function NunchuckDevice(address, frequency, thresholds){
  this.address = address;
  this.threshholdX = thresholds[0];
  this.threshholdY = thresholds[1];
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
    var decoded = device.decode(device.parseData(buffer));
    ondata(decoded);
  },device.frequency||1);

  this.parseData = function(buffer){
    var parsed = new Buffer(7);
    parsed[0] = buffer[0]; //x
    parsed[1] = buffer[1]; //y
    parsed[2] = (~buffer[5]) & 0xb1; //Z button
    parsed[3] = ((~buffer[5])>>1) & 0xb1; // C button
    parsed[4] = (((~buffer[5])>>2) & 0xb1) | (buffer[2]<<2) //aX;
    parsed[5] = (((~buffer[5])>>4) & 0xb1) | (buffer[3]<<2) //aY;
    parsed[6] = (((~buffer[5])>>6) & 0xb1) | (buffer[4]<<2) //aZ;
    return parsed;
	  /*n->X = nunchuk_data_buffer[0];
	  n->Y = nunchuk_data_buffer[1];
	  n->Z = (~nunchuk_data_buffer[5]) & 0b1;
	  n->C = ((~nunchuk_data_buffer[5])>>1) & 0b1;
	  n->aX = (((nunchuk_data_buffer[5]>>2) & 0b11) | ((int)nunchuk_data_buffer[2])<<2);
	  n->aY = (((nunchuk_data_buffer[5]>>4) & 0b11) | ((int)nunchuk_data_buffer[3])<<2);
	  n->aZ = (((nunchuk_data_buffer[5]>>6) & 0b11) | ((int)nunchuk_data_buffer[4])<<2);*/
  }

  this.decode = function(buffer){
    var value = -1;
    //x -y..etc
    var i = -1;
    var values = [lastXEvent,lastYEvent,'aX','aY','aZ'];
    //buffer
    for(i=0; i<buffer.length; i++){
      value = buffer.readUInt8(i);
      switch(i){
        case 0:
          values[i] = device.decodeX(value);
          break;
        case 1:
          values[i] = device.decodeY(value);
          break;
        case 2:
          values[i] = device.decodeC(value);
          break;
        case 3:
          values[i] = device.decodeZ(value);
          break;
        case 4:
          values[i] = device.decodeAx(value);
          break;
        case 5:
          values[i] = device.decodeAy(value);
          break;
        case 6:
          values[i] = device.decodeAz(value);
          break;
        default:
          break;
      }
    }
    return values;
  }

  this.decodeC = function(newC){
    return "idle";
  }

  this.decodeZ = function(newZ){
    return "idle";
  }

  this.decodeAx= function(newAx){
    return "medium";
  }

  this.decodeAy= function(newAy){
    return "medium";
  }

  this.decodeAz= function(newAz){
    return "medium";
  }


  this.decodeY = function(newY){
    var diffY = newY - (center+(device.threshholdY||def_threshholdY));
    var yEvent;
    if(diffY==0 || diffY==-1){
      yEvent = 'center';
    }
    else if(diffY>=0){
      //UP
      yEvent = 'up'
    }
    else if(diffY<-1){
      //DOWN
      yEvent = 'down'
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
