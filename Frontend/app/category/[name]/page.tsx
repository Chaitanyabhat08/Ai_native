import CategoryView from "../../../components/category-view";

export default async function CategoryPage({ params }: PageProps<"/category/[name]">) {
  const { name } = await params;
  // This router can preserve percent escapes on client navigation.
  let category = name;
  try {
    category = decodeURIComponent(name);
  } catch {
    // Preserve literal percent signs in already-decoded category names.
  }
  return <CategoryView key={category} name={category} />;
}
