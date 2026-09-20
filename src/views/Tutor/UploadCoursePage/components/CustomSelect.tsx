import React, { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaSearch } from "react-icons/fa";

interface CustomSelectProps {
  value: string;
  onChange: (val: string) => void;
  options: string[];
  placeholder?: string;
  hasSearch?: boolean;
  searchPlaceholder?: string;
  className?: string;
  triggerClassName?: string;
  maxHeightClass?: string;
}

export default function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "Select...",
  hasSearch = false,
  searchPlaceholder = "Search...",
  className = "",
  triggerClassName = "",
  maxHeightClass = "max-h-[320px]"
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropUp, setDropUp] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (!isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      // If there is less than 340px below, open upward instead of downward
      setDropUp(spaceBelow < 340);
    }
    setIsOpen(!isOpen);
  };

  const filteredOptions = options.filter(opt => 
    opt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Select Trigger */}
      <div 
        tabIndex={0}
        className={`w-full h-[48px] px-4 border border-[#e2e8f0] rounded-[8px] bg-white flex items-center justify-between cursor-pointer focus-within:border-[#3e92cc] transition-colors outline-none ${triggerClassName}`}
        onClick={handleToggle}
      >
        <span className={`text-[14px] truncate ${value ? "text-[#202127]" : "text-[#717480]"}`}>
          {value || placeholder}
        </span>
        <FaChevronDown className={`text-[12px] text-[#717480] transition-transform ${isOpen ? (dropUp ? "" : "rotate-180") : ""}`} />
      </div>

      {/* Dropdown Panel */}
      {isOpen && (
        <div 
          className={`absolute left-0 w-full bg-white border border-[#e2e8f0] rounded-[12px] shadow-2xl z-[9999] overflow-hidden flex flex-col ${maxHeightClass} ${
            dropUp ? "bottom-[calc(100%+8px)]" : "top-[calc(100%+8px)]"
          }`}
        >
          {hasSearch && (
            <div className="p-3 bg-white shrink-0 border-b border-[#f1f5f9]">
              <div className="relative w-full h-[40px] border border-[#e2e8f0] rounded-[8px] bg-[#f8fafc] focus-within:border-[#3e92cc] focus-within:bg-white transition-colors flex items-center px-3">
                <FaSearch className="text-[#717480] text-[13px] mr-2.5 shrink-0" />
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-full text-[13px] outline-none bg-transparent text-[#202127] placeholder:text-[#94a3b8]"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          )}

          {/* Options List */}
          <div className="p-3 overflow-y-auto flex-1 space-y-1.5 no-scrollbar">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt, idx) => {
                const isSelected = value === opt;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      onChange(opt);
                      setIsOpen(false);
                      setSearchTerm("");
                    }}
                    className={`w-full text-left px-4 py-2.5 rounded-[8px] text-[13px] font-medium transition-colors ${
                      isSelected 
                        ? "bg-[#07004d] text-white" 
                        : "bg-white text-[#202127] hover:bg-[#f6f8fa]"
                    }`}
                  >
                    {opt}
                  </button>
                );
              })
            ) : (
              <div className="text-center py-4 text-[13px] text-[#717480]">
                No options found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
