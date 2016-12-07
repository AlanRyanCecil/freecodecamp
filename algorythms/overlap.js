function factorial (number) {
    if (number < 0) {
        return -1;
    } else if (number === 0) {
        return 1;
    } else {
        return number * factorial(number - 1);
    }
}

function permAlone(str) {
    var dict = {};
    var letterCount;
    
    for (var letter in str) {
        dict[str[letter]] = dict[str[letter]] + 1 || 1;
    }
    
    var unique = Object.keys(dict);
    var dupes = str.length - unique.length;
    
    var total = factorial(str.length);
    var invalid = 0;
  
    var overlap = factorial(unique.length);  
    for (var thing in dict) {
        overlap *= factorial(dict[thing]);
    }
  
    for (var value in dict) {
        if (dict[value] > 1) {
            invalid += factorial(str.length - (dict[value] - 1)) * factorial(dict[value]);
        }
    }
   
    for (var item in unique) {
      letterCount = dict[unique[item]];
      
      if (letterCount - 1 > str.length - letterCount) {
        return 0;
      }
      
      if (letterCount - 1 === str.length - letterCount) {
        return factorial(letterCount) * factorial(str.length - letterCount);
      }
    }

    return dupes > 1 ? total - invalid + overlap : total - invalid;
}

permAlone('aaabb');