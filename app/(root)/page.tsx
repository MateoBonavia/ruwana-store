import Image from "next/image";
import Banner from "../../public/Banner.png";
import Collections from "@/components/Collections";

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
    </>
  );
}
