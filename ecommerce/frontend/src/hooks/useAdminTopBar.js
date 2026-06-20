//ecommerce/frontend/src/hooks/useAdminTopBar.js
import { useState, useRef } from "react";
import useClickOutside from "./useClickOutside";

export default function useAdminTopBar(onToggleSidebar) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  useClickOutside(dropdownRef, () => setDropdownOpen(false), dropdownOpen);

  return {
    dropdownOpen,
    dropdownRef,
    toggleDropdown,
    onToggleSidebar,
  };
}
