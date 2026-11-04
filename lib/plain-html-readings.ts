// Reviewed HTML sentence counterparts.
const readings = [
  {
    "source": "A web page starts with content: words, pictures, and actions.",
    "simple": "A web page contains things to read, see, and use.",
    "runtime": "html",
    "lesson": "html-01"
  },
  {
    "source": "HTML means HyperText Markup Language.",
    "simple": "HTML is the name of the language used to describe a web page’s parts. Its full name is HyperText Markup Language.",
    "runtime": "html",
    "lesson": "html-01"
  },
  {
    "source": "“Markup” means adding labels around content so a browser knows what each part means.",
    "simple": "HTML adds labels such as “heading” or “paragraph” around content so the browser knows what it is.",
    "runtime": "html",
    "lesson": "html-01"
  },
  {
    "source": "A browser is the program that opens a website.",
    "simple": "A browser is an app that shows websites, such as Chrome or Firefox.",
    "runtime": "html",
    "lesson": "html-01"
  },
  {
    "source": "An HTML element is a whole piece, such as a heading together with its tags.",
    "simple": "An element is one complete part of a page, including the tags that mark its edges.",
    "runtime": "html",
    "lesson": "html-01"
  },
  {
    "source": "In <p>Hello!</p>, <p> starts a paragraph, Hello! is the content, and </p> ends it.",
    "simple": "In `<p>Hello!</p>`, `<p>` starts the paragraph, Hello! is the text, and `</p>` closes the paragraph.",
    "runtime": "html",
    "lesson": "html-01"
  },
  {
    "source": "The slash means “this element ends here.” HTML names meaning and structure;",
    "simple": "The `/` in a closing tag marks the end of an element. HTML describes what each page part means and where it belongs.",
    "runtime": "html",
    "lesson": "html-01"
  },
  {
    "source": "colors and spacing are usually CSS's job.",
    "simple": "CSS usually chooses how the page looks, including colors and space between parts.",
    "runtime": "html",
    "lesson": "html-01"
  },
  {
    "source": "This is a complete small HTML document.",
    "simple": "The next example has all the HTML needed for this small page.",
    "runtime": "html",
    "lesson": "html-01"
  },
  {
    "source": "Save it as index.html and open it in a browser.",
    "simple": "Name the file `index.html`, then open that file in a browser.",
    "runtime": "html",
    "lesson": "html-01"
  },
  {
    "source": "The first line asks for modern HTML behavior. html wraps the document;",
    "simple": "The first line tells the browser to use modern HTML rules. The `html` element surrounds the document.",
    "runtime": "html",
    "lesson": "html-01"
  },
  {
    "source": "lang=\"en\" says its language is English, which helps tools read it aloud. head holds information about the page. title names the browser tab. body holds the visible content. h1 gives the main heading, and p gives the paragraph. meta provides a document setting. charset=\"utf-8\" tells the browser to interpret the file using UTF-8, a character encoding that can represent letters and symbols from many languages.",
    "simple": "`lang=\"en\"` means English. `head` holds page information, and `title` names the browser tab. `body` holds what people see. `h1` is the main heading and `p` is a paragraph. `meta charset=\"utf-8\"` tells the browser how to read letters and symbols from many languages.",
    "runtime": "html",
    "lesson": "html-01"
  },
  {
    "source": "The angle brackets < and > mark tags.",
    "simple": "The marks `<` and `>` surround a tag’s name and settings.",
    "runtime": "html",
    "lesson": "html-01"
  },
  {
    "source": "An attribute is an extra setting inside an opening tag.",
    "simple": "An attribute is a setting written inside the starting tag.",
    "runtime": "html",
    "lesson": "html-01"
  },
  {
    "source": "In lang=\"en\", lang is the attribute name and \"en\" is its value.",
    "simple": "In `lang=\"en\"`, the setting is named `lang`, and its value is `en`.",
    "runtime": "html",
    "lesson": "html-01"
  },
  {
    "source": "The equals sign connects them;",
    "simple": "The `=` connects a setting name to the value you give it.",
    "runtime": "html",
    "lesson": "html-01"
  },
  {
    "source": "quotes mark where the value starts and ends.",
    "simple": "The quotes show where that setting’s value starts and stops.",
    "runtime": "html",
    "lesson": "html-01"
  },
  {
    "source": "Nesting means putting one element inside another.",
    "simple": "Nesting means placing one page element inside another.",
    "runtime": "html",
    "lesson": "html-01"
  },
  {
    "source": "In the example, h1 and p are inside body.",
    "simple": "Here, the heading `h1` and paragraph `p` are both inside `body`.",
    "runtime": "html",
    "lesson": "html-01"
  },
  {
    "source": "Close the inside element before closing its parent: <body><p>Text</p></body>.",
    "simple": "Close the inner part first. In `<body><p>Text</p></body>`, the paragraph closes before the body.",
    "runtime": "html",
    "lesson": "html-01"
  },
  {
    "source": "Indenting each nested level makes this relationship easier to see.",
    "simple": "Add spaces at the start of inner lines so you can see what belongs inside what.",
    "runtime": "html",
    "lesson": "html-01"
  },
  {
    "source": "Indentation helps people;",
    "simple": "Those leading spaces make the code easier for people to read.",
    "runtime": "html",
    "lesson": "html-01"
  },
  {
    "source": "it does not choose the tag's meaning.",
    "simple": "The tag names, not the spaces before them, say what each element means.",
    "runtime": "html",
    "lesson": "html-01"
  },
  {
    "source": "An anchor, written a, makes a link.",
    "simple": "The `a` element makes a link. Its technical name is an anchor.",
    "runtime": "html",
    "lesson": "html-01"
  },
  {
    "source": "Its href attribute holds the destination address.",
    "simple": "Put the address the link should open in `href`.",
    "runtime": "html",
    "lesson": "html-01"
  },
  {
    "source": "The visible words between <a> and </a> tell readers what they will open.",
    "simple": "The words between `<a>` and `</a>` are the link text a reader sees.",
    "runtime": "html",
    "lesson": "html-01"
  },
  {
    "source": "These jobs are different: changing the words does not change the address.",
    "simple": "Changing the link’s visible words does not change the address stored in `href`.",
    "runtime": "html",
    "lesson": "html-01"
  },
  {
    "source": "Use useful words such as “Read the park guide,” rather than “Click here.” A full address such as https://example.org/lookout includes a scheme, https, and a site name.",
    "simple": "Use link words that explain the destination, like “Read the park guide.” In `https://example.org/lookout`, `https` says how to connect, and `example.org` names the site.",
    "runtime": "html",
    "lesson": "html-01"
  },
  {
    "source": "A local filename can also be a destination.",
    "simple": "A link can point to another file in your website, not just a full web address.",
    "runtime": "html",
    "lesson": "html-01"
  },
  {
    "source": "The destination still needs to exist;",
    "simple": "The file or page named by the link must really be there.",
    "runtime": "html",
    "lesson": "html-01"
  },
  {
    "source": "making a link does not create the other page.",
    "simple": "Writing a link does not make a new destination page for you.",
    "runtime": "html",
    "lesson": "html-01"
  },
  {
    "source": "These two elements can go inside body, after the paragraph in the first example.",
    "simple": "Put these two new elements inside `body`, after the earlier paragraph.",
    "runtime": "html",
    "lesson": "html-01"
  },
  {
    "source": "Clicking the link asks the browser to open the href address. src means the image's source: the file or address from which to load it.",
    "simple": "A click opens the link’s `href` address. For an image, `src` tells the browser which file or address to get the picture from.",
    "runtime": "html",
    "lesson": "html-01"
  },
  {
    "source": "This example needs a real lookout.jpg file beside index.html. img is a void element, meaning it has no content between opening and closing tags, so it needs no </img>.",
    "simple": "Put a real file called `lookout.jpg` beside `index.html`. An `img` has no content inside it, so do not add a closing `</img>` tag.",
    "runtime": "html",
    "lesson": "html-01"
  },
  {
    "source": "The attributes still belong to its opening tag even when they use separate lines.",
    "simple": "Writing settings on separate lines does not create new tags. They still belong to the same opening tag.",
    "runtime": "html",
    "lesson": "html-01"
  },
  {
    "source": "Alt text is a written replacement for an image's useful information.",
    "simple": "Alt text explains the useful information in an image using words.",
    "runtime": "html",
    "lesson": "html-01"
  },
  {
    "source": "It can help when the picture fails to load or when someone uses a screen reader, a tool that speaks or presents page content in another way.",
    "simple": "Alt text helps if the image cannot load or someone uses a tool that reads the page aloud or presents it another way.",
    "runtime": "html",
    "lesson": "html-01"
  },
  {
    "source": "Describe the information that matters here, rather than writing “image” or repeating a filename.",
    "simple": "Describe what someone needs to know from the picture, not just its file name or the word “image.”",
    "runtime": "html",
    "lesson": "html-01"
  },
  {
    "source": "A decorative image that adds no information normally gets alt=\"\".",
    "simple": "If a picture is only decoration and adds no information, use `alt=\"\"` so it can be skipped.",
    "runtime": "html",
    "lesson": "html-01"
  },
  {
    "source": "This project's image is informative, so give it a useful description.",
    "simple": "This project’s image tells the reader something, so write a description that shares that information.",
    "runtime": "html",
    "lesson": "html-01"
  },
  {
    "source": "A long description can pass a length check while still being unhelpful;",
    "simple": "A description can be long enough to pass a check and still fail to explain the picture.",
    "runtime": "html",
    "lesson": "html-01"
  },
  {
    "source": "read your own words and ask what a person would learn from them.",
    "simple": "Read the description yourself. Does it tell someone what matters in the image?",
    "runtime": "html",
    "lesson": "html-01"
  },
  {
    "source": "Before the project, predict what happens if you change href but keep the link words: the destination changes while the words stay the same.",
    "simple": "If you change only `href`, the link opens a different place but keeps the same visible words.",
    "runtime": "html",
    "lesson": "html-01"
  },
  {
    "source": "Now predict changing alt: the image file stays the same, while its written description changes.",
    "simple": "If you change only `alt`, the picture stays the same but its written description changes.",
    "runtime": "html",
    "lesson": "html-01"
  },
  {
    "source": "For the exercise, keep a main heading and add a short p, an a whose href is exactly https://example.org/trail, and an img with descriptive alt text.",
    "simple": "Keep the main heading. Add a short paragraph, a link to exactly `https://example.org/trail`, and an image with helpful alt text.",
    "runtime": "html",
    "lesson": "html-01"
  },
  {
    "source": "Check that all four parts exist, then actually follow the link and inspect the picture.",
    "simple": "Check the heading, paragraph, link, and image. Then open the link and look at the picture yourself.",
    "runtime": "html",
    "lesson": "html-01"
  },
  {
    "source": "The automatic checks can find the elements and address;",
    "simple": "The automatic tests can check that the page parts and the link address exist.",
    "runtime": "html",
    "lesson": "html-01"
  },
  {
    "source": "they cannot judge whether your description matches the real image.",
    "simple": "Those tests cannot tell whether your words describe what is really in the picture.",
    "runtime": "html",
    "lesson": "html-01"
  },
  {
    "source": "A website can contain several HTML documents.",
    "simple": "A website can have more than one HTML page.",
    "runtime": "html",
    "lesson": "html-02"
  },
  {
    "source": "Each document is a separate file, even when the pages look similar.",
    "simple": "Each page is its own file, even if the pages have a similar design.",
    "runtime": "html",
    "lesson": "html-02"
  },
  {
    "source": "A link joins them by giving the browser a path.",
    "simple": "A link tells the browser how to get from one file to another.",
    "runtime": "html",
    "lesson": "html-02"
  },
  {
    "source": "A path tells it where to look for a file. index.html is often the name of the starting page;",
    "simple": "A path tells the browser where a file is. The first page is often called `index.html`.",
    "runtime": "html",
    "lesson": "html-02"
  },
  {
    "source": "it is still an ordinary HTML file.",
    "simple": "Even with that common name, `index.html` is a normal HTML file.",
    "runtime": "html",
    "lesson": "html-02"
  },
  {
    "source": "Putting another filename in a paragraph only shows those words.",
    "simple": "Writing a file name in a paragraph shows the name but does not make it clickable.",
    "runtime": "html",
    "lesson": "html-02"
  },
  {
    "source": "To make navigation, put the filename in an a element's href.",
    "simple": "Put the file name in an `a` element’s `href` to make a working link.",
    "runtime": "html",
    "lesson": "html-02"
  },
  {
    "source": "The destination file must exist at that location, and the spelling must match.",
    "simple": "The file must be in the place you name, with exactly the same spelling.",
    "runtime": "html",
    "lesson": "html-02"
  },
  {
    "source": "Save this example as index.html.",
    "simple": "Save the next example in a file named `index.html`.",
    "runtime": "html",
    "lesson": "html-02"
  },
  {
    "source": "It is a complete home page for a different hobby.",
    "simple": "This example is a whole home page for another hobby.",
    "runtime": "html",
    "lesson": "html-02"
  },
  {
    "source": "The h1 names the visible page. p adds an ordinary paragraph. a wraps the useful link words, and href=\"materials.html\" asks for a file beside this page.",
    "simple": "`h1` names the page, `p` holds a paragraph, and `a` holds the link words. `href=\"materials.html\"` points to a file in the same folder.",
    "runtime": "html",
    "lesson": "html-02"
  },
  {
    "source": "The address is relative: the browser works it out using the current page's location.",
    "simple": "This short address is relative: the browser starts from the page you are on to find the other file.",
    "runtime": "html",
    "lesson": "html-02"
  },
  {
    "source": "A relative path starts from a known location instead of naming a whole website. materials.html means “look in the same folder.” images/fold.jpg means “open the images folder, then find fold.jpg.” ../index.html means “move up one folder, then find index.html.” A full address such as https://example.org/models starts with a scheme and site name.",
    "simple": "`materials.html` means the same folder. `images/fold.jpg` means the `fold.jpg` file inside the `images` folder. `../index.html` means go up one folder, then find `index.html`. A full address like `https://example.org/models` names the website too.",
    "runtime": "html",
    "lesson": "html-02"
  },
  {
    "source": "File names can be case sensitive on a web server: Materials.html and materials.html may differ.",
    "simple": "Capital letters may matter on the server. `Materials.html` might be a different file from `materials.html`.",
    "runtime": "html",
    "lesson": "html-02"
  },
  {
    "source": "Spaces and accidentally changed extensions also cause broken links.",
    "simple": "Extra spaces or a different ending, such as `.txt` instead of `.html`, can also break a link.",
    "runtime": "html",
    "lesson": "html-02"
  },
  {
    "source": "Follow the actual file names, rather than guessing from the page's heading.",
    "simple": "Use the real file name. The heading shown on the page may be different.",
    "runtime": "html",
    "lesson": "html-02"
  },
  {
    "source": "A list groups related items. ul means unordered list: the order is not meant to be a sequence of steps, and browsers usually show bullets. ol means ordered list: the order matters, and browsers usually show numbers.",
    "simple": "A list groups items. Use `ul` for items whose order is not a sequence of steps, usually shown with bullets. Use `ol` when the order matters, usually shown with numbers.",
    "runtime": "html",
    "lesson": "html-02"
  },
  {
    "source": "Each list entry goes inside li, meaning list item.",
    "simple": "Write each list item inside its own `li` element.",
    "runtime": "html",
    "lesson": "html-02"
  },
  {
    "source": "Put li elements inside ul or ol, then close each li before starting another.",
    "simple": "Put the `li` items inside `ul` or `ol`. Close each `li` before the next one.",
    "runtime": "html",
    "lesson": "html-02"
  },
  {
    "source": "Do not use paragraphs with typed bullet characters when you mean a real list.",
    "simple": "Use HTML list elements rather than typing bullet symbols into separate paragraphs.",
    "runtime": "html",
    "lesson": "html-02"
  },
  {
    "source": "List elements let browsers and assistive tools recognize how many entries belong together.",
    "simple": "Real list elements tell the browser and reading tools which items belong together and how many there are.",
    "runtime": "html",
    "lesson": "html-02"
  },
  {
    "source": "Save this second complete document as materials.html beside index.html.",
    "simple": "Save the second page as `materials.html` in the same folder as `index.html`.",
    "runtime": "html",
    "lesson": "html-02"
  },
  {
    "source": "main identifies the main content. ul contains two li children.",
    "simple": "`main` marks the page’s main content. This `ul` has two items inside it.",
    "runtime": "html",
    "lesson": "html-02"
  },
  {
    "source": "The return link points to the first file, so navigation works in both directions.",
    "simple": "The second page links back to the first, so you can move in both directions.",
    "runtime": "html",
    "lesson": "html-02"
  },
  {
    "source": "Both links need their destination files;",
    "simple": "Each link needs the file it points to.",
    "runtime": "html",
    "lesson": "html-02"
  },
  {
    "source": "neither link creates a document.",
    "simple": "Neither link makes the other file automatically.",
    "runtime": "html",
    "lesson": "html-02"
  },
  {
    "source": "HTML is nested.",
    "simple": "HTML puts some elements inside other elements.",
    "runtime": "html",
    "lesson": "html-02"
  },
  {
    "source": "The second page's list is inside main, and its items are inside ul.",
    "simple": "On the second page, the list is inside `main`, and each list item is inside `ul`.",
    "runtime": "html",
    "lesson": "html-02"
  },
  {
    "source": "Closing </ul> ends the list, so the following a is outside that list.",
    "simple": "After `</ul>`, the list has ended. The next link is not a list item.",
    "runtime": "html",
    "lesson": "html-02"
  },
  {
    "source": "Most of these elements use opening and closing tags.",
    "simple": "Most elements in this example have a starting tag and a matching ending tag.",
    "runtime": "html",
    "lesson": "html-02"
  },
  {
    "source": "The slash closes an element;",
    "simple": "A `/` in an ending tag closes that element.",
    "runtime": "html",
    "lesson": "html-02"
  },
  {
    "source": "it is not part of a file path here.",
    "simple": "This slash is closing an HTML element, not separating folders in an address.",
    "runtime": "html",
    "lesson": "html-02"
  },
  {
    "source": "Attributes go in opening tags, and their values go in quotes.",
    "simple": "Write settings in the starting tag, with quotes around their values.",
    "runtime": "html",
    "lesson": "html-02"
  },
  {
    "source": "Read this code from the outside inward if you lose your place: html contains body, body contains main, and main contains the heading, list, and link.",
    "simple": "If the nesting is confusing, start with the outer part: `html` contains `body`, which contains `main`. Inside `main` are the heading, list, and link.",
    "runtime": "html",
    "lesson": "html-02"
  },
  {
    "source": "For the project, keep the home heading exactly Garden journal and keep its paragraph.",
    "simple": "For this project, keep the heading exactly `Garden journal` and keep its paragraph.",
    "runtime": "html",
    "lesson": "html-02"
  },
  {
    "source": "Add a useful link whose href is supplies.html.",
    "simple": "Add a link with useful words and `href=\"supplies.html\"`.",
    "runtime": "html",
    "lesson": "html-02"
  },
  {
    "source": "The supplied supplies.html already has its list and its link back to index.html;",
    "simple": "The supplied `supplies.html` already contains its list and a link back to `index.html`.",
    "runtime": "html",
    "lesson": "html-02"
  },
  {
    "source": "inspect it so you can explain both directions.",
    "simple": "Read both files so you can explain the link going each way.",
    "runtime": "html",
    "lesson": "html-02"
  },
  {
    "source": "Open the home page, follow the supplies link, and follow the return link.",
    "simple": "Open the home page, use its supplies link, then use the link back home.",
    "runtime": "html",
    "lesson": "html-02"
  },
  {
    "source": "A check can confirm that the home anchor exists and has words, but that alone does not prove both files open.",
    "simple": "A test can find a link and its text without proving that both destination files open.",
    "runtime": "html",
    "lesson": "html-02"
  },
  {
    "source": "If navigation fails, compare the href with the actual filename and folder first.",
    "simple": "If a link fails, first compare its `href` with the real file name and folder.",
    "runtime": "html",
    "lesson": "html-02"
  },
  {
    "source": "Semantic HTML uses element names to say what content is for.",
    "simple": "Use HTML names that explain the job of each part of the page.",
    "runtime": "html",
    "lesson": "html-03"
  },
  {
    "source": "Semantic means “about meaning.” A header introduces a page or section. nav holds a group of navigation links. main identifies the central content of the page. footer holds closing or supporting information.",
    "simple": "“Semantic” means about meaning. `header` introduces a page or section. `nav` holds navigation links. `main` holds the main content. `footer` holds closing or supporting details.",
    "runtime": "html",
    "lesson": "html-03"
  },
  {
    "source": "These names help someone understand the page without relying on how it looks.",
    "simple": "These names explain the page even when someone cannot see its layout.",
    "runtime": "html",
    "lesson": "html-03"
  },
  {
    "source": "A browser may not visibly style them differently.",
    "simple": "The browser may make these elements look alike unless you add styles.",
    "runtime": "html",
    "lesson": "html-03"
  },
  {
    "source": "Their meaning remains useful to assistive tools and to people reading your code.",
    "simple": "The names still help reading tools and people who inspect the code.",
    "runtime": "html",
    "lesson": "html-03"
  },
  {
    "source": "Choose them for their job, then use CSS later to choose appearance.",
    "simple": "Choose the HTML element for what it does. Use CSS later to change how it looks.",
    "runtime": "html",
    "lesson": "html-03"
  },
  {
    "source": "This complete page gives an event clear regions.",
    "simple": "The next complete page divides an event into clear parts.",
    "runtime": "html",
    "lesson": "html-03"
  },
  {
    "source": "header contains the event title. nav gives a shortcut to a section.",
    "simple": "`header` holds the event title. `nav` contains a link that jumps to a section.",
    "runtime": "html",
    "lesson": "html-03"
  },
  {
    "source": "One main holds the event details, and footer finishes the page.",
    "simple": "Put event details in one `main` and closing information in `footer`.",
    "runtime": "html",
    "lesson": "html-03"
  },
  {
    "source": "A landmark is a page region that assistive tools can help people find quickly. main and nav provide meaningful landmarks.",
    "simple": "A landmark is an important area that reading tools can jump to. `main` and `nav` name two such areas.",
    "runtime": "html",
    "lesson": "html-03"
  },
  {
    "source": "For this ordinary page, use one visible main content region.",
    "simple": "For this page, have one visible `main` area.",
    "runtime": "html",
    "lesson": "html-03"
  },
  {
    "source": "Put the site's repeated navigation outside it so “go to main content” leads to the details, rather than repeated links. aria-label adds a short accessible name to a region or control.",
    "simple": "Put repeated site links outside `main` so a jump to the main content skips them. Use `aria-label` to give a region or control a short name for assistive tools.",
    "runtime": "html",
    "lesson": "html-03"
  },
  {
    "source": "Here “Event sections” helps explain the navigation's purpose;",
    "simple": "The name “Event sections” tells someone what these navigation links are for.",
    "runtime": "html",
    "lesson": "html-03"
  },
  {
    "source": "it does not add a visible heading.",
    "simple": "`aria-label` gives a name to assistive tools; it does not add a heading people can see.",
    "runtime": "html",
    "lesson": "html-03"
  },
  {
    "source": "Keep the visible link words clear as well.",
    "simple": "The words shown on the links should still clearly explain where they go.",
    "runtime": "html",
    "lesson": "html-03"
  },
  {
    "source": "Native semantic elements usually provide the role without extra role attributes.",
    "simple": "Built-in HTML elements usually already tell tools their role. You normally do not need to add that role again.",
    "runtime": "html",
    "lesson": "html-03"
  },
  {
    "source": "Headings describe an outline. h1 names this page's main subject. h2 names a section within that subject;",
    "simple": "Headings show how topics fit together. Use `h1` for the page’s main topic and `h2` for a section inside it.",
    "runtime": "html",
    "lesson": "html-03"
  },
  {
    "source": "h3 can name a subsection inside an h2 section.",
    "simple": "Use `h3` for a smaller topic within an `h2` section.",
    "runtime": "html",
    "lesson": "html-03"
  },
  {
    "source": "Choose levels for the relationship between ideas, rather than for the text size you want.",
    "simple": "Choose heading levels by the topics’ relationship, not by the text size.",
    "runtime": "html",
    "lesson": "html-03"
  },
  {
    "source": "In this event, an h1 followed by an h2 makes that relationship simple.",
    "simple": "Here, `h1` names the event and `h2` names a part of it.",
    "runtime": "html",
    "lesson": "html-03"
  },
  {
    "source": "A section groups related content and usually has a heading.",
    "simple": "A `section` groups information about one topic and usually has a heading.",
    "runtime": "html",
    "lesson": "html-03"
  },
  {
    "source": "A div is a general container with no special meaning;",
    "simple": "A `div` is a general box for grouping content. Its name does not say what the group means.",
    "runtime": "html",
    "lesson": "html-03"
  },
  {
    "source": "use it when you need grouping without claiming a more specific role.",
    "simple": "Use a `div` when you just need a group, not a more specific kind of page part.",
    "runtime": "html",
    "lesson": "html-03"
  },
  {
    "source": "This fragment belongs inside a main element.",
    "simple": "Place this piece of HTML inside a `main` element.",
    "runtime": "html",
    "lesson": "html-03"
  },
  {
    "source": "A link elsewhere on the page can use href=\"#tickets\" to reach it.",
    "simple": "A link with `href=\"#tickets\"` can jump to this area of the same page.",
    "runtime": "html",
    "lesson": "html-03"
  },
  {
    "source": "id=\"tickets\" gives the outer section a unique identifier.",
    "simple": "`id=\"tickets\"` gives this section a name that should be used only once on the page.",
    "runtime": "html",
    "lesson": "html-03"
  },
  {
    "source": "The # in a link destination means an in-page fragment, a named place inside the current document. h3 is nested beneath the Tickets topic.",
    "simple": "The `#` means a named place in this page. The `h3` heading belongs under the Tickets topic.",
    "runtime": "html",
    "lesson": "html-03"
  },
  {
    "source": "Close the inner section before the outer section.",
    "simple": "Close the inner section before closing the section that contains it.",
    "runtime": "html",
    "lesson": "html-03"
  },
  {
    "source": "Indentation makes the hierarchy visible, while tags define the real structure.",
    "simple": "Spaces show the nesting to a reader. The tags themselves decide the actual groups.",
    "runtime": "html",
    "lesson": "html-03"
  },
  {
    "source": "An anchor's href and a target's id must match exactly. href=\"#experiments\" finds id=\"experiments\";",
    "simple": "The link and target names must match exactly. `href=\"#experiments\"` looks for `id=\"experiments\"`.",
    "runtime": "html",
    "lesson": "html-03"
  },
  {
    "source": "a heading with the same visible word but no matching id is not that target.",
    "simple": "A heading that says Experiments is not enough by itself. It also needs the matching target ID.",
    "runtime": "html",
    "lesson": "html-03"
  },
  {
    "source": "IDs should be unique within a document.",
    "simple": "Do not give two elements the same ID on one page.",
    "runtime": "html",
    "lesson": "html-03"
  },
  {
    "source": "Links need useful words, and the link should lead to relevant content.",
    "simple": "Use link words that explain the destination, and point to content that matches those words.",
    "runtime": "html",
    "lesson": "html-03"
  },
  {
    "source": "A correct landmark does not repair confusing writing or a broken target.",
    "simple": "Correct page regions cannot fix unclear words or a link to a missing place.",
    "runtime": "html",
    "lesson": "html-03"
  },
  {
    "source": "Review the page's reading order from top to bottom, because that order is also important when someone listens to the page or moves through it with a keyboard.",
    "simple": "Read the page from top to bottom. That order also matters for people listening to it or using a keyboard.",
    "runtime": "html",
    "lesson": "html-03"
  },
  {
    "source": "For the exercise, put the event's h1 inside header, name nav with aria-label, put the Schedule link in it, and use one main for details.",
    "simple": "Put the event’s `h1` in `header`. Give `nav` an `aria-label` and a Schedule link. Put the details in one `main`.",
    "runtime": "html",
    "lesson": "html-03"
  },
  {
    "source": "Put an h2 in the schedule section and give the section id=\"schedule\" so href=\"#schedule\" works.",
    "simple": "Give the schedule section an `h2` and `id=\"schedule\"`. Then `href=\"#schedule\"` can find it.",
    "runtime": "html",
    "lesson": "html-03"
  },
  {
    "source": "Finish with footer.",
    "simple": "Add a `footer` for the final information.",
    "runtime": "html",
    "lesson": "html-03"
  },
  {
    "source": "The checks look for these regions and heading levels;",
    "simple": "The tests check for these page regions and heading levels.",
    "runtime": "html",
    "lesson": "html-03"
  },
  {
    "source": "they do not prove the whole outline or reading order is sensible.",
    "simple": "They cannot prove that the topics and reading order are easy to understand.",
    "runtime": "html",
    "lesson": "html-03"
  },
  {
    "source": "Ask yourself what someone would learn by reading only the headings, then follow the Schedule link and check that its destination exists.",
    "simple": "Read just the headings to see if they explain the page. Then follow the Schedule link to confirm its section is there.",
    "runtime": "html",
    "lesson": "html-03"
  },
  {
    "source": "Accessibility means making content and actions usable by people with different ways of seeing, hearing, moving, and understanding.",
    "simple": "Accessibility means people can use the page even when they see, hear, move, or understand things in different ways.",
    "runtime": "html",
    "lesson": "html-04"
  },
  {
    "source": "Someone might use a keyboard, a screen reader, a touch screen, or a large zoom setting.",
    "simple": "People may use a keyboard, a reading tool, touch, or a greatly enlarged page.",
    "runtime": "html",
    "lesson": "html-04"
  },
  {
    "source": "Your HTML should still tell them what is there and what each control does.",
    "simple": "Your HTML should explain the content and controls whichever way someone uses the page.",
    "runtime": "html",
    "lesson": "html-04"
  },
  {
    "source": "Start with built-in elements that already have useful behavior.",
    "simple": "Start with the normal HTML elements because browsers already know how to use them.",
    "runtime": "html",
    "lesson": "html-04"
  },
  {
    "source": "A button is an action control;",
    "simple": "A `button` asks the page to do an action.",
    "runtime": "html",
    "lesson": "html-04"
  },
  {
    "source": "an a with href is a navigation link.",
    "simple": "An `a` element with `href` takes the user to another place.",
    "runtime": "html",
    "lesson": "html-04"
  },
  {
    "source": "Their meaning helps a browser and assistive tools offer the right interaction.",
    "simple": "The correct element helps the browser and assistive tools offer the right way to use it.",
    "runtime": "html",
    "lesson": "html-04"
  },
  {
    "source": "This is a complete example with an informative image and a named control.",
    "simple": "This complete example has a useful picture and a button with a clear name.",
    "runtime": "html",
    "lesson": "html-04"
  },
  {
    "source": "The image requires a repair.jpg file. alt describes its useful information.",
    "simple": "You need a real `repair.jpg` file for the picture. Its `alt` tells someone what matters in it.",
    "runtime": "html",
    "lesson": "html-04"
  },
  {
    "source": "The button has visible words that explain its purpose.",
    "simple": "The words on the button say what it is for.",
    "runtime": "html",
    "lesson": "html-04"
  },
  {
    "source": "This HTML creates the control;",
    "simple": "This HTML puts a button on the page.",
    "runtime": "html",
    "lesson": "html-04"
  },
  {
    "source": "it does not yet supply code to open repair times.",
    "simple": "It does not yet add the behavior that opens the repair times.",
    "runtime": "html",
    "lesson": "html-04"
  },
  {
    "source": "An image's src tells the browser which picture to load. alt gives a text replacement.",
    "simple": "`src` chooses the image file. `alt` explains the image with words.",
    "runtime": "html",
    "lesson": "html-04"
  },
  {
    "source": "Imagine someone cannot see this picture: what information would they miss?",
    "simple": "If someone cannot see the picture, what do they need to know from it?",
    "runtime": "html",
    "lesson": "html-04"
  },
  {
    "source": "Write that information in ordinary words.",
    "simple": "Write the important information in simple words.",
    "runtime": "html",
    "lesson": "html-04"
  },
  {
    "source": "You usually do not need “picture of,” because the tool can already announce that it is an image.",
    "simple": "You can usually leave out “picture of” because a reading tool already identifies it as an image.",
    "runtime": "html",
    "lesson": "html-04"
  },
  {
    "source": "Decorative pictures that add no information normally have alt=\"\".",
    "simple": "Use `alt=\"\"` for a picture that is only decoration and adds no useful information.",
    "runtime": "html",
    "lesson": "html-04"
  },
  {
    "source": "Do not leave alt out and assume that is the same: some tools may announce the file name. img has no closing tag because it is a void element, with no content inside it.",
    "simple": "An empty `alt` is not the same as no `alt`: without one, a tool may read the file name. An `img` has nothing inside it, so it has no closing tag.",
    "runtime": "html",
    "lesson": "html-04"
  },
  {
    "source": "A control's accessible name is the name assistive tools use to identify it.",
    "simple": "An accessible name is the name a reading or assistive tool uses for a control.",
    "runtime": "html",
    "lesson": "html-04"
  },
  {
    "source": "For an ordinary button, its visible text supplies that name.",
    "simple": "For a normal button, the words written on the button give it that name.",
    "runtime": "html",
    "lesson": "html-04"
  },
  {
    "source": "Clear visible text helps everyone.",
    "simple": "Words people can see and understand make the control easier for everyone.",
    "runtime": "html",
    "lesson": "html-04"
  },
  {
    "source": "Prefer “View repair times” to “Go” when the action would otherwise be unclear. type=\"button\" makes it a plain button;",
    "simple": "“View repair times” is clearer than “Go.” Use `type=\"button\"` for a button that is not meant to submit a form.",
    "runtime": "html",
    "lesson": "html-04"
  },
  {
    "source": "inside a form, this avoids accidentally submitting the form.",
    "simple": "That type prevents a button inside a form from submitting it by accident.",
    "runtime": "html",
    "lesson": "html-04"
  },
  {
    "source": "A native button can receive keyboard focus and can be activated using normal keyboard controls.",
    "simple": "A real HTML button can be reached and used with the keyboard.",
    "runtime": "html",
    "lesson": "html-04"
  },
  {
    "source": "A div with button-like styling does not automatically gain those behaviors.",
    "simple": "Making a `div` look like a button does not give it the keyboard behavior of a real button.",
    "runtime": "html",
    "lesson": "html-04"
  },
  {
    "source": "This fragment belongs inside body and demonstrates navigation beside an action control.",
    "simple": "Put this example inside `body`. It shows a link beside a button.",
    "runtime": "html",
    "lesson": "html-04"
  },
  {
    "source": "The link needs a directions.html page and navigates to it.",
    "simple": "The link opens `directions.html`, so that file must exist.",
    "runtime": "html",
    "lesson": "html-04"
  },
  {
    "source": "The button needs behavior added later if it should show a checklist.",
    "simple": "You still need to add code if the button should actually show a checklist.",
    "runtime": "html",
    "lesson": "html-04"
  },
  {
    "source": "The small dot is decorative, so its empty alt lets assistive tools skip it.",
    "simple": "The small dot adds no information, so empty alt text lets reading tools skip it.",
    "runtime": "html",
    "lesson": "html-04"
  },
  {
    "source": "These choices depend on each element's purpose, not on its color or shape.",
    "simple": "Choose the HTML by what each part does, not by its color or shape.",
    "runtime": "html",
    "lesson": "html-04"
  },
  {
    "source": "Do not copy empty alt onto a picture that teaches useful information.",
    "simple": "If a picture gives useful information, describe it instead of using empty alt text.",
    "runtime": "html",
    "lesson": "html-04"
  },
  {
    "source": "Keyboard focus marks the control that will receive a keyboard action.",
    "simple": "Keyboard focus shows which control will respond to your next keyboard action.",
    "runtime": "html",
    "lesson": "html-04"
  },
  {
    "source": "Press Tab to move forward through focusable controls and Shift+Tab to move backward.",
    "simple": "Use Tab to move to the next control and Shift+Tab to move to the previous one.",
    "runtime": "html",
    "lesson": "html-04"
  },
  {
    "source": "Check that you can see where focus is.",
    "simple": "Make sure the currently focused control has a visible marker.",
    "runtime": "html",
    "lesson": "html-04"
  },
  {
    "source": "A focused button should be usable with Enter or Space;",
    "simple": "When a button has focus, Enter or Space should activate it.",
    "runtime": "html",
    "lesson": "html-04"
  },
  {
    "source": "a link normally activates with Enter. tabindex=\"-1\" removes an element from normal Tab navigation, so it is not a way to make this exercise's button easy to reach.",
    "simple": "Enter normally opens a focused link. Do not use `tabindex=\"-1\"` for this exercise’s button: that removes it from the usual Tab sequence.",
    "runtime": "html",
    "lesson": "html-04"
  },
  {
    "source": "Keep the source order sensible and keep visible focus styling.",
    "simple": "Put controls in a sensible order in the HTML and keep the focus marker visible.",
    "runtime": "html",
    "lesson": "html-04"
  },
  {
    "source": "These are useful checks, but they do not cover every accessibility need.",
    "simple": "These checks help, but they do not test every accessibility need.",
    "runtime": "html",
    "lesson": "html-04"
  },
  {
    "source": "For the picnic exercise, add alt text that describes the informative image and give the native button the exact visible name View picnic details.",
    "simple": "For the picnic project, describe the image with alt text and label the real button exactly `View picnic details`.",
    "runtime": "html",
    "lesson": "html-04"
  },
  {
    "source": "Keep it keyboard focusable.",
    "simple": "Make sure the keyboard can still reach the button.",
    "runtime": "html",
    "lesson": "html-04"
  },
  {
    "source": "Tab to it, check its name, and inspect focus.",
    "simple": "Use Tab to reach it, read its name, and check the focus marker.",
    "runtime": "html",
    "lesson": "html-04"
  },
  {
    "source": "The automated checks verify text and basic focusability;",
    "simple": "The automatic tests check the text and whether the control can receive focus.",
    "runtime": "html",
    "lesson": "html-04"
  },
  {
    "source": "the starter does not add the actual details-opening behavior.",
    "simple": "The starter does not yet contain code that opens the details.",
    "runtime": "html",
    "lesson": "html-04"
  },
  {
    "source": "A button passing the naming check can still do nothing when activated.",
    "simple": "A button can pass the name test and still do nothing when you use it.",
    "runtime": "html",
    "lesson": "html-04"
  },
  {
    "source": "To judge a finished interactive page, test the real action, review images in context, and use a screen reader as well as the keyboard.",
    "simple": "For a finished page, try the actual button action, check that descriptions suit their pictures, and test with both a screen reader and a keyboard.",
    "runtime": "html",
    "lesson": "html-04"
  },
  {
    "source": "A form collects related choices or information.",
    "simple": "A form gathers information or choices that belong together.",
    "runtime": "html",
    "lesson": "html-05"
  },
  {
    "source": "The form element groups its controls.",
    "simple": "The `form` element holds the fields and controls for that form.",
    "runtime": "html",
    "lesson": "html-05"
  },
  {
    "source": "An input is a single entry field;",
    "simple": "An `input` is one field where someone enters information.",
    "runtime": "html",
    "lesson": "html-05"
  },
  {
    "source": "a select offers choices;",
    "simple": "A `select` lets someone choose from listed options.",
    "runtime": "html",
    "lesson": "html-05"
  },
  {
    "source": "a button can submit the form.",
    "simple": "A submit button asks the form to send its answers.",
    "runtime": "html",
    "lesson": "html-05"
  },
  {
    "source": "A label tells a person what a control asks for.",
    "simple": "A label explains what information a field needs.",
    "runtime": "html",
    "lesson": "html-05"
  },
  {
    "source": "Controls need meaningful names even before someone types anything.",
    "simple": "Every field needs a clear name before the user starts typing.",
    "runtime": "html",
    "lesson": "html-05"
  },
  {
    "source": "A placeholder inside a field disappears while typing and should not replace its label.",
    "simple": "A placeholder disappears as someone types. Keep a separate label so they can still tell what the field is for.",
    "runtime": "html",
    "lesson": "html-05"
  },
  {
    "source": "HTML can ask the browser to catch simple missing or malformed values, but saving information needs additional behavior and another system to receive it.",
    "simple": "HTML can check for simple missing or wrongly shaped answers. Saving the answers needs more behavior and a system to receive them.",
    "runtime": "html",
    "lesson": "html-05"
  },
  {
    "source": "This form fragment belongs inside body.",
    "simple": "Put this example form inside `body`.",
    "runtime": "html",
    "lesson": "html-05"
  },
  {
    "source": "It demonstrates a labeled required field.",
    "simple": "It shows a field with a label and a rule that it cannot be left blank.",
    "runtime": "html",
    "lesson": "html-05"
  },
  {
    "source": "The label's for value matches the input's id exactly.",
    "simple": "The label’s `for` must exactly match the field’s `id`.",
    "runtime": "html",
    "lesson": "html-05"
  },
  {
    "source": "Clicking a label can move focus to its connected field. input is a void element and needs no closing tag. required is a Boolean attribute: its presence turns the requirement on.",
    "simple": "Clicking the label can select its field. `input` needs no closing tag. Adding `required` makes an answer necessary.",
    "runtime": "html",
    "lesson": "html-05"
  },
  {
    "source": "Do not write required=\"false\" to turn it off;",
    "simple": "`required=\"false\"` still makes the field required. It does not switch the rule off.",
    "runtime": "html",
    "lesson": "html-05"
  },
  {
    "source": "remove it instead.",
    "simple": "To make the field optional, remove the `required` attribute.",
    "runtime": "html",
    "lesson": "html-05"
  },
  {
    "source": "id and name have different jobs.",
    "simple": "`id` and `name` are used for different purposes.",
    "runtime": "html",
    "lesson": "html-05"
  },
  {
    "source": "An id identifies one element on the page, so use a unique id for each control.",
    "simple": "Give each field its own `id` so it can be found on the page.",
    "runtime": "html",
    "lesson": "html-05"
  },
  {
    "source": "A label's for points to that id. name supplies the field's key when a form sends values, such as contact=someone@example.org.",
    "simple": "A label uses `for` to find the field’s `id`. The field’s `name` labels its answer when sent, as in `contact=someone@example.org`.",
    "runtime": "html",
    "lesson": "html-05"
  },
  {
    "source": "Matching a label to a control does not require matching name, but submitted controls generally need name.",
    "simple": "The label connects through `id`, not `name`. But fields generally need `name` for their answers to be sent.",
    "runtime": "html",
    "lesson": "html-05"
  },
  {
    "source": "Attribute values belong inside quotes, and settings go in the opening tag.",
    "simple": "Put attributes in the opening tag and use quotes around their values.",
    "runtime": "html",
    "lesson": "html-05"
  },
  {
    "source": "Keep labels next to the fields they describe so the visual order also makes sense.",
    "simple": "Place each visible label next to its field so the page is easy to follow.",
    "runtime": "html",
    "lesson": "html-05"
  },
  {
    "source": "type=\"email\" tells the browser to check the shape of an email address when the form is submitted.",
    "simple": "`type=\"email\"` asks the browser to check whether the answer looks like an email address when the form is submitted.",
    "runtime": "html",
    "lesson": "html-05"
  },
  {
    "source": "It may also offer an email-friendly keyboard. required tells the browser that the field cannot be blank.",
    "simple": "The browser may show an email-friendly keyboard. `required` separately says the field cannot be empty.",
    "runtime": "html",
    "lesson": "html-05"
  },
  {
    "source": "Together they cover different problems: empty input and an address with the wrong shape.",
    "simple": "One rule catches a missing answer; the other catches an answer that does not look like an email address.",
    "runtime": "html",
    "lesson": "html-05"
  },
  {
    "source": "They do not prove that an address exists or belongs to the person.",
    "simple": "These rules cannot prove that an email address is real or that the person owns it.",
    "runtime": "html",
    "lesson": "html-05"
  },
  {
    "source": "A server, the system receiving submitted information, still needs its own validation.",
    "simple": "The receiving server must check the answers too.",
    "runtime": "html",
    "lesson": "html-05"
  },
  {
    "source": "Client-side validation means checks in the browser;",
    "simple": "“Client-side validation” means checking answers in the browser.",
    "runtime": "html",
    "lesson": "html-05"
  },
  {
    "source": "it helps people correct errors but can be bypassed.",
    "simple": "Browser checks help users fix mistakes, but someone can get around them.",
    "runtime": "html",
    "lesson": "html-05"
  },
  {
    "source": "This fragment is another form, using a list of choices.",
    "simple": "This next form lets someone choose from a list.",
    "runtime": "html",
    "lesson": "html-05"
  },
  {
    "source": "Put it in body to try it separately.",
    "simple": "Try it on its own by putting it inside `body`.",
    "runtime": "html",
    "lesson": "html-05"
  },
  {
    "source": "select contains option elements.",
    "simple": "Put each choice in an `option` inside the `select`.",
    "runtime": "html",
    "lesson": "html-05"
  },
  {
    "source": "Music is the visible option text;",
    "simple": "The user sees the word Music for this choice.",
    "runtime": "html",
    "lesson": "html-05"
  },
  {
    "source": "value=\"music\" is the value sent if that option is selected. option and select use closing tags.",
    "simple": "If Music is chosen, the form sends `music` from `value=\"music\"`. Close both `option` and `select` with ending tags.",
    "runtime": "html",
    "lesson": "html-05"
  },
  {
    "source": "The label connects to session just as it connects to an input.",
    "simple": "The label points to the choice field’s `session` ID just as it would point to an input’s ID.",
    "runtime": "html",
    "lesson": "html-05"
  },
  {
    "source": "A submit button asks the browser to submit its form after eligible validation checks.",
    "simple": "A submit button asks the browser to send the form after the checks that apply to it.",
    "runtime": "html",
    "lesson": "html-05"
  },
  {
    "source": "Try three kinds of input before trusting a form: missing, malformed, and valid.",
    "simple": "Test a missing answer, a wrongly shaped answer, and an answer that follows the rules.",
    "runtime": "html",
    "lesson": "html-05"
  },
  {
    "source": "For a required email field, submit it empty, then enter a clearly malformed address, then an address-shaped example such as learner@example.org.",
    "simple": "For required email, try an empty field, then a clearly invalid address, then an example shaped like `learner@example.org`.",
    "runtime": "html",
    "lesson": "html-05"
  },
  {
    "source": "Notice the different results.",
    "simple": "Watch how the form responds to each kind of answer.",
    "runtime": "html",
    "lesson": "html-05"
  },
  {
    "source": "Native validation messages and appearance depend on the browser and its language.",
    "simple": "Different browsers and languages can show different built-in messages and styles.",
    "runtime": "html",
    "lesson": "html-05"
  },
  {
    "source": "A form without a real receiving endpoint does not enroll someone or store their information.",
    "simple": "This form cannot register a person or store their details unless a real receiving system is connected.",
    "runtime": "html",
    "lesson": "html-05"
  },
  {
    "source": "You can learn labeling and validation here without claiming that submission has connected to a registration service.",
    "simple": "You can practice labels and checks here without claiming that a real registration happened.",
    "runtime": "html",
    "lesson": "html-05"
  },
  {
    "source": "For this project, use controls with id=\"name\", id=\"email\", and id=\"activity\", each connected to a visible label.",
    "simple": "Use fields with IDs `name`, `email`, and `activity`. Give each a visible connected label.",
    "runtime": "html",
    "lesson": "html-05"
  },
  {
    "source": "Require name and email;",
    "simple": "Make the name and email fields required.",
    "runtime": "html",
    "lesson": "html-05"
  },
  {
    "source": "set email's type to email.",
    "simple": "Give the email field `type=\"email\"`.",
    "runtime": "html",
    "lesson": "html-05"
  },
  {
    "source": "Use select with options for the activity and a submit button.",
    "simple": "Use a `select` with choices for the activity and add a submit button.",
    "runtime": "html",
    "lesson": "html-05"
  },
  {
    "source": "Each label's for must exactly match its control's id.",
    "simple": "Match every label’s `for` exactly to its field’s `id`.",
    "runtime": "html",
    "lesson": "html-05"
  },
  {
    "source": "The checks find those relationships and attributes.",
    "simple": "The tests check those connections and settings.",
    "runtime": "html",
    "lesson": "html-05"
  },
  {
    "source": "Then try the blank and malformed cases yourself.",
    "simple": "After the tests, try leaving fields blank or typing a badly formed answer yourself.",
    "runtime": "html",
    "lesson": "html-05"
  },
  {
    "source": "Good form instructions should tell a person how to fix a problem without clearing their other answers or making them guess which field needs attention.",
    "simple": "An error message should name the problem field and explain how to fix it. Keep the person’s other answers instead of making them start over.",
    "runtime": "html",
    "lesson": "html-05"
  },
  {
    "source": "A longer form becomes easier to understand when related fields have clear groups. fieldset groups controls, and legend names the group.",
    "simple": "Group related fields so a long form is easier to follow. A `fieldset` makes a group and a `legend` names it.",
    "runtime": "html",
    "lesson": "html-06"
  },
  {
    "source": "Contact details and account details are different subjects, so they can use separate fieldsets in one form.",
    "simple": "Put contact details in one group and account details in another, both within the same form.",
    "runtime": "html",
    "lesson": "html-06"
  },
  {
    "source": "People using assistive tools can receive the group name with the fields.",
    "simple": "Assistive tools can tell the user the group name along with its fields.",
    "runtime": "html",
    "lesson": "html-06"
  },
  {
    "source": "Grouping does not save information or guarantee that an answer is correct.",
    "simple": "Grouping fields does not save answers or prove they are right.",
    "runtime": "html",
    "lesson": "html-06"
  },
  {
    "source": "It makes the form's structure clearer.",
    "simple": "The groups make it easier to understand which fields belong together.",
    "runtime": "html",
    "lesson": "html-06"
  },
  {
    "source": "This exercise builds grouped registration fields;",
    "simple": "In this exercise, you build registration fields in clearly named groups.",
    "runtime": "html",
    "lesson": "html-06"
  },
  {
    "source": "showing one step at a time would require additional navigation behavior.",
    "simple": "To show only one group at a time, you would also need code for moving between steps.",
    "runtime": "html",
    "lesson": "html-06"
  },
  {
    "source": "This fragment belongs inside body.",
    "simple": "Put this piece of HTML inside `body`.",
    "runtime": "html",
    "lesson": "html-06"
  },
  {
    "source": "It creates one labeled group with native validation.",
    "simple": "It makes a named group with the browser’s built-in answer checks.",
    "runtime": "html",
    "lesson": "html-06"
  },
  {
    "source": "legend is the first child of fieldset and names the group.",
    "simple": "Put `legend` first inside `fieldset`. Its words give the group a name.",
    "runtime": "html",
    "lesson": "html-06"
  },
  {
    "source": "Each label points to a unique input id. required asks for an answer, and type=\"email\" checks an address-shaped value.",
    "simple": "Each label must point to a field’s unique ID. `required` demands an answer; `type=\"email\"` checks whether it looks like an email address.",
    "runtime": "html",
    "lesson": "html-06"
  },
  {
    "source": "The input elements need no closing tags, while form, fieldset, legend, label, and button do.",
    "simple": "Do not add closing tags for `input`. Do close `form`, `fieldset`, `legend`, `label`, and `button`.",
    "runtime": "html",
    "lesson": "html-06"
  },
  {
    "source": "Constraints are limits on acceptable input. required rejects a missing answer during ordinary submission. type=\"email\" adds a format check. minlength sets a minimum text length.",
    "simple": "Constraints are rules for answers. `required` rejects blanks, `type=\"email\"` checks the address format, and `minlength` sets the fewest text characters allowed.",
    "runtime": "html",
    "lesson": "html-06"
  },
  {
    "source": "These work together, rather than replacing each other.",
    "simple": "Use the rules together because each checks a different problem.",
    "runtime": "html",
    "lesson": "html-06"
  },
  {
    "source": "A minlength field that is optional can still be empty, so add required when empty input should be rejected. type=\"password\" hides entered characters visually;",
    "simple": "`minlength` alone can still allow an empty optional field, so add `required` if blanks are not allowed. `type=\"password\"` hides the characters on screen.",
    "runtime": "html",
    "lesson": "html-06"
  },
  {
    "source": "it does not by itself encrypt, store, or secure the value.",
    "simple": "Hiding characters on screen does not by itself protect, encrypt, or save the password.",
    "runtime": "html",
    "lesson": "html-06"
  },
  {
    "source": "Any real account system needs separate secure handling and server validation.",
    "simple": "A real account system needs separate secure handling and checks on the server.",
    "runtime": "html",
    "lesson": "html-06"
  },
  {
    "source": "Helpful instructions appear before someone makes an error.",
    "simple": "Give helpful instructions before someone makes a mistake.",
    "runtime": "html",
    "lesson": "html-06"
  },
  {
    "source": "Tell them the length requirement in words near the field.",
    "simple": "Write the minimum length near the field so the user knows it before typing.",
    "runtime": "html",
    "lesson": "html-06"
  },
  {
    "source": "A small element marks side information such as a short note, not a particular font size you must rely on. aria-describedby can connect a control to explanatory text through that text's id.",
    "simple": "Use `small` for a short supporting note. Do not rely on it having a fixed text size. `aria-describedby` connects a field to extra help by using the help text’s ID.",
    "runtime": "html",
    "lesson": "html-06"
  },
  {
    "source": "Unlike a label, the description gives extra help rather than naming the field.",
    "simple": "A description gives extra instructions. A label tells the user the field’s name.",
    "runtime": "html",
    "lesson": "html-06"
  },
  {
    "source": "Keep the actual visible label.",
    "simple": "Keep the visible label even when you add a description.",
    "runtime": "html",
    "lesson": "html-06"
  },
  {
    "source": "IDs must be unique, and both for and aria-describedby must point to the correct elements.",
    "simple": "Use each ID once. Point `for` to the field and `aria-describedby` to the correct help text.",
    "runtime": "html",
    "lesson": "html-06"
  },
  {
    "source": "Add this fieldset inside the same form, before its submit button, to give the example a second group.",
    "simple": "Add this second fieldset inside the same form, before the submit button.",
    "runtime": "html",
    "lesson": "html-06"
  },
  {
    "source": "The multi-line opening input tag is still one tag.",
    "simple": "The opening input tag is still a single tag even though it spans several lines.",
    "runtime": "html",
    "lesson": "html-06"
  },
  {
    "source": "The minimum here is ten, to show a different example. aria-describedby points to the help note.",
    "simple": "This example uses a minimum length of ten. `aria-describedby` connects the input to the help note.",
    "runtime": "html",
    "lesson": "html-06"
  },
  {
    "source": "Nest this fieldset within form, and close it before the form closes.",
    "simple": "Keep the fieldset inside the form and close it before you close the form.",
    "runtime": "html",
    "lesson": "html-06"
  },
  {
    "source": "Validate the paths someone can take.",
    "simple": "Test the different ways a person might fill in the form.",
    "runtime": "html",
    "lesson": "html-06"
  },
  {
    "source": "First submit with required fields blank.",
    "simple": "First try submitting with the required fields empty.",
    "runtime": "html",
    "lesson": "html-06"
  },
  {
    "source": "Next try an invalid email and a short passphrase.",
    "simple": "Then try an invalid email and a passphrase that is too short.",
    "runtime": "html",
    "lesson": "html-06"
  },
  {
    "source": "Then type valid-shaped information that meets the length rule.",
    "simple": "Finally, type answers that match the expected formats and length.",
    "runtime": "html",
    "lesson": "html-06"
  },
  {
    "source": "Browser validation normally prevents the ordinary submission while a participating field is invalid, and may focus it with a message.",
    "simple": "When a field fails a built-in check, the browser usually stops normal submission and may move focus to it with a message.",
    "runtime": "html",
    "lesson": "html-06"
  },
  {
    "source": "Test with typing, because programmatically changing values can behave differently for some constraints.",
    "simple": "Test by typing into the fields. Some rules behave differently when code fills the values in.",
    "runtime": "html",
    "lesson": "html-06"
  },
  {
    "source": "Do not use a fake error that only says “Wrong”: say which field needs attention and what would make it acceptable.",
    "simple": "Do not just say “Wrong.” Name the field and explain what answer would meet its rule.",
    "runtime": "html",
    "lesson": "html-06"
  },
  {
    "source": "Native checks remain only part of a complete registration system.",
    "simple": "The browser’s checks are only one part of a real registration system.",
    "runtime": "html",
    "lesson": "html-06"
  },
  {
    "source": "For the workshop exercise, make exactly two fieldsets, each with a legend.",
    "simple": "For this project, make exactly two fieldsets and give each one a legend.",
    "runtime": "html",
    "lesson": "html-06"
  },
  {
    "source": "Add labeled inputs for name, email, and passphrase, using the expected ids name, email, and pass.",
    "simple": "Add labeled name, email, and passphrase fields with IDs `name`, `email`, and `pass`.",
    "runtime": "html",
    "lesson": "html-06"
  },
  {
    "source": "Require the needed fields, give email its email type, and give pass a minlength of at least eight.",
    "simple": "Make the needed fields required. Use the email input type and a passphrase minimum length of at least eight.",
    "runtime": "html",
    "lesson": "html-06"
  },
  {
    "source": "Keep a submit button.",
    "simple": "Leave a submit button in the form.",
    "runtime": "html",
    "lesson": "html-06"
  },
  {
    "source": "The checks verify groups, labels, and key constraints;",
    "simple": "The tests look for the groups, labels, and important input rules.",
    "runtime": "html",
    "lesson": "html-06"
  },
  {
    "source": "they do not implement multi-step navigation or a database.",
    "simple": "They do not add page-by-page form steps or a database to store answers.",
    "runtime": "html",
    "lesson": "html-06"
  },
  {
    "source": "Explain what each fieldset contains and test missing, invalid, and valid values with the keyboard before considering the form usable.",
    "simple": "Explain what belongs in each group. Then use the keyboard to try missing, invalid, and valid answers before calling the form usable.",
    "runtime": "html",
    "lesson": "html-06"
  },
  {
    "source": "A long guide needs ways to find information and understand how pieces relate.",
    "simple": "A long guide needs clear ways to find a topic and see how the parts fit together.",
    "runtime": "html",
    "lesson": "html-07"
  },
  {
    "source": "Use a main heading for the whole guide, section headings for its topics, and navigation links for shortcuts.",
    "simple": "Give the guide one main heading, add headings for its topics, and use links as shortcuts.",
    "runtime": "html",
    "lesson": "html-07"
  },
  {
    "source": "Meaningful page regions are also called landmarks because assistive tools can help people move among them.",
    "simple": "Important page regions are called landmarks. Assistive tools can use them to jump between areas.",
    "runtime": "html",
    "lesson": "html-07"
  },
  {
    "source": "Tables are for information whose rows and columns have relationships, such as each trail and its distance.",
    "simple": "Use a table when rows and columns describe related information, such as each trail’s name and distance.",
    "runtime": "html",
    "lesson": "html-07"
  },
  {
    "source": "They should not be used just to place unrelated page content side by side.",
    "simple": "Do not use a table just to put unrelated items next to each other on the page.",
    "runtime": "html",
    "lesson": "html-07"
  },
  {
    "source": "A clear reading order helps both sighted readers and people listening to the guide.",
    "simple": "A sensible order helps people whether they read the guide visually or listen to it.",
    "runtime": "html",
    "lesson": "html-07"
  },
  {
    "source": "This complete example gives a short guide a working in-page shortcut.",
    "simple": "This complete guide includes a shortcut to another part of the same page.",
    "runtime": "html",
    "lesson": "html-07"
  },
  {
    "source": "The #birds address finds id=\"birds\". nav's aria-label names its purpose.",
    "simple": "`#birds` points to `id=\"birds\"`. The `nav` area’s `aria-label` tells tools what those links are for.",
    "runtime": "html",
    "lesson": "html-07"
  },
  {
    "source": "One main marks the central content, h1 names the guide, and h2 names a topic inside it.",
    "simple": "One `main` holds the main content. `h1` names the guide and `h2` names a topic within it.",
    "runtime": "html",
    "lesson": "html-07"
  },
  {
    "source": "A table is built from nested elements. table wraps the whole thing. caption names what the table is about. tr means table row. th means header cell, which labels a row or column. td means an ordinary data cell. thead groups header rows;",
    "simple": "`table` contains the whole table. `caption` gives it a title. `tr` makes a row. `th` labels a row or column, while `td` holds ordinary data. `thead` groups the heading rows.",
    "runtime": "html",
    "lesson": "html-07"
  },
  {
    "source": "tbody groups the body rows.",
    "simple": "`tbody` groups the rows containing the main table data.",
    "runtime": "html",
    "lesson": "html-07"
  },
  {
    "source": "These tags describe relationships;",
    "simple": "These tags tell the browser how the table parts relate.",
    "runtime": "html",
    "lesson": "html-07"
  },
  {
    "source": "a border alone cannot explain them.",
    "simple": "Drawing a border around cells does not tell a reading tool which cells label the others.",
    "runtime": "html",
    "lesson": "html-07"
  },
  {
    "source": "A table can have several cells in each row, and their order should match the header order.",
    "simple": "Each row can contain several cells. Put them in the same order as the column labels.",
    "runtime": "html",
    "lesson": "html-07"
  },
  {
    "source": "Close every cell before closing its row, then close the row group before closing table.",
    "simple": "Close a cell before closing its row. Close the row group before closing the table.",
    "runtime": "html",
    "lesson": "html-07"
  },
  {
    "source": "scope=\"col\" on a th says it labels its column. scope=\"row\" can mark a header for its row.",
    "simple": "On a `th`, `scope=\"col\"` means this heading labels a column. `scope=\"row\"` means it labels a row.",
    "runtime": "html",
    "lesson": "html-07"
  },
  {
    "source": "The caption names the table as a whole, while column headers tell readers what each value means.",
    "simple": "The caption names the whole table. Each column heading explains the values in that column.",
    "runtime": "html",
    "lesson": "html-07"
  },
  {
    "source": "“Name” and “Wingspan” explain separate columns.",
    "simple": "One column is for the bird’s name, and the other is for its wingspan.",
    "runtime": "html",
    "lesson": "html-07"
  },
  {
    "source": "A person listening to a table may need the header repeated to understand a value, so use real th elements rather than bold ordinary cells.",
    "simple": "A reading tool may repeat a column heading before a value. Use a real `th` so it knows the heading, not just bold text in a normal cell.",
    "runtime": "html",
    "lesson": "html-07"
  },
  {
    "source": "Simple scope-based headers are useful here;",
    "simple": "These straightforward tables can use `scope` to connect headings and data.",
    "runtime": "html",
    "lesson": "html-07"
  },
  {
    "source": "complex tables with multiple overlapping header groups need more careful relationships and testing.",
    "simple": "More complicated tables with several overlapping heading groups need extra care and testing.",
    "runtime": "html",
    "lesson": "html-07"
  },
  {
    "source": "Put this table inside the birds section from the first example.",
    "simple": "Put this table inside the earlier section whose ID is `birds`.",
    "runtime": "html",
    "lesson": "html-07"
  },
  {
    "source": "The caption introduces the information.",
    "simple": "The caption tells the reader what information the table contains.",
    "runtime": "html",
    "lesson": "html-07"
  },
  {
    "source": "The first header applies to bird names, and the second applies to measurements.",
    "simple": "The first column heading labels bird names. The second labels their measurements.",
    "runtime": "html",
    "lesson": "html-07"
  },
  {
    "source": "Each data row follows that same two-cell pattern.",
    "simple": "Every data row follows the same pattern: a name cell, then a measurement cell.",
    "runtime": "html",
    "lesson": "html-07"
  },
  {
    "source": "These example values are content, not code instructions.",
    "simple": "The bird names and measurements are information for the reader, not commands for the computer.",
    "runtime": "html",
    "lesson": "html-07"
  },
  {
    "source": "Reading order comes from the document's structure.",
    "simple": "The order of the HTML elements helps decide the order in which the page is read.",
    "runtime": "html",
    "lesson": "html-07"
  },
  {
    "source": "Keep headings, explanatory text, and the matching table together so the guide makes sense in order.",
    "simple": "Keep each heading, its explanation, and its table together so they make sense one after another.",
    "runtime": "html",
    "lesson": "html-07"
  },
  {
    "source": "Test navigation using Tab and Enter, and check that shortcuts lead to real sections.",
    "simple": "Use Tab and Enter to test the links. Make sure each shortcut reaches an existing section.",
    "runtime": "html",
    "lesson": "html-07"
  },
  {
    "source": "Use a screen reader to listen to the landmarks, headings, table caption, and column relationships.",
    "simple": "Listen with a screen reader to check the page regions, headings, table title, and how headings connect to columns.",
    "runtime": "html",
    "lesson": "html-07"
  },
  {
    "source": "Automated checks can detect a th or caption, but they cannot prove the words are helpful or that every relationship makes sense.",
    "simple": "An automatic test can find a `th` or `caption`, but it cannot prove that the wording and relationships are clear.",
    "runtime": "html",
    "lesson": "html-07"
  },
  {
    "source": "Avoid skipping heading levels merely to make a heading look smaller;",
    "simple": "Do not skip heading levels just to make the text smaller.",
    "runtime": "html",
    "lesson": "html-07"
  },
  {
    "source": "CSS can change appearance without changing the outline.",
    "simple": "Use CSS to change a heading’s appearance without changing its place in the topic order.",
    "runtime": "html",
    "lesson": "html-07"
  },
  {
    "source": "For this guide, use a named nav whose Trail list link has href=\"#trails\" and a real section with id=\"trails\".",
    "simple": "Give the navigation a name. Its Trail list link should use `href=\"#trails\"`, and the destination section must have `id=\"trails\"`.",
    "runtime": "html",
    "lesson": "html-07"
  },
  {
    "source": "Put the guide in one main, with h1 and h2 headings.",
    "simple": "Put the guide inside one `main`, using `h1` for the main topic and `h2` for sections.",
    "runtime": "html",
    "lesson": "html-07"
  },
  {
    "source": "Add a table caption and at least two th cells with scope=\"col\", then supply data in matching columns.",
    "simple": "Add a table caption and at least two column headings with `scope=\"col\"`. Put the matching data under each heading.",
    "runtime": "html",
    "lesson": "html-07"
  },
  {
    "source": "Explain the difference between the table's title and its column labels before building it.",
    "simple": "Before building, explain which words name the whole table and which name its separate columns.",
    "runtime": "html",
    "lesson": "html-07"
  },
  {
    "source": "After the checks, review the whole reading order, use the keyboard shortcut, and listen with a screen reader.",
    "simple": "After the tests pass, read the page in order, use the shortcut with a keyboard, and listen with a screen reader.",
    "runtime": "html",
    "lesson": "html-07"
  },
  {
    "source": "Passing structural checks is a starting point for that review.",
    "simple": "Passing the HTML structure tests means you are ready for that review, not that every usability check is finished.",
    "runtime": "html",
    "lesson": "html-07"
  },
  {
    "source": "Repeated content becomes easier to scan when similar pieces have the same structure.",
    "simple": "People can scan repeated items more easily when each follows the same pattern.",
    "runtime": "html",
    "lesson": "html-08"
  },
  {
    "source": "A product card can consistently present a product name, a description, and a price.",
    "simple": "Each product card can show the name first, then a description, then a price.",
    "runtime": "html",
    "lesson": "html-08"
  },
  {
    "source": "A reusable markup pattern means you repeat those roles while changing the content.",
    "simple": "Reuse those same parts while changing the product information inside them.",
    "runtime": "html",
    "lesson": "html-08"
  },
  {
    "source": "It does not mean every card must have words of the same length.",
    "simple": "The words on different cards do not need to have the same length.",
    "runtime": "html",
    "lesson": "html-08"
  },
  {
    "source": "HTML does not automatically calculate prices or create new cards.",
    "simple": "HTML does not work out prices or add extra cards by itself.",
    "runtime": "html",
    "lesson": "html-08"
  },
  {
    "source": "You author the content, or later write code to produce it, while preserving a meaningful structure for each item.",
    "simple": "Write each card’s content yourself, or later use code to create it. Either way, keep the parts meaningful.",
    "runtime": "html",
    "lesson": "html-08"
  },
  {
    "source": "This complete catalog starts with one card.",
    "simple": "This complete product list begins with a single card.",
    "runtime": "html",
    "lesson": "html-08"
  },
  {
    "source": "The same pattern can be copied inside main.",
    "simple": "Copy the pattern inside `main` to add more cards.",
    "runtime": "html",
    "lesson": "html-08"
  },
  {
    "source": "article marks a self-contained item that can make sense on its own. h2 names it beneath the catalog's h1.",
    "simple": "An `article` is a complete item that can make sense on its own. Its `h2` heading sits beneath the catalog’s main `h1` topic.",
    "runtime": "html",
    "lesson": "html-08"
  },
  {
    "source": "Two p elements contain its description and price.",
    "simple": "Use one paragraph for the description and another for the price.",
    "runtime": "html",
    "lesson": "html-08"
  },
  {
    "source": "A class is a reusable name you attach to elements with the class attribute. class=\"product\" identifies all product cards;",
    "simple": "A class is a label you can reuse on several elements. Give product cards `class=\"product\"` to identify them together.",
    "runtime": "html",
    "lesson": "html-08"
  },
  {
    "source": "class=\"price\" identifies price paragraphs.",
    "simple": "Give price paragraphs `class=\"price\"` to identify their job.",
    "runtime": "html",
    "lesson": "html-08"
  },
  {
    "source": "Many elements can share a class.",
    "simple": "You may give the same class name to many elements.",
    "runtime": "html",
    "lesson": "html-08"
  },
  {
    "source": "An id instead identifies a single element and should be unique in the document.",
    "simple": "An `id` is different: use a particular ID for only one element on the page.",
    "runtime": "html",
    "lesson": "html-08"
  },
  {
    "source": "CSS or a checker can find article.product, meaning an article with the product class.",
    "simple": "`article.product` finds `article` elements whose class includes `product`.",
    "runtime": "html",
    "lesson": "html-08"
  },
  {
    "source": "The dot in that selector marks a class;",
    "simple": "The dot in the selector means you are choosing a class.",
    "runtime": "html",
    "lesson": "html-08"
  },
  {
    "source": "it is not part of the HTML class value.",
    "simple": "Write `class=\"product\"`, not `class=\".product\"`. The dot belongs in the selector, not the class name.",
    "runtime": "html",
    "lesson": "html-08"
  },
  {
    "source": "Class names do not create meaning by themselves, so retain real article, heading, and paragraph elements.",
    "simple": "A class name does not replace the meaning of HTML elements. Keep the real `article`, heading, and paragraph tags.",
    "runtime": "html",
    "lesson": "html-08"
  },
  {
    "source": "Consistency means matching jobs and order.",
    "simple": "Use the same kinds of content in the same order on each card.",
    "runtime": "html",
    "lesson": "html-08"
  },
  {
    "source": "In each card, start with a descriptive h2, follow with a detail paragraph, then a price paragraph bearing class=\"price\".",
    "simple": "Start each card with an `h2` product name, then a detail paragraph, then a price paragraph with `class=\"price\"`.",
    "runtime": "html",
    "lesson": "html-08"
  },
  {
    "source": "Keep each card's information inside its own article.",
    "simple": "Keep one product’s name, details, and price together inside its own `article`.",
    "runtime": "html",
    "lesson": "html-08"
  },
  {
    "source": "If the price accidentally sits after </article>, it no longer belongs to the card's structure.",
    "simple": "If the price comes after `</article>`, it is outside that card.",
    "runtime": "html",
    "lesson": "html-08"
  },
  {
    "source": "Closing tags and indentation make these mistakes easier to see.",
    "simple": "Closing tags and leading spaces help you spot content that ended up outside its card.",
    "runtime": "html",
    "lesson": "html-08"
  },
  {
    "source": "Do not use h1 for every product simply to make its title larger;",
    "simple": "Do not give every product an `h1` just to make its name look bigger.",
    "runtime": "html",
    "lesson": "html-08"
  },
  {
    "source": "h2 shows that these items belong beneath the catalog's overall topic.",
    "simple": "Use `h2` to show that each product is part of the catalog’s larger topic.",
    "runtime": "html",
    "lesson": "html-08"
  },
  {
    "source": "Add these cards after the first article, still inside main.",
    "simple": "Add the next cards after the first `article`, keeping them inside `main`.",
    "runtime": "html",
    "lesson": "html-08"
  },
  {
    "source": "The short and long titles use the same tags.",
    "simple": "Use the same heading tags for short and long product names.",
    "runtime": "html",
    "lesson": "html-08"
  },
  {
    "source": "Each article has its own two paragraphs and price class.",
    "simple": "Each card should have its own description paragraph and price paragraph, with the price class.",
    "runtime": "html",
    "lesson": "html-08"
  },
  {
    "source": "The dollar sign is visible text here;",
    "simple": "The dollar sign here is simply a character the reader can see.",
    "runtime": "html",
    "lesson": "html-08"
  },
  {
    "source": "it does not make the browser interpret a payment or change a number.",
    "simple": "Typing a dollar sign does not charge anyone or make the browser perform money calculations.",
    "runtime": "html",
    "lesson": "html-08"
  },
  {
    "source": "A markup template should work with different content.",
    "simple": "The card pattern should work with different lengths and kinds of product information.",
    "runtime": "html",
    "lesson": "html-08"
  },
  {
    "source": "Try a short title, a long title, a brief description, and a longer description.",
    "simple": "Test short and long titles, plus short and long descriptions.",
    "runtime": "html",
    "lesson": "html-08"
  },
  {
    "source": "Check that every item keeps a heading, detail, and price.",
    "simple": "Check that each card still has a heading, details, and a price.",
    "runtime": "html",
    "lesson": "html-08"
  },
  {
    "source": "HTML establishes the structure;",
    "simple": "HTML tells the browser how those parts are grouped.",
    "runtime": "html",
    "lesson": "html-08"
  },
  {
    "source": "later CSS determines whether long content wraps and fits.",
    "simple": "Later, CSS decides how long text wraps and fits on the screen.",
    "runtime": "html",
    "lesson": "html-08"
  },
  {
    "source": "Do not shorten an important name just to hide a layout problem.",
    "simple": "Fix the layout instead of cutting an important part out of a product name.",
    "runtime": "html",
    "lesson": "html-08"
  },
  {
    "source": "If you copy a card, update all its content together so its name, description, and price still describe the same item.",
    "simple": "When copying a card, change its name, description, and price together so all three describe the same product.",
    "runtime": "html",
    "lesson": "html-08"
  },
  {
    "source": "Repetition helps maintenance only when the repeated pattern stays accurate.",
    "simple": "A repeated pattern saves work only if its copied information stays correct.",
    "runtime": "html",
    "lesson": "html-08"
  },
  {
    "source": "For the garden catalog, create at least three article elements with class=\"product\".",
    "simple": "For this catalog, make at least three `article` elements with `class=\"product\"`.",
    "runtime": "html",
    "lesson": "html-08"
  },
  {
    "source": "Give each a nonempty h2, a detail p, and a p with class=\"price\".",
    "simple": "Each card needs an `h2` with text, a detail paragraph, and a price paragraph with `class=\"price\"`.",
    "runtime": "html",
    "lesson": "html-08"
  },
  {
    "source": "The checks look inside each article, so scattered headings and prices elsewhere cannot substitute for complete cards.",
    "simple": "The tests look inside each card. A heading or price somewhere else on the page cannot complete a missing card part.",
    "runtime": "html",
    "lesson": "html-08"
  },
  {
    "source": "Then practice adding a fourth card using the same pattern.",
    "simple": "Add a fourth card by following the same pattern.",
    "runtime": "html",
    "lesson": "html-08"
  },
  {
    "source": "Review short and long content and explain why the repeated structure helps people scan products.",
    "simple": "Try short and long content. Explain how putting the same information in the same places makes products easier to scan.",
    "runtime": "html",
    "lesson": "html-08"
  },
  {
    "source": "Passing a card-count check does not tell you whether the prices are correct or whether long text fits a future visual design.",
    "simple": "The number-of-cards test cannot tell whether your prices are right or whether long text will fit a later design.",
    "runtime": "html",
    "lesson": "html-08"
  }
];

export default readings;
