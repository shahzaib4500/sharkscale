interface RollingTextProps {
  text: string;
}

export default function RollingText({ text }: RollingTextProps) {
  return (
    <span className="inline-flex" style={{ lineHeight: 1 }} aria-label={text}>
      {Array.from(text).map((char, index) => (
        <span key={`${char}-${index}`} className="inline-block overflow-hidden" style={{ height: "1em" }} aria-hidden>
          <span
            className="flex flex-col transition-transform duration-300 ease-out group-hover:-translate-y-1/2"
            style={{ transitionDelay: `${index * 25}ms` }}
          >
            <span>{char === " " ? "\u00A0" : char}</span>
            <span>{char === " " ? "\u00A0" : char}</span>
          </span>
        </span>
      ))}
    </span>
  );
}
