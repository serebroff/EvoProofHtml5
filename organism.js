
//-------------------------------------------------------
// class of cell
//-------------------------------------------------------
//dirX = {1,0,-1,0};
//dirY = {0,-1,0,1};

Cell = function (initDNA) {
    // position of a cell in 2d organism
    this.x=0;
    this.y=0;
    this.geneIndex = 0;
    this.mitosisIndex = 0;
    this.initDNA = initDNA;
    this.genome = initDNA.split(' ');
/*    var symbol;
    for(var i=0; i<this.genome; i++)
    {
        symbol= (this.genome[i]-32)%5;
        if (symbol == 0) this.genome[i]= ' ';
        else this.genome[i]= symbol + 48;
    }*/
    this.orientation = 0; 
    
    // abilities of the cell
    this.vision = 0.333;
    this.movement = 0.333;
    this.nutrition = 1 - this.vision - this.movement;
    this.appearTimer=0;
};

Cell.prototype.Mitosis = function () {    
    
    // if we ran out of genome 
    if (this.geneIndex >= this.genome.length ) return null;
    // test if that's the end of the gene
    if (this.mitosisIndex >= this.genome[this.geneIndex].length) return null;
    
        
    // new cell is coming
    var c = new Cell(this.initDNA);
    
    // set up next gene index for the new cell
    c.geneIndex = this.geneIndex+this.mitosisIndex +1;
    c.mitosisIndex = 0;

    // cell pos in organism
    c.x=this.x;
    c.y=this.y;

    // currrent gene in genome
    var gene = this.genome[this.geneIndex].charCodeAt(this.mitosisIndex);
    
    // get orientation from the gene and according to previous orientation
    c.orientation = (this.orientation + gene - 49)%4;
    
    switch(c.orientation)
    {
     case 0: c.x++; break;
     case 1: c.y--; break;
     case 2: c.x--; break;
     case 3: c.y++; break;        
    }
    
    // mitosis occured
    this.mitosisIndex++;
    
    return c;
};


//-------------------------------------------------------
// class of organism
//-------------------------------------------------------

Organism = function () {
    this.cells = [];
    this.Init('1');


};

Organism.prototype.Init = function (initDNA) {
    this.cells.length = 0;
    this.cells.push(new Cell(initDNA));

};


Organism.prototype.Grow = function () {
    var i,j;
    var newcell;
    var IsFree;
    var numcells=this.cells.length;
    
    for (i = 0; i < numcells; i++)
    {
        newcell = this.cells[i].Mitosis();
        if (newcell === null) continue;
 //       while (newcell !== null)
        {

            IsFree = true;
            // check if a square is free
            for (j = 0; j < this.cells.length; j++)
                if (newcell.x == this.cells[j].x && newcell.y == this.cells[j].y) {
                    IsFree = false;
                    break;
                }
            if (IsFree) this.cells.push(newcell);
            
   //         newcell = this.cells[i].Mitosis();

        }
        

    }
};


Organism.prototype.CellToBody = function (cell) {

};

Organism.prototype.Vision = function () {

} ;

Organism.prototype.Calculate = function () {


} ;

Organism.prototype.Draw = function () {
    var i;
    var c;
    var x,y;
    var cellR= 10;
    var alpha;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.translate(canvas.width/2,canvas.height/2);
    
    
    ctx.font="10px Arial Black";
    
    for (i = 0; i < this.cells.length; i++)
    {
        c = this.cells[i];

        alpha =1;

        if (c.appearTimer< 1000) {
            c.appearTimer +=tickperframe;
            alpha = c.appearTimer/ 1000;
        }
        ctx.opacity = alpha;

        x= c.x *cellR *2 ; y = c.y *cellR * 2;
        ctx.fillStyle =  "rgba(200," + c.mitosisIndex*60 +
            "," + c.mitosisIndex*60 + "," + alpha + ")" ;
        ctx.beginPath();
        ctx.arc(x, y, cellR, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = "#000000";       
        ctx.fillText(c.geneIndex,x-cellR/2,y+cellR/2);

    }
}  ;

