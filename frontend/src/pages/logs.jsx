import './logs.css';
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

        const deleteLog = async (id) => {
            try {
                const response = await fetch(`http://localhost:4000/delete`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id}),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                setLogs((prevLogs) => prevLogs.filter((log) => log._id !== id));
            } catch (error) {
                console.error('Error deleting log:', error);
            }
        };
        
        function darkMode() {
            const element = document.body;
            element.classList.toggle("dark-mode");
        }


        


    return (
        <div className="logs">
            <img src={logo} alt="logo" className="logsLogo" />
            <div className="logsContainer">
                <ul>
                    {logs.map((log) => (
                        <li key={log._id}>
                            <div id="wrapper">
                                <div id="textbox">
                                    <p><strong>Location:</strong> {log.userLocation}</p>
                                    <p><strong>Similar Location:</strong> {log.similarPlace}</p>
                                    <p><strong>Timestamp:</strong> {log.timestamp}</p>
                                </div>
                                <button className="x" onClick={() => deleteLog(log._id)}>x</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Logs;