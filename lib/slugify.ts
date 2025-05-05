export function slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // remove non-alphanumeric chars
      .replace(/\s+/g, "-")     // replace spaces with -
      .replace(/--+/g, "-");    // collapse multiple -
  }
  