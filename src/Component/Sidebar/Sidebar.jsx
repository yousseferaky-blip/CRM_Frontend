import {
  ChartBar,
  UsersIcon,
  Users2,
  Building2Icon,
  HeartHandshakeIcon,
  ListCheck,
  FileText,
  Users,
  X,
  User,
} from "lucide-react";
import "./Sidebar.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../Context/UserContext";
import { useTranslation } from "react-i18next";

const Sidebar = ({ activeSidebar, setActiveSidebar }) => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const {t} = useTranslation()
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  const role = user?.role;

  const allLinks = [
    { title: t("dashboard"), idon: <ChartBar />, to: "/dashboard", roles: ["admin", "employee", "client"] },
    { title: t("pro"), idon: <User />, to: "/dashboard/profile", roles: [ "employee", "client"] },
    { title: t("user"), idon: <UsersIcon />, to: "/dashboard/users", roles: ["admin"] },
    { title: t("dashboard-clients"), idon: <Users2 />, to: "/dashboard/clients", roles: ["admin"] },
    { title: t("dashboard-employees"), idon: <Building2Icon />, to: "/dashboard/employees", roles: ["admin"] },
    { title: t("dashboard-deals"), idon: <HeartHandshakeIcon />, to: "/dashboard/deals", roles: ["admin"] },
    { title: t("dashboard-tasks"), idon: <ListCheck />, to: "/dashboard/tasks", roles: ["admin"] },
    { title: t("re"), idon: <FileText />, to: "/dashboard/reports", roles: ["admin"] },
  ];

  const sidebar = allLinks.filter(link => role && link.roles.includes(role));

  return (
    <>
      <aside className={`aside ${activeSidebar ? "activeSidebar" : ""}`}>
        <div className="aside_Container">
          <div className="aside_Container_Top">
            <div className="logo">
              <Users size={36} className="logo_icon" />
              <span>crm</span>
            </div>
            <div onClick={() => setActiveSidebar(!activeSidebar)} className="aside_Container_Top_x">
              <X size={24} />
            </div>
          </div>

          <div className="aside_Container_links">
            {sidebar.map((aside, index) => (
              <NavLink
                to={aside.to}
                key={index}
                end={aside.to === "/dashboard"}
                className={({ isActive }) => `aside_link ${isActive ? "active" : ""}`}
              >
                <span className="aside_icon">{aside.idon}</span>
                <span className="aside_title">{aside.title}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </aside>

      {activeSidebar && <div className="sidebar_overlay"></div>}
    </>
  );
};

export default Sidebar;
