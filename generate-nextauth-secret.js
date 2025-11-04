// Script untuk generate NEXTAUTH_SECRET
// Run: node generate-nextauth-secret.js

const crypto = require('crypto');

// Generate random 32 bytes dan convert ke base64
const secret = crypto.randomBytes(32).toString('base64');

console.log('\n✅ NEXTAUTH_SECRET generated:');
console.log('═══════════════════════════════════════════════════════');
console.log(secret);
console.log('═══════════════════════════════════════════════════════');
console.log('\n📝 Copy secret di atas dan tambahkan ke file .env.local:');
console.log(`NEXTAUTH_SECRET=${secret}\n`);

