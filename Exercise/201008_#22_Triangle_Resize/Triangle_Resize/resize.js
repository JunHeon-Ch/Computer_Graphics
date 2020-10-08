var gl;

var maxNumTriangles = 200;
var maxNumVertices = 3 * maxNumTriangles;
var index = 0;

var redraw = false;

window.onload = function init() {
    var canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    var colors = [
        vec4(0, 0, 0, 1),
        vec4(1, 0, 0, 1),
        vec4(1, 1, 0, 1),
        vec4(0, 1, 0, 1),
        vec4(0, 1, 1, 1),
        vec4(0, 0, 1, 1),
        vec4(1, 0, 1, 1)
    ]

    canvas.addEventListener("click", function(event) {
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        var t = vec2(2 * event.clientX / canvas.width - 1, 2 * (canvas.height - event.clientY) / canvas.height - 1);
        gl.bufferSubData(gl.ARRAY_BUFFER, 8 * index, flatten(t));

        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        t = vec4(colors[index % 7]);
        gl.bufferSubData(gl.ARRAY_BUFFER, 16 * index, flatten(t));

        index++;
    });

    //  Configure WebGL
    window.onresize = function() {
        var min = innerWidth;
        if (innerHeight < min) {
            min = innerHeight;
        }
        if (min < canvas.width || min < canvas.height) {
            gl.viewport(0, canvas.height-min, min, min);
        }
    }
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.8, 0.8, 0.8, 1.0);

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

    render();
};

function render(){
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, index);

    window.requestAnimFrame(render);
}