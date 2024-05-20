import { getCollections } from "@/lib/actions";
import Image from "next/image";
import Link from "next/link";

const Collections = async () => {
  const collections = await getCollections();
  console.log(collections);

  return (
    <div>
      <p className="text-heading1-bold">Colecciones</p>

      <div>
        {collections.map((collection: CollectionType) => (
          <Link href={`/collections/${collection._id}`} key={collection._id}>
            <Image
              src={collection.image}
              alt={collection.title}
              width={350}
              height={200}
              className="rounded-lg cursor-pointer"
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Collections;
