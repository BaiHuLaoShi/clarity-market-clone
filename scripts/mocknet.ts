import { pubKeyfromPrivKey, publicKeyToString } from "@stacks/transactions";

// from default public Stacks.toml file
export const ADDR1 = "ST380Y4PNAPGY1JJ26P3AZ3S1B6QE43AHH46SMS1B";
export const ADDR2 = "ST1GSY3QDKVNCJB7J452VCRG6PVH7RQQPGX24MMR9";
export const ADDR3 = "ST1Y3GCS2BXYR0N273R72JB7E1VNH9V2PVM6NPH4W";
export const ADDR4 = "ST33JF308DWFJ768QEYPT1H3R7NEBVNHDB2JNJSN6";

// from personal public Stacks.toml file
export const ADDR5 = "ST2ZZ73DH4SHW6Z9SHV141X6Y16NBY7XMWEHJ6373";

export const testnetKeys: { secretKey: string; stacksAddress: string }[] = [
  {
    secretKey:
      "213d180b5113835831208364cd2d1110ed8f8386c0f3129dc63f72b527ffc48c01",
    stacksAddress: ADDR1,
  },
  {
    secretKey:
      "07c59053e7a300a093b835226afd486e634de507f95e0bc31ae60b30dc0c0e3f01",
    stacksAddress: ADDR2,
  },
  {
    secretKey:
      "762bf312de5945f006417eb602d0f0abfef44338c07954ee785f08f03f753c6b01",
    stacksAddress: ADDR3,
  },
  {
    secretKey:
      "a964b69c5e604a1fc956ce4e08febea76d67ba1dcf20a799556c32a6f537e69301",
    stacksAddress: ADDR4,
  },
  {
    secretKey:
      "316e9894649c3e5b5099e328449b68a48a50dee18f1f51c3707eeb621924ec7f01",
    stacksAddress: ADDR5,
  },
];

export const testnetKeyMap: Record<
  string,
  { address: string; secretKey: string; pubKey: string }
> = Object.fromEntries(
  testnetKeys.map((t) => [
    t.stacksAddress,
    {
      address: t.stacksAddress,
      secretKey: t.secretKey,
      pubKey: publicKeyToString(pubKeyfromPrivKey(t.secretKey)),
    },
  ])
);