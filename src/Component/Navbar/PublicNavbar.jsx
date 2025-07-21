import { AlignCenter, EqualNot, Moon, Sun, Users } from 'lucide-react'
import { useEffect } from 'react'
import './Navbar.css'
import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../Context/UserContext'
import i18n from '../../i18n'
import { useTranslation } from 'react-i18next'

const PublicNavbar = () => {
  const { t } = useTranslation();
  const [darkMode, setDarMode] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [selectedLang, setSelectedLang] = useState("en") 
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const switchDarkMode = () => {
    if (!darkMode) {
      document.body.classList.add("dark")
    } else {
      document.body.classList.remove("dark")
    }
    setDarMode(!darkMode)
  }

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setSelectedLang(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang)

    if (lang === "ar") {
      document.documentElement.dir = "rtl";
    } else {
      document.documentElement.dir = "ltr";
    }

  };

   useEffect(() => {
    const lang = localStorage.getItem("lang") || "en";
    setSelectedLang(lang);
    i18n.changeLanguage(lang);
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, []);

  return (
    <nav className='nav'>
      <div className='nav_container'>
        <div className='logo'>
          <Users size={36} className='logo_icon' />
          <span>crm</span>
        </div>

        <div className='nav_content'>
          <div className={`nav_links ${isMenuOpen ? "active" : ""}`}>
            <div className="nav_link">
              <a href='#Features'>{t("features")}</a>
              <a href='#Testimonials'>{t("testimonials")}</a>
              <a href='#Why-Us'>{t("why-us")}</a>
            </div>


            <select
              className='lang-dropdown'
              value={selectedLang}
              onChange={handleLanguageChange}
            >
              <option value="ar">العربية</option>
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </select>

            {user && (
              <button onClick={() => navigate("/dashboard")} className='lang'>
                 {t("dashboard")}
              </button>
            )}

            {user ? (
              <Link onClick={logout} to={"/"}>{t("logout")}</Link>
            ) : (
              <Link to={"/login"} className='login'>{t("login")}</Link>
            )}
          </div>
        </div>

        <div className='nav_icons'>
          <div onClick={() => setIsMenuOpen(!isMenuOpen)} className='tab'>
            {isMenuOpen ? <EqualNot size={24} /> : <AlignCenter size={24} />}
          </div>
          <button onClick={switchDarkMode} className='dark'>
            {darkMode ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>
      </div>
    </nav>
  )
}

export default PublicNavbar
