import type { Metadata } from "next";
import Link from "next/link";
import WorkspaceTitle from "../../components/WorkspaceTitle";
import catalog from "../../content/catalog.json";
import terms from "../../content/terminology.json";

const title = "CodeQuest — Coding lessons, explained examples and projects";
const lessonCount = catalog.units.length.toLocaleString("en-US");
const description = `Learn coding at your own pace with ${lessonCount} lessons across 21 courses, step-by-step code explanations and practical projects. Online with ChatGPT sign-in and offline after downloading.`;
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
          <h1>Learn coding, one clear step at a time.</h1>
          <p>
            Build your understanding with short lessons, worked examples and
            practical projects. CodeQuest explains what each part of the code
            does, then gives you a chance to use the idea yourself.
          </p>
          <p>
            <Link href="/" className="primary">
              Open CodeQuest
            </Link>
          </p>
        </WorkspaceTitle>
        <section className="panel">
          <h2>Explore 21 coding courses</h2>
          <p>
            Study Python, JavaScript, HTML, CSS, TypeScript, React, SQL, Swift,
            back-end development, AI and developer tools, alongside
            introductions to other languages. The curriculum contains{" "}
            {lessonCount} lessons and a glossary of{" "}
            {terms.length.toLocaleString("en-US")} terms.
          </p>
        </section>
        <section className="panel">
          <h2>Understand the code you write</h2>
          <p>
            Follow labeled code breakdowns, try understanding checks, and put
            ideas together in projects. Move at your own pace and return to
            earlier concepts when you need them. Some language and deployment
            exercises use external tools, with instructions in the lesson.
          </p>
        </section>
        <section className="panel">
          <h2>Learn online or prepare for offline study</h2>
          <p>
            Open the app and sign in with ChatGPT to keep your own learning
            records. Download the offline pack in Settings while online, then
            study cached lessons and use supported code runtimes in the same
            browser without a connection. Initial setup, account synchronization
            and some completion features require internet.
          </p>
          <p>
            The optional Coding Buddy also requires internet and your own
            supported AI provider key. It is separate from your ChatGPT
            subscription.
          </p>
        </section>
        <p>
          <a href="/third-party/README.txt">Third-party software notices</a>
        </p>
      </main>
    </div>
  );
}
