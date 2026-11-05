export type CourseTermSense = {
  meaning: string;
  example?: string;
  name?: string;
  category?: string;
  aliases?: string[];
};
const senses: Record<string, Record<string, CourseTermSense>> = {
  'ai-model': {
    ai: {meaning: 'An AI model learns patterns from examples and uses them to make predictions or responses. A language model is one kind of AI model.'}
  },
  component: {
    css: {
      meaning:
        'A component is a reusable piece of a page, such as a panel. CSS controls how it looks.',
    },
  },
  state: {
    css: {
      category: 'web',
      meaning:
        'A state describes what is happening to an element, such as being pointed at or receiving keyboard focus.',
    },
  },
  'c-core-59': {
    kotlin: {
      meaning:
        'A coroutine mutex lets one task at a time enter a protected block. A task can pause while it waits.',
    },
  },
  'rust-core-24': {
    swift: {
      meaning:
        'A slice shows part of an array and keeps the positions from the original array.',
    },
  },
  'csharp-core-07': {
    python: {
      meaning:
        'With “and” or “or”, Python skips the right side if the left side already decides the result. It can return the value it chose.',
    },
  },
  'html-element': {
    javascript: {
      meaning:
        "An element is a node in the browser's model of a page. It can have other nodes inside it.",
    },
  },
  index: {
    python: {
      meaning:
        'An index tells Python which item to take from a list. The first item is at index 0.',
    },
    r: {
      meaning:
        'A positive index tells R which position to take. The first position is 1.',
      example: 'values[c(1, 3)] takes the first and third values.',
    },
    swift: {
      meaning:
        'An array index tells Swift which item to take. In this array, the first index is 0.',
    },
  },
  attribute: {
    html: {
      meaning: 'An attribute adds information inside an HTML opening tag.',
    },
    css: {
      category: 'web',
      meaning:
        'An HTML attribute is a setting inside a starting tag. A CSS selector can choose elements by that setting.',
    },
    python: {
      category: 'collections',
      meaning:
        'An attribute is a named detail you can look up on an object or its class.',
    },
    php: {
      category: 'language-tools',
      meaning:
        'An attribute attaches extra information to a piece of PHP code.',
    },
    r: {
      category: 'data',
      meaning:
        'An attribute is extra information attached to an R object, such as the unit for a measurement.',
    },
  },
  token: {
    ai: {
      category: 'ai',
      meaning:
        'A token is one piece a model uses to represent text. It can be a word, part of a word, or punctuation.',
    },
    php: {
      category: 'security',
      meaning:
        'Here a token is a value used to check a request. The program compares the value it receives with the one it expects.',
    },
    python: {
      category: 'security',
      meaning:
        'Here an access token is a secret value sent to a service to show that the caller has access.',
    },
    'developer-toolkit': {
      category: 'security',
      meaning:
        'Here a token is a secret that can grant access to a service. Keep it out of your project files.',
    },
    java: {
      category: 'basics',
      meaning:
        'Here a token is one piece of input that a Scanner can read, such as a whole number.',
    },
    go: {
      category: 'basics',
      meaning:
        'Here a token is one piece of input read by a Scanner. The splitting rule decides where each piece ends.',
    },
  },
  prompt: {
    python: {
      category: 'basics',
      meaning:
        'A prompt is the text Python shows when it asks you to type an answer.',
    },
  },
  'template-literal': {
    javascript: {
      name: 'Template literal',
      aliases: ['template literal', 'template literals', 'text interpolation'],
      meaning:
        'A template literal builds text inside backticks. Put an expression inside ${...} to insert its value.',
    },
    python: {
      name: 'f-string',
      aliases: ['f-string', 'f-strings', 'text interpolation'],
      meaning:
        'An f-string builds text with values inside it. Start the quoted text with f and put each value inside braces.',
    },
  },
  tuple: {
    python: {
      meaning:
        'A tuple keeps values in order. Once it exists, you cannot replace an item through its index.',
    },
  },
  immutable: {
    rust: {
      meaning:
        'An immutable binding keeps a name from being assigned a new value.',
    },
  },
  module: {
    go: { meaning: 'A Go module is a group of packages managed together.' },
    ruby: {
      meaning: 'A Ruby module groups methods that other code can reuse.',
    },
    rust: {
      meaning:
        'A Rust module groups code under a name and controls which items other code can reach.',
    },
  },
  'rust-core-68': {
    rust: {
      meaning:
        'Check each input and keep up to two valid study times. A rejected input does not use a spot.',
    },
    php: {
      meaning:
        'Check each input and keep up to two valid study times. A rejected input does not use a spot.',
    },
    ruby: {
      meaning:
        'Check each input and keep up to two valid study times. A rejected input does not use a spot.',
    },
  },
  'php-core-66': {
    ruby: {
      meaning:
        'A Ruby fiber can pause, hand a value to its caller, and continue when the caller resumes it.',
    },
    php: {
      meaning:
        'A PHP fiber can pause, hand a value to its caller, and continue when the caller resumes it.',
    },
  },
};
export function courseTermSense(
  id: string,
  course: string,
): CourseTermSense | undefined {
  return senses[id]?.[course];
}
