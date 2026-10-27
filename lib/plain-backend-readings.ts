// Reviewed backend counterparts.
export default [
  {
    "source": "An API is an agreed way for programs to ask another program to do something.",
    "simple": "An API is a shared way for one program to ask another program for data or an action.",
    "runtime": "javascript",
    "lesson": "backend-01"
  },
  {
    "source": "An HTTP request includes a method, a path, and sometimes a body of data.",
    "simple": "An HTTP request says the action method, the path to use, and sometimes includes data.",
    "runtime": "javascript",
    "lesson": "backend-01"
  },
  {
    "source": "A route matches a method and path.",
    "simple": "A route handles a particular combination of method and path.",
    "runtime": "javascript",
    "lesson": "backend-01"
  },
  {
    "source": "GET /entries reads records;",
    "simple": "`GET /entries` asks to read the saved entries.",
    "runtime": "javascript",
    "lesson": "backend-01"
  },
  {
    "source": "POST /entries asks to create one.",
    "simple": "`POST /entries` asks to add a new entry.",
    "runtime": "javascript",
    "lesson": "backend-01"
  },
  {
    "source": "A response has a status number and a body.",
    "simple": "The reply includes a status number and some returned data.",
    "runtime": "javascript",
    "lesson": "backend-01"
  },
  {
    "source": "JSON is a text format used to send objects and arrays between programs.",
    "simple": "JSON is a text format that programs use to send objects and lists to each other.",
    "runtime": "javascript",
    "lesson": "backend-01"
  },
  {
    "source": "This standalone JavaScript example models a route decision without a real network:",
    "simple": "This JavaScript example imitates choosing a route without sending anything over a network.",
    "runtime": "javascript",
    "lesson": "backend-01"
  },
  {
    "source": "The first response is status 201 with {id: 1, minutes: 45};",
    "simple": "The first reply has status 201 and the new entry `{id: 1, minutes: 45}`.",
    "runtime": "javascript",
    "lesson": "backend-01"
  },
  {
    "source": "the second is 200 with an array containing that saved visit.",
    "simple": "The next reply has status 200 and a list containing that saved entry.",
    "runtime": "javascript",
    "lesson": "backend-01"
  },
  {
    "source": "Number.isInteger requires a whole finite number, so it rejects a fraction, undefined, NaN, Infinity, and quoted numeric text.",
    "simple": "`Number.isInteger` accepts numbers with no decimal part, such as -2, 0, and 5. It rejects fractions, missing values, NaN, Infinity, and numbers written as quoted text.",
    "runtime": "javascript",
    "lesson": "backend-01"
  },
  {
    "source": "The bounds include 1 and 180;",
    "simple": "Both 1 and 180 are allowed by these limits.",
    "runtime": "javascript",
    "lesson": "backend-01"
  },
  {
    "source": "0 and 181 fail. || means any invalid condition rejects the request.",
    "simple": "0 and 181 are outside the range. The `||` signs mean any one invalid condition is enough to reject the request.",
    "runtime": "javascript",
    "lesson": "backend-01"
  },
  {
    "source": "The default body = {} handles an omitted argument in this example. [...visits] makes a new array for the response, and push appends the valid record only after validation.",
    "simple": "`body = {}` supplies an empty object if the input is omitted. `[...visits]` makes a new result list. `push` adds a record only after its values pass the checks.",
    "runtime": "javascript",
    "lesson": "backend-01"
  },
  {
    "source": "Express is a package for writing HTTP routes in Node.js, which runs JavaScript outside the browser.",
    "simple": "Express helps write HTTP routes using Node.js. Node.js runs JavaScript outside the browser.",
    "runtime": "javascript",
    "lesson": "backend-01"
  },
  {
    "source": "Save this complete separate example as server.mjs in a local project with the supplied Express dependency installed:",
    "simple": "Save the next whole example as `server.mjs` in a local project where the supplied Express dependency is installed.",
    "runtime": "javascript",
    "lesson": "backend-01"
  },
  {
    "source": "Run with Node.js 22.13 or newer.",
    "simple": "Use Node.js version 22.13 or newer to run it.",
    "runtime": "javascript",
    "lesson": "backend-01"
  },
  {
    "source": "The callback receives req for request information and res for the response. listen starts the local server on port 3000.",
    "simple": "The handler reads request information from `req` and replies through `res`. `listen` starts the local server on port 3000.",
    "runtime": "javascript",
    "lesson": "backend-01"
  },
  {
    "source": "app.use installs middleware, code that runs before route handlers. express.json reads JSON request bodies, with a 20-kilobyte size limit. res.status chooses the status and res.json sends JSON. crypto.randomUUID creates a unique record identifier in this Node environment.",
    "simple": "`app.use` adds code that runs before the routes. `express.json` reads JSON bodies up to 20KB. `res.status` chooses the status, `res.json` sends JSON, and `crypto.randomUUID` makes a unique record ID.",
    "runtime": "javascript",
    "lesson": "backend-01"
  },
  {
    "source": "A 200 means the read succeeded;",
    "simple": "Status 200 means reading the data worked.",
    "runtime": "javascript",
    "lesson": "backend-01"
  },
  {
    "source": "201 means a record was created;",
    "simple": "Status 201 means a new record was created.",
    "runtime": "javascript",
    "lesson": "backend-01"
  },
  {
    "source": "400 asks the caller to fix invalid input;",
    "simple": "Status 400 means the caller needs to fix the submitted values.",
    "runtime": "javascript",
    "lesson": "backend-01"
  },
  {
    "source": "404 means no matching route here.",
    "simple": "Status 404 means this server has no matching route.",
    "runtime": "javascript",
    "lesson": "backend-01"
  },
  {
    "source": "JSON parsing and other server failures are additional cases beyond this small route exercise.",
    "simple": "Bad JSON and other server errors are further cases not covered by this small routing exercise.",
    "runtime": "javascript",
    "lesson": "backend-01"
  },
  {
    "source": "With that server running, this JavaScript fragment can be used in a browser console on the same local origin, or in a Node environment supporting fetch:",
    "simple": "With the server running, try this code in a browser on the same local origin or in Node with `fetch` support.",
    "runtime": "javascript",
    "lesson": "backend-01"
  },
  {
    "source": "It prints 201 then the saved array.",
    "simple": "It prints 201, then the saved list.",
    "runtime": "javascript",
    "lesson": "backend-01"
  },
  {
    "source": "JSON.stringify turns the object into request text. await waits for each promise's result;",
    "simple": "`JSON.stringify` turns the object into text for the request. `await` waits here for each requested result.",
    "runtime": "javascript",
    "lesson": "backend-01"
  },
  {
    "source": "response.json parses returned JSON.",
    "simple": "`response.json()` reads the reply’s JSON text as data.",
    "runtime": "javascript",
    "lesson": "backend-01"
  },
  {
    "source": "Cross-origin browser pages may need CORS permission, so prefer the local server's origin or Node for this walkthrough.",
    "simple": "A browser page from another origin may need CORS permission to reach the server. For this walkthrough, use the server’s own origin or Node.",
    "runtime": "javascript",
    "lesson": "backend-01"
  },
  {
    "source": "For the exercise, implement handleRequest for /entries, validate before push, preserve saved records for later GET calls, and return 404 for /missing.",
    "simple": "Write `handleRequest` for `/entries`. Check values before adding them, keep earlier records for later GET requests, and return 404 for `/missing`.",
    "runtime": "javascript",
    "lesson": "backend-01"
  },
  {
    "source": "The array is memory-only and disappears when the server stops.",
    "simple": "This array lives only in the running program. It is lost when the server stops.",
    "runtime": "javascript",
    "lesson": "backend-01"
  },
  {
    "source": "The browser checks your decision function;",
    "simple": "The browser tests your route-decision function.",
    "runtime": "javascript",
    "lesson": "backend-01"
  },
  {
    "source": "it does not launch Node or prove actual HTTP behavior.",
    "simple": "Those browser tests do not start Node or prove the real HTTP routes work.",
    "runtime": "javascript",
    "lesson": "backend-01"
  },
  {
    "source": "Download the supplied server and tests, install its declared packages locally, start it in one terminal, and run npm test in another to check the real routes.",
    "simple": "Download the server and tests, install the listed packages locally, start the server in one terminal, and run `npm test` in another to test real requests.",
    "runtime": "javascript",
    "lesson": "backend-01"
  },
  {
    "source": "Durable storage keeps data after a process stops.",
    "simple": "Durable storage keeps information even after the program stops.",
    "runtime": "javascript",
    "lesson": "backend-02"
  },
  {
    "source": "A JavaScript array is in memory and disappears on restart.",
    "simple": "A normal JavaScript array lives in memory and is lost when the program restarts.",
    "runtime": "javascript",
    "lesson": "backend-02"
  },
  {
    "source": "A SQLite database opened with a file name stores records on disk.",
    "simple": "A SQLite database using a file name saves its records to disk.",
    "runtime": "javascript",
    "lesson": "backend-02"
  },
  {
    "source": "An adapter gives your code small methods such as save and load so callers can ask for storage without depending on its internal details.",
    "simple": "An adapter gives you simple actions like `save` and `load`, hiding the storage details behind them.",
    "runtime": "javascript",
    "lesson": "backend-02"
  },
  {
    "source": "An adapter can be memory-only or durable;",
    "simple": "An adapter might store data only in memory or save it durably.",
    "runtime": "javascript",
    "lesson": "backend-02"
  },
  {
    "source": "the method names alone do not prove persistence.",
    "simple": "Calling methods save and load does not prove that data survives a restart.",
    "runtime": "javascript",
    "lesson": "backend-02"
  },
  {
    "source": "This complete standalone JavaScript adapter is memory-only practice:",
    "simple": "This complete practice adapter stores its data only in memory.",
    "runtime": "javascript",
    "lesson": "backend-02"
  },
  {
    "source": "It returns both rows. this means the store object inside its methods. {...row} copies the flat record, and map returns a new array of copied records.",
    "simple": "It returns both rows. Inside the methods, `this` means this store. `{...row}` copies a flat record, and `map` makes a new list of copied records.",
    "runtime": "javascript",
    "lesson": "backend-02"
  },
  {
    "source": "Saving the second row appends rather than replacing the first.",
    "simple": "Saving the second row adds it after the first; it does not replace the first row.",
    "runtime": "javascript",
    "lesson": "backend-02"
  },
  {
    "source": "A prepared statement separates fixed SQL structure from the values supplied later.",
    "simple": "A prepared statement keeps the SQL instructions separate from the values you give it.",
    "runtime": "javascript",
    "lesson": "backend-02"
  },
  {
    "source": "Placeholders such as ? stand for values, in order.",
    "simple": "A `?` is a place for a value. Supply values in the same order as those placeholders.",
    "runtime": "javascript",
    "lesson": "backend-02"
  },
  {
    "source": "The database handles their representation so a string value is not interpreted as extra SQL commands.",
    "simple": "The database handles those values as data, so text is not mistaken for extra SQL instructions.",
    "runtime": "javascript",
    "lesson": "backend-02"
  },
  {
    "source": "Do not construct a query by concatenating untrusted input into its SQL text.",
    "simple": "Do not paste untrusted input directly into the SQL command text.",
    "runtime": "javascript",
    "lesson": "backend-02"
  },
  {
    "source": "Prepared statements address SQL input handling;",
    "simple": "Prepared statements help keep supplied values separate from SQL commands.",
    "runtime": "javascript",
    "lesson": "backend-02"
  },
  {
    "source": "range validation and ownership checks are still separate responsibilities.",
    "simple": "You still need separate checks for allowed value ranges and who may use the records.",
    "runtime": "javascript",
    "lesson": "backend-02"
  },
  {
    "source": "Save this complete example as storage.mjs and run it with Node.js 22.13 or newer, whose node:sqlite module is available in this lesson's required environment:",
    "simple": "Save this example as `storage.mjs` and use Node.js 22.13 or newer, with the `node:sqlite` module required by the lesson.",
    "runtime": "javascript",
    "lesson": "backend-02"
  },
  {
    "source": "A first run in a folder without that file prints x/35 and y/12 and leaves a database file. db.prepare builds a statement;",
    "simple": "On the first run without an existing file, it prints the x/35 and y/12 records and leaves a database file. `db.prepare` prepares the SQL instruction.",
    "runtime": "javascript",
    "lesson": "backend-02"
  },
  {
    "source": "run executes the insert with two values;",
    "simple": "`run` performs the insert using the two supplied values.",
    "runtime": "javascript",
    "lesson": "backend-02"
  },
  {
    "source": "all returns the query's rows.",
    "simple": "`all` gives back all the rows returned by the query.",
    "runtime": "javascript",
    "lesson": "backend-02"
  },
  {
    "source": "This demonstration should be inserted only once: rerunning those same primary keys causes a duplicate-key error.",
    "simple": "Insert these example IDs only once. Repeating the same primary keys causes a duplicate-key error.",
    "runtime": "javascript",
    "lesson": "backend-02"
  },
  {
    "source": "To verify persistence, use a separate reader after the first script has exited:",
    "simple": "After the first program ends, use a separate reader to check that the data survived.",
    "runtime": "javascript",
    "lesson": "backend-02"
  },
  {
    "source": "Save as read-storage.mjs in the same folder and run it.",
    "simple": "Save it as `read-storage.mjs` in the same folder, then run it.",
    "runtime": "javascript",
    "lesson": "backend-02"
  },
  {
    "source": "The same rows still exist because the file outlived the first process.",
    "simple": "The rows are still there because the saved file remains after the original program ends.",
    "runtime": "javascript",
    "lesson": "backend-02"
  },
  {
    "source": "A different working folder can open a different file with the same relative name, so check your location when testing persistence.",
    "simple": "A relative file name can point to a different file if you run from another folder. Check the working folder when testing storage.",
    "runtime": "javascript",
    "lesson": "backend-02"
  },
  {
    "source": "Set membership helps compare ids.",
    "simple": "To compare IDs, check which values belong to both groups.",
    "runtime": "javascript",
    "lesson": "backend-02"
  },
  {
    "source": "Suppose saved ids are {x, y} and requested ids are {x, z}.",
    "simple": "In this example, x and y are saved, while x and z are requested.",
    "runtime": "javascript",
    "lesson": "backend-02"
  },
  {
    "source": "Their overlap is {x}, because only x occurs in both. z is requested but missing, and y is stored but not requested.",
    "simple": "Only x appears in both groups. z is requested but missing; y is saved but not requested.",
    "runtime": "javascript",
    "lesson": "backend-02"
  },
  {
    "source": "Positions do not decide membership.",
    "simple": "An ID’s position in a list does not decide whether it belongs to a group.",
    "runtime": "javascript",
    "lesson": "backend-02"
  },
  {
    "source": "A JavaScript Set stores distinct values and has(id) checks whether a particular id is present.",
    "simple": "A JavaScript `Set` keeps each distinct value once. `has(id)` asks whether that ID is present.",
    "runtime": "javascript",
    "lesson": "backend-02"
  },
  {
    "source": "For the browser exercise, saveEntry must call store.save and loadEntries must call store.load.",
    "simple": "In the browser task, `saveEntry` must use `store.save`, and `loadEntries` must use `store.load`.",
    "runtime": "javascript",
    "lesson": "backend-02"
  },
  {
    "source": "The supplied a and b rows must survive a later c addition.",
    "simple": "Adding c later must not remove the existing a and b records.",
    "runtime": "javascript",
    "lesson": "backend-02"
  },
  {
    "source": "The browser adapter makes copied rows but does not write a disk file.",
    "simple": "The browser adapter copies rows but does not save them in a disk file.",
    "runtime": "javascript",
    "lesson": "backend-02"
  },
  {
    "source": "The downloaded server uses practice.sqlite and prepared statements with the same storage idea.",
    "simple": "The downloaded server uses the same idea with prepared SQL statements and a file named `practice.sqlite`.",
    "runtime": "javascript",
    "lesson": "backend-02"
  },
  {
    "source": "Save a record, stop and restart that local server in the same folder, and read it again;",
    "simple": "Save a record, stop the local server, restart it in the same folder, and read the record again.",
    "runtime": "javascript",
    "lesson": "backend-02"
  },
  {
    "source": "only that actual restart test establishes its durability.",
    "simple": "That real restart-and-read test is the evidence that storage is durable.",
    "runtime": "javascript",
    "lesson": "backend-02"
  },
  {
    "source": "A report summarizes records instead of returning every original row.",
    "simple": "A report combines records into useful summaries instead of listing every original row.",
    "runtime": "sql",
    "lesson": "backend-03"
  },
  {
    "source": "GROUP BY user_id makes a separate group for each user's sessions.",
    "simple": "`GROUP BY user_id` collects each user’s sessions into their own group.",
    "runtime": "sql",
    "lesson": "backend-03"
  },
  {
    "source": "COUNT(*) counts all records;",
    "simple": "`COUNT(*)` counts every record in the group.",
    "runtime": "sql",
    "lesson": "backend-03"
  },
  {
    "source": "COUNT(minutes) counts known durations;",
    "simple": "`COUNT(minutes)` counts only rows where minutes are known.",
    "runtime": "sql",
    "lesson": "backend-03"
  },
  {
    "source": "AVG(minutes) averages those known durations.",
    "simple": "`AVG(minutes)` averages the known minute values.",
    "runtime": "sql",
    "lesson": "backend-03"
  },
  {
    "source": "A view stores a named query you can read like a table.",
    "simple": "A view gives a query a name, so you can read its results as though reading a table.",
    "runtime": "sql",
    "lesson": "backend-03"
  },
  {
    "source": "It usually recalculates from underlying rows, rather than saving a frozen copy of the report.",
    "simple": "A normal view uses the current underlying data each time; it is not a frozen saved report.",
    "runtime": "sql",
    "lesson": "backend-03"
  },
  {
    "source": "Run this complete separate SQLite example:",
    "simple": "Run this separate complete SQLite example.",
    "runtime": "sql",
    "lesson": "backend-03"
  },
  {
    "source": "The result is x: 2 rows, 2 known, average 18;",
    "simple": "For x, the report has two rows, two known durations, and an average of 18.",
    "runtime": "sql",
    "lesson": "backend-03"
  },
  {
    "source": "y: 2 rows, 1 known, average 18.",
    "simple": "For y, it has two rows but only one known duration, also averaging 18.",
    "runtime": "sql",
    "lesson": "backend-03"
  },
  {
    "source": "AS names each result column.",
    "simple": "`AS` gives each result column its chosen name.",
    "runtime": "sql",
    "lesson": "backend-03"
  },
  {
    "source": "SELECT * reads all the view's columns.",
    "simple": "`SELECT *` asks for every column in the view.",
    "runtime": "sql",
    "lesson": "backend-03"
  },
  {
    "source": "NULL means unknown, not zero.",
    "simple": "`NULL` means the value is unknown. It does not mean zero.",
    "runtime": "sql",
    "lesson": "backend-03"
  },
  {
    "source": "For durations 12, 24, NULL, the known-value average is (12 + 24) / 2 = 18, not 36 / 3 = 12.",
    "simple": "For 12, 24, and an unknown value, average just the two known numbers: 36 ÷ 2 = 18. Do not divide by three.",
    "runtime": "sql",
    "lesson": "backend-03"
  },
  {
    "source": "An all-NULL group has known_count 0 and average NULL.",
    "simple": "If every duration is unknown, the known count is 0 and the average is still unknown, `NULL`.",
    "runtime": "sql",
    "lesson": "backend-03"
  },
  {
    "source": "Showing the known count helps readers see how much evidence the average uses.",
    "simple": "Showing how many values are known helps readers judge what the average is based on.",
    "runtime": "sql",
    "lesson": "backend-03"
  },
  {
    "source": "One small report describes its supplied data;",
    "simple": "This small report describes only the data it was given.",
    "runtime": "sql",
    "lesson": "backend-03"
  },
  {
    "source": "it does not prove what caused a change or what all users do.",
    "simple": "It does not prove why something changed or describe every possible user.",
    "runtime": "sql",
    "lesson": "backend-03"
  },
  {
    "source": "A report can also include users with no sessions.",
    "simple": "You can also make a report that includes users who have no sessions at all.",
    "runtime": "sql",
    "lesson": "backend-03"
  },
  {
    "source": "Here is a second query, with a complete users schema, after the previous setup:",
    "simple": "After the earlier setup, try this second query and its complete users-table setup.",
    "runtime": "sql",
    "lesson": "backend-03"
  },
  {
    "source": "User z has 0 session_rows, 0 known_count, and NULL average.",
    "simple": "User z has no session rows, no known durations, and an unknown average.",
    "runtime": "sql",
    "lesson": "backend-03"
  },
  {
    "source": "COUNT(s.user_id) avoids counting the unmatched LEFT JOIN placeholder as a real session;",
    "simple": "`COUNT(s.user_id)` counts real matching sessions, not the empty placeholder a left join creates for an unmatched user.",
    "runtime": "sql",
    "lesson": "backend-03"
  },
  {
    "source": "COUNT(*) there would misleadingly count it as one row.",
    "simple": "Using `COUNT(*)` there would incorrectly report that placeholder as one session row.",
    "runtime": "sql",
    "lesson": "backend-03"
  },
  {
    "source": "Joins can multiply rows when each session matches several records in another table.",
    "simple": "A join can create extra copies of a row if it matches several rows in another table.",
    "runtime": "sql",
    "lesson": "backend-03"
  },
  {
    "source": "If a session with 10 minutes matches three tags, a later SUM could count its 10 three times.",
    "simple": "If a ten-minute session matches three tags, adding the joined minutes could incorrectly add those same ten minutes three times.",
    "runtime": "sql",
    "lesson": "backend-03"
  },
  {
    "source": "Before trusting an aggregate, inspect how many rows the join produces and what one result row represents.",
    "simple": "Before trusting a total or average, check how many joined rows there are and what each one represents.",
    "runtime": "sql",
    "lesson": "backend-03"
  },
  {
    "source": "The exercise's query needs no join: it groups the sessions table directly.",
    "simple": "Your exercise does not need a join. Group the `sessions` table directly.",
    "runtime": "sql",
    "lesson": "backend-03"
  },
  {
    "source": "For the exercise, replace the placeholder report view with a grouped query that returns user_id, row_count, known_count, and average_minutes.",
    "simple": "Replace the placeholder view with a grouped report containing `user_id`, `row_count`, `known_count`, and `average_minutes`.",
    "runtime": "sql",
    "lesson": "backend-03"
  },
  {
    "source": "User a's 20 and 40 give row_count 2, known_count 2, average 30.",
    "simple": "User a has 20 and 40 minutes: two rows, two known values, and an average of 30.",
    "runtime": "sql",
    "lesson": "backend-03"
  },
  {
    "source": "User b has NULL and 10: row_count 2, known_count 1, average 10.",
    "simple": "User b has an unknown duration and 10: two rows, one known value, and an average of 10.",
    "runtime": "sql",
    "lesson": "backend-03"
  },
  {
    "source": "Keep those column aliases and one result row per user;",
    "simple": "Keep those exact result-column names and return one row for each user.",
    "runtime": "sql",
    "lesson": "backend-03"
  },
  {
    "source": "ORDER BY user_id helps display the report predictably.",
    "simple": "`ORDER BY user_id` makes the displayed user order predictable.",
    "runtime": "sql",
    "lesson": "backend-03"
  },
  {
    "source": "The browser runs this SQL in an isolated SQLite database.",
    "simple": "The browser runs this SQL in a separate SQLite database for the exercise.",
    "runtime": "sql",
    "lesson": "backend-03"
  },
  {
    "source": "A real report API also needs an HTTP route.",
    "simple": "A real API also needs a route that receives an HTTP request for the report.",
    "runtime": "sql",
    "lesson": "backend-03"
  },
  {
    "source": "In your downloaded SQLite server, a GET /report handler can execute the grouped query with db.prepare(...).all() and send res.json(rows);",
    "simple": "In the downloaded server, a `GET /report` handler could run the grouped query with `db.prepare(...).all()` and reply with `res.json(rows)`.",
    "runtime": "sql",
    "lesson": "backend-03"
  },
  {
    "source": "this is a description of integration, not a standalone executable snippet.",
    "simple": "That sentence explains how to connect the pieces. It is not complete code you can run by itself.",
    "runtime": "sql",
    "lesson": "backend-03"
  },
  {
    "source": "The report should apply the project's permission rules when it contains private data.",
    "simple": "If the report contains private information, apply the project’s access rules before returning it.",
    "runtime": "sql",
    "lesson": "backend-03"
  },
  {
    "source": "Compare the actual HTTP response with the expected two rows before calling that API complete.",
    "simple": "Before calling the API complete, make a real HTTP request and compare its reply with the two expected rows.",
    "runtime": "sql",
    "lesson": "backend-03"
  },
  {
    "source": "Authentication asks who is signed in.",
    "simple": "Authentication checks who is signed in.",
    "runtime": "javascript",
    "lesson": "backend-04"
  },
  {
    "source": "Authorization asks whether that person may act on a particular record.",
    "simple": "Authorization checks whether that person is allowed to use this particular record.",
    "runtime": "javascript",
    "lesson": "backend-04"
  },
  {
    "source": "Validation asks whether the proposed values are acceptable.",
    "simple": "Validation checks whether the new values follow the rules.",
    "runtime": "javascript",
    "lesson": "backend-04"
  },
  {
    "source": "A protected update needs all three.",
    "simple": "A protected edit must pass identity, permission, and value checks.",
    "runtime": "javascript",
    "lesson": "backend-04"
  },
  {
    "source": "Being signed in does not grant access to someone else's record, and owning a record does not make an invalid duration acceptable.",
    "simple": "Signing in does not let you edit another person’s record. Owning a record also does not let you save an invalid duration.",
    "runtime": "javascript",
    "lesson": "backend-04"
  },
  {
    "source": "This complete standalone JavaScript example uses a verified-session fixture, not an actual sign-in system:",
    "simple": "This complete example uses pretend session information that is treated as already verified. It does not implement real sign-in.",
    "runtime": "javascript",
    "lesson": "backend-04"
  },
  {
    "source": "The statuses are 401 and 403;",
    "simple": "The example returns status 401, then 403.",
    "runtime": "javascript",
    "lesson": "backend-04"
  },
  {
    "source": "minutes remains 40.",
    "simple": "The saved minutes stay at 40 because neither change was allowed.",
    "runtime": "javascript",
    "lesson": "backend-04"
  },
  {
    "source": "401 asks for valid sign-in, 403 denies this authenticated user's permission, and 400 rejects bad input.",
    "simple": "401 means valid sign-in is needed. 403 means the signed-in person lacks permission. 400 means the submitted values are invalid.",
    "runtime": "javascript",
    "lesson": "backend-04"
  },
  {
    "source": "The order makes the write safe.",
    "simple": "The order of the checks protects the stored value.",
    "runtime": "javascript",
    "lesson": "backend-04"
  },
  {
    "source": "Return before assignment whenever a requirement fails.",
    "simple": "If any requirement fails, return before changing the record.",
    "runtime": "javascript",
    "lesson": "backend-04"
  },
  {
    "source": "A request body can claim ownerId: 'nora', but anyone can submit that text.",
    "simple": "Anyone can write `ownerId: 'nora'` in a request body. That claim alone proves nothing about their identity.",
    "runtime": "javascript",
    "lesson": "backend-04"
  },
  {
    "source": "The trusted identity must come from a server-verified session, then be compared with the record's stored owner.",
    "simple": "Get identity from a session the server has checked, then compare it with the record’s saved owner.",
    "runtime": "javascript",
    "lesson": "backend-04"
  },
  {
    "source": "The permission helper accepts that verified result;",
    "simple": "This helper is meant to receive identity information that has already been verified.",
    "runtime": "javascript",
    "lesson": "backend-04"
  },
  {
    "source": "it must not be treated as proof that an arbitrary supplied object really represents a signed-in person.",
    "simple": "Giving the helper an arbitrary object does not prove that the object represents a real signed-in user.",
    "runtime": "javascript",
    "lesson": "backend-04"
  },
  {
    "source": "Continue after the update helper with these separate record copies:",
    "simple": "Try these separate copies of the record after defining the update helper.",
    "runtime": "javascript",
    "lesson": "backend-04"
  },
  {
    "source": "The outputs are 400, 40, 200, 50, 40. {...original} copies these flat fields, letting us verify a rejected update without changing the baseline.",
    "simple": "The output is 400, 40, 200, 50, 40. `{...original}` copies these simple fields so rejected edits can be checked without altering the original record.",
    "runtime": "javascript",
    "lesson": "backend-04"
  },
  {
    "source": "A successful assignment changes only the allowed copy.",
    "simple": "The successful update changes only the copy it was allowed to edit.",
    "runtime": "javascript",
    "lesson": "backend-04"
  },
  {
    "source": "A session is a server-recognized sign-in state.",
    "simple": "A session is sign-in information the server recognizes.",
    "runtime": "javascript",
    "lesson": "backend-04"
  },
  {
    "source": "In a real flow, the server verifies credentials, issues an unpredictable token, and checks that token and its expiry on later requests.",
    "simple": "In a real app, the server checks sign-in details, creates a hard-to-guess token, and checks that token and its expiry on later requests.",
    "runtime": "javascript",
    "lesson": "backend-04"
  },
  {
    "source": "A cookie can carry the token.",
    "simple": "A browser cookie can carry that session token.",
    "runtime": "javascript",
    "lesson": "backend-04"
  },
  {
    "source": "The browser's claim to be a user is not trusted without that verification.",
    "simple": "Do not trust the browser simply saying which user it is. The server must verify the claim.",
    "runtime": "javascript",
    "lesson": "backend-04"
  },
  {
    "source": "Middleware runs before the route, validates the session, and attaches a trusted identity such as req.user;",
    "simple": "Middleware runs before the route. It checks the session and adds a trusted user identity, such as `req.user`.",
    "runtime": "javascript",
    "lesson": "backend-04"
  },
  {
    "source": "the route then performs record-specific authorization.",
    "simple": "The route must still check whether that user may act on this specific record.",
    "runtime": "javascript",
    "lesson": "backend-04"
  },
  {
    "source": "An Express middleware function typically receives req, res, and next.",
    "simple": "Express middleware usually receives the request, the response, and a function called `next`.",
    "runtime": "javascript",
    "lesson": "backend-04"
  },
  {
    "source": "It either sends an error response and returns, or calls next() to continue to the route.",
    "simple": "It can reply with an error and stop, or call `next()` to continue to the route.",
    "runtime": "javascript",
    "lesson": "backend-04"
  },
  {
    "source": "Validation middleware can reject a malformed body before writing.",
    "simple": "Input-checking middleware can reject a badly formed request before any data is saved.",
    "runtime": "javascript",
    "lesson": "backend-04"
  },
  {
    "source": "A final error handler can report a useful failure without exposing private records, passwords, or internal credentials.",
    "simple": "An error handler should explain failure without exposing private records, passwords, or internal access secrets.",
    "runtime": "javascript",
    "lesson": "backend-04"
  },
  {
    "source": "Responses and logs must not reveal another user's data just to explain permission denial.",
    "simple": "Do not reveal another user’s information in a response or log just to explain that access was denied.",
    "runtime": "javascript",
    "lesson": "backend-04"
  },
  {
    "source": "For the exercise, authorizeUpdate receives verified-session fixtures and mutates entry.minutes only after all checks pass.",
    "simple": "In this exercise, `authorizeUpdate` receives already-verified session examples and changes `entry.minutes` only after every check passes.",
    "runtime": "javascript",
    "lesson": "backend-04"
  },
  {
    "source": "Null session returns 401;",
    "simple": "A missing session returns 401.",
    "runtime": "javascript",
    "lesson": "backend-04"
  },
  {
    "source": "mismatched ownership returns 403;",
    "simple": "A user who does not own the record gets 403.",
    "runtime": "javascript",
    "lesson": "backend-04"
  },
  {
    "source": "invalid minutes returns 400;",
    "simple": "Invalid minutes get 400.",
    "runtime": "javascript",
    "lesson": "backend-04"
  },
  {
    "source": "a valid owner update returns 200 with entry.",
    "simple": "A valid edit by the owner returns 200 with the entry.",
    "runtime": "javascript",
    "lesson": "backend-04"
  },
  {
    "source": "True AND false AND true is false: valid sign-in and input cannot overcome failed ownership.",
    "simple": "All three checks must pass. A correct sign-in and valid number cannot make up for missing ownership.",
    "runtime": "javascript",
    "lesson": "backend-04"
  },
  {
    "source": "To finish actual protection locally, connect real session verification before using this helper;",
    "simple": "For real local protection, verify the actual session before calling this helper.",
    "runtime": "javascript",
    "lesson": "backend-04"
  },
  {
    "source": "the next full-stack project supplies a localhost sign-in flow.",
    "simple": "The next full-stack project includes a sign-in flow that runs on your own computer.",
    "runtime": "javascript",
    "lesson": "backend-04"
  },
  {
    "source": "A full-stack app connects a screen, an HTTP server, and durable storage.",
    "simple": "A full-stack app connects its visible screen, a web server, and storage that survives restarts.",
    "runtime": "javascript",
    "lesson": "backend-05"
  },
  {
    "source": "The screen sends a request.",
    "simple": "The screen asks the server to do something by sending a request.",
    "runtime": "javascript",
    "lesson": "backend-05"
  },
  {
    "source": "The server verifies the session, checks permissions and values, and writes permitted data.",
    "simple": "The server checks identity, permission, and values before saving any allowed change.",
    "runtime": "javascript",
    "lesson": "backend-05"
  },
  {
    "source": "The screen then reads the saved result.",
    "simple": "The screen then reads the result that was actually saved.",
    "runtime": "javascript",
    "lesson": "backend-05"
  },
  {
    "source": "A reload should read the database again, rather than rely on an old browser array.",
    "simple": "After a reload, read the saved database data again instead of trusting an old in-browser list.",
    "runtime": "javascript",
    "lesson": "backend-05"
  },
  {
    "source": "Each layer has a job, and a success message should reflect the server's actual result.",
    "simple": "Each part has a different job. Only show success when the server has really confirmed it.",
    "runtime": "javascript",
    "lesson": "backend-05"
  },
  {
    "source": "The browser exercise models an atomic transfer.",
    "simple": "The browser exercise models moving an amount as one all-or-nothing change.",
    "runtime": "javascript",
    "lesson": "backend-05"
  },
  {
    "source": "This separate standalone JavaScript example keeps an invariant, a fact that must remain true after every allowed change:",
    "simple": "This separate example keeps a rule that must remain true after every allowed change. Such a rule is called an invariant.",
    "runtime": "javascript",
    "lesson": "backend-05"
  },
  {
    "source": "Success returns available 18 and saved 8, total 26.",
    "simple": "On success, available becomes 18 and saved becomes 8. Their total remains 26.",
    "runtime": "javascript",
    "lesson": "backend-05"
  },
  {
    "source": "Invalid or forced-failure requests return 24 and 2.",
    "simple": "If the input is invalid or failure is forced, available stays 24 and saved stays 2.",
    "runtime": "javascript",
    "lesson": "backend-05"
  },
  {
    "source": "The original object remains unchanged because the function returns new objects.",
    "simple": "The original object is not changed. The function returns new objects instead.",
    "runtime": "javascript",
    "lesson": "backend-05"
  },
  {
    "source": "A failed save should show the failure and preserve the previous confirmed saved state.",
    "simple": "If saving fails, show the failure and keep the last saved state the server had confirmed.",
    "runtime": "javascript",
    "lesson": "backend-05"
  },
  {
    "source": "Here is a browser JavaScript fragment for a running same-origin API with GET/POST /entries and a verified session.",
    "simple": "This browser code needs a running API on the same origin, with GET and POST routes for `/entries` and a verified session.",
    "runtime": "javascript",
    "lesson": "backend-05"
  },
  {
    "source": "Pass it an existing output element;",
    "simple": "Give this code a page element that already exists for showing output.",
    "runtime": "javascript",
    "lesson": "backend-05"
  },
  {
    "source": "this fragment is not a standalone server or sign-in system.",
    "simple": "The fragment does not create a server or a sign-in system by itself.",
    "runtime": "javascript",
    "lesson": "backend-05"
  },
  {
    "source": "response.ok means an HTTP success status.",
    "simple": "`response.ok` means the server returned a successful HTTP status.",
    "runtime": "javascript",
    "lesson": "backend-05"
  },
  {
    "source": "Only a successful write leads to a new read here;",
    "simple": "Here, the app reads the data again only after the write succeeds.",
    "runtime": "javascript",
    "lesson": "backend-05"
  },
  {
    "source": "textContent displays returned text safely.",
    "simple": "`textContent` shows the returned words as text instead of treating them as HTML.",
    "runtime": "javascript",
    "lesson": "backend-05"
  },
  {
    "source": "A real interface must also catch rejected fetch promises, such as network failures.",
    "simple": "A real screen must also handle a failed `fetch` request, such as losing the network connection.",
    "runtime": "javascript",
    "lesson": "backend-05"
  },
  {
    "source": "The local project stores entries in practice.sqlite with id, owner, and minutes columns.",
    "simple": "The local app saves records in `practice.sqlite`, with columns for ID, owner, and minutes.",
    "runtime": "javascript",
    "lesson": "backend-05"
  },
  {
    "source": "A prepared insert supplies the session's user as owner, not an owner from the body.",
    "simple": "The insert uses the user from the verified session as the owner. It does not trust an owner named in the request body.",
    "runtime": "javascript",
    "lesson": "backend-05"
  },
  {
    "source": "A prepared SELECT with WHERE owner = ? reads only that session user's entries.",
    "simple": "The query `WHERE owner = ?` reads only records owned by that session’s user.",
    "runtime": "javascript",
    "lesson": "backend-05"
  },
  {
    "source": "Test as Alice, then Bob, to establish separation.",
    "simple": "Test using Alice, then Bob, to check that their records remain separate.",
    "runtime": "javascript",
    "lesson": "backend-05"
  },
  {
    "source": "Stopping and restarting clears memory sessions but should preserve database rows, so sign in again before checking persistence.",
    "simple": "Restarting loses the in-memory sign-in sessions but should keep database records. Sign in again before checking the saved data.",
    "runtime": "javascript",
    "lesson": "backend-05"
  },
  {
    "source": "The supplied localhost login compares the chosen account's configured password, creates a random token with randomBytes, and stores its user and expiry in a server-side Map.",
    "simple": "The local login checks the account’s configured password, makes a random token with `randomBytes`, and keeps the token’s user and expiry in a server-side `Map`.",
    "runtime": "javascript",
    "lesson": "backend-05"
  },
  {
    "source": "The cookie carries that token.",
    "simple": "The browser cookie carries the random session token.",
    "runtime": "javascript",
    "lesson": "backend-05"
  },
  {
    "source": "HttpOnly keeps page JavaScript from reading the cookie;",
    "simple": "`HttpOnly` stops page JavaScript from reading that cookie.",
    "runtime": "javascript",
    "lesson": "backend-05"
  },
  {
    "source": "SameSite=Strict limits when browsers attach it across sites;",
    "simple": "`SameSite=Strict` limits when the browser sends the cookie from another site.",
    "runtime": "javascript",
    "lesson": "backend-05"
  },
  {
    "source": "Max-Age sets a browser lifetime.",
    "simple": "`Max-Age` sets how long the browser keeps the cookie.",
    "runtime": "javascript",
    "lesson": "backend-05"
  },
  {
    "source": "The server still verifies its stored expiry.",
    "simple": "The server must still check its own saved expiry time.",
    "runtime": "javascript",
    "lesson": "backend-05"
  },
  {
    "source": "Environment variables supply passwords outside source code.",
    "simple": "Environment variables let you supply passwords without writing them in the source files.",
    "runtime": "javascript",
    "lesson": "backend-05"
  },
  {
    "source": "Use your own throwaway local values and do not put them in repository files.",
    "simple": "Use temporary passwords only for this local exercise. Do not save them in repository files.",
    "runtime": "javascript",
    "lesson": "backend-05"
  },
  {
    "source": "The learning server listens on 127.0.0.1, meaning only this computer's loopback address.",
    "simple": "This learning server listens at `127.0.0.1`, the address for connecting from the same computer.",
    "runtime": "javascript",
    "lesson": "backend-05"
  },
  {
    "source": "It is deliberately a localhost exercise.",
    "simple": "It is intentionally an exercise for your own computer, not a public service.",
    "runtime": "javascript",
    "lesson": "backend-05"
  },
  {
    "source": "Before a real public deployment, add HTTPS and Secure cookies, hashed password/account storage, login throttling, CSRF validation, and an established authentication library reviewed for your environment.",
    "simple": "Before making a real public app, add HTTPS, Secure cookies, safe hashed password storage, limits on login attempts, CSRF checks, and a suitable established sign-in library reviewed for that environment.",
    "runtime": "javascript",
    "lesson": "backend-05"
  },
  {
    "source": "CSRF means a different site trying to induce a signed-in browser to perform an unwanted action.",
    "simple": "CSRF is when another site tries to make a signed-in browser perform an action the user did not want.",
    "runtime": "javascript",
    "lesson": "backend-05"
  },
  {
    "source": "The supplied sign-in is not a production authentication system.",
    "simple": "The example’s local sign-in is not ready to serve as a production authentication system.",
    "runtime": "javascript",
    "lesson": "backend-05"
  },
  {
    "source": "Concurrent requests create another consistency risk.",
    "simple": "Two requests happening at nearly the same time can also cause inconsistent data.",
    "runtime": "javascript",
    "lesson": "backend-05"
  },
  {
    "source": "With a balance of 20, two requests can each read 20 and decide spending 15 is allowed.",
    "simple": "With a balance of 20, two requests might each read 20 and think spending 15 is allowed.",
    "runtime": "javascript",
    "lesson": "backend-05"
  },
  {
    "source": "If they both rely on that stale read, the combined requested spending is 30, exceeding 20.",
    "simple": "If both act on that old reading, they try to spend 30 from a balance of only 20.",
    "runtime": "javascript",
    "lesson": "backend-05"
  },
  {
    "source": "A database transaction or atomic conditional update must check the current balance when each write happens.",
    "simple": "Use a database transaction or a single conditional update to check the real current balance as each write occurs.",
    "runtime": "javascript",
    "lesson": "backend-05"
  },
  {
    "source": "After one valid spend the balance is 5, so the next spend of 15 must fail.",
    "simple": "After one request spends 15, only 5 remains. A second request to spend 15 must fail.",
    "runtime": "javascript",
    "lesson": "backend-05"
  },
  {
    "source": "A memory-only function test does not prove this database concurrency protection.",
    "simple": "Testing an in-memory function cannot prove the database safely handles simultaneous requests.",
    "runtime": "javascript",
    "lesson": "backend-05"
  },
  {
    "source": "For the exercise, amount must be a nonnegative integer no larger than available.",
    "simple": "For this task, allow only whole amounts from zero up to the current available amount.",
    "runtime": "javascript",
    "lesson": "backend-05"
  },
  {
    "source": "A successful 7-unit move from available 20/saved 0 returns 13/7 and preserves 20.",
    "simple": "Moving 7 from available 20 and saved 0 gives available 13 and saved 7. The total stays 20.",
    "runtime": "javascript",
    "lesson": "backend-05"
  },
  {
    "source": "A forced failure, negative amount, or overspend returns the old values in a copy.",
    "simple": "For a forced failure, negative amount, or overspend, return a copy containing the unchanged values.",
    "runtime": "javascript",
    "lesson": "backend-05"
  },
  {
    "source": "Then test the downloaded app separately: sign in, save valid minutes, reload, reject invalid input, check two-user separation, and check restart persistence.",
    "simple": "Also test the downloaded app itself: sign in, save valid minutes, reload, reject invalid input, separate two users’ data, and restart to check the data remains.",
    "runtime": "javascript",
    "lesson": "backend-05"
  },
  {
    "source": "The browser checks the transfer invariant;",
    "simple": "The browser tests the transfer’s unchanged-total rule.",
    "runtime": "javascript",
    "lesson": "backend-05"
  },
  {
    "source": "the actual screen, HTTP, storage, and session behavior need their own local evidence.",
    "simple": "The real screen, requests, database, and sign-in each still need their own local tests.",
    "runtime": "javascript",
    "lesson": "backend-05"
  }
];
