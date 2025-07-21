import "./Reports.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { useState } from "react";
import { useTranslation } from "react-i18next";

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const Reports = () => {
  const {t} = useTranslation()
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const deals = JSON.parse(localStorage.getItem("deals"))?.filter(Boolean) || [];
  const tasks = JSON.parse(localStorage.getItem("tasks"))?.filter(Boolean) || [];
  const users = JSON.parse(localStorage.getItem("crm_users"))?.filter(Boolean) || [];

  const clients = users.filter((u) => u.role === "client");
  const employees = users.filter((u) => u.role === "employee");

  // Filter by date range if selected
  const filteredDeals = deals.filter((d) => {
    const dealDate = new Date(d.date);
    return (
      (!startDate || new Date(startDate) <= dealDate) &&
      (!endDate || new Date(endDate) >= dealDate)
    );
  });

  const wonDeals = filteredDeals.filter((d) => d.status === "won");
  const lostDeals = filteredDeals.filter((d) => d.status === "lost");
  const inProgressDeals = filteredDeals.filter((d) => d.status === "in-progress");

  const topEmployees = Object.entries(
    filteredDeals.reduce((acc, d) => {
      const emp = employees.find((e) => e.id == d.employeeId);
      const name = emp?.name || "غير معروف";
      acc[name] = acc[name] || { count: 0, total: 0 };
      acc[name].count += 1;
      acc[name].total += Number(d.value || 0);
      return acc;
    }, {})
  ).sort((a, b) => b[1].total - a[1].total);

  const topClients = Object.entries(
    filteredDeals.reduce((acc, d) => {
      const cl = clients.find((c) => c.id == d.clientId);
      const name = cl?.name || "غير معروف";
      acc[name] = acc[name] || { count: 0, total: 0 };
      acc[name].count += 1;
      acc[name].total += Number(d.value || 0);
      return acc;
    }, {})
  ).sort((a, b) => b[1].total - a[1].total);

  const recentDeals = [...filteredDeals]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const successRate =
    filteredDeals.length > 0
      ? ((wonDeals.length / filteredDeals.length) * 100).toFixed(1)
      : 0;


    const monthlyEarnings = filteredDeals.reduce((acc, deal) => {
    if (deal.status !== "won") return acc;
    const month = new Date(deal.date).toISOString().slice(0, 7); // "2025-07"
    acc[month] = (acc[month] || 0) + Number(deal.value || 0);
    return acc;
  }, {});
  const sortedMonths = Object.keys(monthlyEarnings).sort();

  const monthlyBarData = {
    labels: sortedMonths,
    datasets: [
      {
        label: "أرباح شهرية",
        data: sortedMonths.map((m) => monthlyEarnings[m]),
        backgroundColor: "#10b981",
      },
    ],
  };

  const dealsChartData = {
    labels: ["ناجحة", "خاسرة", "جارية"],
    datasets: [
      {
        data: [wonDeals.length, lostDeals.length, inProgressDeals.length],
        backgroundColor: ["#22c55e", "#ef4444", "#eab308"],
      },
    ],
  };

  const employeeBarData = {
    labels: topEmployees.map(([name]) => name),
    datasets: [
      {
        label: "إجمالي قيمة الصفقات",
        data: topEmployees.map(([_, data]) => data.total),
        backgroundColor: "#2563eb",
      },
    ],
  };

 const handleDownloadPDF = () => {
  const input = document.getElementById("report-content");

  html2canvas(input, { scale: 2 }).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // أول صفحة
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    // صفحات إضافية
    while (heightLeft > 0) {
      position = position - pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save("report.pdf");
  });
};


  return (
    <div className="reports-container">
  <div className="filter-section">
    <label>{t("from")}: <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} /></label>
    <label>{t("to")}: <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} /></label>
  </div>
  <button onClick={handleDownloadPDF} className="download-btn">
    📥 {t("bdf")}
  </button>

  <div id="report-content">
    <div className="stats">
      <div className="card">✅ {t("dashboard-won")}: {wonDeals.length}</div>
      <div className="card">❌ {t("dashboard-lost")}: {lostDeals.length}</div>
      <div className="card">🔄 {t("dashboard-ip")}: {inProgressDeals.length}</div>
      <div className="card">📋 {t("dashboard-tasks")}: {tasks.length}</div>
    </div>

    <div className="summary">
      <h3>📋 {t("dashboard-os")}</h3>
      <p>{t("dashboard-td")}: {filteredDeals.length}</p>
      <p>{t("dashboard-sr")}: 🟢 {successRate}%</p>
    </div>

    <div className="chart-section">
      <h3>📊 {t("dashboard-dd")}</h3>
      <div className="chart small-chart">
        <Pie data={dealsChartData} />
      </div>
    </div>

    <div className="chart-section">
      <h3>👨‍💼 {t("dashboard-ep")}</h3>
      <div className="chart">
        <Bar data={employeeBarData} />
      </div>
    </div>

    <div className="chart-section">
      <h3>💹 {t("dashboard-mr")}</h3>
      <div className="chart">
        <Bar data={monthlyBarData} />
      </div>
    </div>

    <div className="top-section">
      <div>
        <h3>👨‍💼 {t("dashboard-te")}</h3>
        <ul>
          {topEmployees.map(([name, data], idx) => (
            <li key={idx}>
              {name} — 💰 {data.total}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3>🧍‍♂️ {t("dashboard-tc")}</h3>
        <ul>
          {topClients.map(([name, data], idx) => (
            <li key={idx}>
              {name} — 💰 {data.total}
            </li>
          ))}
        </ul>
      </div>
    </div>

    <div>
      <h3>🆕 {t("dashboard-l5d")}</h3>
      <ul>
        {recentDeals.map((d) => (
          <li key={d.id}>
            📌 {d.title} — 💰 {d.value} — 🗓 {d.date}
          </li>
        ))}
      </ul>
    </div>
  </div>
</div>

  );
};

export default Reports;
