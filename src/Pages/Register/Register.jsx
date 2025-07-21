import { Eye, EyeClosed, EyeIcon, EyeOff, MoveLeft } from 'lucide-react'
import './Register.css'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import bcrypt from 'bcryptjs'
import { useTranslation } from 'react-i18next'
import { db } from "../../firebase"; 
import {
  collection,
  query,
  where,
  getDocs,
  addDoc
} from "firebase/firestore";
const Register = () => {
    const [active, setActive] = useState(false)
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [number, setNumber] = useState("");
    const {t} = useTranslation()
    const navigate = useNavigate()

    const handleRegister = async (e) => {
    e.preventDefault();

    // التحقق من رقم الهاتف
    if (number.length !== 11) {
      toast.error("رقم الهاتف غير صحيح، يجب أن يتكون من 11 رقمًا");
      return;
    }

    // التحقق من الإيميل
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // التحقق من الباسورد
    if (password.length < 7) {
      toast.warning("Password must be at least 7 numbers");
      return;
    }

    // التحقق من الاسم
    if (name.length < 3) {
      toast.warning("Name must be at least 3 characters");
      return;
    }

    try {
      const usersRef = collection(db, "users");

      // التحقق من وجود الإيميل بالفعل
      const q = query(usersRef, where("email", "==", email));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        toast.error("Email Already Exist");
        return;
      }

      // تشفير الباسورد
      const hashedPassword = bcrypt.hashSync(password, 10);

      // إنشاء المستخدم
      const newUser = {
        name,
        email,
        number,
        password: hashedPassword,
        role: "client",
        createdAt: new Date(),
      };

      await addDoc(usersRef, newUser);

      toast.success("Create Success");
      navigate("/login");
    } catch (error) {
      console.error("Registration Error:", error);
      toast.error("حدث خطأ أثناء التسجيل");
    }
  };


  return (
    <section className='register'>
      <div className="register_header">
        <Link to={"/"} className="back_link">
          <MoveLeft size={18} /> {t("back")}
        </Link>
      </div>

      <h3 className='register_title'>{t("register_title")} </h3>
      <p className='register_subtitle'>{t("register_subtitle")}</p>

      <form className='register_form'>
        <div className='form_group'>
          <label>{t("name_label")}</label>
          <input 
          type='text' 
          placeholder='Enter your full name' 
          required 
          value={name}
          onChange={(e)=>setName(e.target.value)}
          />
        </div>
        <div className='form_group'>
          <label>{t("phone_label")}</label>
          <input 
          type='number' 
          placeholder='Enter your Number Phone' 
          required 
          value={number}
          onChange={(e)=>setNumber(e.target.value)}
          />
        </div>

        <div className='form_group'>
          <label>{t("email_label")}</label>
          <input type='email' 
          placeholder='Enter your email' 
          required 
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          />
        </div>

        <div className='form_group'>
          <label>{t("password_label")}</label>
          <input 
          type={`${active ? "text" : "password"}`}
          placeholder='Create a password' 
          required 
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          />
          <button type="button" onClick={()=>setActive(!active)}>
            {active ? <Eye size={16} /> : <EyeOff size={16} /> }
          </button>
        </div>

        <button type="button" onClick={handleRegister} className='handle_register'>{t("register_btn")}</button>
      </form>

      <p className='register_footer'>
        {t("already_account")}? <Link to="/login">{t("login")}</Link>
      </p>
    </section>
  )
}

export default Register
