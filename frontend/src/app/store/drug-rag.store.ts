import { computed, inject, Service, signal } from "@angular/core";
import { finalize } from "rxjs";
import { RagService } from "../services/rag.service";

//El termino viaja en el query string, 80 deja el mensaje compuesto cerca de 150 caracteres
const MAX_TERM_LENGTH = 80;
const HISTORY_SIZE = 5;

//Convencion del proyecto (ExamStore, PatientStore, ReportStore): una instancia por pantalla.
//Salir de la pantalla olvida el termino y la respuesta, volver arranca limpio
@Service({ autoProvided: false })
export class DrugRagStore {

    private readonly ragService = inject(RagService);

    private readonly _term = signal('');
    readonly $term = this._term.asReadonly();

    private readonly _answer = signal('');
    readonly $answer = this._answer.asReadonly();

    private readonly _loading = signal(false);
    readonly $loading = this._loading.asReadonly();

    private readonly _error = signal(false);
    readonly $error = this._error.asReadonly();

    //Solo en memoria, no se persiste ni en el navegador ni en la base
    private readonly _history = signal<string[]>([]);
    readonly $history = this._history.asReadonly();

    readonly $hasResult = computed(() => !this._loading() && !!this._answer());
    readonly $isIdle = computed(() => !this._loading() && !this._answer() && !this._error());

    search(term: string){
        const clean = DrugRagStore.sanitize(term);

        if(!clean || this._loading()) return;

        this.remember(clean);
        this._term.set(clean);
        //Dejar la respuesta anterior bajo la barra de progreso la haria leer como la del termino nuevo
        this._answer.set('');
        this._error.set(false);
        this.ask(clean);
    }

    //No pasa por search(), reencolar el mismo termino lo haria saltar de sitio en el historial
    retry(){
        const term = this._term();

        if(!term || this._loading()) return;

        this._answer.set('');
        this._error.set(false);
        this.ask(term);
    }

    //El historial sobrevive, es lo unico que el usuario no pidio borrar
    clear(){
        this._term.set('');
        this._answer.set('');
        this._error.set(false);
    }

    //message se usa dos veces en el backend: como consulta del similaritySearch y como pregunta del prompt.
    //Una linea corta y con vocabulario del libro acerca el embedding a las paginas correctas,
    //un prompt largo de formato lo alejaria de ellas
    private ask(term: string){
        this._loading.set(true);
        let answered = false;

        this.ragService
            .ask(`${term}: indicaciones, mecanismo de accion, dosis, contraindicaciones y efectos adversos.`)
            .pipe(
                //serverErrorInterceptor devuelve EMPTY, el error nunca llega al suscriptor.
                //Apagar $loading en el callback error dejaria la pantalla congelada bajo la barra
                finalize(() => {
                    this._loading.set(false);

                    if(!answered){
                        this._error.set(true);
                    }
                })
            )
            .subscribe((data) => {
                //Un 200 con cuerpo vacio se trata como fallo y cae en el panel de error
                if(!data?.trim()) return;

                answered = true;
                this._answer.set(data);
            });
    }

    private remember(term: string){
        this._history.update((list) => [term, ...list.filter((item) => item !== term)].slice(0, HISTORY_SIZE));
    }

    //Las llaves llegarian al PromptTemplate del backend, que las usa como delimitadores
    private static sanitize(term: string): string {
        return term
            .replace(/[{}]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, MAX_TERM_LENGTH);
    }
}
