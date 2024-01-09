import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
    const location = useLocation();

    const collapseNavbar = () => {
        document.getElementById("collapse-navbar").classList.toggle("hidden");
    }
    console.log(location.pathname);

    return (
        <nav className="bg-gray-800 shadow-lg">
            <div className="text-slate-50 flex flex-col items-center px-10 md:flex-row md:px-20 lg:px-32">
                <div className="w-full h-16 flex items-center md:w-auto">
                    <div className="text-2xl font-serif">Plagiarism Checker</div>
                    <FontAwesomeIcon icon={faBars} className="block md:hidden text-2xl text-slate-300 ms-auto" onClick={collapseNavbar} />
                </div>

                <div id="collapse-navbar" className="hidden md:flex flex-col space-y-3 pt-5 pb-5 gap-x-6 items-center justify-center text-center md:ms-10 md:flex-row md:space-y-0 md:pt-0 md:pb-0">
                    <div><Link to='/plagiarism_check' className={`navbar ${location.pathname == '/plagiarism_check' || location.pathname == '/' ? 'active' : ''}`}>Plagiarism Check</Link></div>
                    <div><Link to='/upload_reference' className={`navbar ${location.pathname == '/upload_reference' ? 'active' : ''}`}>Upload Reference</Link></div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;