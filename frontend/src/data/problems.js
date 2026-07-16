// Frontend problem catalog. C++ added on top of talent-IQ's 5 problems.
export const PROBLEMS = {
  "two-sum": {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    category: "Array • Hash Table",
    description: {
      text: "Given an array of integers nums and an integer target, return indices of the two numbers in the array such that they add up to target.",
      notes: [
        "You may assume that each input would have exactly one solution, and you may not use the same element twice.",
        "You can return the answer in any order.",
      ],
    },
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]" },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]" },
      { input: "nums = [3,3], target = 6", output: "[0,1]" },
    ],
    constraints: ["2 ≤ nums.length ≤ 10⁴", "-10⁹ ≤ nums[i] ≤ 10⁹", "Only one valid answer exists"],
    starterCode: {
      javascript: `function twoSum(nums, target) {
  // Write your solution here

}

// Sample tests (Run):
console.log(twoSum([2,7,11,15], 9)); // Expected: [0,1]
console.log(twoSum([3,2,4], 6));     // Expected: [1,2]
console.log(twoSum([3,3], 6));       // Expected: [0,1]`,
      python: `def twoSum(nums, target):
    # Write your solution here
    pass

print(twoSum([2,7,11,15], 9))  # Expected: [0, 1]
print(twoSum([3,2,4], 6))      # Expected: [1, 2]
print(twoSum([3,3], 6))        # Expected: [0, 1]`,
      java: `import java.util.*;
public class Main {
    public static int[] twoSum(int[] nums, int target) {
        // Write your solution here
        return new int[0];
    }
    public static void main(String[] args) {
        System.out.println(Arrays.toString(twoSum(new int[]{2,7,11,15}, 9)));
        System.out.println(Arrays.toString(twoSum(new int[]{3,2,4}, 6)));
        System.out.println(Arrays.toString(twoSum(new int[]{3,3}, 6)));
    }
}`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    // Write your solution here
    return {};
}

int main() {
    vector<int> a = {2,7,11,15};
    auto r = twoSum(a, 9);
    cout << "[" << r[0] << "," << r[1] << "]" << endl;
    return 0;
}`,
    },
    expectedOutput: {
      javascript: "[0,1]\n[1,2]\n[0,1]",
      python: "[0, 1]\n[1, 2]\n[0, 1]",
      java: "[0, 1]\n[1, 2]\n[0, 1]",
      cpp: "[0,1]",
    },
  },

  "reverse-string": {
    id: "reverse-string",
    title: "Reverse String",
    difficulty: "Easy",
    category: "String • Two Pointers",
    description: {
      text: "Write a function that reverses a string. The input string is given as an array of characters s.",
      notes: ["You must do this by modifying the input array in-place with O(1) extra memory."],
    },
    examples: [
      { input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]' },
      { input: 's = ["H","a","n","n","a","h"]', output: '["h","a","n","n","a","H"]' },
    ],
    constraints: ["1 ≤ s.length ≤ 10⁵"],
    starterCode: {
      javascript: `function reverseString(s) {
  // Write your solution here

}

let a = ["h","e","l","l","o"];
reverseString(a);
console.log(a); // ["o","l","l","e","h"]

let b = ["H","a","n","n","a","h"];
reverseString(b);
console.log(b); // ["h","a","n","n","a","H"]`,
      python: `def reverseString(s):
    # Write your solution here
    pass

a = ["h","e","l","l","o"]
reverseString(a)
print(a)

b = ["H","a","n","n","a","h"]
reverseString(b)
print(b)`,
      java: `import java.util.*;
public class Main {
    public static void reverseString(char[] s) {
        // Write your solution here
    }
    public static void main(String[] args) {
        char[] a = {'h','e','l','l','o'};
        reverseString(a);
        System.out.println(Arrays.toString(a));
        char[] b = {'H','a','n','n','a','h'};
        reverseString(b);
        System.out.println(Arrays.toString(b));
    }
}`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

void reverseString(vector<char>& s) {
    // Write your solution here
}

int main() {
    vector<char> a = {'h','e','l','l','o'};
    reverseString(a);
    for (char c : a) cout << c;
    cout << endl;
    return 0;
}`,
    },
    expectedOutput: {
      javascript: '["o","l","l","e","h"]\n["h","a","n","n","a","H"]',
      python: "['o', 'l', 'l', 'e', 'h']\n['h', 'a', 'n', 'n', 'a', 'H']",
      java: "[o, l, l, e, h]\n[h, a, n, n, a, H]",
      cpp: "olleh",
    },
  },

  "valid-palindrome": {
    id: "valid-palindrome",
    title: "Valid Palindrome",
    difficulty: "Easy",
    category: "String • Two Pointers",
    description: {
      text: "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.",
      notes: ["Given a string s, return true if it is a palindrome, or false otherwise."],
    },
    examples: [
      { input: 's = "A man, a plan, a canal: Panama"', output: "true" },
      { input: 's = "race a car"', output: "false" },
    ],
    constraints: ["1 ≤ s.length ≤ 2 * 10⁵"],
    starterCode: {
      javascript: `function isPalindrome(s) {
  // Write your solution here

}

