//Harry Sayers
//arduino heart beat sensor visualisation
// sin waves can make a heart beat like animation

var c; // canvas with using p5.dom
var t; // holds my div and info text;
var b; // my text button
var exit; // my hide button
var pace = 0; // pace = theta and when the data is loaded will control speed
var fc ;
var gui;
var data;
var len;
var url;
//all my var that can be controlled by dat gui
//var smoothness = 15// how smooth the circle is
//var wid = 30; // the width of the circle
var amp = 70;
var ecgFont;
var h = 1; //fc/height for apmclose
/* this excentuates the amplitude of the wave
and will be used to feed to my data
*/
var iterator = 100; // allows the user to see a visual representation of the data in slow mo
//var speed = .30; // this controls the speed of the wave
// make variables to control thew HSL colour of the sketch.
//var hu = 70; // controlls the hue of the visualisation
//var sat = 90; // controlls the satuartion of the visualisation
//var lit = 50; // controls the light of the visualisation
var props = {
	Hue: 272,
	Saturation: 100,
	Light: 50,
	Speed: 0.30,
	Width: 30,
	Height: 1,
	Smoothness: 6,
};

function preload(){
	ecgFont = loadFont("fonts/montserrat/Montserrat-Regular.otf");
	url = 'https://api.mlab.com/api/1/databases/dat505/collections/pulsesensors?apiKey=N-EDUeviy8O2up5zLjr0ENjeIO_H8xuZ';
  data = loadJSON(url);
}

function setup() {
	len = Object.keys(data).length;
  c = createCanvas(windowWidth, windowHeight);
	ui();
	b = createButton("what's this?");
	exit = createButton('Hide');
	exit.hide();
	exit.mousePressed(hides);
	b.position(20, 60);
	b.mousePressed(show);
	b.mouse
	t = createDiv("Electrocardiogram over the course of a day. An electrocardiogram (ECG) is a simple test that can be used to check your heart's rhythm and electrical activity.");
	t.hide();

	//t.style("font-size", "18px");
  //t.style("color", "#ffffff");
}

function show(){
t.style('color', '#fff');
t.style('background', '#000');
t.style('width', '350px');
t.show()
t.position(20,80);
b.hide();
exit.show();
exit.position(20, 60);
}

function hides(){
t.hide();
b.show();
exit.hide();

}

function draw() {
  background('#030822');
	 //set background
	textSize(18); // font size
	stroke(255); // stroke colour
	fill(255);
	text("Current amplitude" + " " + ":" + " " + amp, 20,40);
	fc = props.Height;
	colorMode(HSL);
	translate(width/2, height/4);// position of visualisation
  pace+= props.Speed;
  stroke(props.Hue, props.Saturation, props.Light);
  noFill();
  waveMath();
	pop();
	push();
	translate(0, 20);// position of visualisation
  pace+= props.Speed;
  stroke(255);
  ampClose();

}


//jsonRunner is a self invoking function and allows me to call each member of the
//JSON object with a delay
//Think about tweening - Stavros feedback
var i = 1;
function jsonRunner () {
   setTimeout(function () {
		console.log(amp);
    amp = data[i].amplitude/10;
		i++;
     if (i < len) {
        jsonRunner();
      }else if(i >= len){
				i = 0;
				jsonRunner();
			}
   }, 3000)
}jsonRunner();

 function ui(){
	 gui = new dat.GUI;
	 var c = gui.addFolder('Colours');
	 var v = gui.addFolder('Change the visualisation');
	 c.add(props, 'Hue', 0, 360);
	 c.add(props, 'Saturation', 0, 100);
	 c.add(props, 'Light', 0, 100);
	 v.add(props, 'Speed',0.10, 1);
	 v.add(props, 'Smoothness',1, 100);
	 v.add(props, 'Width', 30, 100);
	 v.add(props, 'Height', 0.1, 1.5);
	 c.open();
	 v.open();

 }



function changeAmp(){
	for(var i = 0; i < len; i++){
	amp = data[i].amplitude/1000;

	}
};

function waveMath(){
	var radi=300;// length of wave
	for (var a = 0.01 * fc; a < fc + 0.1 * fc;a+= 0.01 * fc) {
		beginShape();
		for (var b=-sin(a)*radi;b<sin(a)*radi+sin(a);b+=sin(a)* props.Width) {
			curveVertex(b, cos(a)*radi+sin(pace-(b/props.Smoothness))*(a*amp));
			//console.log(amp);
		}
		endShape();
	}
};

function ampClose(){
	var radi=900;
	for (var a = 1 * h; a < h + 1 * fc;a+= 1 * h) { //interative sin
		beginShape();
		for (var b=-sin(a)*radi;b<sin(a)*radi+sin(a);b+=sin(a)* amp) {
			curveVertex(b, cos(a)*radi+sin(pace-(b/13))*(a*amp));
			//console.log(amp);
		}
		endShape();
	}
};

//Waves 
