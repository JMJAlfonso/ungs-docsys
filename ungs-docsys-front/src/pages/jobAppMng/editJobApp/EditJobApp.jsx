import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import Header from "../../../components/UI/Header";
import './edit-job-app.css';
import "../../../assets/styles/Home.css";
import { JwtService } from "../../../commons/utils/jwt.service";
import { JobProfileLevelsService } from "../../../commons/services/job-profile-levels.service";
import { JobApplicationPeriodsService } from "../../../commons/services/job-application-periods.service";
import { RequirementTargetComparatorsService } from "../../../commons/services/requirement-target-comparators.service";
import { RequirementTypesService } from "../../../commons/services/requirement-types.service";
import { JobApplicationsService } from "../../../commons/services/job-applications.service";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useLocation } from "react-router-dom";

export default function EditJobApp() {
  const {
    register,
    handleSubmit,
    control,
    setValue
  } = useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const existingJobApp = location.state?.jobApplication || null; // viene del navigate()
  const isEditing = !!existingJobApp;

  const [jobProfileLevels, setJobProfileLevels] = useState([]);
  const [jobApplicationPeriods, setJobApplicationPeriods] = useState([]);
  const [requirementTypes, setRequirementTypes] = useState([]);
  const [requirementTargetComparators, setRequirementTargetComparators] = useState([]);


  const operators = [
    { code: 'EQUALS', description: 'Igual a' },
    { code: 'NOT_EQUALS', description: 'No igual a' },
    { code: 'GREATER_THAN', description: 'Mayor que' },
    { code: 'GREATER_THAN_OR_EQUAL', description: 'Mayor o igual que' },
    { code: 'LESS_THAN', description: 'Menor que' },
    { code: 'LESS_THAN_OR_EQUAL', description: 'Menor o igual que' },
    { code: 'INCLUDES', description: 'Incluye' },
    { code: 'NOT_INCLUDES', description: 'No incluye' }
  ]

  const { fields: requirementsFields, append: appendRequirements, remove: removeRequirements } = useFieldArray({
    control,
    name: 'requirements'
  });

  const mapExpectedValueToJsonStringfy = (expectedValueString, expectedAgeValue) => {
    const expectedValueJson = {
      numericValue: Number(expectedAgeValue),
      stringValues: expectedValueString.split('|').map(val => val.trim()).filter(val => val !== '')
    }
    return JSON.stringify(expectedValueJson);
  };

  const handleSaveJobApplication = async (data) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const selectedYear = Number(data.yearPeriod);
  const selectedPeriod = jobApplicationPeriods.find(p => p.id === Number(data.jobApplicationPeriodId));
  const selectedSemester = selectedPeriod?.description?.toLowerCase() || "";

  if (selectedYear < currentYear) {
    const continuar = window.confirm(
      `⚠️ Estás cargando una postulación para un período anterior al año actual (${selectedYear} < ${currentYear}).\n¿Deseás continuar igualmente?`
    );
    if (!continuar) return;
  }

  if (selectedYear === currentYear) {
    const isSecondSemesterNow = currentMonth >= 7 && currentMonth <= 12;
    if (isSecondSemesterNow && selectedSemester.includes("1")) {
      const continuar = window.confirm(
        `⚠️ Estás cargando una postulación para un período anterior al semestre actual (${selectedSemester}).\n¿Deseás continuar igualmente?`
      );
      if (!continuar) return;
    }
  }

  const requirementsRequest = data.requirements.map(requirement => ({
    description: requirement.description,
    expectedValue: mapExpectedValueToJsonStringfy(
      requirement.expectedValue,
      requirement.expectedAgeValue
    ),
    requirementTypeId: Number(requirement.requirementTypeId),
    requirementTargetComparatorId: Number(requirement.requirementTargetComparatorId),
    operator: requirement.operator
  }));

  const request = {
    title: data.title,
    description: data.description,
    jobApplicationPeriodId: Number(data.jobApplicationPeriodId),
    minApprovers: 2,
    reason: data.reason,
    yearPeriod: selectedYear,
    jobProfileLevelId: Number(data.jobProfileLevelId),
    requirements: requirementsRequest
  };

  try {
    if (isEditing && existingJobApp?.id) {
      await JobApplicationsService.partiallyUpdate(request, existingJobApp.id);
      alert("✅ Postulación actualizada correctamente.");
    } else {
      await JobApplicationsService.create(request);
      alert("✅ Postulación creada correctamente.");
    }
    navigate("/jobAppList");
  } catch (error) {
    console.error(error);
    alert("❌ Ocurrió un error al guardar la postulación.");
  }
};



  const getUserClaim = () => {
    const claims = JwtService.getClaims();
    return {
      name: `${claims.firstName}, ${claims.lastName}`,
      role: `${claims.roles}`
    }
  }

  const fetchRequirementTargetComparators = async () => {
    try {
      const requirementTargetComparatorsResponse = await RequirementTargetComparatorsService.getAll();
      setRequirementTargetComparators(requirementTargetComparatorsResponse);
    } catch (error) {
      console.error(error);
      setRequirementTargetComparators([]);
    }
  };

  const fetchRequirementTypes = async () => {
    try {
      const requirementTypesResponse = await RequirementTypesService.getAll();
      setRequirementTypes(requirementTypesResponse.filter(requirementType => requirementType.name !== "GLOBAL"));
    } catch (error) {
      console.error(error);
      setRequirementTypes([]);
    }
  };

  const fetchJobProfileLevels = async () => {
    try {
      const jobProfileLevelsResponse = await JobProfileLevelsService.getAll();
      setJobProfileLevels(jobProfileLevelsResponse);
    } catch (error) {
      console.error(error);
      setJobProfileLevels([]);
    }
  };

  const fetchJobApplicationPeriods = async () => {
    try {
      const jobApplicationPeriods = await JobApplicationPeriodsService.getAll();
      setJobApplicationPeriods(jobApplicationPeriods);
    } catch (error) {
      console.error(error);
      setJobApplicationPeriods([]);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchJobApplicationPeriods();
    fetchJobProfileLevels();
    fetchRequirementTargetComparators();
    fetchRequirementTypes();
  }, []);
  useEffect(() => {
  if (existingJobApp) {
    // Precargar los valores en el formulario
    setValue("title", existingJobApp.title);
    setValue("description", existingJobApp.description);
    setValue("reason", existingJobApp.reason);
    setValue("yearPeriod", existingJobApp.yearPeriod);
    setValue("jobProfileLevelId", existingJobApp.jobProfileLevel?.id || "");
    setValue("jobApplicationPeriodId", existingJobApp.jobApplicationPeriod?.id || "");

    // Si hay requerimientos asociados, los precargamos
    if (existingJobApp.requirements && existingJobApp.requirements.length > 0) {
      const mappedReqs = existingJobApp.requirements.map(req => ({
        description: req.description,
        expectedValue: req.expectedValue,
        expectedAgeValue: JSON.parse(req.expectedValue)?.numericValue || "",
        requirementTypeId: req.requirementType?.id || "",
        requirementTargetComparatorId: req.requirementTargetComparator?.id || "",
        operator: req.operator || ""
      }));
      mappedReqs.forEach(req => appendRequirements(req));
    }
  }
}, [existingJobApp]);

  return (
    <div className="home-container">      
      <Header
      user={getUserClaim()}
      />

      <div className="app-container">
        <button
          className="go-back-button"
          onClick={() => navigate(-1)}
        >
          <ArrowBackIcon fontSize="large" />
          Volver
        </button>

        <form onSubmit={handleSubmit(handleSaveJobApplication)}>
          <div className="jobapp-info">
            <div className="info-row job-form-row">
              <span className="label">Materia:</span>
              <input
                type="text"
                name="course"
                className="form-input"
                placeholder="Nombre la materia"
                {...register("title", { required: "Campo obligatorio" })}
              />
            </div>
            <div className="info-row job-form-row">
              <span className="label">Tipo de docente:</span>
              <select
                name="position"
                className="form-input"
                {...register("jobProfileLevelId", { required: "Campo obligatorio" })}
              >
                <option value="">Seleccione</option>
                {jobProfileLevels.map(jobProfileLevel => (
                  <option key={jobProfileLevel.id} value={jobProfileLevel.id}>{`${jobProfileLevel.description}`}</option>
                ))}
              </select>
            </div>
            <div className="info-row job-form-row">
              <span className="label">Período de búsqueda:</span>
              <input
                type="number"
                name="yearPeriod"
                className="form-input year-period"
                placeholder="Escriba el año"
                {...register("yearPeriod", {
                  required: "Campo obligatorio",
                  valueAsNumber: true,
                  min: { value: 0, message: "No puede ser negativo" },
                })}
              />
              <select
                name="period"
                className="form-input"
                {...register("jobApplicationPeriodId", { required: "Campo obligatorio" })}
              >
                <option value="">Seleccione</option>
                {jobApplicationPeriods.map(jobApplicationPeriod => (
                  <option key={jobApplicationPeriod.id} value={jobApplicationPeriod.id}>{jobApplicationPeriod.description}</option>
                ))}
              </select>
            </div>

          </div>

          <h2 style={{ textAlign: 'center', color: 'black' }}>Descripción</h2>
          <div className="jobapp-info">
            <div className="info-row">
              <textarea
                name="description"
                className="form-textarea"
                rows={4}
                placeholder="Describa los detalles de la postulación..."
                {...register("description", { required: "Campo obligatorio" })}
              />
            </div>
          </div>

          <h2 style={{ textAlign: 'center', color: 'black' }}>¿Por qué desea abrir esta postulación?</h2>
          <div className="jobapp-info">
            <div className="info-row">
              <textarea
                name="motivation"
                className="form-textarea"
                rows={4}
                placeholder="Escriba su razón aquí"
                {...register("reason", { required: "Campo obligatorio" })}
              />
            </div>
          </div>

          <h2 style={{ textAlign: 'center', color: 'black' }}>Requerimientos</h2>
          <div className="jobapp-info">
            {
              requirementsFields.map((item, index) => (
                <div className="data-form" key={item.id}>
                  <div className="column">
                    <div className="info-row job-form-row">
                      <span className="label">Descripción:</span>
                      <input {...register(`requirements.${index}.description`)} />
                    </div>

                    <div className="info-row job-form-row">
                      <span className="label">Tipo de requerimiento:</span>
                      <select className="form-input" {...register(`requirements.${index}.requirementTypeId`)}>
                        <option value="">Seleccione</option>
                        {requirementTypes.map(requerimentType => (
                          <option key={requerimentType.name} value={requerimentType.id}>{requerimentType.description}</option>
                        ))}
                      </select>
                    </div>

                    <div className="info-row job-form-row">
                      <span className="label">Sección del CV a comparar:</span>
                      <select className="form-input" {...register(`requirements.${index}.requirementTargetComparatorId`)}>
                        <option value="">Seleccione</option>
                        {requirementTargetComparators.map(requirementTargetComparator => (
                          <option key={requirementTargetComparator.name} value={requirementTargetComparator.id}>{requirementTargetComparator.description}</option>
                        ))}
                      </select>
                    </div>

                    <div className="info-row job-form-row">
                      <span className="label">Operatoria:</span>
                      <select className="form-input" {...register(`requirements.${index}.operator`)}>
                        <option value="">Seleccione</option>
                        {operators.map(ope => (
                          <option key={ope.code} value={ope.code}>{ope.description}</option>
                        ))}
                      </select>
                    </div>

                    <div className="info-row job-form-row">
                      <span className="label">Valores alfanumericos comparar:</span>
                      <input {...register(`requirements.${index}.expectedValue`)} placeholder="Separe los valores por |. Ej: Sistemas|Computacion|Electronica..."/>
                    </div>
                    <div className="info-row job-form-row">
                      <span className="label">Años de experiencia:</span>
                      <input {...register(`requirements.${index}.expectedAgeValue`)} type="number"/>
                    </div>

                  </div>
                  <div className="column column-justify">
                    <div className="">
                      <button type="button" className="go-back-button delete-requirement-button" onClick={() => removeRequirements(index)}>Eliminar</button>
                    </div>
                  </div>
                </div>
              ))}
            <button type="button" className="go-back-button add-requirement-button" onClick={() => appendRequirements({ description: '', requirementTypeId: '', operator: '', expectedAgeValue: '', expectedYearValue: 0,requirementTargetComparatorId: '' })}>
              + Añadir
            </button>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate("/jobAppList")}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="create-button"
            >
              {isEditing ? "Actualizar postulación" : "Crear postulación"}
            </button>
          </div>

        </form>

      </div>
    </div>

  );
}