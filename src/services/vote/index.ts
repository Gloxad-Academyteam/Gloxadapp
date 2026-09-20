import TService from "@types_/service";
import axiosInstance from "@utils/axiosInstance";
import handleUseRoute from "@utils/handleUseRoute";
import { ERouteId } from "@constants/routes";

const sendUpvoteServiceRoute = handleUseRoute(ERouteId["vote.up"], {
  disableMockingInProduction: false,
});

const sendDownvoteServiceRoute = handleUseRoute(ERouteId["vote.down"], {
  disableMockingInProduction: false,
});

async function sendUpvote(): Promise<TService<true>> {
  await axiosInstance.get(sendUpvoteServiceRoute);

  return { data: true };
}

async function sendDownvote(): Promise<TService<true>> {
  await axiosInstance.get(sendDownvoteServiceRoute);

  return { data: true };
}

export { sendUpvote, sendUpvoteServiceRoute, sendDownvote, sendDownvoteServiceRoute };
