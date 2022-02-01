let IDX = 36;
let HEX = "";
while (IDX--) HEX += IDX.toString(36);

export default function (length = 10) {
  let str = "";
  while (length--) str += HEX[(Math.random() * 36) | 0];
  return str;
}
