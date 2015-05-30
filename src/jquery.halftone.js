/**
 * Halftone methods migrated from AS3 as a jQuery plugin.
 * 
 * You who turn the wheel and look to windward,
 * Consider Phlebas, who was once handsome and tall as you.
 *
 * MIT licensed
 * Copyright (C) 2015 Pez 
 *
 */
(function( $ ) {

	var lMethods={
		Mean:function(r,g,b){return ((r+g+b)/3)},
		Standard:function(r,g,b){return (0.2126*r) + (0.7152*g) + (0.0722*b)},
		PerceivedA:function(r,g,b){return (0.299*r) + (0.587*g) + (0.114*b)},
		PerceivedB:function(r,g,b){return Math.sqrt( Math.pow(0.241*r,2) + Math.pow(0.691*g,2) + Math.pow(0.068*b,2) )}
	}

   /**
	* Plugin definition.
	*
	* @return object jQuery Object
	*/
	$.fn.halftone = function( options ) {
		if (true !== this.is('canvas')) throw new Error("This plugin can only be applied to canvas elements!");

		var options = options || {};
		
		// Extend our default options with those provided.
		var opts = $.extend( {}, $.fn.halftone.defaults, options );
		
		this.css( "background-color", opts.background );


		if ("Standard" != opts.luminosity) $.fn.halftone.setLuminance( opts.luminosity );
		 
		 
		var ctx=this[0].getContext("2d", { alpha : false });
		ctx.fillStyle=opts.color;
		
		this.data('srcImageData',i);
		var i = ctx.getImageData(0,0,this[0].width,this[0].height);
		
		//consider topleft,bottomright and zoomfactor options
		var originx = 0, originy = 0;
		if(null !== opts.topleft){
			var originx = opts.topleft[0];
			var originy = opts.topleft[1];
		}
		var endx = this[0].width, endy = this[0].height;
		if(null !== opts.bottomright){
			var endx = opts.bottomright[0];
			var endy = opts.bottomright[1];
		}
		
		var mtx = $.fn.halftone.matrixFromContext(ctx,endx,endy,opts.sample);
		
		if(0 == opts.zoomfactor)opts.sample = Math.ceil(this[0].width/mtx[0].length);
		
		ctx = $.fn.halftone.draw(ctx,endx,endy,opts.sample,mtx);
		
		return this;
 
	};
	
	//--- Public Methods ---
	$.fn.halftone.defaults = {
		background: "#000000",
		color: "#ffffff",
		luminosity: "Standard",
		topleft: null,
		bottomright: null,
		zoomfactor: null,
		sample: 8
	};
	
	$.fn.halftone.lMethods = lMethods;
	$.fn.halftone.Luminance = lMethods.Standard;
	
	//--- Public Dalek ---
	/*     
              ___              
      D>=G==='   '.            
            |======|     Exterminate!    
            |======|    /     
        )--/]IIIIII]           
           |_______|           
           C O O O D           
          C O  O  O D          
         C  O  O  O  D         
         C__O__O__O__D         
snd     [_____________]    
	
	*/
	
   /**
	* Set the luminosity calculation to use
	* 
	* @param string arg 
	*
	* @return Boolean
	*/
	$.fn.halftone.setLuminance=function (arg) {
 
	 if (typeof(arg) === "function"){
		$.fn.halftone.Luminance = arg;
	 }
	 if (arg in lMethods){
		$.fn.halftone.Luminance = lMethods[arg];
		return true;
	 }
	return false;
 
   };
   /**
	* Create a Matrix of luminosity values from the canvas data
	*
	* @param CanvasRenderingContext2D ctx	   Javascript image context object
	* @param integer				  width	   Width of canvas in pixels.
	* @param integer				  height   Height of canvas in pixels.
	* @param integer				  sample   sample area size.
	*
	* @return Array Matrix of luminosity values;
	*/
	$.fn.halftone.matrixFromContext = function (ctx,width,height,sample){
		var out = [];
		var cols = Math.ceil(width/sample);
		var rows = Math.ceil(height/sample);

		for (var i=0;i<rows;i++)
		{
			out[i] = [];
			for (var n=0;n<cols;n++)
			{
				var imgData=ctx.getImageData(0+(n*sample),0+(i*sample),sample,sample);
				out[i][n]=$.fn.halftone.getAreaLuminosity(imgData);
			}
		}

		return out;
	};
   /**
	* Create an empty luminosity matrix.
	*
	* @param integer	rows	Number of rows to create in matrix.
	* @param integer	cols	Number of columns to create in matrix.
	*
	* @return Array Empty Matrix of undefined values;
	*/
	$.fn.halftone.spawnMatrix = function (rows,cols){
		var result = [];
		for(var r=0; r < rows; r++) {
			result[r] = [];
			for (var c=0; c < cols; c++){
				result[r][c] = undefined;
			}
			
		}
		return result;
	}
   /**
	* Create a Matrix of luminosity values from ImageData
	*
	* @param ImageData imgData	The image data to sample.
	* @param integer   sample	sample area size.
	*
	* @return Array Matrix of luminosity values.
	*/
	$.fn.halftone.matrixFromimgData = function (imgData,sample){
	
		var cols = Math.ceil(imgData.width/sample);
		var rows = Math.ceil(imgData.height/sample);	
		var arrr = Array.apply(null, Array(cols));
		var hold = arrr.map(function (x, i) { return {r:0,g:0,b:0,a:0} });

		//make the matrix:
		var out = $.fn.halftone.spawnMatrix(rows,cols);
		var potential = (sample * sample) *255;
		var u = 0;
		var t = 0;
		var pr = 0;

		//for each pixel dataset
		
		for(var i=0;i<imgData.data.length;i+=4){
	
			try{
		
			 hold[u].r += imgData.data[i];
			 hold[u].g += imgData.data[i+1];
			 hold[u].b += imgData.data[i+2];
			 hold[u].a += imgData.data[i+3];
			 
			 } catch (e){
				alert(e.message);
			 }
			 
			 
			 //for each unit width
			 if(i != 0 && i % (sample*4) == 0){
				
				
				if((pr+1) % sample == 0){	
				
					out[t][u] = $.fn.halftone.Luminance( hold[u].r/potential, hold[u].g/potential, hold[u].b/potential);
						
				}
				u++;
				
			 }
			 

			//row terminators 
			if (i !=0 && i % (imgData.width*4) == 0 ) {
			
					if((pr+1) % sample == 0){
						hold = arrr.map(function (x, v) { return {r:0,g:0,b:0,a:0} });
						t++;
					}
					pr++;
					u = 0;

			}

		}
	
	//And alone dwell for ever, The kings of the sea."
	return out;
	
	}
   /**
	* Sum the Luminosity of the pixels in an ImageData object
	*
	* @param ImageData imgData
	*
	* @return integer c value;
	*/
	$.fn.halftone.getAreaLuminosity = function (imgData) {
 
		 var potential = imgData.width * imgData.height *255;
		 var r = 0, g = 0, b =0, a = 0;
	 
		 for (var i=0;i<imgData.data.length;i+=4)
		 {
			 r += imgData.data[i];
			 g += imgData.data[i+1];
			 b += imgData.data[i+2];
			 a += imgData.data[i+3];
		 }
	 
		var tcv =  $.fn.halftone.Luminance(r/potential,g/potential,b/potential);
		return tcv;
 
	};
   /**
	* Draw halftone data into context object using luminosity matrix.
	*
	* @param CanvasRenderingContext2D ctx	   Javascript image context object
	* @param integer				  width	   Width of canvas in pixels.
	* @param integer				  height   Height of canvas in pixels.
	* @param integer				  unit	   sample area size.
	* @param integer				  matrix   Matrix of luminosity values.
	*
	* @return CanvasRenderingContext2D Javascript image context object.
	*/
	$.fn.halftone.draw = function (ctx,width,height,unit,matrix){
	
		var radius = unit/2; // Arc radius
		var startAngle = 0; // Starting point on circle
		var endAngle = Math.PI+(Math.PI)/2; // End point on circle
		var i,n;
		
		
		
		//clear the canvas
		ctx.clearRect ( 0 , 0 , width, height );

		for (i = 0; i < matrix.length; ++i) {
			for (n = 0; n < matrix[i].length; ++n) {
				
				var x = 0+(n*unit)+radius;
				var y = 0+(i*unit)+radius;
				ctx.beginPath();
				ctx.arc(x, y, radius*(matrix[i][n]), 0, Math.PI*2,true);
				ctx.fill();
				
			}
		}

	return ctx;
	
	};
	
	//support for jQuery animate()
	
	$.fn.halftone.sethalftoneRes  = function(elem,newunit){
		 var imgData = $(elem).data('srcImageData');
		 var mtx = $.fn.halftone.matrixFromimgData(imgData,newunit); 
		 var ctx=elem[0].getContext("2d", { alpha : false });
		 ctx = $.fn.halftone.draw(ctx,elem.width(),elem.height(),newunit,mtx);
	};
	
	$.fx.step.halftoneRes = function( fx ) {
			$.fn.halftone.sethalftoneRes( fx.elem, fx.now + fx.end );
	};
	
	$.cssNumber.halftoneRes = true;
	
	/*
	
　　　　　　　　　　　　　　　　　　　 ﾍ
　　　　　　　　　　　　　　 ﾍ　　　/　|
　　　　　　　　　　　　　 / ｜　 /　　|
　　　　　　　　　 }YL　 ﾉ　　|　ﾉ 　 　|	   Obligitory
　　　　　　　　　ﾉ　　ヽﾐ}　F′〉　 ｯ┘		   Totoro
　 　 　　　　　　{^^ . -┴┴‐ミ　　ﾐ.._
　 　 　　　　　　> ´　　　　　　　　　　ミ､
　　　　　　　　/　　　　　　　　　　　　　 ﾐ､	  
　　　　　　　 ﾉ　　p￣ヽ_　　　　　　　　　ﾐ､	   
　　　　　rﾍ⌒　　 `ー ′　　　　　　　　　 ﾐ､		
　　　　ﾆ{^　　　　　　　　　　　　　　　　　　 ﾐ､
　　　　 〈､_　　　＝三二_ー--　　　　　　　　 l
　　　　∠_　　　　　ｰ＝= 二_ｰ      You'll be using 
　 　／　　 ¨ヾ､                 the minimised version
　 ﾉﾍ　　　　　　ヽ               in production, right?
	*/ 
	
   /**
	* Update the canvas context using the matrix data 
	*
	* @param integer	 width	Width of canvas in pixels.
	* @param integer	 height Height of canvas in pixels.
	* @param integer	 unit	Sample area size.
	*
	* @return CanvasRenderingContext2D context with halftone content;
	*/
	function draw(width,height,unit,matrix){
	
		var radius = unit/2; // Arc radius
		var startAngle = 0; // Starting point on circle
		var endAngle = Math.PI+(Math.PI)/2; // End point on circle
		var i,n;
		
		
		
		//clear the canvas
		ctx.clearRect ( 0 , 0 , width, height );

		for (i = 0; i < matrix.length; ++i) {
			for (n = 0; n < matrix[i].length; ++n) {
				
				var x = 0+(n*unit)+radius;
				var y = 0+(i*unit)+radius;
				ctx.beginPath();
				ctx.arc(x, y, radius*(matrix[i][n]), 0, Math.PI*2,true);
				ctx.fill();
				
			}
		}

	return ctx;
 
 }
 
}( jQuery )); 