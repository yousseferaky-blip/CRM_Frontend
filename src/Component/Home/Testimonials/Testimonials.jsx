import { Star } from 'lucide-react'
import  './Testimonials.css'
import img from "../../../assets/testimonial.jpg"
import { useTranslation } from 'react-i18next'
const Testimonials = () => {
    const {t} = useTranslation()
  return (
    <section id='Testimonials' className='testimonials'>
        <h2 className='home_title'>{t("testimonials")}</h2>
        <p className='home_dis'>{t("testimonial-dis")}</p>
        <div className='testimonials_grid'>
            <div className='testimonials_card'>
                <div className='testimonials_stars'>
                    <Star  size={18}/><Star size={18}/><Star size={18}/><Star size={18}/><Star size={18}/>
                </div>
                <p>"{t("testimonial-card-t1")}."</p>
                <div className='testimonials_content'>
                    <img loading="lazy" alt='Sarah Johnson' src={img}/>
                    <div >
                        <p className='testimonials_name'>{t("testimonial-card-n1")}</p>
                        <p>{t("testimonial-card-j1")}</p>
                    </div>
                </div>
            </div>
            <div className='testimonials_card'>
                <div className='testimonials_stars'>
                    <Star size={18}/><Star size={18}/><Star size={18}/><Star size={18}/><Star size={18}/>
                </div>
                <p>"{t("testimonial-card-t2")}."</p>
                <div className='testimonials_content'>
                    <img loading="lazy" alt='Michael Chen' src={img}/>
                    <div >
                        <p className='testimonials_name'>{t("testimonial-card-n2")}</p>
                        <p>{t("testimonial-card-j2")}</p>
                    </div>
                </div>
            </div>
            <div className='testimonials_card'>
                <div className='testimonials_stars'>
                    <Star size={18}/><Star size={18}/><Star size={18}/><Star size={18}/><Star size={18}/>
                </div>
                <p>"{t("testimonial-card-t3")}."</p>
                <div className='testimonials_content'>
                    <img loading="lazy" alt='Emily Rodriguez' src={img}/>
                    <div >
                        <p className='testimonials_name'>{t("testimonial-card-n3")}</p>
                        <p>{t("testimonial-card-j3")}</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
  )
}

export default Testimonials