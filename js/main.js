var loop = null;
var app = null;

function onFrame()
{
   app.Update();
}

function start()
{
   app.StartZoom();
}

function stop()
{
   app.StopCamera();
}

function reset()
{
   app.ResetCamera();
} 

function main()
{
   app = new MandelbrotApp(document.getElementById("mainCanvas"));
   loop = new GameLoop(60/*fps*/, onFrame);
   loop.Start();
}
