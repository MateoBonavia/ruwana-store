"use client";
import { useUser } from "@clerk/nextjs";
import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const ProductCard = ({ product }: { product: ProductType }) => {
  const { user } = useUser();

  const [loading, setLoading] = useState(false);
  const [signedInUser, setSignedInUser] = useState<UserType | null>(null);
  const [isLiked, setIsLiked] = useState(false);

  const getUser = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/users");
      const data = await res.json();
      setSignedInUser(data);
      setIsLiked(data.wishlist.includes(product._id));
      setLoading(false);
    } catch (error) {
      console.log("[users_GET]", error);
    }
  };

  useEffect(() => {
    if (user) {
      getUser();
    }
  }, []);

  return (
    <Link
      href={`/products/${product._id}`}
      className="w-[220px] flex flex-col gap-2"
    >
      <Image
        src={product.media[0]}
        alt="Producto"
        width={250}
        height={300}
        className="h-[250px] rounded-lg object-cover"
      />

      <div>
        <p className="text-base-bold">{product.title}</p>
        <p className="text-small-medium text-grey-2">{product.category}</p>

        <div className="flex justify-between items-center">
          <p className="text-body-bold">${product.price}</p>
          <button>
            <Heart fill={`${isLiked ? "red" : "white"}`} />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
