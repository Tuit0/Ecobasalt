"use client";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import { api, fetcher, uploadFile } from "@/lib/api";
import AuthLayout from "@/components/AuthLayout";
import { Plus, Edit2, Trash2, X, Save, Upload, Image as ImageIcon } from "lucide-react";

type Category = {
  id: number;
  slug: string;
  name_uz: string;
  name_ru: string;
  name_en: string;
  icon: string;
  order: number;
};

type Product = {
  id: number;
  category_id: number;
  slug: string;
  name_uz: string;
  name_ru: string;
  name_en: string;
  description_uz: string;
  description_ru: string;
  description_en: string;
  short_uz: string;
  short_ru: string;
  short_en: string;
  cover_image: string;
  gallery: string[];
  specs: Record<string, string>;
  price_from: number | null;
  price_currency: string;
  is_featured: boolean;
  is_active: boolean;
  order: number;
};

const EMPTY_PRODUCT: Partial<Product> = {
  slug: "",
  category_id: 0,
  name_uz: "",
  name_ru: "",
  name_en: "",
  description_uz: "",
  description_ru: "",
  description_en: "",
  short_uz: "",
  short_ru: "",
  short_en: "",
  cover_image: "",
  gallery: [],
  specs: {},
  price_from: null,
  price_currency: "USD",
  is_featured: false,
  is_active: true,
  order: 0,
};

