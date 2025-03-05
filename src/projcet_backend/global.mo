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
    userclicked="aovwi-4maaa-aaaaa-qaagq-cai";
    user="ajuq4-ruaaa-aaaaa-qaaga-cai";
    submission="cbopz-duaaa-aaaaa-qaaka-cai";
    session="a4tbr-q4aaa-aaaaa-qaafq-cai";
    job_transaction="cuj6u-c4aaa-aaaaa-qaajq-cai";
    job="avqkn-guaaa-aaaaa-qaaea-cai";
    invitation="by6od-j4aaa-aaaaa-qaadq-cai";
    inbox="cgpjn-omaaa-aaaaa-qaakq-cai";
    applier="bw4dl-smaaa-aaaaa-qaacq-cai";
  };
}