console.log(isPalindrome("A man, a plan, a canal: Panama"));
console.log(isPalindrome("race a car"));
console.log(isPalindrome(" "));`,
      python: `def isPalindrome(s):
    # Write your solution here
    pass

print(isPalindrome("A man, a plan, a canal: Panama"))
print(isPalindrome("race a car"))
print(isPalindrome(" "))`,
      java: `public class Main {
    public static boolean isPalindrome(String s) {
        // Write your solution here
        return false;
    }
    public static void main(String[] args) {
        System.out.println(isPalindrome("A man, a plan, a canal: Panama"));
        System.out.println(isPalindrome("race a car"));
        System.out.println(isPalindrome(" "));
    }
}`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

bool isPalindrome(string s) {
    // Write your solution here
    return false;
}

int main() {
    cout << boolalpha << isPalindrome("A man, a plan, a canal: Panama") << endl;
    cout << boolalpha << isPalindrome("race a car") << endl;
    cout << boolalpha << isPalindrome(" ") << endl;
    return 0;
}`,
    },
    expectedOutput: {
      javascript: "true\nfalse\ntrue",
      python: "True\nFalse\nTrue",
      java: "true\nfalse\ntrue",
      cpp: "true\nfalse\ntrue",
    },
  },

  "maximum-subarray": {
    id: "maximum-subarray",
    title: "Maximum Subarray",
    difficulty: "Medium",
    category: "Array • Dynamic Programming",
    description: {
      text: "Given an integer array nums, find the subarray with the largest sum, and return its sum.",
      notes: [],
    },
    examples: [
      { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6" },
      { input: "nums = [1]", output: "1" },
    ],
    constraints: ["1 ≤ nums.length ≤ 10⁵"],
    starterCode: {
      javascript: `function maxSubArray(nums) {
  // Write your solution here

}

console.log(maxSubArray([-2,1,-3,4,-1,2,1,-5,4]));
console.log(maxSubArray([1]));
console.log(maxSubArray([5,4,-1,7,8]));`,
      python: `def maxSubArray(nums):
    # Write your solution here
    pass

print(maxSubArray([-2,1,-3,4,-1,2,1,-5,4]))
print(maxSubArray([1]))
print(maxSubArray([5,4,-1,7,8]))`,
      java: `public class Main {
    public static int maxSubArray(int[] nums) {
        // Write your solution here
        return 0;
    }
    public static void main(String[] args) {
        System.out.println(maxSubArray(new int[]{-2,1,-3,4,-1,2,1,-5,4}));
        System.out.println(maxSubArray(new int[]{1}));
        System.out.println(maxSubArray(new int[]{5,4,-1,7,8}));
    }
}`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

int maxSubArray(vector<int>& nums) {
    // Write your solution here
    return 0;
}

int main() {
    vector<int> a = {-2,1,-3,4,-1,2,1,-5,4};
    cout << maxSubArray(a) << endl;
    return 0;
}`,
    },
    expectedOutput: {
      javascript: "6\n1\n23",
      python: "6\n1\n23",
      java: "6\n1\n23",
      cpp: "6",
    },
  },

  "container-with-most-water": {
    id: "container-with-most-water",
    title: "Container With Most Water",
    difficulty: "Medium",
    category: "Array • Two Pointers",
    description: {
      text: "You are given an integer array height of length n. Find two lines that together with the x-axis form a container that contains the most water.",
      notes: ["Return the maximum amount of water a container can store."],
    },
    examples: [
      { input: "height = [1,8,6,2,5,4,8,3,7]", output: "49" },
      { input: "height = [1,1]", output: "1" },
    ],
    constraints: ["n == height.length", "2 ≤ n ≤ 10⁵"],
    starterCode: {
      javascript: `function maxArea(height) {
  // Write your solution here

}

console.log(maxArea([1,8,6,2,5,4,8,3,7]));
console.log(maxArea([1,1]));`,
      python: `def maxArea(height):
    # Write your solution here
    pass

print(maxArea([1,8,6,2,5,4,8,3,7]))
print(maxArea([1,1]))`,
      java: `public class Main {
    public static int maxArea(int[] height) {
        // Write your solution here
        return 0;
    }
    public static void main(String[] args) {
        System.out.println(maxArea(new int[]{1,8,6,2,5,4,8,3,7}));
        System.out.println(maxArea(new int[]{1,1}));
    }
}`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

int maxArea(vector<int>& height) {
    // Write your solution here
    return 0;
}

int main() {
    vector<int> a = {1,8,6,2,5,4,8,3,7};
    cout << maxArea(a) << endl;
    return 0;
}`,
    },
    expectedOutput: {
      javascript: "49\n1",
      python: "49\n1",
      java: "49\n1",
      cpp: "49",
    },
  },
};

export const LANGUAGE_CONFIG = {
  javascript: { name: "JavaScript", icon: "/javascript.png", monacoLang: "javascript" },
  python:     { name: "Python",     icon: "/python.png",     monacoLang: "python" },
  java:       { name: "Java",       icon: "/java.png",       monacoLang: "java" },
  cpp:        { name: "C++",        icon: "/cpp.png",        monacoLang: "cpp" },
};
