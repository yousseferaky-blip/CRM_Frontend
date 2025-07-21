import { useState, useEffect } from "react";
import "./Tasks.css";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import { Eye, Pen, Trash, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [client, setClient] = useState([]);
  const [employee, setEmployee] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editTask, setEditTask] = useState(null);
  const [form, setForm] = useState({
    title: "",
    dis: "",
    clientId: "",
    employeeId: "",
    priority: "medium",
    status: "in-progress",
    date: "",
  });
  const { t } = useTranslation();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [taskSnap, userSnap] = await Promise.all([
        getDocs(collection(db, "tasks")),
        getDocs(collection(db, "users")),
      ]);
      const usersData = userSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setClient(usersData.filter((u) => u.role === "client"));
      setEmployee(usersData.filter((u) => u.role === "employee"));
      setTasks(taskSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error(err);
      toast.error("فشل في تحميل البيانات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const AddNewTask = async (e) => {
    e.preventDefault();
    const { title, dis, clientId, employeeId, priority, status, date } = form;
    if (!title || !dis || !clientId || !employeeId || !date) {
      return toast.error("يرجى ملء جميع الحقول");
    }
    try {
      await addDoc(collection(db, "tasks"), form);
      toast.success("تم إضافة المهمة");
      setShowModal(false);
      setForm({ title: "", dis: "", clientId: "", employeeId: "", priority: "medium", status: "in-progress", date: "" });
      fetchData();
    } catch {
      toast.error("حدث خطأ أثناء الإضافة");
    }
  };

  const handleDelete = (id) => {
    confirmAlert({
      title: "تأكيد الحذف",
      message: "هل أنت متأكد؟",
      buttons: [
        {
          label: "نعم",
          onClick: async () => {
            try {
              await deleteDoc(doc(db, "tasks", id));
              toast.success("تم الحذف");
              fetchData();
            } catch {
              toast.error("فشل في الحذف");
            }
          },
        },
        { label: "إلغاء" },
      ],
    });
  };

  const updateTask = async () => {
    try {
      await updateDoc(doc(db, "tasks", editTask.id), editTask);
      toast.success("تم تعديل المهمة");
      setEditTask(null);
      fetchData();
    } catch {
      toast.error("فشل في التحديث");
    }
  };

  if (loading) return <p><Loader2 /></p>;

  return (
    <div className="deals-page">
      <div className="deals-header">
        <h2>{t("dashboard-tasks")}</h2>
        <button onClick={() => setShowModal(true)} className="add-btn">+ {t("dashboard-add")}</button>
      </div>
      
      <div className="table_wrapper">
            <table className="deals-table">
              <thead>
                <tr>
                  <th>{t("dashboard-table-t")}</th>
                  <th>{t("dashboard-table-d")}</th>
                  <th>{t("dashboard-employee")}</th>
                  <th>{t("dashboard-client")}</th>
                  <th>{t("dashboard-table-s")}</th>
                  <th>{t("dashboard-table-p")}</th>
                  <th>{t("dashboard-table-S")}</th>
                  <th>{t("dashboard-table-a")}</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => {
                  const cd = client.find((u) => u.id === task.clientId);
                  const ed = employee.find((u) => u.id === task.employeeId);
                  return (
                    <tr key={task.id}>
                      <td>{task.title}</td>
                      <td>{task.dis}</td>
                      <td>{ed?.name || "غير معروف"}</td>
                      <td>{cd?.name || "غير معروف"}</td>
                      <td>{task.date}</td>
                      <td>{task.priority}</td>
                      <td>{task.status}</td>
                      <td>
                        <button onClick={() => handleDelete(task.id)} className="btn btn-delete"><Trash size={14}/></button>
                        <button onClick={() => setSelectedTask(task)} className="btn btn-view"><Eye size={14}/></button>
                        <button onClick={() => setEditTask(task)} className="btn btn-edit"><Pen size={14}/></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
      </div>
      
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{t("dashboard-add")}</h3>
            <form onSubmit={AddNewTask}>
              <input type="text" placeholder="عنوان" value={form.title} onChange={(e)=>setForm({...form, title:e.target.value})}/>
              <input type="text" placeholder="الوصف" value={form.dis} onChange={(e)=>setForm({...form, dis:e.target.value})}/>
              <select value={form.clientId} onChange={e=>setForm({...form, clientId:e.target.value})}>
                <option value="">اختر عميل</option>
                {client.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <select value={form.employeeId} onChange={e=>setForm({...form, employeeId:e.target.value})}>
                <option value="">اختر موظف</option>
                {employee.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
              <select value={form.priority} onChange={e=>setForm({...form, priority:e.target.value})}>
                <option value="high">high</option>
                <option value="medium">medium</option>
                <option value="low">low</option>
              </select>
              <select value={form.status} onChange={e=>setForm({...form, status:e.target.value})}>
                <option value="in-progress">in-progress</option>
                <option value="won">won</option>
                <option value="lost">lost</option>
              </select>
              <input type="date" value={form.date} onChange={e=>setForm({...form, date:e.target.value})}/>
              <div className="modal-actions">
                <button type="submit">{t("add-t")}</button>
                <button type="button" onClick={() => setShowModal(false)}>{t("close")}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedTask && (
        <div className="view-card">
          <h3>{t("td")}</h3>
          <p><strong>{t("dashboard-table-t")}:</strong> {selectedTask.title}</p>
          <p><strong>{t("dashboard-table-d")}:</strong> {selectedTask.dis}</p>
          <p><strong>{t("dashboard-employee")}:</strong> {employee.find(u=>u.id===selectedTask.employeeId)?.name}</p>
          <p><strong>{t("dashboard-client")}:</strong> {client.find(u=>u.id===selectedTask.clientId)?.name}</p>
          <p><strong>{t("dashboard-table-p")}:</strong> {selectedTask.priority}</p>
          <p><strong>{t("dashboard-table-S")}:</strong> {selectedTask.status}</p>
          <p><strong>{t("dashboard-table-s")}:</strong> {selectedTask.date}</p>
          <div className="modal-actions">
            <button type="button" title="cancel" onClick={()=>setSelectedTask(null)}>{t("close")}</button>
          </div>
        </div>
      )}

      {editTask && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{t("et")}</h3>
            <form onSubmit={(e)=>{ e.preventDefault(); updateTask(); }}>
              <input type="text" value={editTask.title} onChange={e=>setEditTask({...editTask, title:e.target.value})}/>
              <input type="text" value={editTask.dis} onChange={e=>setEditTask({...editTask, dis:e.target.value})}/>
              <select value={editTask.clientId} onChange={e=>setEditTask({...editTask, clientId:e.target.value})}>
                <option value="">اختر عميل</option>
                {client.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <select value={editTask.employeeId} onChange={e=>setEditTask({...editTask, employeeId:e.target.value})}>
                <option value="">اختر موظف</option>
                {employee.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
              <select value={editTask.priority} onChange={e=>setEditTask({...editTask, priority:e.target.value})}>
                <option value="high">high</option>
                <option value="medium">medium</option>
                <option value="low">low</option>
              </select>
              <select value={editTask.status} onChange={e=>setEditTask({...editTask, status:e.target.value})}>
                <option value="in-progress">in-progress</option>
                <option value="won">won</option>
                <option value="lost">lost</option>
              </select>
              <input type="date" value={editTask.date} onChange={e=>setEditTask({...editTask, date:e.target.value})}/>
              <div className="modal-actions">
                <button type="submit">{t("save")}</button>
                <button type="button" onClick={()=>setEditTask(null)}>{t("close")}</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Tasks;
