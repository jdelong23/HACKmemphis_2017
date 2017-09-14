function Branch(begin, end) {
  this.begin = begin;
  this.end = end;
  this.finished = false;
  
  this.leftChild = null;
  this.rightChild = null;

  this.w;

  this.jitter = function() {
    this.end.x += random(-.1, .1);
    this.end.y += random(-.1, .1);

    //this.end.x += .1;
    //this.end.y -= .1;
    //this.w += .01;

  }

  this.show = function() {
    stroke(255);
    strokeWeight(this.w);
    line(this.begin.x, this.begin.y, this.end.x, this.end.y);
  }

  this.branchA = function() {
    var dir = p5.Vector.sub(this.end, this.begin);
    dir.rotate((PI / 6) + random(-.25, .25));
    dir.mult(0.80);
    var newEnd = p5.Vector.add(this.end, dir);

    var b = new Branch(this.end, newEnd);
    
    b.w = (this.w * 0.80);

    this.rightChild = b;
    return b;
  }
  this.branchB = function() {
    var dir = p5.Vector.sub(this.end, this.begin);
    dir.rotate((-PI / 6) + random(-.25, .25));
    dir.mult(0.80);
    var newEnd = p5.Vector.add(this.end, dir);

    var b = new Branch(this.end, newEnd);

    b.w = (this.w * 0.80);

    this.leftChild = b;
    return b;
  }



}
