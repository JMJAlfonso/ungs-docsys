import { JwtService } from "../../commons/utils/jwt.service";
import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/UI/Header";
import './resume-form.css';
import { ResumesService } from "../../commons/services/resumes.service";
import Navbar from "../../components/UI/Navbar";
import SaveIcon from '@mui/icons-material/Save';
import EditDocumentIcon from '@mui/icons-material/EditDocument';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import UploadFileIcon from '@mui/icons-material/UploadFile';

export default function ResumeForm() {

    const [isEditing, setIsEditing] = useState(false);
    const [userClaim, setUserClaim] = useState({});
    const [resumeUser, setResumeUser] = useState({});
    const navigate = useNavigate();
    const { resumeUserId } = useParams();

    const { register, handleSubmit, control, reset, watch } = useForm({
        contact: {},
        educations: [],
        experiences: [],
        languages: [],
        technicalSkills: [],
        certifications: [],
        resumeFiles: []
    });

    const { fields: experienceFields, append: appendExperiences, remove: removeExperiences } = useFieldArray({
        control,
        name: 'experiences'
    });

    const { fields: educationFields, append: appendEducations, remove: removeEducations } = useFieldArray({
        control,
        name: 'educations'
    });

    const { fields: certificationFields, append: appendCertifications, remove: removeCertifications } = useFieldArray({
        control,
        name: 'certifications'
    });

    const { fields: technicalSkillFields, append: appendTechnicalSkills, remove: removeTechnicalSkills } = useFieldArray({
        control,
        name: 'technicalSkills'
    });

    const { fields: languageFields, append: appendLanguages, remove: removeLanguages } = useFieldArray({
        control,
        name: 'languages'
    });

    const { fields: resumeFilesFields, append: appendResumeFiles, remove: removeResumeFiles } = useFieldArray({
        control,
        name: 'resumeFiles'
    });

    const experiencesOnlyRead = watch('experiences');
    const educationsOnlyRead = watch('educations');
    const certificationsOnlyRead = watch('certifications');
    const technicalSkillsOnlyRead = watch('technicalSkills');
    const languagesOnlyRead = watch('languages');
    const contactOnlyRead = watch('contact');

    const getUserClaim = () => {
        const claims = JwtService.getClaims();
        return {
            name: `${claims.firstName}, ${claims.lastName}`,
            role: `${claims.roles}`
        }
    };

    const fetchCurrentResumeByUser = async () => {
        const userRoles = JwtService.getClaims();
        try {
            if (userRoles?.roles?.includes('RECRUITER') && resumeUserId) {
                const resumeUserById = await ResumesService.getById(resumeUserId);
                setResumeUser(resumeUserById);
            }
            if (userRoles?.roles?.includes('CANDIDATE')) {
                const currentResumeList = await ResumesService.getByParams(true);
                if (currentResumeList.length > 0) {
                    reset(currentResumeList[0]);
                }
            }
        } catch (error) {
            console.error(error);
        }
    };
        // 🔹 Validaciones de coherencia de fechas
    const validateDateRanges = (data) => {
    let errors = [];

    // Validar experiencias laborales
    data.experiences?.forEach((exp, index) => {
        if (exp.startDate && exp.endDate) {
        const start = new Date(exp.startDate);
        const end = new Date(exp.endDate);
        if (end < start) {
            errors.push(`La fecha de fin en la experiencia ${index + 1} no puede ser anterior a la fecha de inicio.`);
        }
        }
    });

    // Validar certificaciones
    data.certifications?.forEach((cert, index) => {
        if (cert.issueDate && cert.expirationDate) {
        const issue = new Date(cert.issueDate);
        const exp = new Date(cert.expirationDate);
        if (exp < issue) {
            errors.push(`La fecha de vencimiento del certificado ${index + 1} no puede ser anterior a su emisión.`);
        }
        }
    });
    return errors;
    };
    
    const onSubmit = async (data) => {
    const errors = validateDateRanges(data);

    if (errors.length > 0) {
        alert(errors.join("\n")); //  usar un modal más elegante si se tiene otro
        return;
    }

    const resumeSaved = await ResumesService.create(data);
    reset(resumeSaved);
    setIsEditing(false);
};

    const handleCancel = async () => {
        fetchCurrentResumeByUser();
        setIsEditing(false);
    };

    const renderResumeContent = () => {
        if (userClaim?.roles?.includes('RECRUITER')) {
            return (
                <div className="resume-container resume-container-recruiter">
                    <div className="resume-buttons">
                        <button className="go-back-button" onClick={() => navigate(-1)}>
                            ← Volver
                        </button>
                    </div>
                    <div className="resume-form">
                        <h2>Datos personales</h2>
                        <div className="data-form">
                            <div className="column">
                                <p><strong>Nombre:</strong> {resumeUser?.userInfo?.firstName}</p>
                                <p><strong>Apellido:</strong> {resumeUser?.userInfo?.lastName}</p>
                                <p><strong>Tipo de identificación:</strong> {resumeUser?.userInfo?.identificationType}</p>
                                <p><strong>Número de identificación:</strong> {resumeUser?.userInfo?.identificationNumber}</p>
                            </div>

                            <div className="column">
                                <p><strong>CUIT Nº:</strong> {resumeUser?.userInfo?.cuilCuit}</p>
                                <p><strong>Fecha de nacimiento:</strong> {resumeUser?.userInfo?.birthDate}</p>
                                <p><strong>Nacionalidad:</strong> {resumeUser?.userInfo?.nationality}</p>
                            </div>
                        </div>
                        <h2>Contacto</h2>
                        <div className="data-form">
                            <div className="column">
                                <p><strong>Teléfono:</strong> {resumeUser?.contact?.phone}</p>
                                <p><strong>Email:</strong> {resumeUser?.contact?.email}</p>
                                <p><strong>Linkedin:</strong> {resumeUser?.contact?.linkedin}</p>
                            </div>

                            <div className="column">
                                <p><strong>Dirección:</strong> {resumeUser?.contact?.address}</p>
                            </div>
                        </div>

                        <h2>Experiencia Laboral</h2>
                        {resumeUser?.experiences && resumeUser?.experiences.length > 0 ? (
                            resumeUser?.experiences?.map((item, index) => (
                                <div className="data-form" key={`experience-read-${index}`}>
                                    <div className="column">
                                        <p><strong>Nombre del puesto:</strong> {item?.jobTitle}</p>
                                        <p><strong>Empresa:</strong> {item?.companyName}</p>
                                        <p><strong>Fecha de Inicio - Fin:</strong> {item?.startDate} - {item?.endDate ? item?.endDate : 'Actualidad'}</p>
                                        <p><strong>Descripción:</strong> {item?.description}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="data-form">
                                <div className="column">
                                    <h3>[Sin contenido]</h3>
                                </div>
                            </div>

                        )}


                        <h2>Formación Académica</h2>
                        {resumeUser?.educations && resumeUser?.educations.length > 0 ? (resumeUser?.educations?.map((item, index) => (
                            <div className="data-form" key={`education-read-${index}`}>
                                <div className="column" >
                                    <p><strong>Institución:</strong> {item?.instituteName}</p>
                                    <p><strong>Nivel:</strong> {item?.degreeLevel}</p>
                                    <p><strong>Título:</strong> {item?.degree}</p>
                                    <p><strong>Campo de estudio:</strong> {item?.fieldOfStudy}</p>
                                </div>
                            </div>
                        ))) : (
                            <div className="data-form">
                                <div className="column">
                                    <h3>[Sin contenido]</h3>
                                </div>
                            </div>)
                        }

                        <h2>Certificados</h2>
                        {resumeUser?.certifications && resumeUser?.certifications.length > 0 ? (
                            resumeUser?.certifications?.map((item, index) => (
                                <div className="data-form" key={`certification-read-${index}`}>
                                    <div className="column">
                                        <p><strong>Nombre:</strong> {item?.name}</p>
                                        <p><strong>Fecha de emisión:</strong> {item?.issueDate}</p>
                                        <p><strong>Fecha de vencimiento:</strong> {item?.expirationDate}</p>
                                        <p><strong>Enlace:</strong> {item?.certificationUrl}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="data-form">
                                <div className="column">
                                    <h3>[Sin contenido]</h3>
                                </div>
                            </div>)}


                        <h2>Habilidades Técnicas</h2>
                        {resumeUser?.technicalSkills && resumeUser?.technicalSkills.length > 0 ? (
                            resumeUser?.technicalSkills?.map((item, index) => (
                                <div className="data-form" key={`technical-skill-read-${index}`}>
                                    <div className="column">
                                        <p><strong>Nombre:</strong> {item?.name}</p>
                                        <p><strong>Nivel:</strong> {item?.level}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="data-form">
                                <div className="column">
                                    <h3>[Sin contenido]</h3>
                                </div>
                            </div>)}

                        <h2>Idiomas</h2>
                        {resumeUser?.languages && resumeUser?.languages.length > 0 ? (
                            resumeUser?.languages?.map((item, index) => (
                                <div className="data-form" key={`language-read-${index}`}>
                                    <div className="column">
                                        <p><strong>Nombre:</strong> {item?.language}</p>
                                        <p><strong>Nivel:</strong> {item?.level}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="data-form">
                                <div className="column">
                                    <h3>[Sin contenido]</h3>
                                </div>
                            </div>)}
                    </div>
                </div>)


        }
        if (userClaim?.roles?.includes('CANDIDATE')) {
            return (<form onSubmit={handleSubmit(onSubmit)}>
                <div className="resume-container">
                    <div className="resume-header">
                        <h2>Gestión de Curriculum</h2>
                        <p>Agregue información a su curriculum.</p>
                    </div>

                    {userClaim?.roles?.includes('CANDIDATE') && (
                        isEditing ? (
                            <div className="resume-buttons">
                                <button type="button" className="resume-button" onClick={() => handleCancel()}>
                                    <ArrowBackIcon fontSize="large" />
                                    Cancelar
                                </button>
                                <button className="resume-button" type="submit">
                                    <SaveIcon fontSize="large" />
                                    Guardar
                                </button>
                            </div>
                        ) : (
                            <div className="resume-buttons">
                                <button type="button" className="resume-button" onClick={() => setIsEditing(true)}>
                                    <EditDocumentIcon fontSize="large" />
                                    Editar
                                </button>
                                {/* <button className="resume-button" type="submit">
                                    <UploadFileIcon fontSize="large" />
                                    Cargar CV
                                </button> */}
                            </div>
                        )
                    )}
                </div>


                {isEditing ? (
                    <div className="resume-form">
                        <h2>Datos personales</h2>
                        <div className="data-form">
                            <div className="column">
                                <p><strong>Nombre:</strong> {userClaim?.firstName}</p>
                                <p><strong>Apellido:</strong> {userClaim?.lastName}</p>
                                <p><strong>Tipo de identificación:</strong> {userClaim?.identificationType?.code}</p>
                                <p><strong>Número de identificación:</strong> {userClaim?.identificationNumber}</p>
                            </div>

                            <div className="column">
                                <p><strong>CUIT Nº:</strong> {userClaim?.cuilCuit}</p>
                                <p><strong>Fecha de nacimiento:</strong> {userClaim?.birthDate}</p>
                                <p><strong>Nacionalidad:</strong> {userClaim?.nationality?.description}</p>
                            </div>
                        </div>

                        <h2>Contacto</h2>
                        <div className="data-form">
                            <div className="column">
                                <p><strong>Teléfono:</strong> <input {...register('contact.phone')} /></p>
                                <p><strong>Email:</strong> <input {...register('contact.email')} /></p>
                                <p><strong>Linkedin:</strong> <input {...register('contact.linkedin')} /></p>
                            </div>

                            <div className="column">
                                <p><strong>Dirección:</strong> <input {...register('contact.address')} /></p>
                            </div>
                        </div>

                        <h2>Experiencia Laboral</h2>
                        {experienceFields.map((item, index) => (
                            <div className="data-form" key={item.id}>
                                <div className="column">
                                    <p><strong>Nombre del puesto:</strong> <input {...register(`experiences.${index}.jobTitle`)} /></p>
                                    <p><strong>Empresa:</strong> <input {...register(`experiences.${index}.companyName`)} /></p>
                                    <p><strong>Fecha de Inicio - Fin:</strong>
                                        <input {...register(`experiences.${index}.startDate`)} /> - <input {...register(`experiences.${index}.endDate`)} />
                                    </p>
                                    <p>
                                        <strong>Actualmente trabajando: </strong>
                                        <input
                                            type="checkbox"
                                            {...register(`experiences.${index}.isCurrentJob`)}
                                        />

                                    </p>
                                    <p><strong>Descripción:</strong></p>
                                    <textarea
                                        className="large-textarea"
                                        placeholder="Escriba aquí su experiencia laboral..."
                                        {...register(`experiences.${index}.description`)}
                                    ></textarea>
                                </div>
                                <div className="">
                                    <button type="button" className="delete-button-form" onClick={() => removeExperiences(index)}>Eliminar</button>
                                </div>

                            </div>
                        ))}

                        <button type="button" className="add-button-form" onClick={() => appendExperiences({ jobTitle: '', companyName: '', startDate: '', endDate: '', description: '' })}>
                            Añadir
                        </button>

                        <h2>Formación Académica</h2>
                        {
                            educationFields.map((item, index) => (

                                <div className="data-form" key={item.id}>
                                    <div className="column">
                                        <p><strong>Institución:</strong> <input {...register(`educations.${index}.instituteName`)} /></p>
                                        <p><strong>Nivel:</strong> <input {...register(`educations.${index}.degreeLevel`)} /></p>
                                        <p><strong>Título:</strong> <input {...register(`educations.${index}.degree`)} /></p>
                                        <p><strong>Campo de estudio:</strong> <input {...register(`educations.${index}.fieldOfStudy`)} /></p>
                                    </div>
                                    <div className="">
                                        <button type="button" className="delete-button-form" onClick={() => removeEducations(index)}>Eliminar</button>
                                    </div>

                                </div>

                            ))}
                        <button type="button" className="add-button-form" onClick={() => appendEducations({ instituteName: '', degreeLevel: '', degree: '', fieldOfStudy: '' })}>
                            Añadir
                        </button>

                        <h2>Certificados</h2>
                        {
                            certificationFields.map((item, index) => (
                                <div className="data-form" key={item.id}>
                                    <div className="column">
                                        <p><strong>Nombre:</strong> <input {...register(`certifications.${index}.name`)} /></p>
                                        <p><strong>Fecha de emisión:</strong> <input {...register(`certifications.${index}.issueDate`)} /></p>
                                        <p><strong>Fecha de vencimiento:</strong> <input {...register(`certifications.${index}.expirationDate`)} /></p>
                                        <p><strong>Enlace:</strong> <input {...register(`certifications.${index}.certificationUrl`)} /></p>
                                    </div>
                                    <div className="">
                                        <button type="button" className="delete-button-form" onClick={() => removeCertifications(index)}>Eliminar</button>
                                    </div>
                                </div>
                            ))
                        }
                        <button type="button" className="add-button-form" onClick={() => appendCertifications({ name: '', issueDate: '', expirationDate: '', certificationUrl: '' })}>
                            Añadir
                        </button>

                        <h2>Habilidades Técnicas</h2>
                        {
                            technicalSkillFields.map((item, index) => (
                                <div className="data-form" key={item.id}>
                                    <div className="column">
                                        <p><strong>Nombre:</strong> <input {...register(`technicalSkills.${index}.name`)} /></p>
                                        <p><strong>Nivel:</strong> <input {...register(`technicalSkills.${index}.level`)} /></p>
                                    </div>
                                    <div className="">
                                        <button type="button" className="delete-button-form" onClick={() => removeTechnicalSkills(index)}>Eliminar</button>
                                    </div>
                                </div>
                            ))
                        }
                        <button type="button" className="add-button-form" onClick={() => appendTechnicalSkills({ name: '', level: '' })}>
                            Añadir
                        </button>

                        <h2>Idiomas</h2>
                        {
                            languageFields.map((item, index) => (
                                <div className="data-form" key={item.id}>
                                    <div className="column">
                                        <p><strong>Nombre:</strong> <input {...register(`languages.${index}.language`)} /></p>
                                        <p><strong>Nivel:</strong> <input {...register(`languages.${index}.level`)} /></p>
                                    </div>
                                    <div className="">
                                        <button type="button" className="delete-button-form" onClick={() => removeLanguages(index)}>Eliminar</button>
                                    </div>
                                </div>

                            ))
                        }
                        <button type="button" className="add-button-form" onClick={() => appendLanguages({ language: '', level: '' })}>
                            Añadir
                        </button>
                    </div>

                ) : (
                    <div className="resume-form">
                        <h2>Datos personales</h2>
                        <div className="data-form">
                            <div className="column">
                                <p><strong>Nombre:</strong> {userClaim?.firstName}</p>
                                <p><strong>Apellido:</strong> {userClaim?.lastName}</p>
                                <p><strong>Tipo de identificación:</strong> {userClaim?.identificationType?.code}</p>
                                <p><strong>Número de identificación:</strong> {userClaim?.identificationNumber}</p>
                            </div>

                            <div className="column">
                                <p><strong>CUIT Nº:</strong> {userClaim?.cuilCuit}</p>
                                <p><strong>Fecha de nacimiento:</strong> {userClaim?.birthDate}</p>
                                <p><strong>Nacionalidad:</strong> {userClaim?.nationality?.description}</p>
                            </div>
                        </div>
                        <h2>Contacto</h2>
                        <div className="data-form">
                            <div className="column">
                                <p><strong>Teléfono:</strong> {contactOnlyRead?.phone}</p>
                                <p><strong>Email:</strong> {contactOnlyRead?.email}</p>
                                <p><strong>Linkedin:</strong> {contactOnlyRead?.linkedin}</p>
                            </div>

                            <div className="column">
                                <p><strong>Dirección:</strong> {contactOnlyRead?.address}</p>
                            </div>
                        </div>

                        <h2>Experiencia Laboral</h2>
                        {experiencesOnlyRead && experiencesOnlyRead.length > 0 ? (
                            experiencesOnlyRead.map((item, index) => (
                                <div className="data-form" key={`experience-read-${index}`}>
                                    <div className="column">
                                        <p><strong>Nombre del puesto:</strong> {item?.jobTitle}</p>
                                        <p><strong>Empresa:</strong> {item?.companyName}</p>
                                        <p><strong>Fecha de Inicio - Fin:</strong> {item?.startDate} - {item?.endDate ? item?.endDate : 'Actualidad'}</p>
                                        <p><strong>Descripción:</strong> {item?.description}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="data-form">
                                <div className="column">
                                    <h3>[Sin contenido]</h3>
                                </div>
                            </div>

                        )}


                        <h2>Formación Académica</h2>
                        {educationsOnlyRead && educationsOnlyRead.length > 0 ? (educationsOnlyRead?.map((item, index) => (
                            <div className="data-form" key={`education-read-${index}`}>
                                <div className="column" >
                                    <p><strong>Institución:</strong> {item?.instituteName}</p>
                                    <p><strong>Nivel:</strong> {item?.degreeLevel}</p>
                                    <p><strong>Título:</strong> {item?.degree}</p>
                                    <p><strong>Campo de estudio:</strong> {item?.fieldOfStudy}</p>
                                </div>
                            </div>
                        ))) : (
                            <div className="data-form">
                                <div className="column">
                                    <h3>[Sin contenido]</h3>
                                </div>
                            </div>)
                        }

                        <h2>Certificados</h2>
                        {certificationsOnlyRead && certificationsOnlyRead.length > 0 ? (
                            certificationsOnlyRead?.map((item, index) => (
                                <div className="data-form" key={`certification-read-${index}`}>
                                    <div className="column">
                                        <p><strong>Nombre:</strong> {item?.name}</p>
                                        <p><strong>Fecha de emisión:</strong> {item?.issueDate}</p>
                                        <p><strong>Fecha de vencimiento:</strong> {item?.expirationDate}</p>
                                        <p><strong>Enlace:</strong> {item?.certificationUrl}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="data-form">
                                <div className="column">
                                    <h3>[Sin contenido]</h3>
                                </div>
                            </div>)}


                        <h2>Habilidades Técnicas</h2>
                        {technicalSkillsOnlyRead && technicalSkillsOnlyRead.length > 0 ? (
                            technicalSkillsOnlyRead?.map((item, index) => (
                                <div className="data-form" key={`technical-skill-read-${index}`}>
                                    <div className="column">
                                        <p><strong>Nombre:</strong> {item?.name}</p>
                                        <p><strong>Nivel:</strong> {item?.level}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="data-form">
                                <div className="column">
                                    <h3>[Sin contenido]</h3>
                                </div>
                            </div>)}

                        <h2>Idiomas</h2>
                        {languagesOnlyRead && languagesOnlyRead.length > 0 ? (
                            languagesOnlyRead?.map((item, index) => (
                                <div className="data-form" key={`language-read-${index}`}>
                                    <div className="column">
                                        <p><strong>Nombre:</strong> {item?.language}</p>
                                        <p><strong>Nivel:</strong> {item?.level}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="data-form">
                                <div className="column">
                                    <h3>[Sin contenido]</h3>
                                </div>
                            </div>)}
                    </div>
                )}
            </form>);
        }
        console.log(userClaim)
    };

    useEffect(() => {
        fetchCurrentResumeByUser();
        setUserClaim(JwtService.getClaims());
    }, [resumeUserId]);

    return (
        <div className="home-container">
            <Header
                user={getUserClaim()}
            />

            <Navbar />

            <div className="app-container">
                {renderResumeContent()}
            </div>
        </div>
    );
}