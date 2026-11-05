import type { BlogMark, BlogNode } from "@features/blog/lib/blog.types";
import { safeHref } from "@features/blog/lib/blogUtils";
import Image from "next/image";
import type { ReactNode } from "react";

// The article title is the page's only <h1>, so an H1 in the body renders large but as an <h2>.
const HEADINGS: Record<number, { tag: "h2" | "h3" | "h4"; className: string }> = {
  1: { tag: "h2", className: "mt-8 text-[clamp(30px,3.6vw,42px)] leading-[1.05] font-extrabold tracking-[-0.045em]" },
  2: { tag: "h2", className: "mt-7 text-[clamp(25px,2.8vw,32px)] leading-[1.12] font-extrabold tracking-[-0.04em]" },
  3: { tag: "h3", className: "mt-4 text-[clamp(20px,2vw,23px)] leading-[1.2] font-bold tracking-[-0.03em]" },
  4: { tag: "h4", className: "mt-2 text-[17px] leading-[1.3] font-bold tracking-[-0.02em]" }
};
const DEFAULT_HEADING = { tag: "h2" as const, className: "mt-7 text-[clamp(25px,2.8vw,32px)] leading-[1.12] font-extrabold tracking-[-0.04em]" };

function applyMark(mark: BlogMark, children: ReactNode): ReactNode {
  switch (mark.type) {
    case "bold":
      return <strong className="font-bold text-[#12141F]">{children}</strong>;
    case "italic":
      return <em>{children}</em>;
    case "underline":
      return <u>{children}</u>;
    case "strike":
      return <s>{children}</s>;
    case "code":
      return <code className="rounded bg-black/6 px-1.5 py-0.5 font-mono text-[0.9em]">{children}</code>;
    case "link": {
      const href = safeHref(mark.attrs?.href);
      if (!href) {
        return children;
      }
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="font-medium text-[#2F5BFF] underline decoration-[#2F5BFF]/35 underline-offset-4 hover:decoration-[#2F5BFF]"
        >
          {children}
        </a>
      );
    }
    default:
      return children;
  }
}

function Inline({ nodes = [] }: { nodes?: BlogNode[] }) {
  return (
    <>
      {nodes.map((node, index) => {
        if (node.type === "hardBreak") {
          return <br key={index} />;
        }
        if (node.type !== "text") {
          return null;
        }
        const content = (node.marks ?? []).reduce<ReactNode>((children, mark) => applyMark(mark, children), node.text ?? "");
        return <span key={index}>{content}</span>;
      })}
    </>
  );
}

function ListBlock({ node }: { node: BlogNode }) {
  const ordered = node.type === "orderedList";
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag className="flex flex-col gap-3.5">
      {(node.content ?? []).map((item, index) => (
        <li key={index} className="flex gap-4 text-[17px] leading-[1.65] text-black/72">
          {ordered ? (
            <span
              aria-hidden
              className="flex h-6 min-w-6 flex-none items-center justify-center bg-secondary px-1 font-mono text-[11px] font-bold text-tertiary"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
          ) : (
            <span aria-hidden className="mt-[0.6em] size-2 flex-none rotate-45 bg-[#2F5BFF]" />
          )}
          <div className="flex min-w-0 flex-col gap-2">
            {(item.content ?? []).map((child, childIndex) =>
              child.type === "paragraph" ? (
                <p key={childIndex}>
                  <Inline nodes={child.content} />
                </p>
              ) : (
                <ContentNode key={childIndex} node={child} />
              )
            )}
          </div>
        </li>
      ))}
    </Tag>
  );
}

function ContentNode({ node, id, isLead = false }: { node: BlogNode; id?: string; isLead?: boolean }) {
  switch (node.type) {
    case "heading": {
      const heading = HEADINGS[node.attrs?.level ?? 2] ?? DEFAULT_HEADING;
      const Tag = heading.tag;
      return (
        <Tag id={id} className={`scroll-mt-28 text-[#12141F] ${heading.className}`}>
          <Inline nodes={node.content} />
        </Tag>
      );
    }
    case "bulletList":
    case "orderedList":
      return <ListBlock node={node} />;
    case "blockquote":
      return (
        <blockquote className="relative my-4 overflow-hidden rounded-[22px] bg-tertiary px-7 py-9 text-white sm:px-10">
          <span aria-hidden className="absolute top-3 right-6 text-[96px] leading-none font-extrabold text-secondary/80">
            ”
          </span>
          {(node.content ?? []).map((child, index) => (
            <p key={index} className="relative pr-10 text-[clamp(20px,2.3vw,27px)] leading-[1.3] font-bold tracking-[-0.03em]">
              <Inline nodes={child.content} />
            </p>
          ))}
        </blockquote>
      );
    case "image": {
      const src = safeHref(node.attrs?.src);
      if (!src) {
        return null;
      }
      return <Image src={src} alt={node.attrs?.alt ?? ""} width={1600} height={900} unoptimized className="my-3 h-auto w-full rounded-[18px]" />;
    }
    case "horizontalRule":
      return <hr className="my-4 border-t border-dashed border-black/15" />;
    case "paragraph":
      return (
        <p
          className={
            isLead ? "text-[clamp(19px,2vw,22px)] leading-[1.6] font-medium tracking-[-0.01em] text-[#12141F]" : "text-[17px] leading-[1.8] text-black/72"
          }
        >
          <Inline nodes={node.content} />
        </p>
      );
    default:
      return null;
  }
}

/** Renders a stored post body. Nothing is injected as raw HTML, and only safe links and images are shown. */
export default function PostContent({ body }: { body: BlogNode[] }) {
  return (
    <div className="flex min-w-0 flex-col gap-6">
      {body.map((node, index) => (
        <ContentNode key={index} node={node} id={`section-${index}`} isLead={index === 0} />
      ))}
    </div>
  );
}
