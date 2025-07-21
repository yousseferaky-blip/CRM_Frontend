import { useState, useEffect } from "react";
import "./Deals.css";
import { toast } from "react-toastify";
import { BotOff, DnaOff, Eye, Pen, TimerOff, TimerReset, Trash } from "lucide-react";
import { confirmAlert } from "react-confirm-alert";
import { string } from "prop-types";
import { useTranslation } from "react-i18next";

const Deals = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showView, setView] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [title, setTitle] = useState("");
  const [clientName, setClientName] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [value, setValue] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("in-progress");
  const [editDeal, setEditDeal] = useState(null);
  const {t} = useTranslation()

  const users = JSON.parse(localStorage.getItem("crm_users")) || [];
  const client = users.filter((u) => u.role === "client");
  const employee = users.filter((u) => u.role === "employee");

  useEffect(() => {
    const getDeals = JSON.parse(localStorage.getItem("deals")) || [];
    setDeals(getDeals);
    setLoading(false);
  }, []);
  
  const AddNewDeal = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("يرجى إدخال عنوان الصفقة");
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
    if (!value || parseFloat(value) <= 0) {
      toast.error("يرجى إدخال قيمة الصفقة بشكل صحيح");
      return;
    }

    const NewDeal = {
      id: Date.now(),
      title,
      clientId: clientName,
      employeeId: employeeName,
      value,
      status,
      date ,
    };

    const updateDeal = [...deals, NewDeal];
    localStorage.setItem("deals", JSON.stringify(updateDeal));
    setDeals(updateDeal);

    setTitle("");
    setClientName("");
    setEmployeeName("");
    setValue("");
    setStatus("in-progress");
    setShowModal(false);

    toast.success(" Added Deal ")
  };

  const handleDelete = (id) => {
    confirmAlert({
      title: "تأكيد الحذف",
      message: "هل أنت متأكد أنك تريد حذف هذه الصفقة؟",
      buttons: [
        {
          label: "نعم، احذف",
          onClick: () => {
            const filteredDeals = deals.filter((deal) => deal && deal.id !== id); 
            setDeals(filteredDeals);
            localStorage.setItem("deals", JSON.stringify(filteredDeals));
            toast.success("تم حذف الصفقة بنجاح");
          },
        },
        {
          label: "إلغاء",
          onClick: () => {},
        },
      ],
    });
  };

  const updateDeal = () => {
    if (!editDeal || !editDeal.id) {
      toast.error("حدث خطأ: بيانات الصفقة غير صالحة");
      return;
    }

    const updatedDeals = deals.map((d) => {
      if (!d || !d.id) return d; 

      return String(d.id) === String(editDeal.id) ? editDeal : d;
    });

    setDeals(updatedDeals);
    localStorage.setItem("deals", JSON.stringify(updatedDeals));
    toast.success("تم تحديث الصفقة بنجاح");
    setEditDeal(null);
  };



  return (
    <div className="tasks-page">
      <div className="deals-header">
        <h2>{t("dashboard-deals")}</h2>
        <button onClick={() => setShowModal(true)} className="add-btn">
          +  {t("dashboard-add")}
        </button>
      </div>

      {loading ? (
        <p>جارٍ التحميل...</p>
      ) : (
        <table className="deals-table">
          <thead>
            <tr>
              <th>{t("dashboard-table-t")}</th>
              <th>{t("dashboard-client")}</th>
              <th>{t("dashboard-employee")}</th>
              <th>{t("dashboard-table-v")}</th>
              <th>{t("dashboard-table-s")}</th>
              <th>{t("dashboard-table-S")}</th>
              <th>{t("dashboard-table-a")}</th>
            </tr>
          </thead>
          <tbody>

            {deals.map((deal) => {
              if (!deal) return null; 
              const clientData = users.find((u) => String(u.id) === String(deal.clientId));
              const employeeData = users.find((u) => String(u.id) === String(deal.employeeId));

              return (
                <tr key={deal.id}>
                  <td>{deal.title}</td>
                  <td>{clientData?.name }</td>
                  <td>{employeeData?.name }</td>
                  <td>{deal.value}$</td>
                  <td>{deal.date}</td>
                  <td>{deal.status}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(deal.id)}
                       className="btn btn-delete"
                    >
                      <Trash size={14}/>
                    </button>
                    <button
                      className="btn btn-view"
                      onClick={() => {
                        setSelectedDeal(deal);
                        setView(true);
                    }}
                    >
                      <Eye size={14}/>
                    </button>
                    <button
                       className="btn btn-edit"
                       onClick={() => setEditDeal(deal)}
                    >
                      <Pen size={14}/>
                    </button>
                  </td>
                </tr>
              );
            })}

          </tbody>
        </table>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{t("dashboard-add")}</h3>
            <form onSubmit={AddNewDeal}>
              <input
                type="text"
                placeholder="عنوان الصفقة"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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

              <input
                type="number"
                placeholder="قيمة الصفقة"
                name="value"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />

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
                <button type="submit">{t("add-d")}</button>
                <button type="button" onClick={() => setShowModal(false)}>
                  {t("close")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showView && selectedDeal && (
        <div className="view-card">
            <h3>{t("dd")}</h3>
            <p><strong>{t("dashboard-table-t")}:</strong> {selectedDeal.title}</p>
            <p><strong>{t("dashboard-client")}:</strong> {
            client.find(c => c.id === selectedDeal.clientId)?.name || "غير معروف"
            }</p>
            <p><strong>{t("dashboard-employee")}:</strong> {
            employee.find(e => e.id === selectedDeal.employeeId)?.name || "غير معروف"
            }</p>
            <p><strong>{t("dashboard-table-v")}:</strong> {selectedDeal.value} جنيه</p>
            <p><strong>{t("dashboard-table-S")}:</strong> {selectedDeal.status}</p>
            <p><strong>{t("dashboard-table-s")}:</strong> {selectedDeal.date}</p>

            <div className="modal-actions">
              <button type="button" title="cancel" onClick={() => setView(false)}>{t("close")}</button>
            </div>
        </div>
      )}


      {editDeal && (
  <div className="modal-overlay">
    <div className="modal">
      <h3>{t("ed")}</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateDeal()
        }}
      >
        <input
          type="text"
          placeholder="عنوان الصفقة"
          value={editDeal.title}
          onChange={(e) =>
            setEditDeal({ ...editDeal, title: e.target.value })
          }
        />

        <select
          value={editDeal.clientId}
          onChange={(e) =>
            setEditDeal({ ...editDeal, clientId: e.target.value })
          }
        >
          <option value="" disabled hidden>

          </option>
          {client.map((c, i) => (
            <option key={i} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={editDeal.employeeId}
          onChange={(e) =>
            setEditDeal({ ...editDeal, employeeId: e.target.value })
          }
        >
          <option value="" disabled hidden>

          </option>
          {employee.map((c, i) => (
            <option key={i} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="قيمة الصفقة"
          value={editDeal.value}
          onChange={(e) =>
            setEditDeal({ ...editDeal, value: e.target.value })
          }
        />

        <select
          value={editDeal.status}
          onChange={(e) =>
          setEditDeal({ ...editDeal, status: e.target.value })
          }
        >
          <option value="in-progress">in-progress</option>
          <option value="won">won</option>
          <option value="lost">lost</option>
        </select>

        <input
          type="date"
          value={editDeal.date || ""}
          onChange={(e) =>
          setEditDeal({ ...editDeal, date: e.target.value })
          }
        />

        <div className="modal-actions">
          <button onClick={updateDeal} type="submit">{t("save")}</button>
          <button type="button" onClick={() => setEditDeal(null)}>
            {t("close")}
          </button>
        </div>
      </form>
    </div>
  </div>
      )}



    </div>
  );
};

export default Deals;
