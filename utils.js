var utils = {};

utils.isPalindrome = function(text) {
  var text = String(text);
  for (var i = 0; i < Math.floor(text.length / 2); i++)
    if (text[i] !== text[text.length - 1 - i])
      return false;
  return true;
}

module.exports = utils;