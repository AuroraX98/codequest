import type { CourseProject } from "./course-projects";
/** Topic-bound Python Basics choices. The existing pet-card and next-age projects bring this set to ten. */
export const additionalBasicsProjects: CourseProject[] = [
  {
    "id": "python-01-exhibit-card",
    "version": 1,
    "lessonId": "python-01",
    "title": "Museum exhibit card",
    "description": "Display an exhibit name and discovery year using two named values.",
    "outcome": "Display an exhibit name and discovery year using two named values.",
    "skills": [
      "text values",
      "number values",
      "names",
      "print"
    ],
    "requiredReading": [
      {
        "lessonId": "python-01",
        "sectionKey": "concept:program"
      },
      {
        "lessonId": "python-01",
        "sectionKey": "concept:values"
      },
      {
        "lessonId": "python-01",
        "sectionKey": "concept:strings"
      },
      {
        "lessonId": "python-01",
        "sectionKey": "concept:names"
      },
      {
        "lessonId": "python-01",
        "sectionKey": "concept:assignment"
      },
      {
        "lessonId": "python-01",
        "sectionKey": "concept:output"
      }
    ],
    "quantitative": false,
    "core": false,
    "filename": "exhibit_card.py",
    "starter": "",
    "steps": [
      {
        "id": "1",
        "instruction": "Give exhibit the text \"Moon rock\" and year the number 1969.",
        "checks": [
          {
            "label": "Values have the intended types",
            "expression": "exhibit == \"Moon rock\" and type(year) is int and year == 1969"
          }
        ]
      },
      {
        "id": "2",
        "instruction": "Print exhibit and year on one line, separated by a space. Pass both names to print, separated by a comma.",
        "checks": [
          {
            "label": "Both named values are displayed",
            "expression": "exhibit == \"Moon rock\" and type(year) is int and year == 1969 and __output == [\"Moon rock 1969\"]"
          }
        ]
      }
    ]
  },
  {
    "id": "python-01-research-topic",
    "version": 1,
    "lessonId": "python-01",
    "title": "Research topic switch",
    "description": "Print a first topic, replace its value, and print the new topic.",
    "outcome": "Print a first topic, replace its value, and print the new topic.",
    "skills": [
      "assignment",
      "reassignment",
      "strings",
      "print"
    ],
    "requiredReading": [
      {
        "lessonId": "python-01",
        "sectionKey": "concept:program"
      },
      {
        "lessonId": "python-01",
        "sectionKey": "concept:values"
      },
      {
        "lessonId": "python-01",
        "sectionKey": "concept:strings"
      },
      {
        "lessonId": "python-01",
        "sectionKey": "concept:names"
      },
      {
        "lessonId": "python-01",
        "sectionKey": "concept:assignment"
      },
      {
        "lessonId": "python-01",
        "sectionKey": "concept:output"
      }
    ],
    "quantitative": false,
    "core": false,
    "filename": "research_topic.py",
    "starter": "",
    "steps": [
      {
        "id": "1",
        "instruction": "Give topic the text \"Stars\". Print topic.",
        "checks": [
          {
            "label": "First topic is displayed",
            "expression": "topic == \"Stars\" and __output == [\"Stars\"]"
          }
        ]
      },
      {
        "id": "2",
        "instruction": "Keep those lines. Assign \"Oceans\" to the same name topic, then print topic again.",
        "checks": [
          {
            "label": "The same name displays a new value",
            "expression": "topic == \"Oceans\" and __output == [\"Stars\",\"Oceans\"]"
          }
        ]
      }
    ]
  },
  {
    "id": "python-01-goal-card",
    "version": 1,
    "lessonId": "python-01",
    "title": "Personal goal card",
    "description": "Show a goal name and its first action on separate lines.",
    "outcome": "Show a goal name and its first action on separate lines.",
    "skills": [
      "strings",
      "two names",
      "print order"
    ],
    "requiredReading": [
      {
        "lessonId": "python-01",
        "sectionKey": "concept:program"
      },
      {
        "lessonId": "python-01",
        "sectionKey": "concept:values"
      },
      {
        "lessonId": "python-01",
        "sectionKey": "concept:strings"
      },
      {
        "lessonId": "python-01",
        "sectionKey": "concept:names"
      },
      {
        "lessonId": "python-01",
        "sectionKey": "concept:assignment"
      },
      {
        "lessonId": "python-01",
        "sectionKey": "concept:output"
      }
    ],
    "quantitative": false,
    "core": false,
    "filename": "goal_card.py",
    "starter": "",
    "steps": [
      {
        "id": "1",
        "instruction": "Give goal the text \"Learn Python\" and action the text \"Run one line\".",
        "checks": [
          {
            "label": "Both names hold text",
            "expression": "goal == \"Learn Python\" and action == \"Run one line\""
          }
        ]
      },
      {
        "id": "2",
        "instruction": "Print goal first and action second, using two print calls.",
        "checks": [
          {
            "label": "Goal appears before its action",
            "expression": "goal == \"Learn Python\" and action == \"Run one line\" and __output == [\"Learn Python\",\"Run one line\"]"
          }
        ]
      }
    ]
  },
  {
    "id": "python-01-event-sign",
    "version": 1,
    "lessonId": "python-01",
    "title": "Event welcome sign",
    "description": "Combine fixed label text with a named event value.",
    "outcome": "Combine fixed label text with a named event value.",
    "skills": [
      "literal text",
      "named values",
      "print with commas"
    ],
    "requiredReading": [
      {
        "lessonId": "python-01",
        "sectionKey": "concept:program"
      },
      {
        "lessonId": "python-01",
        "sectionKey": "concept:values"
      },
      {
        "lessonId": "python-01",
        "sectionKey": "concept:strings"
      },
      {
        "lessonId": "python-01",
        "sectionKey": "concept:names"
      },
      {
        "lessonId": "python-01",
        "sectionKey": "concept:assignment"
      },
      {
        "lessonId": "python-01",
        "sectionKey": "concept:output"
      }
    ],
    "quantitative": false,
    "core": false,
    "filename": "event_sign.py",
    "starter": "",
    "steps": [
      {
        "id": "1",
        "instruction": "Give event the text \"Book Club\". Print \"Welcome to\" and event on the same line using a comma between print arguments.",
        "checks": [
          {
            "label": "Welcome sign is displayed",
            "expression": "event == \"Book Club\" and __output == [\"Welcome to Book Club\"]"
          }
        ]
      },
      {
        "id": "2",
        "instruction": "Keep the first sign. Assign \"Art Night\" to event, and print another welcome sign using the same pattern.",
        "checks": [
          {
            "label": "A changed value produces a new sign",
            "expression": "event == \"Art Night\" and __output == [\"Welcome to Book Club\",\"Welcome to Art Night\"]"
          }
        ]
      }
    ]
  },
  {
    "id": "python-01-shelf-label",
    "version": 1,
    "lessonId": "python-01",
    "title": "Shelf label",
    "description": "Keep a numeric shelf number separate from a text section name.",
    "outcome": "Keep a numeric shelf number separate from a text section name.",
    "skills": [
      "integers",
      "strings",
      "names",
      "print"
    ],
    "requiredReading": [
      {
        "lessonId": "python-01",
        "sectionKey": "concept:program"
      },
      {
        "lessonId": "python-01",
        "sectionKey": "concept:values"
      },
      {
        "lessonId": "python-01",
        "sectionKey": "concept:strings"
      },
      {
        "lessonId": "python-01",
        "sectionKey": "concept:names"
      },
      {
        "lessonId": "python-01",
        "sectionKey": "concept:assignment"
      },
      {
        "lessonId": "python-01",
        "sectionKey": "concept:output"
      }
    ],
    "quantitative": false,
    "core": false,
    "filename": "shelf_label.py",
    "starter": "",
    "steps": [
      {
        "id": "1",
        "instruction": "Give shelf the number 4 and section the text \"Science\".",
        "checks": [
          {
            "label": "Number and text are distinct values",
            "expression": "type(shelf) is int and shelf == 4 and section == \"Science\""
          }
        ]
      },
      {
        "id": "2",
        "instruction": "Print \"Shelf\", shelf, and section in one print call, separated by commas.",
        "checks": [
          {
            "label": "Label combines the values",
            "expression": "type(shelf) is int and shelf == 4 and section == \"Science\" and __output == [\"Shelf 4 Science\"]"
          }
        ]
      }
    ]
  },
  {
    "id": "python-01-name-or-value",
    "version": 1,
    "lessonId": "python-01",
    "title": "Name versus value display",
    "description": "Show the difference between quoted text and a variable\u2019s value.",
    "outcome": "Show the difference between quoted text and a variable\u2019s value.",
    "skills": [
      "strings",
      "names",
      "quoted versus unquoted"
    ],
    "requiredReading": [
      {
        "lessonId": "python-01",
        "sectionKey": "concept:program"
      },
      {
        "lessonId": "python-01",
        "sectionKey": "concept:values"
      },
      {
        "lessonId": "python-01",
        "sectionKey": "concept:strings"
      },
      {
        "lessonId": "python-01",
        "sectionKey": "concept:names"
      },
      {
        "lessonId": "python-01",
        "sectionKey": "concept:assignment"
      },
      {
        "lessonId": "python-01",
        "sectionKey": "concept:output"
      }
    ],
    "quantitative": false,
    "core": false,
    "filename": "name_or_value.py",
    "starter": "",
    "steps": [
      {
        "id": "1",
        "instruction": "Give topic the text \"Music\". Print the literal text \"topic\", including quotes around topic inside print.",
        "checks": [
          {
            "label": "Literal name appears",
            "expression": "topic == \"Music\" and __output == [\"topic\"]"
          }
        ]
      },
      {
        "id": "2",
        "instruction": "Keep that output. Add another print call that uses topic without quotes.",
        "checks": [
          {
            "label": "Value appears after the literal name",
            "expression": "topic == \"Music\" and __output == [\"topic\",\"Music\"]"
          }
        ]
      }
    ]
  },
  {
    "id": "python-01-status-update",
    "version": 1,
    "lessonId": "python-01",
    "title": "Task status update",
    "description": "Show a task changing from planned to finished.",
    "outcome": "Show a task changing from planned to finished.",
    "skills": [
      "assignment",
      "reassignment",
      "output order"
    ],
    "requiredReading": [
      {
        "lessonId": "python-01",
        "sectionKey": "concept:program"
      },
      {
        "lessonId": "python-01",
        "sectionKey": "concept:values"
      },
      {
        "lessonId": "python-01",
        "sectionKey": "concept:strings"
      },
      {
        "lessonId": "python-01",
        "sectionKey": "concept:names"
      },
      {
        "lessonId": "python-01",
        "sectionKey": "concept:assignment"
      },
      {
        "lessonId": "python-01",
        "sectionKey": "concept:output"
      }
    ],
    "quantitative": false,
    "core": false,
    "filename": "status_update.py",
    "starter": "",
    "steps": [
      {
        "id": "1",
        "instruction": "Give task the text \"Read a chapter\" and status the text \"Planned\". Print task and status together.",
        "checks": [
          {
            "label": "Initial task status appears",
            "expression": "task == \"Read a chapter\" and status == \"Planned\" and __output == [\"Read a chapter Planned\"]"
          }
        ]
      },
      {
        "id": "2",
        "instruction": "Keep the first print. Change only status to \"Finished\", then print task and status together again.",
        "checks": [
          {
            "label": "Task stays the same while its status changes",
            "expression": "task == \"Read a chapter\" and status == \"Finished\" and __output == [\"Read a chapter Planned\",\"Read a chapter Finished\"]"
          }
        ]
      }
    ]
  },
  {
    "id": "python-01-trip-card",
    "version": 1,
    "lessonId": "python-01",
    "title": "Trip information card",
    "description": "Build a three-line card from destination, traveler, and day values.",
    "outcome": "Build a three-line card from destination, traveler, and day values.",
    "skills": [
      "multiple named values",
      "strings",
      "integers",
      "ordered output"
    ],
    "requiredReading": [
      {
        "lessonId": "python-01",
        "sectionKey": "concept:program"
      },
      {
        "lessonId": "python-01",
        "sectionKey": "concept:values"
      },
      {
        "lessonId": "python-01",
        "sectionKey": "concept:strings"
      },
      {
        "lessonId": "python-01",
        "sectionKey": "concept:names"
      },
      {
        "lessonId": "python-01",
        "sectionKey": "concept:assignment"
      },
      {
        "lessonId": "python-01",
        "sectionKey": "concept:output"
      }
    ],
    "quantitative": false,
    "core": false,
    "filename": "trip_card.py",
    "starter": "",
    "steps": [
      {
        "id": "1",
        "instruction": "Give destination the text \"Forest\", traveler the text \"Ada\", and days the number 2.",
        "checks": [
          {
            "label": "Trip values are ready",
            "expression": "destination == \"Forest\" and traveler == \"Ada\" and type(days) is int and days == 2"
          }
        ]
      },
      {
        "id": "2",
        "instruction": "Use three print calls: destination first, traveler second, days third.",
        "checks": [
          {
            "label": "Card displays three values in order",
            "expression": "destination == \"Forest\" and traveler == \"Ada\" and type(days) is int and days == 2 and __output == [\"Forest\",\"Ada\",\"2\"]"
          }
        ]
      }
    ]
  }
];
