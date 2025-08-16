import { user } from "../../../declarations/user";
import { icrc1_ledger_canister } from "../../../declarations/icrc1_ledger_canister";
import { Token } from "../interface/Token";
import { Principal } from "@dfinity/principal";
import { User } from "../shared/types/User";
import { AuthClient } from "@dfinity/auth-client";
import { Actor, HttpAgent } from "@dfinity/agent";
import { Job } from "../shared/types/Job";

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

export async function topUpWalletController(curr_user: User, amount: number) {
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
      subaccount: curr_user.subAccount,
    },
    fee: [], // None
    memo: [], // None
    from_subaccount: [], // None
    created_at_time: [], // None
    amount: BigInt(amount), // e.g., 1 token in e8s
  });

  console.log("Transfer result:", result);

  if ("Ok" in result) {
    const next_result = user.addBalanceTransaction(curr_user.id, amount);
    console.log("Add balance transaction result:", next_result);
    if("Ok" in next_result) {
      return result.Ok;
    }else{
      throw new Error(
        "Failed to add balance transaction: "
      );
    }
    
  } else {
    throw new Error(
      "Transfer failed: " +
      JSON.stringify(result.Err, (_, v) => typeof v === "bigint" ? v.toString() : v)
    );

  }
}

export async function transferToJobController(curr_user: User, curr_job: Job, amount: number) : Promise<{ ok: string } | { err: string }> {
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
      subaccount: curr_job.subAccount,
    },
    fee: [], // None
    memo: [], // None
    from_subaccount: curr_user.subAccount, // None
    created_at_time: [], // None
    amount: BigInt(amount), // e.g., 1 token in e8s
  });

  console.log("Transfer result:", result);

  if ("Ok" in result) {
    const next_result = user.jobPaymentTranfer(curr_user.id, curr_job.id, amount, process.env.CANISTER_ID_JOB!);
    console.log("Add job transaction result:", next_result);
    if("Ok" in next_result) {
      return { ok: result.Ok.toString() };
    }else{
      throw new Error(
        "Failed to histry transfer to job: " 
      );
    }
    
  } else {
    throw new Error(
      "Transfer failed: " +
      JSON.stringify(result.Err, (_, v) => typeof v === "bigint" ? v.toString() : v)
    );

  }
}

