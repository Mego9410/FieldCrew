/**
 * Blog author for E-E-A-T. Replace name, role, and bio with your real credentials.
 */
export const defaultBlogAuthor = {
  name: "Oliver Acton",
  role: "Founder, FieldCrew",
  bio: "Built FieldCrew after years working with small US HVAC contractors on scheduling, payroll accuracy, and labor cost visibility.",
  url: "https://getfieldcrew.com/about",
} as const;

export function buildAuthorSchema() {
  return {
    "@type": "Person",
    name: defaultBlogAuthor.name,
    jobTitle: defaultBlogAuthor.role,
    url: defaultBlogAuthor.url,
    description: defaultBlogAuthor.bio,
  };
}
