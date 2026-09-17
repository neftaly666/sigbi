//Un turno del hilo. `pending` marca la respuesta que aún se está esperando, para pintarla
//como tal sin meter un estado aparte en el store.
export interface AssistantMessage {
    role: 'user' | 'assistant';
    content: string;
    pending?: boolean;
    //Respuesta emitida por el sistema, no por el modelo (por ejemplo, sin clave de OpenAI)
    notice?: boolean;
}
