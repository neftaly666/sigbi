import { Service, signal } from "@angular/core";
import { Specialty } from "../model/specialty";
import { form, maxLength, minLength, required } from "@angular/forms/signals";

const emptySpecialty = (): Specialty => ({
    idSpecialty: null,
    nameSpecialty: '',
    descriptionSpecialty: '',
});

@Service({autoProvided: false})
export class SpecialtyForm {

    readonly $model = signal<Specialty>(emptySpecialty());

    readonly $form = form(this.$model, (path) => {
        required(path.nameSpecialty);
        minLength(path.nameSpecialty, 3);
        maxLength(path.nameSpecialty, 50);

        required(path.descriptionSpecialty);
        minLength(path.descriptionSpecialty, 3);
        maxLength(path.descriptionSpecialty, 150);
  });

  readonly isInvalid = () => this.$form().invalid();

  patch(specialty: Specialty){
    this.$model.set(specialty);
  }

  value(){
    return this.$model();
  }

  reset(){
    this.$model.set(emptySpecialty());
  }
}
