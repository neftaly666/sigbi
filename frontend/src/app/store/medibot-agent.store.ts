import { computed, inject, Service, signal } from "@angular/core";
import { finalize } from "rxjs";
import { AgentService } from "../services/agent.service";
import { ChatMessage } from "../model/chat-message";

const GREETING = '¡Hola! Soy **MediBot - Agent**, el asistente virtual de MediApp. ¿En qué puedo ayudarte hoy?';
const ERROR_TEXT = 'No pude obtener una respuesta del asistente. Inténtalo nuevamente.';

//Excepcion deliberada a la convencion autoProvided:false, una sola instancia para toda la aplicacion.
//NotificationService es el precedente de singleton en la raiz.
@Service()
export class MediBotAgentStore {

    private readonly agentService = inject(AgentService);

    private readonly _open = signal(false);
    readonly $open = this._open.asReadonly();

    private readonly _messages = signal<ChatMessage[]>([MediBotAgentStore.greeting()]);
    readonly $messages = this._messages.asReadonly();

    private readonly _loading = signal(false);
    readonly $loading = this._loading.asReadonly();

    private readonly _lastQuestion = signal('');

    //Solo el saludo en la lista, todavia no se ha preguntado nada
    readonly $showSuggestions = computed(() => this._messages().length === 1);
    readonly $canRetry = computed(() => !!this._lastQuestion() && !this._loading());

    //El navegador acuña el id, el backend lo exige. Sin el, todos compartirian una conversacion
    private conversationId = crypto.randomUUID();

    open(){
        this._open.set(true);
    }

    close(){
        this._open.set(false);
    }

    toggle(){
        this._open.update((open) => !open);
    }

    //Rota el id para que lo que ve el usuario y lo que recuerda el agente no se separen
    reset(){
        this._messages.set([MediBotAgentStore.greeting()]);
        this._lastQuestion.set('');
        this.conversationId = crypto.randomUUID();
    }

    send(message: string){
        const text = message.trim();

        if(!text || this._loading()) return;

        this.append({ role: 'user', text, time: new Date() });
        this._lastQuestion.set(text);
        this.ask(text);
    }

    //No pasa por send(), volveria a pintar la burbuja del usuario y la conversacion se leeria repetida
    retry(){
        const question = this._lastQuestion();

        if(!question || this._loading()) return;

        this._messages.update((list) => list.filter((message) => !message.error));
        this.ask(question);
    }

    private ask(message: string){
        this._loading.set(true);
        let answered = false;

        this.agentService
            .askMedicalBot(message, this.conversationId)
            .pipe(
                //serverErrorInterceptor devuelve EMPTY, el error nunca llega al suscriptor.
                //Apagar $loading en el callback error dejaria el chat congelado escribiendo
                finalize(() => {
                    this._loading.set(false);

                    if(!answered){
                        this.append({ role: 'bot', text: ERROR_TEXT, time: new Date(), error: true });
                    }
                })
            )
            .subscribe((data) => {
                //Un 200 con content vacio se trata como fallo y cae en la misma burbuja de error
                if(!data?.content?.trim()) return;

                answered = true;
                this.append({ role: 'bot', text: data.content, time: new Date() });
            });
    }

    private append(message: ChatMessage){
        this._messages.update((list) => [...list, message]);
    }

    private static greeting(): ChatMessage {
        return { role: 'bot', text: GREETING, time: new Date() };
    }
}
