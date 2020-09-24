var gl;

window.onload = function init() {
    var canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    //  Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    //  Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Associate vertex data buffer with shader variables
    var vPosition = gl.getAttribLocation(program, "vPosition");
    var vColor = gl.getAttribLocation(program, "vColor");
    
    gl.clear(gl.COLOR_BUFFER_BIT);

    drawHaxgon(vPosition, vColor);
    drawTriangle(vPosition, vColor);
    drawStrip(vPosition, vColor);
};

function drawHaxgon(vPosition, vColor){
    // hexagon vertices
    var hexagonVertices = [
        vec2(-0.3, 0.6),
        vec2(-0.4, 0.8),
        vec2(-0.6, 0.8),
        vec2(-0.7, 0.6),
        vec2(-0.6, 0.4),
        vec2(-0.4, 0.4),
        vec2(-0.3, 0.6)
    ];

    // Load the position data into the GPU
    var haxagonBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, haxagonBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(hexagonVertices), gl.STATIC_DRAW);

    // vertex
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    // color
    gl.disableVertexAttribArray(vColor);
    gl.vertexAttrib4f(vColor, 0, 0, 0, 1);

    gl.drawArrays(gl.LINE_STRIP, 0, 7);
}

function drawTriangle(vPosition, vColor){
    // triangle vertices
    var triangleVertices = [
        vec2(0.3, 0.4),
        vec2(0.7, 0.4),
        vec2(0.5, 0.8)
    ];
    // triangle colors
    var colors = [
        vec4(1, 0, 0, 1),
        vec4(0, 1, 0, 1),
        vec4(0, 0, 1, 1)
    ];
    // Load the position data into the GPU
    var triangleBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(triangleVertices), gl.STATIC_DRAW);

    // Load the position data into the GPU
    var colorBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    // vertex
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleBufferId);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    // color
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBufferId);
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

function drawStrip(vPosition, vColor){
    // strip vertices
    var stripVertices = [
        vec2(-0.5, 0.2),
        vec2(-0.4, 0),
        vec2(-0.3, 0.2),
        vec2(-0.2, 0),
        vec2(-0.1, 0.2),
        vec2(0, 0),
        vec2(0.1, 0.2),
        vec2(0.2, 0),
        vec2(0.3, 0.2),
        vec2(0.4, 0),
        vec2(0.5, 0.2),
        // second strp
        vec2(-0.5, -0.3),
        vec2(-0.4, -0.5),
        vec2(-0.3, -0.3),
        vec2(-0.2, -0.5),
        vec2(-0.1, -0.3),
        vec2(0, -0.5),
        vec2(0.1, -0.3),
        vec2(0.2, -0.5),
        vec2(0.3, -0.3),
        vec2(0.4, -0.5),
        vec2(0.5, -0.3)
    ];

    // Load the position data into the GPU
    var stripBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, stripBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(stripVertices), gl.STATIC_DRAW);

    // vertex
    gl.bindBuffer(gl.ARRAY_BUFFER, stripBufferId);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    // color
    gl.disableVertexAttribArray(vColor);
    gl.vertexAttrib4f(vColor, 1, 1, 0, 1);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 11);

    // line
    gl.vertexAttrib4f(vColor, 0, 0, 0, 1);

    gl.drawArrays(gl.LINE_STRIP, 0, 11);
    gl.drawArrays(gl.LINE_STRIP, 11, 11);
}