//------------------------------------- ------------------
// food class 
//-------------------------------------------------------

Food = function () {
    this.pos = Vec2(canvas.width * Math.random(), canvas.height * Math.random());
}


Food.prototype.Calculate = function () {
}

Food.prototype.Eat = function () {
    this.pos.set(canvas.width * Math.random(), canvas.height * Math.random());
}

Food.prototype.Draw = function () {
    //var p = this.pos;
    ctx.fillStyle = "green";
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, 1, 0, 2 * Math.PI);
    ctx.fill();
}


