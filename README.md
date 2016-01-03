# node-red-contrib-nunchuck
A Node RED node to read data from nunchuck device mounted on I2C bus
From the node-red user data directory launch:

       npm install node-red-contrib-nunchuck
 
 After node-red restart it will be available a new node called "nunchuck" in output directory.
 The node has two config properties:
  - name: the name of the node
  - frequency: this value is the time the node once started request a read from nunchuck device;
  - 
 The node has one output object in JSON format, for instance:
 {
  x: "left"
  y:  "center"
  aX: "slow"
  aY: "slow"
  aZ: "slow"
}

x is the x axis of the stick, its possible values are "left,center,right";
y is the y axis of the stick, its possible values are "up,center,down";
aX,aY and aZ are the x, y and z axis of the accelerometer, their possible values are "stop,slow,fast,medium";

