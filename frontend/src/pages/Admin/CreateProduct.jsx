// src/pages/Admin/CreateProduct.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// RTKQ
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";

import AdminMenu from "./AdminMenu";

import { toast } from "react-toastify";

function CreateProduct() {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(0);
  const navigate = useNavigate();

  const [createProduct] = useCreateProductMutation();
  const [uploadProductImage] = useUploadProductImageMutation();
  const { data: categories } = useFetchCategoriesQuery();

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.message || error.error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const productData = new FormData();
      productData.append("image", image);
      productData.append("name", name);
      productData.append("description", desc);
      productData.append("price", price);
      productData.append("category", category);
      productData.append("quantity", quantity);
      productData.append("brand", brand);
      productData.append("countInStock", stock);

      const { data } = await createProduct(productData);

      if (data.error) {
        toast.error("Product create failed. Try Again.");
      } else {
        toast.success(`${data.name} is created`);
        navigate("/admin/allproductslist");
      }
    } catch (error) {
      console.error(error);
      toast.error("Product create failed. Try Again.");
    }
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <AdminMenu />
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white mb-6">Create Product</h1>

          {image && (
            <div className="text-center mb-6">
              <img
                src={image}
                alt="product"
                className="mx-auto max-h-48 rounded-xl shadow-lg"
              />
            </div>
          )}

          <div className="mb-6">
            <label className="block w-full text-center cursor-pointer">
              <div className="border-2 border-dashed border-gray-600 rounded-xl py-16 px-4 hover:border-emerald-500 transition-colors">
                <p className="text-lg font-semibold text-white">
                  {image ? image.split("/").pop() : "Upload Image"}
                </p>
              </div>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={uploadFileHandler}
                className="hidden"
              />
            </label>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-slate-800 text-white rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Price
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-3 bg-slate-800 text-white rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-3 bg-slate-800 text-white rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Brand
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-slate-800 text-white rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                className="w-full px-4 py-3 bg-slate-800 text-white rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                rows={4}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Count In Stock
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-slate-800 text-white rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category
                </label>
                <select
                  className="w-full px-4 py-3 bg-slate-800 text-white rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Choose Category</option>
                  {categories?.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              onClick={handleSubmit}
              className="w-full md:w-auto px-10 py-3 mt-6 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-lg rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateProduct;
