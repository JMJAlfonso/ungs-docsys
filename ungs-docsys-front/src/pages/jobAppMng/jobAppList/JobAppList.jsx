import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Header from "../../../components/UI/Header";
import "../../../assets/styles/Home.css";
import { JwtService } from "../../../commons/utils/jwt.service";
import { JobApplicationsService } from '../../../commons/services/job-applications.service';
import Navbar from '../../../components/UI/Navbar';

export default function JobAppList() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    keywords: "",
    type: "",
    period: "",
    status: ""
  });
  const [jobApplications, setJobApplications] = useState([]);
  const [userClaim, setUserClaim] = useState({});

  const getUserClaim = () => {
    const claims = JwtService.getClaims();
    return {
      name: `${claims.firstName}, ${claims.lastName}`,
      role: `${claims.roles}`
    }
  };

  const fetchJobApplications = async () => {
    try {
      const jobApplicationsResponse = await JobApplicationsService.getAll();
      setJobApplications(jobApplicationsResponse);
    } catch (error) {
      console.error(error);
      setJobApplications([]);
    }
  };

  // Sample data - replace with your actual data source
  const jobApplicationsSample = [
    {
      id: 1,
      type: "Docente 1º",
      title: "Laboratorio de Construcción de Software/ Proyecto Profesional I",
      period: "2do cuatrimestre 2025",
      status: "Aprobada"
    },
    {
      id: 2,
      type: "Investigador",
      title: "Didáctica de la computación",
      period: "2do cuatrimestre 2025",
      status: "Pendiente"
    },
    {
      id: 3,
      type: "Asistente 2º",
      title: "Sistemas Operativos y Redes II",
      period: "2do cuatrimestre 2025",
      status: "Rechazada"
    }
  ];

  // Filter options
  const typeOptions = ["Docente 1º", "Docente 2º", "Asistente 1º", "Asistente 2º", "Investigador"];
  const periodOptions = ["1er cuatrimestre 2025", "2do cuatrimestre 2025", "Verano 2026"];
  const statusOptions = ["Aprobada", "Pendiente", "Rechazada"];

  const normalizeString = (str) => {
    return str
      .normalize("NFD") // Normalize to decomposed form
      .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
      .toLowerCase();
  };

  const filteredApplications = jobApplicationsSample.filter(app => {
    const normalizedKeywords = normalizeString(filters.keywords);
    const normalizedTitle = normalizeString(app.title); // <-- Calculate this here
    return (
      (filters.keywords === "" ||
        normalizedTitle.includes(normalizedKeywords)) &&
      (filters.type === "" || app.type === filters.type) &&
      (filters.period === "" || app.period === filters.period) &&
      (filters.status === "" || app.status === filters.status)
    );
  });

  const renderApplicationJobs = () => {
    if (userClaim?.roles?.includes('CANDIDATE')) {
      return (
        <>
          <div className="applications-list">
            {jobApplications.map(jobApplication => (
              <div key={jobApplication.id} className="application-card" onClick={() => navigate(`/viewJobApp/${jobApplication.id}`)}>
                <h3>{`Cargo: ${jobApplication.jobProfileLevel?.description}`}</h3>
                <h2>{jobApplication.title}</h2>
                <p>{`Periodo: ${jobApplication.jobApplicationPeriod?.description} ${jobApplication.yearPeriod}`}</p>
              </div>
            ))}
          </div>
        </>
      );
    }
    if (userClaim?.roles?.includes('RECRUITER')) {
      return (
        <>
          <div className="applications-list">
            {jobApplications.map(jobApplication => (
              <div key={jobApplication.id} className="application-card" onClick={() => navigate(`/viewJobApp/${jobApplication.id}`)}>
                <h3>{`Cargo: ${jobApplication.jobProfileLevel?.description}`}</h3>
                <h2>{jobApplication.title}</h2>
                <p>{`Periodo: ${jobApplication.jobApplicationPeriod?.description} ${jobApplication.yearPeriod}`}</p>
                <div className={`status-badge ${jobApplication.jobApplicationStatus?.name.toLowerCase().replace(/\s/g, '-')}`}>
                  {jobApplication.jobApplicationStatus?.description}
                </div>
              </div>
            ))}
          </div>
        </>
      );
    }
  };

  const renderNewApplicationJobButton = () => {
    if (userClaim?.roles?.includes('RECRUITER')) {
      return (
        <div className="new-application-button">
            <button
              className="create-button"
              onClick={() => navigate("/app-job-detail")}
            >
              Crear nueva postulación
            </button>
          </div>
      );
    }
  }

  useEffect(() => {
    fetchJobApplications();
    setUserClaim(JwtService.getClaims());
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="home-container">
      <Header
        user={getUserClaim()}
      />
      <Navbar />

      <div className="app-container">

        {/* 
        <div className="filters-section">
          <div className="filter-group">
            <label>Palabras clave:</label>
            <input
              type="text"
              value={filters.keywords}
              onChange={(e) => setFilters({ ...filters, keywords: e.target.value })}
            />
          </div>

          <div className="filter-group">
            <label>Tipo:</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            >
              <option value="">Todos</option>
              {typeOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Período:</label>
            <select
              value={filters.period}
              onChange={(e) => setFilters({ ...filters, period: e.target.value })}
            >
              <option value="">Todos</option>
              {periodOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Estado:</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="">Todos</option>
              {statusOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>
        */}


        {/* Applications List */}
        <div className="application-job-header">
          <h1>Lista de Postulaciones</h1>
          <p>Seleccione una postulación de la lista para visualizarla</p>
          {renderNewApplicationJobButton()}

        </div>

        {renderApplicationJobs()}
      </div>
    </div>
  );
}