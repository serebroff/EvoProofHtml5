// ------------------------------------
// Assorted JavaScript utility functions

function isDef(v) 			{ return v !== undefined; }
function isNull(v) 			{ return v === null; }
function isDefAndNotNull(v) { return vl != null; }

// Helper to provides requestAnimationFrame in a cross browser way.
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
if ( !window.requestAnimationFrame ) {
	window.requestAnimationFrame = ( function() {
		return window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {
			window.setTimeout( callback, 1000 / 60 );
		};
	} )();
}

function rndsign()
{
    if (Math.random() <= 0.5) return 1;
    else return -1;
}
