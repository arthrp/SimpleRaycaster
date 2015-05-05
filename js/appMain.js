const Keys = {
	get Up(){ return 38; },
	get Down(){ return 40; },
	get Right(){ return 39; },
	get Left(){ return 37; },
	
	get W(){ return 87; },
	get A(){ return 65; },
	get S(){ return 83; },
	get D(){ return 68; }
};

var Player = function(x,y){
    'use strict';
    var self = this;
    
    self.x = x + 0.5;
    self.y = y + 0.5;
    self.dirX = 1.0;
    self.dirY = 0;

    self.cameraPlaneX = 0;
    self.cameraPlaneY = 0.66;
    
    self.speed = 0.10;
    self.rotationSpeed = 0.05; //in radians
    
    self.up = false;
    self.down = false;
    self.right = false;
    self.left = false;
    
    self.init = function(){
        document.addEventListener("keydown", self.handleKeyDown, false);
		document.addEventListener("keyup", self.handleKeyUp, false);
        
        self.cosRotationSpeed = Math.cos(self.rotationSpeed);
        self.cosRotationSpeedInversed = Math.cos(-self.rotationSpeed);
        self.sinRotationSpeed = Math.sin(self.rotationSpeed);
        self.sinRotationSpeedInversed = Math.sin(-self.rotationSpeed);
        
        console.log('cosRotationSpeedInversed',self.cosRotationSpeedInversed);
        console.log('sinRotationSpeedInversed',self.sinRotationSpeedInversed);
    };
    
    self.update = function(map){
        var changeX = self.dirX * self.speed,
			changeY = self.dirY * self.speed;
        var oldDirX, oldPlaneX;
        
        if(self.up) {
			if(map.isFree(Math.floor(self.x + changeX), Math.floor(self.y))) {
				self.x += changeX;
			}
			if(map.isFree(Math.floor(self.x), Math.floor(self.y + changeY))) {
				self.y += changeY;
			}
		}
		else if(self.down) {
			if(map.isFree(Math.floor(self.x - changeX), Math.floor(self.y))) {
				self.x -= changeX;
			}
			if(map.isFree(Math.floor(self.x), Math.floor(self.y - changeY))) {
				self.y -= changeY;
			}
		}
        
        if(self.right){
            oldDirX = self.dirX;
            oldPlaneX = self.cameraPlaneX;
            self.dirX = self.dirX * self.cosRotationSpeed - self.dirY * self.sinRotationSpeed;
            self.dirY = oldDirX * self.sinRotationSpeed + self.dirY * self.cosRotationSpeed;
            
            self.cameraPlaneX = self.cameraPlaneX * self.cosRotationSpeed - self.cameraPlaneY * self.sinRotationSpeed;
            self.cameraPlaneY = oldPlaneX * self.sinRotationSpeed + self.cameraPlaneY * self.cosRotationSpeed;          
        }   
        else if(self.left){
            oldDirX = self.dirX;
            oldPlaneX = self.cameraPlaneX;
            self.dirX = self.dirX * self.cosRotationSpeedInversed - self.dirY * self.sinRotationSpeedInversed;
            self.dirY = oldDirX * self.sinRotationSpeedInversed + self.dirY * self.cosRotationSpeedInversed;
            
            self.cameraPlaneX = self.cameraPlaneX * self.cosRotationSpeedInversed - self.cameraPlaneY * self.sinRotationSpeedInversed;
            self.cameraPlaneY = oldPlaneX * self.sinRotationSpeedInversed + self.cameraPlaneY * self.cosRotationSpeedInversed;  
        }
    };
    
    self.handleKeyDown = function(ev){
        //console.log('down',ev);
        handleKeyPress(ev, true);
    };
    
    self.handleKeyUp = function(ev){
        handleKeyPress(ev, false);
    };
    
    function handleKeyPress(event, isKeyDown){
        if(event.keyCode == Keys.Left) {
			self.left = isKeyDown;
		}
        else if(event.keyCode == Keys.Right) {
			self.right = isKeyDown;
		}
        
        if(event.keyCode == Keys.Up) {
			self.up = isKeyDown;
		}
        else if(event.keyCode == Keys.Down) {
			self.down = isKeyDown;
		}
    }
    
    self.init();
};

