import { useTranslation } from "react-i18next";

const UsersTable = ({ users, onView, onEdit, onDelete }) => {
      const {t} = useTranslation()
  return (
    <div className="table_wrapper">
      <table className="users_table">
        <thead>
          <tr>
            <th>{t("dashboard-table-n")}</th>
            <th>{t("dashboard-table-P")}</th>
            <th>{t("dashboard-table-e")}</th>
            <th>{t("dashboard-table-r")}</th>
            <th>{t("dashboard-table-a")}</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user, index) => (
              <tr key={index}>
                <td>{user.name}</td>
                <td>{user.number}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role_badge ${user.role}`}>
                    {user.role}
                  </span>
                </td>
                <td className="actions_cell">
                  <button className="btn btn_view" onClick={() => onView(user)}>View</button>
                  {user.role !== "admin" && (
                    <>
                      <button className="btn btn_edit" onClick={() => onEdit(user)}>Edit</button>
                      <button className="btn btn_delete" onClick={() => onDelete(user.id)}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="5" className="no_data">No users found</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
