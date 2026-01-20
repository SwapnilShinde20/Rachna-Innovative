import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DashboardHeader } from '../../../components/admin/dashboard/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/admin/ui/card';
import { Button } from '../../../components/admin/ui/button';
import { Input } from '../../../components/admin/ui/input';
import { Textarea } from '../../../components/admin/ui/textarea';
import { Label } from '../../../components/admin/ui/label';
import { Switch } from '../../../components/admin/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/admin/ui/select';
import { mockCMSPages } from '../../../data/mockData';
import { ArrowLeft, Save, Eye, Globe, Plus, Trash2, GripVertical } from 'lucide-react';

export default function PageEditorPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isNew = id === 'new' || !id;

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [status, setStatus] = useState('draft');
  const [isVisible, setIsVisible] = useState(true);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [contentBlocks, setContentBlocks] = useState([]);

  useEffect(() => {
    if (!isNew && id) {
      const page = mockCMSPages.find(p => p.id === id);
      if (page) {
        setTitle(page.title);
        setSlug(page.slug);
        setStatus(page.isActive ? 'published' : 'draft');
        setIsVisible(page.isActive);
        setSeoTitle(page.seoTitle || '');
        setSeoDescription(page.seoDescription || '');
      }
    }
  }, [id, isNew]);

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const addBlock = (type) => {
    const newBlock = {
      id: `block-${Date.now()}`,
      type,
      content: {},
    };
    setContentBlocks([...contentBlocks, newBlock]);
  };

  const removeBlock = (blockId) => {
    setContentBlocks(contentBlocks.filter(b => b.id !== blockId));
  };

  const handleSave = (publish) => {
    const pageData = {
      title,
      slug,
      status: publish ? 'published' : 'draft',
      isVisible,
      seoTitle,
      seoDescription,
      contentBlocks,
    };
    console.log('Saving page:', pageData);
    navigate('/admin/cms/pages');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/cms/pages')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <DashboardHeader
            title={isNew ? 'Create New Page' : 'Edit Page'}
            subtitle="Manage page content and SEO settings"
          />
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => handleSave(false)}>
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button onClick={() => handleSave(true)}>
            <Eye className="h-4 w-4 mr-2" />
            Publish
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Page Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Page Title</Label>
                <Input
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (isNew) setSlug(generateSlug(e.target.value));
                  }}
                  placeholder="Enter page title"
                />
              </div>
              <div>
                <Label>Slug</Label>
                <div className="flex items-center">
                  <span className="text-sm text-muted-foreground mr-2">/</span>
                  <Input
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="page-url-slug"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Content Blocks</CardTitle>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => addBlock('hero')}>
                  <Plus className="h-4 w-4 mr-1" /> Hero
                </Button>
                <Button size="sm" variant="outline" onClick={() => addBlock('text')}>
                  <Plus className="h-4 w-4 mr-1" /> Text
                </Button>
                <Button size="sm" variant="outline" onClick={() => addBlock('cta')}>
                  <Plus className="h-4 w-4 mr-1" /> CTA
                </Button>
                <Button size="sm" variant="outline" onClick={() => addBlock('features')}>
                  <Plus className="h-4 w-4 mr-1" /> Features
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {contentBlocks.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                  <p className="text-muted-foreground">No content blocks added yet</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Click the buttons above to add sections
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {contentBlocks.map((block) => (
                    <div key={block.id} className="p-4 border rounded-lg flex items-start gap-3">
                      <GripVertical className="h-5 w-5 text-muted-foreground cursor-move mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-medium capitalize">{block.type} Block</span>
                          <Button size="sm" variant="ghost" className="text-destructive" onClick={() => removeBlock(block.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        {block.type === 'hero' && (
                          <div className="space-y-3">
                            <Input placeholder="Hero Title" />
                            <Textarea placeholder="Hero Subtitle" rows={2} />
                            <Input placeholder="Button Text" />
                          </div>
                        )}
                        {block.type === 'text' && (
                          <Textarea placeholder="Enter text content..." rows={4} />
                        )}
                        {block.type === 'cta' && (
                          <div className="space-y-3">
                            <Input placeholder="CTA Heading" />
                            <Input placeholder="Button Text" />
                            <Input placeholder="Button Link" />
                          </div>
                        )}
                        {block.type === 'features' && (
                          <div className="space-y-3">
                            <Input placeholder="Section Title" />
                            <Textarea placeholder="Feature items (one per line)" rows={4} />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Page Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Status</Label>
                <Select value={status} onValueChange={(v) => setStatus(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label>Page Visibility</Label>
                <Switch checked={isVisible} onCheckedChange={setIsVisible} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                SEO Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>SEO Title</Label>
                <Input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} placeholder="Meta title" />
                <p className="text-xs text-muted-foreground mt-1">{seoTitle.length}/60</p>
              </div>
              <div>
                <Label>Meta Description</Label>
                <Textarea value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} placeholder="Meta description" rows={3} />
                <p className="text-xs text-muted-foreground mt-1">{seoDescription.length}/160</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
