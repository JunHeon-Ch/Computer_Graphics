
var canvas;
var gl;

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = 0;

var theta = [0, 0, 0];
var thetaLoc;

var flag = false;

var points = [];
var colors = [];

window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    // Create cube object
    var myCube = cube(0.5);
    
    // Rotate and translate
    myCube.rotate(45, [1, 1, 1]);
    myCube.translate(0.5, 0.5, 0);
    
    // Color and vertex coordinate of cube object
    colors = myCube.TriangleVertexColors;
    points = myCube.TriangleVertices;

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    // Create a color buffer and connect it with the attribute qualifier of the shader.
    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    // Create a vertex buffer and connect it with the attribute qualifier of the shader.
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    // Uniform variable for matrix computation
	thetaLoc = gl.getUniformLocation(program, "theta");
    
    // Event listeners for buttons
    document.getElementById("xButton").onclick = function () {
        axis = xAxis;
    };
    document.getElementById("yButton").onclick = function () {
        axis = yAxis;
    };
    document.getElementById("zButton").onclick = function () {
        axis = zAxis;
    };
    document.getElementById("ButtonT").onclick = function () {
        flag = !flag;
    }
        
    render();
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Send theta to shader
    if(flag) {
        theta[axis] += 2.0;
    }
    gl.uniform3fv(thetaLoc, theta);

    // Draw cube
    gl.drawArrays(gl.TRIANGLES, 0, points.length);
    requestAnimationFrame(render);
}

