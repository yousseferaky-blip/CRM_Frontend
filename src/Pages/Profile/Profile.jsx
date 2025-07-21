import  "./Profile.css";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Context/UserContext";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { Briefcase, CheckCircle2, Loader2, User } from "lucide-react";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [taskSnap, dealSnap] = await Promise.all([
        getDocs(collection(db, "tasks")),
        getDocs(collection(db, "deals")),
      ]);

      const allTasks = taskSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const allDeals = dealSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      let filteredTasks = [];
      let filteredDeals = [];

      if (user.role === "client") {
        filteredTasks = allTasks.filter((task) => task.clientId === user.id);
        filteredDeals = allDeals.filter((deal) => deal.clientId === user.id);
      } else if (user.role === "employee") {
        filteredTasks = allTasks.filter((task) =>
          Array.isArray(task.employeeId)
            ? task.employeeId.includes(user.id)
            : task.employeeId === user.id
        );
        filteredDeals = allDeals.filter((deal) =>
          Array.isArray(deal.employeeId)
            ? deal.employeeId.includes(user.id)
            : deal.employeeId === user.id
        );
      }

      setTasks(filteredTasks);
      setDeals(filteredDeals);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  if (loading) return <Loader2 />;

    const completedD = deals.filter(deal => deal?.status === "won").length;
    const progresD = deals.length > 0 ? Math.round((completedD / deals.length) * 100) : 0;
    
    const completedT = tasks.filter(task => task?.status === "won").length;
    const progresT = deals.length > 0 ? Math.round((completedT / deals.length) * 100) : 0;

 const handleDownloadPDF = () => {
    const input = document.getElementById("report-content");

    html2canvas(input, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const imgWidth = pdfWidth;
        const imgHeight = (canvas.height * pdfWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 0;


        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;


        while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
            heightLeft -= pdfHeight;
        }

        pdf.save("profile_report.pdf");
    });
};

  return (
    <section id="report-content" className="profile">

        <div className="profile-header">
            <h1>Profile Overview</h1>
            <button onClick={handleDownloadPDF} className="pdf-button">Download PDF</button>
        </div>

       <div className="profile-card">
            <h2 className="section-title">
                <User size={20} /> User Info
            </h2>
            <p><strong className='strong'>Name:</strong> {user.name}</p>
            <p><strong className='strong'>Email:</strong> {user.email}</p>
            <p><strong className='strong'>Role:</strong> {user.role}</p>
            <p><strong className='strong'>Phone:</strong> {user.number}</p>
            <p><strong className='strong'>Total Tasks:</strong> {tasks.length}</p>
            <p><strong className='strong'>Total Deals:</strong> {deals.length}</p>
        </div>

      <hr />

        <div className="profile-section">
                <h2 className="section-title">
                    <Briefcase size={20} /> Deals
                </h2>
                <div className="card-list">
                    {deals.map((deal) => (
                        <div className="card" key={deal.id}>
                            <h3>{deal.title}</h3>
                            <p><strong>Value:</strong> {deal.value}</p>
                            <p>
                                <strong>Status:</strong>{" "}
                                <span className={`status status-${deal.status.toLowerCase()}`}>
                                    {deal.status}
                                </span>
                            </p>
                            <p><strong>Date:</strong> {deal.date}</p>
                        </div>
                    ))}
                </div>
                <h2 className="section-title">
                    <CheckCircle2 size={20} /> Deals
                </h2>

                <div className="progress-bar">
                    <h2>Deal Completion</h2>
                    <div style={{ width: `${progresD}%` }}>{progresD}%</div>
                </div>
            </div>


     

            <div className="profile-section">
                

                <div className="card-list">

                    {tasks.map((task) => (
                        <div className="card" key={task.id}>
                            <h3>{task.title}</h3>
                            <p><strong>Description:</strong> {task.dis}</p>
                            <p>
                                <strong>Status:</strong>{" "}
                                <span className={`status status-${task.status.toLowerCase()}`}>
                                    {task.status}
                                </span>
                            </p>
                            <p>
                                <strong>Priority:</strong>{" "}
                                <span className={`status priority-${task.priority.toLowerCase()}`}>
                                 {task.priority}
                                </span>
                             </p>
                            <p><strong>Date:</strong> {task.date}</p>
                        </div>
                    ))}
                </div>
                <h2 className="section-title">
                    <CheckCircle2 size={20} /> Tasks
                </h2>

                <div className="progress-bar">
                    <h2>Task Completion</h2>
                    <div style={{ width: `${progresT}%` }}>{progresT}%</div>
                </div>
            </div>


    </section>
  );
};

export default Profile;
