//ecommerce/frontend/src/hooks/useAdminSidebar.js
import { useState, useRef, useEffect } from "react";
import useClickOutside from "./useClickOutside";

export default function useAdminSidebar() {
  const [collapsed, setCollapsed] = useState(false); // true = collapsed
  const [isOpen, setIsOpen] = useState(false);       // true = sidebar visible

  const sidebarRef = useRef(null);
  const toggleBtnRef = useRef(null);

  const toggleSidebar = () => {
    // Toggle collapse state
    setCollapsed((prev) => !prev);
    // Always mark as open when toggled
    setIsOpen(true);
  };

  const closeSidebar = () => {
    setIsOpen(false);   // hide sidebar on mobile
    setCollapsed(true); // mark as collapsed
  };

  // Mobile click-outside logic
  useClickOutside(
    sidebarRef,
    (e) => {
      if (window.innerWidth >= 1024) return; // desktop: do nothing
      if (!isOpen) return;                   // already closed: do nothing

      // Ignore clicks on toggle button
      if (toggleBtnRef.current && toggleBtnRef.current.contains(e.target)) {
        return;
      }

      closeSidebar();
    },
    true // always active; internal logic controls whether it actually closes
  );

  return {
    collapsed,
    isOpen,
    sidebarRef,
    toggleBtnRef,
    toggleSidebar,
    closeSidebar,
  };
}
