//-------------------------------------------------------
// Base class of living space for creatures
//-------------------------------------------------------

var MAX_CREATURES = 256;
var MAX_FOOD = 150;

Ecosystem = function () {
    var i;
    this.creatures = []; //new Array();
    for (i = 0; i < MAX_CREATURES; i++) {
        this.creatures[i] = new Creature;
    }

    this.food = new Array();
    for (i = 0; i < MAX_FOOD; i++) {
        this.food[i] = new Food;
    }

}


Ecosystem.prototype.Calculate = function () {
    var i;
    for (i = 0; i < this.creatures.length; i++) {
        this.creatures[i].Calculate();
    }
    
    for (i = 0; i < this.creatures.length; i++) {
        if (this.creatures[i].IsDead) {
            this.creatures.splice(i, 1);
        }
    }

}

Ecosystem.prototype.Render = function () {
    var i;
    for (i = 0; i < this.creatures.length; i++) {
        this.creatures[i].Draw();
    }

   ctx.setTransform(1, 0, 0, 1, 0, 0);
   for (i = 0; i < this.food.length; i++) {
        this.food[i].Draw();
    }
    
}


