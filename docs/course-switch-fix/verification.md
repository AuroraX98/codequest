# Course selection and guided output correction

Confirmed failure: the Courses card changed profile.track and level only. activeId, activeUnit, current lesson and route still pointed to C#. Learn therefore reopened C#, while Projects was correctly hidden for that stale concept lesson. The before-test reproduces activeId=csharp-01 after choosing Python.

The card and Tools return now call changeCourse: save the current draft, choose the first available beginner lesson in recommended order, atomically persist activeUnit/track/level, load it, and stay in Courses. Existing course chooser visibility preference is retained. The shared selection handler serializes preference writes and guards superseded navigation. No progress, reading marks, completion, settings reset or draft deletion added.

React regression executes actual source handlers with controlled async preference resolution: C#→Python, rapid Python→C#→Python, reload route, Projects availability and unchanged draft. Navigation roundtrip, manual chooser, Python content preservation, editor-access and TypeScript checks pass. This is React/JSDOM and source evidence, not a live browser screenshot.

Guided output panel previously mixed default pre/p margins with a separate18px footer rule and unaligned bare check paragraphs. Scoped grid uses12px gaps, check list8px gaps, stable icon column and wrapped labels. The footer has its own border/padding. Pre output is unchanged text with pre-wrap; run/check/completion logic unchanged. DOM test verifies output/check semantics and source CSS asserts bounded spacing. No other results panels or global layout altered.

GitHub synchronization remains paused. Curriculum unchanged.
