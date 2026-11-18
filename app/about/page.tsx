import type { Metadata } from "next";
import Link from "next/link";
import WorkspaceTitle from "../../components/WorkspaceTitle";
import catalog from "../../content/catalog.json";
import terms from "../../content/terminology.json";

const title = "CodeQuest — Learn to code one step at a time";
const lessonCount = catalog.units.length.toLocaleString("en-US");
const courseCount = new Set(catalog.units.map(unit => unit.track)).size;
const description = `Learn to code with ${lessonCount} lessons across ${courseCount} courses. Find a lesson by title, tap a word for help, and try a short quiz or a small project.`;
const url = "https://codequest.aurorax.chatgpt.site/about";
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  robots: { index: true, follow: true },
  openGraph: {
    title,
    description,
    url,
    type: "website",
    siteName: "CodeQuest",
  },
  twitter: { card: "summary", title, description },
};

export default function AboutCodeQuest() {
  return (
    <div className="app simple-learning" data-workspace="about">
      <main className="about-layout">
        <WorkspaceTitle section="courses">
          <p className="eyebrow">CodeQuest</p>
          <h1>Learn to code one step at a time</h1>
          <p>
            Read one idea, see it in a code example, then try it yourself.
            Start with Python to write your first program or HTML to make
            your first web page.
          </p>
          <p>
            <Link href="/" className="primary">
              Open CodeQuest
            </Link>
          </p>
        </WorkspaceTitle>
        <section className="panel">
          <h2>Find a lesson</h2>
          <p>
            Choose from {lessonCount} lessons across {courseCount} courses.
            In Courses, pick your course and level, then search by lesson title,
            topic, or project name. Open a lesson to read it, take its quiz, or
            try its project.
          </p>
        </section>
        <section className="panel">
          <h2>Understand the code you write</h2>
          <p>
            Tap a linked word to see what it means. In a lesson about styling a
            web page, a picture shows how padding adds room between a button’s
            text and its border. Use Next and Back to go through the example
            at your own pace.
          </p>
          <p>
            Code wraps to fit your phone screen. You can make the text larger
            in Settings or look up {terms.length.toLocaleString("en-US")} coding
            terms in Terminology. Some projects use tools on your computer.
            Those lessons tell you what to open.
          </p>
        </section>
        <section className="panel">
          <h2>Keep learning offline</h2>
          <p>
            Sign in with ChatGPT to save your progress online. While you have
            internet, open Settings and choose Download offline pack. Later,
            use the same browser to read the lessons and try supported exercises
            offline. Reconnect to sync your progress and use features that need
            internet.
          </p>
          <p>
            You can take the courses without an AI key. For live help from
            Coding Buddy, you need internet and an API key from a supported AI
            service. The service may charge for use separately from your
            ChatGPT subscription.
          </p>
        </section>
        <p>
          <a href="/third-party/README.txt">Third-party software notices</a>
        </p>
      </main>
    </div>
  );
}
