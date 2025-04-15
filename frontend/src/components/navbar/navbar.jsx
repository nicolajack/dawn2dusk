import React, { useState } from 'react';
import './navbar.css';
import { Link } from 'react-router-dom';
import homeIcon from '../../assets/home.png';
import logsIcon from '../../assets/logs.png';

function Navbar() {
    
    return (
        <div id="navbar">
            <Link to= "/">
                <button>
                    <img src={homeIcon} alt="home" width="25px" height="25px"/>
                </button>
            </Link>
            <Link to= "/logs">
                <button>
                    <img src={logsIcon} alt="logs" width="25px" height="25px"/>
                </button>
            </Link>
        </div>
    )
}

export default Navbar