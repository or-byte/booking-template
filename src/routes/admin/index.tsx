import { useNavigate } from "@solidjs/router";

export default function AdminDashboard() {
  const navigate = useNavigate();

  navigate("dashboard");
}