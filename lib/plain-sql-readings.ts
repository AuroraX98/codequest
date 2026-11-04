const readings = [
  {
    "source": "SQL is a language for asking a database questions.",
    "simple": "SQL lets you ask for information kept in a database.",
    "runtime": "sql",
    "lesson": "sql-01"
  },
  {
    "source": "A database stores organized data.",
    "simple": "A database keeps information arranged so you can find and use it.",
    "runtime": "sql",
    "lesson": "sql-01"
  },
  {
    "source": "A table contains rows, one for each thing, and columns, one for each detail.",
    "simple": "Think of a table as a grid. Each row describes one item, and each column holds one kind of detail about it.",
    "runtime": "sql",
    "lesson": "sql-01"
  },
  {
    "source": "In the exercise, each books row describes one book.",
    "simple": "In the books table, one row holds the details of one book.",
    "runtime": "sql",
    "lesson": "sql-01"
  },
  {
    "source": "Its id identifies it, title stores its name, and status tells whether it has been read.",
    "simple": "The id tells books apart. The title holds the book's name, and status records whether it is read or unread.",
    "runtime": "sql",
    "lesson": "sql-01"
  },
  {
    "source": "Reading rows with SELECT does not edit those saved books.",
    "simple": "SELECT looks at the book records and gives you an answer. It does not change the saved records.",
    "runtime": "sql",
    "lesson": "sql-01"
  },
  {
    "source": "Here is a complete separate SQLite example.",
    "simple": "The next example uses SQLite, a kind of database. It includes its own setup and is separate from the exercise.",
    "runtime": "sql",
    "lesson": "sql-01"
  },
  {
    "source": "Run this block once in a fresh database.",
    "simple": "Use a new, empty database and run the whole block one time.",
    "runtime": "sql",
    "lesson": "sql-01"
  },
  {
    "source": "TEXT stores text;",
    "simple": "A column marked TEXT holds words or other text.",
    "runtime": "sql",
    "lesson": "sql-01"
  },
  {
    "source": "INTEGER stores whole numbers.",
    "simple": "A column marked INTEGER holds numbers without a fractional part, such as 3 rather than 3.5.",
    "runtime": "sql",
    "lesson": "sql-01"
  },
  {
    "source": "PRIMARY KEY makes each id identify one row.",
    "simple": "PRIMARY KEY makes id the value used to tell one row from all the others.",
    "runtime": "sql",
    "lesson": "sql-01"
  },
  {
    "source": "Parentheses group columns or values;",
    "simple": "The ( and ) marks put related columns or values together in a group.",
    "runtime": "sql",
    "lesson": "sql-01"
  },
  {
    "source": "commas separate them;",
    "simple": "A comma tells SQL where one column or value ends and the next begins.",
    "runtime": "sql",
    "lesson": "sql-01"
  },
  {
    "source": "a semicolon finishes each SQL statement.",
    "simple": "The ; mark tells SQL that one command has ended.",
    "runtime": "sql",
    "lesson": "sql-01"
  },
  {
    "source": "Single quotes mark text values.",
    "simple": "Put text between single quote marks, like 'unread', so SQL knows it is a text value.",
    "runtime": "sql",
    "lesson": "sql-01"
  },
  {
    "source": "The final query returns all three books and both selected columns.",
    "simple": "The last SELECT shows all three books, with each book's title and status.",
    "runtime": "sql",
    "lesson": "sql-01"
  },
  {
    "source": "INSERT supplies values in the table's column order.",
    "simple": "Here, INSERT puts each value into the matching position in the table: id first, title second, status third.",
    "runtime": "sql",
    "lesson": "sql-01"
  },
  {
    "source": "SELECT chooses the columns to return.",
    "simple": "SELECT says which details you want to see in the answer.",
    "runtime": "sql",
    "lesson": "sql-01"
  },
  {
    "source": "FROM names the table to read.",
    "simple": "FROM says which table contains the information you want.",
    "runtime": "sql",
    "lesson": "sql-01"
  },
  {
    "source": "WHERE tests each row and keeps only rows whose test is true.",
    "simple": "WHERE checks each row against a rule. Only rows for which the rule is true appear in the answer.",
    "runtime": "sql",
    "lesson": "sql-01"
  },
  {
    "source": "The equals sign in SQL compares values: status = 'unread' asks whether the status text matches unread.",
    "simple": "Here, = asks whether two values match. The test status = 'unread' asks whether this row's status is the text 'unread'.",
    "runtime": "sql",
    "lesson": "sql-01"
  },
  {
    "source": "This equals sign does not assign a new status.",
    "simple": "In this test, = checks the status; it does not change it to 'unread'.",
    "runtime": "sql",
    "lesson": "sql-01"
  },
  {
    "source": "Capitalized keywords make the query easier to scan;",
    "simple": "Writing SQL words such as SELECT in capitals helps you spot the commands quickly.",
    "runtime": "sql",
    "lesson": "sql-01"
  },
  {
    "source": "their capitalization does not change its meaning.",
    "simple": "SELECT and select mean the same thing. Changing the capital letters in these SQL keywords does not change the command.",
    "runtime": "sql",
    "lesson": "sql-01"
  },
  {
    "source": "Now run this query after the previous setup:",
    "simple": "Once the earlier setup has created and filled demo_books, run the next query.",
    "runtime": "sql",
    "lesson": "sql-01"
  },
  {
    "source": "FROM reads demo_books;",
    "simple": "FROM demo_books tells SQL to get its rows from the demo_books table.",
    "runtime": "sql",
    "lesson": "sql-01"
  },
  {
    "source": "WHERE keeps Ocean Map and Cloud Diary;",
    "simple": "The WHERE rule keeps Ocean Map and Cloud Diary because both have status 'unread'.",
    "runtime": "sql",
    "lesson": "sql-01"
  },
  {
    "source": "SELECT returns only their titles.",
    "simple": "SELECT title shows the names of those books, without their other details.",
    "runtime": "sql",
    "lesson": "sql-01"
  },
  {
    "source": "ORDER BY title arranges the returned titles alphabetically.",
    "simple": "ORDER BY title puts the answer's book titles in alphabetical order.",
    "runtime": "sql",
    "lesson": "sql-01"
  },
  {
    "source": "ASC means ascending, and is the default: Cloud Diary appears before Ocean Map.",
    "simple": "ASC asks for the usual forward order. It is also what ORDER BY uses if you leave ASC out, so Cloud Diary comes before Ocean Map.",
    "runtime": "sql",
    "lesson": "sql-01"
  },
  {
    "source": "The read book Apple Tree is excluded even though its title would sort first.",
    "simple": "Apple Tree would come first alphabetically, but it is marked read. The filter removes it before the remaining titles are sorted.",
    "runtime": "sql",
    "lesson": "sql-01"
  },
  {
    "source": "Without ORDER BY, the database promises no particular result order.",
    "simple": "If you leave out ORDER BY, you cannot rely on the rows appearing in any particular order.",
    "runtime": "sql",
    "lesson": "sql-01"
  },
  {
    "source": "The order may look stable on a small table and change later.",
    "simple": "A small table might return rows in the same order many times. That can change, so it is not a promise.",
    "runtime": "sql",
    "lesson": "sql-01"
  },
  {
    "source": "DESC requests descending order instead.",
    "simple": "Use DESC when you want the reverse order, such as largest to smallest or reverse alphabetical order.",
    "runtime": "sql",
    "lesson": "sql-01"
  },
  {
    "source": "Sorting changes the order of the answer, not the order in which the books are stored.",
    "simple": "Sorting rearranges the answer you see. It does not rearrange the saved book records.",
    "runtime": "sql",
    "lesson": "sql-01"
  },
  {
    "source": "For numbers, ascending goes from smaller to larger;",
    "simple": "Ascending number order means starting with the smallest number and moving upward.",
    "runtime": "sql",
    "lesson": "sql-01"
  },
  {
    "source": "for these English titles, it goes alphabetically.",
    "simple": "For these English book names, ascending order means alphabetical order.",
    "runtime": "sql",
    "lesson": "sql-01"
  },
  {
    "source": "For a numeric example, sorting 11, 3, 7 in ascending order produces 3, 7, 11: choose the smallest first, then the next smallest.",
    "simple": "Start with the smallest of 11, 3, 7: that is 3. Next comes 7, then 11, giving 3, 7, 11.",
    "runtime": "sql",
    "lesson": "sql-01"
  },
  {
    "source": "Sorting text uses text comparison, not numeric arithmetic.",
    "simple": "SQL compares text as text. It does not treat a text label like a number in a calculation.",
    "runtime": "sql",
    "lesson": "sql-01"
  },
  {
    "source": "The exercise wants a temporary answer table.",
    "simple": "For this exercise, put the result in a table called answer that lasts only for the current database session.",
    "runtime": "sql",
    "lesson": "sql-01"
  },
  {
    "source": "CREATE TEMP TABLE answer AS followed by SELECT saves that query's result in a table named answer for this database session.",
    "simple": "Write CREATE TEMP TABLE answer AS and then your SELECT query. This creates answer and fills it with the query's result for the current database session.",
    "runtime": "sql",
    "lesson": "sql-01"
  },
  {
    "source": "AS here connects the table to the query that fills it.",
    "simple": "Here, AS means that the query after it supplies the rows for the new table.",
    "runtime": "sql",
    "lesson": "sql-01"
  },
  {
    "source": "The starter has WHERE 0: zero is false, so it creates an empty answer table.",
    "simple": "The starter uses WHERE 0 to make every row fail the test. The answer table is created, but has no rows yet.",
    "runtime": "sql",
    "lesson": "sql-01"
  },
  {
    "source": "Replace that false condition with the actual status test, and select just title.",
    "simple": "Replace WHERE 0 with a test for the required status. Ask SELECT for only the title column.",
    "runtime": "sql",
    "lesson": "sql-01"
  },
  {
    "source": "Before running your exercise, inspect setup.sql.",
    "simple": "First open setup.sql to see which books the exercise starts with.",
    "runtime": "sql",
    "lesson": "sql-01"
  },
  {
    "source": "River Notes and Small Atlas are unread;",
    "simple": "River Notes and Small Atlas are the two books marked unread.",
    "runtime": "sql",
    "lesson": "sql-01"
  },
  {
    "source": "Moon Garden and Quiet Room are read.",
    "simple": "Moon Garden and Quiet Room are the two books marked read.",
    "runtime": "sql",
    "lesson": "sql-01"
  },
  {
    "source": "Keep only the unread rows and sort by title, so River Notes comes first.",
    "simple": "Include the unread books only, then sort their titles alphabetically. River Notes should appear before Small Atlas.",
    "runtime": "sql",
    "lesson": "sql-01"
  },
  {
    "source": "Use single quotes for SQL text in your own queries;",
    "simple": "When writing your own SQL, put text values inside single quotes, like 'unread'.",
    "runtime": "sql",
    "lesson": "sql-01"
  },
  {
    "source": "the supplied SQLite examples also accept their double-quoted text, but single quotes are the portable convention.",
    "simple": "These supplied SQLite examples also allow the text written in double quotes. Prefer single quotes for text because that form works across SQL databases.",
    "runtime": "sql",
    "lesson": "sql-01"
  },
  {
    "source": "A query can choose the right books and still fail an ordering check if you leave out ORDER BY.",
    "simple": "Picking the correct books is not enough if the test also checks their order. Include ORDER BY to request that order.",
    "runtime": "sql",
    "lesson": "sql-01"
  },
  {
    "source": "SQL can change saved rows as well as read them.",
    "simple": "SQL can add, edit, and remove stored records, not just look them up.",
    "runtime": "sql",
    "lesson": "sql-02"
  },
  {
    "source": "CREATE TABLE defines a table's columns.",
    "simple": "CREATE TABLE sets up a new table and says which columns it will have.",
    "runtime": "sql",
    "lesson": "sql-02"
  },
  {
    "source": "INSERT INTO adds a row;",
    "simple": "INSERT INTO puts a new row into a table.",
    "runtime": "sql",
    "lesson": "sql-02"
  },
  {
    "source": "UPDATE changes rows already there;",
    "simple": "UPDATE edits information in rows that already exist.",
    "runtime": "sql",
    "lesson": "sql-02"
  },
  {
    "source": "DELETE FROM removes rows.",
    "simple": "DELETE FROM takes rows out of a table.",
    "runtime": "sql",
    "lesson": "sql-02"
  },
  {
    "source": "These operations have different jobs.",
    "simple": "Creating a table, adding a row, editing a row, and removing a row are different actions. Choose the command for the action you need.",
    "runtime": "sql",
    "lesson": "sql-02"
  },
  {
    "source": "To make an edit safely, first be clear about which row you mean.",
    "simple": "Before changing data, decide exactly which row should change so you do not edit the wrong one.",
    "runtime": "sql",
    "lesson": "sql-02"
  },
  {
    "source": "An id is useful because a primary key identifies one row even when names are repeated.",
    "simple": "A primary-key id is unique to its row. It can pick the right row even if several rows have the same name.",
    "runtime": "sql",
    "lesson": "sql-02"
  },
  {
    "source": "Run this complete practice setup once in a fresh SQLite database:",
    "simple": "Start with a new, empty SQLite database, then run this whole setup block once.",
    "runtime": "sql",
    "lesson": "sql-02"
  },
  {
    "source": "The result has three rows.",
    "simple": "The final SELECT shows three records: Stones, Tickets, and Ribbons.",
    "runtime": "sql",
    "lesson": "sql-02"
  },
  {
    "source": "The explicit column list tells SQL which value belongs to which column.",
    "simple": "The list (id, name, count) says where each supplied value goes: first into id, second into name, third into count.",
    "runtime": "sql",
    "lesson": "sql-02"
  },
  {
    "source": "CHECK(count >= 0) refuses a row whose count is negative;",
    "simple": "CHECK(count >= 0) is a rule that rejects a negative count, such as -1.",
    "runtime": "sql",
    "lesson": "sql-02"
  },
  {
    "source": ">= means greater than or equal to.",
    "simple": "The symbol >= allows values that are bigger than the limit or exactly equal to it.",
    "runtime": "sql",
    "lesson": "sql-02"
  },
  {
    "source": "An INSERT can name its columns and give one new set of VALUES.",
    "simple": "An INSERT can list the columns it will fill, then use VALUES to supply the details of one new row.",
    "runtime": "sql",
    "lesson": "sql-02"
  },
  {
    "source": "An UPDATE uses SET to say what changes, then WHERE to choose the existing rows.",
    "simple": "In an UPDATE, SET says which values to change. WHERE says which existing rows should receive those changes.",
    "runtime": "sql",
    "lesson": "sql-02"
  },
  {
    "source": "In SET count = count + 1, the right side reads the old count and adds one;",
    "simple": "In SET count = count + 1, SQL first takes the current count and adds 1 to it.",
    "runtime": "sql",
    "lesson": "sql-02"
  },
  {
    "source": "the left side names the column that receives the result.",
    "simple": "The count on the left of = is the column where SQL saves that new total.",
    "runtime": "sql",
    "lesson": "sql-02"
  },
  {
    "source": "In WHERE id = 1, equals compares the id with 1.",
    "simple": "In WHERE id = 1, = asks whether the row's id is 1; it does not change the id.",
    "runtime": "sql",
    "lesson": "sql-02"
  },
  {
    "source": "Its meaning depends on its place.",
    "simple": "The same = sign has different jobs here: SET uses it to assign a value, while WHERE uses it to compare values.",
    "runtime": "sql",
    "lesson": "sql-02"
  },
  {
    "source": "Run this after the setup:",
    "simple": "After the earlier setup block finishes, run the next block on that same database.",
    "runtime": "sql",
    "lesson": "sql-02"
  },
  {
    "source": "You get Stones with 7, Train tickets with 2, and Pins with 3.",
    "simple": "The finished records have these counts: Stones 7, Train tickets 2, and Pins 3.",
    "runtime": "sql",
    "lesson": "sql-02"
  },
  {
    "source": "The first command adds;",
    "simple": "The first command inserts the new Pins row.",
    "runtime": "sql",
    "lesson": "sql-02"
  },
  {
    "source": "the next two edit;",
    "simple": "The next two commands change existing rows: one increases Stones, and one renames Tickets.",
    "runtime": "sql",
    "lesson": "sql-02"
  },
  {
    "source": "the fourth removes Ribbons.",
    "simple": "The fourth command deletes the Ribbons row.",
    "runtime": "sql",
    "lesson": "sql-02"
  },
  {
    "source": "The last query reads the finished table.",
    "simple": "The final SELECT shows the table after all the changes.",
    "runtime": "sql",
    "lesson": "sql-02"
  },
  {
    "source": "WHERE is especially important for writes.",
    "simple": "When changing or removing data, WHERE limits which rows your command affects. Check that rule carefully.",
    "runtime": "sql",
    "lesson": "sql-02"
  },
  {
    "source": "UPDATE without WHERE changes every row;",
    "simple": "If you leave WHERE out of UPDATE, the change applies to every row in the table.",
    "runtime": "sql",
    "lesson": "sql-02"
  },
  {
    "source": "DELETE without WHERE removes every row.",
    "simple": "If you leave WHERE out of DELETE, all rows are removed from the table.",
    "runtime": "sql",
    "lesson": "sql-02"
  },
  {
    "source": "A WHERE that matches nothing makes no change, like the starter's id = -1.",
    "simple": "If no row passes WHERE, nothing is changed. The starter uses id = -1 because no exercise row has that id.",
    "runtime": "sql",
    "lesson": "sql-02"
  },
  {
    "source": "Before editing, a SELECT with the same WHERE can show which rows will match.",
    "simple": "Before making an edit, try SELECT with the same WHERE rule. Its result shows which rows the edit would affect.",
    "runtime": "sql",
    "lesson": "sql-02"
  },
  {
    "source": "A text comparison must match the stored name, including its spaces.",
    "simple": "When you test a stored name, spaces are part of the text too. Use the name as it is saved.",
    "runtime": "sql",
    "lesson": "sql-02"
  },
  {
    "source": "Renaming a row also changes which name will match next time.",
    "simple": "After you rename a row, a later name test must use its new name rather than its old one.",
    "runtime": "sql",
    "lesson": "sql-02"
  },
  {
    "source": "The exercise already supplies collection, so do not create it again.",
    "simple": "The exercise has already created collection for you. Work with that table instead of trying to create it again.",
    "runtime": "sql",
    "lesson": "sql-02"
  },
  {
    "source": "Add Cards with id 4 and count 1, increase Shells from 3 to 4, rename Badges to Travel badges, and remove Coins.",
    "simple": "Make four changes: add Cards with id 4 and count 1; change Shells from 3 to 4; rename Badges to Travel badges; delete Coins.",
    "runtime": "sql",
    "lesson": "sql-02"
  },
  {
    "source": "Each edit should have a narrow condition.",
    "simple": "Give each edit a WHERE rule that picks only its intended row.",
    "runtime": "sql",
    "lesson": "sql-02"
  },
  {
    "source": "A final SELECT can help you see the rows, but this exercise checks collection itself;",
    "simple": "You can use SELECT to inspect your work, but the exercise checks the saved collection table itself.",
    "runtime": "sql",
    "lesson": "sql-02"
  },
  {
    "source": "creating a separate answer table does not perform the requested edits.",
    "simple": "Making an answer table only creates a separate result. It does not make the required changes to collection.",
    "runtime": "sql",
    "lesson": "sql-02"
  },
  {
    "source": "Check both values and membership: exactly three rows should remain, with no Coins row.",
    "simple": "Check which rows remain as well as their values. There must be exactly three rows, and Coins must not be one of them.",
    "runtime": "sql",
    "lesson": "sql-02"
  },
  {
    "source": "Increasing a count should leave the other counts alone.",
    "simple": "When you raise one row's count, the counts in the other rows should not change.",
    "runtime": "sql",
    "lesson": "sql-02"
  },
  {
    "source": "INSERT does not rename an old row, and ORDER BY does not add one.",
    "simple": "INSERT adds a new row rather than renaming an existing one. ORDER BY only sorts results; it does not add rows.",
    "runtime": "sql",
    "lesson": "sql-02"
  },
  {
    "source": "If you rerun an INSERT in the same unchanged database, the repeated primary key can cause an error;",
    "simple": "Running the same INSERT again may try to reuse an id that is already present. A primary key must be unique, so that can cause an error.",
    "runtime": "sql",
    "lesson": "sql-02"
  },
  {
    "source": "use a fresh practice setup when starting this walkthrough again.",
    "simple": "To repeat the walkthrough from the beginning, start with a fresh database and run its setup again.",
    "runtime": "sql",
    "lesson": "sql-02"
  },
  {
    "source": "Counting uses the same idea of one added item per step.",
    "simple": "A count grows by one each time you add one more item.",
    "runtime": "sql",
    "lesson": "sql-02"
  },
  {
    "source": "If you record one task each day for seven days, the count is 7 × 1 = 7.",
    "simple": "Recording one task on each of seven days gives 7 × 1 = 7 tasks in total.",
    "runtime": "sql",
    "lesson": "sql-02"
  },
  {
    "source": "Updating a count by one once per day would produce 1, 2, 3, 4, 5, 6, 7.",
    "simple": "Starting from zero and adding one each day gives these daily totals: 1, 2, 3, 4, 5, 6, 7.",
    "runtime": "sql",
    "lesson": "sql-02"
  },
  {
    "source": "A filter is a condition that decides which rows belong in a result.",
    "simple": "A filter is a rule for deciding which rows to include in the answer.",
    "runtime": "sql",
    "lesson": "sql-03"
  },
  {
    "source": "WHERE reads a row's details and asks a true-or-false question.",
    "simple": "WHERE checks a row's values against a question, such as whether its time is 8 minutes or less.",
    "runtime": "sql",
    "lesson": "sql-03"
  },
  {
    "source": "You can combine questions: AND requires both to be true;",
    "simple": "Use AND when a row must pass both tests to be included.",
    "runtime": "sql",
    "lesson": "sql-03"
  },
  {
    "source": "OR requires at least one.",
    "simple": "Use OR when passing either test is enough. Passing both also counts.",
    "runtime": "sql",
    "lesson": "sql-03"
  },
  {
    "source": "Choosing rows with SELECT and WHERE does not delete the rows that fail the filter.",
    "simple": "SELECT with WHERE only leaves failing rows out of the answer. It does not erase them from the database.",
    "runtime": "sql",
    "lesson": "sql-03"
  },
  {
    "source": "They stay in the saved table.",
    "simple": "Rows that fail the filter are still kept in the original table.",
    "runtime": "sql",
    "lesson": "sql-03"
  },
  {
    "source": "This complete SQLite setup gives us three activities to examine:",
    "simple": "The next SQLite block creates three activity records and includes a query to try on them.",
    "runtime": "sql",
    "lesson": "sql-03"
  },
  {
    "source": "The query returns Draw a leaf and Build a bridge. <= means less than or equal to: 8 passes, while 18 does not.",
    "simple": "The result includes Draw a leaf and Build a bridge. Both take 8 minutes, which passes <= 8, meaning 8 or less; 18 minutes fails.",
    "runtime": "sql",
    "lesson": "sql-03"
  },
  {
    "source": "The comparison symbols have precise boundaries. < excludes equality;",
    "simple": "Be precise about the limit. The < symbol means less than, so a value exactly on the limit does not pass.",
    "runtime": "sql",
    "lesson": "sql-03"
  },
  {
    "source": "<= includes it. > means greater than;",
    "simple": "The <= symbol means less than or equal to, so the limit itself passes. The > symbol means greater than, not equal to.",
    "runtime": "sql",
    "lesson": "sql-03"
  },
  {
    "source": ">= includes the equal case.",
    "simple": "The >= symbol means greater than or equal to, so a value exactly on the limit also passes.",
    "runtime": "sql",
    "lesson": "sql-03"
  },
  {
    "source": "For text, difficulty = 'easy' matches a particular stored value.",
    "simple": "The test difficulty = 'easy' asks whether the stored difficulty is the text 'easy'.",
    "runtime": "sql",
    "lesson": "sql-03"
  },
  {
    "source": "These two tests describe different details: being easy does not tell us how long an activity takes.",
    "simple": "Difficulty and time are separate details. An easy activity might still take a long time.",
    "runtime": "sql",
    "lesson": "sql-03"
  },
  {
    "source": "We need both tests when both requirements matter.",
    "simple": "If an activity must be both easy and quick enough, check both its difficulty and its time.",
    "runtime": "sql",
    "lesson": "sql-03"
  },
  {
    "source": "Run this on the same practice table:",
    "simple": "Use the same demo_activities table you just created to run this next query.",
    "runtime": "sql",
    "lesson": "sql-03"
  },
  {
    "source": "Only Draw a leaf appears.",
    "simple": "Draw a leaf is the only activity that is both easy and no longer than 8 minutes.",
    "runtime": "sql",
    "lesson": "sql-03"
  },
  {
    "source": "Build a bridge passes the time test but fails the difficulty test.",
    "simple": "Build a bridge takes only 8 minutes, but its difficulty is hard, not easy.",
    "runtime": "sql",
    "lesson": "sql-03"
  },
  {
    "source": "Read a chapter passes the difficulty test but fails the time test.",
    "simple": "Read a chapter is easy, but its 18 minutes are more than the 8-minute limit.",
    "runtime": "sql",
    "lesson": "sql-03"
  },
  {
    "source": "AND rejects both.",
    "simple": "AND leaves out both Build a bridge and Read a chapter because each fails one required test.",
    "runtime": "sql",
    "lesson": "sql-03"
  },
  {
    "source": "The line break before AND is just formatting;",
    "simple": "Putting AND on a new line only makes the query easier to read.",
    "runtime": "sql",
    "lesson": "sql-03"
  },
  {
    "source": "it remains part of the same WHERE condition.",
    "simple": "Even on a new line, AND still joins tests within the same WHERE rule.",
    "runtime": "sql",
    "lesson": "sql-03"
  },
  {
    "source": "If you used OR instead, all three practice activities would pass because each satisfies at least one condition.",
    "simple": "With OR, an activity would need to be easy or take at most 8 minutes, not necessarily both. Each of the three activities meets at least one of those rules.",
    "runtime": "sql",
    "lesson": "sql-03"
  },
  {
    "source": "Sorting cannot rescue a failed filter: ORDER BY arranges the rows that were kept;",
    "simple": "ORDER BY sorts only the rows that already passed WHERE. It cannot bring back a row that failed.",
    "runtime": "sql",
    "lesson": "sql-03"
  },
  {
    "source": "it does not make a false condition true.",
    "simple": "Sorting a row cannot change whether it passes the filter's rule.",
    "runtime": "sql",
    "lesson": "sql-03"
  },
  {
    "source": "Parentheses help make grouping explicit when a future query combines AND and OR, for example (difficulty = 'easy' OR difficulty = 'medium') AND minutes <= 8.",
    "simple": "Parentheses show which tests belong together. In (difficulty = 'easy' OR difficulty = 'medium') AND minutes <= 8, the activity may be easy or medium, but it must also take at most 8 minutes.",
    "runtime": "sql",
    "lesson": "sql-03"
  },
  {
    "source": "For the exercise, select name from activities and keep difficulty 'easy' AND minutes at most 10.",
    "simple": "For the exercise, read name from activities. Keep only rows marked 'easy' whose minutes are 10 or less, using AND between the tests.",
    "runtime": "sql",
    "lesson": "sql-03"
  },
  {
    "source": "Ten is included because the symbol is <=.",
    "simple": "Use <= 10 so an activity taking exactly 10 minutes is allowed.",
    "runtime": "sql",
    "lesson": "sql-03"
  },
  {
    "source": "An easy activity taking 25 minutes fails because 25 <= 10 is false.",
    "simple": "An easy activity that takes 25 minutes still fails. The test 25 <= 10 is false.",
    "runtime": "sql",
    "lesson": "sql-03"
  },
  {
    "source": "Save the selected names using CREATE TEMP TABLE answer AS followed by your query;",
    "simple": "Put CREATE TEMP TABLE answer AS before your SELECT query to save the chosen names in answer.",
    "runtime": "sql",
    "lesson": "sql-03"
  },
  {
    "source": "replace the starter's WHERE 0, which deliberately matches no rows.",
    "simple": "The starter's WHERE 0 intentionally lets no rows through. Replace it with the actual difficulty and time tests.",
    "runtime": "sql",
    "lesson": "sql-03"
  },
  {
    "source": "Read the supplied fixture before predicting the result.",
    "simple": "Look at the exercise's supplied starting data before deciding which names should appear.",
    "runtime": "sql",
    "lesson": "sql-03"
  },
  {
    "source": "Tiny quiz takes 5 minutes and Word puzzle takes 10, so both pass.",
    "simple": "Tiny quiz takes 5 minutes and Word puzzle takes 10 minutes. Both meet the exercise's easy-and-at-most-10-minutes rules.",
    "runtime": "sql",
    "lesson": "sql-03"
  },
  {
    "source": "Code maze and Logic grid do not pass the combined tests.",
    "simple": "Code maze and Logic grid each fail at least one required rule, so leave them out.",
    "runtime": "sql",
    "lesson": "sql-03"
  },
  {
    "source": "ORDER BY name puts Tiny quiz before Word puzzle.",
    "simple": "Sorting with ORDER BY name puts Tiny quiz first and Word puzzle second.",
    "runtime": "sql",
    "lesson": "sql-03"
  },
  {
    "source": "Keeping the query column as name matters because the check reads that column from answer.",
    "simple": "The result column must still be called name. The checker looks for that column in answer.",
    "runtime": "sql",
    "lesson": "sql-03"
  },
  {
    "source": "An aggregate function combines several values into one result.",
    "simple": "An aggregate function takes values from several rows and makes one summary result.",
    "runtime": "sql",
    "lesson": "sql-04"
  },
  {
    "source": "COUNT counts, SUM adds, and AVG finds the arithmetic average: total divided by the number of known values.",
    "simple": "COUNT tells you how many, SUM adds values, and AVG adds the known values and divides by how many known values there are.",
    "runtime": "sql",
    "lesson": "sql-04"
  },
  {
    "source": "GROUP BY makes separate groups before those calculations.",
    "simple": "GROUP BY separates rows into groups so each group gets its own calculation.",
    "runtime": "sql",
    "lesson": "sql-04"
  },
  {
    "source": "A report grouped by subject returns one row for each subject, rather than one row for every session.",
    "simple": "Grouping by subject gives one summary row for Art, one for Music, and so on. It does not give a separate row for every session.",
    "runtime": "sql",
    "lesson": "sql-04"
  },
  {
    "source": "Run this complete SQLite example once:",
    "simple": "Run the whole next SQLite example one time to create the practice data and check its counts.",
    "runtime": "sql",
    "lesson": "sql-04"
  },
  {
    "source": "The result is rows 4 and known_minutes 3.",
    "simple": "The result says rows is 4 and known_minutes is 3: there are four sessions, but only three have a known duration.",
    "runtime": "sql",
    "lesson": "sql-04"
  },
  {
    "source": "NULL represents an unknown or missing value.",
    "simple": "NULL means the database has no known value for that entry.",
    "runtime": "sql",
    "lesson": "sql-04"
  },
  {
    "source": "It is not zero and is not the text 'NULL'.",
    "simple": "NULL is neither the number 0 nor the word 'NULL'. It means a value is missing or unknown.",
    "runtime": "sql",
    "lesson": "sql-04"
  },
  {
    "source": "COUNT(*) counts rows;",
    "simple": "COUNT(*) counts every row, including rows that contain missing values.",
    "runtime": "sql",
    "lesson": "sql-04"
  },
  {
    "source": "COUNT(minutes) counts rows with a known minutes value.",
    "simple": "COUNT(minutes) counts only rows whose minutes are not NULL.",
    "runtime": "sql",
    "lesson": "sql-04"
  },
  {
    "source": "A function call puts its input inside parentheses, such as SUM(minutes).",
    "simple": "A function's parentheses hold the value or column it should use. For example, SUM(minutes) tells SUM to add the minutes values.",
    "runtime": "sql",
    "lesson": "sql-04"
  },
  {
    "source": "AS gives a result column a name, also called an alias.",
    "simple": "AS labels a result column. This label is called an alias, so AS total_minutes names that output total_minutes.",
    "runtime": "sql",
    "lesson": "sql-04"
  },
  {
    "source": "The * in COUNT(*) means count every row;",
    "simple": "In COUNT(*), the * tells SQL to count all rows, whether or not their values are missing.",
    "runtime": "sql",
    "lesson": "sql-04"
  },
  {
    "source": "it is not multiplication here.",
    "simple": "Here, * is part of COUNT(*). It does not mean multiply numbers.",
    "runtime": "sql",
    "lesson": "sql-04"
  },
  {
    "source": "SUM and AVG also ignore NULL inputs.",
    "simple": "SUM and AVG use the known values and skip values marked NULL.",
    "runtime": "sql",
    "lesson": "sql-04"
  },
  {
    "source": "Music's missing duration does not mean a zero-minute session, so it should not pull the known average down.",
    "simple": "The missing Music time is unknown, not a measured 0 minutes. Treating it as zero would incorrectly lower the average of known times.",
    "runtime": "sql",
    "lesson": "sql-04"
  },
  {
    "source": "Run this query after that setup:",
    "simple": "Once the earlier block has created demo_sessions, run this next query on it.",
    "runtime": "sql",
    "lesson": "sql-04"
  },
  {
    "source": "Art has count 2, total 36, average 18.",
    "simple": "Art has two known times, 12 and 24. They add to 36, and 36 divided by 2 gives an average of 18.",
    "runtime": "sql",
    "lesson": "sql-04"
  },
  {
    "source": "Music has count 1, total 18, average 18.",
    "simple": "Music has one known time, 18. Its known count is 1, its total is 18, and its average is also 18.",
    "runtime": "sql",
    "lesson": "sql-04"
  },
  {
    "source": "GROUP BY subject gives each function only the rows for that subject.",
    "simple": "GROUP BY subject keeps each subject's calculations separate. Art's functions use Art rows, and Music's functions use Music rows.",
    "runtime": "sql",
    "lesson": "sql-04"
  },
  {
    "source": "ORDER BY makes the report's order predictable.",
    "simple": "ORDER BY asks for a particular order so the report does not rely on whatever order the database happens to return.",
    "runtime": "sql",
    "lesson": "sql-04"
  },
  {
    "source": "If a group contains only NULL minutes, COUNT(minutes) is 0, while SUM(minutes) and AVG(minutes) are NULL.",
    "simple": "If all minutes in a group are NULL, COUNT(minutes) returns 0. SUM(minutes) and AVG(minutes) return NULL, not zero, because there are no known minutes.",
    "runtime": "sql",
    "lesson": "sql-04"
  },
  {
    "source": "The average is unknown because there are no known durations to divide by.",
    "simple": "There is no known duration to average. Dividing by a count of zero cannot give a measured average here.",
    "runtime": "sql",
    "lesson": "sql-04"
  },
  {
    "source": "A grouped query over an empty table returns no groups.",
    "simple": "If the table has no rows, GROUP BY has no groups to report, so the result has no group rows.",
    "runtime": "sql",
    "lesson": "sql-04"
  },
  {
    "source": "A nongrouped COUNT query over an empty table returns 0.",
    "simple": "Without GROUP BY, COUNT over an empty table still gives a count result: 0.",
    "runtime": "sql",
    "lesson": "sql-04"
  },
  {
    "source": "Keep these cases distinct instead of inventing a measured zero.",
    "simple": "No rows, no known values, and a measured value of zero are different situations. Do not present missing information as if someone measured zero.",
    "runtime": "sql",
    "lesson": "sql-04"
  },
  {
    "source": "The exercise needs subject and three named calculations: session_count, total_minutes, and average_minutes.",
    "simple": "Your result needs subject plus three calculated columns named session_count, total_minutes, and average_minutes.",
    "runtime": "sql",
    "lesson": "sql-04"
  },
  {
    "source": "Use COUNT(minutes), not COUNT(*), for the requested known-session count.",
    "simple": "Use COUNT(minutes) because the task wants to count sessions with known durations. COUNT(*) would also count sessions with missing durations.",
    "runtime": "sql",
    "lesson": "sql-04"
  },
  {
    "source": "Put all calculations in one SELECT and GROUP BY subject.",
    "simple": "Write the count, total, and average in one SELECT. Use GROUP BY subject so each subject has its own results.",
    "runtime": "sql",
    "lesson": "sql-04"
  },
  {
    "source": "CREATE TEMP TABLE answer AS saves that grouped result.",
    "simple": "Put CREATE TEMP TABLE answer AS before the grouped query to store its result in answer.",
    "runtime": "sql",
    "lesson": "sql-04"
  },
  {
    "source": "The starter's numeric zeros are placeholders, not calculated totals.",
    "simple": "The zeros in the starter are temporary stand-ins. Replace them with calculations that use the real rows.",
    "runtime": "sql",
    "lesson": "sql-04"
  },
  {
    "source": "In the supplied sessions, Math has 20 and 40: two known values, total 60, average 30.",
    "simple": "Math has known durations of 20 and 40. That makes a count of 2, a total of 60, and an average of 30.",
    "runtime": "sql",
    "lesson": "sql-04"
  },
  {
    "source": "Spanish has 30 and NULL, so its known count is 1 and its average is 30.",
    "simple": "Spanish has one known duration of 30 and one missing duration, NULL. Count only the known one, so the count is 1 and the average is 30.",
    "runtime": "sql",
    "lesson": "sql-04"
  },
  {
    "source": "Coding has one known value, 50.",
    "simple": "Coding has one recorded duration, and it is 50.",
    "runtime": "sql",
    "lesson": "sql-04"
  },
  {
    "source": "Keep the report honest about missing values.",
    "simple": "Let the report show when information is missing instead of quietly treating missing values as known numbers.",
    "runtime": "sql",
    "lesson": "sql-04"
  },
  {
    "source": "A correct total alone does not prove that the count or average is correct.",
    "simple": "Check the count and average separately from the total. A query can get the total right while calculating either of the other results incorrectly.",
    "runtime": "sql",
    "lesson": "sql-04"
  },
  {
    "source": "A join connects related rows from two tables.",
    "simple": "A join matches rows from one table with related rows in another table.",
    "runtime": "sql",
    "lesson": "sql-05"
  },
  {
    "source": "Each author has one id.",
    "simple": "Each author's record has an id that identifies that author.",
    "runtime": "sql",
    "lesson": "sql-05"
  },
  {
    "source": "A book's author_id points to the id of its author.",
    "simple": "The author_id on a book stores its author's id, linking the book to that author.",
    "runtime": "sql",
    "lesson": "sql-05"
  },
  {
    "source": "That relationship lets SQL attach the author's name to each book.",
    "simple": "By matching those ids, SQL can show the author's name beside the book's details.",
    "runtime": "sql",
    "lesson": "sql-05"
  },
  {
    "source": "Joining does not combine all books into a single text value: one author can appear in several output rows when that author has several books.",
    "simple": "A join does not squeeze an author's books into one piece of text. If an author has several matching books, the result can show that author on several rows.",
    "runtime": "sql",
    "lesson": "sql-05"
  },
  {
    "source": "Run this full SQLite setup and query in a fresh database:",
    "simple": "Start with a new, empty SQLite database and run the whole block to create both tables and query them.",
    "runtime": "sql",
    "lesson": "sql-05"
  },
  {
    "source": "This returns three matched rows: two for Nora, one for Luis.",
    "simple": "The query finds three author-and-book pairs: two books by Nora and one by Luis.",
    "runtime": "sql",
    "lesson": "sql-05"
  },
  {
    "source": "Imani has no matching book, so INNER JOIN leaves Imani out.",
    "simple": "INNER JOIN includes only matching pairs. Since Imani has no book in this table, Imani does not appear.",
    "runtime": "sql",
    "lesson": "sql-05"
  },
  {
    "source": "AS a and AS b give the tables short names.",
    "simple": "AS a lets the query call the authors table a, and AS b lets it call the books table b.",
    "runtime": "sql",
    "lesson": "sql-05"
  },
  {
    "source": "The dot in a.id means the id column from table a.",
    "simple": "In a.id, the part before the dot names the table and the part after it names the column. It means the id column in a.",
    "runtime": "sql",
    "lesson": "sql-05"
  },
  {
    "source": "ON specifies the matching condition: a book belongs to an author when b.author_id equals a.id.",
    "simple": "ON tells SQL which rows belong together. Here, match a book to an author when the book's b.author_id equals the author's a.id.",
    "runtime": "sql",
    "lesson": "sql-05"
  },
  {
    "source": "REFERENCES documents the relationship in the schema;",
    "simple": "REFERENCES records that a book's author_id is meant to refer to an author's id. This relationship is part of the table's definition.",
    "runtime": "sql",
    "lesson": "sql-05"
  },
  {
    "source": "the ON condition is still needed to tell this query how to join.",
    "simple": "Even with REFERENCES in the table definition, write ON so this particular query knows how to match rows.",
    "runtime": "sql",
    "lesson": "sql-05"
  },
  {
    "source": "SQLite enforcement of foreign keys must be enabled separately when you rely on that constraint.",
    "simple": "Do not assume SQLite will enforce the rule that author_id must refer to an existing author. Foreign-key enforcement must be turned on separately if you depend on it.",
    "runtime": "sql",
    "lesson": "sql-05"
  },
  {
    "source": "Run this query on the same tables:",
    "simple": "Keep the tables you just created and run this next query against them.",
    "runtime": "sql",
    "lesson": "sql-05"
  },
  {
    "source": "You get Nora/Garden Gate, Nora/Sea Path, Luis/Sky Notes, and Imani/NULL.",
    "simple": "The four results pair Nora with Garden Gate, Nora with Sea Path, Luis with Sky Notes, and Imani with NULL because Imani has no matching book.",
    "runtime": "sql",
    "lesson": "sql-05"
  },
  {
    "source": "LEFT JOIN preserves each left-side author.",
    "simple": "LEFT JOIN keeps every author from the table on the left, even authors without a matching book.",
    "runtime": "sql",
    "lesson": "sql-05"
  },
  {
    "source": "When there is no matching book, right-side columns are NULL in the result.",
    "simple": "For an author with no book match, the book-side fields in the answer contain NULL, meaning no value was found.",
    "runtime": "sql",
    "lesson": "sql-05"
  },
  {
    "source": "SQL has not stored an imaginary book for Imani.",
    "simple": "The NULL in Imani's result is just part of the query's answer. No made-up book has been added to the saved books table.",
    "runtime": "sql",
    "lesson": "sql-05"
  },
  {
    "source": "The left table matters.",
    "simple": "Choose the left table carefully: LEFT JOIN promises to keep rows from that side.",
    "runtime": "sql",
    "lesson": "sql-05"
  },
  {
    "source": "Putting books on the left preserves books, not bookless authors.",
    "simple": "If books is on the left, the query keeps books even without an author match. That does not keep authors who have no books.",
    "runtime": "sql",
    "lesson": "sql-05"
  },
  {
    "source": "Also, a later WHERE b.title IS NOT NULL removes the unmatched author rows and defeats this goal.",
    "simple": "Adding WHERE b.title IS NOT NULL afterward would throw away authors whose book title is missing. That would undo your aim of including authors with no book.",
    "runtime": "sql",
    "lesson": "sql-05"
  },
  {
    "source": "Use IS NULL to test missing values;",
    "simple": "To ask whether a value is missing, write IS NULL.",
    "runtime": "sql",
    "lesson": "sql-05"
  },
  {
    "source": "value = NULL does not mean 'is missing' in SQL.",
    "simple": "Do not use value = NULL to check for missing data. SQL does not treat that comparison as an 'is missing' test.",
    "runtime": "sql",
    "lesson": "sql-05"
  },
  {
    "source": "COUNT(*) on the joined result counts the unmatched placeholder row too, while COUNT(b.title) counts known titles.",
    "simple": "COUNT(*) counts every joined row, including the row kept for an author with no book. COUNT(b.title) counts only rows with a known book title.",
    "runtime": "sql",
    "lesson": "sql-05"
  },
  {
    "source": "Sets describe distinct members.",
    "simple": "A set is a collection where each different member is listed just once.",
    "runtime": "sql",
    "lesson": "sql-05"
  },
  {
    "source": "With A = {red, blue} and B = {blue, green}, blue is the only shared member, so the overlap has size 1.",
    "simple": "A = {red, blue} and B = {blue, green} both contain blue. No other member is in both, so their shared part has 1 member.",
    "runtime": "sql",
    "lesson": "sql-05"
  },
  {
    "source": "A join is related but can repeat matching rows: it is not automatically a set of distinct names.",
    "simple": "A join also looks for matches, but it can show repeated names when there are several matching rows. It does not automatically remove repeats like a set would.",
    "runtime": "sql",
    "lesson": "sql-05"
  },
  {
    "source": "The exercise supplies authors and books.",
    "simple": "The exercise already gives you two tables named authors and books.",
    "runtime": "sql",
    "lesson": "sql-05"
  },
  {
    "source": "Keep authors on the left, join books.author_id to authors.id, and select authors.name AS author with books.title.",
    "simple": "Begin with authors on the left. Match books.author_id to authors.id, then return authors.name AS author and books.title.",
    "runtime": "sql",
    "lesson": "sql-05"
  },
  {
    "source": "Save the query in the temporary answer table.",
    "simple": "Store the joined result in the temporary table named answer.",
    "runtime": "sql",
    "lesson": "sql-05"
  },
  {
    "source": "The author alias matters because the checks look for that result column.",
    "simple": "Name the author's output column author. The checker expects that exact result-column name.",
    "runtime": "sql",
    "lesson": "sql-05"
  },
  {
    "source": "There is no need to remove duplicate author names: repeated names represent distinct books.",
    "simple": "Keep an author's name on each of their book rows. Those repeated names are meaningful because the rows describe different books.",
    "runtime": "sql",
    "lesson": "sql-05"
  },
  {
    "source": "Ari Vale has two matches, Bo Lin has one, and Casey North has none.",
    "simple": "Ari Vale matches two books, Bo Lin matches one, and Casey North matches no books.",
    "runtime": "sql",
    "lesson": "sql-05"
  },
  {
    "source": "The LEFT JOIN therefore produces four rows, including Casey North with a NULL title.",
    "simple": "That LEFT JOIN gives four rows: two for Ari Vale, one for Bo Lin, and one for Casey North with NULL as the title.",
    "runtime": "sql",
    "lesson": "sql-05"
  },
  {
    "source": "If you got only three rows, check whether you used INNER JOIN or filtered out NULL.",
    "simple": "If you see only three rows, you may have used INNER JOIN or a filter that removes the NULL title. Either would lose Casey North.",
    "runtime": "sql",
    "lesson": "sql-05"
  },
  {
    "source": "If you got too many, check the ON relationship;",
    "simple": "If there are more rows than expected, inspect the matching rule after ON.",
    "runtime": "sql",
    "lesson": "sql-05"
  },
  {
    "source": "matching unrelated ids can pair rows incorrectly.",
    "simple": "Matching ids that do not represent the intended relationship can attach a book to the wrong author.",
    "runtime": "sql",
    "lesson": "sql-05"
  },
  {
    "source": "A subquery is a query placed inside another query.",
    "simple": "A subquery is a smaller query written inside a larger query.",
    "runtime": "sql",
    "lesson": "sql-06"
  },
  {
    "source": "It can calculate a number that the outer query uses for comparison.",
    "simple": "The smaller query can work out a number, then the larger query can compare a row's value with that number.",
    "runtime": "sql",
    "lesson": "sql-06"
  },
  {
    "source": "An overall average uses all scores.",
    "simple": "The overall average combines scores from every subject into one average.",
    "runtime": "sql",
    "lesson": "sql-06"
  },
  {
    "source": "A group average uses only one subject's scores.",
    "simple": "A subject's group average uses only the scores from that subject.",
    "runtime": "sql",
    "lesson": "sql-06"
  },
  {
    "source": "For this project, each learner's score must be compared with the average for that same subject.",
    "simple": "Compare each score with its own subject's average. Do not compare it with an average that mixes subjects.",
    "runtime": "sql",
    "lesson": "sql-06"
  },
  {
    "source": "Run this complete SQLite setup and overall-average query:",
    "simple": "Run this whole SQLite block to create the example scores and find scores above the overall average.",
    "runtime": "sql",
    "lesson": "sql-06"
  },
  {
    "source": "The inner query returns the overall average 72.",
    "simple": "The query inside parentheses averages all five scores and gives 72.",
    "runtime": "sql",
    "lesson": "sql-06"
  },
  {
    "source": "Only the Music scores 100 and 80 exceed it.",
    "simple": "The Music scores of 100 and 80 are the only scores greater than the overall average of 72.",
    "runtime": "sql",
    "lesson": "sql-06"
  },
  {
    "source": "Parentheses make the inner query a single value used by the outer > comparison.",
    "simple": "The parentheses surround the smaller query. Its average result becomes the single number on the right side of the outer > test.",
    "runtime": "sql",
    "lesson": "sql-06"
  },
  {
    "source": "A correlated subquery refers to the current row of the outer query.",
    "simple": "A correlated subquery is connected to the row the larger query is currently checking. It uses something from that row to choose its own data.",
    "runtime": "sql",
    "lesson": "sql-06"
  },
  {
    "source": "Give the outer and inner tables different aliases so the reference is clear.",
    "simple": "Give the two uses of the table different short names, called aliases. That makes it clear whether a column belongs to the outside or inside query.",
    "runtime": "sql",
    "lesson": "sql-06"
  },
  {
    "source": "Outer means the row we are deciding about now;",
    "simple": "The outer row is the score record we are checking to decide whether it belongs in the answer.",
    "runtime": "sql",
    "lesson": "sql-06"
  },
  {
    "source": "inner means rows being averaged.",
    "simple": "The inner rows are the score records used to work out the average for that check.",
    "runtime": "sql",
    "lesson": "sql-06"
  },
  {
    "source": "SQL decides results as if it checked each outer row, though the database may optimize how it does the work.",
    "simple": "You can understand the result as checking one outer row at a time. The database may use a faster method internally without changing that result.",
    "runtime": "sql",
    "lesson": "sql-06"
  },
  {
    "source": "Run the subject-average version on that setup:",
    "simple": "Using the same sample scores, run this version that compares each score with its subject's average.",
    "runtime": "sql",
    "lesson": "sql-06"
  },
  {
    "source": "Art's average is 60, so Leo's 70 passes.",
    "simple": "Art's scores average 60. Leo's Art score is 70, which is greater than 60, so that row is included.",
    "runtime": "sql",
    "lesson": "sql-06"
  },
  {
    "source": "Music's average is 90, so Nia's 100 passes.",
    "simple": "Music's scores average 90. Nia's Music score is 100, which is greater than 90, so that row is included.",
    "runtime": "sql",
    "lesson": "sql-06"
  },
  {
    "source": "Leo's 80 no longer passes.",
    "simple": "Leo's Music score of 80 is below the Music average of 90. It passed the overall-average test earlier, but fails this subject-average test.",
    "runtime": "sql",
    "lesson": "sql-06"
  },
  {
    "source": "The two aliases keep the inner subject tied to the outer row's subject.",
    "simple": "The names inner_score and outer_score show which table use each subject comes from. Matching them makes the inner average use the current outer row's subject.",
    "runtime": "sql",
    "lesson": "sql-06"
  },
  {
    "source": "Strictly above means >, not >=.",
    "simple": "Use > for strictly above. The symbol >= would also let an equal score through, which the task does not want.",
    "runtime": "sql",
    "lesson": "sql-06"
  },
  {
    "source": "A score equal to its group average is excluded.",
    "simple": "Leave out a score if it is exactly the same as its subject's average.",
    "runtime": "sql",
    "lesson": "sql-06"
  },
  {
    "source": "Be careful with an unqualified column inside a subquery: SQL searches the inner scope first.",
    "simple": "Inside a subquery, a bare column name such as subject is first looked for in that inner query. Include its table alias to avoid pointing at the wrong subject.",
    "runtime": "sql",
    "lesson": "sql-06"
  },
  {
    "source": "If both sides refer to the inner table, a condition can compare that row's subject with itself and average all subjects accidentally.",
    "simple": "If both subject names point to the inner row, the test only checks that row against itself. It may then average all subjects instead of the outer row's subject.",
    "runtime": "sql",
    "lesson": "sql-06"
  },
  {
    "source": "Different aliases and fully qualified columns make this mistake visible.",
    "simple": "Use different table aliases and write each column with its alias. This helps you see whether the comparison really links the inner and outer rows.",
    "runtime": "sql",
    "lesson": "sql-06"
  },
  {
    "source": "Your answer should contain learner, subject, and score for qualifying rows, saved using CREATE TEMP TABLE answer AS followed by the correlated SELECT.",
    "simple": "Return learner, subject, and score only for rows that pass the subject-average test. Put CREATE TEMP TABLE answer AS before that correlated SELECT to save the result.",
    "runtime": "sql",
    "lesson": "sql-06"
  },
  {
    "source": "In the corrected exercise fixture, Math has 70, 90, 80, and Dana's 81.",
    "simple": "The updated exercise data has four Math scores: 70, 90, 80, and Dana's 81.",
    "runtime": "sql",
    "lesson": "sql-06"
  },
  {
    "source": "Its average is (70 + 90 + 80 + 81) / 4 = 80.25, so Bo's 90 and Dana's 81 pass.",
    "simple": "Add the four Math scores and divide by 4: (70 + 90 + 80 + 81) / 4 = 80.25. Bo's 90 and Dana's 81 are both above 80.25, so they pass.",
    "runtime": "sql",
    "lesson": "sql-06"
  },
  {
    "source": "Spanish's average remains (95 + 75) / 2 = 85, so Ari's 95 passes.",
    "simple": "Spanish has scores 95 and 75, giving (95 + 75) / 2 = 85. Ari's 95 is above 85, so it passes.",
    "runtime": "sql",
    "lesson": "sql-06"
  },
  {
    "source": "There are three qualifying rows.",
    "simple": "Two Math rows and one Spanish row pass, giving three rows in the answer.",
    "runtime": "sql",
    "lesson": "sql-06"
  },
  {
    "source": "The quiz independently asks about just 70, 90, and 80: their average is 80, with only 90 above it.",
    "simple": "The quiz is a separate example with only 70, 90, and 80. Those average 80, so only 90 is above that average.",
    "runtime": "sql",
    "lesson": "sql-06"
  },
  {
    "source": "An average of no known scores is NULL.",
    "simple": "If there are no known scores to average, AVG returns NULL rather than a number.",
    "runtime": "sql",
    "lesson": "sql-06"
  },
  {
    "source": "A comparison such as score > NULL is unknown and does not pass WHERE.",
    "simple": "SQL cannot tell whether a score is greater than an unknown value. So score > NULL is unknown, and WHERE does not keep that row.",
    "runtime": "sql",
    "lesson": "sql-06"
  },
  {
    "source": "The supplied fixture has known scores in both subjects.",
    "simple": "In this exercise's supplied data, each of the two subjects has known scores to average.",
    "runtime": "sql",
    "lesson": "sql-06"
  },
  {
    "source": "To tell whether your query really uses subject averages, try a separate fixture like the walkthrough, where the overall average and group averages choose different rows.",
    "simple": "Test with another small dataset where the overall average and subject averages would pick different rows, like the walkthrough does. That helps reveal whether your query really matches subjects correctly.",
    "runtime": "sql",
    "lesson": "sql-06"
  },
  {
    "source": "Matching one small fixture alone can hide a correlation mistake.",
    "simple": "A query that links the inner and outer rows incorrectly might still pass one small example by luck. Try data that exposes the difference.",
    "runtime": "sql",
    "lesson": "sql-06"
  },
  {
    "source": "A window function calculates across related rows while keeping each original row in the result.",
    "simple": "A window function uses several related rows to calculate a value, but still keeps a separate result row for every original row.",
    "runtime": "sql",
    "lesson": "sql-07"
  },
  {
    "source": "GROUP BY usually reduces a group to one report row;",
    "simple": "GROUP BY normally turns all rows in each group into one summary row.",
    "runtime": "sql",
    "lesson": "sql-07"
  },
  {
    "source": "a window can attach a running total or rank to every practice row.",
    "simple": "A window calculation can instead add each row's running total or ranking position beside that row's original details.",
    "runtime": "sql",
    "lesson": "sql-07"
  },
  {
    "source": "OVER introduces the window's rules: which group to use, which order to follow, and which rows count for a calculation.",
    "simple": "OVER starts the rules for the window calculation. Those rules say which rows belong together, what order to use, and which of those rows to include each time.",
    "runtime": "sql",
    "lesson": "sql-07"
  },
  {
    "source": "Run this complete SQLite setup and running-total query:",
    "simple": "Run the whole SQLite block to set up the practice sessions and calculate their totals so far.",
    "runtime": "sql",
    "lesson": "sql-07"
  },
  {
    "source": "Art's totals are 10, 35, 60.",
    "simple": "Art's total so far starts at 10, then becomes 35 after adding 25, then 60 after adding another 25.",
    "runtime": "sql",
    "lesson": "sql-07"
  },
  {
    "source": "Music begins its own total at 8.",
    "simple": "Music uses a separate total, starting at its own first value of 8 rather than carrying on Art's total.",
    "runtime": "sql",
    "lesson": "sql-07"
  },
  {
    "source": "There are still four output rows.",
    "simple": "The result still has one row for each of the four practice sessions, even though totals have been added.",
    "runtime": "sql",
    "lesson": "sql-07"
  },
  {
    "source": "PARTITION BY subject separates the calculations by subject.",
    "simple": "PARTITION BY subject puts each subject's rows in their own group for the window calculation.",
    "runtime": "sql",
    "lesson": "sql-07"
  },
  {
    "source": "ORDER BY day, id inside OVER sets the order for accumulation.",
    "simple": "Inside OVER, ORDER BY day, id says to add rows in date order, using id to settle rows with the same date.",
    "runtime": "sql",
    "lesson": "sql-07"
  },
  {
    "source": "Fixed year-month-day text sorts these dates chronologically. id breaks a tie when two sessions share a day.",
    "simple": "These dates use a fixed year-month-day format, so their text order is also their time order. When two sessions are on the same day, id decides which comes first.",
    "runtime": "sql",
    "lesson": "sql-07"
  },
  {
    "source": "ROWS selects individual rows;",
    "simple": "ROWS makes the calculation's range use individual rows in the chosen order.",
    "runtime": "sql",
    "lesson": "sql-07"
  },
  {
    "source": "UNBOUNDED PRECEDING means the start of the partition, and CURRENT ROW means the row being calculated.",
    "simple": "UNBOUNDED PRECEDING starts at the first row in this subject's group. CURRENT ROW ends at the row whose total you are working out now.",
    "runtime": "sql",
    "lesson": "sql-07"
  },
  {
    "source": "SUM adds that whole frame.",
    "simple": "SUM adds the minutes from every row in that range, from the group's first row through the current row.",
    "runtime": "sql",
    "lesson": "sql-07"
  },
  {
    "source": "Run this ranking query after the same setup:",
    "simple": "On the same practice data, run this next query to rank the sessions by duration.",
    "runtime": "sql",
    "lesson": "sql-07"
  },
  {
    "source": "Both Art rows with 25 minutes get rank 1, and the 10-minute row gets rank 3.",
    "simple": "Art's two 25-minute sessions share first place, rank 1. The 10-minute session comes after both of them, so its rank is 3.",
    "runtime": "sql",
    "lesson": "sql-07"
  },
  {
    "source": "RANK leaves a gap after a tie because two rows occupy the first two positions.",
    "simple": "When two rows tie for rank 1, they occupy two positions. RANK therefore skips rank 2 and gives the next row rank 3.",
    "runtime": "sql",
    "lesson": "sql-07"
  },
  {
    "source": "Music's single row ranks 1.",
    "simple": "Music has only one session in its group, so that session is ranked first, with rank 1.",
    "runtime": "sql",
    "lesson": "sql-07"
  },
  {
    "source": "Empty parentheses mean RANK needs no direct input argument.",
    "simple": "Write RANK() with nothing inside the parentheses. RANK gets its ranking rules from OVER rather than from an input value inside ().",
    "runtime": "sql",
    "lesson": "sql-07"
  },
  {
    "source": "Each window has its own order.",
    "simple": "The order used for one window calculation does not have to match the order used for another.",
    "runtime": "sql",
    "lesson": "sql-07"
  },
  {
    "source": "Running totals need chronological order;",
    "simple": "To get totals that build over time, add the sessions from earliest to latest.",
    "runtime": "sql",
    "lesson": "sql-07"
  },
  {
    "source": "duration ranks need minutes descending, largest first.",
    "simple": "To rank by duration with the longest first, use minutes in descending order: largest to smallest.",
    "runtime": "sql",
    "lesson": "sql-07"
  },
  {
    "source": "Do not add id to the ranking order if equal durations should tie: that extra detail would separate them.",
    "simple": "If equal minutes should share a rank, do not also sort that ranking by id. Different ids would make those rows different for ranking instead of tied.",
    "runtime": "sql",
    "lesson": "sql-07"
  },
  {
    "source": "The outer ORDER BY controls display order, independently of the two window calculations.",
    "simple": "ORDER BY outside OVER decides how the finished answer is displayed. It is separate from the orders used to calculate running totals and ranks.",
    "runtime": "sql",
    "lesson": "sql-07"
  },
  {
    "source": "A rank of 1 does not move that row to the first displayed row by itself.",
    "simple": "Giving a row rank 1 only adds that rank value. It does not automatically put the row at the top of the displayed answer.",
    "runtime": "sql",
    "lesson": "sql-07"
  },
  {
    "source": "Mean is another name for the arithmetic average.",
    "simple": "Mean and arithmetic average refer to the same calculation: add the values and divide by how many there are.",
    "runtime": "sql",
    "lesson": "sql-07"
  },
  {
    "source": "For 3, 6, 9, add 3 + 6 + 9 = 18, then divide by their count 3: 18 / 3 = 6.",
    "simple": "For 3, 6, 9, the sum is 3 + 6 + 9 = 18. There are 3 values, so the mean is 18 / 3 = 6.",
    "runtime": "sql",
    "lesson": "sql-07"
  },
  {
    "source": "A running total stops at each current row;",
    "simple": "A running total adds values only as far as the row currently being shown, not through the later rows.",
    "runtime": "sql",
    "lesson": "sql-07"
  },
  {
    "source": "a mean also needs a denominator, so it is a different calculation.",
    "simple": "A mean divides a total by a count, called the denominator. A running total only adds, so the two are different calculations.",
    "runtime": "sql",
    "lesson": "sql-07"
  },
  {
    "source": "For the exercise, select subject, day, and minutes, then add running_total and duration_rank as named result columns.",
    "simple": "Your answer should show subject, day, and minutes for each row. Add the calculated columns named running_total and duration_rank.",
    "runtime": "sql",
    "lesson": "sql-07"
  },
  {
    "source": "Save that SELECT as answer.",
    "simple": "Store the result of that SELECT in the answer table.",
    "runtime": "sql",
    "lesson": "sql-07"
  },
  {
    "source": "The running-total frame must stop at the current row, rather than sum the entire partition every time.",
    "simple": "For each row's running total, include earlier rows and that row, but not later rows. Adding the whole subject every time would give a final total, not a running total.",
    "runtime": "sql",
    "lesson": "sql-07"
  },
  {
    "source": "RANK needs PARTITION BY subject so a Spanish session is compared with Spanish sessions.",
    "simple": "Put PARTITION BY subject in RANK's window rules. Then a Spanish session is ranked against other Spanish sessions, not against Math sessions.",
    "runtime": "sql",
    "lesson": "sql-07"
  },
  {
    "source": "The supplied Math durations are 20, 30, 30: chronological running totals 20, 50, 80.",
    "simple": "Math's durations in date order are 20, 30, 30. Their totals so far are 20, then 20 + 30 = 50, then 50 + 30 = 80.",
    "runtime": "sql",
    "lesson": "sql-07"
  },
  {
    "source": "The two 30-minute entries tie at duration rank 1.",
    "simple": "Both Math sessions lasting 30 minutes are equally longest, so both must have duration rank 1.",
    "runtime": "sql",
    "lesson": "sql-07"
  },
  {
    "source": "Spanish starts again at 15 and then totals 40.",
    "simple": "Spanish begins a separate running total at 15. After its next session, its total is 40.",
    "runtime": "sql",
    "lesson": "sql-07"
  },
  {
    "source": "Check the last Math total and both tied ranks;",
    "simple": "Check that the last Math running total is right and that both equal-duration rows have the right tied ranks.",
    "runtime": "sql",
    "lesson": "sql-07"
  },
  {
    "source": "these check different window rules.",
    "simple": "The final total checks the adding rule, while the shared ranks check how ties are handled. Those are separate parts of the window setup.",
    "runtime": "sql",
    "lesson": "sql-07"
  },
  {
    "source": "A correct final total does not prove the intermediate running totals or ranks are right.",
    "simple": "Getting the final sum right does not guarantee that earlier totals or rankings are correct. Check those results too.",
    "runtime": "sql",
    "lesson": "sql-07"
  },
  {
    "source": "An index is an extra structure the database maintains to help it find rows.",
    "simple": "An index is extra lookup information the database keeps so it can find useful rows without always searching the whole table.",
    "runtime": "sql",
    "lesson": "sql-08"
  },
  {
    "source": "Think of an index in a book: it can guide you to a topic without reading every page.",
    "simple": "A book's index points you toward the pages you need. A database index can similarly help find relevant rows without looking through every row.",
    "runtime": "sql",
    "lesson": "sql-08"
  },
  {
    "source": "SQL still decides which rows belong in the result.",
    "simple": "The query's SQL rules still decide what belongs in the answer. The index only helps the database find it.",
    "runtime": "sql",
    "lesson": "sql-08"
  },
  {
    "source": "An index should preserve those intended results;",
    "simple": "Adding an index should not change which results the query is meant to return.",
    "runtime": "sql",
    "lesson": "sql-08"
  },
  {
    "source": "it does not remove duplicates or make every query faster.",
    "simple": "An index does not remove repeated results, and some queries may get no speed benefit from it.",
    "runtime": "sql",
    "lesson": "sql-08"
  },
  {
    "source": "Here is a complete small SQLite dataset:",
    "simple": "The next SQLite block creates a small set of example book records and shows a query plan.",
    "runtime": "sql",
    "lesson": "sql-08"
  },
  {
    "source": "EXPLAIN QUERY PLAN reports how SQLite plans to find the result;",
    "simple": "EXPLAIN QUERY PLAN shows the method SQLite intends to use to find an answer.",
    "runtime": "sql",
    "lesson": "sql-08"
  },
  {
    "source": "it does not return the titles themselves.",
    "simple": "It reports the search plan, not the book titles that the SELECT would return.",
    "runtime": "sql",
    "lesson": "sql-08"
  },
  {
    "source": "The exact plan text can vary.",
    "simple": "The words shown in a query plan are not always exactly the same.",
    "runtime": "sql",
    "lesson": "sql-08"
  },
  {
    "source": "Without a helpful index it may scan rows and use temporary sorting work.",
    "simple": "Without a useful index, SQLite may look through rows and do extra temporary work to put the matches in order.",
    "runtime": "sql",
    "lesson": "sql-08"
  },
  {
    "source": "A scan examines many rows.",
    "simple": "A scan looks through many rows to see which ones are useful.",
    "runtime": "sql",
    "lesson": "sql-08"
  },
  {
    "source": "An indexed search can use indexed keys to narrow the search.",
    "simple": "An index-based search can use the values recorded in the index as clues, narrowing which rows it needs to look at.",
    "runtime": "sql",
    "lesson": "sql-08"
  },
  {
    "source": "A composite index has more than one column in a chosen order.",
    "simple": "A composite index keeps lookup information for several columns together. The order of those columns matters.",
    "runtime": "sql",
    "lesson": "sql-08"
  },
  {
    "source": "An index on genre, title first groups entries by genre, then orders titles within each genre.",
    "simple": "An index on genre, title arranges entries by genre first. Within each genre, it arranges them by title.",
    "runtime": "sql",
    "lesson": "sql-08"
  },
  {
    "source": "That fits a query that fixes one genre and sorts by title.",
    "simple": "That arrangement helps with a query that picks one genre and wants its titles in order.",
    "runtime": "sql",
    "lesson": "sql-08"
  },
  {
    "source": "LIMIT 2 asks for at most two returned rows.",
    "simple": "LIMIT 2 puts a ceiling of two rows on the answer. The query can return fewer if there are fewer matches.",
    "runtime": "sql",
    "lesson": "sql-08"
  },
  {
    "source": "Run this after the setup:",
    "simple": "After the earlier setup block finishes, run the next block on that same database.",
    "runtime": "sql",
    "lesson": "sql-08"
  },
  {
    "source": "The title result is Ancient Roads, then Stone Cities.",
    "simple": "The SELECT returns Ancient Roads first and Stone Cities second.",
    "runtime": "sql",
    "lesson": "sql-08"
  },
  {
    "source": "The new plan may mention the named index.",
    "simple": "After creating the index, EXPLAIN QUERY PLAN may name it as part of the method SQLite chooses.",
    "runtime": "sql",
    "lesson": "sql-08"
  },
  {
    "source": "CREATE INDEX builds it;",
    "simple": "CREATE INDEX tells the database to build the new lookup structure.",
    "runtime": "sql",
    "lesson": "sql-08"
  },
  {
    "source": "ON names the table and indexed columns.",
    "simple": "In CREATE INDEX, ON says which table to index and which columns to include.",
    "runtime": "sql",
    "lesson": "sql-08"
  },
  {
    "source": "The query's requested rows remain the same.",
    "simple": "Adding the index does not change the books the query asks for. The requested result stays the same.",
    "runtime": "sql",
    "lesson": "sql-08"
  },
  {
    "source": "An index costs storage and work during INSERT, UPDATE, and DELETE because its entries must stay current.",
    "simple": "An index takes up storage. When INSERT, UPDATE, or DELETE changes table data, the database also has to keep the index correct, which takes extra work.",
    "runtime": "sql",
    "lesson": "sql-08"
  },
  {
    "source": "SQLite chooses a plan;",
    "simple": "SQLite decides which method, or query plan, to use when it runs the query.",
    "runtime": "sql",
    "lesson": "sql-08"
  },
  {
    "source": "a tiny table may be fast even without an index.",
    "simple": "With very few rows, searching the table directly may already be quick even if there is no index.",
    "runtime": "sql",
    "lesson": "sql-08"
  },
  {
    "source": "Timing depends on machine load, database size, and caching.",
    "simple": "How long a query takes depends on how busy the computer is, how much data there is, and whether needed data is already cached for quick access.",
    "runtime": "sql",
    "lesson": "sql-08"
  },
  {
    "source": "Compare identical queries and verify identical results before calling an index helpful.",
    "simple": "Compare the same query with and without the index. Check that both give the same answer before deciding whether the index is an improvement.",
    "runtime": "sql",
    "lesson": "sql-08"
  },
  {
    "source": "A plan is evidence about strategy, not a guarantee of a particular duration.",
    "simple": "A query plan tells you about the method the database will use. It does not promise that the query will finish in a certain number of seconds.",
    "runtime": "sql",
    "lesson": "sql-08"
  },
  {
    "source": "A full scan that checks each of n rows once has linear work, written O(n).",
    "simple": "If a full scan checks every one of n rows once, its work grows in step with the row count. This is called linear work and written O(n).",
    "runtime": "sql",
    "lesson": "sql-08"
  },
  {
    "source": "If a 12-row table needs 12 comparisons, a similar 24-row full scan needs about 24: twice the input gives twice the comparisons.",
    "simple": "In this comparison, 12 rows take 12 checks and 24 rows take about 24 checks. Doubling the number of rows roughly doubles this scanning work.",
    "runtime": "sql",
    "lesson": "sql-08"
  },
  {
    "source": "This describes growth of work, not a guaranteed elapsed time.",
    "simple": "O(n) describes how the amount of work grows. It does not tell you an exact running time.",
    "runtime": "sql",
    "lesson": "sql-08"
  },
  {
    "source": "An index may avoid that full scan for a suitable query.",
    "simple": "For a query that fits the index, SQLite may use it to find matches without checking every row.",
    "runtime": "sql",
    "lesson": "sql-08"
  },
  {
    "source": "The exercise fixture creates 1,000 books with a recursive number generator.",
    "simple": "The exercise's setup makes 1,000 books by repeatedly generating the next number in a sequence.",
    "runtime": "sql",
    "lesson": "sql-08"
  },
  {
    "source": "WITH RECURSIVE names an intermediate numbers sequence;",
    "simple": "WITH RECURSIVE gives a name to the temporary number sequence used while the setup query runs.",
    "runtime": "sql",
    "lesson": "sql-08"
  },
  {
    "source": "UNION ALL appends the next values until value < 1000 becomes false.",
    "simple": "UNION ALL keeps adding the next generated number. The rule value < 1000 stops that step when the current value is no longer below 1000.",
    "runtime": "sql",
    "lesson": "sql-08"
  },
  {
    "source": "The || operator joins text, forming titles such as Book 10.",
    "simple": "The || symbol sticks pieces of text together. Here it joins Book and a number to make a title such as Book 10.",
    "runtime": "sql",
    "lesson": "sql-08"
  },
  {
    "source": "The % operator finds the remainder: value % 5 = 0 marks every fifth book history.",
    "simple": "The % symbol gives the remainder after division. A number with value % 5 = 0 divides evenly by 5, so every fifth book is marked history.",
    "runtime": "sql",
    "lesson": "sql-08"
  },
  {
    "source": "CASE WHEN chooses history for that condition, otherwise fiction.",
    "simple": "CASE WHEN picks history when that test is true. For the other books, it picks fiction.",
    "runtime": "sql",
    "lesson": "sql-08"
  },
  {
    "source": "These are setup mechanics;",
    "simple": "Those commands explain how the starter data is made; they are not the main changes you need to write.",
    "runtime": "sql",
    "lesson": "sql-08"
  },
  {
    "source": "your task is to add the index and query.",
    "simple": "Your job is to create the index and write the query that uses this book data.",
    "runtime": "sql",
    "lesson": "sql-08"
  },
  {
    "source": "Create the specifically named idx_books_genre_title on books(genre, title), then save the first five history titles in answer with ORDER BY title LIMIT 5.",
    "simple": "Create an index named exactly idx_books_genre_title on books(genre, title). Then filter for history and save the first five titles in answer, using ORDER BY title LIMIT 5.",
    "runtime": "sql",
    "lesson": "sql-08"
  },
  {
    "source": "These titles sort as text, so Book 100 appears before Book 20;",
    "simple": "The titles are compared as text, not as whole numbers. That puts Book 100 before Book 20.",
    "runtime": "sql",
    "lesson": "sql-08"
  },
  {
    "source": "title ordering does not sort their numeric suffixes as numbers.",
    "simple": "ORDER BY title compares the characters in the title. It does not take the number at the end out and sort it numerically.",
    "runtime": "sql",
    "lesson": "sql-08"
  },
  {
    "source": "Inspect EXPLAIN QUERY PLAN before and after locally.",
    "simple": "On your local database, look at EXPLAIN QUERY PLAN before adding the index, then look again after adding it.",
    "runtime": "sql",
    "lesson": "sql-08"
  },
  {
    "source": "The browser check establishes that the index exists and the result has five plausible titles;",
    "simple": "The browser test checks that the required index is present and that the result contains five titles that look plausible.",
    "runtime": "sql",
    "lesson": "sql-08"
  },
  {
    "source": "it does not prove a speed gain or every row's genre.",
    "simple": "Passing that test does not prove the query got faster, or even that every returned book has the right genre. Check those points separately.",
    "runtime": "sql",
    "lesson": "sql-08"
  },
  {
    "source": "A transaction groups related database changes into one unit.",
    "simple": "A transaction treats several related database edits as one piece of work, so they can be saved together or undone together.",
    "runtime": "sql",
    "lesson": "sql-09"
  },
  {
    "source": "BEGIN starts the unit;",
    "simple": "BEGIN tells SQL to start a transaction.",
    "runtime": "sql",
    "lesson": "sql-09"
  },
  {
    "source": "COMMIT saves it;",
    "simple": "COMMIT keeps the changes made in the transaction.",
    "runtime": "sql",
    "lesson": "sql-09"
  },
  {
    "source": "ROLLBACK discards its uncommitted changes.",
    "simple": "ROLLBACK undoes the transaction's changes that have not yet been committed.",
    "runtime": "sql",
    "lesson": "sql-09"
  },
  {
    "source": "A transfer should subtract from one record and add the same quantity to another, so their total stays unchanged.",
    "simple": "Moving an amount means taking it from one record and adding the same amount to another. The combined total should not go up or down.",
    "runtime": "sql",
    "lesson": "sql-09"
  },
  {
    "source": "Atomic means the intended changes succeed together or the earlier state is preserved.",
    "simple": "Atomic means all the intended changes happen together, or the data stays as it was before. A half-finished transfer should not be kept.",
    "runtime": "sql",
    "lesson": "sql-09"
  },
  {
    "source": "Run this complete SQLite example in a fresh database:",
    "simple": "Use a new, empty SQLite database to run this whole transfer example.",
    "runtime": "sql",
    "lesson": "sql-09"
  },
  {
    "source": "X now has 8 and Y has 9;",
    "simple": "After moving 4, X goes from 12 to 8, and Y goes from 5 to 9.",
    "runtime": "sql",
    "lesson": "sql-09"
  },
  {
    "source": "the total stays 17.",
    "simple": "The combined amount is still 17: before it was 12 + 5, and now it is 8 + 9.",
    "runtime": "sql",
    "lesson": "sql-09"
  },
  {
    "source": "NOT NULL requires a known quantity, and CHECK requires a nonnegative quantity.",
    "simple": "NOT NULL prevents a missing quantity. CHECK(quantity >= 0) prevents a quantity below zero.",
    "runtime": "sql",
    "lesson": "sql-09"
  },
  {
    "source": "The first UPDATE must match both the source id and sufficient stock.",
    "simple": "The first UPDATE must find the right source row and check that it has enough items to give away.",
    "runtime": "sql",
    "lesson": "sql-09"
  },
  {
    "source": "SQLite's changes() reports the row count changed by the most recently completed write.",
    "simple": "SQLite's changes() tells you how many rows the last completed data-changing command changed.",
    "runtime": "sql",
    "lesson": "sql-09"
  },
  {
    "source": "Immediately after that source UPDATE, changes() = 1 means one source row changed.",
    "simple": "Right after the source UPDATE, changes() = 1 checks that exactly one source row was changed.",
    "runtime": "sql",
    "lesson": "sql-09"
  },
  {
    "source": "The destination UPDATE uses that fact as its guard.",
    "simple": "The destination UPDATE adds the amount only if that source-row check passes. This prevents adding items when none were taken away.",
    "runtime": "sql",
    "lesson": "sql-09"
  },
  {
    "source": "Keep the two writes adjacent: an intervening write could change what changes() reports.",
    "simple": "Put the destination UPDATE immediately after the source UPDATE. Another write in between could replace the row count that changes() reports.",
    "runtime": "sql",
    "lesson": "sql-09"
  },
  {
    "source": "This pattern assumes the supplied destination exists and the source key identifies one row.",
    "simple": "This method depends on the destination row already being there and the source id picking exactly one row. Do not assume it handles other situations on its own.",
    "runtime": "sql",
    "lesson": "sql-09"
  },
  {
    "source": "Here is a rollback example after the first block:",
    "simple": "After running the first block, try this next example to see how cancelling a transaction works.",
    "runtime": "sql",
    "lesson": "sql-09"
  },
  {
    "source": "During the transaction the rows briefly become 6 and 11.",
    "simple": "Before the cancellation, the transaction temporarily changes X to 6 and Y to 11.",
    "runtime": "sql",
    "lesson": "sql-09"
  },
  {
    "source": "ROLLBACK cancels both edits, so the final query still shows 8 and 9.",
    "simple": "ROLLBACK undoes both changes. The final SELECT therefore shows X at 8 and Y at 9 again.",
    "runtime": "sql",
    "lesson": "sql-09"
  },
  {
    "source": "Merely running statements next to each other without a transaction does not provide this recovery.",
    "simple": "Putting two SQL commands beside each other is not enough to undo them as a unit. They need to be inside a transaction for this recovery method.",
    "runtime": "sql",
    "lesson": "sql-09"
  },
  {
    "source": "A SQL error does not always roll back an entire SQLite transaction automatically.",
    "simple": "Do not assume every SQL error cancels the whole transaction in SQLite. Some errors leave earlier changes in that transaction in place.",
    "runtime": "sql",
    "lesson": "sql-09"
  },
  {
    "source": "Real transfer code must handle errors and issue ROLLBACK when needed.",
    "simple": "Transfer code used in a real system must check for errors and run ROLLBACK when it needs to cancel the transaction.",
    "runtime": "sql",
    "lesson": "sql-09"
  },
  {
    "source": "It must also verify the destination write;",
    "simple": "Real transfer code must also check that the destination row was successfully changed.",
    "runtime": "sql",
    "lesson": "sql-09"
  },
  {
    "source": "if that destination did not exist, guarding only the source would be insufficient.",
    "simple": "If there were no destination row, the source might lose items without anyone receiving them. Checking only the source would not prevent that failure.",
    "runtime": "sql",
    "lesson": "sql-09"
  },
  {
    "source": "The exercise's fixed fixture provides both rows.",
    "simple": "This exercise's starting data includes both the source and the destination rows.",
    "runtime": "sql",
    "lesson": "sql-09"
  },
  {
    "source": "Its deliberate failure is insufficient stock, handled by making both updates no-ops rather than by throwing an error.",
    "simple": "The exercise deliberately tries to move more items than are available. Its checks make both UPDATE commands change nothing, rather than cause an error.",
    "runtime": "sql",
    "lesson": "sql-09"
  },
  {
    "source": "In the exercise, transfer 3 from A's 10 to B's 4 inside a transaction.",
    "simple": "Inside one transaction, move 3 items from A, which starts with 10, to B, which starts with 4.",
    "runtime": "sql",
    "lesson": "sql-09"
  },
  {
    "source": "Require quantity >= 3 on the source and changes() = 1 on the immediately following destination update.",
    "simple": "Check quantity >= 3 before taking items from A. In the very next UPDATE, require changes() = 1 before adding those items to B.",
    "runtime": "sql",
    "lesson": "sql-09"
  },
  {
    "source": "Commit the valid transfer.",
    "simple": "Use COMMIT to keep the successful 3-item transfer.",
    "runtime": "sql",
    "lesson": "sql-09"
  },
  {
    "source": "Then CREATE TEMP TABLE before_failed AS SELECT id, quantity FROM inventory records the finished state for comparison.",
    "simple": "Afterward, CREATE TEMP TABLE before_failed AS SELECT id, quantity FROM inventory copies the current ids and quantities into before_failed. You will compare against this saved copy later.",
    "runtime": "sql",
    "lesson": "sql-09"
  },
  {
    "source": "A snapshot here is a copied set of values, not another transfer.",
    "simple": "This snapshot is just a copy of the values at that moment. Making it does not move any more items.",
    "runtime": "sql",
    "lesson": "sql-09"
  },
  {
    "source": "Try the 99-unit attempt using the same guards.",
    "simple": "Next, attempt to move 99 items, using the same checks on the source and destination updates.",
    "runtime": "sql",
    "lesson": "sql-09"
  },
  {
    "source": "A has only 7, so the source changes zero rows;",
    "simple": "A has 7 items, which is not enough for 99. The source UPDATE therefore changes no rows.",
    "runtime": "sql",
    "lesson": "sql-09"
  },
  {
    "source": "changes() is 0, so the destination also changes zero.",
    "simple": "Because changes() now reports 0, the destination UPDATE also changes no rows. B receives nothing.",
    "runtime": "sql",
    "lesson": "sql-09"
  },
  {
    "source": "COMMIT then saves no changes.",
    "simple": "COMMIT ends this attempt without saving any changed quantities, because neither UPDATE changed a row.",
    "runtime": "sql",
    "lesson": "sql-09"
  },
  {
    "source": "Both stay at 7, their total remains 14, and the snapshot still matches.",
    "simple": "A and B both remain at 7. Together they still have 14, and their quantities still equal the copy in before_failed.",
    "runtime": "sql",
    "lesson": "sql-09"
  },
  {
    "source": "Conservation alone would not catch every incorrect distribution;",
    "simple": "An unchanged total does not prove each record has the right amount. Items could be divided incorrectly while still adding to the same total.",
    "runtime": "sql",
    "lesson": "sql-09"
  },
  {
    "source": "check both individual quantities and unchanged state after rejection.",
    "simple": "Check A and B separately, not just their combined total. Also check that the failed attempt leaves their values exactly as they were.",
    "runtime": "sql",
    "lesson": "sql-09"
  },
  {
    "source": "A directory should list each category once even when many supplies belong to it.",
    "simple": "The category list should show a category only once, even if several supplies have that category.",
    "runtime": "sql",
    "lesson": "sql-10"
  },
  {
    "source": "A SQL table stores rows under named columns.",
    "simple": "A SQL table is a grid of records. Each column has a name that tells you which detail it holds.",
    "runtime": "sql",
    "lesson": "sql-10"
  },
  {
    "source": "SELECT chooses columns;",
    "simple": "SELECT says which columns you want in the answer.",
    "runtime": "sql",
    "lesson": "sql-10"
  },
  {
    "source": "FROM chooses a table.",
    "simple": "FROM says which table to read those columns from.",
    "runtime": "sql",
    "lesson": "sql-10"
  },
  {
    "source": "DISTINCT removes duplicate result rows.",
    "simple": "DISTINCT keeps only one copy of each identical result row.",
    "runtime": "sql",
    "lesson": "sql-10"
  },
  {
    "source": "This lesson builds a reusable directory from the supplies table rather than manually typing the category names.",
    "simple": "Build the category list by querying supplies. That way you can reuse it without typing and maintaining the names by hand.",
    "runtime": "sql",
    "lesson": "sql-10"
  },
  {
    "source": "SELECT DISTINCT category returns each different category value once.",
    "simple": "SELECT DISTINCT category shows one copy of each different category, rather than one copy for every supply.",
    "runtime": "sql",
    "lesson": "sql-10"
  },
  {
    "source": "DISTINCT applies to the whole selected row.",
    "simple": "DISTINCT compares every selected column together when deciding whether two result rows are duplicates.",
    "runtime": "sql",
    "lesson": "sql-10"
  },
  {
    "source": "If you also select item_name, two rows with the same category and different items remain different rows.",
    "simple": "If you select both category and item_name, different item names make the rows different. Their category can then appear more than once.",
    "runtime": "sql",
    "lesson": "sql-10"
  },
  {
    "source": "Choose only the column that defines the directory entry.",
    "simple": "For one row per category, select only the category column, not extra item details.",
    "runtime": "sql",
    "lesson": "sql-10"
  },
  {
    "source": "This self-contained example uses a temporary set of values.",
    "simple": "The next example supplies its own small set of temporary values, so it does not need an existing table.",
    "runtime": "sql",
    "lesson": "sql-10"
  },
  {
    "source": "The result has paper and tools once each.",
    "simple": "Although paper is supplied twice, the answer lists paper once and tools once.",
    "runtime": "sql",
    "lesson": "sql-10"
  },
  {
    "source": "WITH gives this query a named input;",
    "simple": "WITH lets this query refer to its temporary input by the name supplies.",
    "runtime": "sql",
    "lesson": "sql-10"
  },
  {
    "source": "it does not create a permanent table.",
    "simple": "That WITH input exists for the query; it does not save a permanent supplies table in the database.",
    "runtime": "sql",
    "lesson": "sql-10"
  },
  {
    "source": "NULL represents missing information.",
    "simple": "NULL marks information that has no known value.",
    "runtime": "sql",
    "lesson": "sql-10"
  },
  {
    "source": "It differs from the empty string, which is present text of length zero.",
    "simple": "An empty string is text with no characters. It is different from NULL, which means no known value is present.",
    "runtime": "sql",
    "lesson": "sql-10"
  },
  {
    "source": "Use category IS NOT NULL to omit missing values and category <> '' to omit empty text.",
    "simple": "Use category IS NOT NULL to leave out unknown categories. Also use category <> '' to leave out text with zero characters; <> means not equal.",
    "runtime": "sql",
    "lesson": "sql-10"
  },
  {
    "source": "The AND keyword requires both conditions to hold.",
    "simple": "Join those checks with AND so a row must pass both, not just one.",
    "runtime": "sql",
    "lesson": "sql-10"
  },
  {
    "source": "Neither condition trims spaces or changes spelling.",
    "simple": "These tests do not remove spaces from text or fix its spelling. Text containing spaces is not automatically cleaned up.",
    "runtime": "sql",
    "lesson": "sql-10"
  },
  {
    "source": "A filter can run before duplicate removal.",
    "simple": "The WHERE rules can first leave out unwanted values, then DISTINCT can remove repeated results.",
    "runtime": "sql",
    "lesson": "sql-10"
  },
  {
    "source": "The result is A and B.",
    "simple": "After removing missing text, empty text, and duplicates, the answer lists A and B.",
    "runtime": "sql",
    "lesson": "sql-10"
  },
  {
    "source": "ORDER BY requests output order explicitly;",
    "simple": "ORDER BY tells SQL exactly which column to use to arrange the answer.",
    "runtime": "sql",
    "lesson": "sql-10"
  },
  {
    "source": "SQL does not promise a useful row order when it is omitted.",
    "simple": "Without ORDER BY, you cannot rely on the results appearing in the order you want.",
    "runtime": "sql",
    "lesson": "sql-10"
  },
  {
    "source": "A view is a saved query, not a separate copy of its results.",
    "simple": "A view saves the instructions for a query. It does not store a separate, fixed copy of the rows the query found.",
    "runtime": "sql",
    "lesson": "sql-10"
  },
  {
    "source": "CREATE VIEW category_directory AS followed by SELECT defines the reusable query.",
    "simple": "Write CREATE VIEW category_directory AS, then the SELECT that builds the list. This saves the query under the name category_directory for reuse.",
    "runtime": "sql",
    "lesson": "sql-10"
  },
  {
    "source": "Later, SELECT * FROM category_directory ORDER BY category displays it.",
    "simple": "To show the saved view, run SELECT * FROM category_directory ORDER BY category. The * reads all its columns, and ORDER BY sorts the categories.",
    "runtime": "sql",
    "lesson": "sql-10"
  },
  {
    "source": "If a new category is added to supplies, the view reads the new data without rebuilding a manual list.",
    "simple": "If supplies later gains a new category, querying the view includes it. You do not need to add its name to a hand-written list.",
    "runtime": "sql",
    "lesson": "sql-10"
  },
  {
    "source": "The setup file creates supplies for each run.",
    "simple": "Each exercise run uses the setup file to create the supplies table.",
    "runtime": "sql",
    "lesson": "sql-10"
  },
  {
    "source": "Your query should create the view without changing those source rows, then display the sorted directory.",
    "simple": "Create the view without editing the supplies records. Then query the view and sort the category list for display.",
    "runtime": "sql",
    "lesson": "sql-10"
  },
  {
    "source": "Checks look for duplicates and omitted empty values in the supplied data.",
    "simple": "The tests check that repeated categories appear only once and that unwanted empty values are left out of this sample data.",
    "runtime": "sql",
    "lesson": "sql-10"
  },
  {
    "source": "After passing, add a new category in setup.sql and rerun: a real view derives its results from the source instead of storing a manually typed list.",
    "simple": "Once it passes, put a new category in setup.sql and run it again. A proper view picks up that category from supplies instead of returning a fixed list typed into the query.",
    "runtime": "sql",
    "lesson": "sql-10"
  },
  {
    "source": "A contact record may be missing an email, a phone number or both.",
    "simple": "Someone's contact row might have an email but no phone, a phone but no email, or neither one.",
    "runtime": "sql",
    "lesson": "sql-11"
  },
  {
    "source": "NULL means a missing or unknown value in SQL.",
    "simple": "In SQL, NULL marks a value that is missing or not known.",
    "runtime": "sql",
    "lesson": "sql-11"
  },
  {
    "source": "An empty string and spaces-only text are present strings, so they need cleanup before a fallback can treat them as missing.",
    "simple": "An empty string or a string made only of spaces still counts as text, not NULL. Clean it up first so the backup-choice logic can recognize it as missing.",
    "runtime": "sql",
    "lesson": "sql-11"
  },
  {
    "source": "This project makes one useful display value per person.",
    "simple": "The goal is to choose one useful piece of contact text to show for each person.",
    "runtime": "sql",
    "lesson": "sql-11"
  },
  {
    "source": "TRIM(text) removes outside spaces in SQLite.",
    "simple": "In SQLite, TRIM(text) removes spaces at the beginning and end of text.",
    "runtime": "sql",
    "lesson": "sql-11"
  },
  {
    "source": "It preserves spaces inside a phone number.",
    "simple": "TRIM leaves spaces in the middle alone, such as the space between parts of a phone number.",
    "runtime": "sql",
    "lesson": "sql-11"
  },
  {
    "source": "TRIM(NULL) remains NULL.",
    "simple": "If you give TRIM a missing value, NULL, its result is still NULL.",
    "runtime": "sql",
    "lesson": "sql-11"
  },
  {
    "source": "NULLIF(value, '') returns NULL when value is an empty string and otherwise returns value.",
    "simple": "NULLIF(value, '') compares value with empty text. If they match, it gives NULL; otherwise, it keeps value.",
    "runtime": "sql",
    "lesson": "sql-11"
  },
  {
    "source": "Combining them turns an empty or spaces-only field into NULL.",
    "simple": "First remove outside spaces with TRIM, then turn empty text into NULL with NULLIF. Together, these make both empty fields and spaces-only fields count as missing.",
    "runtime": "sql",
    "lesson": "sql-11"
  },
  {
    "source": "This example shows the cleanup step.",
    "simple": "The next query demonstrates removing outside spaces and turning blank values into NULL.",
    "runtime": "sql",
    "lesson": "sql-11"
  },
  {
    "source": "The first result is a@example.org.",
    "simple": "The first email becomes a@example.org, with its outside spaces removed.",
    "runtime": "sql",
    "lesson": "sql-11"
  },
  {
    "source": "The remaining values are NULL.",
    "simple": "The other inputs are empty text, spaces-only text, and NULL. After cleanup, each gives NULL.",
    "runtime": "sql",
    "lesson": "sql-11"
  },
  {
    "source": "AS cleaned gives the output column a useful name.",
    "simple": "AS cleaned labels the result column cleaned so it is clear what the query has produced.",
    "runtime": "sql",
    "lesson": "sql-11"
  },
  {
    "source": "COALESCE chooses the first argument that is not NULL.",
    "simple": "COALESCE checks its inputs from left to right and returns the first one that is not NULL.",
    "runtime": "sql",
    "lesson": "sql-11"
  },
  {
    "source": "Its argument order expresses your preference: cleaned email first, cleaned phone second, a written fallback last.",
    "simple": "Put the cleaned email first, the cleaned phone second, and your backup message last. That order means 'use email if available, otherwise phone, otherwise the message'.",
    "runtime": "sql",
    "lesson": "sql-11"
  },
  {
    "source": "COALESCE does not consider a plain empty string missing;",
    "simple": "COALESCE will accept an empty string as a value. It does not skip it just because it looks blank.",
    "runtime": "sql",
    "lesson": "sql-11"
  },
  {
    "source": "that is why the NULLIF cleanup matters.",
    "simple": "NULLIF turns empty text into NULL first, allowing COALESCE to skip it and try the next choice.",
    "runtime": "sql",
    "lesson": "sql-11"
  },
  {
    "source": "Here is a complete fallback example.",
    "simple": "The next complete example tries a cleaned email, then a cleaned phone, then a backup message.",
    "runtime": "sql",
    "lesson": "sql-11"
  },
  {
    "source": "It returns 555 0100.",
    "simple": "The email is blank, so the query chooses the phone and displays 555 0100.",
    "runtime": "sql",
    "lesson": "sql-11"
  },
  {
    "source": "The outside spaces disappear but the internal space remains.",
    "simple": "The phone's leading and trailing spaces are removed. The space between 555 and 0100 stays.",
    "runtime": "sql",
    "lesson": "sql-11"
  },
  {
    "source": "This is a display choice, not proof that an email or phone number is valid or reachable.",
    "simple": "This query chooses text to display. It does not check that the email works or that someone can be reached at the phone number.",
    "runtime": "sql",
    "lesson": "sql-11"
  },
  {
    "source": "Do not invent stricter validation than the task requests.",
    "simple": "Only apply the cleanup and choice rules requested here. Do not add extra rules that reject contact details for other reasons.",
    "runtime": "sql",
    "lesson": "sql-11"
  },
  {
    "source": "Keep id and name in the view so a caller can associate the chosen contact with the right person.",
    "simple": "Include id and name in the view alongside the chosen contact text. Then whoever reads the view can tell which person it belongs to.",
    "runtime": "sql",
    "lesson": "sql-11"
  },
  {
    "source": "Every input person should produce one output row.",
    "simple": "Keep every person in the result, with one row each, including people who need the backup message.",
    "runtime": "sql",
    "lesson": "sql-11"
  },
  {
    "source": "Create the contact_choices view and display it ordered by id.",
    "simple": "Create a view named contact_choices, then show its rows sorted by id.",
    "runtime": "sql",
    "lesson": "sql-11"
  },
  {
    "source": "Check a person with both fields, phone only, neither field and spaces-only email.",
    "simple": "Test four situations: both contact fields filled, only a phone, neither field filled, and an email containing only spaces.",
    "runtime": "sql",
    "lesson": "sql-11"
  },
  {
    "source": "The preference rule must keep email when both are available.",
    "simple": "If both a cleaned email and a cleaned phone are available, choose the email, as the task requires.",
    "runtime": "sql",
    "lesson": "sql-11"
  },
  {
    "source": "The source table should remain unchanged because formatting a view need not edit saved contact details.",
    "simple": "Leave the original contact records as they are. A view can display cleaned-up values without changing the saved email or phone fields.",
    "runtime": "sql",
    "lesson": "sql-11"
  },
  {
    "source": "A dashboard may need several summaries from the same data.",
    "simple": "The same records can feed several different dashboard totals or counts.",
    "runtime": "sql",
    "lesson": "sql-12"
  },
  {
    "source": "Aggregation combines rows, using functions such as COUNT and SUM.",
    "simple": "Aggregation turns several rows into summary values. For example, COUNT counts rows or known values, while SUM adds values.",
    "runtime": "sql",
    "lesson": "sql-12"
  },
  {
    "source": "Conditional aggregation adds a decision inside the aggregate so different summary columns can include different rows.",
    "simple": "Conditional aggregation checks a rule inside each calculation. This lets one result column count certain rows while another sums a different set of rows.",
    "runtime": "sql",
    "lesson": "sql-12"
  },
  {
    "source": "Here, a customer can have paid, pending or cancelled orders.",
    "simple": "In this example, a customer's orders may be marked paid, pending, or cancelled.",
    "runtime": "sql",
    "lesson": "sql-12"
  },
  {
    "source": "Start from customers and LEFT JOIN orders using the customer ID.",
    "simple": "Put customers on the left and use LEFT JOIN to match orders to them by customer ID.",
    "runtime": "sql",
    "lesson": "sql-12"
  },
  {
    "source": "A left join keeps a customer even when no order matches.",
    "simple": "LEFT JOIN keeps a customer's row even if that customer has no order to match.",
    "runtime": "sql",
    "lesson": "sql-12"
  },
  {
    "source": "The unmatched order columns become NULL.",
    "simple": "For a customer with no order, the order-side fields in the joined result are NULL.",
    "runtime": "sql",
    "lesson": "sql-12"
  },
  {
    "source": "COUNT(*) would count that retained row as one, so use COUNT(o.id) to count only real orders;",
    "simple": "COUNT(*) would count that kept customer row as if it represented an order. Use COUNT(o.id) instead: the missing order id is NULL, so it is not counted.",
    "runtime": "sql",
    "lesson": "sql-12"
  },
  {
    "source": "COUNT(column) skips NULL.",
    "simple": "COUNT(column) counts only non-NULL values in that column.",
    "runtime": "sql",
    "lesson": "sql-12"
  },
  {
    "source": "CASE turns a condition into a value before SUM adds it.",
    "simple": "CASE checks a rule and chooses a value for each row. SUM then adds those chosen values.",
    "runtime": "sql",
    "lesson": "sql-12"
  },
  {
    "source": "This returns 2 paid orders and 500 paid cents.",
    "simple": "Two orders are marked paid, and their amounts add to 300 + 200 = 500 cents. So the result is 2 paid orders and 500 paid cents.",
    "runtime": "sql",
    "lesson": "sql-12"
  },
  {
    "source": "The pending amount is deliberately excluded.",
    "simple": "The pending order's amount is not added to paid cents because the order is not marked paid.",
    "runtime": "sql",
    "lesson": "sql-12"
  },
  {
    "source": "GROUP BY chooses which rows belong to each summary.",
    "simple": "GROUP BY separates the input rows into the groups that each need their own summary.",
    "runtime": "sql",
    "lesson": "sql-12"
  },
  {
    "source": "Group by customer ID and name.",
    "simple": "Use both the customer's ID and name in GROUP BY so each customer has their own summary.",
    "runtime": "sql",
    "lesson": "sql-12"
  },
  {
    "source": "Names alone are unsafe because two different customers can share a name.",
    "simple": "Two different people can have the same name. Grouping only by name could wrongly combine their orders into one customer's total.",
    "runtime": "sql",
    "lesson": "sql-12"
  },
  {
    "source": "Aliases such as c for customers and o for orders shorten qualified column names, including c.id and o.customer_id.",
    "simple": "Use c as a short name for customers and o for orders. Then c.id means the customer's id, while o.customer_id means the customer_id stored on an order.",
    "runtime": "sql",
    "lesson": "sql-12"
  },
  {
    "source": "This example keeps a customer with no order.",
    "simple": "The next query shows how to keep a customer in the report even when they have no orders.",
    "runtime": "sql",
    "lesson": "sql-12"
  },
  {
    "source": "Customer 1 has one order;",
    "simple": "Customer 1 matches one order, so its total_orders value is 1.",
    "runtime": "sql",
    "lesson": "sql-12"
  },
  {
    "source": "customer 2 has zero.",
    "simple": "Customer 2 matches no orders, so its total_orders value is 0.",
    "runtime": "sql",
    "lesson": "sql-12"
  },
  {
    "source": "An inner join would lose customer 2 entirely.",
    "simple": "INNER JOIN would keep only customers with matching orders. Customer 2 would disappear instead of showing a zero count.",
    "runtime": "sql",
    "lesson": "sql-12"
  },
  {
    "source": "Do not place WHERE o.status = 'paid' after the join: it would remove unpaid orders before total_orders is counted and remove customers without paid orders.",
    "simple": "Do not filter the whole joined result with WHERE o.status = 'paid'. That would hide unpaid orders from total_orders and remove customers who have no paid orders.",
    "runtime": "sql",
    "lesson": "sql-12"
  },
  {
    "source": "Put that condition inside each paid aggregate.",
    "simple": "Check status = 'paid' inside each calculation for paid orders instead. That way the other rows remain available for the report's other calculations.",
    "runtime": "sql",
    "lesson": "sql-12"
  },
  {
    "source": "CASE with ELSE 0 gives the retained no-order row a zero contribution.",
    "simple": "For a customer with no order, the CASE condition does not pass. ELSE 0 makes that kept row add zero to the sum.",
    "runtime": "sql",
    "lesson": "sql-12"
  },
  {
    "source": "Integer cents avoid floating-point rounding for this small monetary total.",
    "simple": "Store these small amounts as whole cents rather than fractional currency values. Adding whole numbers avoids floating-point rounding in this total.",
    "runtime": "sql",
    "lesson": "sql-12"
  },
  {
    "source": "The view summarizes orders;",
    "simple": "This view only reads order records and calculates their summary.",
    "runtime": "sql",
    "lesson": "sql-12"
  },
  {
    "source": "it does not charge anyone or infer payment from an amount.",
    "simple": "It does not take payments. It also does not assume an order is paid just because it has an amount; it uses the stored payment status.",
    "runtime": "sql",
    "lesson": "sql-12"
  },
  {
    "source": "Checks include two customers sharing a name, a customer with no orders and unpaid orders that must not count toward revenue.",
    "simple": "The tests include two customers with the same name, someone with no orders, and unpaid orders. Those unpaid amounts must not be added to revenue.",
    "runtime": "sql",
    "lesson": "sql-12"
  },
  {
    "source": "Display the final view ordered by customer_id.",
    "simple": "When showing the finished view, sort its rows using ORDER BY customer_id.",
    "runtime": "sql",
    "lesson": "sql-12"
  },
  {
    "source": "A folder tree stores one row per folder and the ID of its parent.",
    "simple": "Each folder has its own row. That row also stores the id of the folder that contains it, called its parent.",
    "runtime": "sql",
    "lesson": "sql-13"
  },
  {
    "source": "A root has no parent.",
    "simple": "A root is a top-level folder with no folder above it in the tree.",
    "runtime": "sql",
    "lesson": "sql-13"
  },
  {
    "source": "A forest is a collection of separate trees, so there can be several roots.",
    "simple": "A forest means several separate folder trees. Each tree has its own root, so the data can contain more than one root.",
    "runtime": "sql",
    "lesson": "sql-13"
  },
  {
    "source": "A recursive query repeatedly uses earlier results to find the next level.",
    "simple": "A recursive query repeats a step, using the rows it already found to discover the next level of rows.",
    "runtime": "sql",
    "lesson": "sql-13"
  },
  {
    "source": "It can build full paths even when the depth varies.",
    "simple": "It builds a full path by following one folder level after another. Different branches do not need to have the same number of levels.",
    "runtime": "sql",
    "lesson": "sql-13"
  },
  {
    "source": "A common table expression, or CTE, gives a query a temporary name after WITH.",
    "simple": "A common table expression, or CTE, is a named query result written after WITH. Its name is available temporarily within that query.",
    "runtime": "sql",
    "lesson": "sql-13"
  },
  {
    "source": "WITH RECURSIVE allows a CTE to refer to itself.",
    "simple": "WITH RECURSIVE lets a named query use its own earlier results to work out more rows.",
    "runtime": "sql",
    "lesson": "sql-13"
  },
  {
    "source": "It has an anchor query that provides starting rows and a recursive query that expands from them.",
    "simple": "The anchor query supplies the starting rows. The recursive part then uses those rows, and later results, to discover the next rows.",
    "runtime": "sql",
    "lesson": "sql-13"
  },
  {
    "source": "UNION ALL combines the starting and later rows without removing duplicates.",
    "simple": "UNION ALL puts the starting rows and newly found rows together. It keeps any duplicates rather than removing them.",
    "runtime": "sql",
    "lesson": "sql-13"
  },
  {
    "source": "This complete recursive example counts upward.",
    "simple": "The next complete example repeats an adding step to generate a short sequence of numbers.",
    "runtime": "sql",
    "lesson": "sql-13"
  },
  {
    "source": "It produces 0, 1, 2 and 3.",
    "simple": "The sequence starts at 0, then adds 1 repeatedly to return 0, 1, 2, and 3.",
    "runtime": "sql",
    "lesson": "sql-13"
  },
  {
    "source": "The WHERE condition prevents further expansion after 3.",
    "simple": "WHERE n < 3 allows another step only while the current number is below 3. Once it reaches 3, it does not produce a next number.",
    "runtime": "sql",
    "lesson": "sql-13"
  },
  {
    "source": "A recursive query needs a reason to stop.",
    "simple": "Make sure a recursive query has a rule or data structure that eventually ends the repeated steps.",
    "runtime": "sql",
    "lesson": "sql-13"
  },
  {
    "source": "For folder paths, the anchor selects rows whose parent_id IS NULL.",
    "simple": "For folders, begin with parent_id IS NULL. Those are the root folders, with no parent above them.",
    "runtime": "sql",
    "lesson": "sql-13"
  },
  {
    "source": "Give each root its own name as the path and zero as the depth.",
    "simple": "A root's starting path is just its name. Its depth is 0 because it is the starting level.",
    "runtime": "sql",
    "lesson": "sql-13"
  },
  {
    "source": "The recursive part joins a child folder to an already discovered parent path using child.parent_id = parent.id.",
    "simple": "To find the next level, match a child folder's parent_id to the id of a parent already found: child.parent_id = parent.id. Use that parent's path to build the child's path.",
    "runtime": "sql",
    "lesson": "sql-13"
  },
  {
    "source": "When no undiscovered descendants remain to expand, the supplied acyclic tree is finished.",
    "simple": "The supplied folder tree has no loops. Once the query reaches folders with no more descendants to find, there are no further rows to expand and the process ends.",
    "runtime": "sql",
    "lesson": "sql-13"
  },
  {
    "source": "SQLite joins text with ||.",
    "simple": "In SQLite, || sticks pieces of text together into one longer text value.",
    "runtime": "sql",
    "lesson": "sql-13"
  },
  {
    "source": "Here is a small one-level example.",
    "simple": "The next example builds a child's path from its parent's path for just one level.",
    "runtime": "sql",
    "lesson": "sql-13"
  },
  {
    "source": "The output is ID 2, Home/Notes and depth 1.",
    "simple": "The result is folder id 2, with path Home/Notes and depth 1. Notes is one level below Home.",
    "runtime": "sql",
    "lesson": "sql-13"
  },
  {
    "source": "The full recursive query repeats that same expansion at every level.",
    "simple": "The recursive version performs that same parent-to-child path-building step again for each deeper level.",
    "runtime": "sql",
    "lesson": "sql-13"
  },
  {
    "source": "The input contract guarantees an acyclic forest and existing parents.",
    "simple": "The exercise promises that folders form trees with no loops and that every listed parent actually exists.",
    "runtime": "sql",
    "lesson": "sql-13"
  },
  {
    "source": "General untrusted graphs need cycle detection or another explicit bound;",
    "simple": "With other data that may contain loops, you need a way to detect repeated visits or another clear stopping limit. Otherwise, following connections could keep repeating.",
    "runtime": "sql",
    "lesson": "sql-13"
  },
  {
    "source": "this exercise does not claim to handle arbitrary cycles.",
    "simple": "This exercise is built for the promised tree data. It is not a solution for every possible looping set of connections.",
    "runtime": "sql",
    "lesson": "sql-13"
  },
  {
    "source": "Start from every root so a second tree is not lost.",
    "simple": "Include all root folders in the starting rows. Beginning with only one would miss any separate tree.",
    "runtime": "sql",
    "lesson": "sql-13"
  },
  {
    "source": "Repeated folder names under different parents are allowed because IDs, not names, connect the rows.",
    "simple": "Different branches can have folders with the same name. The parent-child link uses unique ids, so it does not confuse those folders just because their names match.",
    "runtime": "sql",
    "lesson": "sql-13"
  },
  {
    "source": "Wrap the CTE query in CREATE VIEW folder_paths AS and select id, path and depth from its result.",
    "simple": "Place CREATE VIEW folder_paths AS before the CTE query. Have its final SELECT return id, path, and depth.",
    "runtime": "sql",
    "lesson": "sql-13"
  },
  {
    "source": "Display the view ORDER BY path.",
    "simple": "Show the folder_paths view with ORDER BY path so the results are sorted by their paths.",
    "runtime": "sql",
    "lesson": "sql-13"
  },
  {
    "source": "Checks include two roots, a deeper descendant and repeated names in different branches.",
    "simple": "The tests cover two separate roots, a folder several levels down, and the same folder name appearing in different branches.",
    "runtime": "sql",
    "lesson": "sql-13"
  },
  {
    "source": "A fixed number of self-joins would solve only a fixed depth;",
    "simple": "Writing a fixed number of joins from the folder table back to itself can follow only that many levels. It cannot automatically handle deeper trees.",
    "runtime": "sql",
    "lesson": "sql-13"
  },
  {
    "source": "recursion expresses the repeated operation directly.",
    "simple": "Recursion says 'repeat this same parent-to-child step' instead of writing a separate join for each possible depth.",
    "runtime": "sql",
    "lesson": "sql-13"
  }
];

export default readings;
