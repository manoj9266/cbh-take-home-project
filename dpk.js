const crypto = require("crypto");
const MAX_PARTITION_KEY_LENGTH= 256;
const TRIVIAL_PARTITION_KEY = "0";

//encrypt the data
function encrypt(data){
  return crypto.createHash("sha3-512").update(data).digest("hex");
}

// check if partition key length is greater than the max length 
function shouldEncrypt(partitionKey){
  return partitionKey.length > MAX_PARTITION_KEY_LENGTH;
}

// check if the type is string
function isNotString(partitionKey){
return typeof partitionKey !== "string";
}

//to get partition key from candidate
function getPartitionKey(candidate){
  let partitionKey = TRIVIAL_PARTITION_KEY;
  if (candidate) {    
    partitionKey =  isNotString(candidate) ? JSON.stringify(candidate):candidate;
  }  
  return shouldEncrypt(partitionKey)? encrypt(partitionKey):partitionKey;  
}

// to get candidate from event
function getCandidate(event){
  if(!event){
    return null;
  }
  return event.partitionKey || encrypt(JSON.stringify(event)) ;
}

exports.deterministicPartitionKey = (event) => {  
  const candidate = getCandidate(event);
  return getPartitionKey(candidate);    
};

exports.encrypt = encrypt;

