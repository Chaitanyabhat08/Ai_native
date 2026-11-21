import SearchView from "../../components/search-view";

export default async function SearchPage({ searchParams }: PageProps<"/search">) {
  const { q } = await searchParams;
  const term = (Array.isArray(q) ? q[0] : q)?.trim() ?? "";
  return <SearchView key={term} term={term} />;
}
