import { useSelector } from "react-redux";
import Product from "./Product";

const Favorites = () => {
  const favorites = useSelector((state) => state.favorites);

  return (
    <div className="ml-[10rem]">
      <h1 className="text-lg font-bold ml-[3rem] mt-[3rem]">
        FAVORITE PRODUCTS
      </h1>
      {favorites.length === 0 && (
        <>
          <div className="mt-[3rem] ml-[3rem] text-green-500">No Product Added to Favorite List.</div>
        </>
      )}

      <div className="flex flex-wrap">
        {favorites.map((product) => (
          <Product key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Favorites;
