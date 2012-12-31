/* args
id: boardId, //css id
rowNum: r,
colNum: c,
top: top,
left: left,
color: color,
cellSize: cellSize, //px by px
*/
var Board = Class.extend({
	init: function(args){
	
		this.width = args.colNum*args.cellSize;
		this.height = args.rowNum*args.cellSize;
		
		for (var prop in args)
			this[prop] = args[prop];
			
		window[this.id] = this;

		//test canvas
		this.CreateCanvas();
		this.CreateArray();
	},
	
	GetCell: function(r,c) {
		if(r < 0 || r > this.rowNum-1 || c < 0 || c > this.colNum-1)
			return false;
		return this.array[r][c];
	},
	
	SetCell: function(r,c, t_bool) {
		if(r < 0 || r > this.rowNum-1 || c < 0 || c > this.colNum-1)
			return false;
		this.array[r][c] = t_bool;
	},

	GetCellSize: function(){
		return this.cellSize;
	},
	
	//canvas test
	CreateCanvas: function(){
		var canvas = $('<div></div>').attr({'id':'board-canvas', width: this.width, height: this.height});
		$('body').append(canvas);
		$('#board-canvas').css({'background-color':'gray','position':'absolute', width: this.width, height: this.height,top: this.top, left: this.left});
		
		this.stage = new Kinetic.Stage('board-canvas', this.width, this.height);
		var layer = new Kinetic.Layer('sand_layer');
		this.stage.add(layer);
	},
	
	CreateArray: function(){
		var array = []
		for (var r = 0; r < this.rowNum; r++)
			for (var c = 0; c < this.colNum; c++) 
				array[r] = new Array(this.colNum);
				

		for (var r = 0; r < this.rowNum; r++)
			for (var c = 0; c < this.colNum; c++) {		
				//assigns values to array
				if(c == 0 || c == this.colNum-1 || r==0 || r==this.rowNum-1) {
					array[r][c] = 1;
				}else {
					array[r][c] = 0;
				}
			}

			this.array = array;
	},
	
});