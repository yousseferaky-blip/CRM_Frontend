import { Eye, EyeOff, MoveLeft } from 'lucide-react'
import './Login.css'
import { Link, useNavigate } from 'react-router-dom'
import { useContext, useState } from 'react';
import { AuthContext } from '../../Context/UserContext';
import { toast } from 'react-toastify';
import bcrypt from 'bcryptjs'
import { useTranslation } from 'react-i18next';

const Login = () => {
    const [active, setActive] = useState(false)
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useContext(AuthContext); 
    const {t} = useTranslation()
    const navigate = useNavigate(); 

    const handleLogin = (e)=>{
        e.preventDefault()

        const users = JSON.parse(localStorage.getItem("crm_users")) || []
        const found = users.find((u)=> u.email === email && bcrypt.compareSync(password,u.password))
        
        if(found){
            login(found)
            navigate("/dashboard")
            toast.success("Login Successful 🚀")
        }else{
            toast.error("Invalid email or password ❌");
            setEmail("")
            setPassword("")
        }
    }

  return (
    <section className='login_section'>
      <div className="login_header">
        <Link to={"/"} className="back_link">
          <MoveLeft size={18} /> {t("back")}
        </Link>
      </div>

      <h3 className='login_title'>{t("welcome_back")} </h3>
      <p className='login_subtitle'>{t("choose_role")} </p>
      <span className="tryS">{t("try")}</span>
      <p className='tryE'>admin@gmail.com</p>
      <p className='tryP'>123456789 </p>

      <form className='login_form'>
        <div className='form_group'>
          <label>{t("email_label")}</label>
          <input 
          type='email' 
          placeholder='Enter Your Email' 
          required 
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          />
        </div>
        <div className='form_group'>
          <label>{t("password_label")}</label>
          <input 
          type={`${active ? "text" : "password"}`} 
          placeholder='Enter Your Password' 
          required 
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          />
           <button type="button" onClick={()=>setActive(!active)}>
                {active ? <Eye size={16} /> : <EyeOff size={16} /> }
            </button>
        </div>
        <button type="button" onClick={handleLogin} className='handle_login'>{t("login")}</button>
      </form>

      <p className='login_footer'>
        {t("no_account")} <Link to={"/register"}>{t("register")}</Link>
      </p>
    </section>
  )
}

export default Login
