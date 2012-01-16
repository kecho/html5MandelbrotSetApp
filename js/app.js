function MandelbrotApp(canvas)
{
   var __self = this;
   this._canvas = canvas;
   this._context = canvas.getContext("2d");
   this._camera = new MandelbrotCamera(canvas.width,canvas.height, 0.8);
   this._mandelbrotSet = new MandelbrotSet(canvas, this._camera);
   this._mandelbrotSet.Compute(); 
   this._reticule = new Reticule(canvas.width, canvas.height, "#FFFFFF", "#CCCCCC", {x:20, y:20}, 1);
   this._canvas.onmouseup = function(e){__self.OnClick(e)};
   this._state = MandelbrotApp.States.STATIC;
   this._zoomCoolDown = 30;//30 keyframes for zoom
   this._zoomCoolDownCount = 0;
   this._zoomCenter =
      {
        x: 0.3794094437404727,
        y: -0.13010065823885747
      };
   this.StopCamera();
}

MandelbrotApp.States = {
   STATIC : 0,
   ZOOMING : 1,
   ZOOMING_STATIC : 2,
   FOCUS : 3
};


MandelbrotApp.prototype = {

   Update : function ()
   {
      switch (this._state)
      {
      case MandelbrotApp.States.STATIC:
         this.ProcessStatic();
         break;
      case MandelbrotApp.States.ZOOMING:
         this.ProcessZooming();
         break;
      case MandelbrotApp.States.ZOOMING_STATIC:
         this.ProcessZoomingStatic();
         break;
      case MandelbrotApp.States.FOCUS:
         this.ProcessFocus();
         break;
      }
      this._mandelbrotSet.Render();      
      this._reticule.Render(this._context);
   }, 
   
   ProcessStatic : function ()
   {
   },
   
   ProcessZooming : function ()
   {
      this._camera.ZoomIn(this._zoomCenter);
      this._mandelbrotSet.Compute();
      this._state = MandelbrotApp.States.ZOOMING_STATIC;
   },
   
   ProcessZoomingStatic : function ()
   {
      ++this._zoomCoolDownCount;
      if (this._zoomCoolDownCount > this._zoomCoolDown)
      {
         this._zoomCoolDownCount = 0;
         this._state = MandelbrotApp.States.ZOOMING;
      } 
   },
   
   ProcessFocus : function ()
   {
      this._mandelbrotSet.Compute();
      this.StopCamera();
   },
   
   OnClick : function (e)
   {
      this._reticule.SetSpot({x:toCanvasX(this._canvas,e), y:toCanvasY(this._canvas,e)});  
      this._zoomCenter = this._camera.TranslateToMandelbrotCoords(this._reticule.GetSpot());
   },
   
   StartZoom : function ()
   {
      this._state = MandelbrotApp.States.ZOOMING;
      this._reticule.SetVisible(false);
   },
   
   StopCamera : function ()
   {
      this._state = MandelbrotApp.States.STATIC;
      this._reticule.SetSpot(this._camera.TranslatePixelCoords(this._zoomCenter));
      this._zoomCoolDownCount = 0; 
      this._reticule.SetVisible(true);
   },
   
   ResetCamera : function ()
   {
      this._camera.Reset();      
      this._state = MandelbrotApp.States.FOCUS;
   },
   
   Pause : function ()
   {
      this._state = MandelbrotApp.States.STATIC;
      this._zoomCoolDownCount = 0;
   }

}

function Reticule(width, height, color1, color2, spot, blinkFrequency)
{
   this._width = width;
   this._height = height;
   this._color1 = color1;
   this._color2 = color2;
   this._blinkFrequency = blinkFrequency;
   this._currFrame = 0;
   this._shouldBlink = true;
   this._isVisible = true;
   this.SetSpot(spot);
}


Reticule.prototype = {
   SetVisible : function (val) {
      this._isVisible = val;
   },

   SetSpot : function (point)
   {
      this._point = point;
   },
   GetSpot : function () {return this._point;},
   Render : function (context)
   {
      if (!this._isVisible) return;
      ++this._currFrame;
      if (this._currFrame > this._blinkFrequency)
      {
         this._shouldBlink = !this._shouldBlink;
         this._currFrame = 0;
      }
      this.DrawReticule(context);
   },
   DrawReticule : function (context)
   {
      context.strokeStyle = this._shouldBlink ? this._color2 : this._color1;
      context.beginPath();
      context.moveTo(this._point.x, 0);
      context.lineTo(this._point.x,this._height);
      context.closePath();
      context.stroke();
      context.beginPath();
      context.moveTo(0, this._point.y); 
      context.lineTo(this._width, this._point.y); 
      context.closePath();
      context.stroke();
   },
}

function toCanvasX(c, e) {
   return e.offsetX;
}
 
function toCanvasY(c, e) {
   return e.offsetY;
}
