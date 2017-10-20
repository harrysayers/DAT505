/*
count how many heart beats happen within 60 seconds
this is not an efficient way of doing it


var i = 0;
function sorthb (b) {
			bm[i] = b;
      console.log(bm[i]);
		  i++;
      setTimeout(function(){
      i = 0;
      console.log("60 seconds");
      bpm = bm.length;
      bm.length = 0;
      console.log(bpm);
      }, 60000); // if 60 seconds has past then restart filling the array
}


var i = 1;
 sensor.on("data", function(){
   if ((this.value >= 550) || (this.value < 800)) {
        checkBpm[i] = this.value;
        console.log(checkBpm[i]);
   } else{
   console.log('not a heart beat');
 };i++;
})
 */


var five = require("johnny-five");
var mongoose = require('mongoose');
var board = new five.Board();
var bpm; // trying bpm
var checkBpm;
var bm = [];
var d = new Date(); // date object
var h = d.getHours(); // hours
var m = d.getMinutes(); // mins
var s = d.getSeconds(); // seconds

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://dat:hazzer@ds121565.mlab.com:21565/dat505'); // connect to mlab
//assign db variable to our connection
var database = mongoose.connection;
//once function
database.once('open', function() {

  //pulsesensor amplitude schema
  var ampSchema = mongoose.Schema({
      amplitude: Number,
          time: String
  });

  //Create our Model and assign it to our schema
  var Amplitude = mongoose.model('pulseSensor', ampSchema);

board.on("ready", function() {
 var sensor = new five.Sensor({
 pin: "A0",
 freq: 700,
});
 sensor.within([500, 800], function(){ //filters out non-beats
 // instance of amplitude model
 var sensorAmp = new Amplitude({amplitude:this.value, time: h + ":" + m + ":" + s});
 //console.log our value
 console.log(this.value);
 // see if any errors happen
 sensorAmp.save(function(err, sensorAmp){
   if(err){
     return console.error(err);
    }
   });
  });
 });
});
