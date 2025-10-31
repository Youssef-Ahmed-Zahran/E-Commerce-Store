import { useSelector } from "react-redux";

const CartCount = () => {
  const { cartItems } = useSelector((state) => state.cart);

  return (
    <div className="absolute -top-1 -right-1">
      {cartItems.length > 0 && (
        <span className="px-2 py-1 text-xs font-bold text-white bg-emerald-500 rounded-full shadow-lg">
          {cartItems.reduce((a, c) => a + c.qty, 0)}
        </span>
      )}
    </div>
  );
};

export default CartCount;
