import React, { useEffect, useState } from 'react'
import jsPDF from 'jspdf'
import './Client.css'
import { useTranslation } from 'react-i18next'

const Client = () => {
  const [clients, setClients] = useState([])
  const [employees, setEmployees] = useState([])
  const {t} = useTranslation()

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("crm_users")) || []
    const OnlyClient = users.filter((u) => u.role === "client")
    const OnlyEmployee = users.filter((u) => u.role === "employee")
    setClients(OnlyClient)
    setEmployees(OnlyEmployee)
  }, [])

  const handleAssign = (clientId, employeeName) => {
    if (!employeeName) return

    const users = JSON.parse(localStorage.getItem("crm_users")) || []
    const updatedUsers = users.map(u => {
      if (u.id === clientId) {
        return { ...u, assignedTo: employeeName }
      }
      return u
    })

    localStorage.setItem("crm_users", JSON.stringify(updatedUsers))
    const updatedClients = updatedUsers.filter(u => u.role === "client")
    setClients(updatedClients)
  }

  const generatePDF = (client) => {
    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text("Client Details", 20, 20)
    doc.setFontSize(12)
    doc.text(`Name: ${client.name}`, 20, 40)
    doc.text(`Phone: ${client.number}`, 20, 50)
    doc.text(`Email: ${client.email}`, 20, 60)
    doc.text(`Assigned To: ${client.assignedTo || "None"}`, 20, 70)
    doc.save(`client_${client.name}.pdf`)
  }

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
                <td colSpan="5" className="no_data">No clients found</td>
              </tr>
            )}
            
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Client
