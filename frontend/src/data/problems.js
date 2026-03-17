// frontend/src/data/problems.js

export const PROBLEMS = {
  "two-sum": {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    category: "Array • Hash Table",

    description: {
      text: "Given an array of integers nums and a target, return indices of two numbers such that they add up to target.",
      notes: [
        "Each input has exactly one solution.",
        "You may not use the same element twice.",
      ],
    },

    starterCode: {
      javascript: `
// Two Sum - JavaScript

function twoSum(nums, target) {
  const map = new Map();

  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];

    if (map.has(need)) {
      return [map.get(need), i];
    }

    map.set(nums[i], i);
  }
}

// Test Cases (DO NOT REMOVE)
console.log(twoSum([2,7,11,15],9)); // [0,1]
console.log(twoSum([3,2,4],6));     // [1,2]
console.log(twoSum([3,3],6));       // [0,1]
`,
    },
  },

  "reverse-string": {
    id: "reverse-string",
    title: "Reverse String",
    difficulty: "Easy",
    category: "String • Two Pointers",

    description: {
      text: "Reverse the given string in-place.",
      notes: ["Use O(1) extra memory."],
    },

    starterCode: {
      javascript: `
// Reverse String - JavaScript

function reverseString(s) {
  let l = 0;
  let r = s.length - 1;

  while (l < r) {
    [s[l], s[r]] = [s[r], s[l]];
    l++;
    r--;
  }
}

// Test Cases (DO NOT REMOVE)
let a = ["h","e","l","l","o"];
reverseString(a);
console.log(a); // ["o","l","l","e","h"]

let b = ["H","a","n","n","a","h"];
reverseString(b);
console.log(b); // ["h","a","n","n","a","H"]
`,
    },
  },
};

export const LANGUAGE_CONFIG = {
  javascript: {
    name: "JavaScript",
    icon: "/javascript.png",
    monacoLang: "javascript",
  },

  python: {
    name: "Python",
    icon: "/python.png",
    monacoLang: "python",
  },

  java: {
    name: "Java",
    icon: "/java.png",
    monacoLang: "java",
  },

  cpp: {
    name: "C++",
    icon: "/cpp.png",
    monacoLang: "cpp",
  },
};