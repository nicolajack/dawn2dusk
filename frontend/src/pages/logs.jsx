import './logs.css';
import darkToggle from '../assets/darktoggle.png';
import React from 'react';
import logo from '../assets/d2dlogo.png';
import { useEffect, useState } from 'react';

function Logs(){
    const [logs, setLogs] = useState([]);
    
        useEffect(() => {
            const fetchLogs = async () => {
                try {
                    const response = await fetch('http://localhost:4000/logs');
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const data = await response.json();
                    setLogs(data);
                } catch (error) {
                    console.error('Error fetching logs:', error);
                }
            };
    
            fetchLogs();
        }, []);
        
        function darkMode() {
            const element = document.body;
            element.classList.toggle("dark-mode");
        }

    return (
        <div className="logs">
            <img src={logo} alt="logo" className="logsLogo" />
            <button id="darkMode"onClick={darkMode}><img width="30px" height="30px" src={darkToggle}/></button>
            <div className="logsContainer">
                <h1>logs!!</h1>
                <ul>
                    {logs.map((log, index) => (
                        <li key={index}>
                            <p><strong>Sunrise:</strong> {log.sunrise}</p>
                            <p><strong>Sunset:</strong> {log.sunset}</p>
                            <p><strong>Similar Location:</strong> {log.similarLocation}</p>
                            <p><strong>Timestamp:</strong> {log.timestamp}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Logs;