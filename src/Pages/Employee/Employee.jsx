import React, { useEffect, useState } from "react";
import "./Employee.css";
import { useTranslation } from "react-i18next";
import { db } from "../../firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

const AssignClients = () => {
  const [employees, setEmployees] = useState([]);
  const [clients, setClients] = useState([]);
  const [clientsByEmp, setClientsByEmp] = useState({});
  const [selectedClient, setSelectedClient] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    const users = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const emps = users.filter((u) => u.role === "employee");
    const allClients = users.filter((u) => u.role === "client");

    const groupedClients = {};
    emps.forEach((emp) => {
      groupedClients[emp.id] = allClients.filter(
        (c) => c.assignedTo === emp.name
      );
    });

    setEmployees(emps);
    setClients(allClients);
    setClientsByEmp(groupedClients);
  };

  const assignClientToEmp = async (emp, clientId) => {
    try {
      const clientRef = doc(db, "users", clientId);
      await updateDoc(clientRef, { assignedTo: emp.name });
      fetchData(); 
    } catch (err) {
      console.error("Error assigning client:", err);
    }
  };

  return (
    <div className="users_container">
      <h2 className="users_title">{t("employees-list")}ss</h2>

      <table className="users_table">
        <thead>
          <tr>
            <th>{t("dashboard-employee")}</th>
            <th>{t("dashboard-table-e")}</th>
            <th>{t("dashboard-table-assignedClient")}</th>
            <th>{t("dashboard-table-assignedClients")}</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td>{emp.name}</td>
              <td>{emp.email}</td>
              <td>
                <select
                  defaultValue=""
                  onChange={(e) =>
                    assignClientToEmp(emp, e.target.value)
                  }
                >
                  <option value="" disabled>
                    Chose Client
                  </option>
                  {clients
                    .filter((c) => !c.assignedTo || c.assignedTo === emp.name)
                    .map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                </select>
              </td>
              <td>
                {clientsByEmp[emp.id]?.length > 0 ? (
                  <ul>
                    {clientsByEmp[emp.id].map((client) => (
                      <li key={client.id}>
                        {client.name}{" "}
                        <button
                          className="btn_show"
                          onClick={() => {
                            setSelectedClient(client);
                            setShowModal(true);
                          }}
                        >
                          {t("show")}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span style={{ color: "gray" }}>لا يوجد عملاء</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && selectedClient && (
        <div className="modal">
          <div className="modal-content">
            <h3>{t("infoc")}</h3>
            <p><strong>{t("dashboard-table-n")}:</strong> {selectedClient.name}</p>
            <p><strong>{t("dashboard-table-P")}:</strong> {selectedClient.number}</p>
            <p><strong>{t("dashboard-table-e")}:</strong> {selectedClient.email}</p>
            <p><strong>{t("dashboard-table-r")}:</strong> {selectedClient.role}</p>
            <button onClick={() => setShowModal(false)}>{t("close")}</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignClients;
