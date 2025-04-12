import './navbar.css';

function Navbar() {
    function toggleMenu() {
        const menu = document.querySelector('.drop-down');
        menu.classList.toggle('closed');
    }
    return (
        <nav>
        <ul class="drop-down closed">
            <li><a></a></li>
            <li><a></a></li>
        </ul>
    </nav>
    )
}

export default Navbar