import Button from "@components/Button";
import ButtonSecondary from "@components/Button/ButtonSecondary";
import TextLink from "@components/TextLink";
import { FaGoogle } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { PiCaretDownBold, PiCaretUpBold } from "react-icons/pi";
import { Link } from "react-router-dom";

function DemoButtons() {
  return (
    <div className="flex flex-wrap items-center justify-center p-4 gap-4">
      <Button text="Hello" />
      <Button text="Hello" outline />
      <Button text="Hello" disabled />
      <Button outline text="Hello" disabled />
      <Button text="Hello" Icon={FaGoogle} />
      <Button Icon={FaGoogle} isRound ghost />
      <Button Icon={FcGoogle} isRound outline />
      <Button Icon={FcGoogle} isRound disabled />
      <Button Icon={FcGoogle} isRound disabled outline />

      <ButtonSecondary text="Hello" />
      <ButtonSecondary text="Hello" ghost />
      <ButtonSecondary text="Hello" outline />
      <ButtonSecondary text="Hello" disabled />
      <ButtonSecondary outline text="Hello" disabled />
      <Link to="/hello">
        <ButtonSecondary text="Hello" Icon={FaGoogle} />
      </Link>
      <ButtonSecondary Icon={FaGoogle} isRound />
      <ButtonSecondary Icon={FcGoogle} isRound disabled />
      <ButtonSecondary Icon={FcGoogle} isRound disabled outline />
      <ButtonSecondary Icon={FcGoogle} isRound outline ghost />
      <ButtonSecondary Icon={FaGoogle} isRound outline ghost />

      <TextLink text="Hello" />
      <TextLink text="Hello" disabled />

      <Button
        ghost
        renderContent={() => (
          <div className="flex items-center justify-center gap-4">
            <div className="w-10 h-10 rounded-full bg-error-source"></div>
            <PiCaretDownBold />
          </div>
        )}
        renderDropdown={() => (
          <div className="flex flex-col p-4 gap-4 bg-primary-5">
            <Button
              text="Hello"
              onClick={() => {
                console.log("Hello");
              }}
            />
            <Button
              text="Heeey"
              onClick={() => {
                console.log("Heeey");
              }}
            />
          </div>
        )}
      />

      <ButtonSecondary
        ghost
        renderContent={({ isDisplayDropdown }) => (
          <div className="flex items-center justify-center gap-4">
            <div className="w-10 h-10 rounded-full bg-error-source"></div>
            {isDisplayDropdown ? <PiCaretUpBold /> : <PiCaretDownBold />}
          </div>
        )}
        renderDropdown={() => (
          <div className="flex flex-col p-4 gap-4 bg-secondary-5">
            <Button
              text="Hello"
              onClick={() => {
                console.log("Hello");
              }}
            />
            <ul className="flex flex-col gap-4">
              <li className="p-2 border cursor-pointer hover:text-primary-1 border-primary-1 rounded-md">
                Option 1
              </li>
              <li className="p-2 border cursor-pointer hover:text-primary-1 border-primary-1 rounded-md">
                Option 2
              </li>
              <li className="p-2 border cursor-pointer hover:text-primary-1 border-primary-1 rounded-md">
                Option 3
              </li>
            </ul>
          </div>
        )}
      />
    </div>
  );
}

export default DemoButtons;
