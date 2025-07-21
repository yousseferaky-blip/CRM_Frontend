import { useTranslation } from "react-i18next";


const UserEdit = ({ user, onChange, onSave, onCancel }) => {
  const {t} = useTranslation()
 return (
    
    <div className="view_card">
    <h3 className="view_title">{t("edit-u")}</h3>
    <div className="view_row">
      <strong>{t("dashboard-table-n")}:</strong>
      <input type="text" value={user.name} onChange={(e) => onChange({ ...user, name: e.target.value })} />
    </div>
    <div className="view_row">
      <strong>{t("dashboard-table-P")}:</strong>
      <input type="text" value={user.number} onChange={(e) => onChange({ ...user, number: e.target.value })} />
    </div>
    <div className="view_row">
      <strong>{t("dashboard-table-e")}:</strong>
      <input type="email" value={user.email} onChange={(e) => onChange({ ...user, email: e.target.value })} />
    </div>
    <div className="view_row">
      <strong>{t("dashboard-table-r")}:</strong>
      <select value={user.role} onChange={(e) => onChange({ ...user, role: e.target.value })}>
        <option value="admin">{t("ad")}</option>
        <option value="employee">{t("employee")}</option>
        <option value="client">{t("client")}</option>
      </select>
    </div>
    <button className="btn btn_save" onClick={onSave}>{t("save")}</button>
    <button className="close_btn" onClick={onCancel}>{t("close")}</button>
  </div>
  
);
}

export default UserEdit;
