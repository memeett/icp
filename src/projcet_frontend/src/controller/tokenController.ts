import { user } from "../../../declarations/user";
import { Token } from "../interface/Token";

export async function getBalanceController(user_id: string): Promise<Token> {
  const ledgerCanisterId = process.env.CANISTER_ID_ICRC1_LEDGER_CANISTER;
  if (!ledgerCanisterId) {
    throw new Error("Ledger canister ID is not set in environment variables.");
  }

  const result = await user.getBalance(user_id, ledgerCanisterId);

  if ("ok" in result) {
    const tokenInfo = result.ok;

    return {
      token_name: tokenInfo.token_name,
      token_symbol: tokenInfo.token_symbol,
      token_value: Number(tokenInfo.token_value) // convert bigint to number
    };
  } else {
    throw new Error(result.err);
  }
}
