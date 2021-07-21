import * as React from "react";
// import { browser, Tabs } from "webextension-polyfill-ts";

// function openWebPage(url: string): Promise<Tabs.Tab> {
//   return browser.tabs.create({ url });
// }

export default function NewTab(): React.ReactElement<{}> {
  return (
    <main id="newtab" className="text-gray-800">
      <div className="py-8">
        <div className="container px-6 mx-auto">
          <h1 className="text-3xl font-medium text-center">News Tab</h1>
          <section id="topic-navbar">
            <div className="flex flex-col mt-8 space-y-4">
              <div className="flex justify-between uppercase">
                <div>Friday, July 16, 2021</div>
                <div>
                  <a href="#">Sign In</a>
                </div>
              </div>
              <hr className="divider" />
              <div className="">
                <ul className="flex space-x-4 text-lg uppercase">
                  <li className="font-medium text-indigo-600 border-b-2 border-indigo-600">
                    <a className="" href="#">
                      Everything
                    </a>
                  </li>
                  <li>Crypto</li>
                  <li>Tech</li>
                  <li>Software</li>
                  <li>Finance</li>
                  <li>Real Estate</li>
                  <li>Twitter</li>
                </ul>
              </div>
            </div>
          </section>
          <section id="top-news">
            <TopPosts />
          </section>
        </div>
      </div>
    </main>
  );
}

/* This example requires Tailwind CSS v2.0+ */
const posts: { [key: string]: any }[] = [
  {
    title: "Boost your conversion rate",
    href: "#",
    category: { name: "Twitter", href: "#" },
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto accusantium praesentium eius, ut atque fuga culpa, similique sequi cum eos quis dolorum.",
    date: "Mar 16, 2020",
    datetime: "2020-03-16",
    imageUrl:
      "https://images.unsplash.com/photo-1496128858413-b36217c2ce36?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1679&q=80",
    readingTime: "6 min",
    author: {
      name: "Roel Aufderehar",
      href: "#",
      imageUrl:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  },
  {
    title: "How to use search engine optimization to drive sales",
    href: "#",
    category: { name: "TechCrunch", href: "#" },
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit facilis asperiores porro quaerat doloribus, eveniet dolore. Adipisci tempora aut inventore optio animi., tempore temporibus quo laudantium.",
    date: "Mar 10, 2020",
    datetime: "2020-03-10",
    imageUrl:
      "https://images.unsplash.com/photo-1547586696-ea22b4d4235d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1679&q=80",
    readingTime: "4 min",
    author: {
      name: "Brenna Goyette",
      href: "#",
      imageUrl:
        "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  },
  {
    title: "Improve your customer experience",
    href: "#",
    category: { name: "Case Study", href: "#" },
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint harum rerum voluptatem quo recusandae magni placeat saepe molestiae, sed excepturi cumque corporis perferendis hic.",
    date: "Feb 12, 2020",
    datetime: "2020-02-12",
    imageUrl:
      "https://images.unsplash.com/photo-1492724441997-5dc865305da7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1679&q=80",
    readingTime: "11 min",
    author: {
      name: "Daniela Metz",
      href: "#",
      imageUrl:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  },
];

function TopPosts() {
  return (
    <div className="relative px-4 pt-16 pb-20 bg-indigo-50 sm:px-6 lg:pt-24 lg:pb-28 lg:px-8">
      <div className="absolute inset-0">
        <div className="bg-white h-1/3 sm:h-2/3" />
      </div>
      <div className="relative mx-auto max-w-7xl">
        <div className="">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            From the blog
          </h2>
          <p className="max-w-2xl mt-3 text-xl text-gray-500 sm:mt-4">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ipsa
            libero labore natus atque, ducimus sed.
          </p>
        </div>
        <div className="grid max-w-lg gap-5 mx-auto mt-12 lg:grid-cols-3 lg:max-w-none">
          {posts.map((post) => (
            <Post post={post} key={post.id} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Post({ ...props }) {
  const post = props.post;
  return (
    <div key={post.title} className="flex flex-col overflow-hidden shadow-lg">
      <div className="flex-shrink-0">
        <img className="object-cover w-full h-48" src={post.imageUrl} alt="" />
      </div>
      <div className="flex flex-col justify-between flex-1 p-6 transition bg-white border-b-4 border-transparent hover:border-indigo-500">
        <div className="flex-1">
          <p className="text-sm font-medium text-indigo-600">
            <a href={post.category.href} className="hover:underline">
              {post.category.name}
            </a>
          </p>
          <a href={post.href} className="block mt-2">
            <p className="text-xl font-semibold text-gray-900">{post.title}</p>
            <p className="mt-3 text-base text-gray-500">{post.description}</p>
          </a>
        </div>
        <div className="flex items-center mt-6">
          <div className="flex-shrink-0">
            <a href={post.author.href}>
              <span className="sr-only">{post.author.name}</span>
              <img
                className="w-10 h-10 rounded-full"
                src={post.author.imageUrl}
                alt=""
              />
            </a>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">
              <a href={post.author.href} className="hover:underline">
                {post.author.name}
              </a>
            </p>
            <div className="flex space-x-1 text-sm text-gray-500">
              <time dateTime={post.datetime}>{post.date}</time>
              <span aria-hidden="true">&middot;</span>
              <span>{post.readingTime} read</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
