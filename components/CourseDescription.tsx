import descriptions from "../content/course-descriptions.json";
/** One shared explanation per course surface; never infer that every track is a language. */
export default function CourseDescription({track}:{track:string}) {
  const description = (descriptions as Record<string,string>)[track];
  return description ? <span className="course-description">{description}</span> : null;
}
