const Web3 = require('web3');
const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');

const abi = [{"name":"DepositEvent","inputs":[{"type":"bytes","name":"pubkey","indexed":false},{"type":"bytes","name":"withdrawal_credentials","indexed":false},{"type":"bytes","name":"amount","indexed":false},{"type":"bytes","name":"signature","indexed":false},{"type":"bytes","name":"index","indexed":false}],"anonymous":false,"type":"event"},{"outputs":[],"inputs":[],"constant":false,"payable":false,"type":"constructor"},{"name":"get_hash_tree_root","outputs":[{"type":"bytes32","name":"out"}],"inputs":[],"constant":true,"payable":false,"type":"function","gas":91674},{"name":"get_deposit_count","outputs":[{"type":"bytes","name":"out"}],"inputs":[],"constant":true,"payable":false,"type":"function","gas":10433},{"name":"deposit","outputs":[],"inputs":[{"type":"bytes","name":"pubkey"},{"type":"bytes","name":"withdrawal_credentials"},{"type":"bytes","name":"signature"}],"constant":false,"payable":true,"type":"function","gas":1334417}];
const depositContract = new web3.eth.Contract(abi, '0xdddddddddddddddddddddddddddddddddddddddd');

// Private key comes from genesis and has loads of money.
const account = web3.eth.accounts.privateKeyToAccount('0x8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63')
const tx = depositContract.methods.deposit(
// Validator public key:
"0xD04EDBFD45AB130339C39CCE4C4F4409E94C3A58788ED529091FC189570DD9244467DC928916A95ED96E5A46292E8490",
// Validator withdrawal commitment (sha256 hash of public Eth2 account validator funds are sent to when exiting the validator pool)
"0x00E0451F7D33565B90408453177E1B31B09ADD8D4F454E635062DAE1B282D8E1",
// Signature
"0x935B279F636D64B668CDC84DFDC2C937C6F5868B337212C71403887D5721DAC7506E430D0F7F5537D184CDF578A34B0D0953FBD6B277A9C3DAC4C573B7CE075D4E25AA328065FACF6B1484F534A1686B20E3226EFB0EB226C218D941C2A245A9"
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
