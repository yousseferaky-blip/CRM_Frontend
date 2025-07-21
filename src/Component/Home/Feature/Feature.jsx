import { ChartColumn, CircleCheckBig, TrendingUp, Users2Icon } from 'lucide-react'
import  './Feature.css'
import { useTranslation } from 'react-i18next'

const Feature = () => {
  const {t} = useTranslation()
  return (
    <section id='Features' className='feature'>
       <h2 className='home_title'>{t("features")}</h2>
       <p className='home_dis'>{t("feature-dis")}</p>
        <div className='feature_grid'>
          <div className='home_div'> 
            <div className='home_icon'>
              <Users2Icon  size={24}/>
            </div>
            <h3 className='home_h3'>{t("feature-card-t1")}</h3>
            <p className='home_p'>{t("feature-card-d1")}</p>
          </div>
          <div className='home_div'>
            <div className='home_icon'>
              <TrendingUp  size={24}/>
            </div>
            <h3 className='home_h3'>{t("feature-card-t2")}</h3>
            <p className='home_p'>{t("feature-card-d2")}</p>
          </div>
          <div className='home_div'>
            <div className='home_icon'>
              <CircleCheckBig  size={24}/>
            </div>
            <h3 className='home_h3'>{t("feature-card-t3")}</h3>
            <p className='home_p'>{t("feature-card-d3")}</p>
          </div>
          <div className='home_div'>
            <div className='home_icon'>
             <ChartColumn  size={24}/>
            </div>
            <h3 className='home_h3'>{t("feature-card-t4")}</h3>
            <p className='home_p'>{t("feature-card-d4")}</p>
          </div>
        </div>
    </section>
  )
}

export default Feature