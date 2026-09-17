import { computed, inject, Service } from "@angular/core";
import { httpResource } from "@angular/common/http";
import { Client } from "../model/client";
import { ClientService } from "../services/client.service";

@Service({autoProvided: false})
export class ClientStore{

    private readonly clientService = inject(ClientService);

    readonly clientsResource = httpResource<Client[]>(
        () => this.clientService.resourceUrl,
        { defaultValue: [] },
    );

    //`value()` LANZA cuando el recurso está en error, y los efectos que sincronizan la
    //tabla lo leen en cada ciclo: sin este guardia la excepción rompe el render y el
    //banner de error no llega a pintarse nunca. `hasValue()` es la comprobación que toca.
    readonly $clients = computed(() =>
        this.clientsResource.hasValue() ? this.clientsResource.value() : [],
    );
    readonly $loading = this.clientsResource.isLoading;
    readonly $error = this.clientsResource.error;

    reload(){
        this.clientsResource.reload();
    }
}
