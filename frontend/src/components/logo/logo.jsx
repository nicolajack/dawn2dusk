import { useEffect, useState } from 'react';
import logoImage from '../../assets/d2dlogo.png';
import './logo.css';

function Logo() {
    useEffect(() => {
        const updateLogoBackground = () => {
            // Get the current body background color
            const bodyBackgroundColor = getComputedStyle(document.body).backgroundColor;

            // Set the .logo background color to match the body
            const logoElement = document.querySelector('.logo');
            if (logoElement) {
                logoElement.style.backgroundColor = bodyBackgroundColor;
            }
        };

        // Initial update
        updateLogoBackground();

        // Create a MutationObserver to watch for changes to the body class
        const observer = new MutationObserver(() => {
            updateLogoBackground();
        });

        // Observe changes to the body element's class attribute
        observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

        // Cleanup the observer when the component unmounts
        return () => {
            observer.disconnect();
        };
    }, []);
    
    return (
        <div className="logo">
            <img src={logoImage} alt="logo" width="650vh" height="auto"/>
        </div>
    );   
}

export default Logo;