var Map = function(){
    var self = this;
    
    const mapData =
               [ 1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
				 1,0,0,0,0,0,0,0,1,1,1,0,0,0,1,0,0,0,0,1,
				 1,0,1,1,0,1,1,0,0,1,1,0,0,0,0,0,0,1,0,1,
				 1,0,1,1,0,1,1,0,0,0,0,0,1,1,0,1,0,0,0,1,
				 1,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,0,1,
				 1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,
				 1,0,0,0,1,1,1,0,0,0,1,1,0,0,0,0,0,1,1,1,
				 1,0,0,0,1,1,1,0,0,0,0,0,0,1,0,1,0,1,1,1,
				 1,1,0,1,1,1,1,0,0,0,1,1,0,0,0,0,0,1,1,1,
				 1,1,0,0,1,1,1,1,0,1,1,1,0,1,0,1,0,1,1,1,
				 1,1,1,0,0,0,0,0,0,1,1,1,0,0,0,0,0,1,1,1,
				 1,1,1,0,0,0,1,1,1,1,1,1,1,1,0,1,1,1,1,1,
				 1,1,1,1,0,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,
				 1,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,
				 1,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,
				 1,1,0,1,1,0,0,1,1,1,1,1,1,1,0,0,1,1,1,1,
				 1,1,0,0,0,0,0,0,1,1,1,1,1,1,1,0,1,1,1,1,
				 1,1,1,1,1,0,0,0,0,1,1,1,0,0,0,0,0,0,0,1,
				 1,1,1,1,1,1,0,0,0,1,1,1,1,0,1,1,1,0,1,1,
				 1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
			     ];  
    
    self.width = 20,
    self.height = 20,
    
    self.textures = [],
    
    self.init = function(){
        var files = [ '', 'img/wall2.jpg'];
        var version = 1;
        
        for(i=0; i<files.length; i++) {
			self.textures[i] = new Image();
			self.textures[i].src = files[i] + "?" + version;
		}
        
        console.log(self.textures);
    },
    
    self.test = function(x,y){
        return mapData[y*self.width + x];
    },
    
    self.isFree = function(x,y){
        if(x < 0 || x >= self.width || y < 0 || y >= self.height) {
			return false;
		}
		return mapData[y*self.width + x] == 0;
    },
    
    self.getTexture = function(x,y){
        var idx = mapData[y*self.width + x];
        
        return self.textures[idx];
    }
    
    self.init();
}

