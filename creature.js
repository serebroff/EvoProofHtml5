//-------------------------------------------------------
// class of living creature
//-------------------------------------------------------

var VISION_DISTANCE = 20;
var BRAKING = 0.85;
var MIN_SPEED = 0.99;
var MAX_SPEED = 25.0;
var INVULNERABILITY_TIME = 1000;



Creature = function () {
    this.pos = Vec2(canvas.width * Math.random(), canvas.height * Math.random());

    // directions and velocity 
    this.dirV = Vec2(Math.random(), Math.random());
    this.velF = Math.random() + 1;
    this.dirAccel = Vec2(0, 0);

    if (Math.random() > 0.5) this.dirV.x *= -1;
    if (Math.random() > 0.5) this.dirV.y *= -1;
    this.dirV.normalize();

    // parts of the body
    this.mouthR = 1 + Math.random() * 3;
    this.eyeR = 1 + Math.random() * 3;
    this.tailR = 1 + Math.random() * 3;

    // calculation of basic parameters
    this.visionR = this.eyeR * VISION_DISTANCE;
    this.mass = this.mouthR + this.eyeR + this.tailR;
    this.food_counter = this.mass;

    this.invulnearability_timer = 0;
    this.IsDead = false;

    // prerender stuff
    this.bitmapCanvas = document.createElement('canvas');

};

Creature.prototype.Prerender = function()
{
    var texture_size = Math.ceil(Math.max(this.mouthR, this.tailR)*2 +  this.eyeR ) *2 +1;
    var mouthP = Vec2(this.mouthR + this.eyeR , 0);
    var tailP = Vec2(-this.tailR - this.eyeR ,  0);



    this.bitmapCanvas.width = texture_size;
    this.bitmapCanvas.height = texture_size;
    var c= this.bitmapCanvas.getContext('2d');

    c.setTransform(1, 0, 0, 1, 0, 0);
    c.translate(texture_size/2, texture_size/2);

    // mouth
    c.fillStyle = "red";
    c.beginPath();
    c.arc(mouthP.x, mouthP.y, this.mouthR, 0, 2 * Math.PI);
    c.fill();

    // eye
    c.fillStyle = "blue";
    c.beginPath();
    c.arc(0, 0, this.eyeR, 0, 2 * Math.PI);
    c.fill();

    // tail
    c.fillStyle = "black";
    c.beginPath();
    c.arc(tailP.x, tailP.y, this.tailR, 0, 2 * Math.PI);
    c.fill();
};

Creature.prototype.GiveBrith = function () {
    var cs = ecosystem.creatures;
    // add empty creature to the end of an cretures array
    cs.push(new Creature);
    var newborn = cs[cs.length-1];
    newborn.pos = this.pos.clone();
    newborn.eyeR = this.eyeR + 0.5 * Math.random() * rndsign();
    newborn.mouthR = this.mouthR + 0.5 * Math.random() * rndsign();
    newborn.tailR = this.tailR + 0.5 * Math.random() * rndsign();
    newborn.invulnearability_timer = INVULNERABILITY_TIME;
    // calculation of basic parameters
    newborn.visionR = newborn.eyeR * VISION_DISTANCE;
    newborn.mass = newborn.mouthR + newborn.eyeR + newborn.tailR;
    newborn.food_counter = newborn.mass;
    newborn.velF = 0;
    newborn.IsNewborn = true;
    newborn.Prerender();
};

Creature.prototype.BiteStranger = function (prey) {
    this.food_counter += this.mouthR;

    prey.mouthR -= this.mouthR;
    if (prey.mouthR < 0) {
        prey.tailR += prey.mouthR;
        prey.mouthR = 0;
        if (prey.tailR < 0) {
            prey.eyeR += prey.tailR;
            prey.tailR = 0;
            if (prey.eyeR <= 0) {
                // return back a part of negative pray mass
                this.food_counter += prey.eyeR;
                // delete prey from array
                prey.IsDead = true;
                return;
            }
        }
    }

    // prey.food_counter = 0;
    prey.invulnearability_timer = INVULNERABILITY_TIME;
    prey.velF = 0;
    prey.dirV.negate();


};

// Trying to catch some food
Creature.prototype.CatchFood = function (food, dirTo) {
    var dist = dirTo.length();

    var max_dist = this.eyeR * VISION_DISTANCE;

    // relative distance to stranger (0..1)
    var dR = (max_dist - dist) / max_dist;


    if (dist < (this.eyeR)) {  // collision?
        food.Eat();
        this.food_counter += 1;
    }

    // Calc a acceleration
    dirTo.normalize();
    dirTo.multiply(dR);
    this.dirAccel.add(dirTo);


} ;


// Behave to specified stranger
Creature.prototype.Behave = function (stranger, dirTo) {
    var runaway = false;
    var dist = dirTo.length();

    var max_dist = this.eyeR * VISION_DISTANCE;

    // relative distance to stranger (0..1)
    var dR = (max_dist - dist) / max_dist;
 
    // we both has no mouth - then don't care
    if (stranger.mouthR == 0 && this.mouthR == 0) return;

    // we are smaller
    if ((this.mass < stranger.mass) && dR>0.1) runaway = true;
    else if (this.mouthR < stranger.mouthR) runaway = true;

    // we have a mouth
    if ((this.mouthR > 0) && (dist < this.eyeR)   // collision?
            && (this.mouthR > stranger.mouthR)) // our mouth is bigger
            {
            this.BiteStranger(stranger);
    }
   

    // Calc a acceleration
    dirTo.normalize();
    dirTo.multiply(dR);
    if (!runaway)  this.dirAccel.add(dirTo);
    else this.dirAccel.subtract(dirTo);

};

