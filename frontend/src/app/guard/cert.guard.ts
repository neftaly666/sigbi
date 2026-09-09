import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { MenuService } from "../services/menu.service";
import { map } from "rxjs";
import { Menu } from "../model/menu";

export const certGuard: CanActivateFn = (route, state) => {


    const menuService = inject(MenuService);
    const router = inject(Router);

    return menuService.getMenusByUser().pipe(
        map((data: Menu[]) => {
            const hasAccess = data.some(menu => state.url.startsWith(menu.url));

            if(!hasAccess){
                router.navigate(['/pages/not-403']);
                return false;
            }

            return true;
        })
    );
    
}
