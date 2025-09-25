import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import "./SignUp.css";
import { NationalititesService } from "../../../commons/services/nationalities.service";
import { IdentificationTypeService } from "../../../commons/services/identification-types.service";
import { SignUpService } from "../../../commons/services/sign-up.service";

export default function SignUp() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      tipoDocumento: "DNI",
    },
  });

  const [fecha, setFecha] = useState("");
  const [nationalities, setNationalities] = useState([]);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [step, setStep] = useState(1);
  const [isGestionarVacantes, setIsGestionarVacantes] = useState(null);

  const onNext = async (data) => {
    console.log(JSON.stringify(data));
    if(step === 3 ) {
      const signUpRequest = {
        roleId: Number(data.roleId),
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        identificationTypeId: Number(data.identificationTypeId),
        identificationNumber: data.identificationNumber,
        cuilCuit: data.cuil,
        phone: data.phone,
        birthDate: data.birthDate,
        nationalityId: Number(data.nationalityId)
      }
      await SignUpService.signUp(signUpRequest);
      window.location.href = "/";
    } else {
      setStep((prevStep) => prevStep + 1);
    }
    console.log(step);
  };

  const onSubmit = async (data) => {
    onNext(data);
  };

  useEffect(() => {
    const getAllNationalities = async () => {
      try {
        const data = await NationalititesService.getAll();
        setNationalities(data);
      } catch (error) {
        console.error(error);
      }
    };

    const getAllIdentificationTypes = async () => {
      try {
        const data = await IdentificationTypeService.getAll();
        setDocumentTypes(data);
      } catch (error) {
        console.error(error);
      }
    }

    getAllNationalities();
    getAllIdentificationTypes();
  }, []);
  

  const validateFecha = (value) => {
    if (!value) return "La fecha es obligatoria.";
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(value)) return "Formato inválido (YYYY-MM-DD)";
    const fechaIngresada = new Date(value);
    if (isNaN(fechaIngresada.getTime())) return "Fecha inválida";
    if (fechaIngresada > new Date()) return "La fecha no puede ser futura";
    return true;
  };

  const password = watch("password");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-container">
      <button className="back-button" type="button" onClick={() => setStep(step - 1)}>
        &lt; Volver
      </button>
      {step === 1 && (
        <div className="step-1-container">
          <h1>¿Con qué objetivo vas a registrarte?</h1>
          <div className="option-buttons-row">
            <button type="button" className="option-button" onClick={() => setValue("roleId", 1) || setStep(2)}>
              Gestionar las vacantes de trabajo
            </button>
            <button
              className="option-button"
              type="button"
             /* onClick={() => {
                setIsGestionarVacantes(false);
                handleNext();
              }}*/
              onClick={() => handleRole(2)}
            >
              Buscar y postularte a vacantes de trabajo
            </button>
            {errors.roleId && <p className="error-message">{errors.roleId.message}</p>}
            <input type="hidden" {...register("roleId", { required: "Campo obligatorio" })} />
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2>Ingresá tus datos personales</h2>
          <div className="form-inner">
            <div className="form-group">
              <label>Nombre</label>
              <input
                
                type="text"
                {...register("firstName", {
                  required: "Campo obligatorio",
                  pattern: { value: /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/, message: "Solo letras" },
                })}
              />
              {errors.firstName && <p className="error-message">{errors.firstName.message}</p>}
            </div>

            <div className="form-group">
              <label>Apellido</label>
              <input                
                type="text"
                {...register("lastName", {
                  required: "Campo obligatorio",
                  pattern: { value: /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/, message: "Solo letras" },
                })}
              />
              {errors.lastName && <p className="error-message">{errors.lastName.message}</p>}
            </div>

            <div className="form-group">
              <label>Tipo de Documento</label>
              <select {...register("identificationTypeId", { required: "Campo obligatorio" })}>
                <option value="0">Seleccione</option>
                {documentTypes.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.code}
                  </option>
                ))}
              </select>
              {errors.identificationTypeId && <p className="error-message">{errors.identificationTypeId.message}</p>}
            </div>

            <div className="form-group">
              <label>N° de Documento</label>
              <input
                
                type="text"
                {...register("identificationNumber", {
                  required: "Campo obligatorio",
                  pattern: { value: /^[0-9]{8}$/, // exactamente 8 dígitos
                  message: "El DNI debe tener exactamente 8 números(completar con 0)" },
                })}
              />
              {errors.identificationNumber && <p className="error-message">{errors.identificationNumber.message}</p>}
            </div>

            <div className="form-group">
              <label>CUIL</label>
              <input
               
                type="text"
                {...register("cuil", {
                  required: "Campo obligatorio",
                  pattern: { value: /^[0-9]{11}$/, message: "CUIL inválido (11 dígitos)" },
                  validate: (value, formValues) => {
                  const dni = formValues.identificationNumber;
                  if (!dni || dni.length !== 8) return true;

                  // extraer los 8 del medio del CUIL
                  const dniEnCuil = value.substring(2, 10);
                  if (dniEnCuil !== dni) {
                    return "El CUIL no coincide con el DNI ingresado";
                  }
                  return true;
                }
                })}
              />
              {errors.cuil && <p className="error-message">{errors.cuil.message}</p>}
            </div>

            <div className="form-group">
              <label>Teléfono</label>
              <input                
                type="tel"
                {...register("phone", {
                  required: "Campo obligatorio",
                  pattern: { value: /^[0-9]{8,15}$/, message: "Teléfono inválido" },
                })}
              />
              {errors.phone && <p className="error-message">{errors.phone.message}</p>}
            </div>

            <div className="form-group">
              <label>Fecha de nacimiento</label>
              <input
                type="text"                
                
                placeholder="YYYY-MM-DD"
                value={fecha}
                {...register("birthDate", { required: "Campo obligatorio", validate: validateFecha })}
                onChange={(e) => setFecha(e.target.value)}
              />
              {errors.birthDate && <p className="error-message">{errors.birthDate.message}</p>}
            </div>

            <div className="form-group">
              <label>Nacionalidad</label>
              <select {...register("nationalityId", { required: "Campo obligatorio" })}>
                <option value="0">Seleccione su nacionalidad</option>
                {nationalities.map((nat) => (
                  <option key={nat.id} value={nat.id}>
                    {nat.description}
                  </option>
                ))}
              </select>
              {errors.nationalityId && <p className="error-message">{errors.nationalityId.message}</p>}
            </div>

            <button className="next-button" type="submit">
              Siguiente
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2>Ingresa tus datos de inicio de sesión</h2>
          <div class="container">
            <div class="form-group">
              <h3>Correo electrónico</h3>
              <input
              type="email"
              placeholder="Ingresa tu correo electrónico"
              {...register("email", {
                required: "Campo obligatorio",
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Correo inválido" },
              })}
            />
            {errors.email && <p className="error-message">{errors.email.message}</p>}
              
            </div>

            <div class="form-group">
              <h3>Contraseña</h3>
              <input
              type="password"
              placeholder="Crea una contraseña"
              {...register("password", {
                required: "Campo obligatorio",
                pattern: {
                  value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/,
                  message: "Debe tener 8 caracteres, letra, número y símbolo",
                },
              })}
            />
            {errors.password && <p className="error-message">{errors.password.message}</p>}
            </div>

            <div class="form-group">
              <h3>Repetir contraseña</h3>
              <input
              type="password"
              placeholder="Repite tu contraseña"
              {...register("confirmPassword", {
                required: "Campo obligatorio",
                validate: (value) => value === password || "Las contraseñas no coinciden",
              })}
            />
            {errors.confirmPassword && <p className="error-message">{errors.confirmPassword.message}</p>}
            </div>

            <button type="submit" className="login-button">
              Registrarme
            </button>
            
          </div>
        </div>
      )}
    </form>
  );
}
