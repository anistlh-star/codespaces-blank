//ecommerce/frontend/src/pages/AdminPages/AdminComponents1/UserProfile.jsx
import { Card } from "primereact/card";
import { Avatar } from "primereact/avatar";
import { useAuth } from "../../../../context/AuthContext";

export default function UserProfile() {
  const { user } = useAuth();

  return (
    <div className="admin-profile-page">
      <div className="admin-profile-cover" />
      <Card className="admin-profile-card">
        <Avatar
          label={user?.name ? user.name[0].toUpperCase() : "A"}
          size="xlarge"
          shape="circle"
          className="admin-profile-avatar"
        />
        <h1 className="admin-profile-name">{user?.name || "Admin"}</h1>
        <p className="admin-profile-email">{user?.email}</p>
      </Card>
    </div>
  );
}
