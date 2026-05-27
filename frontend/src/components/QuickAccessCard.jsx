import { Link } from "react-router-dom";

export default function QuickAccessCard({ to, title, description }) {
  return (
    <Link className="quick-card" to={to}>
      <strong>{title}</strong>
      <span>{description}</span>
    </Link>
  );
}
