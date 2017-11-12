var sketch = function(processNoise, obsNoisePosReal, obsNoiseVelReal, obsNoisePosSent, obsNoiseVelSent) {
	return function(p) {
		var x = [0];
		var y = [0];

		var vx = 0.2;
		var vy = 0.2;

		var xTrack = new Kalman();
		var yTrack = new Kalman();
		var predictX = [0];
		var predictY = [0];
		var measureX = [0];
		var measureY = [0];

		p.setup = function () {
			p.createCanvas(800, 600);
			p.frameRate(30);
			p.background(0);   // Set the background to black

			// kalman - process noise 5
			xTrack.initialize(1, processNoise);
			// position = 0, velocity = 0, error = 10
			xTrack.setState(0, 0, obsNoisePosSent);
			yTrack.initialize(1, 5);
			yTrack.setState(0, 0, obsNoisePosSent);
		}

		p.draw = function () {
			// compute next location
			x.push(p.mouseX);
			y.push(p.mouseY);
			vx = x[x.length - 1] - x[x.length - 2];
			vy = y[y.length - 1] - y[y.length - 2];

			// compute noisy measurement
			measureX.push(x[x.length - 1] + obsNoisePosReal * kalmanhelpers.normal());
			measureY.push(y[y.length - 1] + obsNoisePosReal * kalmanhelpers.normal());
			var measurevx = vx + obsNoiseVelReal * kalmanhelpers.normal();
			var measurevy = vy + obsNoiseVelReal * kalmanhelpers.normal();

			xTrack.predict(1, 0); // timestep = 1, acceleration = 0;
			yTrack.predict(1, 0);
			xTrack.updatePosVelocity(measureX[measureX.length - 1], vx, obsNoisePosSent, obsNoiseVelSent);
			yTrack.updatePosVelocity(measureY[measureY.length - 1], vy, obsNoisePosSent, obsNoiseVelSent);

			predictX.push(xTrack.position());
			predictY.push(yTrack.position());

			if (x.length > 100) {
				x = x.slice(1);
				y = y.slice(1);
				measureX = measureX.slice(1);
				measureY = measureY.slice(1);
				predictX = predictX.slice(1);
				predictY = predictY.slice(1);
			}

			p.background(0);   // Set the background to black
			for (var i = 1; i < x.length - 1; i++) {
				// actual track
				p.strokeWeight(2);
				p.stroke('#474C55'); p.line(x[i - 1], y[i - 1], x[i], y[i]);
				// dot for measurement
				p.strokeWeight(1);
				p.stroke(255); p.line(measureX[i - 1], measureY[i - 1], measureX[i], measureY[i]);
				// green line for prediction
				p.strokeWeight(2);
				p.stroke('#D6FF00'); p.line(predictX[i - 1], predictY[i - 1], predictX[i], predictY[i]);
			}
		}

		// function keyPressed() {
		// 	if (keyCode === LEFT_ARROW) {
		// 		vx = vx - 0.1;
		// 	} else if (keyCode === RIGHT_ARROW) {
		// 		vx = vx + 0.1;
		// 	} else if (keyCode === UP_ARROW) {
		// 		vy = vy - 0.1;
		// 	} else if (keyCode == DOWN_ARROW) {
		// 		vy = vy + 0.1;
		// 	}
		// }
	}
};