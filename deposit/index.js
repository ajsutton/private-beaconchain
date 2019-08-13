const Web3 = require('web3');
const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');

const abi = [{"name":"DepositEvent","inputs":[{"type":"bytes","name":"pubkey","indexed":false},{"type":"bytes","name":"withdrawal_credentials","indexed":false},{"type":"bytes","name":"amount","indexed":false},{"type":"bytes","name":"signature","indexed":false},{"type":"bytes","name":"index","indexed":false}],"anonymous":false,"type":"event"},{"outputs":[],"inputs":[],"constant":false,"payable":false,"type":"constructor"},{"name":"get_hash_tree_root","outputs":[{"type":"bytes32","name":"out"}],"inputs":[],"constant":true,"payable":false,"type":"function","gas":91674},{"name":"get_deposit_count","outputs":[{"type":"bytes","name":"out"}],"inputs":[],"constant":true,"payable":false,"type":"function","gas":10433},{"name":"deposit","outputs":[],"inputs":[{"type":"bytes","name":"pubkey"},{"type":"bytes","name":"withdrawal_credentials"},{"type":"bytes","name":"signature"}],"constant":false,"payable":true,"type":"function","gas":1334417}];
const depositContract = new web3.eth.Contract(abi, '0xdddddddddddddddddddddddddddddddddddddddd');

// Private key comes from genesis and has loads of money.
const account = web3.eth.accounts.privateKeyToAccount('0x8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63')
const tx = depositContract.methods.deposit(
// Validator public key:
"0x6155265164584DDBA78EB68215A4E795923B4705077FE3D8C731E7DE4548BB0F963EAD70CF6EC50A9F6FAF9E677C36AD",
// Validator withdrawal commitment (sha256 hash of public Eth2 account validator funds are sent to when exiting the validator pool)
"0xDD1E8C0BB59C796583B7C8071F71BB4FD1719669E7D7841B11F6CFEEA6B3CA90",
// Signature
"0xB147DFC8EAFB878CCA0D81A0ABE40BC35CC0A0B0B4C8168EAA2D7FB89A98E24F6324DF9F95473BC46C689AAAC81F360BEDA16686E4201674A2814B6550D8B33BF2F85A434A6C2E6316C1744E150229BD3052B2FA89E405EF1A1043740D1F6B86"
);


account.signTransaction({
  chainId: "2018",
  to: depositContract.options.address,
  data: tx.encodeABI(),
  value: web3.utils.toWei('32', 'ether'),
  gas: "215769"
}, (err, signedTx) => {
  web3.eth.sendSignedTransaction(signedTx.rawTransaction).on('receipt', result => {
    console.log("Sent deposit successfully in transaction", result.transactionHash);
  });
});
