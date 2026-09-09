import { Service, signal } from "@angular/core";
import { Medic } from "../model/medic";
import { form, minLength, required } from "@angular/forms/signals";

const emptyMedic = (): Medic => ({
    idMedic: null,
    idSpecialty: null,
    primaryName: '',
    surname: '',
    cmpMedic: '',
    photo: ''
});

@Service({ autoProvided: false })
export class MedicForm {

    readonly model = signal<Medic>(emptyMedic());

    readonly form = form(this.model, (path) => {
        required(path.idSpecialty);

        required(path.primaryName);
        minLength(path.primaryName, 3);

        required(path.surname);
        minLength(path.surname, 3);

        required(path.cmpMedic);
        minLength(path.cmpMedic, 5);
  });

  readonly isEdit = () => this.model().idMedic > 0;
  readonly isInvalid = () => this.form().invalid();

  patch(medic?: Medic) {
    this.model.set(medic ?? emptyMedic());
  }

  value(){
    return this.model();
  }
}