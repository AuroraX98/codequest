# Extra practice projects from your AI assistant

Use extra practice when you want another project for a topic you are learning. You choose the course topic and difficulty, and your connected assistant creates teaching pages, a task, small steps, hints, starter code, and project checks.

These projects are separate from the original 103 course topics. They do not replace course exercises, mark an official topic complete, or earn official course XP.

## Before you generate a project

Sign in, connect your own DeepSeek, OpenAI, or Claude key in Settings, and enable the AI assistant. Generation requires internet. CodeQuest uses only the connected provider; it does not silently switch to another one. A generation counts as an AI request. CodeQuest has no daily request cap, but your provider's charges and limits apply.

Pick a topic you have studied. Beginner, intermediate, and advanced change the amount of reasoning and the number of steps. The generation instructions ask the assistant to stay with the topic's theory and explain any additional concept before asking you to use it. They also ask for plain explanations and at least two worked code examples. AI can still make mistakes; if a term is unclear, ask for clarification before continuing.

You can add a short project idea of up to 500 characters, such as a pet introduction or a score tracker. Describe what you want to build using made-up information. Your idea and the selected topic's teaching notes go to your chosen provider. Avoid putting passwords, API keys, or personal information in the idea or project code.

## Generate, learn, and build

1. Open **Build studio → AI practice**. **Course project** returns to the original course project.
2. Choose **Course topic** and **Practice difficulty**. Add **Your idea (optional)** if you want a particular theme.
3. Select **Generate practice project**. The button shows **Creating project…**, then **Checking the project…** while the app verifies it. **Stop** cancels the current work without deleting saved practices.

Wait for the result and reference checks before beginning. If generation or validation fails, read the message and try another project; your existing course work stays saved. **Open AI settings** helps you connect or enable the assistant when needed.

Read the teaching pages with **Next explanation** and **Back**, then follow **Your task**, the steps, and **What your finished project should do**. Edit the code and select **Run practice** to see its output and which checks pass. For a project with several files, choose a filename button to switch the editor.

Use **Give me a hint** when you need a smaller next step. **Show example solution** reveals one generated solution, and **Hide example solution** closes it. Try the project first so you can compare the solution with your own reasoning.

Changing code invalidates the previous run result. Run the current version again before selecting **Mark practice complete**. A successful practice run confirms that the current code met that project's generated checks. It does not certify mastery of a whole language or guarantee that the AI wrote perfect checks.

## What validation means

CodeQuest rejects malformed or oversized project responses, unexpected fields, unsupported file layouts, and detected credentials or external URLs. Supported browser projects run inside the app's isolated runner. Before saving a newly generated browser project, the app checks that its example solution passes and its unfinished starter leaves failing checks. The ready message states what was verified.

These protections have limits. The returned project is still AI-generated material. A reference solution can pass a weak check, and a worked example can contain a mistake. Read the requirements and compare the output with the explanation. If they disagree, request a different project instead of relying only on a green result.

Generated browser projects use the bundled runtimes and local example data. They cannot require an external package installation, a real network service, or a key in the code. Python uses supported bundled modules or local fixtures. SQL uses SQLite with local setup data. Browser JavaScript, TypeScript, HTML, CSS, and React projects use the corresponding existing runner.

Swift requires the Mac companion. For a Swift project with automated checks, the app can verify its reference example when the companion is connected; without it, the example stays unverified. SwiftUI projects also require Xcode and manual review of the displayed requirements, so their examples are not treated as automatically verified. A browser generation response does not prove a SwiftUI screen works. Follow the project-specific notes and select **I checked the required local steps** after checking them yourself.

## Saved projects, history, and backups

Generated projects and edits are saved for your account in this browser's local storage database. They are not automatically synced as official course progress to another device. Switching accounts keeps the saved practice lists separate.

**Your saved practice** lists up to 20 projects. Choose one using the saved-project selector. The browser keeps up to 20 previous versions per project. Select **Download practice backup** before creating enough projects to replace the oldest saved ones. Practice backups are separate from the regular learning backup, and contain the generated project material and your code without your provider API key.

Select **Restore practice backup** and choose the practice JSON file. An imported project's old validation or completion claims are not accepted as current run evidence; its example is labeled unverified, and you must run your current code before recording completion. Review the requirements as well. If the same project already exists, import keeps a separate copy so it does not overwrite your current edits.

**Download this file** saves the currently selected source file. **History** opens earlier versions; choose a dated **Restore** button to restore one. **Reset starter** asks for confirmation and replaces the practice files with their starters after saving the current version in History. These actions change the editor contents; keep a backup of work you want to preserve.

## Offline use

Generate projects while online. After saving them on this device and downloading the offline pack, supported browser projects can be reopened, edited, and run offline. New generation and live AI explanations need a connection. Swift still needs the local companion, and SwiftUI needs Xcode.

Clearing browser data or losing this browser profile can remove locally saved practices. A downloaded backup lets you restore them later. Your AI key remains managed through the separate account connection and is excluded from practice storage and backups.

See [API key storage and removal](api-key-removal.md), [Connect an API key from a file](api-key-file.md), and the [browser verification report](browser-test-report.md) for related instructions and the checks completed so far.
