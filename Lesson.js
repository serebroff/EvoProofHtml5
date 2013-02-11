// ----------------------------------------
// Actual game code goes here.

// Global vars
fps = null; 
canvas = null;
ctx = null;
var mySound;

// ----------------------------------------

ecosystem = null;

var tickperframe = 0;



function GameTick(elapsed)
{
    tickperframe = elapsed*1000;

    fps.update(elapsed);


    ecosystem.Calculate();

   ctx.setTransform(1, 0, 0, 1, 0, 0);
   	// Clear the screen
	ctx.fillStyle = "cyan";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

    // main render
    ecosystem.Render();

    ctx.setTransform(1, 0, 0, 1,0, 0);

    // Draw FPS
	ctx.fillStyle = "#FF00AA";    
    ctx.font="15px Arial Black";
    ctx.fillText("FPS: "+ fps.str_fps,20,20);
    ctx.fillText("N: "+ ecosystem.creatures.length,20,40);
    ctx.fillText("W: "+ canvas.width + " H: "+canvas.height,20,60);
}


window.onload = function () {
    // buzz.defaults.loop = true;
    mySound = new buzz.sound("/res/sound.ogg");
    mySound.loop().play();

    canvas = document.getElementById("screen");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    canvas.onclick = CanvasOnClick;

    ctx = canvas.getContext("2d");
    fps = new FPSMeter("fpsmeter", document.getElementById("fpscontainer"));
    ecosystem = new Ecosystem;
    GameLoopManager.run(GameTick);


};



CanvasOnClick = function() {

	if (RunPrefixMethod(document, "FullScreen") || RunPrefixMethod(document, "IsFullScreen")) {
		RunPrefixMethod(document, "CancelFullScreen");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
	}
	else {
		RunPrefixMethod(canvas, "RequestFullScreen");
        canvas.width = window.outerWidth;
        canvas.height = window.outerHeight;
	}

}

var pfx = ["webkit", "moz", "ms", "o", ""];
function RunPrefixMethod(obj, method) {
	
	var p = 0, m, t;
	while (p < pfx.length && !obj[m]) {
		m = method;
		if (pfx[p] == "") {
			m = m.substr(0,1).toLowerCase() + m.substr(1);
		}
		m = pfx[p] + m;
		t = typeof obj[m];
		if (t != "undefined") {
			pfx = [pfx[p]];
			return (t == "function" ? obj[m]() : obj[m]);
		}
		p++;
	}

}

