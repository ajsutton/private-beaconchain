const Web3 = require('web3');
const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');
const YAML = require('yaml');
const fs = require('fs');

const abi = [{"name":"DepositEvent","inputs":[{"type":"bytes","name":"pubkey","indexed":false},{"type":"bytes","name":"withdrawal_credentials","indexed":false},{"type":"bytes","name":"amount","indexed":false},{"type":"bytes","name":"signature","indexed":false},{"type":"bytes","name":"index","indexed":false}],"anonymous":false,"type":"event"},{"outputs":[],"inputs":[],"constant":false,"payable":false,"type":"constructor"},{"name":"get_hash_tree_root","outputs":[{"type":"bytes32","name":"out"}],"inputs":[],"constant":true,"payable":false,"type":"function","gas":91674},{"name":"get_deposit_count","outputs":[{"type":"bytes","name":"out"}],"inputs":[],"constant":true,"payable":false,"type":"function","gas":10433},{"name":"deposit","outputs":[],"inputs":[{"type":"bytes","name":"pubkey"},{"type":"bytes","name":"withdrawal_credentials"},{"type":"bytes","name":"signature"}],"constant":false,"payable":true,"type":"function","gas":1334417}];
const depositContract = new web3.eth.Contract(abi, '0xdddddddddddddddddddddddddddddddddddddddd');

// Private key comes from genesis and has loads of money.
const account = web3.eth.accounts.privateKeyToAccount('0x8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63')


const file = fs.readFileSync('depositData.yml', 'utf8')
const deposits = YAML.parse(file);
web3.eth.getTransactionCount(account.address, 'pending')
  .then(nonce => {
    sendDeposit(deposits, nonce);
});

function sendDeposit(deposits, nonce) {
  const deposit = deposits.pop();
  console.log("Sending deposit for " + deposit.pubkey);
  const tx = depositContract.methods.deposit(deposit.pubkey, deposit.withdrawal, deposit.signature);
  sendTransaction(tx.encodeABI(), nonce, () => {
    if (deposits.length > 0) {
      sendDeposit(deposits, nonce + 1);
    }
  });
}

function sendTransaction(data, nonce, next) {
  console.log("Send with nonce " + nonce);
  account.signTransaction({
        chainId: "2018",
        to: depositContract.options.address,
        data: data,
        value: web3.utils.toWei('32', 'ether'),
        gas: "9015769",
        nonce: nonce
      }, (err, signedTx) => {
        if (err) {
          console.error("Failed to sign: " + err);
        }
        console.log("Signed nonce: " + nonce);
        web3.eth.sendSignedTransaction(signedTx.rawTransaction).on('receipt', result => {
          console.log("Sent deposit successfully in transaction", result.transactionHash);
          next();
        });
      });
}