import { Plugins } from "@capacitor/core";
const { Storage } = Plugins;

export async function setGameData(key: string, value: any): Promise<void> {
  const encodedKey = btoa(key);
  const encodedData = btoa(JSON.stringify(value));
  await Storage.set({
    key: encodedKey,
    value: JSON.stringify(encodedData)
  });
}

export async function getGameData(key: string): Promise<any> {
  const encodedKey = btoa(key);
  const item = await Storage.get({ key: encodedKey });
  const decodedData = atob(JSON.parse(item.value));
  return JSON.parse(decodedData);
}

export async function deleteGameData(key: string): Promise<void> {
  await Storage.remove({
    key: key
  });
}
