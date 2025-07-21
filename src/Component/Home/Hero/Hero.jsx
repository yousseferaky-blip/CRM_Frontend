import { ArrowRight } from 'lucide-react'
import './Hero.css'
import { Link } from 'react-router-dom'
import img from '../../../assets/crm-hero.jpg'
import { useTranslation } from 'react-i18next'

const Hero = () => {
  const {t} = useTranslation()
  return (
    <section className='hero'>
        <div>✨ {t("hero-p")}</div>
        <h1>{t("hero-t")}</h1>
        <p>{t("hero-dis")}.</p>
        <Link className='link'>
            {t("getStarted-btn")} <ArrowRight />
        </Link>
        <div className='img'>
            <img src={img}/>
        </div>
    </section>
  )
}

export default Hero