import ProductDetail from "@/components/ProductDetail";

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  return (
    <div className="pt-20">
      <ProductDetail slug={params.slug} />
    </div>
  );
}
