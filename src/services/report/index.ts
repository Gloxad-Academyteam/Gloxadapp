import TService from "@types_/service";
import axiosInstance from "@utils/axiosInstance";
import handleUseRoute from "@utils/handleUseRoute";
import { ERouteId } from "@constants/routes";

const sendReportServiceRoute = handleUseRoute(ERouteId["report.send"], {
  disableMockingInProduction: false,
});

async function sendReport({
  reportMessage,
  reportType,
}: {
  reportMessage: string;
  reportType: string;
}): Promise<TService<true>> {
  await axiosInstance.post(sendReportServiceRoute, {
    reportMessage,
    reportType,
  });

  return { data: true };
}

export { sendReport, sendReportServiceRoute };