export default function ProductsPage() {
  const { data: categories = [] } = useSWR<Category[]>("/products/categories", fetcher);
  const { data: products = [] } = useSWR<Product[]>("/products/admin/all", fetcher);
  const [editing, setEditing] = useState<Partial<Product> | null>(null);
  const [editingCat, setEditingCat] = useState<Partial<Category> | null>(null);
  const [tab, setTab] = useState<"products" | "categories">("products");

  async function saveProduct() {
    if (!editing) return;
    const isNew = !editing.id;
    const payload = {
      ...editing,
      specs: editing.specs || {},
      gallery: editing.gallery || [],
    };
    if (isNew) await api("/products", { method: "POST", body: JSON.stringify(payload) });
    else await api(`/products/${editing.id}`, { method: "PATCH", body: JSON.stringify(payload) });
    setEditing(null);
    mutate("/products/admin/all");
  }

  async function deleteProduct(id: number) {
    if (!confirm("Mahsulotni o'chirishni tasdiqlaysizmi?")) return;
    await api(`/products/${id}`, { method: "DELETE" });
    mutate("/products/admin/all");
  }

  async function saveCategory() {
    if (!editingCat) return;
    const isNew = !editingCat.id;
    if (isNew) await api("/products/categories", { method: "POST", body: JSON.stringify(editingCat) });
    else await api(`/products/categories/${editingCat.id}`, { method: "PATCH", body: JSON.stringify(editingCat) });
    setEditingCat(null);
    mutate("/products/categories");
  }

  async function deleteCategory(id: number) {
    if (!confirm("Kategoriyani o'chirishni tasdiqlaysizmi?")) return;
    await api(`/products/categories/${id}`, { method: "DELETE" });
    mutate("/products/categories");
  }

  return (
    <AuthLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Mahsulotlar</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setTab("products")}
              className={`btn ${tab === "products" ? "btn-primary" : "btn-ghost"}`}
            >
              Mahsulotlar
            </button>
            <button
              onClick={() => setTab("categories")}
              className={`btn ${tab === "categories" ? "btn-primary" : "btn-ghost"}`}
            >
              Kategoriyalar
            </button>
          </div>
        </div>

        {tab === "products" && (
          <>
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setEditing({ ...EMPTY_PRODUCT, category_id: categories[0]?.id || 0 })}
                className="btn btn-primary"
              >
                <Plus className="w-4 h-4" /> Yangi mahsulot
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((p) => {
                const cat = categories.find((c) => c.id === p.category_id);
                return (
                  <div key={p.id} className="card overflow-hidden">
                    {p.cover_image ? (
                      <img src={p.cover_image} alt={p.name_uz} className="w-full h-40 object-cover" />
                    ) : (
                      <div className="w-full h-40 bg-zinc-800 flex items-center justify-center text-zinc-500">
                        <ImageIcon className="w-12 h-12" />
                      </div>
                    )}
                    <div className="p-4">
                      <div className="text-xs text-orange-500 mb-1">{cat?.name_uz}</div>
                      <h3 className="font-semibold text-lg mb-1">{p.name_uz}</h3>
                      <p className="text-sm text-zinc-400 line-clamp-2 mb-3">{p.short_uz}</p>
                      <div className="flex items-center gap-2 mb-3">
                        {p.is_featured && (
                          <span className="text-xs px-2 py-0.5 rounded bg-orange-500/20 text-orange-400">
                            Tavsiya
                          </span>
                        )}
                        <span
                          className={`text-xs px-2 py-0.5 rounded ${
                            p.is_active ? "bg-green-500/20 text-green-400" : "bg-zinc-700 text-zinc-400"
                          }`}
                        >
                          {p.is_active ? "Faol" : "Nofaol"}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setEditing(p)} className="btn btn-ghost text-sm flex-1">
                          <Edit2 className="w-3 h-3" /> Tahrirlash
                        </button>
                        <button
                          onClick={() => deleteProduct(p.id)}
                          className="btn btn-ghost text-sm text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {tab === "categories" && (
          <>
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setEditingCat({ slug: "", name_uz: "", name_ru: "", name_en: "", icon: "", order: 0 })}
                className="btn btn-primary"
              >
                <Plus className="w-4 h-4" /> Yangi kategoriya
              </button>
            </div>
            <div className="card overflow-hidden">
              <table className="w-full">
                <thead className="bg-zinc-900 text-left text-sm text-zinc-400">
                  <tr>
                    <th className="px-4 py-3">Slug</th>
                    <th className="px-4 py-3">UZ</th>
                    <th className="px-4 py-3">RU</th>
                    <th className="px-4 py-3">EN</th>
                    <th className="px-4 py-3">Tartib</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {categories.map((c) => (
                    <tr key={c.id} className="hover:bg-zinc-900/50">
                      <td className="px-4 py-3 font-mono text-xs text-orange-400">{c.slug}</td>
                      <td className="px-4 py-3">{c.name_uz}</td>
                      <td className="px-4 py-3">{c.name_ru}</td>
                      <td className="px-4 py-3">{c.name_en}</td>
                      <td className="px-4 py-3 text-zinc-400">{c.order}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => setEditingCat(c)} className="text-blue-400 hover:text-blue-300">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => deleteCategory(c.id)} className="text-red-400 hover:text-red-300">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {editing && (
          <ProductEditModal
            value={editing}
            onChange={setEditing}
            onSave={saveProduct}
            onClose={() => setEditing(null)}
            categories={categories}
          />
        )}

        {editingCat && (
          <CategoryEditModal
            value={editingCat}
            onChange={setEditingCat}
            onSave={saveCategory}
            onClose={() => setEditingCat(null)}
          />
        )}
      </div>
    </AuthLayout>
  );
}

function ProductEditModal({
  value,
  onChange,
  onSave,
  onClose,
  categories,
}: {
  value: Partial<Product>;
  onChange: (v: Partial<Product>) => void;
  onSave: () => void;
  onClose: () => void;
  categories: Category[];
}) {
  const [uploading, setUploading] = useState(false);
  const [lang, setLang] = useState<"uz" | "ru" | "en">("uz");

  async function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadFile(file);
      onChange({ ...value, cover_image: res.url });
    } catch (err) {
      alert("Yuklashda xatolik: " + (err as Error).message);
    }
    setUploading(false);
  }

  const specsArr = Object.entries(value.specs || {});

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="card max-w-3xl w-full my-8">
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <h2 className="text-xl font-semibold">{value.id ? "Tahrirlash" : "Yangi mahsulot"}</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-zinc-400 mb-1 block">Slug</label>
              <input
                className="input"
                value={value.slug || ""}
                onChange={(e) => onChange({ ...value, slug: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm text-zinc-400 mb-1 block">Kategoriya</label>
              <select
                className="input"
                value={value.category_id || 0}
                onChange={(e) => onChange({ ...value, category_id: parseInt(e.target.value) })}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name_uz}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-1 border-b border-zinc-800">
            {(["uz", "ru", "en"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-3 py-1.5 text-xs uppercase ${
                  lang === l ? "text-orange-400 border-b-2 border-orange-500" : "text-zinc-500"
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          <div>
            <label className="text-sm text-zinc-400 mb-1 block">Nomi ({lang})</label>
            <input
              className="input"
              value={(value as any)[`name_${lang}`] || ""}
              onChange={(e) => onChange({ ...value, [`name_${lang}`]: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm text-zinc-400 mb-1 block">Qisqa tavsif ({lang})</label>
            <textarea
              className="input"
              rows={2}
              value={(value as any)[`short_${lang}`] || ""}
              onChange={(e) => onChange({ ...value, [`short_${lang}`]: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm text-zinc-400 mb-1 block">To'liq tavsif ({lang})</label>
            <textarea
              className="input"
              rows={4}
              value={(value as any)[`description_${lang}`] || ""}
              onChange={(e) => onChange({ ...value, [`description_${lang}`]: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm text-zinc-400 mb-2 block">Rasm</label>
            <div className="flex items-center gap-3">
              {value.cover_image && <img src={value.cover_image} alt="" className="w-24 h-24 object-cover rounded" />}
              <label className="btn btn-ghost cursor-pointer">
                <Upload className="w-4 h-4" />
                {uploading ? "Yuklanmoqda..." : "Rasm yuklash"}
                <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
              </label>
              {value.cover_image && (
                <button
                  onClick={() => onChange({ ...value, cover_image: "" })}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm text-zinc-400 mb-2 block">Texnik xususiyatlar</label>
            <div className="space-y-2">
              {specsArr.map(([k, v], i) => (
                <div key={i} className="flex gap-2">
                  <input
                    className="input flex-1"
                    placeholder="Kalit"
                    value={k}
                    onChange={(e) => {
                      const newSpecs = { ...value.specs };
                      delete newSpecs[k];
                      newSpecs[e.target.value] = v;
                      onChange({ ...value, specs: newSpecs });
                    }}
                  />
                  <input
                    className="input flex-1"
                    placeholder="Qiymat"
                    value={v}
                    onChange={(e) => onChange({ ...value, specs: { ...value.specs, [k]: e.target.value } })}
                  />
                  <button
                    onClick={() => {
                      const newSpecs = { ...value.specs };
                      delete newSpecs[k];
                      onChange({ ...value, specs: newSpecs });
                    }}
                    className="text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => onChange({ ...value, specs: { ...value.specs, "": "" } })}
                className="btn btn-ghost text-xs"
              >
                <Plus className="w-3 h-3" /> Qatorr qo'shish
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-zinc-400 mb-1 block">Boshlang'ich narx</label>
              <input
                type="number"
                className="input"
                value={value.price_from || ""}
                onChange={(e) =>
                  onChange({ ...value, price_from: e.target.value ? parseFloat(e.target.value) : null })
                }
              />
            </div>
            <div>
              <label className="text-sm text-zinc-400 mb-1 block">O'lchov</label>
              <input
                className="input"
                value={value.price_currency || ""}
                onChange={(e) => onChange({ ...value, price_currency: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm text-zinc-400 mb-1 block">Tartib</label>
              <input
                type="number"
                className="input"
                value={value.order || 0}
                onChange={(e) => onChange({ ...value, order: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!value.is_featured}
                onChange={(e) => onChange({ ...value, is_featured: e.target.checked })}
              />
              <span className="text-sm">Tavsiya etilgan</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!value.is_active}
                onChange={(e) => onChange({ ...value, is_active: e.target.checked })}
              />
              <span className="text-sm">Faol</span>
            </label>
          </div>
        </div>
        <div className="flex justify-end gap-2 p-6 border-t border-zinc-800">
          <button onClick={onClose} className="btn btn-ghost">
            Bekor qilish
          </button>
          <button onClick={onSave} className="btn btn-primary">
            <Save className="w-4 h-4" /> Saqlash
          </button>
        </div>
      </div>
    </div>
  );
}

function CategoryEditModal({
  value,
  onChange,
  onSave,
  onClose,
}: {
  value: Partial<Category>;
  onChange: (v: Partial<Category>) => void;
  onSave: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="card max-w-lg w-full">
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <h2 className="text-xl font-semibold">{value.id ? "Kategoriyani tahrirlash" : "Yangi kategoriya"}</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm text-zinc-400 mb-1 block">Slug</label>
            <input className="input" value={value.slug || ""} onChange={(e) => onChange({ ...value, slug: e.target.value })} />
          </div>
          <div>
            <label className="text-sm text-zinc-400 mb-1 block">Nomi (UZ)</label>
            <input className="input" value={value.name_uz || ""} onChange={(e) => onChange({ ...value, name_uz: e.target.value })} />
          </div>
          <div>
            <label className="text-sm text-zinc-400 mb-1 block">Nomi (RU)</label>
            <input className="input" value={value.name_ru || ""} onChange={(e) => onChange({ ...value, name_ru: e.target.value })} />
          </div>
          <div>
            <label className="text-sm text-zinc-400 mb-1 block">Nomi (EN)</label>
            <input className="input" value={value.name_en || ""} onChange={(e) => onChange({ ...value, name_en: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-zinc-400 mb-1 block">Ikonka</label>
              <input className="input" value={value.icon || ""} onChange={(e) => onChange({ ...value, icon: e.target.value })} />
            </div>
            <div>
              <label className="text-sm text-zinc-400 mb-1 block">Tartib</label>
              <input
                type="number"
                className="input"
                value={value.order || 0}
                onChange={(e) => onChange({ ...value, order: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 p-6 border-t border-zinc-800">
          <button onClick={onClose} className="btn btn-ghost">
            Bekor qilish
          </button>
          <button onClick={onSave} className="btn btn-primary">
            <Save className="w-4 h-4" /> Saqlash
          </button>
        </div>
      </div>
    </div>
  );
}
