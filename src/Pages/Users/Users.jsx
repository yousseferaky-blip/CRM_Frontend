import { toast } from 'react-toastify'
import { useEffect, useState } from 'react'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'
import './Users.css'

import UsersTable from '../../Component/Users/UsersTable'
import UserView from '../../Component/Users/UserView'
import UserEdit from '../../Component/Users/UsersEdit'
import { useTranslation } from 'react-i18next'

const Users = () => {
  const [users, setUsers] = useState([]);
  const [view, setView] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const {t} = useTranslation()
  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem("crm_users")) || [];
      if (Array.isArray(data)) setUsers(data);
    } catch (err) {
      console.error("Invalid JSON in localStorage");
      setUsers([]);
    }
  }, []);

  const handleDelete = (id) => {
    confirmAlert({
      title: 'Confirm to delete',
      message: 'Are you sure you want to delete this user?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            const updated = users.filter((u) => u.id !== id);
            setUsers(updated);
            localStorage.setItem("crm_users", JSON.stringify(updated));
          }
        },
        { label: 'No' }
      ]
    });
  };

  const handleSaveEdit = () => {
    const updated = users.map((u) => u.id === editUser.id ? editUser : u);
    setUsers(updated);
    localStorage.setItem("crm_users", JSON.stringify(updated));
    toast.success("User updated");
    setEditUser(null);
  };

  return (
    <div className="users_container">
      <h2 className="users_title">{t("ul")}</h2>

      <UsersTable 
        users={users} 
        onView={setView} 
        onEdit={setEditUser} 
        onDelete={handleDelete} 
      />

      {view && <UserView user={view} onClose={() => setView(null)} />}

      {editUser && (
        <UserEdit
          user={editUser} 
          onChange={setEditUser}
          onSave={handleSaveEdit}
          onCancel={() => setEditUser(null)}
        />
      )}

    </div>
  );
};

export default Users;
