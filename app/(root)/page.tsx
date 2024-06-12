import Image from "next/image";
import Banner from "../../public/Banner.png";
import Collections from "@/components/Collections";
import ProductList from "@/components/ProductList";

export default function Home() {
  return (
    <>
      <Image
        src={Banner}
        alt="Banner"
        width={2000}
        height={1000}
        className="w-screen"
      />

      <Collections />
      <ProductList />
    </>
  );
}

export const dynamic = "force-dynamic";
