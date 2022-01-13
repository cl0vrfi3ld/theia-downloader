import Gun from "gun/gun";
import "gun/sea";
var SEA = Gun.SEA;

Gun.chain.subscribe = function (publish) {
  let gun = this;
  let at = gun._;

  // check if the map() function has been called
  let isMap = !!(at.back || {}).each;

  if (isMap) {
    // creates a temporary store for all values passed by map()
    let cache = new Map();
    publish(Array.from(cache));

    gun = gun.on((data, key, event) => {
      let _key = Gun.node.soul(data) || event.via.soul || key;

      cache.set(_key, data);

      publish(Array.from(cache));
    });
  } else {
    gun = gun.on(publish);
  }
  return gun.off;
};

doAuth();

const doAuth = async () => {
  const pairItem = localStorage.getItem("userPair");

  if (pairItem) {
    gun.user.auth(JSON.parse(pairItem));
  } else {
    // we're gonna create a keypair for this user.
    const newPair = await SEA.pair();
    gun.user.auth(newPair);

    localStorage.setItem("userPair", JSON.stringify(newPair));
  }
};

export const gun = Gun();

export const user = gun.user();
