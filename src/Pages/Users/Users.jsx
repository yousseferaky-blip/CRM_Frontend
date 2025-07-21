import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import './Users.css';

import UsersTable from '../../Component/Users/UsersTable';
import UserView from '../../Component/Users/UserView';
import UserEdit from '../../Component/Users/UsersEdit';
import { useTranslation } from 'react-i18next';

import { db } from '../../firebase'; // مسار firebase.js
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [view, setView] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const { t } = useTranslation();

  // جلب البيانات من Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Error loading users ❌");
      }
    };
    fetchUsers();
  }, []);

  // حذف مستخدم
  const handleDelete = (id) => {
    confirmAlert({
      title: 'Confirm to delete',
      message: 'Are you sure you want to delete this user?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              await deleteDoc(doc(db, "users", id));
              setUsers(users.filter(user => user.id !== id));
              toast.success("User deleted successfully");
            } catch (error) {
              console.error("Error deleting user:", error);
              toast.error("Error deleting user");
            }
          }
        },
        { label: 'No' }
      ]
    });
  };

  // تعديل مستخدم
  const handleSaveEdit = async () => {
    try {
      const userRef = doc(db, "users", editUser.id);
      const { id, ...userData } = editUser;
      await updateDoc(userRef, userData);

      setUsers(users.map((u) => u.id === editUser.id ? editUser : u));
      toast.success("User updated");
      setEditUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
    }
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
