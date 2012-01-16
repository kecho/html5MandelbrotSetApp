/*
Mandelbrot set implementation. 
A la object oriented because I am a beast.
Kleber Garcia (c) 2012
*/

function MandelbrotCamera(width, height, zoomFactor)
{
   this.Reset();
   this._width = width;
   this._height = height;
   this._zoomFactor = zoomFactor;
}

MandelbrotCamera.prototype = {
   Reset : function ()
   {
      this.minx = -2;
      this.maxx = 1;
      this.miny = -1;
      this.maxy = 1;
   },
   
   ZoomIn : function (centerPoint)
   {
     var xLength = this.maxx - this.minx;
     var yLength = this.maxy - this.miny;
     var newXLength = xLength * (this._zoomFactor);
     var newYLength = yLength * (this._zoomFactor);
     this.minx = centerPoint.x - (newXLength/2);
     this.maxx = centerPoint.x + (newXLength/2);
     this.miny = centerPoint.y - (newYLength/2);
     this.maxy = centerPoint.y + (newYLength/2);
   },

   ScaleX : function (v)
   {
      return (v / this._width) * (this.maxx - this.minx) + this.minx; 
   },

   ScaleY : function (v)
   {
      return (1 - (v / this._height)) * (this.maxy - this.miny) + this.miny;
   },
   
   TranslateToMandelbrotCoords : function (point)
   {
      return { x: this.ScaleX(point.x), y: this.ScaleY(point.y) };
   },

   TranslatePixelCoords : function (point)
   {
      return {
          x: ((point.x - this.minx) / (this.maxx - this.minx))*this._width,
          y: (1 - ((point.y - this.miny) / (this.maxy - this.miny)))*this._height,
      };
   }   
}



function MandelbrotSet (canvas, camera)
{
   this._camera = camera;
   this._canvas = canvas;
   this._width = this._camera._width;
   this._height = this._camera._height;
   this._context = canvas.getContext("2d");
   this._img = this._context.createImageData(this._width, this._height); 
}

MandelbrotSet.prototype = {

   Compute : function ()
   {
      for (var row = 0; row < this._height; ++row)
      {
         for (var col = 0; col < this._width; ++col)
         {
            var x = this._camera.ScaleX( col );
            var y = this._camera.ScaleY( row );
            var it = this.EscapePxl(x,y,1000);
            this.PaintPixel(row, col, this.GenerateColor(it));
          }
      }
   },

   GenerateColor : function (it)
   {
      //return {r:Math.cos(it)*256, g:(Math.sin(it)*256), b:(it)%256, a:255};
      return {
          b:Math.sin((it/1000)*(Math.PI*2)) * 256,
          g:-Math.cos((it/1000)*(Math.PI*8)) * 256,//it % 256, 
          r:Math.sin((it/1000)*(Math.PI*2)) * 256,
          a: 255
     };
      //return {r:(it)*256, g:(it)%256, b:(it)%256, a:255};
 
   },

   EscapePxl : function (x0, y0, maxIt)
   {
      var x = 0;
      var y = 0;
      var it = 0;
      while ((x*x + y*y < 4) && (it < maxIt))
      {
         var tmpX = x*x - y*y + x0;
         y = 2*x*y + y0;
         x = tmpX;
         ++it;
      }
      return (x*x + y*y < 4) ? 0 : it;
   },

   PaintPixel : function (row, column, color)
   {
      var indx = (row * this._width + column)*4;
      this._img.data[indx] = color.r;
      this._img.data[indx + 1] = color.g;
      this._img.data[indx + 2] = color.b;
      this._img.data[indx + 3] = color.a;
   },

   Render : function ()
   {
      this._context.putImageData(this._img, 0, 0);
   }
}
/*
function main()
{ 
 var s = new MandelbrotSet(
   document.getElementById("mainCanvas"),
   { minx: -2, maxx: 1, miny: -1, maxy: 1}
 );
 s.Compute();
 s.Render();
}
*/
