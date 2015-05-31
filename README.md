HALFTONE JS

I used to do a lot of Halftone stuff in AS3, Canvas elements make *most* of that possible in Javascript now.
This jQuery Plugin is intended to make making halftones simple.

RUNNING THE BUILD

navigate into the project root folder and install the npm dependencies:

  <pre>npm install</pre>

You can then run the build using grunt:

  <pre>grunt</pre>

Use the resulting build/jquery.halftone.min.js file in your jQuery projects whereever you wanted to display a halftone but were too afraid to ask!

Example:

HTML:

  <pre><canvas id="canvas-test" width="200" height"300" >
 Unsupported HTML5 canvas tag.
</canvas></pre>


Javascript:

  <pre>//write a gradient into the canvas so we have some image data to process...
var c=document.getElementById("canvas-test");
var ctx=c.getContext("2d");
var grad=ctx.createLinearGradient(0,0,170,0);
grad.addColorStop(0,"#000");
grad.addColorStop(1,"#fff");
ctx.fillStyle=grad;
ctx.fillRect(0,0,300,200);

//Do the halftone

$('#canvas-test').halftone({
                     'sample' : 7,
                     'background' : '#000000'
                });</pre>
