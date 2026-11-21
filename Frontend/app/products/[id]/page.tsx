import ProductView from "../../../components/product-view";

export default async function ProductPage({ params }: PageProps<"/products/[id]">) {
  const { id } = await params;
  return <ProductView key={id} id={id} />;
}
