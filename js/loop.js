/*
simple loop fbf functionality.
By Kleber Garcia, (c) 2011
*/


function GameLoop(fps,fnOnFrame) {      
   this.mMillisecPerFrame = Math.floor(1000/fps);
   this.OnFrame = fnOnFrame;
}

GameLoop.prototype = {
   Start : function() {
      var startTime = new Date().getTime();
      this.OnFrame();
      var endTime = new Date().getTime();
      var delta = endTime - startTime;      
      var __self = this;
      function __continue()
      {
         __self.Start();
      };
      if (delta >= this.mMillisecPerFrame) {
         setTimeout(__continue,0);
      } else {
         setTimeout(__continue,this.mMillisecPerFrame - delta);
      }
   }
}
