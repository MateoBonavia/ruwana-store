import Gallery from "@/components/Gallery";
import { getProductDetails } from "@/lib/actions";

const ProductDetails = async ({
  params,
}: {
  params: { productId: string };
}) => {
  const productDetail = await getProductDetails(params.productId);
  console.log(productDetail);

  return (
    <div className="flex justify-center items-start gap-16 py-10 px-5 max-md:flex-col max-md:items-center">
      <Gallery productMedia={productDetail.media} />
    </div>
  );
};

export default ProductDetails;
