import { Service, signal } from "@angular/core";
import { form } from "@angular/forms/signals";

export interface SearchFormModel {
    dni: string;
    fullname: string;
    startDate: Date | null;
    endDate: Date | null;
}

const emptySearch = (): SearchFormModel => ({
    dni: '',
    fullname: '',
    startDate: null,
    endDate: null
});

@Service({ autoProvided: false })
export class SearchForm {

    readonly model = signal<SearchFormModel>(emptySearch());

    readonly form = form(this.model);

    value(){
        return this.model();
    }

    reset(){
        this.model.set(emptySearch());
    }
}
