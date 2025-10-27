import React, {useState, useEffect} from "react";
import Button from "../../components/UI/Button";
import Header from "../../components/UI/Header";
import Navbar from "../../components/UI/Navbar";
import { JwtService } from "../../commons/utils/jwt.service";
import { UsersService } from "../../commons/services/users.service";
import "./Users_module.css";

export default function Users(){
    const [reclutadores, setReclutadores] = useState([]);
    const [postulantes, setPostulantes] = useState([]);

    const getUserClaim = () => {
        const claims = JwtService.getClaims();
        return {
            name: `${claims.firstName}, ${claims.lastName}`,
            role: `${claims.roles}`
        }
    };
    
    useEffect(() => {
    const fetchUsers = async () => {
        try {
            const allUsers = await UsersService.getAll();
            const recruiters = allUsers.filter((u) =>
            u.roles.includes("RECRUITER")
            );
            const candidates = allUsers.filter((u) =>
                u.roles.includes("CANDIDATE")
        );
            setReclutadores(recruiters);
            setPostulantes(candidates);
        } catch (error) {
            console.error("Error al cargar usuarios:", error);
        }
    };

        fetchUsers();
    }, []);

    return (
        <div className="home-container">
            <Header
                user={getUserClaim()}
            />
            <Navbar />
            <div className="usuarios-container">
            <h2>Panel de Usuarios</h2>
    
            {/* Sección de Reclutadores */}
            <section className="user-section">
                <h3>Reclutadores ({reclutadores.length})</h3>
                {reclutadores.length > 0 ? (
                <ul className="user-list">
                    {reclutadores.map((user) => (
                    <li key={user.id} className="user-item">
                        <div className="user-info">
                            <h4>{user.firstName} {user.lastName}</h4>
                            <p>{user.email}</p>
                        </div>
                        <Button variant="approve">
                            Ver Perfil
                        </Button>
                    </li>
                    ))}
                </ul>
                ) : (
                    <p className="empty">No hay reclutadores registrados.</p>
                )}
            </section>
    
            {/* Sección de Postulantes */}
            <section className="user-section">
                <h3>Postulantes ({postulantes.length})</h3>
                {postulantes.length > 0 ? (
                <ul className="user-list">
                    {postulantes.map((user) => (
                    <li key={user.id} className="user-item">
                        <div className="user-info">
                            <h4>{user.firstName} {user.lastName}</h4>
                            <p>{user.email}</p>
                        </div>
                        <Button variant="approve">
                            Ver Perfil
                        </Button>
                    </li>
                    ))}
                </ul>
                ) : (
                <p className="empty">No hay postulantes registrados.</p>
                )}
            </section>
            </div>
        </div>
    );
}