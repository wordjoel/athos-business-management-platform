const PARSE_APP_ID = 'MGVO13bUvNoz7wvMl91GNeYMIZMFmli0IefzmfyL';
const PARSE_KEY = 'bdEUBHi6EEsX7uwbObbnEqiz7ssXfL8Voo7E1j2b';
const PARSE_BASE_URL = 'https://parseapi.back4app.com';

const keyTypes = [
  'X-Parse-REST-API-Key',
  'X-Parse-JavaScript-Key',
  'X-Parse-Client-Key',
  'X-Parse-Master-Key'
];

async function testConnection() {
  console.log("Testing connection to Back4App Parse REST API with different keys...");
  for (const keyType of keyTypes) {
    try {
      const url = `${PARSE_BASE_URL}/classes/TestEntity`;
      const parseHeaders = {
        'X-Parse-Application-Id': PARSE_APP_ID,
        [keyType]: PARSE_KEY,
        'Content-Type': 'application/json',
      };
      
      console.log(`Trying ${keyType}...`);
      const createRes = await fetch(url, {
        method: 'POST',
        headers: parseHeaders,
        body: JSON.stringify({ testKey: 'Hello Parse', keyUsed: keyType, timestamp: Date.now() }),
      });
      const createData = await createRes.json();
      
      if (createRes.ok) {
        console.log(`SUCCESS with ${keyType}! objectId:`, createData.objectId);
        return keyType; // Stop on first success
      } else {
        console.log(`Failed for ${keyType}: status ${createRes.status}, error:`, createData);
      }
    } catch (err) {
      console.error(`Error for ${keyType}:`, err);
    }
  }
  return null;
}

testConnection();
