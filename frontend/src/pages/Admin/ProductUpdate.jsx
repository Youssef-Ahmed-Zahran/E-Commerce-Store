// src/pages/Admin/ProductUpdate.jsx
import { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import { useNavigate, useParams } from "react-router-dom";
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";

const ProductUpdate = () => {
  const { _id: productId } = useParams();
  const navigate = useNavigate();

  const { data: productData } = useGetProductByIdQuery(productId);
  const { data: categories = [] } = useFetchCategoriesQuery();
  const [uploadProductImage] = useUploadProductImageMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState("");

  useEffect(() => {
    if (productData?._id) {
      setName(productData.name || "");
      setDescription(productData.description || "");
      setPrice(productData.price || "");
      setQuantity(productData.quantity || "");
      setBrand(productData.brand || "");
      setImage(productData.image || "");
      setStock(productData.countInStock || "");

      const catId =
        typeof productData.category === "string"
          ? productData.category
          : productData.category?._id || "";
      setCategory(catId);
    }
  }, [productData]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message || "Image uploaded");
      setImage(res.image);
    } catch (err) {
      toast.error(err?.data?.message || "Upload failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("image", image);
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("quantity", quantity);
    formData.append("brand", brand);
    formData.append("countInStock", stock);

    try {
      await updateProduct({ productId, formData }).unwrap();
      toast.success("Product updated successfully");
      navigate("/admin/allproductslist");
    } catch (err) {
      toast.error(err?.data?.message || "Update failed");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${name}" permanently?`)) return;

    try {
      await deleteProduct(productId).unwrap();
      toast.success("Product deleted");
      navigate("/admin/allproductslist");
    } catch (err) {
      console.log(err);
      toast.error("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <AdminMenu />
          </div>

          {/* Main Form */}
          <div className="flex-1">
            <div className="bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-slate-700">
              <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                Update Product
              </h1>

              {/* Image Preview + Upload */}
              <div className="mb-8">
                {image ? (
                  <div className="relative group">
                    <img
                      src={image}
                      alt="Product"
                      className="w-full max-w-md mx-auto rounded-2xl shadow-lg object-cover h-64"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                      <p className="text-white font-medium">Click to change</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-700 border-2 border-dashed border-slate-600 rounded-2xl h-64 flex items-center justify-center">
                    <p className="text-slate-400">No image</p>
                  </div>
                )}

                <label className="mt-4 block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={uploadFileHandler}
                    className="hidden"
                  />
                  <div className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-xl cursor-pointer text-center transition-all shadow-md">
                    {image ? "Change Image" : "Upload Image"}
                  </div>
                </label>
              </div>

              {/* Form Grid */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Name"
                    value={name}
                    onChange={setName}
                    placeholder="Enter product name"
                  />
                  <InputField
                    label="Price"
                    type="number"
                    value={price}
                    onChange={setPrice}
                    placeholder="0.00"
                  />
                  <InputField
                    label="Quantity"
                    type="number"
                    value={quantity}
                    onChange={setQuantity}
                    min="1"
                  />
                  <InputField
                    label="Brand"
                    value={brand}
                    onChange={setBrand}
                    placeholder="Enter brand"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Count In Stock
                    </label>
                    <input
                      type="number"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                    >
                      <option value="">Choose Category</option>
                      {categories.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition resize-none"
                    placeholder="Enter product description..."
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <button
                    type="submit"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Update Product
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Delete Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Input Component
const InputField = ({ label, type = "text", value, onChange, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-slate-300 mb-2">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
      {...props}
    />
  </div>
);

export default ProductUpdate;
