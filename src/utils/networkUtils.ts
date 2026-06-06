import * as Network from 'expo-network';

export async function checkIsOffline(): Promise<boolean> {
  const state = await Network.getNetworkStateAsync();
  return !state.isConnected;
}
