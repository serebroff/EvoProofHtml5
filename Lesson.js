// ----------------------------------------
// Actual game code goes here.

// Global vars
fps = null; 
canvas = null;
ctx = null;

// ----------------------------------------

ecosystem = null;

var tickperframe = 0;

// Our 'game' variables
var posX = 0;
var posY = 0;
var velX = 100;
var velY = 100;
var sizeX = 80;
var sizeY = 40;

function GameTick(elapsed)
{
    tickperframe = elapsed*1000;

    fps.update(elapsed);


    ecosystem.Calculate();


   	// Clear the screen
	ctx.fillStyle = "cyan";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

    // main render
    ecosystem.Render();

    // Draw FPS
	ctx.fillStyle = "#FF00AA";    
    ctx.font="15px Arial Black";
    ctx.fillText("FPS: "+ fps.str_fps,20,20);
    ctx.fillText("N: "+ ecosystem.creatures.length,20,40);
}

window.onload = function () {
    canvas = document.getElementById("screen");
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
/*
  //  	function fullscreen(){
	    var el = canvas; //document.getElementById('canvas');

           if(el.webkitRequestFullScreen) {
               el.webkitRequestFullScreen();
           }
          else {
             el.mozRequestFullScreen();
          }            
//        }
*/
    ctx = canvas.getContext("2d");
    fps = new FPSMeter("fpsmeter", document.getElementById("fpscontainer"));
    ecosystem = new Ecosystem;
    GameLoopManager.run(GameTick);
};

