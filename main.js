//Obtener el elemento canvas y asignar a la costante canvas;
const canvas = document.getElementById("canvas"),
    context = canvas.getContext("2d"), //agregar el contexto en 2 dimensiones
    //obtener el ancho y alto de la pantalla
	ancho = window.innerWidth,
	alto = window.innerHeight,
    //Defininendo coordenadas de origen en el centro de la pantalla
	InicioX = ancho / 2,
	InicioY = alto / 2,
    
    //Parametros para las particulas
	NumParticulas = 600, //Número de particulas
	Z_index = 2, //Posicion en el indice Z (si el valor es mayo, se aleja)
	tamañoParticula = 2, //Tamaño de renderizamiento de la particulas
	velocidad = .8, //Velocidad en la que se mueven las particulas
	particulas = []; //Arreglo para almacenar las particulas


class Particle { //Se define la clase para representar particulas en espacio tridimencional (x,y,z)
	constructor(x, y, z) { //Se utilizan las tres dimensiones
		this.pos = new Vector(x, y, z);  //Las tres dimensiones se crean en base a la clase Vector
		const X_VEL = 0, Y_VEL = 0, Z_VEL = -velocidad;
		this.vel = new Vector(X_VEL, Y_VEL, Z_VEL);
		this.vel.scale(0.005);
		this.fill = "rgba(255,255,255,0.3)";
		this.stroke = this.fill;
	}

	update() {
		this.pos.add(this.vel);
	}

	render() {
		const PIXEL = to2d(this.pos),
			X = PIXEL[0],
			Y = PIXEL[1],
			R = (Z_index - this.pos.z) / Z_index * tamañoParticula;

		if (X < 0 || X > ancho || Y < 0 || Y > alto) this.pos.z = Z_index;

		this.update();
		context.beginPath();
		context.fillStyle = this.fill;
		context.strokeStyle = this.stroke;
		context.arc(X, PIXEL[1], R, 0, Math.PI * 2);
		context.fill();
		context.stroke();
		context.closePath();
	}
}

class Vector {
	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	add(v) {
		this.x += v.x;
		this.y += v.y;
		this.z += v.z;
	}
	
	scale(n) {
		this.x *= n;
		this.y *= n;
		this.z *= n;
	}
}

function to2d(v) {
	const X_COORD = v.x - InicioX,
		Y_COORD = v.y - InicioY,
		PX = X_COORD / v.z,
		PY = Y_COORD / v.z;
	return [PX + InicioX, PY + InicioY];
}

function render() {
	for (let i = 0; i < particulas.length; i++) {
		particulas[i].render();
	}
}

function loop() {
	requestAnimationFrame(loop);
	context.fillStyle = "rgba(0,0,0,.1)";
	context.fillRect(0, 0, ancho, alto);
	render();
}

function createParticles() {
	for (let i = 0; i < NumParticulas; i++) {
		const X = Math.random() * ancho, Y = Math.random() * alto, Z = Math.random() * Z_index;
		particulas.push(new Particle(X, Y, Z));
	}
}

function init() {
	canvas.width = ancho;
	canvas.height = alto;
	createParticles();
	loop();
}
init();