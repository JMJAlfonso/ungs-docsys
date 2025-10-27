import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/UI/Header";
import "../../../assets/styles/Home.css";
import "./view-job-app.css";
import { JwtService } from "../../../commons/utils/jwt.service";
import { useParams } from "react-router-dom";
import { JobApplicationsService } from "../../../commons/services/job-applications.service";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { JobApplicationApprovalService } from "../../../commons/services/job-application-approval.service";
import { ResumesService } from "../../../commons/services/resumes.service";
import { ToastContext } from "../../../context/ToastContext";
import { JobApplicationResumeUsersService } from "../../../commons/services/job-application-resume-users.service";
import ChecklistIcon from '@mui/icons-material/Checklist';

export default function ViewJobApp() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [userClaim, setUserClaim] = useState({});
  const [jobApplication, setJobApplication] = useState({});
  const [mandatoryRequirements, setMandatoryRequirements] = useState([]);
  const [preferredRequirements, setPreferredRequirements] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [approvalDecision, setApprovalDecision] = useState(null);
  const [reason, setReason] = useState('');
  const [showPublishButton, setShowPublishButton] = useState(false);
  const { showToast } = useContext(ToastContext);

  const PUBLISHED_STATUS_ID = 3;

  const getUserClaim = () => {
    const claims = JwtService.getClaims();
    return {
      name: `${claims.firstName}, ${claims.lastName}`,
      role: `${claims.roles}`
    }
  }

  const handleApproval = (decision) => {
    setApprovalDecision(decision);
    setIsModalOpen(true);
  };

  const handleConfirm = async () => {
    try {
      const jobApplicationApprovalRequest = {
        jobApplicationId: Number(id),
        approved: approvalDecision,
        reason: reason
      };
      const jobApplicationApprovalResponse = await JobApplicationApprovalService.create(jobApplicationApprovalRequest);
      showToast(`Has ${approvalDecision ? 'aprobado' : 'rechazado'} la propuesta`, "success");
    } catch (error) {
      console.error(error);
      showToast("Hubo un error al revisar la propuesta", "error");
    }
    await refresh();
    setIsModalOpen(false);
    setReason('');
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setReason('');
  };

  const handlePublish = async () => {
    try {
      const jobApplicationResponse = await JobApplicationsService.partiallyUpdate({jobApplicationStatusId: PUBLISHED_STATUS_ID}, id);
      showToast("Su propuesta fue publicada correctamente", "success");
      await refresh();
    } catch (error) {
      showToast("Hubo un error al publicar", "error");
      console.error(error);
    }
  };

  const setPublishButton = async () => {
    try {
      const jobApplicationApprovalsResponse = await JobApplicationApprovalService.getByParams(Number(id));
      const approvedCount = jobApplicationApprovalsResponse.filter(item => item.approved === true);
      const hasRejected = jobApplicationApprovalsResponse.some(item => item.approved === false);
      setShowPublishButton(approvedCount.length >= 2 && !hasRejected);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchJobApplication = async () => {
    try {
      const jobApplicationResponse = await JobApplicationsService.getById(id);
      if (!jobApplicationResponse?.requirements) return;
      const { mandatory, preferred } = jobApplicationResponse.requirements.reduce(
        (acc, req) => {
          if (req.requirementType.name === "MANDATORY") acc.mandatory.push(req);
          else if (req.requirementType.name === "PREFERRED") acc.preferred.push(req);
          return acc;
        },
        { mandatory: [], preferred: [] }
      );

      setJobApplication(jobApplicationResponse);
      setMandatoryRequirements(mandatory);
      setPreferredRequirements(preferred);
    } catch (error) {
      console.error(error);
      setJobApplication({});
    }
  };

  const apply = async () => {
    try {
      const currentResumeOfUser = await ResumesService.getByParams(true);
      if(currentResumeOfUser.length > 0) {
        console.log(JSON.stringify(currentResumeOfUser));
        await applyRequest(jobApplication.id, currentResumeOfUser[0].id)
      } else {
        console.error('No tienes un CV Cargado');
        showToast("Aún no has configurado tu curriculum", "warning");
      }
    } catch (error) {
      console.error(error);
      showToast("Hubo un problema al aplicar", "error");
    }
  };
  const applyRequest = async (jobApplicationId, resumeUserId) => {
    try {
      const request = {
        jobApplicationId: jobApplicationId, resumeUserId: resumeUserId
      }
      await JobApplicationResumeUsersService.create(request);
      showToast("Has aplicado para la propuesta", "success");
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const goToCandidateList = () => {
    navigate(`/job-application-resume-managment/${jobApplication.id}`);
  }

  const refresh = async () => {
    await fetchJobApplication();
    await setPublishButton();
  };

  useEffect(() => {
    setUserClaim(JwtService.getClaims());
    refresh();
    window.scrollTo(0, 0);
  }, [id]);

  const renderByRole = () => {

    if(userClaim?.roles?.includes('RECRUITER')) {
      return (
      <>
      <div className="app-container">
        <div className="view-jobapp-header">
          <div className="back-section">
            <button
              className="go-back-button"
              onClick={() => navigate(-1)}
            >
              <ArrowBackIcon fontSize="large" />
              Volver
            </button>
          </div>
          { jobApplication?.jobApplicationStatus?.id !== PUBLISHED_STATUS_ID ? (<div className="managment-buttons">
            <button className="managment-button-format aprove-button" onClick={() => handleApproval(true)}>
              Aprobar
            </button>
            <button className="managment-button-format reject-button" onClick={() => handleApproval(false)}>
              Rechazar
            </button>
            {showPublishButton ? (
              <button
                className="managment-button-format publish-button"
                onClick={() => handlePublish()}
              >
                Publicar
              </button>
            ) : null}

            <button className="managment-button-format edit-button">
              Editar
            </button>
          </div>) : (
            <div className="managment-buttons"> 
              <button className="managment-button-format edit-button" onClick={() => goToCandidateList()}>
                <ChecklistIcon fontSize="large"/>
              Ver candidatos
            </button>
            </div>
          )}
          
        </div>

        <h1 style={{ textAlign: 'center' }}>{jobApplication.title}</h1>

        <div className="jobapp-info">
          <div className="info-row">
            <span className="label">Tipo de docente:</span>
            <span className="value">{`${jobApplication.jobProfileLevel?.description}`}</span>
          </div>
          <div className="info-row">
            <span className="label">Período de búsqueda:</span>
            <span className="value">{jobApplication.jobApplicationPeriod?.description}</span>
          </div>
          <div className="info-row">
            <span className="label">Estado:</span>
            <span className="value">{jobApplication.jobApplicationStatus?.description}</span>
          </div>

        </div>

        <h2 style={{ textAlign: 'center', color: 'black' }}>Descripción</h2>
        <div className="jobapp-info">
          <div className="info-row">

            <p className="formatted-text">{jobApplication.description}</p>
          </div>

        </div>

        <div className="requirements-section">
          <h2>Requisitos excluyentes</h2>
          <ul className="requirements-list">
            {mandatoryRequirements.map((req, index) => (
              <li key={index}>
                {req.description}
              </li>
            ))}
          </ul>
        </div>

        <div className="requirements-section">
          <h2>Valoraciones / Deseables</h2>
          <ul className="requirements-list">
            {preferredRequirements.map((req, index) => (
              <li key={index}>
                {req.description}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">

          <div className="modal-content">
            <h2>Ingrese el motivo de su decisión</h2>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ingrese el motivo..."
              rows="4"
            />
            <div className="back-section modal-buttons">
              <button className="go-back-button" onClick={handleConfirm}>Aceptar</button>
              <button className="go-back-button" onClick={handleCancel}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
      </>
    );
    }
    if(userClaim?.roles?.includes('CANDIDATE')) {
      return (
      <>
      <div className="app-container">
        <div className="view-jobapp-header">
          <div className="back-section">
            <button
              className="go-back-button"
              onClick={() => navigate(-1)}
            >
              <ArrowBackIcon fontSize="large" />
              Volver
            </button>
          </div>

          <div className="managment-buttons">
            <button className="managment-button-format aprove-button" onClick={() => apply()}>
              Postularme
            </button>
          </div>
        </div>

        <h1 style={{ textAlign: 'center' }}>{jobApplication.title}</h1>

        <div className="jobapp-info">
          <div className="info-row">
            <span className="label">Tipo de docente:</span>
            <span className="value">{`${jobApplication.jobProfileLevel?.description}`}</span>
          </div>
          <div className="info-row">
            <span className="label">Período de búsqueda:</span>
            <span className="value">{jobApplication.jobApplicationPeriod?.description}</span>
          </div>
          <div className="info-row">
            <span className="label">Estado:</span>
            <span className="value">{jobApplication.jobApplicationStatus?.description}</span>
          </div>

        </div>

        <h2 style={{ textAlign: 'center', color: 'black' }}>Descripción</h2>
        <div className="jobapp-info">
          <div className="info-row">
            <p className="formatted-text">{jobApplication.description}</p>
          </div>

        </div>

        <div className="requirements-section">
          <h2>Requisitos excluyentes</h2>
          <ul className="requirements-list">
            {mandatoryRequirements.map((req, index) => (
              <li key={index}>
                {req.description}
              </li>
            ))}
          </ul>
        </div>

        <div className="requirements-section">
          <h2>Valoraciones / Deseables</h2>
          <ul className="requirements-list">
            {preferredRequirements.map((req, index) => (
              <li key={index}>
                {req.description}
              </li>
            ))}
          </ul>
        </div>
      </div>
      </>
    );
    }
    
  };

  return (
    <div className="home-container">
      <Header
        user={getUserClaim()}
        navItems={["Gestión de Postulaciones", "Otras opciones", "Opción 2", "Opción 3"]}
      />

      {renderByRole()}
    </div>
  );
}