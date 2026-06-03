import { encryptField, decryptField } from '../utils/encryption';

const runEncryptionTest = () => {
  console.log('====================================');
  console.log('    PHI GCM ENCRYPTION TEST CHECK   ');
  console.log('====================================');

  const testName = 'John Doe';
  const testReport = 'Patient shows severe microcytic anemia parameters. Hb is 6.2.';

  console.log(`Original Name: "${testName}"`);
  const encryptedName = encryptField(testName);
  console.log(`Encrypted Name (Hex GCM): "${encryptedName}"`);

  const decryptedName = decryptField(encryptedName);
  console.log(`Decrypted Name: "${decryptedName}"`);

  if (decryptedName === testName) {
    console.log('Name Encryption/Decryption Check: PASSED');
  } else {
    console.error('Name Encryption/Decryption Check: FAILED');
    process.exit(1);
  }

  console.log(`Original Report: "${testReport}"`);
  const encryptedReport = encryptField(testReport);
  console.log(`Encrypted Report (Hex GCM): "${encryptedReport}"`);

  const decryptedReport = decryptField(encryptedReport);
  console.log(`Decrypted Report: "${decryptedReport}"`);

  if (decryptedReport === testReport) {
    console.log('Report Encryption/Decryption Check: PASSED');
  } else {
    console.error('Report Encryption/Decryption Check: FAILED');
    process.exit(1);
  }

  console.log('====================================');
  console.log('    ALL ENCRYPTION CHECKS PASSED    ');
  console.log('====================================');
};

runEncryptionTest();
