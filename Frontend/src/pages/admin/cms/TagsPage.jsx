import { useState } from 'react';
import { DashboardHeader } from '../../../components/admin/dashboard/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/admin/ui/card';
import { Button } from '../../../components/admin/ui/button';
import { Input } from '../../../components/admin/ui/input';
import { Label } from '../../../components/admin/ui/label';
import { Badge } from '../../../components/admin/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../../components/admin/ui/dialog';
import { Plus, Edit, Trash2, Tags } from 'lucide-react';

/* ---------------- MOCK DATA ---------------- */

const mockTags = [
  { id: '1', name: 'Buying', slug: 'buying', usageCount: 25, createdAt: '2024-01-10' },
  { id: '2', name: 'Selling', slug: 'selling', usageCount: 18, createdAt: '2024-01-12' },
  { id: '3', name: 'Renting', slug: 'renting', usageCount: 12, createdAt: '2024-01-15' },
  { id: '4', name: 'Investment', slug: 'investment', usageCount: 30, createdAt: '2024-01-20' },
  { id: '5', name: 'First-time Buyer', slug: 'first-time-buyer', usageCount: 15, createdAt: '2024-02-01' },
  { id: '6', name: 'Luxury', slug: 'luxury', usageCount: 8, createdAt: '2024-02-10' },
  { id: '7', name: 'Commercial', slug: 'commercial', usageCount: 10, createdAt: '2024-02-15' },
  { id: '8', name: 'Residential', slug: 'residential', usageCount: 35, createdAt: '2024-02-20' },
  { id: '9', name: 'Tips', slug: 'tips', usageCount: 22, createdAt: '2024-03-01' },
  { id: '10', name: 'Market Analysis', slug: 'market-analysis', usageCount: 14, createdAt: '2024-03-05' },
];

/* ---------------- COMPONENT ---------------- */

export default function TagsPage() {
  const [tags, setTags] = useState(mockTags);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const generateSlug = (value) => {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleAdd = () => {
    setEditingTag(null);
    setName('');
    setSlug('');
    setIsDialogOpen(true);
  };

  const handleEdit = (tag) => {
    setEditingTag(tag);
    setName(tag.name);
    setSlug(tag.slug);
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!name.trim()) return;

    if (editingTag) {
      setTags((prev) =>
        prev.map((t) =>
          t.id === editingTag.id ? { ...t, name, slug } : t
        )
      );
    } else {
      const newTag = {
        id: `tag-${Date.now()}`,
        name,
        slug,
        usageCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setTags((prev) => [...prev, newTag]);
    }

    setIsDialogOpen(false);
  };

  const handleDelete = (id) => {
    setTags((prev) => prev.filter((t) => t.id !== id));
  };

  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedTags = [...filteredTags].sort(
    (a, b) => b.usageCount - a.usageCount
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <DashboardHeader
          title="Blog Tags"
          subtitle="Manage blog post tags"
        />
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Tag
        </Button>
      </div>

      {/* Tags Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Tags className="h-5 w-5" />
              Tags ({tags.length})
            </CardTitle>
            <Input
              placeholder="Search tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex flex-wrap gap-3">
            {sortedTags.map((tag) => (
              <div
                key={tag.id}
                className="group flex items-center gap-2 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <Badge variant="secondary" className="text-sm">
                  {tag.name}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  ({tag.usageCount} posts)
                </span>

                <div className="hidden group-hover:flex items-center gap-1 ml-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={() => handleEdit(tag)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 text-destructive"
                    onClick={() => handleDelete(tag.id)}
                    disabled={tag.usageCount > 0}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {filteredTags.length === 0 && (
            <p className="text-center py-8 text-muted-foreground">
              No tags found
            </p>
          )}
        </CardContent>
      </Card>

      {/* Add / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingTag ? 'Edit Tag' : 'Add New Tag'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label>Tag Name</Label>
              <Input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!editingTag) {
                    setSlug(generateSlug(e.target.value));
                  }
                }}
                placeholder="Enter tag name"
              />
            </div>

            <div>
              <Label>Slug</Label>
              <Input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="tag-slug"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingTag ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
