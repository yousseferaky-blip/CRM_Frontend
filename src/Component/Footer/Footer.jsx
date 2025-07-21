import { Users } from 'lucide-react'
import './Footer.css'
import { useTranslation } from 'react-i18next'

const Footer = () => {
  const {t} = useTranslation()
  return (
    <footer>
      <div className='footer_cart'>
        <div className='logo'>
            <Users size={36} className='logo_icon'/>
            <span>crm</span>
        </div>
        <p>{t("footer-dis")}.</p>
      </div>
      <div className='footer_cart'>
        <h3>{t("footer-t1")}</h3>
        <ul>
          <li>{t("footer-td1")}</li>
          <li>{t("footer-td2")}</li>
          <li>{t("footer-td3")}</li>
        </ul>
      </div>
      <div className='footer_cart'>
        <h3>{t("footer-t2")}</h3>
        <ul>
          <li>{t("footer-td4")}</li>
          <li>{t("footer-td5")}</li>
          <li>{t("footer-td6")}</li>
        </ul>
      </div>
      <div className='footer_cart'>
        <h3>{t("footer-t3")}</h3>
        <ul>
          <li>{t("footer-td7")}</li>
          <li>{t("footer-td8")}</li>
          <li>{t("footer-td9")}</li>
        </ul>
      </div>

    </footer>
  )
}

export default Footer