import type { OnRpcRequestHandler, OnTransactionHandler } from '@metamask/snaps-sdk';
import { panel, text, heading } from '@metamask/snaps-sdk';

// Handle outgoing transactions.
export const onTransaction: OnTransactionHandler = async ({ transaction }) => {

  // Use the window.ethereum global provider to fetch the gas price.
  const currentGasPrice = await (window as any).ethereum.request({
    method: 'eth_gasPrice',
  });

  // Get fields from the transaction object.
  const transactionGas = parseInt(transaction.gas as string, 16);
  const currentGasPriceInWei = parseInt(currentGasPrice ?? '', 16);
  const maxFeePerGasInWei = parseInt(transaction.gas as string, 16);
  const maxPriorityFeePerGasInWei = parseInt(
    transaction.gas as string,
    16,
  );

  // Calculate gas fees the user would pay.
  const gasFees = Math.min(
    maxFeePerGasInWei * transactionGas,
    (currentGasPriceInWei + maxPriorityFeePerGasInWei) * transactionGas,
  );

  // Calculate gas fees as percentage of transaction.
  const transactionValueInWei = parseInt(transaction.value as string, 16);
  const gasFeesPercentage = (gasFees / (gasFees + transactionValueInWei)) * 100;

  // Display percentage of gas fees in the transaction insights UI.
  return {
    content: panel([
      heading('Transaction insights Snap'),
      text(
        `As set up, you are paying **${gasFeesPercentage.toFixed(
          2,
        )}%** in gas fees for this transaction.`,
      ),
    ]),
  };
};