import { useState } from "react";
import { DashboardHeader } from "../../../components/admin/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/admin/ui/card";
import { Button } from "../../../components/admin/ui/button";
import { Input } from "../../../components/admin/ui/input";
import { Label } from "../../../components/admin/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/admin/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../components/admin/ui/dialog";
import { Plus, Edit, Trash2, FolderOpen } from "lucide-react";

/* ---------------- MOCK DATA ---------------- */

const mockCategories = [
  {
    id: "1",
    name: "Real Estate Tips",
    slug: "real-estate-tips",
    description: "Tips for buying and selling property",
    postCount: 12,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Market Trends",
    slug: "market-trends",
    description: "Latest market analysis and trends",
    postCount: 8,
    createdAt: "2024-02-10",
  },
  {
    id: "3",
    name: "Investment",
    slug: "investment",
    description: "Property investment strategies",
    postCount: 5,
    createdAt: "2024-03-05",
  },
  {
    id: "4",
    name: "Home Improvement",
    slug: "home-improvement",
    description: "DIY and renovation guides",
    postCount: 15,
    createdAt: "2024-01-20",
  },
  {
    id: "5",
    name: "Neighborhood Guides",
    slug: "neighborhood-guides",
    description: "Area and locality insights",
    postCount: 20,
    createdAt: "2024-02-28",
  },
];

/* ---------------- COMPONENT ---------------- */

export default function CategoriesPage() {
  const [categories, setCategories] = useState(mockCategories);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");

  const generateSlug = (value) =>
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const handleAdd = () => {
    setEditingCategory(null);
    setName("");
    setSlug("");
    setDescription("");
    setIsDialogOpen(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setName(category.name);
    setSlug(category.slug);
    setDescription(category.description);
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!name.trim()) return;

    if (editingCategory) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingCategory.id
            ? { ...c, name, slug, description }
            : c
        )
      );
    } else {
      setCategories((prev) => [
        ...prev,
        {
          id: `cat-${Date.now()}`,
          name,
          slug,
          description,
          postCount: 0,
          createdAt: new Date().toISOString().split("T")[0],
        },
      ]);
    }

    setIsDialogOpen(false);
  };

  const handleDelete = (id) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <DashboardHeader
          title="Blog Categories"
          subtitle="Manage blog post categories"
        />
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            Categories ({categories.length})
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Posts</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">
                    {category.name}
                  </TableCell>

                  <TableCell className="text-muted-foreground">
                    /{category.slug}
                  </TableCell>

                  <TableCell className="max-w-xs truncate">
                    {category.description}
                  </TableCell>

                  <TableCell>{category.postCount}</TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(category)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => handleDelete(category.id)}
                        disabled={category.postCount > 0}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* -------- DIALOG -------- */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Edit Category" : "Add New Category"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label>Category Name</Label>
              <Input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!editingCategory) {
                    setSlug(generateSlug(e.target.value));
                  }
                }}
                placeholder="Enter category name"
              />
            </div>

            <div>
              <Label>Slug</Label>
              <Input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="category-slug"
              />
            </div>

            <div>
              <Label>Description</Label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingCategory ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
