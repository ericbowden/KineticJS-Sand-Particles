
var Unit = Class.extend({
	init: function(args){
		this.destinationR = args.row;
		this.destinationC = args.col;
		this.width = args.size*args.board.GetCellSize();
		this.height = args.size*args.board.GetCellSize();
		this.top = args.row*args.board.GetCellSize();
		this.left = args.col*args.board.GetCellSize();
		this.topOffset = this.top;
		this.leftOffset = this.left;
		
		for (var prop in args)
			this[prop] = args[prop];
			
		//window[this.id] = this;
		
		this.SetPos(this.row, this.col);
		this.AddShape();
	},
	
	AddShape: function() {
	
		var color = this.color;
		var row = this.row;
		var col = this.col;
		var top = this.top;
		var left = this.left;
		var width = this.width;
		var height = this.height;
		
		this.shape = new Kinetic.Shape(function(){
			//console.log(IMAGES[team+'b'], col, row);
                var context = this.getContext();
                
                // draw invisible detectable path for image
                context.beginPath();
                context.rect(left, top, width, height);
				context.fillStyle = color;
				context.fill();
				//context.stroke();
                context.closePath();
				//context.drawImage(img, left, top);
            },this.id);
	
		this.board.stage.layers[0].add(this.shape);
	},
	
	SyncShape: function() {
		//this.shape.move(this.left,this.top);
		this.shape.setPosition(this.left-this.leftOffset,this.top-this.topOffset);
		//console.log(this.left, this.top, this.shape);
	},
	
	//this should overload the remove in Element.js
	Remove: function () {
		//clear old pos
		for (var r = 0; r < this.size; r++)
			for (var c = 0; c < this.size; c++)
				this.board.SetCell(this.row+r, this.col+c, 0);
	
		this.array.splice(this.array.indexOf(this),1);
		
		this.board.unitsLayer.remove(this.shape);
		//delete window[this.id];
	},
	
	SetPos: function(t_row,t_col){
	
		//clear old pos
		for (var r = 0; r < this.size; r++)
			for (var c = 0; c < this.size; c++)
				this.board.SetCell(this.row+r, this.col+c, 0);
		
		this.row = t_row;
		this.col = t_col;
		
		//add new to this.board
		for (var r = 0; r < this.size; r++)
			for (var c = 0; c < this.size; c++)
				this.board.SetCell(this.row+r, this.col+c, this.id);
	},
	
	Move: function(dir,period) {
		
		var horz = (dir == 'left' || dir == 'right')?1:0;
		var vert = (dir == 'up' || dir == 'down')?1:0;
		for(var i = 0; i < this.size; i++)	{			
			var cellValue = this.board.GetCell(this.row+((vert)?((dir=='down')?this.size:-1):i),this.col+((horz)?((dir=='left')?this.size:-1):i));			
			if(cellValue!=0) {
				return false;
			}				
		}
		
		var sp = Math.ceil(this.speed*period); //cells per second
		
		this.SetPos(this.row+((vert)?((dir=='down')?sp:-sp):0),this.col+((horz)?((dir=='left')?sp:-sp):0));
		this.top = this.row*this.board.GetCellSize();
		this.left = this.col*this.board.GetCellSize();
		
		return true;
	},
	
	/*Move: function(dir1, dir2){
			
		var horz = (dir2 == 'left' || dir2 == 'right')?1:0;
		var vert = (dir1 == 'up' || dir1 == 'down')?1:0;
		for(var i = 0; i < this.size;i++)	 {
			var cellValue = this.board.GetCell(this.row+((vert)?((dir1=='down')?this.size:-1):i),this.col+((horz)?((dir2=='left')?this.size:-1):i));
			
			//if cell is occupied or is a boundary
			if(cellValue!=0) {
				return false;
			}	
			
		}
		var sp = Math.ceil(this.speed*this.period); //cells per second
		
		this.SetPos(this.row+((vert)?((dir1=='down')?sp:-sp):0),this.col+((horz)?((dir2=='left')?sp:-sp):0));
		this.top = this.row*this.board.GetCellSize();
		this.left = this.col*this.board.GetCellSize();
		
		return true;
	},*/
	
	SetMoveTo: function(r,c){this.destinationR = r;this.destinationC = c;},
	
	MoveTo: function(period){
	
		var dx = this.destinationC - this.col;
		var dy = this.destinationR - this.row;
		var vDir = (dy >= 0 ? 'down' : 'up');
		var xDir = (dx >= 0 ? 'left' : 'right');
		if(dy != 0)
			this.Move(vDir,period);
		if(dx != 0)
			this.Move(xDir,period);
		if(dy == 0 && dx == 0)
			this.moving = false;
		else
			this.moving = true;
	},
	
	/*MoveTo: function(period){
		var dx;
		var dy;
		dy = this.destinationR - this.row;
		dx = this.destinationC - this.col;
		
		this.period = period;
		
		var yDir = false;
		var xDir = false;
		var yBool = true;
		var xBool = true;
		if(dy*dy+dx*dx > 100){
			if(Math.abs(dy/dx) > 5.0){
				xBool = false;
			}
			else if(Math.abs(dx/dy) > 7.0){
				yBool = false;
			}
		}
		else{
		
		}
		if(dy > 0 && yBool)
			yDir = 'down';
		else if(dy < 0 && yBool)
			yDir = 'up';

		if(dx > 0 && xBool)
			xDir = 'left';
		else if(dx < 0 && xBool)
			xDir = 'right';

		if(dy != 0 || dx != 0){
			this.moving = true;
			if(!this.Move(yDir,xDir)){//try moving whatever direction you're supposed to
				if(yDir!=false && xDir!=false){ // if moving diagonal
					if(Math.floor(Math.random()*2)){ //random
						if(!this.Move(yDir,false)){ // move up or down
							if(!this.Move(false,xDir)){ // move left or right
								if(Math.floor(Math.random()*2)){ // randomly move diagonal another way
									if(yDir == 'up'){
										if(!this.Move('down',xDir)){
											if(xDir == 'left'){
												if(!this.Move(yDir,'right'))
													this.Moving = false;
											}
											else{
												if(!this.Move(yDir,'left'))
													this.Moving = false;
											}
										}
									}
									else{
										if(!this.Move('up',xDir)){
											if(xDir == 'left'){
												if(!this.Move(yDir,'right'))
													this.Moving = false;
											}
											else{
												if(!this.Move(yDir,'left'))
													this.Moving = false;
											}
										}
									}
								}
								else{
									if(xDir == 'right'){
										if(!this.Move(yDir,'left')){
											if(yDir == 'up'){
												if(!this.Move('down',xDir))
													this.Moving = false;
											}
											else{
												if(!this.Move('down',xDir))
													this.Moving = false;
											}
										}
									}
									else{
										if(!this.Move(yDir,'right')){
											if(yDir == 'up'){
												if(!this.Move('down',xDir))
													this.Moving = false;
											}
											else{
												if(!this.Move('down',xDir))
													this.Moving = false;
											}
										}
									}
								}
							}
						}
					}
					else{
						if(!this.Move(false,xDir)){
							if(!this.Move(yDir,false)){
								if(Math.floor(Math.random()*2)){
									if(yDir == 'up'){
										if(!this.Move('down',xDir)){
											if(xDir == 'left'){
												if(!this.Move(yDir,'right'))
													this.Moving = false;
											}
											else{
												if(!this.Move(yDir,'left'))
													this.Moving = false;
											}
										}
									}
									else{
										if(!this.Move('up',xDir)){
											if(xDir == 'left'){
												if(!this.Move(yDir,'right'))
													this.Moving = false;
											}
											else{
												if(!this.Move(yDir,'left'))
													this.Moving = false;
											}
										}
									}
								}
								else{
									if(xDir == 'right'){
										if(!this.Move(yDir,'left')){
											if(yDir == 'up'){
												if(!this.Move('down',xDir))
													this.Moving = false;
											}
											else{
												if(!this.Move('down',xDir))
													this.Moving = false;
											}
										}
									}
									else{
										if(!this.Move(yDir,'right')){
											if(yDir == 'up'){
												if(!this.Move('down',xDir))
													this.Moving = false;
											}
											else{
												if(!this.Move('down',xDir))
													this.Moving = false;
											}
										}
									}
								}
							}
						}
					}
				}else if(yDir!=false){ // else if up or down
					if(Math.floor(Math.random()*2)){
						if(!this.Move(yDir,'left')){ // move diagonally
							if(!this.Move(yDir,'right')){
								if(Math.floor(Math.random()*2)){
									if(!this.Move(false,'left')){
										if(!this.Move(false,'right'))
											this.moving = false;
									}
								}
								else{
									if(!this.Move(!this.Move(false,'right'))){
										if(!this.Move(false,'left'))
											this.moving = false;
									}
								}
							}
						}
					}
					else{
						if(!this.Move(yDir,'right')){
							if(!this.Move(yDir,'left')){
								if(Math.floor(Math.random()*2)){
									if(!this.Move(false,'left')){
										if(!this.Move(false,'right'))
											this.moving = false;
									}
								}
								else{
									if(!this.Move(!this.Move(false,'right'))){
										if(!this.Move(false,'left'))
											this.moving = false;
									}
								}
							}
						}
					}
				}
				else{
					if(Math.floor(Math.random()*2)){
						if(!this.Move('up',xDir)){
							if(!this.Move('down',yDir)){
								if(Math.floor(Math.random()*2)){
									if(!this.Move('up',false)){
										if(!this.Move('down',false))
											this.moving = false;
									}
								}
								else{
									if(!this.Move('down',false)){
										if(!this.Move('up',false))
											this.moving = false;
									}
								}
							}
						}
					}
					else{
						if(!this.Move('down',xDir)){
							if(!this.Move('up',yDir)){
								if(Math.floor(Math.random()*2)){
									if(!this.Move('up',false)){
										if(!this.Move('down',false))
											this.moving = false;
									}
								}
								else{
									if(!this.Move('down',false)){
										if(!this.Move('up',false))
											this.moving = false;
									}
								}
							}
						}
					}
				}
			}
				
		}
		else
			this.moving = false;
	},*/

});
