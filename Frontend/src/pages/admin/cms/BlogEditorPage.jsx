import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DashboardHeader } from '../../../components/admin/dashboard/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/admin/ui/card';
import { Button } from '../../../components/admin/ui/button';
import { Input } from '../../../components/admin/ui/input';
import { Textarea } from '../../../components/admin/ui/textarea';
import { Label } from '../../../components/admin/ui/label';
import { Badge } from '../../../components/admin/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/admin/ui/select';
import { mockBlogPosts } from '../../../data/mockData';
import { ArrowLeft, Save, Eye, Globe, Image as ImageIcon, X } from 'lucide-react';

const mockCategories = [
  { id: '1', name: 'Real Estate Tips', slug: 'real-estate-tips' },
  { id: '2', name: 'Market Trends', slug: 'market-trends' },
  { id: '3', name: 'Investment', slug: 'investment' },
  { id: '4', name: 'Home Improvement', slug: 'home-improvement' },
];

const mockTags = [
  { id: '1', name: 'Buying', slug: 'buying' },
  { id: '2', name: 'Selling', slug: 'selling' },
  { id: '3', name: 'Renting', slug: 'renting' },
  { id: '4', name: 'Investment', slug: 'investment' },
  { id: '5', name: 'First-time Buyer', slug: 'first-time-buyer' },
];

export default function BlogEditorPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isNew = id === 'new' || !id;

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [status, setStatus] = useState('draft'); // <- JS only
  const [category, setCategory] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');

  useEffect(() => {
    if (!isNew && id) {
      const post = mockBlogPosts.find(p => p.id === id);
      if (post) {
        setTitle(post.title);
        setSlug(post.slug);
        setContent(post.content);
        setExcerpt(post.excerpt || '');
        setStatus(post.status === 'pending_approval' ? 'draft' : post.status);
        setSeoTitle(post.seoTitle || '');
        setSeoDescription(post.seoDescription || '');
        setFeaturedImage(post.featuredImage || '');
      }
    }
  }, [id, isNew]);

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const toggleTag = (tagId) => {
    setSelectedTags(prev =>
      prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId]
    );
  };

  const handleSave = (publish) => {
    const postData = {
      title,
      slug,
      content,
      excerpt,
      status: publish ? 'published' : status,
      category,
      tags: selectedTags,
      seoTitle,
      seoDescription,
      featuredImage,
    };
    console.log('Saving post:', postData);
    navigate('/admin/cms/blogs');
  };

  return (
     <div>
      <DashboardHeader
            title={isNew ? 'Create New Post' : 'Edit Post'}
            subtitle="Write and manage blog content"
          />
    <div className="p-6 space-y-6">
       
      <div className="flex items-center justify-between">
        <div className="flex items-center w-full">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/cms/blogs')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
        
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
              <CardTitle>Post Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Post Title</Label>
                <Input
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (isNew) setSlug(generateSlug(e.target.value));
                  }}
                  placeholder="Enter post title"
                />
              </div>
              <div>
                <Label>Slug</Label>
                <div className="flex items-center">
                  <span className="text-sm text-muted-foreground mr-2">/blog/</span>
                  <Input
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="post-url-slug"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Featured Image</CardTitle>
            </CardHeader>
            <CardContent>
              {featuredImage ? (
                <div className="relative">
                  <img
                    src={featuredImage}
                    alt="Featured"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2"
                    onClick={() => setFeaturedImage('')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <ImageIcon className="h-8 w-8 mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mt-2">Click or drag to upload</p>
                  <Button variant="outline" size="sm" className="mt-3">
                    Upload Image
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your post content here... (Supports Markdown)"
                rows={16}
                className="font-mono"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Excerpt</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Brief description for previews and search results..."
                rows={3}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Post Settings</CardTitle>
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
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCategories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {mockTags.map(tag => (
                  <Badge
                    key={tag.id}
                    variant={selectedTags.includes(tag.id) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleTag(tag.id)}
                  >
                    {tag.name}
                  </Badge>
                ))}
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
                <Input
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="Meta title"
                />
                <p className="text-xs text-muted-foreground mt-1">{seoTitle.length}/60</p>
              </div>
              <div>
                <Label>Meta Description</Label>
                <Textarea
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  placeholder="Meta description"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground mt-1">{seoDescription.length}/160</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
     </div>
  );
}
