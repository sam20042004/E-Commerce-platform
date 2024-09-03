import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice.js";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu.jsx";
import { set } from "mongoose";

const ProductUpdate = () => {
  const params = useParams();
  const navigate = useNavigate();

  const { data: productData } = useGetProductByIdQuery(params.id);
  const { data: categories = [] } = useFetchCategoriesQuery();

  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [category, setCategory] = useState(null);
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(0);

  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const [uploadProductImage] = useUploadProductImageMutation();

  useEffect(() => {
    if (productData && productData._id) {
      setName(productData.name || "");
      setDescription(productData.description || "");
      setBrand(productData.brand || "");
      setPrice(productData.price || "");
      setCategory(productData.category || null);
      setStock(productData.stock || 0);
      setQuantity(productData.quantity || 0);
      setImage(productData.image || "");
    }
  }, [productData]);
  //   console.log(productData);
  //   console.log(category);

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);

    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("quantity", quantity);
      formData.append("brand", brand);
      formData.append("countInStock", stock);

      const { data } = await updateProduct({
        id: params.id,
        data: formData,
      });
      if (data.error) {
        toast.error("Product Updation Failed, Try again");
        toast.error(data.error);
      } else {
        toast.success(`${data.name} is updated`);
        navigate("/admin/allproductslist");
      }
    } catch (error) {
      console.log(error);
      toast.error("Product Updation Failed, Try again.");
      toast.error(error?.data?.message || error.error);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const answer = window.confirm(
        "Are you sure you want to delete this product"
      );
      if (!answer) {
        return;
      }
      const { data } = await deleteProduct(params.id);
      if (data.error) {
        toast.error("Product Deletion Failed");
        toast.error(data.error);
      } else {
        toast.success("Product Deleted");
        navigate("/admin/allproductslist");
      }
    } catch (error) {
      console.log(error);
      toast.error("Product Deletion Failed, Try again.");
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <div className="container xl:mx-[9rem] sm:mx-[0]">
      <div className="flex flex-col md:flex-row">
        <AdminMenu />
        <div className="md:w-3/4 p-3">
          <div className="h-12">Create Product</div>

          {image && (
            <div className="text-center">
              <img
                src={image}
                alt="product"
                className="block mx-auto max-h-[200px]"
              />
            </div>
          )}

          <div className="mb-3">
            <label className="border text-white px-4 block w-full text-center rounded-lg cursor-pointer font-bold py-11">
              {image ? image.name : "Upload Image"}

              <input
                type="file"
                name="image"
                accept="image/"
                // onChange={uploadFileHandler}
                className={!image ? "hidden" : "text-white"}
              />
            </label>
          </div>

          <div className="p-3">
            <div className="flex flex-wrap">
              <div className="one">
                <label htmlFor="name">Name</label>
                <br />
                <input
                  type="text"
                  className="p-4 mb-3 w-[27rem] border rounded-lg bg-[#101011] text-white"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="two ml-10">
                <label htmlFor="name block">Price</label>
                <br />
                <input
                  type="number"
                  className="p-4 mb-3 w-[27rem] border rounded-lg bg-[#101011] text-white"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-wrap">
              <div className="one">
                <label htmlFor="name block">Quantity</label>
                <br />
                <input
                  type="number"
                  className="p-4 mb-3 w-[27rem] border rounded-lg bg-[#101011] text-white"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>

              <div className="two ml-10">
                <label htmlFor="name block">Brand</label>
                <br />
                <input
                  type="text"
                  className="p-4 mb-3 w-[27rem] border rounded-lg bg-[#101011] text-white"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </div>
            </div>

            <label htmlFor="" className="my-5">
              Description
            </label>
            <textarea
              type="text"
              className="p-2 mb-3 bg-[#101011] border rounded-lg w-[95%] text-white"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>

            <div className="flex justify-between">
              <div>
                <label htmlFor="name block"> Count in Stock</label> <br />
                <input
                  type="number"
                  className="p=4 mb-3 w-[27rem] border rounded-lg bg-[#101011] text-white"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>

              <div className="ml-10">
                <label htmlFor="">Category</label>
                <br />

                <select
                  placeholder="Choose Category"
                  className="p=4 mb-3 w-[27rem] border rounded-lg bg-[#101011] text-white"
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories?.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <button
                onClick={handleSubmit}
                className="py-4 px-10 mt-5 rounded-lg text-lg font-bold bg-green-600 mr-6"
              >
                Update
              </button>

              <button
                onClick={handleDelete}
                className="py-4 px-10 mt-5 rounded-lg text-lg font-bold bg-pink-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductUpdate;
