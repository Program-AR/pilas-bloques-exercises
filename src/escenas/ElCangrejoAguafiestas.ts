/// <reference path = "EscenaActividad.ts" />
/// <reference path="../actores/CuadriculaEsparsa.ts"/>
/// <reference path="../actores/GloboAnimado.ts"/>
/// <reference path="../actores/CangrejoAnimado.ts"/>

  class ElCangrejoAguafiestas extends EscenaActividad {
    fondo;
    cuadricula;
    automata;
    cantidadFilas;
    cantidadColumnas;
    cantidadGlobos = 18;
    iniciar() {
        this.fondo = new Fondo('fondo.cangrejo_aguafiestas.png',0,0);
        this.cantidadFilas=5;
        this.cantidadColumnas=6;
        var matriz= this.matriz()
        this.cuadricula = new CuadriculaEsparsa(0,15,{alto: 360, ancho:400},{grilla:'casilla.cangrejo_aguafiestas.png'},matriz)
        this.completarConGlobos();
        this.automata = new CangrejoAnimado(0,0);
        this.automata.escala *= 1.2;
        this.agregarAutomata()
        
        this.estado = new EstadoParaContarBuilder(this, 'explotar', this.cantidadGlobos).estadoInicial();
      }

    agregarAutomata(){
      this.cuadricula.agregarActor(this.automata,0,0);
    }

    completarConGlobos(){
      this.cuadricula.forEachCasilla(c => {if(!c.esEsquina()) this.agregarGlobo(c)});
    }

    matriz(){
      return [
        ['T','T','T','T','T','T'],
        ['T','F','F','F','F','T'],
        ['T','T','T','T','T','T'],
        ['T','F','F','F','F','T'],
        ['T','T','T','T','T','T']]
    }

    agregarGlobo(casilla){
      var globo = new GloboAnimado();
      this.cuadricula.agregarActorEnCasilla(globo,casilla,false);
      globo.y += 20;
      globo.escala *= 0.8;
      globo.aprender(Flotar,{Desvio:5});
    }
}
