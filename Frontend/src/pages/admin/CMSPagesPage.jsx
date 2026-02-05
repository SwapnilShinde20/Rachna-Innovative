import { useState } from 'react';
import { DashboardHeader } from '../../components/admin/dashboard/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/admin/ui/card';
import { Button } from '../../components/admin/ui/button';
import { Badge } from '../../components/admin/ui/badge';
import { Input } from '../../components/admin/ui/input';
import { Label } from '../../components/admin/ui/label';
import { Switch } from '../../components/admin/ui/switch';
import { Textarea } from '../../components/admin/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/admin/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../components/admin/ui/dialog';
import { mockCMSPages } from '../../data/mockData';
import {
  Plus,
  Pencil,
  Eye,
  EyeOff,
  FileText,
  Layout,
  GripVertical,
} from 'lucide-react';
import { format } from 'date-fns';

export default function CMSPagesPage() {
  const [pages, setPages] = useState(mockCMSPages);
  const [selectedPage, setSelectedPage] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editForm, setEditForm] = useState({});

  const stats = {
    total: pages.length,
    active: pages.filter((p) => p.isActive).length,
    sections: [...new Set(pages.map((p) => p.section))].length,
  };

  const groupedPages = pages.reduce((acc, page) => {
    if (!acc[page.section]) acc[page.section] = [];
    acc[page.section].push(page);
    return acc;
  }, {});

  const handleToggleActive = (pageId) => {
    setPages(
      pages.map((p) =>
        p.id === pageId
          ? { ...p, isActive: !p.isActive, updatedAt: new Date().toISOString() }
          : p
      )
    );
  };

  const handleEdit = (page) => {
    setSelectedPage(page);
    setEditForm(page);
    setIsCreating(false);
    setShowEditor(true);
  };

  const handleCreate = () => {
    setSelectedPage(null);
    setEditForm({
      title: '',
      slug: '',
      content: '',
      section: 'home',
      order: pages.length + 1,
      isActive: false,
    });
    setIsCreating(true);
    setShowEditor(true);
  };

  const handleSave = () => {
    if (isCreating) {
      const newPage = {
        id: `page-${Date.now()}`,
        title: editForm.title || '',
        slug: editForm.slug || '',
        content: editForm.content || '',
        seoTitle: editForm.seoTitle,
        seoDescription: editForm.seoDescription,
        section: editForm.section || 'home',
        order: editForm.order || 1,
        isActive: editForm.isActive || false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setPages([...pages, newPage]);
    } else if (selectedPage) {
      setPages(
        pages.map((p) =>
          p.id === selectedPage.id
            ? { ...p, ...editForm, updatedAt: new Date().toISOString() }
            : p
        )
      );
    }
    setShowEditor(false);
  };

  return (
    <div>
      <DashboardHeader
        title="CMS Pages"
        subtitle="Manage website sections and static pages"
      />
      <div className="p-6 space-y-6">

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Pages</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
              <Eye className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Pages</p>
              <p className="text-2xl font-bold">{stats.active}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-info/10 flex items-center justify-center">
              <Layout className="h-5 w-5 text-info" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Sections</p>
              <p className="text-2xl font-bold">{stats.sections}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action */}
      <div className="flex justify-end">
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Page
        </Button>
      </div>

      {/* Pages */}
      {Object.entries(groupedPages).map(([section, sectionPages]) => (
        <Card key={section}>
          <CardHeader>
            <CardTitle className="capitalize flex items-center gap-2">
              <Layout className="h-5 w-5" />
              {section} Section
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead />
                  <TableHead>Title</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sectionPages
                  .sort((a, b) => a.order - b.order)
                  .map((page) => (
                    <TableRow key={page.id}>
                      <TableCell>
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                      </TableCell>
                      <TableCell className="font-medium">
                        {page.title}
                      </TableCell>
                      <TableCell className="font-mono text-sm text-muted-foreground">
                        /{page.slug}
                      </TableCell>
                      <TableCell>
                        {page.isActive ? (
                          <Badge className="bg-success/10 text-success">
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {format(new Date(page.updatedAt), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(page)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleActive(page.id)}
                          >
                            {page.isActive ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}

      {/* Editor */}
      <Dialog open={showEditor} onOpenChange={setShowEditor}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isCreating ? 'Create Page' : 'Edit Page'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={editForm.title || ''}
                  onChange={(e) =>
                    setEditForm({ ...editForm, title: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Slug</Label>
                <Input
                  value={editForm.slug || ''}
                  onChange={(e) =>
                    setEditForm({ ...editForm, slug: e.target.value })
                  }
                />
              </div>
            </div>

            <Label>Content (HTML)</Label>
            <Textarea
              rows={6}
              className="font-mono"
              value={editForm.content || ''}
              onChange={(e) =>
                setEditForm({ ...editForm, content: e.target.value })
              }
            />

            <div className="flex items-center gap-2">
              <Switch
                checked={editForm.isActive || false}
                onCheckedChange={(checked) =>
                  setEditForm({ ...editForm, isActive: checked })
                }
              />
              <Label>Active</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditor(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {isCreating ? 'Create Page' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </div>
  );
}
