import iconGrid from "../assets/icons/iconGrid.svg";
import iconProject from "../assets/icons/project.svg";
import iconApproval from "../assets/icons/icApproval.svg";
import iconReimburse from "../assets/icons/reimburst2.svg";
import iconRiwayat from "../assets/icons/riwayat.svg";
import iconReport from '../assets/icons/reportIcon.svg';

const sidebarContent = [
  {
    icon: iconGrid,
    label: "Dashboard",
    route: "/",
  },
  {
    icon: iconReimburse,
    label: "Request Reimbursement",
    route: "/request",
  },
  {
    icon: iconProject,
    label: "Project",
    route: "/project",
  },
  {
    icon: iconRiwayat,
    label: "Riwayat",
    route: "/riwayat",
  },
  {
    icon: iconApproval,
    label: "Approval",
    route: "/approval",
  },
  {
    icon: iconReport,
    label: 'Report',
    route: '/report'
  }
];

export default sidebarContent;
