# CodeQuest

[**Open CodeQuest and start learning**](https://codequest.aurorax.chatgpt.site/)

CodeQuest teaches coding one idea at a time. Read a short explanation, tap a piece of code to see what it does, then try it yourself. It’s for first-time coders and for people who want practice with a language they’ve used before. There are **21 courses and 1,221 lessons**.

## Start in your browser

1. Open CodeQuest using the link above. Sign in with ChatGPT if asked.
2. Open **Courses**. Choose **Python** for a first program or **HTML** to make a first web page. On a phone, use the **Course** menu. On a larger screen, choose **Show courses** if the list is closed.
3. Select the first lesson, or choose **Resume course** to open your saved spot. The **Learn** tab shows one idea at a time.

## Get more from one lesson

1. **Read one idea.** If a word is new, look it up in **Terminology**.
2. **Predict what the example will do.** In Python, `print("Hi")` shows the word **Hi**. Tap the code labels to see which part tells Python to show something and which part gives it the words.
3. **Change one thing.** In an exercise you can run, change `"Hi"` to your name. Guess what will appear, then run the code and check.
4. **Use it from memory.** Open **Try it**. If you get stuck, revisit that idea in the **Table of Contents** and try again. When you’re ready, open **Projects** to use what you learned.

## Pick a course

| Course | What you’ll learn to do |
| --- | --- |
| Python | Give the computer instructions, store answers, and repeat a task. |
| HTML | Build a web page with headings, links, pictures, and forms. |
| CSS | Change a page’s colors, spacing, and layout so it fits different screens. |
| JavaScript | Make a page react when someone clicks a button or types a word. |
| TypeScript | Catch mistakes early, like giving a word to code that expects a number. |
| React | Build a screen from reusable pieces, like a task card that updates when you tap it. |
| SQL | Ask a table of data a question, like “Which tasks are still open?” |
| Back-end development | Build the part of an app that receives a request and saves or finds an answer. |
| Developer toolkit | Track changes with Git, find bugs, and check that a fix works. |
| AI | Learn how computers find patterns in examples, then test where their guesses go wrong. |
| Swift | Write code for Apple apps, from storing a score to updating a list on screen. |
| Kotlin | Use functions and lists to organize data, like a set of study sessions. |
| Java | Group related information and actions, like a study session and the code that updates it. |
| C# | Build a small study tracker that checks its input and handles mistakes. |
| C | See how a program stores values in memory and reads them back safely. |
| C++ | Build a small game that keeps track of what happens as you play. |
| Go | Build tools that share work across tasks and handle errors. |
| Rust | Learn which part of a program owns a value and when another part can use it. |
| PHP | Handle a web form and save its answers in a database. |
| Ruby | Write small programs that read, change, and save information, like a study log. |
| R | Explore numbers, compare groups, and draw charts that help you explain what you found. |

## Use CodeQuest without internet

While online, open **Settings**, download the offline learning pack, and wait for the check to finish. Later, open CodeQuest in the same browser and profile. Downloaded lessons and supported code exercises work offline. Reconnect to sync your work and confirm lesson completion. Some projects, such as making an Apple app, need the tools named in the lesson.

**Coding Buddy** is optional. The lessons work on their own. For live AI help, connect your own API key in **Settings**. A key lets the app ask your AI provider for help. Keep it private. The provider may charge for use. [API key help](docs/api-key-removal.md)

## Run a copy on your computer

Choose this option for a local copy with its own saved progress and no sign-in. You’ll need internet the first time.

1. Install [Node.js](https://nodejs.org/en/download) and choose **Latest LTS**. Node.js runs the app and includes `npm`, the tool used in the next steps.
2. On GitHub, choose **Code → Download ZIP**, then extract the ZIP. Open the folder that contains `package.json`.
3. Open a terminal in that folder. On Windows, click the folder’s address bar, type `cmd`, and press **Enter**. Run these commands one at a time. Wait for the first to finish before starting the second.

   ```sh
   npm ci
   npm run local
   ```

4. Open **http://127.0.0.1:5173** in your browser, or use the address printed in the terminal. Keep the terminal open while learning.

Next time, run just `npm run local` in the same folder. Press **Ctrl+C** in the terminal to stop. Your local work lives in `.codequest-local`. Keep that folder private when you back it up. [Windows setup help](docs/windows-setup.md)

The local setup has been checked on Windows. macOS setup still needs testing. To put your own copy online, see the [hosting guide](docs/hosting-a-copy.md).

## About the material

The courses were made with help from ChatGPT. Some topics draw on free MIT teaching materials. The [license](LICENSE) covers the original app code. Teaching material has separate terms, and outside software keeps its own license. [Third-party notices](public/third-party/README.txt)
