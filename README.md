# node-red-contrib-nunchuck
A Node RED node to read data from nunchuck device mounted on I2C bus
From the node-red user data directory launch:

       npm install node-red-contrib-nunchuck
 
 After node-red restart it will be available a new node called "nunchuck" in output directory.
 The node has two config properties:
  - name: the name of the node
  - frequency: this value is the time the node once started request a read from nunchuck device;
  
 The node has one output object in JSON format, for instance:
```
       {
        x: "left",
        y:  "center",
        C: "pressed",
        Z: "idle"
      }
```
 - x is the x axis of the stick, its possible values are "left,center,right"
 - y is the y axis of the stick, its possible values are "up,center,down";
 - C is the C button of the controller its possible values are "idle,pressed";
 - Z is the Z button of the controller its possible values are "idle,pressed";
 - WORK IN PROGRESS: aX,aY and aZ are the x, y and z axis of the accelerometer, their possible values are development;

###UPDATE:
This node-red project now depends on [nunchuck.js](https://github.com/muten84/nunchuck.js) node.js module, it provides a decoder object and a nunchuck device object.

###WIP:
The resulting JSON object will be extended with more other nice info derived by the accelerometer such as:
 - motion verse detection: left, right, up, down 
 - tilt: tilt-left, tilt-right, tilt-up, tilt-down
 - rotation angles: xAngle, yAngle, zAngle (values in radians)
Stay tuned!

