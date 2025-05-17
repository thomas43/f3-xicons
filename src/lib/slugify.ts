// Basic function 'slugify' either xicon
export function slugify(name: string) {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
  }
  