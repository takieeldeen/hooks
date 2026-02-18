import { useQuery } from "@tanstack/react-query";
import axios, { endpoints } from "./axios";
import { getFetcher } from "./api";

export function useGetMySubscription() {
  const URL = endpoints.subscription.getSubscription;

  const query = useQuery<{ isSubscribed: boolean; subscription: any }>({
    queryKey: ["subscriptions"],
    queryFn: getFetcher(URL),
  });

  return query;
}

export async function getCheckoutLink() {
  const URL = endpoints.subscription.checkout;
  const res = await axios.post(URL, {
    planId: "4bceddfb-37ea-4768-bbdb-ef63c86e675d",
  });
  window.location.href = res.data.redirectionUrl;
  // return res?.data?.redirectionUrl;
}
