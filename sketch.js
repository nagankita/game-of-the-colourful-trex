var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var gameOver, restart;
var jumpSound , checkPointSound, dieSound;


function preload(){
  trex_running =   loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground.png");
  
  cloudImage = loadImage("clouds1.png");
  
  obstacle1 = loadImage("obstacles2.png");
  obstacle2 = loadImage("obstacles3.png");
  obstacle3 = loadImage("obstacles4.png");
  obstacle4 = loadImage("obstacles5.png");
  obstacle5 = loadImage("obstacles6.png");
  obstacle6 = loadImage("obstacles1.png");
  
  gameOverImg = loadImage("gameOverrrr.png");
  restartImg = loadImage("restarting.png");
  
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3");
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  
  trex = createSprite(50,height-75,20,50);
  
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5 ;
  
  ground = createSprite(width/2,height-75,width ,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(width/2,height/2);
  gameOver.scale=0.5
  gameOver.addImage(gameOverImg);
  
  
  restart = createSprite(width/2,height/2+50);
  restart.addImage(restartImg);
  restart.scale =0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround=createSprite(200,height-70,400,10);
  invisibleGround.visible = false;
  invisibleGround.shapeColor="#f4cbaa"
  
  
  
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  //trex.debug = true;
  background("skyblue");
  text("Score: "+ score, 500,50);
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
    trex.changeAnimation("running", trex_running);
    
    if(touches.length>0 ||keyDown("space") && trex.y >= 120) {
      trex.velocityY = -12;
      jumpSound.play();
      touches=[]
      
    }
  
    trex.velocityY = trex.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
      dieSound.play();
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    trex.changeAnimation("collided",trex_collided);
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1); }
  if(touches.length>0)
  {
    reset(); 
    touches=[];
  }
   drawSprites();
}


function spawnClouds() {
  if (frameCount % 30 === 0) {
    var cloud = createSprite(width,120,40,10);
    cloud.y = Math.round(random(80,height/2));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
    
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    cloudsGroup.add(cloud);
  }
  
}



function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(width,height-80,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }         
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState=PLAY;
  score=0;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  gameOver.visible=false;
  restart.visible=false;
  
}






