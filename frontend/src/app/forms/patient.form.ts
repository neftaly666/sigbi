import { Service, signal } from "@angular/core";
import { Patient } from "../model/patient";
import { email, form, maxLength, minLength, required } from "@angular/forms/signals";

const emptyPatient = (): Patient => ({
    idPatient: null,
    firstName: '',
    lastName: '',
    dni: '',
    address: '',
    phone: '',
    email: '',
});

@Service({autoProvided: false})
export class PatientForm {

    readonly $model = signal<Patient>(emptyPatient());

    readonly $form = form(this.$model, (path) => {
        required(path.firstName);
        minLength(path.firstName, 3);
        maxLength(path.firstName, 70);

        required(path.lastName);
        minLength(path.lastName, 3);
        maxLength(path.lastName, 70);

        required(path.dni);
        minLength(path.dni, 8);
        maxLength(path.dni, 8);

        //address es el unico campo opcional, solo se limita su longitud
        maxLength(path.address, 150);

        required(path.phone);
        maxLength(path.phone, 9);

        required(path.email);
        email(path.email);
        maxLength(path.email, 55);
  });

  readonly isInvalid = () => this.$form().invalid();

  patch(patient: Patient){
    //el backend omite address cuando es null (JsonInclude.NON_NULL), se normaliza a ''
    this.$model.set({ ...patient, address: patient.address ?? '' });
  }

  value(){
    return this.$model();
  }

  reset(){
    this.$model.set(emptyPatient());
  }
}
