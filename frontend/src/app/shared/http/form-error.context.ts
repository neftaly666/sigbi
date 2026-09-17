import { HttpContext, HttpContextToken } from "@angular/common/http";

/**
 * PX-04: el error se muestra donde se produjo.
 *
 * serverErrorInterceptor convierte cualquier fallo en un snackbar y corta el flujo, que
 * es lo correcto para una lectura de tabla y lo contrario de lo que necesita un
 * formulario: un 400 de RN-02 tiene que llegar al diálogo para pintarse bajo el campo
 * `isbn`. Esta marca viaja en el contexto de la petición y le dice al interceptor que
 * deje pasar el 400 sin tocarlo. El resto de códigos sigue tratandose igual.
 */
export const ERROR_DE_FORMULARIO = new HttpContextToken<boolean>(() => false);

export const contextoDeFormulario = () => new HttpContext().set(ERROR_DE_FORMULARIO, true);