var Raycaster = function(){
    var self = this;
    var canvas = document.getElementById("main-canv");

    var canvasCtx;
    var player = new Player(1,1);
    var mainMap = new Map();
    
    const floorColor0 = 'rgb(0, 0, 0)';
    const floorColor1 = 'rgb(80, 90, 100)';
    const ceilingColor0 = 'rgb(0, 0, 0)';
    const ceilingColor1 = 'rgb(80, 80, 80)';
    
    const canvWidth = canvas.width;
    const canvHeight = canvas.height;
    
    self.setup = function(){        
        canvasCtx = canvas.getContext("2d");
    };
    
    self.draw = function(){
        canvasCtx.clearRect(0, 0, canvWidth, canvHeight);
        var zBuffer = [];
        
        //draw floor/ceiling
        var grad = canvasCtx.createLinearGradient(0,canvHeight/2, 0,canvHeight);
		grad.addColorStop(0, floorColor0);
		grad.addColorStop(1, floorColor1);
		canvasCtx.fillStyle = grad
		canvasCtx.fillRect(0,canvHeight/2, canvWidth,canvHeight/2);
		grad = canvasCtx.createLinearGradient(0, 0, 0, canvHeight/2);
		grad.addColorStop(1, ceilingColor0);
		grad.addColorStop(0, ceilingColor1 );
		canvasCtx.fillStyle = grad;
		canvasCtx.fillRect(0, 0, canvWidth,canvHeight/2);
        
        for(var columnIdx=0; columnIdx < canvWidth; columnIdx++){
            drawColumn(columnIdx,player,canvas,canvasCtx,zBuffer);
        }
    };
    
    
    self.mainLoop = function(){
        requestAnimationFrame(self.mainLoop);
        
        player.update(mainMap);
        self.draw();
    };
    
    self.run = function(){      
        self.mainLoop();
    };
    
    function drawColumn(columnIdx, player, canvas, canvasCtx, zBuffer){       
        var rayPositionX, rayPositionY, rayDirX, rayDirY, mx, my, deltaX,
				deltaY, stepX, stepY, horiz, wallDistance, wallHeight,
				wallX, drawStart, textureToDraw;
			
        var cameraX = (2 * columnIdx / canvWidth) - 1;
			rayPositionX = player.x;
			rayPositionY = player.y;
			rayDirX = player.dirX + player.cameraPlaneX*cameraX;
			rayDirY = player.dirY + player.cameraPlaneY*cameraX;
			mx = Math.floor(rayPositionX);
			my = Math.floor(rayPositionY);
			deltaX = Math.sqrt(1 + (rayDirY * rayDirY) / (rayDirX*rayDirX));
			deltaY = Math.sqrt(1 + (rayDirX * rayDirX) / (rayDirY*rayDirY));

			// initial step for the ray
			if(rayDirX < 0) {
				stepX = -1;
				dist_x = (rayPositionX - mx) * deltaX;
			} else {
				stepX = 1;
				dist_x = (mx + 1 - rayPositionX) * deltaX;
			}
			if(rayDirY < 0) {
				stepY = -1;
				dist_y = (rayPositionY - my) * deltaY;
			} else {
				stepY = 1;
				dist_y = (my + 1 - rayPositionY) * deltaY;
			}

			// DDA
			while(true) {
				if(dist_x < dist_y) {
					dist_x += deltaX;
					mx += stepX;
					horiz = true;
				} else {
					dist_y += deltaY;
					my += stepY;
					horiz = false;
				}

				if(!mainMap.isFree(mx, my)) {
					break;
				}
			}

			// wall distance
			if(horiz) {
				wallDistance = (mx - rayPositionX + (1 - stepX) / 2) / rayDirX;
				wallX = rayPositionY + ((mx - rayPositionX + (1 - stepX) / 2) / rayDirX) * rayDirY;
			} else {
				wallDistance = (my - rayPositionY + (1 - stepY) / 2) / rayDirY;
				wallX = rayPositionX + ((my - rayPositionY + (1 - stepY) / 2) / rayDirY) * rayDirX;
			}
			wallX -= Math.floor(wallX);

			if(wallDistance < 0) {
				wallDistance = -wallDistance;
			}

			zBuffer[columnIdx] = wallDistance;

			wallHeight = Math.abs(Math.floor(canvHeight / wallDistance));
			drawStart = -wallHeight/2 +canvHeight/2;

			wallX = Math.floor(wallX * mainMap.getTexture(mx, my).width);
			if(horiz && rayDirX > 0) {
				wallX = mainMap.getTexture(mx, my).width - wallX -1;
			}
			if(!horiz && rayDirY < 0) {
				wallX = mainMap.getTexture(mx, my).width - wallX -1;
			}
                        
			textureToDraw = mainMap.getTexture(mx, my);
			canvasCtx.drawImage(textureToDraw, wallX, 0, 1, textureToDraw.height, columnIdx, drawStart, 1, wallHeight);

			// light
            drawLight(wallHeight,columnIdx,drawStart);
    }
    
    function drawLight(wallHeight, columnIdx, drawStart){
        var tint = (wallHeight*1.6)/canvHeight;
        var c = Math.round(60/tint);
        c = 60-c;
        if(c<0) {
            c = 0;
        }
        tint = 1-tint;
        canvasCtx.fillStyle = "rgba(" + c + ", " + c + ", " + c + ", " + tint + ")";
        canvasCtx.fillRect(columnIdx, drawStart, 1, wallHeight);
    }
    
    self.setup();
};

var app = new Raycaster();
app.run();