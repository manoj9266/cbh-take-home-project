const { deterministicPartitionKey,encrypt } = require("./dpk");

describe("deterministicPartitionKey", () => {
  it("Returns the literal '0' when given no input", () => {
    const trivialKey = deterministicPartitionKey();
    expect(trivialKey).toBe("0");
  });

  it("Returns the encrypted event when partition key not present", () => {
    const trivialKey = deterministicPartitionKey({});
    expect(trivialKey).toBe(encrypt(JSON.stringify({})));
  });

  it("Returns the encrypted event when partition key not present", () => {
    const event = {};
    const trivialKey = deterministicPartitionKey(event);
    expect(trivialKey).toBe(encrypt(JSON.stringify(event)));
  });

  it("Returns the same partition key when partition key length is less than 256", () => {
    const event = {partitionKey:"abc"};
    const trivialKey = deterministicPartitionKey(event);
    expect(trivialKey).toBe(event.partitionKey);
  });

  it("Returns the encrypted partition key when partition key length is greater than 256", () => {
    let event = {partitionKey:""};
    for(let i=1;i<=257;i++){
       event.partitionKey += 'a';
    }    
    const trivialKey = deterministicPartitionKey(event);
    expect(trivialKey).toBe(encrypt(event.partitionKey));
  });

  it("Returns the stringified partition key when partition key is not a string", () => {
    let event = {partitionKey:{}};
    const trivialKey = deterministicPartitionKey(event);
    expect(trivialKey).toBe(JSON.stringify(event.partitionKey));
  });

  it("Returns the encrypted stringified partition key when partition key is not a string and string length is greater than 256", () => {    
    let event = {partitionKey:{temp:""}};
    for(let i=1;i<=257;i++){
      event.partitionKey.temp += 'a';
   }  
    const trivialKey = deterministicPartitionKey(event);
    expect(trivialKey).toBe(encrypt(JSON.stringify(event.partitionKey)));
  });

});
