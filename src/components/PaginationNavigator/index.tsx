import Button from "@components/Button";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import usePaginationNavigator from "./hooks/usePaginationNavigator";
import Select from "@components/Input/Select";

type TProps = {
  totalPages: number;
  className?: string;
};

const PaginationNavigator = ({ totalPages, className }: TProps) => {
  const { page, handlePageChange } = usePaginationNavigator();

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <Button
          key={i}
          text={i.toString()}
          ghost={i !== page}
          isRound
          testID={i === page ? "active-button" : "page-button"}
          onClick={() => handlePageChange(i)}
        />
      );
    }
    return pageNumbers;
  };

  return (
    <div className={`${className}`}>
      <div
        className="items-center justify-center top-[396px] gap-[38px] min-w-[508px] h-[92px] left-[1131px] rounded-[24px] p-[16px] hidden sm:flex"
      >
        <Button
          Icon={IoIosArrowBack}
          outline
          isRound
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          testID="prev"
        />
        {renderPageNumbers()}
        <Button
          Icon={IoIosArrowForward}
          outline
          isRound
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          testID="next"
        />
      </div>

      <div className="sm:hidden w-[100%]">
        <Select
          options={(() => {
            const options = [];
            for (let i = 1; i <= totalPages; i++) {
              options.push({ value: i.toString(), label: `Page ${i}` });
            }
            return options;
          })()}
          label="Select Page"
          value={page.toString()}
          onChange={(e) => handlePageChange(parseInt(e.target.value, 10))}
        />
      </div>
    </div>
  );
};

export default PaginationNavigator;
