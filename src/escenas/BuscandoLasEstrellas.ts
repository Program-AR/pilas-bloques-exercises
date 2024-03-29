/// <reference path = "EscenaActividad.ts" />
/// <reference path = "../actores/segundoCiclo/Manic/Manic.ts" />
/// <reference path = "../actores/segundoCiclo/Manic/TelescopioAnimado.ts" />
/// <reference path = "../actores/segundoCiclo/Chuy/Chuy.ts" />
/// <reference path = "../actores/segundoCiclo/Yvoty/Yvoty.ts" />
/// <reference path = "../comportamientos/SecuenciaAnimada.ts" />
/// <reference path = "../comportamientos/Interactuar.ts" />


class BuscandoLasEstrellas extends EscenaActividad {
  automata;
  telescopios = [];
  amigos = [];

  iniciar() {
    this.fondo = new Fondo('fondo.manic.oscuro.png', 0, 0);
    this.cuadricula = new Cuadricula(-50, -70, 1, 4,
      { alto: 180, ancho: 590 },
      { grilla: 'invisible.png', cantColumnas: 1 });
    this.cuadricula.casilla(0, 1).cambiarImagen('sombra5.telescopios.png');
    this.cuadricula.casilla(0, 2).cambiarImagen('sombra7.telescopios.png');
    this.cuadricula.casilla(0, 3).cambiarImagen('sombra9.telescopios.png');
    this.agregarTelescopios();
    this.agregarAutomata();
    this.agregarAmigos();
    this.crearEstado();
  }

  agregarAutomata() {
    this.automata = new Manic();
    this.cuadricula.agregarActor(this.automata, 0, 1, false);
    this.automata.y += 20;
    this.automata.x -= 30;
    this.automata.definirAnimacion("moverTelescopio", [28, 29, 30, 28], 3, false);
    
  }

  agregarTelescopios() {
    this.telescopios.push(new TelescopioAnimado());
    this.telescopios.push(new TelescopioAnimado());
    this.telescopios.push(new TelescopioAnimado());
    this.cuadricula.agregarActor(this.telescopios[0], 0, 1, false);
    this.cuadricula.agregarActor(this.telescopios[1], 0, 2, false);
    this.cuadricula.agregarActor(this.telescopios[2], 0, 3, false);
    this.telescopios.forEach(t => { t.escala = 0.7; t.x += -3});
  }

  agregarAmigos() {
    const posiciones = [ { x: 15, y: 10}, { x: 20, y: 30}, { x: 30, y: 50 }];
    this.amigos.push(new Chuy());
    this.amigos.push(new Yvoty());
    this.amigos.push(new Capy());
    this.amigos.forEach((a,i) => {
      this.cuadricula.agregarActor(this.amigos[i], 0, 0, false);
      a.x -= posiciones[i].x;
      a.y -= posiciones[i].y;
    });
  }

  private crearEstado() {
    var builder = new BuilderStatePattern(this, 'nadieObserva');
    builder.agregarEstadoAceptacion('todosObservando');
    builder.agregarTransicion('nadieObserva', 'todosObservando', 'observarConAmigos');
    this.estado = builder.estadoInicial();
  }
}

class MoverTelescopio extends Interactuar {

  sanitizarArgumentos() {
    this.argumentos.etiqueta = "TelescopioAnimado";
    this.argumentos.nombreAnimacion = "moverTelescopio";
    super.sanitizarArgumentos();
  }

  protected alInteractuar(): void {
    (this.interactuado() as TelescopioAnimado).mover();
  }

}

class TodosObservando extends SecuenciaAnimada {
  sanitizarArgumentos() {
    pilas.escena_actual().automata.x -= 80;
    pilas.escena_actual().automata.espejado = true;
    this.argumentos.secuencia = [
      new Decir({ receptor: pilas.escena_actual().automata, mensaje: "Vengan a observar conmigo!" }),
      new MoverACasillaDerecha({ receptor: pilas.escena_actual().amigos[0] }),
      new MoverACasillaDerecha({ receptor: pilas.escena_actual().amigos[0] }),
      new MoverACasillaDerecha({ receptor: pilas.escena_actual().amigos[0] }),
      new MoverACasillaDerecha({ receptor: pilas.escena_actual().amigos[1] }),
      new MoverACasillaDerecha({ receptor: pilas.escena_actual().amigos[1] }),
      new MoverACasillaDerecha({ receptor: pilas.escena_actual().amigos[2] }),
    ];
    super.sanitizarArgumentos();
  }

  configurarVerificaciones() {
    super.configurarVerificaciones();
    this.agregarVerificacionTelescopio(0, 5, "primer");
    this.agregarVerificacionTelescopio(1, 7, "segundo");
    this.agregarVerificacionTelescopio(2, 9, "tercer");
  }

  agregarVerificacionTelescopio(i, veces, ordinal) {
    this.verificacionesPre.push(
      new Verificacion(() => pilas.escena_actual().telescopios[i].nombreAnimacionActual() === "mover" + veces,
        "¡El " + ordinal + " telescopio debe moverse " + veces + " veces!"));
  }
}
