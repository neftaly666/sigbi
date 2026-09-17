import { computed, inject, Service, signal } from "@angular/core";
import { httpResource } from "@angular/common/http";
import { Category } from "../model/category";
import { CategoryService } from "../services/category.service";

//Alta y edición comparten diálogo: con id se pide el registro, sin id la url queda
//undefined y httpResource no lanza petición alguna.
@Service({ autoProvided: false })
export class CategoryDialogStore{

    private readonly categoryService = inject(CategoryService);
    readonly $id = signal<number | null>(null);

    private readonly $request = computed(() => {
        const id = this.$id();

        return id ? `${this.categoryService.resourceUrl}/${id}` : undefined;
    });

    readonly categoryResource = httpResource<Category>(() => this.$request());

    setId(id: number | null){
        this.$id.set(id);
    }
}
