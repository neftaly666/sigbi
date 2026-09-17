import { computed, inject, Service } from "@angular/core";
import { httpResource } from "@angular/common/http";
import { Category } from "../model/category";
import { CategoryService } from "../services/category.service";

@Service({autoProvided: false})
export class CategoryStore{

    private readonly categoryService = inject(CategoryService);

    readonly categoriesResource = httpResource<Category[]>(
        () => this.categoryService.resourceUrl,
        { defaultValue: [] },
    );

    //`value()` LANZA cuando el recurso está en error, y los efectos que sincronizan la
    //tabla lo leen en cada ciclo: sin este guardia la excepción rompe el render y el
    //banner de error no llega a pintarse nunca. `hasValue()` es la comprobación que toca.
    readonly $categories = computed(() =>
        this.categoriesResource.hasValue() ? this.categoriesResource.value() : [],
    );
    readonly $loading = this.categoriesResource.isLoading;
    readonly $error = this.categoriesResource.error;

    //RN-14: el formulario de libro solo ofrece categorías activas. Hemeroteca está
    //desactivada a proposito y es lo que permite comprobarlo (AN050 sección 8.1).
    readonly $activas = computed(() => this.$categories().filter((c) => c.status));

    reload(){
        this.categoriesResource.reload();
    }
}
