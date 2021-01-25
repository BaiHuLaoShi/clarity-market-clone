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
async function createMonster(monsterName: string) {
  console.log("create monster");

  const transaction = await makeContractCall({
    contractAddress,
    contractName: "monsters",
    functionName: "create-monster",
    functionArgs: [bufferCVFromString(monsterName)],
    senderKey: secretKey,
    network,
  });

  return handleTransaction(transaction);
}

async function feedMonster(monsterId: number) {
  console.log("feed monster");
  const transaction = await makeContractCall({
    contractAddress,
    contractName: "monsters",
    functionName: "feed-monster",
    functionArgs: [uintCV(monsterId)],
    senderKey: secretKey2,
    network,
  });

  return handleTransaction(transaction);
}

async function bid(trait: string, monsterId: number, price: number) {
  console.log("bid for tradable");
  const transaction = await makeContractCall({
    contractAddress,
    contractName: "market",
    functionName: "bid",
    functionArgs: [
      contractPrincipalCV(contractAddress, trait),
      uintCV(monsterId),
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
      //await deployContract("boom-nfts-v3", "../../../gitlab/riot.ai/boom.money/contracts/boom-nfts.clar");
      break;
    case 1:
      //await faucetCall("ST314JC8J24YWNVAEJJHQXS5Q4S9DX1FW5Z9DK9NT")
      //await faucetCall("ST33GW755MQQP6FZ58S423JJ23GBKK5ZKH3MGR55N");
      await faucetCall("ST2MY1BVKR8W8NF58N2GX6JDZDRT5CXP6RVZ097M4");
      //await faucetCall("ST9SW39M98MZXBGWSDVN228NW1NWENWCF321GWMK");
      //await faucetCall("ST12EY99GS4YKP0CP2CFW6SEPWQ2CGVRWK5GHKDRV");
      //await faucetCall("ST1CV2J4FK96CQM2TNMABV5YBF620R175GCVHM192");
      //await faucetCall("ST2NM3E9MAWWRNGFEKW75QR4XXVA856N4MHNMYA3T");
      break;
    default:
      await deployContract("tradables");
      await deployContract("market");
      await deployContract("monsters");
      await deployContract("constant-tradables");

      /*
      await deployContract("monsters");
      await deployContract("market");
      */

      // uncomment once #92 is fixed
      // await bid("constant-tradables", 1, 100);

      //await createMonster("Black Tiger");
      //await feedMonster(1);
      // await bid("monsters", 1, 100);
      break;
  }
})(0);
