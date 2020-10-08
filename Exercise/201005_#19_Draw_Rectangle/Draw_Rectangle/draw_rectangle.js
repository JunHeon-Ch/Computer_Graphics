var gl;

var maxNumTriangles = 200;
var maxNumVertices = 3 * maxNumTriangles;
var index = 0;
var first = true;
var t1, t2, t3, t4;
var cIndex = 0;

window.onload = function init() {
    var canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    //  Configure WebGL
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

    var colors = [
        vec4(0, 0, 0, 1),
        vec4(1, 0, 0, 1),
        vec4(1, 1, 0, 1),
        vec4(0, 1, 0, 1),
        vec4(0, 0, 1, 1),
        vec4(1, 0, 1, 1),
        vec4(0, 1, 1, 1)
    ]

    var m = document.getElementById("mymenu");

    m.addEventListener("click", function () {
        cIndex = m.selectedIndex;
    });

    canvas.addEventListener("mousedown", function(event) {
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

        if(first) {
            first = false;
            t1 = vec2(2 * event.clientX / canvas.width - 1, 2 * (canvas.height - event.clientY) / canvas.height - 1);
        }
        else {
            first = true;
            t2 = vec2(2 * event.clientX / canvas.width - 1, 2 * (canvas.height - event.clientY) / canvas.height - 1);
            t3 = vec2(t1[0], t2[1]);
            t4 = vec2(t2[0], t1[1]);
            
            gl.bufferSubData(gl.ARRAY_BUFFER, 8 * index, flatten(t3));
            gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (index + 1), flatten(t2));
            gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (index + 2), flatten(t4));
            gl.bufferSubData(gl.ARRAY_BUFFER, 8 * (index + 3), flatten(t1));

            gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
            var t = vec4(colors[cIndex]);
            gl.bufferSubData(gl.ARRAY_BUFFER, 16 * index, flatten(t));
            gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (index + 1), flatten(t));
            gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (index + 2), flatten(t));
            gl.bufferSubData(gl.ARRAY_BUFFER, 16 * (index + 3), flatten(t));
       
            index += 4;
        }
    });

    render();
};

function render(){
    gl.clear(gl.COLOR_BUFFER_BIT);

    for(var i = 0; i < index; i += 4) {
        gl.drawArrays(gl.TRIANGLE_FAN, i, 4);
    }

    window.requestAnimFrame(render);
}