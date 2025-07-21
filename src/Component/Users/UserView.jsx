import { useTranslation } from "react-i18next";

const UserView = ({ user, onClose }) => {
  const {t} = useTranslation()
  
 return (
    
    
    <div className="view_card">
    <h3 className="view_title">{t("dashboard-table-ud")}</h3>
    <div className="view_row"><strong>{t("dashboard-table-n")}:</strong> <span>{user.name}</span></div>
    <div className="view_row"><strong>{t("dashboard-table-P")}:</strong> <span>{user.number}</span></div>
    <div className="view_row"><strong>{t("dashboard-table-e")}:</strong> <span>{user.email}</span></div>
    <div className="view_row"><strong>{t("dashboard-table-r")}:</strong> 
      <span className={`role_badge ${user.role.toLowerCase()}`}>{user.role}</span>
    </div>
    <button className="close_btn" onClick={onClose}>{t("close")} </button>
  </div>

);
}

export default UserView;
