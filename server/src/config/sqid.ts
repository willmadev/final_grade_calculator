import Sqids from "sqids";

const SQID_ALPHABET = "of7mv5cgu8ke4d2qz9rbawysnl613xjth0ip";
const sqids = new Sqids({ alphabet: SQID_ALPHABET, minLength: 6 });

export const encodePublicId = (id: number) => sqids.encode([id]);
export const decodePublicId = (sqid: string) => {
  const decoded = sqids.decode(sqid)[0];
  if (sqids.encode([decoded]) !== sqid) throw new Error("Invalid id");
  return decoded;
};
