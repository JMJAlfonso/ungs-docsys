import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import { useState, useEffect } from 'react';
import { JwtService } from '../../commons/utils/jwt.service';

export default function Navbar() {
    const location = useLocation();
    const [userClaim, setUserClaim] = useState({});

    useEffect(() => {
        setUserClaim(JwtService.getClaims());
    }, []);

    const renderLinks = () => {
        if (userClaim?.roles?.includes('CANDIDATE')) {
            return (
                <ul className="navbar-list">
                    <li className={`navbar-item ${location.pathname === "/jobAppList" ? "active" : ""}`}>
                        <Link to="/jobAppList">
                            <span>Postulaciones</span>
                        </Link>
                    </li>
                    <li className={`navbar-item ${location.pathname === "/resume" ? "active" : ""}`}>
                        <Link to="/resume">
                            <span>Mi Curriculum</span>
                        </Link>
                    </li>
                </ul>
            );
        }
        if (userClaim?.roles?.includes('RECRUITER')) {
            return (
                <ul className="navbar-list">
                    <li className={`navbar-item ${location.pathname === "/jobAppList" ? "active" : ""}`}>
                        <Link to="/jobAppList">
                            <span>Postulaciones</span>
                        </Link>
                    </li>
                </ul>
            );
        }
        if(userClaim?.roles?.includes('ADMIN')) {
            return (
                <ul className="navbar-list">
                    <li className={`navbar-item ${location.pathname === "/jobAppList" ? "active" : ""}`}>
                        <Link to="/jobAppList">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-briefcase-2"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 9a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9z" /><path d="M8 7v-2a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v2" /></svg>
                            <span>Postulaciones</span>
                        </Link>
                    </li>
                    <li className={`navbar-item ${location.pathname === "/users" ? "active" : ""}`}>
                        <Link to="/users">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-users"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" /><path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /><path d="M21 21v-2a4 4 0 0 0 -3 -3.85" /></svg>
                            <span>Usuarios</span>
                        </Link>
                    </li>
                    <li className={`navbar-item ${location.pathname === "/reports" ? "active" : ""}`}>
                        <Link to="/reports">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-chart-bar"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 13a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" /><path d="M15 9a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" /><path d="M9 5a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" /><path d="M4 20h14" /></svg>
                            <span>Reportes</span>
                        </Link>
                    </li>
                </ul>
            )
        };
    };

    return (
        <nav className="navbar">
            {renderLinks()}
        </nav>
    );
}