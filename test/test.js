import info from '../config';
const bot = require('../index');

test('Create and launch bot test', () => {
    expect(info).toBeDefined();
    expect(info).toHaveProperty('TOKEN', expect.any(String));
    expect(info).toHaveProperty('secretPath', expect.any(String));
    expect(info).toHaveProperty('api_id', expect.any(Number));
    expect(info).toHaveProperty('api_hash', expect.any(String));
    expect(info).toHaveProperty('phone_number', expect.any(String));
    expect(info).toHaveProperty('secret_code', expect.any(String));
   
    expect(bot).toBeDefined();
    expect(bot).toHaveProperty('launch', expect.any(Function));
})