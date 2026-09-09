import { Service, signal } from "@angular/core";
import { Exam } from "../model/exam";
import { form, maxLength, minLength, required } from "@angular/forms/signals";

const emptyExam = (): Exam => ({
    idExam: null,
    nameExam: '',
    descriptionExam: '',
});

@Service({autoProvided: false})
export class ExamForm {

    readonly $model = signal<Exam>(emptyExam());

    readonly $form = form(this.$model, (path) => {
        required(path.nameExam);
        minLength(path.nameExam, 3);
        maxLength(path.nameExam, 70);

        required(path.descriptionExam);
        minLength(path.descriptionExam, 3);
        maxLength(path.descriptionExam, 150);
  });

  readonly isInvalid = () => this.$form().invalid();

  patch(exam: Exam){
    this.$model.set(exam);
  }

  value(){
    return this.$model();
  }

  reset(){
    this.$model.set(emptyExam());
  }
}