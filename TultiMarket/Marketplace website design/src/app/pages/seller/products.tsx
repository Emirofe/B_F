import { useState } from "react";
import { Plus, Edit, Trash2, Eye, EyeOff, Search } from "lucide-react";
import { products as allProducts, categories, Product } from "../../data/mock-data";
import { ProductForm } from "../../components/product-form";
import { toast } from "sonner";

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  stock: string;
  category: string;
}

interface ProductImage {
  id: string;
  url: string;
  file: File;
  isUploading: boolean;
}

export function SellerProductsPage() {
  const [sellerProducts, setSellerProducts] = useState<(Product & { active: boolean })[]>(
    allProducts.filter((p) => p.sellerId === "s1").map((p) => ({ ...p, active: true }))
  );
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "cumpleanos",
  });
  const [formImages, setFormImages] = useState<ProductImage[]>([]);

  const filtered = sellerProducts.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFormChange = (field: keyof ProductFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImagesChange = (images: ProductImage[]) => {
    setFormImages(images);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setSellerProducts((prev) =>
        prev.map((p) =>
          p.id === editingId
            ? {
                ...p,
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock),
                category: formData.category,
              }
            : p
        )
      );
      toast.success("Producto actualizado");
    } else {
      const newProduct: Product & { active: boolean } = {
        id: `sp-${Date.now()}`,
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        category: formData.category,
        image: allProducts[0].image,
        images: [allProducts[0].image],
        rating: 0,
        reviewCount: 0,
        sellerId: "s1",
        sellerName: "FiestaMax",
        reviews: [],
        active: true,
      };
      setSellerProducts((prev) => [newProduct, ...prev]);
      toast.success("Producto creado");
    }
    closeForm();
  };

  const handleEdit = (product: Product & { active: boolean }) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      description: product.description,
      price: String(product.price),
      stock: String(product.stock),
      category: product.category,
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: "", description: "", price: "", stock: "", category: "cumbleaños" });
    setFormImages([]);
  };

  const toggleActive = (id: string) => {
    setSellerProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
    );
    toast.success("Estado del producto actualizado");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h1 style={{ fontSize: 24, fontWeight: 600 }}>Mis Productos</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setFormData({ name: "", description: "", price: "", stock: "", category: "cumpleanos" });
          }}
          className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg hover:bg-primary/90 transition-colors"
          style={{ fontSize: 14 }}
        >
          <Plus size={18} /> Nuevo Producto
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar mis productos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-white focus:border-primary outline-none"
          style={{ fontSize: 14 }}
        />
      </div>

      {/* Form Modal */}
      {showForm && (
        <ProductForm
          isEditing={!!editingId}
          formData={formData}
          onFormChange={handleFormChange}
          onSubmit={handleSubmit}
          onCancel={closeForm}
          onImagesChange={handleImagesChange}
          categories={categories}
          initialImages={formImages}
        />
      )}

      {/* Product table */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: 13, fontWeight: 500 }}>Producto</th>
                <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: 13, fontWeight: 500 }}>Precio</th>
                <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: 13, fontWeight: 500 }}>Stock</th>
                <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: 13, fontWeight: 500 }}>Categoria</th>
                <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: 13, fontWeight: 500 }}>Estado</th>
                <th className="text-right px-4 py-3 text-muted-foreground" style={{ fontSize: 13, fontWeight: 500 }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id} className="border-b border-border last:border-0 hover:bg-gray-50/50">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <img src={product.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                      <span className="truncate max-w-[200px]" style={{ fontSize: 14 }}>{product.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4" style={{ fontSize: 14 }}>${product.price.toFixed(2)}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded ${
                      product.stock === 0 ? "bg-red-100 text-red-700" :
                      product.stock < 10 ? "bg-amber-100 text-amber-700" :
                      "bg-green-100 text-green-700"
                    }`} style={{ fontSize: 13 }}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-4 capitalize text-muted-foreground" style={{ fontSize: 14 }}>
                    {product.category.replace("-", " ")}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded ${product.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`} style={{ fontSize: 13 }}>
                      {product.active ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => handleEdit(product)} className="p-2 text-muted-foreground hover:text-primary rounded-lg hover:bg-primary/5">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => toggleActive(product.id)} className="p-2 text-muted-foreground hover:text-amber-600 rounded-lg hover:bg-amber-50">
                        {product.active ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <button onClick={() => {
                        setSellerProducts((prev) => prev.filter((p) => p.id !== product.id));
                        toast.success("Producto eliminado");
                      }} className="p-2 text-muted-foreground hover:text-red-600 rounded-lg hover:bg-red-50">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
