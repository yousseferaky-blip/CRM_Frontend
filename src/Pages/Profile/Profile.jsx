import html2canvas from 'html2canvas';
import './Profile.css'
import { User, Briefcase, CheckCircle2 } from "lucide-react";
import jsPDF from 'jspdf';

const Profile = () => {
    const user = JSON.parse(localStorage.getItem("crm_current_user"));
    const getTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const getDeals = JSON.parse(localStorage.getItem("deals")) || [];

    const TaskEmployee = getTasks.filter((task) => task?.employeeId === user?.id?.toString());
    const DealEmployee = getDeals.filter((deal) => deal?.employeeId === user?.id?.toString());

    const completed = TaskEmployee.filter(statue => statue?.status === "won").length
    const progres = Math.round((completed / TaskEmployee.length) * 100);
    
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
                <p><strong className='strong'>Total Tasks:</strong> {TaskEmployee.length}</p>
                <p><strong className='strong'>Total Deals:</strong> {DealEmployee.length}</p>
            </div>

            <div className="profile-section">
                <h2 className="section-title">
                    <Briefcase size={20} /> Deals
                </h2>
                <div className="card-list">
                    {DealEmployee.map((deal) => (
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
            </div>

            <div className="profile-section">
                <h2 className="section-title">
                    <CheckCircle2 size={20} /> Tasks
                </h2>

                <div className="progress-bar">
                    <h2>Task Completion</h2>
                    <div style={{ width: `${progres}%` }}>{progres}%</div>
                </div>


                <div className="card-list">

                    {TaskEmployee.map((task) => (
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
            </div>

        </section>
    );
};

export default Profile;
