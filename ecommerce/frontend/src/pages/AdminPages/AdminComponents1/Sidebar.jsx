//ecommerce/frontend/src/pages/AdminPages/AdminComponents1/Sidebar.jsx
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { Home, Package, FolderTree, ShoppingBag, Users } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminSidebar({ collapsed }) {
  return (
    <ProSidebar collapsed={collapsed} className="admin-sidebar">
      <Menu iconShape="circle">
        <MenuItem icon={<Home size={20} />}>
          <Link to="/admin">Dashboard</Link>
        </MenuItem>
        <MenuItem icon={<Package size={20} />}>
          <Link to="/admin/products">Products</Link>
        </MenuItem>
        <MenuItem icon={<FolderTree size={20} />}>
          <Link to="/admin/category">Categories</Link>
        </MenuItem>
        <MenuItem icon={<ShoppingBag size={20} />}>
          <Link to="/admin/orders">Orders</Link>
        </MenuItem>
        <MenuItem icon={<Users size={20} />}>
          <Link to="/admin/users/all">Users</Link>
        </MenuItem>
      </Menu>
    </ProSidebar>
  );
}
