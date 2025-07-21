import { Eye, Pen, Trash } from 'lucide-react';
import  './Tasks.css'
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import { useTranslation } from 'react-i18next';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [dis, setDis] = useState("");
  const [clientName, setClientName] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [priority, setPriority] = useState("medium");
  const [status, setStatus] = useState("in-progress");
  const [date, setDate] = useState("in-progress");
  const [selectedTask, setSelectedTask] = useState(null);
  const [editTask, setEditTask] = useState(null);
  const {t} = useTranslation()
  const users = JSON.parse(localStorage.getItem("crm_users")) || []
  const client = users.filter((u)=> u.role === "client" )
  const employee = users.filter((u)=> u.role === "employee" )

  useEffect(()=>{
    const GetTask = JSON.parse(localStorage.getItem("tasks")) || []
    setTasks(GetTask)
    setLoading(false);
  },[])

  const AddNewTask = (e)=>{
    e.preventDefault()

    if (!title.trim()) {
      toast.error("يرجى إدخال عنوان التاسك");
      return;
    }
    if (!clientName) {
      toast.error("يرجى اختيار العميل");
      return;
    }
    if (!employeeName) {
      toast.error("يرجى اختيار الموظف");
      return;
    }
    if (!dis ) {
      toast.error("يرجى إدخال وصف التاسك   ");
      return;
    }
    const newTask = {
      id: Date.now(),
      title,
      dis,
      clientId:clientName,
      employeeId:employeeName,
      priority,
      status,
      date,
    }

    const updateTask = [...tasks,newTask]
    localStorage.setItem("tasks",JSON.stringify(updateTask))
    setTasks(updateTask)
    setTitle("")
    setDis("")
    setClientName("")
    setEmployeeName("")
    setPriority("medium")
    setStatus("in-progress")

    setShowModal(false)
    toast.success("Added Tasks")
  }

 const handleDelete = (id) => {
   confirmAlert({
     title: "تأكيد الحذف",
     message: "هل أنت متأكد أنك تريد حذف هذه الصفقة؟",
     buttons: [
       {
         label: "نعم، احذف",
         onClick: () => {
           const filteredtask = tasks.filter((deal) => deal.id !== id);
           setTasks(filteredtask);
           localStorage.setItem("tasks", JSON.stringify(filteredtask));
           toast.success("تم حذف التاسك بنجاح");
         },
       },
       {
         label: "إلغاء",
         onClick: () => {}, 
       },
     ],
   });
 };


 const updateTask = () => {
  if (!editTask || !editTask.id) {
    toast.error("بيانات المهمة غير صالحة");
    return;
  }

  const updatedTasks = tasks.map((t) =>
    String(t.id) === String(editTask.id) ? editTask : t
  );

  setTasks(updatedTasks);
  localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  toast.success("تم تعديل المهمة بنجاح");
  setEditTask(null);
};

  return (
    <div className='deals-page'>
      <div className="deals-header">
        <h2>Task</h2>
        <button onClick={() => setShowModal(true)} className="add-btn">
          +  {t("dashboard-ad")}
        </button>
      </div>
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

            {tasks.map((task,i) => {
              { if (!task) return null;  }

              const clientData = users.find((u) => String(u.id) === String(task.clientId));
              const employeeData = users.find((u) => String(u.id) === String(task.employeeId));

               { return (
                <tr key={i}>
                  <td>{task.title}</td>
                  <td>{task.dis}</td>
                  <td>{employeeData?.name}</td>
                  <td>{clientData?.name}</td>
                  <td>{task.date}</td>
                  <td>{task.priority}</td>
                  <td>{task.status}</td>

                 

                  <td>
                    <button
                      className="btn btn-delete"
                      onClick={()=>handleDelete(task.id)}
                    >
                      <Trash size={14}/>
                    </button>
                    <button
                      className="btn btn-view"
                       onClick={() => setSelectedTask(task)}
                    >
                      <Eye size={14}/>
                    </button>
                    <button
                       className="btn btn-edit"
                       onClick={() => setEditTask(task)}
                    >
                      <Pen size={14}/>
                    </button>
                  </td>
                </tr>
               ); }
            })} 

          </tbody>
        </table>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{t("dashboard-ad")}</h3>
            <form onSubmit={AddNewTask}>
              <input
                type="text"
                placeholder="عنوان الصفقة"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <input
                type="text"
                placeholder="وصف الصفقة"
                name="dis"
                value={dis}
                onChange={(e) => setDis(e.target.value)}
              />

              <select
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                name="clientName"
              >
                <option value="" disabled hidden>
                   Chose Client
                </option>
                {client.map((c, i) => (
                  <option key={i} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <select
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
                name="employeeName"
              >
                <option value="" disabled hidden>
                  Chose Employee
                </option>
                {employee.map((c, i) => (
                  <option key={i} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

             

              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                name="priority"
              >
                <option value="high">high</option>
                <option value="medium">medium</option>
                <option value="low">low</option>
              </select>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                name="status"
              >
                <option value="in-progress">in-progress</option>
                <option value="won">won</option>
                <option value="lost">lost</option>
              </select>

              <input type="date"
               value={date}
               onChange={(e) => setDate(e.target.value)}
               name="date" required />

              <div className="modal-actions">
                <button onClick={AddNewTask} type="submit">{t("add-t")}</button>
                <button type="button" onClick={() => setShowModal(false)}>
                  {t("close")}
                </button>
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
            <p><strong>{t("dashboard-employee")}:</strong> {users.find(u => u.id == selectedTask.employeeId)?.name || 'غير معروف'}</p>
            <p><strong>{t("dashboard-client")}:</strong> {users.find(u => u.id == selectedTask.clientId)?.name || 'غير معروف'}</p>
            <p><strong>{t("dashboard-table-p")}:</strong> {selectedTask.priority}</p>
            <p><strong>{t("dashboard-table-S")}:</strong> {selectedTask.status}</p>
            <p><strong>{t("dashboard-table-s")}:</strong> {selectedTask.date}</p>

            <div className="modal-actions">
              <button type="button" onClick={() => setSelectedTask(null)}>{t("close")}</button>
            </div>
          </div>
      )}

      {editTask && (
  <div className="modal-overlay">
    <div className="modal">
      <h3>{t("et")}</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateTask();
        }}
      >
        <input
          type="text"
          placeholder="عنوان المهمة"
          value={editTask.title}
          onChange={(e) =>
            setEditTask({ ...editTask, title: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="وصف المهمة"
          value={editTask.dis}
          onChange={(e) =>
            setEditTask({ ...editTask, dis: e.target.value })
          }
        />

        <select
          value={editTask.clientId}
          onChange={(e) =>
            setEditTask({ ...editTask, clientId: e.target.value })
          }
        >
          <option value="" disabled hidden>اختر العميل</option>
          {client.map((c, i) => (
            <option key={i} value={c.id}>{c.name}</option>
          ))}
        </select>

        <select
          value={editTask.employeeId}
          onChange={(e) =>
            setEditTask({ ...editTask, employeeId: e.target.value })
          }
        >
          <option value="" disabled hidden>اختر الموظف</option>
          {employee.map((e, i) => (
            <option key={i} value={e.id}>{e.name}</option>
          ))}
        </select>

        <select
          value={editTask.priority}
          onChange={(e) =>
            setEditTask({ ...editTask, priority: e.target.value })
          }
        >
          <option value="high">high</option>
          <option value="medium">medium</option>
          <option value="low">low</option>
        </select>

        <select
          value={editTask.status}
          onChange={(e) =>
            setEditTask({ ...editTask, status: e.target.value })
          }
        >
          <option value="in-progress">in-progress</option>
          <option value="won">won</option>
          <option value="lost">lost</option>
        </select>

        <input
          type="date"
          value={editTask.date}
          onChange={(e) =>
            setEditTask({ ...editTask, date: e.target.value })
          }
        />

        <div className="modal-actions">
          <button type="submit">{t("save")}</button>
          <button type="button" onClick={() => setEditTask(null)}>
            {t("close")}
          </button>
        </div>
      </form>
    </div>
  </div>
)}


    </div>
  )
}

export default Tasks