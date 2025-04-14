import React, { useState } from 'react';
import './navbar.css';
import { Link } from 'react-router-dom';

function Navbar() {

    return (
        <div id="navbar">
            <Link to= "/">
                <button>
                    home
                </button>
            </Link>
            <Link to= "/logs">
                <button>
                    logs
                </button>
            </Link>
        </div>
    )
}

export default Navbar