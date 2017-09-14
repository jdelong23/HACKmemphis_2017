
//tree display variables
var tree = [];
var leaves = [];
var count = 0; //number of tree levels
var root = null;
//timer variables
var interval;
var startTime = 0;
var endTime = 0;
var currentTime = 0;
var timeRemaining = 0;
var intervalDurationInMiliseconds = 0;
var hasAlarmSounded = false;

var display = "Click to Start";

var NUM_GROWTH_INTERVALS = 12; //CONSTANT, corresponds to max count of tree levels
var milsPerGrowthInterval = 0;

var currentGrowthInterval = 0;
var nextGrowthInterval = 0;

var backgroundMusic = new Audio("bensound-slowmotion.mp3");

//--------------Timer Functions--------------

//converts time given in miliseconds to its equivalent # of hours/minutes/seconds
function updateDisplayTime(timeInMilis)
{
  var displayHours = Math.floor((timeInMilis % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var displayMinutes = Math.floor((timeInMilis % (1000 * 60 * 60)) / (1000 * 60));
  var displaySeconds = Math.floor((timeInMilis % (1000 * 60)) / 1000);

  display = displayHours + "h " +displayMinutes + "m " + displaySeconds + "s";
  
  //console.log(display);
  
}

//determines interval duration and arc length of the interval angle from time given in minutes  
function setTime(timeInMinutes)
{
    intervalDurationInMiliseconds = minutesToMiliseconds(timeInMinutes);//input is given in minutes, interval calculations are made in miliseconds
    
    var totalTimeInSeconds = milisecondsToSeconds(intervalDurationInMiliseconds); //time in seconds
    
    milsPerGrowthInterval = intervalDurationInMiliseconds * (1/NUM_GROWTH_INTERVALS);
    //console.log(milsPerGrowthInterval);
    updateDisplayTime(intervalDurationInMiliseconds); //updates digital display
    
}

//initializes timer variables and instantiates the interval object
function startTimer()
{
    startTime = Date.now(); //start time of interval begins as soon as startTimer is called
    endTime = (startTime + intervalDurationInMiliseconds);
    currentTime = startTime;
    timeRemaining = endTime - currentTime; //time remaining in the current interval
    hasAlarmSounded = false;
    
    currentGrowthInterval = intervalDurationInMiliseconds;
    nextGrowthInterval = currentGrowthInterval - milsPerGrowthInterval;

    //console.log(currentGrowthInterval, nextGrowthInterval);
    interval = setInterval(updateInterval,1); //instantiates interval, updates every milisecond
    
}

//updates timer variables adjusts draw function according to the current time givien in miliseconds
function updateInterval()
{
    currentTime = Date.now();
    timeRemaining = endTime - currentTime;
    var timeRemainingInSeconds = milisecondsToSeconds(timeRemaining);
    
    //continue updating the interval until it reaches less than ~10 miliseconds
    //this approximation is used as a measure to prevent interval from running over, still accurate to the nearest second
    if(timeRemaining > 10)
    {

      if(timeRemaining <= nextGrowthInterval)
      {
        growTree();
        currentGrowthInterval = nextGrowthInterval;
        nextGrowthInterval = currentGrowthInterval - milsPerGrowthInterval;
        //console.log(currentGrowthInterval,nextGrowthInterval);
      }
      updateDisplayTime(timeRemaining); //update digital display
  
    }
    //calls function to stop the interval only once sometime within the stopping range(~10 milisecons)
    else
    {
      if(!hasAlarmSounded)
      {
        growTree();
        stopTimer();
      }
    }

    //console.log(timeRemaining, timeRemainingInSeconds, hasAlarmSounded); 
}

//clears interval and resets timer variables, resets digital display
//displays alert message
function stopTimer()
{
      if(!hasAlarmSounded)
      {
        clearInterval(interval);
        startTime = 0;
        endTime = 0;
        currentTime = 0;
        timeRemaining = 0;
        intervalDurationInMiliseconds = 0;
        hasAlarmSounded = true;
        
        setTime(0);
        updateDisplayTime(0);
        display = "You Made It. Congrats!";
        
      }
      
}

//converts minutes to seconds, used when calculating arc length from time remaining * degrees per second
function minutesToSeconds(minutes)
{
    return (minutes * 60);
}
//converts minutes to miliseconds, miliseconds are the baseline units used for interval calculations
function minutesToMiliseconds(minutes)
{
    return (minutes * 60 * 1000);
}
//converts miliseconds to seconds
function milisecondsToSeconds(miliseconds)
{
  return (miliseconds * 0.001);
}


//--------------Display Functions--------------

//init function for canvas
function setup() {
  
  createCanvas(window.innerWidth,window.innerHeight);
  var a = createVector(width / 2, height);
  var b = createVector(width / 2, height - (height * 0.18));
  
  root = new Branch(a, b);
  root.w = 10;
  tree[0] = root;

}


function mousePressed() {

  backgroundMusic.load();
  backgroundMusic.play();
  
  killTree();
  setTime(3);
  startTimer();

}
function windowResized()
{
  backgroundMusic.load();
  killTree();
  setup();
}

function growTree()
{
  if(count < 12)
  {
    for (var i = tree.length - 1; i >= 0; i--) {
      if (!tree[i].finished) {
        tree.push(tree[i].branchA());
        tree.push(tree[i].branchB());

      }
      tree[i].finished = true;
    }
    count++;
    

    if (count >= 10) {
      for (var i = 0; i < tree.length; i++) {
        if (!tree[i].finished) {
          var leaf = tree[i].end.copy();
          leaves.push(leaf);
        }
      }
    }

  
  }
}
//DRAW FUNCTION, NUFF SAID
function draw() {
  background(51);

  textSize(height - (height * 0.90));
  textAlign(CENTER);
  fill(255, 255, 255, 255);
  var test = text(display , (width/2), height - (height * 0.90));
  
  //tree[0].end.x += 1;
  //tree[0].end.y -= 1;

  for (var i = 0; i < tree.length; i++) 
  {
    tree[i].show();
    tree[i].jitter();
  }

  for (var i = 0; i < leaves.length; i++) 
  {
    fill(255, 0, 100, 100);
    noStroke();

    ellipse(leaves[i].x, leaves[i].y, 8, 8);

    if(timeRemaining == 0)
    {
       leaves[i].y += random(2, 5);
    } 
  }

  if (keyIsPressed)
  {
    backgroundMusic.load();
    killTree(); 
  }

}

window.onblur = function() 
{
  backgroundMusic.load();
  killTree();
};

function killTree()
{
  stopTimer();
  display = "Click to Start";
  count = 0;
  tree = tree.slice(0,1);
  tree[0].finished = false;
  leaves = [];
}