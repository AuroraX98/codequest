# CodeQuest

[**Open CodeQuest and start learning**](https://codequest.aurorax.chatgpt.site/)

Learn coding one idea at a time through explanations, examples, questions, and projects. CodeQuest has **21 courses and 1,231 lessons**. The courses work without an AI key.

## Start in your browser

1. Open CodeQuest and sign in with ChatGPT if asked.
2. Choose **Python** for a first program or **HTML** for a first web page in **Courses**. **Resume course** returns to your saved spot.
3. Read an idea, predict its result, then try the exercise or project. **Tools and concepts**, **Terminology**, and the **Table of Contents** help you revisit unfamiliar topics.

Python explanations keep the relevant code, definitions, values, and results beside them. Short notes connect each example to its explanation. Smaller example text wraps to fit its panel; copying keeps the original code intact. Settings offer larger reading text, hints, and optional progress rewards.

## Pick a course

| Course | What you’ll learn to do |
| --- | --- |
| Python | Give instructions, store values, and repeat tasks. |
| HTML | Build pages with headings, links, pictures, and forms. |
| CSS | Control colors, spacing, and layouts for different screens. |
| JavaScript | Make pages respond to clicks and typed input. |
| TypeScript | Describe expected values and catch type mistakes. |
| React | Build screens from reusable pieces that respond to changing data. |
| SQL | Store, organize, and ask questions about data in tables. |
| Backend development | Handle requests and save or retrieve information. |
| Developer toolkit | Track changes with Git, find bugs, and check fixes. |
| AI | Explore how models learn from examples and where predictions fail. |
| Swift | Work with values, functions, and Apple app interfaces. |
| Kotlin | Organize information with functions, collections, and classes. |
| Java | Group related data and actions in objects. |
| C# | Build programs with checked inputs and error handling. |
| C | Work with values, memory, and pointers. |
| C++ | Manage objects, collections, and ownership of resources. |
| Go | Write tools that coordinate work and handle errors. |
| Rust | Understand ownership, borrowing, and reliable data handling. |
| PHP | Handle web requests, forms, and stored information. |
| Ruby | Write programs that read, change, and organize information. |
| R | Explore data, compare groups, and make charts. |

## Run a copy on your computer

Local mode has its own saved progress and needs no sign-in. Initial setup needs internet.

1. Install [Node.js](https://nodejs.org/en/download), version **22.13 or newer**. It includes `npm`, which installs and starts the app.
2. Choose **Code → Download ZIP** on GitHub, extract it, and open the folder containing `package.json`.
3. Open a terminal in that folder. Run these commands one at a time:

   ```sh
   npm ci
   npm run local
   ```

4. Open [http://127.0.0.1:5173](http://127.0.0.1:5173) and keep the terminal running.

Next time, run `npm run local` in the same folder. **Ctrl+C** stops it. Startup was checked on macOS; a Windows user also reported success. [Windows setup help](docs/windows-setup.md)

## Running code and studying offline

Python, JavaScript, TypeScript, SQL, HTML, CSS, and React have browser runners. Other lessons may need local tools: C, C++, C#, Java, Kotlin, Go, Rust, PHP, Ruby, and R examples can be edited and downloaded, but have no in-app language runner. Follow their local setup instructions. Swift uses the [Mac companion](public/companion/README.txt); SwiftUI needs Xcode. Backend and developer-tool projects may need local servers or Git.

While online, choose **Settings → Download offline pack** and wait until it is ready. Use the same browser profile for downloaded lessons and supported exercises. Browsers can remove downloads to free space; external services and new packages may need internet.

**Coding Buddy** is optional. Connect your own DeepSeek, OpenAI, or Claude API key in Settings for live help. Your question and relevant lesson/code context go to that provider. API usage needs internet and may cost money separately from a chat subscription. [API key help](docs/api-key-removal.md)

## Keep your work

Online learning records save to your account. Local mode uses `.codequest-local/`, and some drafts stay in your browser. Keep the same folder and browser address. Use **Download backup** before moving work; **Restore project files** restores code, not a whole account. Local-example drafts have separate download controls.

Keep `.codequest-local/` and filled key files private and out of GitHub. A shared app folder shares learner data; downloaded lessons are accessible within that browser profile.

## About the project

Courses were made with ChatGPT’s help; some topics draw on MIT teaching materials. The [MIT license](LICENSE) covers original app code; it excludes lesson and teaching content. Outside software keeps its own terms: [third-party notices](public/third-party/README.txt).

For a separate online copy, follow the [hosting guide](docs/hosting-a-copy.md). Contributors: [`lessons`](content/lessons.json), [`documentation`](docs/), and [`checks`](tests/). Build with `npm run build`. Verification reports apply only to their stated checks and releases.
