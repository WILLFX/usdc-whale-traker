import { Transfer, Mint, Burn } from "../generated/USDC/USDC";
import { Transaction, Account, MintEvent, BurnEvent } from "../generated/schema";
import { BigInt, Address } from "@graphprotocol/graph-ts";

// Whale thresholds
let WHALE_THRESHOLD_SMALL = BigInt.fromI32(1000000);   // 1 million USDC
let WHALE_THRESHOLD_MEDIUM = BigInt.fromI32(10000000); // 10 million USDC
let WHALE_THRESHOLD_MEGA = BigInt.fromI32(100000000);  // 100 million USDC

// Placeholder function to identify exchange addresses
function isExchangeAddress(address: Address): boolean {
  // Placeholder logic
  return false;
}

export function getOrCreateAccount(address: Address): Account {
  let accountId = address.toHex();
  let account = Account.load(accountId);

  if (account == null) {
    account = new Account(accountId);
    account.address = address;
    account.transactionCount = 0;
    account.whaleTransactionCount = 0;
    account.save();
  }

  return account;
}

export function classifyWhaleTransaction(value: BigInt): String {
  if (value >= WHALE_THRESHOLD_MEGA) {
    return "Mega";
  } else if (value >= WHALE_THRESHOLD_MEDIUM) {
    return "Medium";
  } else {
    return "Small";
  }
}

export function classifyNetworkFlow(from: Address, to: Address): String {
  if (isExchangeAddress(to)) {
    return "Inbound";
  } else if (isExchangeAddress(from)) {
    return "Outbound";
  } else {
    return "Internal";
  }
}

export function classifyTimePeriod(timestamp: BigInt): String {
  // Add logic to classify by time period (daily, weekly, monthly)
  return "Daily"; // Example logic, can be expanded
}

export function handleTransfer(event: Transfer): void {
  let value = event.params.value;

  if (value >= WHALE_THRESHOLD_SMALL) {
    let transactionId = event.transaction.hash.toHex() + "-" + event.logIndex.toString();
    let transaction = new Transaction(transactionId);
    transaction.hash = event.transaction.hash;
    transaction.value = value;
    transaction.timestamp = event.block.timestamp;

    let fromAccount = getOrCreateAccount(event.params.from);
    let toAccount = getOrCreateAccount(event.params.to);

    transaction.from = fromAccount.id;
    transaction.to = toAccount.id;

    transaction.whaleSize = classifyWhaleTransaction(value);
    transaction.networkFlow = classifyNetworkFlow(event.params.from, event.params.to);
    transaction.timePeriod = classifyTimePeriod(event.block.timestamp);

    fromAccount.transactionCount += 1;
    toAccount.transactionCount += 1;

    fromAccount.save();
    toAccount.save();
    transaction.save();
  }
}

// Updated Mint Event Handler
export function handleMint(event: Mint): void {
  let mintEvent = new MintEvent(event.transaction.hash.toHex());
  let account = getOrCreateAccount(event.params.to);
  
  mintEvent.to = account.id;
  mintEvent.value = event.params.amount;  
  mintEvent.timestamp = event.block.timestamp;

  mintEvent.save();
}

// Updated Burn Event Handler
export function handleBurn(event: Burn): void {
  let burnEvent = new BurnEvent(event.transaction.hash.toHex());
  let account = getOrCreateAccount(event.params.burner);  

  burnEvent.from = account.id;
  burnEvent.value = event.params.amount;  
  burnEvent.timestamp = event.block.timestamp;

  burnEvent.save();
}
