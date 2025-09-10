<<<<<<< HEAD
import { projcet_backend_single } from "../../../declarations/projcet_backend_single";
=======
import { user } from "../../../declarations/user";
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
import { icrc1_ledger_canister } from "../../../declarations/icrc1_ledger_canister";
import { Token } from "../interface/Token";
import { Principal } from "@dfinity/principal";
import { User } from "../shared/types/User";
import { AuthClient } from "@dfinity/auth-client";
<<<<<<< HEAD
import { HttpAgent } from "@dfinity/agent";
import { Job } from "../shared/types/Job";

export async function getBalanceController(curr_user: User): Promise<Token> {
  // Data Sanitization
  let sanitizedSubAccount: [] | [Uint8Array] = [];
  if (curr_user.subAccount && curr_user.subAccount.length > 0) {
    const sub = curr_user.subAccount[0];
    if (sub instanceof Uint8Array) {
      sanitizedSubAccount = [sub];
    } else if (typeof sub === 'object' && sub !== null && !Array.isArray(sub)) {
      // It's a plain object, convert it
      const byteArray = Object.values(sub).filter((v): v is number => typeof v === 'number');
      sanitizedSubAccount = [new Uint8Array(byteArray)];
    }
  }

  const authClient = await AuthClient.create();
  const OwnerPrincipal = getPrincipalAddress();

  if (!await authClient.isAuthenticated()) {
=======
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
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
    await authClient.login({
      identityProvider: "https://identity.ic0.app/#authorize",
    });
  }
<<<<<<< HEAD
=======
  const identity = authClient.getIdentity();

>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848

  const ledgerCanisterId = process.env.CANISTER_ID_ICRC1_LEDGER_CANISTER;
  if (!ledgerCanisterId) {
    throw new Error("Ledger canister ID is not set in environment variables.");
  }

<<<<<<< HEAD
  const result = await projcet_backend_single.getBalance(curr_user.id, ledgerCanisterId);
=======
  const result = await user.getBalance(curr_user.id, ledgerCanisterId);
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848

  if ("ok" in result) {
    const tokenInfo = result.ok;
    const next_reuslt = await icrc1_ledger_canister.icrc1_balance_of({
      owner: OwnerPrincipal, // recipient principal
<<<<<<< HEAD
      subaccount: sanitizedSubAccount,
=======
      subaccount: curr_user.subAccount, // subaccount as Uint8Array
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
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

<<<<<<< HEAD
  if (!await authClient.isAuthenticated()) {
=======
  if (!authClient.isAuthenticated()) {
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
    await authClient.login({
      identityProvider: "https://identity.ic0.app/#authorize",
    });
  }
<<<<<<< HEAD
=======

  console.log("Authenticated user:", authClient.getIdentity().getPrincipal().toText());
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
  
  const identity = authClient.getIdentity();
  const agent = new HttpAgent({ identity });

<<<<<<< HEAD
  const OwnerPrincipal = getPrincipalAddress(); // Principal type
=======
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
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848

   const result = await icrc1_ledger_canister.icrc1_transfer({
    to: {
      owner: OwnerPrincipal, // recipient principal
<<<<<<< HEAD
      subaccount: curr_user.subAccount && curr_user.subAccount.length > 0 && curr_user.subAccount[0] ? [curr_user.subAccount[0]] : [],
=======
      subaccount: curr_user.subAccount,
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
    },
    fee: [], // None
    memo: [], // None
    from_subaccount: [], // None
    created_at_time: [], // None
    amount: BigInt(amount), // e.g., 1 token in e8s
  });

  console.log("Transfer result:", result);

  if ("Ok" in result) {
<<<<<<< HEAD
    const next_result = await projcet_backend_single.addBalanceTransaction(curr_user.id, amount);
=======
    const next_result = await user.addBalanceTransaction(curr_user.id, amount);
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
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

<<<<<<< HEAD
  if (!await authClient.isAuthenticated()) {
=======
  if (!authClient.isAuthenticated()) {
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
    await authClient.login({
      identityProvider: "https://identity.ic0.app/#authorize",
    });
  }
<<<<<<< HEAD
=======

  console.log("Authenticated user:", authClient.getIdentity().getPrincipal().toText());
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
  
  const identity = authClient.getIdentity();
  const agent = new HttpAgent({ identity });

<<<<<<< HEAD
  const OwnerPrincipal = getPrincipalAddress(); // Principal type
=======
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
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848

   const result = await icrc1_ledger_canister.icrc1_transfer({
    to: {
      owner: OwnerPrincipal, // recipient principal
<<<<<<< HEAD
      subaccount: curr_job.subAccount && curr_job.subAccount.length > 0 && curr_job.subAccount[0] ? [curr_job.subAccount[0]] : [],
    },
    fee: [], // None
    memo: [], // None
    from_subaccount: curr_user.subAccount && curr_user.subAccount.length > 0 && curr_user.subAccount[0] ? [curr_user.subAccount[0]] : [],
=======
      subaccount: curr_job.subAccount,
    },
    fee: [], // None
    memo: [], // None
    from_subaccount: [uint8], // None
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
    created_at_time: [], // None
    amount: BigInt(amount), // e.g., 1 token in e8s
  });

  console.log("Transfer result:", result);

  if ("Ok" in result) {
<<<<<<< HEAD
    // Backend logic for this is not yet implemented in the single canister
    // const next_result = await projcet_backend_single.jobPaymentTranfer(curr_user.id, curr_job.id, amount);
    // console.log("Add job transaction result:", next_result);
    // if("ok" in next_result) {
    //   return { ok: result.Ok.toString() };
    // }else{
    //   throw new Error(
    //     "Failed to histry transfer to job: " 
    //   );
    // }
    return { ok: result.Ok.toString() };
=======
    const next_result = await user.jobPaymentTranfer(curr_user.id, curr_job.id, amount, process.env.CANISTER_ID_JOB!);
    console.log("Add job transaction result:", next_result);
    if("ok" in next_result) {
      return { ok: result.Ok.toString() };
    }else{
      throw new Error(
        "Failed to histry transfer to job: " 
      );
    }
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
    
  } else {
    throw new Error(
      "Transfer failed: " +
      JSON.stringify(result.Err, (_, v) => typeof v === "bigint" ? v.toString() : v)
    );

  }
}


export async function transfertoWorkerController(job_id: string) {
  
  try {
<<<<<<< HEAD
    const job_result = await projcet_backend_single.getJob(job_id)
=======
    const job_result = await job.getJob(job_id)
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
    if ("err" in job_result) {
      return { err: job_result.err }; // stop if job not found
    }

    const curr_job = job_result.ok
<<<<<<< HEAD
    const result = await projcet_backend_single.getJobAppliers(curr_job.id);


    if ("ok" in result) {
      const acceptedFreelancers = result.ok; // this is an array of { user: BackendUser, appliedAt: bigint }
      const OwnerPrincipal = await getPrincipalAddress();
      const count = acceptedFreelancers.length;
      if (count === 0) return { ok: true }; // No one to pay
      const amountPerFreelancer = Math.floor(Number(curr_job.jobSalary) / count);
      // Loop through freelancers and do transfers
      for (const freelancerData of acceptedFreelancers) {
        const freelancer = freelancerData.user;
        console.log("Freelancer:", freelancer);
        const transferResult = await icrc1_ledger_canister.icrc1_transfer({
          to: {
            owner: OwnerPrincipal, // recipient principal
            subaccount: freelancer.subAccount && freelancer.subAccount.length > 0 && freelancer.subAccount[0] ? [freelancer.subAccount[0]] : [],
          },
          fee: [], // None
          memo: [], // None
          from_subaccount: curr_job.subAccount && curr_job.subAccount.length > 0 && curr_job.subAccount[0] ? [curr_job.subAccount[0]] : [], // None
=======
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
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
          created_at_time: [], // None
          amount: BigInt(amountPerFreelancer), // e.g., 1 token in e8s
        });


<<<<<<< HEAD
        if ("Ok" in transferResult) {
          // Backend logic for this is not yet implemented in the single canister
          // const next_result = await projcet_backend_single.workerPaymentTransfer(curr_job.id, freelancer.id ,amountPerFreelancer);
          // console.log("Add job transaction result:", next_result);
        }
        else {
          console.error(`Transfer to ${freelancer.id} failed:`, transferResult.Err);
          return { err: `Transfer to ${freelancer.id} failed: ${JSON.stringify(transferResult.Err)}` };
=======
        if ("Ok" in result) {
          const next_result = await user.workerPaymentTransfer(curr_job.id, freelancer.id ,amountPerFreelancer, process.env.CANISTER_ID_JOB!);
          console.log("Add job transaction result:", next_result);
        }
        else {
          console.error(`Transfer to ${freelancer.id} failed:`, result.Err);
          return { err: `Transfer to ${freelancer.id} failed: ${JSON.stringify(result.Err)}` };
>>>>>>> 45d171cc3544073d4127467998b52eb6a1ef0848
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
