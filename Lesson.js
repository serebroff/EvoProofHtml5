// ----------------------------------------
// Actual game code goes here.

// Global vars
var fps = null; 
var canvas = null;
var ctx = null;
var mySound;

// ----------------------------------------

var ecosystem;

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

GoButton = function ()
{
    var formDNA = document.getElementById("DNAinput").value;
    var initDNA;
    if (formDNA.length != 0) initDNA = formDNA;
    else //initDNA = "1 20 31 01 1032 230 012 13 32 301 01 210 021 123 301 321 102 21 321 12 123 321 321 012 210 032 122 320";
   initDNA = "jefnwajefnwajnefjkwanvkajbvjkbaebse";
//var initDNA = "143 176 134 ghjn oiuy trew 255 4 2 4 2 4 2 4 123 123 21 21 13 31 1 13";
//var initDNA = "1 133320 1 2 1 1 012 1 1 1 1 1 012 1 1 1 1 012 1 1 1 1 1 ";
//var initDNA = "1 133320 145 254 5671 891 012 1 871 1 651 1 012 1 321 1 1 012 1 231 1 1 1 1 133320 145 254 5671 891 012 1 871 1 651 1 012 1 321 1 1 012 1 231 1 1 1";

     var symbol;
    var finalDNA = "";

     for(var i=0; i<initDNA.length; i++)
     {
        symbol= (initDNA.charCodeAt(i) - 32)%5;
        if (symbol == 0)
        {
            finalDNA += String.fromCharCode(32);
        }
        else finalDNA += String.fromCharCode( symbol + 48);
     }
    document.getElementById("DNAinput").value = finalDNA;
    ecosystem.organism.Init(finalDNA);
}

window.onload = function () {
    // buzz.defaults.loop = true;
//    mySound = new buzz.sound("/res/sound.ogg");
//    mySound.loop().play();

    canvas = document.getElementById("screen");
//    canvas.width = window.innerWidth;
//    canvas.height = window.innerHeight;

 //   window.onclick = CanvasOnClick;

    ctx = canvas.getContext("2d");
    fps = new FPSMeter();
    ecosystem = new Ecosystem;
    GameLoopManager.run(GameTick);
    canvas.onmousedown = function (e) {
        
        ecosystem.organism.Grow();    
    };

};



CanvasOnClick = function() {

	if (RunPrefixMethod(document, "FullScreen") || RunPrefixMethod(document, "IsFullScreen")) {
		RunPrefixMethod(document, "CancelFullScreen");
        scr=document.getElementById("screen");
        canvas.width = 800;//scr.width;
        canvas.height = 600; //scr.height;

        //canvas.width = window.innerWidth;
        //canvas.height = window.innerHeight;
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

