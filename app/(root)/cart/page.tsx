"use client";
import CustomSheet from "@/components/CustomSheet";
import ShippingForm from "@/components/ShippingForm";
import { Checkbox } from "@/components/ui/checkbox";
import useCart from "@/lib/hooks/useCart";

import { useUser } from "@clerk/nextjs";
import { MinusCircle, PlusCircle, Trash } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Cart = () => {
  const router = useRouter();
  const { user } = useUser();
  const cart = useCart();
  const [shippingData, setShippingData] = useState<shippingAddressType | null>(
    null
  );

  const total = cart.cartItems.reduce(
    (acc, cartItem) => acc + cartItem.item.price * cartItem.quantity,
    0
  );
  const totalRounded = parseFloat(total.toFixed(2));

  const customer = {
    clerkId: user?.id,
    email: user?.emailAddresses[0].emailAddress,
    name: user?.fullName,
  };

  const onSelectCheckbox = (e: boolean) => {
    if (e) {
      setShippingData({ address: "Retiro por sucursal" });
    } else {
      setShippingData(null);
    }
  };

  const handleCheckout = async () => {
    try {
      // Crear función para proceder al pago ⬇
      if (!user) {
        router.push("/sign-in");
      } else {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, {
          method: "POST",
          body: JSON.stringify({
            cartItems: cart.cartItems,
            customer,
            shippingData,
          }),
        });
        const data = await res.json();
        window.location.href = data.sandbox_init_point;
      }
    } catch (error) {
      console.log("[checkout_POST]", error);
    }
  };

  return (
    <div className="flex gap-20 py-16 px-10 max-lg:flex-col">
      <div className="w-2/3 max-lg:w-full">
        <p className="text-heading3-bold">Carrito de compras</p>
        <hr className="my-6" />

        {cart.cartItems.length === 0 ? (
          <p className="text-body-bold">No tenes productos en el carrito</p>
        ) : (
          <div>
            {cart.cartItems.map((cartItem) => (
              <div className="w-full flex max-sm:flex-col max-sm:gap-3 hover:bg-grey-1 px-6 py-5 items-center max-sm:items-start justify-between">
                <div className="flex items-center">
                  <Image
                    src={cartItem.item.media[0]}
                    width={100}
                    height={100}
                    className="rounded-lg w-32 h-32 object-cover"
                    alt="product"
                  />

                  <div className="flex flex-col gap-3 ml-4">
                    <p className="text-body-bold">{cartItem.item.title}</p>
                    {cartItem.color && (
                      <p className="text-small-medium">{cartItem.color}</p>
                    )}

                    {cartItem.size && (
                      <p className="text-small-medium">{cartItem.size}</p>
                    )}

                    <p className="text-small-medium">$ {cartItem.item.price}</p>
                  </div>
                </div>

                <div className="flex gap-4 items-center">
                  <MinusCircle
                    className="hover:text-red-1 cursor-pointer"
                    onClick={() => cart.decreaseQuantity(cartItem.item._id)}
                  />
                  <p className="text-body-bold">{cartItem.quantity}</p>
                  <PlusCircle
                    className="hover:text-red-1 cursor-pointer"
                    onClick={() => cart.increaseQuantity(cartItem.item._id)}
                  />
                </div>

                <Trash
                  className="hover:text-red-1 cursor-pointer"
                  onClick={() => cart.removeItem(cartItem.item._id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="w-1/3 max-lg:w-full flex flex-col gap-8 bg-grey-1 rounded-lg px-4 py-5">
        <p className="text-heading4-bold pb-4">
          Cantidad{" "}
          <span>{`(${cart.cartItems.length} ${
            cart.cartItems.length > 1 ? "Productos" : "Producto"
          })`}</span>
        </p>

        <div className="flex justify-between text-body-semibold">
          <span>Total</span>
          <span>$ {totalRounded}</span>
        </div>

        <div className="flex justify-between text-body-semibold">
          <CustomSheet title="Dirección de envió">
            <ShippingForm setShippingData={setShippingData} />
          </CustomSheet>

          <div className="flex gap-2 items-center">
            <Checkbox onCheckedChange={(e) => onSelectCheckbox(e as boolean)} />
            <span>Retiro por sucursal</span>
          </div>
        </div>

        <button
          className={`border rounded-lg text-body-bold bg-white py-3 w-full ${
            shippingData === null
              ? "opacity-40"
              : "opacity-100 hover:bg-black hover:text-white"
          }`}
          onClick={handleCheckout}
          disabled={shippingData === null ? true : false}
        >
          Proceder al pago
        </button>
      </div>
    </div>
  );
};

export default Cart;
