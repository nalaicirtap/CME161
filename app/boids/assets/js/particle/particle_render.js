// create a simple visualization
function particle_render($p) {

    // canvas size
    // $p.size(window.innerWidth, window.innerHeight, $p.WEBGL);    //z

    $p.size(500, 500, $p.WEBGL);
    
    // ---------------------------------------------------------
    // particles
    
    // add particles
    var n = 500; //Math.sqrt($p.width*$p.height);
    
    data = [];
    boids = [];
    for (var i = 0; i < n; i++){
        var p = new Particle($p.width, $p.height);
        data.push(p);

        boids[i] = new Boid();
    }
    
    
    
    // draw method
    Particle.prototype.draw = function()
    {
        $p.fill(this.hue, 90, 90, 270);

        // 2D shape
        // $p.translate(0, 0, this.z);
        // $p.ellipse(this.x + 3, this.y - 3, this.radius, this.radius);
        // $p.translate(0, 0, -this.z);
        
        // 3D shape
        $p.translate(this.x, this.y, this.z);
        $p.rotate(this.rx, this.ry, this.rz);
        $p.box(this.radius);
        $p.rotate(-this.rx, -this.ry, -this.rz);
        $p.translate(-this.x, -this.y, -this.z);
    }

     
    
    // ---------------------------------------------------------
    // setup
    
    // graphical parameters
    $p.noStroke();
    $p.colorMode($p.HSB, 360, 100, 100);
    $p.ellipseMode($p.CENTER);
    $p.background(0,0,0); // dark

    // ---------------------------------------------------------
    // draw
    
    var world_rotate = 0;
    $p.draw = function () {
        
        // opaque bg
        $p.background(0,0,0); // dark
        
        // center
        $p.translate($p.width / 2, $p.height / 2 + 50, -2*$p.width);
        
        // rotate
        $p.rotateX(-0.5); // tilt forward
        $p.rotateY(world_rotate); // rotate
        world_rotate += .015
        
        // lights (draw after translating world)
        $p.directionalLight(360, 0, 100, 1, 0, 0);
        $p.directionalLight(360, 0, 40, 0, 1, 0);
        $p.directionalLight(360, 0, 70, 0, 0, 1);
        $p.directionalLight(360, 0, 60, -1, 0, 0);
        
        // draw axis
        //draw_axis();
        
        for (var i = 0; i < data.length; i++) {
            // data[i].draw();
            // data[i].update();

            boid = boids[ i ];
            boid.run( boids );

            
            data[i].x = boids[ i ].position.x;
            data[i].y = boids[ i ].position.y;
            data[i].z = boids[ i ].position.z;
            data[i].draw();

            // bird = birds[ i ];
            // bird.position.copy( boids[ i ].position );
        }
    }
    
    // ---------------------------------------------------------
    // interaction
    
    $p.mouseClicked = function () {
        for (var i = 0; i < data.length; i++) {
            data[i].boost();
        }
    }
}

// create a canvas
var canvas = document.getElementById("processing");
ctx = canvas.getContext('webgl', { antialias: true});

// bind basic_bar_chart to canvas
var processing_sim = new Processing(canvas, particle_render);