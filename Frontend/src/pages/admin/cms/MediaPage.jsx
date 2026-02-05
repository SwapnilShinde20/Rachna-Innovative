import { useState } from 'react';
import { DashboardHeader } from '../../../components/admin/dashboard/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/admin/ui/card';
import { Button } from '../../../components/admin/ui/button';
import { Input } from '../../../components/admin/ui/input';
import { Badge } from '../../../components/admin/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../../components/admin/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../components/admin/ui/dropdown-menu';
import {
  Image as ImageIcon,
  Upload,
  Search,
  Grid,
  List,
  MoreVertical,
  Trash2,
  Download,
  Copy,
  Eye,
  FileImage,
  Film,
  File,
} from 'lucide-react';

/* ---------------- MOCK DATA ---------------- */

const mockMedia = [
  {
    id: '1',
    name: 'hero-banner.jpg',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400',
    size: '2.4 MB',
    dimensions: '1920x1080',
    uploadedAt: '2024-01-15',
    usedIn: 3,
  },
  {
    id: '2',
    name: 'property-1.jpg',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400',
    size: '1.8 MB',
    dimensions: '1600x900',
    uploadedAt: '2024-01-18',
    usedIn: 5,
  },
  {
    id: '3',
    name: 'team-photo.jpg',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400',
    size: '3.2 MB',
    dimensions: '2400x1600',
    uploadedAt: '2024-02-01',
    usedIn: 2,
  },
  {
    id: '4',
    name: 'office-interior.jpg',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400',
    size: '2.1 MB',
    dimensions: '1920x1280',
    uploadedAt: '2024-02-10',
    usedIn: 1,
  },
  {
    id: '5',
    name: 'luxury-home.jpg',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400',
    size: '2.8 MB',
    dimensions: '2000x1333',
    uploadedAt: '2024-02-15',
    usedIn: 4,
  },
  {
    id: '6',
    name: 'apartment-view.jpg',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
    size: '1.5 MB',
    dimensions: '1600x1067',
    uploadedAt: '2024-03-01',
    usedIn: 2,
  },
  {
    id: '7',
    name: 'promo-video.mp4',
    type: 'video',
    url: '',
    size: '45.2 MB',
    uploadedAt: '2024-03-05',
    usedIn: 1,
  },
  {
    id: '8',
    name: 'brochure.pdf',
    type: 'document',
    url: '',
    size: '5.8 MB',
    uploadedAt: '2024-03-10',
    usedIn: 0,
  },
];

/* ---------------- COMPONENT ---------------- */

export default function MediaPage() {
  const [media, setMedia] = useState(mockMedia);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const filteredMedia = media.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id) => {
    setMedia((prev) => prev.filter((m) => m.id !== id));
  };

  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url);
  };

  const handlePreview = (item) => {
    setSelectedMedia(item);
    setIsPreviewOpen(true);
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'image':
        return <FileImage className="h-8 w-8 text-primary" />;
      case 'video':
        return <Film className="h-8 w-8 text-purple-500" />;
      default:
        return <File className="h-8 w-8 text-orange-500" />;
    }
  };

  const totalSize = media.reduce((acc, item) => acc + parseFloat(item.size), 0);

  return (
    <div>
      <DashboardHeader
          title="Media Library"
          subtitle="Manage uploaded files and images"
        />
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Upload Files
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="pt-4"><div className="text-2xl font-bold">{media.length}</div><p className="text-sm text-muted-foreground">Total Files</p></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-2xl font-bold">{media.filter(m => m.type === 'image').length}</div><p className="text-sm text-muted-foreground">Images</p></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-2xl font-bold">{media.filter(m => m.type === 'video').length}</div><p className="text-sm text-muted-foreground">Videos</p></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-2xl font-bold">{totalSize.toFixed(1)} MB</div><p className="text-sm text-muted-foreground">Total Size</p></CardContent></Card>
      </div>

      {/* Media List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" /> All Media
            </CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex border rounded-lg">
                <Button size="sm" variant={viewMode === 'grid' ? 'secondary' : 'ghost'} onClick={() => setViewMode('grid')}>
                  <Grid className="h-4 w-4" />
                </Button>
                <Button size="sm" variant={viewMode === 'list' ? 'secondary' : 'ghost'} onClick={() => setViewMode('list')}>
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredMedia.map((item) => (
                <div key={item.id} className="group relative border rounded-lg overflow-hidden hover:ring-2 hover:ring-primary">
                  {item.type === 'image' && item.url ? (
                    <img src={item.url} alt={item.name} className="w-full h-32 object-cover" />
                  ) : (
                    <div className="w-full h-32 bg-muted flex items-center justify-center">
                      {getFileIcon(item.type)}
                    </div>
                  )}
                  <div className="p-2">
                    <p className="text-xs font-medium truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.size}</p>
                  </div>
                  <div className="absolute top-2 right-2 hidden group-hover:block">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="secondary" className="h-7 w-7 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handlePreview(item)}><Eye className="h-4 w-4 mr-2" />Preview</DropdownMenuItem>
                        {item.url && <DropdownMenuItem onClick={() => handleCopyUrl(item.url)}><Copy className="h-4 w-4 mr-2" />Copy URL</DropdownMenuItem>}
                        <DropdownMenuItem><Download className="h-4 w-4 mr-2" />Download</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4 mr-2" />Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredMedia.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    {item.type === 'image' && item.url ? (
                      <img src={item.url} alt={item.name} className="w-12 h-12 object-cover rounded" />
                    ) : (
                      <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                        {getFileIcon(item.type)}
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.size} {item.dimensions && `• ${item.dimensions}`}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">{item.usedIn} uses</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedMedia?.name}</DialogTitle>
          </DialogHeader>

          {selectedMedia?.type === 'image' && selectedMedia?.url ? (
            <img src={selectedMedia.url} alt={selectedMedia.name} className="w-full max-h-[60vh] object-contain rounded-lg" />
          ) : (
            <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
              {getFileIcon(selectedMedia?.type)}
              <span className="ml-3 text-muted-foreground">Preview not available</span>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>Close</Button>
            {selectedMedia?.url && (
              <Button onClick={() => handleCopyUrl(selectedMedia.url)}>
                <Copy className="h-4 w-4 mr-2" /> Copy URL
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </div>
  );
}
