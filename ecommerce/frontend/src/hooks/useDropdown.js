//ecommerce/frontend/src/hooks/useDropdown.js
import { useEffect, useRef, useState } from "react";

export function useDropdown(initialOpen = false) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const Ref = useRef();

  const Open = () => {
    setIsOpen(true);
  };
  const Close = () => {
    setIsOpen(false);
  };
  const Toggle = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    function HandleClickOutside(e) {
      if (Ref.current && !Ref.current.contains(e.target)) setIsOpen(false);
    }
    document.addEventListener("mousedown", HandleClickOutside);
    return document.removeEventListener("mouse", HandleClickOutside);
  }, []);
  return { Open, Close, Toggle, isOpen, Ref };
}