Creature.prototype.Vision = function () {
    var cs = ecosystem.creatures;
    var distance;
    var dirToNeibour;

    this.visionR = this.eyeR * VISION_DISTANCE;
    this.visionR *= this.visionR;

    var i;
    for (i = 0; i < cs.length; i++) {
        if (this == cs[i]) continue;
        if (cs[i].invulnearability_timer > 0) continue;

        dirToNeibour = cs[i].pos.subtract(this.pos, 1);
        distance = dirToNeibour.lengthSquared();
        // see ya!
        if (distance < this.visionR) this.Behave(cs[i], dirToNeibour)

    }

    // no mouth - no food
    if (this.mouthR == 0) return;

    var ef = ecosystem.food;
    for (i = 0; i < MAX_FOOD; i++) {
        dirToNeibour = ef[i].pos.subtract(this.pos, 1);
        distance = dirToNeibour.lengthSquared();
        // see ya!
        if (distance < this.visionR) this.CatchFood(ef[i], dirToNeibour)

    }
    //*/
} ;

Creature.prototype.Calculate = function () {

    // calculation of basic parameters
    this.mass = this.mouthR + this.eyeR + this.tailR;
    this.dirV.multiply(this.velF);

    if (this.IsDead) return;
    if (this.invulnearability_timer > 0) {
        this.invulnearability_timer -= tickperframe;
        return;
    }


    // apply acceleration
    this.dirAccel.multiply(0.04 * tickperframe * (this.tailR * this.tailR) /
     (this.eyeR * this.eyeR + this.tailR * this.tailR + this.mouthR * this.mouthR));

    this.dirV.add(this.dirAccel);

    // apply hynger
    var fuel = this.dirAccel.length();
    this.food_counter -= fuel * 0.05;
    if (this.food_counter < 0) {
        this.food_counter = 0;
        // delete creture from array
         this.IsDead = true;
    }
    this.dirAccel.set(0, 0);


    // move the creature
    var v = this.dirV.clone();
    v.multiply(tickperframe * 0.02);

    var p = this.pos;
    p.add(v);

    // Collision detection and response
    if (p.x <= 0 && v.x < 0) {
        this.dirV.x = -this.dirV.x;
        p.x = 0;
    }

    if (p.x >= canvas.width && v.x > 0) {
        this.dirV.x = -this.dirV.x;
        p.x = canvas.width;
    }

    if (p.y <= 0 && v.y < 0) {
        p.y = 0;
        this.dirV.y = -this.dirV.y;
    }

    if (p.y >= canvas.height && v.y > 0) {
        p.y = canvas.height;
        this.dirV.y = -this.dirV.y;
    }





    if (this.invulnearability_timer <= 0) this.Vision();
    if (this.mouthR > 0 && (this.food_counter >= (this.mass * 2))) {
        this.GiveBrith();
        this.food_counter = this.mass;
    }

    // breaking
    this.velF = this.dirV.length();
    if (this.velF > 0) this.dirV.divide(this.velF);

    this.velF -= BRAKING * tickperframe * 0.01;
    if (this.velF < MIN_SPEED) this.velF = MIN_SPEED;
    else if (this.velF > MAX_SPEED) this.velF = MAX_SPEED;



} ;

Creature.prototype.Draw = function () {
    var rot;
    var p = this.pos;

    ctx.setTransform(1, 0, 0, 1,0, 0);
    ctx.translate(p.x, p.y);
    rot = this.dirV.angleTo(Vec2(1, 0));
    ctx.rotate(-rot);

    ctx.translate(-this.bitmapCanvas.width/2, -this.bitmapCanvas.height/2);

    ctx.drawImage(this.bitmapCanvas,0,0);
  /*

   var mouthP = this.dirV.multiply(this.mouthR + this.eyeR, 1);
   var tailP = this.dirV.multiply(-this.tailR - this.eyeR, 1);

   var transitColor = "#888888";
    if (this.IsNewborn) transitColor = "yellow";

    // mouth
    ctx.fillStyle = "red";
    if (this.invulnearability_timer > 0) ctx.fillStyle = transitColor;
    ctx.beginPath();
    ctx.arc(mouthP.x, mouthP.y, this.mouthR, 0, 2 * Math.PI);
    ctx.fill();

    // eye
    ctx.fillStyle = "blue";
    if (this.invulnearability_timer > 0) ctx.fillStyle = transitColor;
    ctx.beginPath();
    ctx.arc(0, 0, this.eyeR, 0, 2 * Math.PI);
    ctx.fill();

    // tail
    ctx.fillStyle = "black";
    if (this.invulnearability_timer > 0) ctx.fillStyle = transitColor;
    ctx.beginPath();
    ctx.arc(tailP.x, tailP.y, this.tailR, 0, 2 * Math.PI);
    ctx.fill();
    */
}  ;