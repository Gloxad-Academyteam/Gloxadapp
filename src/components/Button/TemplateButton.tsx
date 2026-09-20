import { useState } from "react";
import { TProps } from "./types_";

const useButton = (isDropdown: boolean) => {
  const [isDisplayDropdown, setIsDisplayDropdown] = useState(false);

  const handleDropdownClick = (value?: boolean) => {
    setIsDisplayDropdown((prev) => value ?? !prev);
  };

  return {
    handleDropdownClick: isDropdown ? handleDropdownClick : () => {},
    isDisplayDropdown,
  };
};

const TemplateButton = ({
  text,
  type,
  disabled,
  outline,
  ghost,
  Icon,
  isRound,
  renderDropdown,
  dropdownIsSolid,
  renderContent,
  onClick,
  getClassName,
  testID,
  isBlock,
  className,
  width = isRound ? "56px" : undefined,
}: TProps & {
  getClassName: (
    props: Pick<TProps, "isRound" | "disabled" | "outline" | "ghost"> & {
      isBlock?: boolean;
    }
  ) => string;
}) => {
  const isOnlyIcon = !text && Icon;
  const iconSize = isOnlyIcon ? "" : "20px";
  const iconSizeMobile = isOnlyIcon ? "" : "10px";

  const { handleDropdownClick, isDisplayDropdown } = useButton(
    !!renderDropdown
  );

  return (
    <div className={`relative ${isBlock ? "w-full" : "w-max"}`}>
      <button
        className={`btn-interactive ${getClassName({ isRound, disabled, outline, ghost, isBlock })} ${className || ""}`}
        style={width ? { width } : undefined}
        type={type || "button"}
        role="button"
        disabled={disabled}
        data-testid={renderDropdown ? "dropdown-button" : undefined}
        onClick={() => {
          onClick?.();
          handleDropdownClick();
        }}
      >
        {/* use screen.getByText(<testID>) to get the button element */}
        {testID && process.env.NODE_ENV === "test" ? testID : null}

        {Icon && (
          <>
            <span className="hidden md:inline">
              <Icon size={iconSize} />
            </span>

            <span className="md:hidden">
              <Icon size={iconSizeMobile} />
            </span>
          </>
        )}

        {text && !renderContent && <p>{text}</p>}

        {renderContent?.({ isDisplayDropdown })}
      </button>

      {isDisplayDropdown && (
        <div
          className="absolute bg-white border border-neutral-6 rounded-[8px] shadow-lg z-10 translate-x-[-50%] top-12 left-1/2"
          data-testid="dropdown-content"
          onClick={() => !dropdownIsSolid && handleDropdownClick(false)}
          onMouseLeave={() => handleDropdownClick(false)}
        >
          {renderDropdown && renderDropdown()}
        </div>
      )}
    </div>
  );
};

export default TemplateButton;
