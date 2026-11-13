/** A small, complete example reviewed against one or more reading thoughts. */
export type IdeaExample = {
  code: string;
  language: string;
  output?: string;
  /** The demonstrated answers for an interactive input example. */
  stdin?: string;
  note: string;
};

export type IdeaExamples = {
  examples: IdeaExample[];
  /** One example index for each explain step, in the authored reading order. */
  thoughtExamples: number[];
};
