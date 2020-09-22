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

    // Create buffer on GPU and bind points
    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);

    // Associate vertex data buffer with shader variables
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var uColor = gl.getUniformLocation(program, "uColor");

    gl.clear(gl.COLOR_BUFFER_BIT);

    // Leaf
    var leaf = new Float32Array([
      0, 1, -0.5, 0.5, 0.5, 0.5,
      0, 0.5, -0.5, 0, 0.5, 0,
      0, 0, -0.5, -0.5, 0.5, -0.5
    ]);

    gl.bufferData(gl.ARRAY_BUFFER, leaf, gl.STATIC_DRAW);

    // Color
    gl.uniform4fv(uColor, [0, 1, 0, 1]);
    render(0, 9);

    // Body
    var body = new Float32Array([
      -0.15, -0.5, -0.15, -1, 0.15, -0.5,
      0.15, -0.5, -0.15, -1, 0.15, -1
    ]);

    gl.bufferData(gl.ARRAY_BUFFER, body, gl.STATIC_DRAW);

    // Color
    gl.uniform4fv(uColor, [0.5, 0.25, 0, 1]);
    render(0, 6);
};

function render(first, count) {
    gl.drawArrays(gl.TRIANGLES, first, count);
}
