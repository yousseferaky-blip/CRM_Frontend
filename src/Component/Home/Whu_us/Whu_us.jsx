import { Shield, User2, Users, ZapIcon} from 'lucide-react'
import  './Whu_us.css'
import { useTranslation } from 'react-i18next'

const Whu_us = () => {
  const {t} = useTranslation()
  return (
    <section id='Why-Us' className='whu_us'>
        <h2 className='home_title'>{t("why-us")}</h2>
        <p className='home_dis'>{t("why-dis")}</p>
        <div className='why_grid'>
          <div className='home_div'>
            <div className='home_icon'>
              <Shield  size={24}/>
            </div>
            <h3 className='home_h3'>{t("why-dis-card-t1")}</h3>
            <p className='home_p'>{t("why-dis-card-d1")}</p>
          </div>
          <div className='home_div'>
            <div className='home_icon'>
              <ZapIcon  size={24}/>
            </div>
            <h3 className='home_h3'>{t("why-dis-card-t2")}</h3>
            <p className='home_p'>{t("why-dis-card-d2")}</p>
          </div>
          <div className='home_div'>
            <div className='home_icon'>
              <Users   size={24}/>
            </div>
            <h3 className='home_h3'>{t("why-dis-card-t3")}</h3>
            <p className='home_p'>{t("why-dis-card-d3")}</p>
          </div>
        </div>
    </section>
  )
}

export default Whu_us