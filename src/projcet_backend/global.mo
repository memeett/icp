import Text "mo:base/Text";
module {
  public type CanisterId = {
    session: Text;
    user: Text;
    userclicked: Text;
    submission: Text;
    job_transaction: Text;
    job: Text;
    invitation: Text;
    inbox: Text;
    applier: Text;
  };

  public let canister_id : CanisterId = {
    userclicked="ajuq4-ruaaa-aaaaa-qaaga-cai";
    user="a4tbr-q4aaa-aaaaa-qaafq-cai";
    submission="a3shf-5eaaa-aaaaa-qaafa-cai";
    session="asrmz-lmaaa-aaaaa-qaaeq-cai";
    job_transaction="b77ix-eeaaa-aaaaa-qaada-cai";
    job="bw4dl-smaaa-aaaaa-qaacq-cai";
    invitation="br5f7-7uaaa-aaaaa-qaaca-cai";
    inbox="bd3sg-teaaa-aaaaa-qaaba-cai";
    applier="bkyz2-fmaaa-aaaaa-qaaaq-cai";
  };
}
