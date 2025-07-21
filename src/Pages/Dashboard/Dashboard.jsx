import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useTranslation } from "react-i18next";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

const Dashboard = () => {
  const [clients, setClients] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [deals, setDeals] = useState([]);
  const [tasks, setTasks] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 🧑‍🤝‍🧑 Fetch users
        const usersSnapshot = await getDocs(collection(db, "users"));
        const users = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setClients(users.filter((u) => u.role === "client"));
        setEmployees(users.filter((u) => u.role === "employee"));

        // 📦 Fetch deals
        const dealsSnapshot = await getDocs(collection(db, "deals"));
        const dealsData = dealsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDeals(dealsData);

        // 📋 Fetch tasks
        const tasksSnapshot = await getDocs(collection(db, "tasks"));
        const tasksData = tasksSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTasks(tasksData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const completedTasks = tasks?.filter((t) => t.status === "won")?.length || 0;

  const monthlyDeals = Array(12).fill(0);
  deals?.forEach((deal) => {
    if (deal?.date) {
      const month = new Date(deal.date).getMonth();
      monthlyDeals[month]++;
    }
  });

  const thisMonth = new Date().getMonth();
  const dealsThisMonth = deals.filter(
    (d) => d && d.date && new Date(d.date).getMonth() === thisMonth
  );
  const wonDeals = deals.filter((d) => d?.status === "won");
  const successRate = deals.length ? Math.round((wonDeals.length / deals.length) * 100) : 0;

  const topClient = clients.reduce((prev, current) => {
    const totalPrev = deals.filter(d => d?.clientId === prev?.id).reduce((sum, d) => sum + Number(d?.value || 0), 0);
    const totalCurrent = deals.filter(d => d?.clientId === current?.id).reduce((sum, d) => sum + Number(d?.value || 0), 0);
    return totalCurrent > totalPrev ? current : prev;
  }, clients[0] || {});

  const recentClients = [...clients].slice(-3).reverse();
  const recentDeals = [...deals].filter(d => d && d.date).slice(-3).reverse();

  const months = [
    "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
    "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
  ];

  const exportToPDF = () => {
    const dashboardElement = document.querySelector(".dashboard-container");

    if (!dashboardElement) return;

    html2canvas(dashboardElement, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let position = 0;

      if (imgHeight > pageHeight) {
        let heightLeft = imgHeight;
        while (heightLeft > 0) {
          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
          position -= pageHeight;
          if (heightLeft > 0) pdf.addPage();
        }
      } else {
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      }

      pdf.save("dashboard-report.pdf");
    });
  };

  return (
    <div className="dashboard-container">
      <h1>{t("dashboard")}</h1>

      <div className="dashboard-stats">
        <div className="stat-card">👥 {t("dashboard-clients")}: {clients.length}</div>
        <div className="stat-card">🧑‍💼 {t("dashboard-employees")}: {employees.length}</div>
        <div className="stat-card">📦 {t("dashboard-deals")}: {deals.length}</div>
        <div className="stat-card">✅ {t("dashboard-completed")}: {completedTasks}</div>
      </div>

      <div className="dashboard-section">
        <h2>🏅  {t("dashboard-tpc")}</h2>
        <p>{topClient?.name || "No clients available"}</p>
      </div>

      <div className="dashboard-section">
        <h2>📆 {t("dashboard-dtm")} ({months[thisMonth]})</h2>
        <p>{t("dashboard-td")}: {dealsThisMonth.length}</p>
      </div>

      <div className="dashboard-section">
        <h2>🔍 {t("dashboard-osr")}</h2>
        <p>{successRate}% {t("dashboard-odas")}</p>
      </div>

      <div className="dashboard-section">
        <h2>🔄 {t("dashboard-rac")}</h2>
        <ul>
          {recentClients.map((client, idx) => (
            <li key={idx}>{client.name}</li>
          ))}
        </ul>
      </div>

      <div className="dashboard-section">
        <h2>📋 {t("dashboard-ld")}</h2>
        <ul className="activity-list">
          {recentDeals.map((deal, index) => (
            <li key={index}>
              {deal.status === "won" ? "✅" : deal.status === "lost" ? "❌" : "⏳"} {t("dashboard-dw")} {deal.value} EGP –{" "}
              {new Date(deal.date).toLocaleDateString("en-GB")}
            </li>
          ))}
        </ul>
      </div>

      <div className="dashboard-section">
        <h2>📊 {t("dashboard-md")}</h2>
        <div className="bar-chart">
          {months.map((month, i) => (
            <div key={month} className="bar-item">
              <span>{month}</span>
              <div
                className="bar"
                style={{ height: `${monthlyDeals[i] * 6}px` }}
              >
                <span className="bar-value">{monthlyDeals[i]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-section export-btn">
        <button onClick={exportToPDF}>📤 {t("bdf")}</button>
      </div>
    </div>
  );
};

export default Dashboard;
