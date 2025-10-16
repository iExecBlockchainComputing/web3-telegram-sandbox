import { IExecWeb3telegram } from "@iexec/web3telegram";
import { checkCurrentChain, checkIsConnected } from "./utils";

export async function fetchMyContacts(selectedChainId?: number) {
  try {
    checkIsConnected();
  } catch (err) {
    return { contacts: null, error: "Please install MetaMask" };
  }
  await checkCurrentChain(selectedChainId);
  const web3telegram = new IExecWeb3telegram(window.ethereum);
  const contacts = await web3telegram.fetchMyContacts();
  return { contacts, error: "" };
}

export async function sendMessage(
  messageContent: string,
  protectedData: string,
  senderName?: string,
  selectedChainId?: number,
) {
  checkIsConnected();
  await checkCurrentChain(selectedChainId);
  const web3telegram = new IExecWeb3telegram(window.ethereum);
  const { taskId } = await web3telegram.sendTelegram({
    telegramContent: messageContent,
    protectedData,
    senderName,
    /**
     * this demo uses a workerpool offering free computing power dedicated to learning
     * this resource is shared and may be throttled, it should not be used for production applications
     * remove the `workerpoolAddressOrEns` option to switch back to a production ready workerpool
     */
    workerpoolAddressOrEns:
      selectedChainId !== 134
        ? undefined
        : "prod-v8-learn.main.pools.iexec.eth",
    workerpoolMaxPrice: selectedChainId !== 134 ? 0.1 * 1e9 : undefined,
  });
  console.log("iExec worker taskId", taskId);
  return taskId;
}
