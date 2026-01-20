import { useState } from 'react';
import { DashboardHeader } from '../../../components/admin/dashboard/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/admin/ui/card';
import { Button } from '../../../components/admin/ui/button';
import { Input } from '../../../components/admin/ui/input';
import { Textarea } from '../../../components/admin/ui/textarea';
import { Label } from '../../../components/admin/ui/label';
import { Switch } from '../../../components/admin/ui/switch';
import { Separator } from '../../../components/admin/ui/separator';
import { Badge } from '../../../components/admin/ui/badge';
import {
  Globe,
  Save,
  RefreshCw,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';

export default function SEOSettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  // Global SEO settings
  const [siteTitle, setSiteTitle] = useState('Rachna Innovative - Real Estate Platform');
  const [siteDescription, setSiteDescription] = useState('Find your dream property with Rachna Innovative. Browse thousands of listings for homes, apartments, and commercial properties.');
  const [siteKeywords, setSiteKeywords] = useState('real estate, property, homes, apartments, buy house, sell property');
  
  // OpenGraph
  const [ogImage, setOgImage] = useState('');
  const [ogTitle, setOgTitle] = useState('');
  const [ogDescription, setOgDescription] = useState('');
  
  // Robots & Indexing
  const [allowIndexing, setAllowIndexing] = useState(true);
  const [allowFollowing, setAllowFollowing] = useState(true);
  const [generateSitemap, setGenerateSitemap] = useState(true);
  
  // Additional settings
  const [canonicalUrl, setCanonicalUrl] = useState('https://rachna-innovative.vercel.app');
  const [googleVerification, setGoogleVerification] = useState('');
  const [bingVerification, setBingVerification] = useState('');

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    toast.success('SEO settings saved successfully');
  };

  const handleRegenerateSitemap = async () => {
    setIsRegenerating(true);
    // Simulate sitemap generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRegenerating(false);
    toast.success('Sitemap regenerated successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <DashboardHeader
          title="SEO Settings"
          subtitle="Configure global SEO and meta settings"
        />
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Global Meta Tags
              </CardTitle>
              <CardDescription>
                These settings apply to all pages unless overridden
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Site Title</Label>
                <Input
                  value={siteTitle}
                  onChange={(e) => setSiteTitle(e.target.value)}
                  placeholder="Your site title"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {siteTitle.length}/60 characters
                </p>
              </div>
              <div>
                <Label>Meta Description</Label>
                <Textarea
                  value={siteDescription}
                  onChange={(e) => setSiteDescription(e.target.value)}
                  placeholder="Describe your website"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {siteDescription.length}/160 characters
                </p>
              </div>
              <div>
                <Label>Keywords</Label>
                <Input
                  value={siteKeywords}
                  onChange={(e) => setSiteKeywords(e.target.value)}
                  placeholder="Comma-separated keywords"
                />
              </div>
              <div>
                <Label>Canonical URL</Label>
                <Input
                  value={canonicalUrl}
                  onChange={(e) => setCanonicalUrl(e.target.value)}
                  placeholder="https://yourdomain.com"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                OpenGraph Settings
              </CardTitle>
              <CardDescription>
                Settings for social media sharing previews
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>OG Image</Label>
                {ogImage ? (
                  <div className="relative mt-2">
                    <img
                      src={ogImage}
                      alt="OG Preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={() => setOgImage('')}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="mt-2 border-2 border-dashed rounded-lg p-6 text-center">
                    <ImageIcon className="h-8 w-8 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mt-2">
                      Recommended: 1200x630px
                    </p>
                    <Button variant="outline" size="sm" className="mt-3">
                      Upload Image
                    </Button>
                  </div>
                )}
              </div>
              <div>
                <Label>OG Title (optional)</Label>
                <Input
                  value={ogTitle}
                  onChange={(e) => setOgTitle(e.target.value)}
                  placeholder="Leave empty to use site title"
                />
              </div>
              <div>
                <Label>OG Description (optional)</Label>
                <Textarea
                  value={ogDescription}
                  onChange={(e) => setOgDescription(e.target.value)}
                  placeholder="Leave empty to use meta description"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Search Engine Verification</CardTitle>
              <CardDescription>
                Verify ownership with search engines
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Google Verification Code</Label>
                <Input
                  value={googleVerification}
                  onChange={(e) => setGoogleVerification(e.target.value)}
                  placeholder="google-site-verification=..."
                />
              </div>
              <div>
                <Label>Bing Verification Code</Label>
                <Input
                  value={bingVerification}
                  onChange={(e) => setBingVerification(e.target.value)}
                  placeholder="msvalidate.01=..."
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Robots & Indexing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Allow Indexing</Label>
                  <p className="text-xs text-muted-foreground">
                    Let search engines index your site
                  </p>
                </div>
                <Switch
                  checked={allowIndexing}
                  onCheckedChange={setAllowIndexing}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Allow Following</Label>
                  <p className="text-xs text-muted-foreground">
                    Let search engines follow links
                  </p>
                </div>
                <Switch
                  checked={allowFollowing}
                  onCheckedChange={setAllowFollowing}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-generate Sitemap</Label>
                  <p className="text-xs text-muted-foreground">
                    Automatically update sitemap
                  </p>
                </div>
                <Switch
                  checked={generateSitemap}
                  onCheckedChange={setGenerateSitemap}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sitemap</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  Active
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Last updated: Jan 10, 2024
                </span>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleRegenerateSitemap}
                disabled={isRegenerating}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRegenerating ? 'animate-spin' : ''}`} />
                {isRegenerating ? 'Regenerating...' : 'Regenerate Sitemap'}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                /sitemap.xml
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-500">85</div>
                <p className="text-sm text-muted-foreground mt-1">Good</p>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Meta title set</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Meta description set</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                  <span>OG image missing</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Sitemap active</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
