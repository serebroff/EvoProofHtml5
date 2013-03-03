
//-------------------------------------------------------
// class of cell
//-------------------------------------------------------
//var initDNA = "12 20 31 01 1032 230 012 13 32 301 01 210 021 123 301 321 102 21 321 12 123 321 321 012 210 032 122 320";
//var initDNA = "123 123 123 123 123 123 123 0 0 0 102 102 120 123 123 123 123";
//var initDNA = "143 176 134 ghjn oiuy trew 255 4 2 4 2 4 2 4 123 123 21 21 13 31 1 13";

//var initDNA = "1 133320 1 2 1 1 012 1 1 1 1 1 012 1 1 1 1 012 1 1 1 1 1 ";

var initDNA = "1 133320 145 254 5671 891 012 1 871 1 651 1 012 1 321 1 1 012 1 231 1 1 1 1 133320 145 254 5671 891 012 1 871 1 651 1 012 1 321 1 1 012 1 231 1 1 1";


Cell = function () {
    // position of a cell in 2d organism
    this.x=0;
    this.y=0;
    this.geneIndex = 0;
    this.mitosisIndex = 0;
    this.genome = initDNA.split(" "); 
    this.orientation = 0; 
    
    // abilities of the cell
    this.vision = 0.333;
    this.movement = 0.333;
    this.nutrition = 1 - this.vision - this.movement;
};

Cell.prototype.Mitosis = function () {    
    
    // if we ran out of genome 
    if (this.geneIndex >= this.genome.length ) return null;
    // test if that's the end of the gene
    if (this.mitosisIndex >= this.genome[this.geneIndex].length) return null;
    
        
    // new cell is coming
    var c = new Cell;
    
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
    this.cells.push(new Cell);

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
            for (j = 0; j < this.cells.length; j++)
            {
                if (newcell.x == this.cells[j].x && newcell.y == this.cells[j].y)
                {
                    IsFree = false;
                    break;
                }
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
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.translate(canvas.width/2,canvas.height/2);
    
    
    ctx.font="10px Arial Black";
    
    for (i = 0; i < this.cells.length; i++)
    {
        c = this.cells[i];
        x= c.x *20; y = c.y *20;
        ctx.fillStyle =  "rgb(200," + c.mitosisIndex*60 + "," + c.mitosisIndex*60 + ")" ;
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = "#000000";       
        ctx.fillText(c.geneIndex,x-5,y+5);

    }
}  ;

