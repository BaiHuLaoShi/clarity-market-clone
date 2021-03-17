import {
  makeContractCall,
  uintCV,
  contractPrincipalCV,
  bufferCVFromString,
  makeSTXTokenTransfer,
  standardPrincipalCV,
  stringUtf8CV,
  listCV,
  noneCV,
  tupleCV,
  stringAsciiCV,
  PostConditionMode,
} from "@stacks/transactions";
import {
  contractAddress,
  secretKey,
  network,
  handleTransaction,
  secretKey2,
  deployContract,
} from "./deploy";
import { ADDR1, ADDR2, ADDR3, ADDR4, testnetKeyMap } from "./mocknet";
const BigNum = require("bn.js");

//
/// Contract calls
//
async function createHai(haiName: string) {
  console.log("create hai");

  const transaction = await makeContractCall({
    contractAddress,
    contractName: "hais",
    functionName: "create-hai",
    functionArgs: [bufferCVFromString(haiName)],
    senderKey: secretKey,
    network,
    bnsLookupURL,
  });

  return handleTransaction(transaction);
}

async function renewHai(haiId: number) {
  console.log("renew hai");
  const transaction = await makeContractCall({
    contractAddress,
    contractName: "hais",
    functionName: "renew-hai",
    functionArgs: [uintCV(haiId)],
    senderKey: secretKey2,
    network,
  });

  return handleTransaction(transaction);
}

async function bid(trait: string, haiId: number, price: number) {
  console.log("bid for tradable");
  const transaction = await makeContractCall({
    contractAddress,
    contractName: "market",
    functionName: "bid",
    functionArgs: [
      contractPrincipalCV(contractAddress, trait),
      uintCV(haiId),
      uintCV(price),
    ],
    senderKey: secretKey2,
    network,
  });

  return handleTransaction(transaction);
}

async function faucetCall(recipient: string) {
  console.log("init wallet");
  const transaction = await makeSTXTokenTransfer({
    recipient,
    amount: new BigNum(93333903125000),
    senderKey: testnetKeyMap[ADDR3].secretKey,
    network,
  });

  return handleTransaction(transaction);
}

async function mintNFTs() {
  console.log("mint nfts");
  const transaction = await makeContractCall({
    contractAddress,
    contractName: "boom-nfts",
    functionName: "mint",
    functionArgs: [
      standardPrincipalCV(contractAddress),
      noneCV(),
      stringUtf8CV("Pictureless"),
      listCV([
        tupleCV({
          name: stringUtf8CV("No picture"),
          number: uintCV(1),
          uri: stringAsciiCV(""),
        }),
      ]),
    ],
    senderKey: secretKey,
    network,
  });

  //const result = await handleTransaction(transaction);
  //console.log(result);
  const transaction2 = await makeContractCall({
    contractAddress,
    contractName: "boom-nfts",
    functionName: "transfer",
    functionArgs: [
      uintCV(1),
      standardPrincipalCV("ST12EY99GS4YKP0CP2CFW6SEPWQ2CGVRWK5GHKDRV"),
      standardPrincipalCV("ST10S31Y7G0A1A18J5C6CFVXWRW62CQRMF2YPE097"),
    ],
    postConditionMode: PostConditionMode.Allow,
    senderKey: secretKey,
    network,
  });
  const result2 = await handleTransaction(transaction2);
  console.log(result2);
}

(async (action: number = 0) => {
  switch (action) {
    case 3:
      await mintNFTs();
    case 2:
      await deployContract("nft-trait", "../clarity-smart-contracts/contracts/sips/nft-trait.clar");
      break;
    case 1:

      await faucetCall("ST2MY1BVKR8W8NF58N2GX6JDZDRT5CXP6RVZ097M4");
      break;
    default:
      await deployContract("tradables");
      await deployContract("market");
      await deployContract("hais");
      await deployContract("constant-tradables");


      break;
  }
})(0);
