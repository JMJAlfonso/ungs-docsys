import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import { useState, useEffect } from 'react';
import { JwtService } from '../../commons/utils/jwt.service';

export default function Navbar() {
    const navigate = useNavigate();
    const [userClaim, setUserClaim] = useState({});

    useEffect(() => {
        setUserClaim(JwtService.getClaims());
    }, []);

    const renderLinks = () => {
        if (userClaim?.roles?.includes('CANDIDATE')) {
            return (
                <>
                    <span onClick={() => navigate('/jobAppList')}>Postulaciones</span>
                    <span onClick={() => navigate('/resume')}>Mi Curriculum</span>
                </>
            );
        }
        if (userClaim?.roles?.includes('RECRUITER')) {
            return (
                <>
                    <span onClick={() => navigate('/jobAppList')}>Postulaciones</span>
                </>
            );
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-links">
                {renderLinks()}
            </div>
        </nav>
    );
}