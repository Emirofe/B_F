import { useState } from "react";
import { Plus, Edit, Trash2, Eye, EyeOff, Search } from "lucide-react";
import { products as allProducts, categories, Product } from "../../data/mock-data";
import { ServiceForm } from "../../components/service-form";
import { toast } from "sonner";

interface ServiceFormData {
  name: string;
  description: string;
  price: string;
  category: string;
  availability: string;
  location: string;
}

interface ServiceImage {
  id: string;
  url: string;
  file: File;
  isUploading: boolean;
}

const serviceCategories = categories.filter(
  (c) =>
    c.id.includes("servicio") ||
    c.id.includes("evento") ||
    c.id.includes("dj") ||
    c.id.includes("decoracion") ||
    c.id.includes("animacion") ||
    c.id.includes("sonido") ||
    c.id.includes("transporte")
);

const createEmptyFormData = (): ServiceFormData => ({
  name: "",
  description: "",
  price: "",
  category: serviceCategories[0]?.id || "fotografia-evento",
  availability: "Lunes a viernes, 9:00 a 18:00",
  location: "",
});

export function SellerServicesPage() {
  const [sellerServices, setSellerServices] = useState<(Product & { active: boolean })[]>(
    allProducts
      .filter((p) => p.sellerId === "s1" && p.type === "servicio")
      .map((p) => ({ ...p, active: true }))
  );
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState<ServiceFormData>(createEmptyFormData());
  const [formImages, setFormImages] = useState<ServiceImage[]>([]);

  const filtered = sellerServices.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFormChange = (field: keyof ServiceFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImagesChange = (images: ServiceImage[]) => {
    setFormImages(images);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      setSellerServices((prev) =>
        prev.map((s) =>
          s.id === editingId
            ? {
                ...s,
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                category: formData.category,
                availability: formData.availability,
                location: formData.location,
              }
            : s
        )
      );
      toast.success("Servicio actualizado");
    } else {
      const newService: Product & { active: boolean } = {
        id: `srv-${Date.now()}`,
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        image: allProducts[0].image,
        images: [allProducts[0].image],
        rating: 0,
        reviewCount: 0,
        stock: 99,
        sellerId: "s1",
        sellerName: "FiestaMax",
        reviews: [],
        type: "servicio",
        availability: formData.availability,
        location: formData.location,
        active: true,
      };
      setSellerServices((prev) => [newService, ...prev]);
      toast.success("Servicio creado");
    }

    closeForm();
  };

  const handleEdit = (service: Product & { active: boolean }) => {
    setEditingId(service.id);
    setFormData({
      name: service.name,
      description: service.description,
      price: String(service.price),
      category: service.category,
      availability: service.availability || "",
      location: service.location || "",
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(createEmptyFormData());
    setFormImages([]);
  };

  const toggleActive = (id: string) => {
    setSellerServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
    );
    toast.success("Estado del servicio actualizado");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h1 style={{ fontSize: 24, fontWeight: 600 }}>Mis Servicios</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setFormData(createEmptyFormData());
          }}
          className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg hover:bg-primary/90 transition-colors"
          style={{ fontSize: 14 }}
        >
          <Plus size={18} /> Nuevo Servicio
        </button>
      </div>

      <div className="relative mb-6">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar mis servicios..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-white focus:border-primary outline-none"
          style={{ fontSize: 14 }}
        />
      </div>

      {showForm && (
        <ServiceForm
          isEditing={!!editingId}
          formData={formData}
          onFormChange={handleFormChange}
          onSubmit={handleSubmit}
          onCancel={closeForm}
          onImagesChange={handleImagesChange}
          categories={serviceCategories}
          initialImages={formImages}
        />
      )}

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: 13, fontWeight: 500 }}>Servicio</th>
                <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: 13, fontWeight: 500 }}>Precio</th>
                <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: 13, fontWeight: 500 }}>Disponibilidad</th>
                <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: 13, fontWeight: 500 }}>Ubicacion</th>
                <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: 13, fontWeight: 500 }}>Categoria</th>
                <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontSize: 13, fontWeight: 500 }}>Estado</th>
                <th className="text-right px-4 py-3 text-muted-foreground" style={{ fontSize: 13, fontWeight: 500 }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((service) => (
                <tr key={service.id} className="border-b border-border last:border-0 hover:bg-gray-50/50">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <img src={service.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                      <span className="truncate max-w-[200px]" style={{ fontSize: 14 }}>{service.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4" style={{ fontSize: 14 }}>${service.price.toFixed(2)}</td>
                  <td className="px-4 py-4 text-muted-foreground" style={{ fontSize: 14 }}>
                    {service.availability || "No definida"}
                  </td>
                  <td className="px-4 py-4 text-muted-foreground" style={{ fontSize: 14 }}>
                    {service.location || "No definida"}
                  </td>
                  <td className="px-4 py-4 text-muted-foreground" style={{ fontSize: 14 }}>
                    {categories.find((c) => c.id === service.category)?.name || service.category}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded ${service.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`} style={{ fontSize: 13 }}>
                      {service.active ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => handleEdit(service)} className="p-2 text-muted-foreground hover:text-primary rounded-lg hover:bg-primary/5">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => toggleActive(service.id)} className="p-2 text-muted-foreground hover:text-amber-600 rounded-lg hover:bg-amber-50">
                        {service.active ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <button
                        onClick={() => {
                          setSellerServices((prev) => prev.filter((s) => s.id !== service.id));
                          toast.success("Servicio eliminado");
                        }}
                        className="p-2 text-muted-foreground hover:text-red-600 rounded-lg hover:bg-red-50"
                      >
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
