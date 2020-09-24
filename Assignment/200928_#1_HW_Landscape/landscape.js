var gl;

window.onload = function init() {
    var canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    //  Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 160/255, 20/255, 1.0);

    //  Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Position
    var vPosition = gl.getAttribLocation(program, "vPosition");
    // Offset
    var vOffset = gl.getUniformLocation(program, "vOffset")
    // Color
    var vColor = gl.getAttribLocation(program, "vColor");
	 
    // Clear buffer bit
    gl.clear(gl.COLOR_BUFFER_BIT);

    drawBackground(vPosition, vColor);
    
    drawMoon(vPosition, vColor);

    drawTree(vPosition, vOffset, vColor, [-0.75, -0.3, 0, 0], 0.6);
    drawTree(vPosition, vOffset, vColor, [0.75, -0.5, 0, 0], 0.8);
    drawTree(vPosition, vOffset, vColor, [-0.5, 0, 0, 0], 0.5);

    drawHouse(vPosition, vOffset, vColor);
};

function drawBackground(vPosition, vColor) {
  // Sunset position vertices
  var sunset = new Float32Array([
    -1, -0.2, 1, -0.2, 1, 1, // triangle
    -1, -0.2, 1, 1, -1, 1 // triangle
  ]);
  // Sunset color vertices
  var colors = new Float32Array([
    1, 220/255, 0, 1,
    1, 220/255, 0, 1,
    1, 0, 0, 1,
    1, 220/255, 0, 1,
    1, 0, 0, 1,
    1, 0, 0, 1
  ]);

  // Load the sunset position data into the GPU
  var backgroundBufferId = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, backgroundBufferId);
  gl.bufferData(gl.ARRAY_BUFFER, sunset, gl.STATIC_DRAW);

  // Load the sunset color data into the GPU
  var colorBufferId = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBufferId);
  gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

  // Associate sunset position vertex data buffer with shader variables
  gl.bindBuffer(gl.ARRAY_BUFFER, backgroundBufferId);
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  // Associate sunset color vertex data buffer with shader variables
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBufferId);
  gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vColor);

  // Draw sunset
  render(0, 6); 
}

function drawTree(vPosition, vOffset, vColor, offsetValue, scale) {
    // Move by offset value
    gl.uniform4fv(vOffset, offsetValue);

    // Tree leaf vertices
    var leaf = new Float32Array([
      0, 0.5, -0.25, 0.25, 0.25, 0.25, // triangle
      0, 0.25, -0.25, 0, 0.25, 0,      // triangle
      0, 0, -0.25, -0.25, 0.25, -0.25  // triangle
    ]);
    // Change the tree scale
    for (i=0; i<18; i++) {
      leaf[i] *= scale
    }

    // Load the tree leaf position data into the GPU
    var leafBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, leafBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, leaf, gl.STATIC_DRAW);

    // Associate tree leaf vertex data buffer with shader variables
    gl.bindBuffer(gl.ARRAY_BUFFER, leafBufferId);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    // Associate tree leaf color vertex data buffer with shader variables
    gl.disableVertexAttribArray(vColor);
    gl.vertexAttrib4f(vColor, 50/255, 90/255, 0, 1);

    // Draw tree leaf
    render(0, 9); 

    // Tree body vertices
    var body = new Float32Array([
      -0.075, -0.25, -0.075, -0.5, 0.075, -0.25, // triangle
      0.075, -0.25, -0.075, -0.5, 0.075, -0.5    // triangle
    ]);
    // Change the tree scale
    for (i=0; i<12; i++) {
      body[i] *= scale
    }

    // Load the tree body position data into the GPU
    var bodyBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bodyBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, body, gl.STATIC_DRAW);

    // Associate tree body vertex data buffer with shader variables
    gl.bindBuffer(gl.ARRAY_BUFFER, bodyBufferId);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    // Associate tree body color vertex data buffer with shader variables
    gl.disableVertexAttribArray(vColor);
    gl.vertexAttrib4f(vColor, 0.5, 0.25, 0, 1);

    // Draw tree body
    render(0, 6);
}

