/** A small, complete example reviewed against one or more reading thoughts. */
export type IdeaExample = {
  code: string;
  language: string;
  output?: string;
  /** The demonstrated answers for an interactive input example. */
  stdin?: string;
  /** Small companion files needed to understand or run the main example. */
  files?: { name: string; code: string; language: string }[];
  note: string;
};

/** Share a lesson's complete examples across its related explanation steps. */
export type CourseLessonExamples = {
  examples: IdeaExample[];
  sections: number[][];
};

export type IdeaExamples = {
  examples: IdeaExample[];
  /** One example index for each explain step, in the authored reading order. */
  thoughtExamples: number[];
};
