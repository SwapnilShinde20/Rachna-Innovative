import { useState } from 'react';
import { DashboardHeader } from '../../components/admin/dashboard/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/admin/ui/card';
import { Badge } from '../../components/admin/ui/badge';
import { Button } from '../../components/admin/ui/button';
import { Input } from '../../components/admin/ui/input';
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../components/admin/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/admin/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/admin/ui/tabs';
import { mockBlogPosts } from '../../data/mockData';
import {
  FileText,
  Plus,
  Edit,
  Eye,
  Trash2,
  Star,
  StarOff,
  CheckCircle,
  XCircle,
  Search,
  Image as ImageIcon,
  Globe,
} from 'lucide-react';
import { format } from 'date-fns';

const statusConfig = {
  draft: { label: 'Draft', variant: 'secondary' },
  pending_approval: { label: 'Pending', variant: 'outline' },
  published: { label: 'Published', variant: 'default' },
  archived: { label: 'Archived', variant: 'destructive' },
};

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Editor state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');

  const filteredPosts = mockBlogPosts.filter((post) => {
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.authorName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNewPost = () => {
    setSelectedPost(null);
    setTitle('');
    setSlug('');
    setContent('');
    setExcerpt('');
    setSeoTitle('');
    setSeoDescription('');
    setIsEditorOpen(true);
  };

  const handleEditPost = (post) => {
    setSelectedPost(post);
    setTitle(post.title);
    setSlug(post.slug);
    setContent(post.content);
    setExcerpt(post.excerpt || '');
    setSeoTitle(post.seoTitle || '');
    setSeoDescription(post.seoDescription || '');
    setIsEditorOpen(true);
  };

  const handlePreviewPost = (post) => {
    setSelectedPost(post);
    setIsPreviewOpen(true);
  };

  const handleSaveDraft = () => {
    console.log('Saving draft:', { title, slug, content, excerpt, seoTitle, seoDescription });
    setIsEditorOpen(false);
  };

  const handlePublish = () => {
    console.log('Publishing post:', { title, slug, content, excerpt, seoTitle, seoDescription });
    setIsEditorOpen(false);
  };

  const handleApprove = (post) => {
    console.log('Approving post:', post.id);
  };

  const handleReject = (post) => {
    console.log('Rejecting post:', post.id);
  };

  const handleToggleFeatured = (post) => {
    console.log('Toggling featured:', post.id);
  };

  const handleArchive = (post) => {
    console.log('Archiving post:', post.id);
  };

  const pendingPosts = mockBlogPosts.filter((p) => p.status === 'pending_approval');
  const publishedPosts = mockBlogPosts.filter((p) => p.status === 'published');
  const draftPosts = mockBlogPosts.filter((p) => p.status === 'draft');

  return (
   <div>
      <DashboardHeader title="Blog CMS" subtitle="Create and manage blog content" />
     <div className="p-6 space-y-6">

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{mockBlogPosts.length}</div>
            <p className="text-sm text-muted-foreground">Total Posts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-success">{publishedPosts.length}</div>
            <p className="text-sm text-muted-foreground">Published</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-warning">{pendingPosts.length}</div>
            <p className="text-sm text-muted-foreground">Pending Approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-muted-foreground">{draftPosts.length}</div>
            <p className="text-sm text-muted-foreground">Drafts</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs + Filters */}
      <Tabs defaultValue="all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <TabsList>
            <TabsTrigger value="all">All Posts</TabsTrigger>
            <TabsTrigger value="pending">Pending ({pendingPosts.length})</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v)}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending_approval">Pending</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={handleNewPost}>
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Button>
          </div>
        </div>

        {/* All Posts Table */}
        <TabsContent value="all" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPosts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No blog posts found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPosts.map((post) => (
                      <TableRow key={post.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{post.title}</p>
                            <p className="text-xs text-muted-foreground">/{post.slug}</p>
                          </div>
                        </TableCell>
                        <TableCell>{post.authorName}</TableCell>
                        <TableCell>
                          <Badge variant={statusConfig[post.status].variant}>
                            {statusConfig[post.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleToggleFeatured(post)}
                          >
                            {post.isFeatured ? (
                              <Star className="h-4 w-4 text-warning fill-warning" />
                            ) : (
                              <StarOff className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </TableCell>
                        <TableCell>{format(new Date(post.createdAt), 'MMM dd, yyyy')}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button size="sm" variant="ghost" onClick={() => handlePreviewPost(post)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleEditPost(post)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            {post.status === 'pending_approval' && (
                              <>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-success"
                                  onClick={() => handleApprove(post)}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-destructive"
                                  onClick={() => handleReject(post)}
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-muted-foreground"
                              onClick={() => handleArchive(post)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pending Tab */}
        <TabsContent value="pending" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Posts Awaiting Approval</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingPosts.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">
                  No posts pending approval
                </p>
              ) : (
                pendingPosts.map((post) => (
                  <div key={post.id} className="p-4 border rounded-lg mb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">{post.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          By {post.authorName} •{' '}
                          {format(new Date(post.createdAt), 'MMM dd, yyyy')}
                        </p>
                        {post.excerpt && (
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                            {post.excerpt}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePreviewPost(post)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Preview
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive"
                          onClick={() => handleReject(post)}
                        >
                          Reject
                        </Button>
                        <Button size="sm" onClick={() => handleApprove(post)}>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve & Publish
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Editor Dialog */}
      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedPost ? 'Edit Post' : 'Create New Post'}</DialogTitle>
            <DialogDescription>Write and publish blog content</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (!selectedPost) setSlug(generateSlug(e.target.value));
                  }}
                  placeholder="Enter post title"
                />
              </div>

              <div className="col-span-2">
                <label className="text-sm font-medium">Slug</label>
                <div className="flex items-center">
                  <span className="text-sm text-muted-foreground mr-2">/blog/</span>
                  <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="post-url-slug" />
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Featured Image</label>
              <div className="mt-2 border-2 border-dashed rounded-lg p-8 text-center">
                <ImageIcon className="h-8 w-8 mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground mt-2">Click or drag to upload</p>
                <Button variant="outline" size="sm" className="mt-3">
                  Upload Image
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Content</label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your post content here..."
                rows={12}
                className="font-mono"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Excerpt</label>
              <Textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Brief description for previews..."
                rows={2}
              />
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-4 flex items-center gap-2">
                <Globe className="h-4 w-4" />
                SEO Settings
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">SEO Title</label>
                  <Input
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    placeholder="Meta title for search engines"
                  />
                  <p className="text-xs text-muted-foreground mt-1">{seoTitle.length}/60 characters</p>
                </div>
                <div>
                  <label className="text-sm font-medium">SEO Description</label>
                  <Textarea
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    placeholder="Meta description for search engines"
                    rows={2}
                  />
                  <p className="text-xs text-muted-foreground mt-1">{seoDescription.length}/160 characters</p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditorOpen(false)}>Cancel</Button>
            <Button variant="outline" onClick={handleSaveDraft}>
              <FileText className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button onClick={handlePublish}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Publish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Preview</DialogTitle>
          </DialogHeader>
          {selectedPost && (
            <div className="prose prose-sm max-w-none">
              {selectedPost.featuredImage && (
                <img
                  src={selectedPost.featuredImage}
                  alt={selectedPost.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
              )}
              <h1 className="text-2xl font-bold mt-4">{selectedPost.title}</h1>
              <p className="text-sm text-muted-foreground">
                By {selectedPost.authorName} • {format(new Date(selectedPost.createdAt), 'MMMM dd, yyyy')}
              </p>
              <div dangerouslySetInnerHTML={{ __html: selectedPost.content }} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
   </div>
  );
}
