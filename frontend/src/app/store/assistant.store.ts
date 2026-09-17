import { inject, Service, signal } from "@angular/core";
import { AssistantMessage } from "../model/assistant-message";
import { AssistantService } from "../services/assistant.service";

function nuevoIdDeHilo(): string {
    const aleatorio = Math.random().toString(36).slice(2, 10);

    return `hilo-${Date.now().toString(36)}-${aleatorio}`;
}

/**
 * El hilo vive en el cliente y dura lo que dura la pantalla. El backend recuerda los
 * últimos mensajes por `conversationId`, así que basta con generarlo una vez y enviarlo
 * en cada turno.
 */
@Service({ autoProvided: false })
export class AssistantStore {

    private readonly assistantService = inject(AssistantService);

    //Identificador del hilo: uno por montaje de la pantalla.
    //crypto.randomUUID() solo existe en contexto seguro, así que por HTTP sin TLS lanza
    //TypeError y se lleva la pantalla entera por delante. Aquí no hace falta un UUID
    //criptografico: es una clave de agrupacion que vive lo que vive una pestana.
    private readonly conversationId = nuevoIdDeHilo();

    private readonly _messages = signal<AssistantMessage[]>([]);
    readonly $messages = this._messages.asReadonly();

    private readonly _sending = signal(false);
    readonly $sending = this._sending.asReadonly();

    ask(message: string) {
        const texto = message.trim();

        if (!texto || this._sending()) return;

        this._sending.set(true);
        this._messages.update((mensajes) => [
            ...mensajes,
            { role: 'user', content: texto },
            { role: 'assistant', content: '', pending: true },
        ]);

        this.assistantService.ask(texto, this.conversationId).subscribe({
            next: (respuesta) =>
                this.resolverUltimo({
                    role: 'assistant',
                    content: respuesta.content,
                    notice: !respuesta.configured,
                }),
            //El interceptor ya avisa del fallo; aquí se deja el hilo en un estado legible
            //en vez de con una burbuja vacía esperando para siempre
            error: () =>
                this.resolverUltimo({
                    role: 'assistant',
                    content: 'No se pudo consultar al asistente. Inténtalo de nuevo.',
                    notice: true,
                }),
        });
    }

    private resolverUltimo(mensaje: AssistantMessage) {
        this._messages.update((mensajes) => [...mensajes.slice(0, -1), mensaje]);
        this._sending.set(false);
    }

    reset() {
        this._messages.set([]);
    }
}
