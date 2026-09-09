import { httpResource } from "@angular/common/http";
import { inject, Service } from "@angular/core";
import { LoginService } from "../services/login.service";

@Service({ autoProvided: false })
export class DashboardStore {

    private readonly loginService = inject(LoginService);

    //httpResource y no una suscripcion con finalize: es una lectura simple, sin estado de carga propio,
    //y defaultValue cubre el caso en que la llamada falle
    readonly userInfoResource = httpResource<{ username: string }>(
        () => this.loginService.userInfoUrl,
        { defaultValue: { username: '' } },
    );

    readonly $username = this.userInfoResource.value;
    readonly $loading = this.userInfoResource.isLoading;
}
