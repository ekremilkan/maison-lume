/** Renders `_word_` segments of a string in clay italics. */
export function Emphasis({ text }: { text: string }) {
  return text.split(/(_[^_]+_)/).map((part, i) =>
    part.startsWith("_") ? (
      <em key={i} className="text-clay italic">
        {part.slice(1, -1)}
      </em>
    ) : (
      part
    ),
  );
}
