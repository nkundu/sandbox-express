function Kalman() {

	this.processNoise = 0;

	// Time step
	this.mt = 0;
	this.mt2 = 0;
	this.mt2d2 = 0;
	this.mt3d2 = 0;
	this.mt4d4 = 0;

	// Process noise covariance
	this.mQa = 0;
	this.mQb = 0;
	this.mQc = 0;
	this.mQd = 0;

	// Estimated state
	this.mXa = 0;
	this.mXb = 0;

	// Estimated covariance
	this.mPa = 0;
	this.mPb = 0;
	this.mPc = 0;
	this.mPd = 0;


	// Update the process noise covariance matrix and state transform matrix for the new time step.
	this.setTimeStep = function (timeStepSec) {
		// Lookup time step
		this.mt = timeStepSec;
		this.mt2 = this.mt * this.mt;
		this.mt2d2 = this.mt2 / 2.0;
		this.mt3d2 = this.mt2 * this.mt / 2.0;
		this.mt4d4 = this.mt2 * this.mt2 / 4.0;

		// Process noise covariance
		var n2 = this.processNoise * this.processNoise;
		this.mQa = n2 * this.mt4d4;
		this.mQb = n2 * this.mt3d2;
		this.mQc = this.mQb;
		this.mQd = n2 * this.mt2;
	}

	this.initialize = function (timeStepSec, processNoise) {
		this.processNoise = processNoise;

		this.setTimeStep(timeStepSec);

		// Estimated covariance
		this.mPa = this.mQa;
		this.mPb = this.mQb;
		this.mPc = this.mQc;
		this.mPd = this.mQd;
	};

	// Reset the filter to the given state.
	// Should be called after creation, unless position and velocity are assumed to be both zero.
	this.setState = function (position, velocity, noise) {

		// State vector
		this.mXa = position;
		this.mXb = velocity;

		// Covariance
		var n2 = noise * noise;
		this.mPa = n2 * this.mt4d4;
		this.mPb = n2 * this.mt3d2;
		this.mPc = this.mPb;
		this.mPd = n2 * this.mt2;
	};


	// Update (correct) with the given measurement.
	this.updatePos = function (position, noise) {

		var r = noise * noise;

		//  y   =  z   -   H  . x
		var y = position - this.mXa;

		// S = H.P.H' + R
		var s = this.mPa + r;
		var si = 1.0 / s;

		// K = P.H'.S^(-1)
		var Ka = this.mPa * si;
		var Kb = this.mPc * si;

		// x = x + K.y
		this.mXa = this.mXa + Ka * y;
		this.mXb = this.mXb + Kb * y;

		// P = P - K.(H.P)
		var Pa = this.mPa - Ka * this.mPa;
		var Pb = this.mPb - Ka * this.mPb;
		var Pc = this.mPc - Kb * this.mPa;
		var Pd = this.mPd - Kb * this.mPb;

		this.mPa = Pa;
		this.mPb = Pb;
		this.mPc = Pc;
		this.mPd = Pd;
	};

	// Update (correct) with the given measurement.
	this.updatePosVelocity = function (position, velocity, positionNoise, velocityNoise) {
		// Generally....
		// [ a b ]
		// [ c d ]

		// Now do the math!

		//  y   =  z   -   H  . x

		// H = [ 1 0 ]
		//     [ 0 1 ]
		// y = [ ya yb ]'
		var ya = position - this.mXa;
		var yb = velocity - this.mXb;

		// S = H.P.H' + R
		// assume uncorrelated error in position and velocity.
		var sa = this.mPa + positionNoise * positionNoise;
		var sb = this.mPb;
		var sc = this.mPc;
		var sd = this.mPd + velocityNoise * velocityNoise;

		// the determinant of S may be zero, in which case the kalman filter has no solution and tracking will be reset
		if ((sa * sd - sb * sc) == 0) {
			kalman.setState(position, velocity, positionNoise);
			return;
		}

		// compute S^(-1) inverse matrix
		// inv = 1/(ad-bc)[d,-b,-c,a];
		var invMult = 1.0 / (sa * sd - sb * sc);
		var sia = invMult * sd;
		var sib = invMult * -sb;
		var sic = invMult * -sc;
		var sid = invMult * sa;

		// K = P.H'.S^(-1)
		var Ka = this.mPa * sia + this.mPb * sic;
		var Kb = this.mPa * sib + this.mPb * sid;
		var Kc = this.mPc * sia + this.mPd * sic;
		var Kd = this.mPc * sib + this.mPd * sid;

		// x = x + K.y
		this.mXa = this.mXa + Ka * ya + Kb * yb;
		this.mXb = this.mXb + Kc * ya + Kd * yb;

		// P = P - K.(H.P)
		var Pa = this.mPa - (Ka * this.mPa + Kb * this.mPc);
		var Pb = this.mPb - (Ka * this.mPb + Kb * this.mPd);
		var Pc = this.mPc - (Kc * this.mPa + Kd * this.mPc);
		var Pd = this.mPd - (Kc * this.mPb + Kd * this.mPd);

		this.mPa = Pa;
		this.mPb = Pb;
		this.mPc = Pc;
		this.mPd = Pd;
	};

	// Predict state.
	this.predict = function (timeStepSec, acceleration) {

		this.setTimeStep(timeStepSec);

		// x = F.x + G.u
		this.mXa = this.mXa + this.mXb * this.mt + acceleration * this.mt2d2;
		this.mXb = this.mXb + acceleration * this.mt;

		// P = F.P.F' + Q
		var Pdt = this.mPd * this.mt;
		var FPFtb = this.mPb + Pdt;
		var FPFta = this.mPa + this.mt * (this.mPc + FPFtb);
		var FPFtc = this.mPc + Pdt;
		var FPFtd = this.mPd;

		this.mPa = FPFta + this.mQa;
		this.mPb = FPFtb + this.mQb;
		this.mPc = FPFtc + this.mQc;
		this.mPd = FPFtd + this.mQd;
	};

	this.position = function () {
		return this.mXa;
	};

	this.velocity = function () {
		return this.mXb;
	};
}


kalmanhelpers = {};
kalmanhelpers.nextNormal = null;
// make a normally distributed # via Box-Muller
kalmanhelpers.normal = function () {
	if (this.nextNormal != null) {
		var tmp = this.nextNormal;
		this.nextNormal = null;
		return tmp;
	}

	var U = Math.random();
	var V = Math.random();

	this.nextNormal = Math.sqrt(-2 * Math.log(U)) * Math.cos(2 * Math.PI * V);
	return Math.sqrt(-2 * Math.log(U)) * Math.sin(2 * Math.PI * V);
};