import { user } from "../../../declarations/user";
import { icrc1_ledger_canister } from "../../../declarations/icrc1_ledger_canister";
import { Token } from "../interface/Token";
import { Principal } from "@dfinity/principal";
import { User } from "../shared/types/User";
import { AuthClient } from "@dfinity/auth-client";
import { Actor, HttpAgent } from "@dfinity/agent";
import { Job } from "../shared/types/Job";
import { job_transaction } from "../../../declarations/job_transaction";
import { count } from "console";
import { aC } from "vitest/dist/chunks/reporters.66aFHiyX";
import { job } from "../../../declarations/job";

export async function getBalanceController(curr_user: User): Promise<Token> {
  const authClient = await AuthClient.create();
  const OwnerPrincipal = await getPrincipalAddress();

  if (!authClient.isAuthenticated()) {
    await authClient.login({
      identityProvider: "https://identity.ic0.app/#authorize",
    });
  }
  const identity = authClient.getIdentity();


  const ledgerCanisterId = process.env.CANISTER_ID_ICRC1_LEDGER_CANISTER;
  if (!ledgerCanisterId) {
    throw new Error("Ledger canister ID is not set in environment variables.");
  }

  const result = await user.getBalance(curr_user.id, ledgerCanisterId);

  if ("ok" in result) {
    const tokenInfo = result.ok;
    const next_reuslt = await icrc1_ledger_canister.icrc1_balance_of({
      owner: OwnerPrincipal, // recipient principal
      subaccount: curr_user.subAccount, // subaccount as Uint8Array
    });
    console.log("Balance:", next_reuslt);
    return {
      token_name: tokenInfo.token_name,
      token_symbol: tokenInfo.token_symbol,
      token_value: Number(next_reuslt) // convert bigint to number
    };
  } else {
    throw new Error(result.err);
  }
}

export function getPrincipalAddress(): Principal {
  return Principal.fromText("2vxsx-fae");
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

  const OwnerPrincipal = await getPrincipalAddress(); // Principal type

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
  console.log("Current user subAccount:", curr_user.subAccount);
  console.log("Current user principal:", identity.getPrincipal().toText());

   const result = await icrc1_ledger_canister.icrc1_transfer({
    to: {
      owner: OwnerPrincipal, // recipient principal
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
    const next_result = await user.addBalanceTransaction(curr_user.id, amount);
    console.log("Add balance transaction result:", next_result);
    if("ok" in next_result) {
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

  const OwnerPrincipal = await getPrincipalAddress(); // Principal type

  console.log("current job subaccount:", curr_job.subAccount);
  console.log("Amount to transfer:", BigInt(amount)); 
   const obj = curr_user.subAccount[0]!;


  // Convert values into Uint8Array
  const uint8 = new Uint8Array(Object.values(obj));
  console.log("Uint8Array representation of subaccount:", uint8);
  console.log("Current user subAccount:", curr_user.subAccount);
  console.log("Current user principal:", identity.getPrincipal().toText());
  console.log("Current job subAccount:", curr_job.subAccount);

   const result = await icrc1_ledger_canister.icrc1_transfer({
    to: {
      owner: OwnerPrincipal, // recipient principal
      subaccount: curr_job.subAccount,
    },
    fee: [], // None
    memo: [], // None
    from_subaccount: [uint8], // None
    created_at_time: [], // None
    amount: BigInt(amount), // e.g., 1 token in e8s
  });

  console.log("Transfer result:", result);

  if ("Ok" in result) {
    const next_result = await user.jobPaymentTranfer(curr_user.id, curr_job.id, amount, process.env.CANISTER_ID_JOB!);
    console.log("Add job transaction result:", next_result);
    if("ok" in next_result) {
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


export async function transfertoWorkerController(job_id: string) {
  
  try {
    const job_result = await job.getJob(job_id)
    if ("err" in job_result) {
      return { err: job_result.err }; // stop if job not found
    }

    const curr_job = job_result.ok
    const result = await job_transaction.getAcceptedFreelancers(
      curr_job.id,
      process.env.CANISTER_ID_USER! // user canister ID from env
    );


    if ("ok" in result) {
      const acceptedFreelancers = result.ok; // this is an array of User.User
      const OwnerPrincipal = await getPrincipalAddress();
      const count = acceptedFreelancers.length;
      const amountPerFreelancer = Math.floor(curr_job.jobSalary / count);
      // Loop through freelancers and do transfers
      for (const freelancer of acceptedFreelancers) {
        console.log("Freelancer:", freelancer);
        const result = await icrc1_ledger_canister.icrc1_transfer({
          to: {
            owner: OwnerPrincipal, // recipient principal
            subaccount: freelancer.subAccount,
          },
          fee: [], // None
          memo: [], // None
          from_subaccount: curr_job.subAccount, // None
          created_at_time: [], // None
          amount: BigInt(amountPerFreelancer), // e.g., 1 token in e8s
        });


        if ("Ok" in result) {
          const next_result = await user.workerPaymentTransfer(curr_job.id, freelancer.id ,amountPerFreelancer, process.env.CANISTER_ID_JOB!);
          console.log("Add job transaction result:", next_result);
        }
        else {
          console.error(`Transfer to ${freelancer.id} failed:`, result.Err);
          return { err: `Transfer to ${freelancer.id} failed: ${JSON.stringify(result.Err)}` };
        }
        
      }

      return { ok: true };
    } else {
      console.error("Error from canister:", result.err);
      return { err: result.err };
    }
  } catch (err) {
    console.error("transfertoWorkerController error:", err);
    return { err: (err as Error).message };
  }
}
