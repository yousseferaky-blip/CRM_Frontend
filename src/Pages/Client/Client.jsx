import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import './Client.css';
import { useTranslation } from 'react-i18next';
import { db } from '../../firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { Loader, Loader2 } from 'lucide-react';

const Client = () => {
  const [clients, setClients] = useState([]);
  const [employees, setEmployees] = useState([]);
  const { t } = useTranslation();

  // Fetch users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const users = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const OnlyClient = users.filter((u) => u.role === "client");
        const OnlyEmployee = users.filter((u) => u.role === "employee");

        setClients(OnlyClient);
        setEmployees(OnlyEmployee);
      } catch (error) {
        console.error("Error fetching users from Firestore:", error);
      }
    };

    fetchUsers();
  }, []);

  // Assign client to employee
  const handleAssign = async (clientId, employeeName) => {
    if (!employeeName) return;

    try {
      const clientRef = doc(db, 'users', clientId);
      await updateDoc(clientRef, {
        assignedTo: employeeName
      });

      setClients(prev =>
        prev.map(c =>
          c.id === clientId ? { ...c, assignedTo: employeeName } : c
        )
      );
    } catch (error) {
      console.error("Error assigning employee:", error);
    }
  };

  const generatePDF = (client) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Client Details", 20, 20);
    doc.setFontSize(12);
    doc.text(`Name: ${client.name}`, 20, 40);
    doc.text(`Phone: ${client.number}`, 20, 50);
    doc.text(`Email: ${client.email}`, 20, 60);
    doc.text(`Assigned To: ${client.assignedTo || "None"}`, 20, 70);
    doc.save(`client_${client.name}.pdf`);
  };

  return (
    <div className="users_container">
      <h2 className="users_title">{t("client-list")}</h2>

      <div className="table_wrapper">
        <table className="users_table">
          <thead>
            <tr>
              <th>{t("dashboard-table-n")}</th>
              <th>{t("dashboard-table-P")}</th>
              <th>{t("dashboard-table-e")}</th>
              <th>{t("dashboard-table-assignedTo")}</th>
              <th>{t("dashboard-table-a")}</th>
            </tr>
          </thead>
          <tbody>
            {clients.length > 0 ? (
              clients.map((user, index) => (
                <tr key={index}>
                  <td>{user.name}</td>
                  <td>{user.number}</td>
                  <td>{user.email}</td>
                  <td>{user.assignedTo || "Not Assigned"}</td>
                  <td className="actions_cell">
                    <select
                      onChange={(e) => handleAssign(user.id, e.target.value)}
                      defaultValue=""
                      className="assign_select"
                    >
                      <option value="" disabled>{t("dashboard-table-assignedem")}</option>
                      {employees.map(emp => (
                        <option key={emp.id} value={emp.name}>{emp.name}</option>
                      ))}
                    </select>
                    <button onClick={() => generatePDF(user)} className="pdf_btn">{t("bdf")}</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no_data"><Loader2 /></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Client;
