const emoji = require('emoji-dictionary');

const testString = "I jumped in a pit of fire when I was a boy";
let finalStringWords = []
for (let word of testString.split(" ")) {
  let emojiWord = emoji.getUnicode(word.toLowerCase());
  console.log(emojiWord);
  finalStringWords.push(emojiWord ? emojiWord : word);
}

console.log(finalStringWords.join(" "));