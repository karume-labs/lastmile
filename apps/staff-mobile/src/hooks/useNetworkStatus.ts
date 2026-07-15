import { useNetInfo } from "@react-native-community/netinfo";

export const useNetworkStatus = () => {
  const netInfo = useNetInfo();
  const isOnline = netInfo.isConnected === true && netInfo.isInternetReachable !== false;
  return { isOnline, connectionType: netInfo.type };
};
