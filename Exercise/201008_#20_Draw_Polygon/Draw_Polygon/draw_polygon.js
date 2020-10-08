var gl;

var maxNumVertices = 200;
var index = 0;
var cIndex = 0;

var colors = [
    vec4(0, 0, 0, 1),
    vec4(1, 0, 0, 1),
    vec4(1, 1, 0, 1),
    vec4(0, 1, 0, 1),
    vec4(0, 0, 1, 1),
    vec4(1, 0, 1, 1),
    vec4(0, 1, 1, 1)
]

var t;
var numPolygons = 0;
var numIndices = [];
numIndices[0] = 0;
var start = [0];

window.onload = function init() {
    var canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    var m = document.getElementById("mymenu");
    m.addEventListener("click", function() {
        cIndex = m.selectedIndex;
    });

    var a = document.getElementById("Button");
    a.addEventListener("click", function() {
        numPolygons++;
        numIndices[numPolygons] = 0;
        start[numPolygons] = index;
        render();
    });

    canvas.addEventListener("mousedown", function(event) {
        t = vec2(2 * event.clientX / canvas.width - 1, 2 * (canvas.height - event.clientY) / canvas.height - 1);
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 8 * index, flatten(t));

        t = vec4(colors[cIndex]);

        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 16 * index, flatten(t));

        numIndices[numPolygons]++;
        index++;
    });

    //  Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.8, 0.8, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    //  Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Load the data into the GPU
    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 8 * maxNumVertices, gl.STATIC_DRAW);

    // Associate vertex data buffer with shader variables
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    // Load the data into the GPU
    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 16 * maxNumVertices, gl.STATIC_DRAW);

    // Associate vertex data buffer with shader variables
    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);
};

function render(){
    gl.clear(gl.COLOR_BUFFER_BIT);

    for(var i = 0; i < numPolygons; i++) {
        gl.drawArrays(gl.TRIANGLE_FAN, start[i], numIndices[i]);
    }
}