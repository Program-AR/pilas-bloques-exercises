/// <reference path = "EscenaDesdeMapa.ts" />


class EscenaManic extends EscenaDesdeMapa {
	automata: Manic;
	xFinal: number;
	yFinal: number;
	
	static clasesDeActoresInvolucrados(): typeof ActorAnimado[] {
		return [Manic, Telescopio, Estrella, Planeta];
	};

	static pathFondo(): string {
		return 'fondo.manic.png';
	}

	static nombreAutomata(): string {
		return 'manic'
	}

	constructor(especificacion: Spec, opciones?: opcionesMapaAleatorio, posFinal?: [number, number]) {
		super();
		this.initDesdeUnaOVariasDescripciones(especificacion, opciones, posFinal);
	}

	ajustarGraficos() {
		this.automata.escala *= this.escalaSegunCuadricula(1.8);
		this.automata.setY(this.automata.getY() + this.automata.getAlto() / 4);

		this.obtenerActoresConEtiquetas(["Estrella", "Planeta"]).forEach(actor => {
			actor.aprender(Flotar, { Desvio: 4, eje: 'X' });
			actor.escala *= this.escalaSegunCuadricula(0.5);
		});

		this.obtenerActoresConEtiqueta("Telescopio").forEach(telescopio => {
			telescopio.escala *= this.escalaSegunCuadricula(1.2);
			telescopio.setY(telescopio.getY() + 10)
		});

		this.obtenerActoresConEtiqueta("Obstaculo").forEach(obstaculo => {
			obstaculo.escala *= this.escalaSegunCuadricula(0.9);
		});
	}

	mapearIdentificadorAActor(id, nroFila, nroColumna): ActorAnimado {
		switch (id) {
			case 'A': return this.automata;
			case 'O': return this.obtenerObstaculo(nroFila, nroColumna);
			case 'T': return new Telescopio();
			case 'R': return new Telescopio(true); //telescopio Arreglado
			case 'E': return new Estrella();
			case 'P': return new Planeta();
			default: throw new Error("El identificador '" + id +
				"' no es válido en una escena de Manic.");
		}
	}

	obtenerAutomata(): Manic {
		return new Manic();
	}

	obtenerObstaculo(fila: number, columna: number): Obstaculo {
		let archivosObstaculos = ["obstaculo.manic1.png", "obstaculo.manic2.png", "obstaculo.manic3.png", "obstaculo.manic4.png"];
		return new Obstaculo(archivosObstaculos, (fila + 1) + (fila + 1) * (columna + 1));
	}

	telescopiosArreglados(): boolean {
		return this.todosLosActoresCumplen("Telescopio", "arreglado")
	}

	telescopioResuelto(): boolean {
		return this.telescopiosArreglados() || this.noHay("Telescopio")
	}

	observados(actor): boolean {
		return this.todosLosActoresCumplen(actor, "recoger")
	}

	observacionResuelta(actor): boolean {
		return this.observados(actor) || this.noHay(actor)
	}

	estaResueltoElProblema(): boolean {
		return super.estaResueltoElProblema() && this.telescopioResuelto() && this.observacionResuelta("Estrella") && this.observacionResuelta("Planeta");        	
	}

	archivoFondo() {
		return "fondo.manic.png";
	}
	cuadriculaX() {
		return 0;
	}
	cuadriculaY() {
		return -20;
	}
	opsCuadricula() {
		return { ancho: 400, alto: 380 };
	}
	opsCasilla() {
		return {
			grilla: 'casillas.manic.png',
			cantFilas: 1,
			cantColumnas: 16,
			bordesDecorados: true,
			relAspecto: 1,
		};
	}
}