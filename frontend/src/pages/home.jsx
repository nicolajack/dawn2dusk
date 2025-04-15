// import statements for app componenets and css
import Background from '../components/background/background';
import Logo from '../components/logo/logo';
import '../App.css';
import darkToggle from '../assets/darktoggle.png';
import React from 'react';

function Home(){
    function darkMode() {
        const element = document.body;
        element.classList.toggle("dark-mode");
    }
    return (
        <>
            <Background />
            <button id="darkMode"onClick={darkMode}><img width="30px" height="30px" src={darkToggle}/></button>
            <Logo />
            <h1 id="info">simply drag the pin to any location you’d like, and <br /> 
            click to see the sunrise and sunset time for that area!!</h1>
        </>
    );
}

export default Home;