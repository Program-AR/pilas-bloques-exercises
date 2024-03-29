/// <reference path = "../../node_modules/pilasweb/dist/pilasweb.d.ts"/>
/// <reference path = "Llenar.ts" />

class LlenarTacho extends Llenar {

    public nombreAnimacion(): String {
        return "recoger"
    }

    public nombreProximaAnimacion(): string {
        return "lleno"
    }

    configurarVerificaciones() {
        super.configurarVerificaciones()

        const escena = pilas.escena_actual()
    }

    postAnimacion() {
        super.postAnimacion()
        if (pilas.escena_actual().estaResueltoElProblema()) {
            pilas.escena_actual().estado = new Estado(() =>
                true
            )
        }
    }
}