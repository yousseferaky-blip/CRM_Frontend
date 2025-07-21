import { useTranslation } from 'react-i18next'
import  './Ready.css'

const Ready = () => {
  const {t} = useTranslation()
  return (
    <section className='ready'>
        <h2>{t("ready-t")}</h2>
        <p>{t("ready-dis")}.</p>
        <button>{t("getStarted-btn")}</button>
    </section>
  )
}

export default Ready