function drawHouse(vPosition, vOffset, vColor) {
      // Move by offset value
      gl.uniform4fv(vOffset, [0, 0, 0, 0]);

      // Roof vertices
      var roof = new Float32Array([
        -0.25, 0.15, -0.5, -0.15, -0.25, -0.15, // triangle
        -0.25, 0.15, -0.25, -0.15, 0.25, 0.15, // triangle
        0.25, 0.15, -0.25, -0.15, 0.25, -0.15, // triangle
        0.25, 0.15, 0.25, -0.15, 0.5, -0.15  // triangle
      ]);
      
      // Load the roof position data into the GPU
      var roofBufferId = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, roofBufferId);
      gl.bufferData(gl.ARRAY_BUFFER, roof, gl.STATIC_DRAW);

      // Associate roof vertex data buffer with shader variables
      gl.bindBuffer(gl.ARRAY_BUFFER, roofBufferId);
      gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(vPosition);

      // Associate roof color vertex data buffer with shader variables
      gl.disableVertexAttribArray(vColor);
      gl.vertexAttrib4f(vColor, 0, 140/255, 1, 1);

      // Draw house roof
      render(0, 12); 

      // House body vertices
      var body = new Float32Array([
        -0.375, -0.15, -0.375, -0.75, 0.375, -0.15, // triangle
        0.375, -0.15, -0.375, -0.75, 0.375, -0.75 // triangle
      ]);
  
      // Load the house body position data into the GPU
      var roofBufferId = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, roofBufferId);
      gl.bufferData(gl.ARRAY_BUFFER, body, gl.STATIC_DRAW);

      // Associate house body vertex data buffer with shader variables
      gl.bindBuffer(gl.ARRAY_BUFFER, roofBufferId);
      gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(vPosition);

      // Associate house body color vertex data buffer with shader variables
      gl.disableVertexAttribArray(vColor);
      gl.vertexAttrib4f(vColor, 1, 1, 1, 1);

      // Draw house body
      render(0, 6); 

      // Door vertices
      var door = new Float32Array([
        0.25, -0.45, 0, -0.45, 0, -0.75, // triangle
        0.25, -0.45, 0, -0.75, 0.25, -0.75 // triangle
      ]);
  
      // Load the door position data into the GPU
      var roofBufferId = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, roofBufferId);
      gl.bufferData(gl.ARRAY_BUFFER, door, gl.STATIC_DRAW);

      // Associate door vertex data buffer with shader variables
      gl.bindBuffer(gl.ARRAY_BUFFER, roofBufferId);
      gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(vPosition);

      // Associate door color vertex data buffer with shader variables
      gl.disableVertexAttribArray(vColor);
      gl.vertexAttrib4f(vColor, 0, 140/255, 1, 1);

      // Draw door
      render(0, 6); 
}

function drawMoon(vPosition, vColor) {
  // Moon vertices
  var moon = [
    vec2(0.5, 0.6),
    vec2(0.7, 0.6),
    vec2(0.6, 0.8),
    vec2(0.4, 0.8),
    vec2(0.3, 0.6),
    vec2(0.4, 0.4),
    vec2(0.6, 0.4),
    vec2(0.7, 0.6)
  ];
  
  // Load the moon position data into the GPU
  var moonBufferId = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, moonBufferId);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(moon), gl.STATIC_DRAW);

  // Associate moon vertex data buffer with shader variables
  gl.bindBuffer(gl.ARRAY_BUFFER, moonBufferId);
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  // Associate moon color vertex data buffer with shader variables
  gl.disableVertexAttribArray(vColor);
  gl.vertexAttrib4f(vColor, 1, 1, 0, 1);

  // Draw moon
  gl.drawArrays(gl.TRIANGLE_FAN, 0, 8);
}

// render function
function render(first, count) {
    gl.drawArrays(gl.TRIANGLES, first, count);
}
