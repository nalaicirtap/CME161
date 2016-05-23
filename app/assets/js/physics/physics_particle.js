var MyParticle = function(width_in, height_in) {
    
    this.type = "particle_simple";

    this.radius = Math.random() * 40;

    this.x_max = width_in - (this.radius / 2);
    this.y_max = height_in - (this.radius / 2);
    this.z_max = width_in - (this.radius / 2);

    this.x = -1*this.x_max + Math.random() * this.x_max;
	this.y = -1*this.y_max + Math.random() * this.y_max;
	this.z = -1*this.z_max + Math.random() * this.z_max;

	this.x_v = Math.random() * 20;
	this.y_v = Math.random() * 20;
	this.z_v = Math.random() * 20;


	this.gravity = .5;
	this.drag = .995;

	this.update = function () {
	    // lazy Euler integration

	    // y direction
	    if ((Math.abs(this.y_v) > 0)) {
	    	this.y_v *= this.drag;
        	this.y_v -= this.gravity;
	        this.y += this.y_v;
	        this.constrain_y();
	    }

	    // x direction
	    if ((Math.abs(this.x_v) > 0)) {
	    	this.x_v *= this.drag;
	        this.x += this.x_v;
	        this.constrain_x();
	    }
	    
	    // z direction
	    if ((Math.abs(this.z_v) > 0)) {
	    	this.z_v *= this.drag;
	        this.z += this.z_v;
	        this.constrain_z();
	    }
	    
	}

	this.constrain_y = function () {
	    // y
	    if (this.y >= this.y_max) {
	        this.y = this.y_max;
	        this.y_v *= -1;
	    }

	    if (this.y <= -this.y_max) {
	        this.y = -this.y_max;
	        this.y_v *= -1;
	    }
	}

	this.constrain_z = function () {
	    // y
	    if (this.z >= this.z_max) {
	        this.z = this.z_max;
	        this.z_v *= -1;
	    }

	    if (this.z <= -this.z_max) {
	        this.z = -this.z_max;
	        this.z_v *= -1;
	    }
	}

	this.constrain_x = function () {
	    // y
	    if (this.x >= this.x_max) {
	        this.x = this.x_max;
	        this.x_v *= -1;
	    }

	    if (this.x <= -this.x_max) {
	        this.x = -this.x_max;
	        this.x_v *= -1;
	    }
	}

	this.boost = function() {
        var y_sign = this.y_v > 0 ? 1 : -1;
        var x_sign = this.x_v > 0 ? 1 : -1;
        var z_sign = this.z_v > 0 ? 1 : -1;
        var ky = Math.random() * 10;
        var kx = Math.random() * 10;
        var kz = Math.random() * 10;
        
        this.y_v += ky * y_sign;
        this.y -= this.y_v;
        this.x_v += kx * x_sign;
        this.x += this.x_v;
        this.z_v += kz * z_sign;
        this.z += this.z_v;
    }

}
