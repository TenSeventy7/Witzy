import { Plugins } from "@capacitor/core";
const { Storage } = Plugins;

export async function setGameData(key: string, value: any): Promise<void> {
  const encodedKey = btoa(key);
  await Storage.set({
    key: encodedKey,
    value: JSON.stringify(value)
  });
}

export async function getGameData(key: string): Promise<any> {
  const encodedKey = btoa(key);
  const item = await Storage.get({ key: encodedKey });
  return JSON.parse(item.value);
}

export async function deleteGameData(key: string): Promise<void> {
  await Storage.remove({
    key: key
  });
}
