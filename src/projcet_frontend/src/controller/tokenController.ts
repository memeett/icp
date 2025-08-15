import { user } from "../../../declarations/user";
import { icrc1_ledger_canister } from "../../../declarations/icrc1_ledger_canister";
import { Token } from "../interface/Token";
import { Principal } from "@dfinity/principal";
import { User } from "../shared/types/User";
import { AuthClient } from "@dfinity/auth-client";
import { Actor, HttpAgent } from "@dfinity/agent";

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

export async function getMintingAddress(): Promise<Principal> {
  const result = await icrc1_ledger_canister.icrc1_minting_account();

  if (result.length === 0) {
    throw new Error("No minting account set");
  }

  const { owner } = result[0];
  return owner;
}

export async function topUpWalletController(user: User, amount: number) {
  const authClient = await AuthClient.create();

  if (!authClient.isAuthenticated()) {
    await authClient.login({
      identityProvider: "https://identity.ic0.app/#authorize",
    });
  }

  console.log("Authenticated user:", authClient.getIdentity().getPrincipal().toText());
  
  const identity = authClient.getIdentity();
  const agent = new HttpAgent({ identity });

  const mintingOwnerPrincipal = await getMintingAddress(); // Principal type

  // const subaccount : [] | [Uint8Array] = user.subAccount ? [user.subAccount[0]] : [];

  // const toAccount = {
  //   owner: mintingOwnerPrincipal,
  //   subaccount: subaccount,
  // };

  // const transferArgs = {
  //   to: toAccount,
  //   amount: amountBigInt,
  //   fee: [] as [] | [bigint], 
  //   memo: [] as [] | [Uint8Array],
  //   created_at_time: [] as [] | [bigint],
  //   from_subaccount: [] as [],
  // };

  // console.log("Transfer args:", transferArgs);

   const result = await icrc1_ledger_canister.icrc1_transfer({
    to: {
      owner: mintingOwnerPrincipal, // recipient principal
      subaccount: user.subAccount, // None
    },
    fee: [], // None
    memo: [], // None
    from_subaccount: [], // None
    created_at_time: [], // None
    amount: BigInt(amount), // e.g., 1 token in e8s
  });

  if ("Ok" in result) {
    console.log("Transfer successful. Block height:", result.Ok.toString());
    return result.Ok;
  } else {
    throw new Error(
      "Transfer failed: " +
      JSON.stringify(result.Err, (_, v) => typeof v === "bigint" ? v.toString() : v)
    );

  }
}

