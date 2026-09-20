import Button from "@components/Button";
import Select from "@components/Input/Select";
import Textarea from "@components/Input/Textarea";
import SELECT_OPTIONS from "@constants/reports-options";
import useReportModalContent from "./hooks/useReportModalContent";

const ReportModalContent = ({
  onCancelClick,
}: {
  onCancelClick?: () => void;
}) => {
  const { isLoading, handleSubmit, register, errors, handleCancelClick } = useReportModalContent(onCancelClick);

  return (
    <div className="w-[505px] space-y-4 rounded-[8px] p-6 border border-neutral-4 bg-primary-1">
      <h2 className="text-3xl font-bold text-title-large">Report Abuse</h2>
      <p>
        Flagged content is reviewed by Gloxad academy staff to determine whether
        it violates Terms of Service or Community Guidelines.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          options={SELECT_OPTIONS}
          {...register("reportType")}
          error={errors.reportType?.message}
        />

        <Textarea
          placeholder="Enter your description"
          {...register("reportMessage", {
            required: "Report message is required",
          })}
          error={errors.reportMessage?.message}
        />
        <div className="flex justify-end pt-4 gap-4">
          <Button text="Cancel" onClick={handleCancelClick} outline />

          <div>
            <Button text="Submit" type="submit" disabled={isLoading} />
            {isLoading && <div data-testid="loading"></div>}
          </div>
        </div>
      </form>
    </div>
  );
};

export default ReportModalContent;
