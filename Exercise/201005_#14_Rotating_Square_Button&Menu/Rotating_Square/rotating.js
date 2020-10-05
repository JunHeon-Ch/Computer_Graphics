var gl;
var theta = 0;
var tmp = 0;
var thetaLoc;
var delay = 100;
var direction = true;
var intervalId;

window.onload = function init() {
    var canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    var vertices = [
        vec2(0, 1),
        vec2(-1, 0),
        vec2(1, 0),
        vec2(0, -1)
    ];

    //  Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    //  Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    // Associate vertex data buffer with shader variables
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    thetaLoc = gl.getUniformLocation(program, "theta");

    document.getElementById("Direction").onclick = function () {
        console.log(event.button);
        direction = !direction;
    }

    document.getElementById("Controls").onclick = function (event) {
        switch (event.target.index) {
            case 0:
                direction = !direction;
                break;

            case 1:
                delay /= 2.0;
                clearInterval(intervalId);
                intervalId = setInterval(render, delay);
                break;
            
            case 2:
                delay *= 2.0;
                clearInterval(intervalId);
                intervalId = setInterval(render, delay);
                break;
        }
    }

    window.addEventListener("keydown", c2);

    intervalId = setInterval(render, delay);
};

function render(){
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    theta += (direction ? 0.1 : -0.1);

    gl.uniform1f(thetaLoc, theta);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    // requestAnimationFrame(render);
}

function c2() {
    console.log("first event");
    console.log(event.keyCode);

    switch(event.keyCode) {
        case 49: // '1'
            direction = !direction;
            break;
            
        case 50: // '2'
            delay /= 2.0;
            clearInterval(intervalId);
            intervalId = setInterval(render, delay);
            break;
        
        case 51: // '3'
            delay *= 2.0;
            clearInterval(intervalId);
            intervalId = setInterval(render, delay);
            break;
    }
}