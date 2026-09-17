import { computed, inject, Service, signal } from "@angular/core";
import { httpResource } from "@angular/common/http";
import { Client } from "../model/client";
import { ClientService } from "../services/client.service";

//Alta y edición comparten diálogo: con id se pide el registro, sin id la url queda
//undefined y httpResource no lanza petición alguna.
@Service({ autoProvided: false })
export class ClientDialogStore{

    private readonly clientService = inject(ClientService);
    readonly $id = signal<number | null>(null);

    private readonly $request = computed(() => {
        const id = this.$id();

        return id ? `${this.clientService.resourceUrl}/${id}` : undefined;
    });

    readonly clientResource = httpResource<Client>(() => this.$request());

    setId(id: number | null){
        this.$id.set(id);
    }
}
