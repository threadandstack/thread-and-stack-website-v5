import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Upload, X, Save, ArrowLeft, LogOut, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PageSeo {
  id: string;
  page_path: string;
  page_title: string | null;
  meta_description: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image_path: string | null;
  twitter_title: string | null;
  twitter_description: string | null;
  twitter_image_path: string | null;
  canonical_url: string | null;
  keywords: string[] | null;
  no_index: boolean;
  no_follow: boolean;
  created_at: string;
  updated_at: string;
}

const emptyFormData: Omit<PageSeo, 'id' | 'created_at' | 'updated_at'> = {
  page_path: "",
  page_title: "",
  meta_description: "",
  og_title: "",
  og_description: "",
  og_image_path: "",
  twitter_title: "",
  twitter_description: "",
  twitter_image_path: "",
  canonical_url: "",
  keywords: [],
  no_index: false,
  no_follow: false,
};

const SeoAdminPage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, isAdmin, signOut } = useAdminAuth();
  const [entries, setEntries] = useState<PageSeo[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<PageSeo | null>(null);
  const [formData, setFormData] = useState(emptyFormData);
  const [keywordsInput, setKeywordsInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadType, setUploadType] = useState<'og' | 'twitter'>('og');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/admin/login");
    } else if (!authLoading && user && !isAdmin) {
      toast.error("You don't have admin access");
      signOut();
      navigate("/admin/login");
    }
  }, [authLoading, user, isAdmin, navigate, signOut]);

  useEffect(() => {
    if (isAdmin) {
      fetchEntries();
    }
  }, [isAdmin]);

  const fetchEntries = async () => {
    const { data, error } = await supabase
      .from('page_seo')
      .select('*')
      .order('page_path');
    
    if (error) {
      toast.error("Failed to fetch SEO entries");
      console.error(error);
    } else {
      setEntries(data || []);
    }
    setLoading(false);
  };

  const openCreateDialog = () => {
    setEditingEntry(null);
    setFormData(emptyFormData);
    setKeywordsInput("");
    setDialogOpen(true);
  };

  const openEditDialog = (entry: PageSeo) => {
    setEditingEntry(entry);
    setFormData({
      page_path: entry.page_path,
      page_title: entry.page_title || "",
      meta_description: entry.meta_description || "",
      og_title: entry.og_title || "",
      og_description: entry.og_description || "",
      og_image_path: entry.og_image_path || "",
      twitter_title: entry.twitter_title || "",
      twitter_description: entry.twitter_description || "",
      twitter_image_path: entry.twitter_image_path || "",
      canonical_url: entry.canonical_url || "",
      keywords: entry.keywords || [],
      no_index: entry.no_index,
      no_follow: entry.no_follow,
    });
    setKeywordsInput((entry.keywords || []).join(", "));
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.page_path.trim()) {
      toast.error("Page path is required");
      return;
    }

    const dataToSave = {
      ...formData,
      page_path: formData.page_path.trim(),
      page_title: formData.page_title || null,
      meta_description: formData.meta_description || null,
      og_title: formData.og_title || null,
      og_description: formData.og_description || null,
      og_image_path: formData.og_image_path || null,
      twitter_title: formData.twitter_title || null,
      twitter_description: formData.twitter_description || null,
      twitter_image_path: formData.twitter_image_path || null,
      canonical_url: formData.canonical_url || null,
      keywords: keywordsInput.trim() 
        ? keywordsInput.split(",").map(k => k.trim()).filter(Boolean)
        : null,
    };

    if (editingEntry) {
      const { error } = await supabase
        .from('page_seo')
        .update(dataToSave)
        .eq('id', editingEntry.id);

      if (error) {
        toast.error("Failed to update entry");
        console.error(error);
      } else {
        toast.success("Entry updated");
        setDialogOpen(false);
        fetchEntries();
      }
    } else {
      const { error } = await supabase
        .from('page_seo')
        .insert(dataToSave);

      if (error) {
        if (error.code === '23505') {
          toast.error("A page with this path already exists");
        } else {
          toast.error("Failed to create entry");
          console.error(error);
        }
      } else {
        toast.success("Entry created");
        setDialogOpen(false);
        fetchEntries();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;

    const { error } = await supabase
      .from('page_seo')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error("Failed to delete entry");
      console.error(error);
    } else {
      toast.success("Entry deleted");
      fetchEntries();
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'og' | 'twitter') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }

    setUploading(true);
    setUploadType(type);

    const fileExt = file.name.split('.').pop();
    const fileName = `${formData.page_path.replace(/\//g, '-').replace(/^-/, '')}-${type}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('og-images')
      .upload(fileName, file);

    if (uploadError) {
      toast.error("Failed to upload image");
      console.error(uploadError);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from('og-images')
      .getPublicUrl(fileName);

    if (type === 'og') {
      setFormData(prev => ({ ...prev, og_image_path: urlData.publicUrl }));
    } else {
      setFormData(prev => ({ ...prev, twitter_image_path: urlData.publicUrl }));
    }

    toast.success("Image uploaded");
    setUploading(false);
  };

  const getImageUrl = (path: string | null) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const { data } = supabase.storage.from('og-images').getPublicUrl(path);
    return data.publicUrl;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">SEO & Social Share Manager</h1>
              <p className="text-muted-foreground">Manage meta tags and OG images for all pages</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <Button variant="outline" size="icon" onClick={signOut}>
              <LogOut className="h-4 w-4" />
            </Button>
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Add Page
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : entries.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No SEO entries yet. Click "Add Page" to create one.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {entries.map((entry) => (
              <Card key={entry.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <code className="text-sm bg-muted px-2 py-1 rounded">{entry.page_path}</code>
                        {entry.no_index && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">noindex</span>
                        )}
                        {entry.no_follow && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">nofollow</span>
                        )}
                      </div>
                      <h3 className="font-medium truncate">{entry.page_title || entry.og_title || "No title set"}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {entry.meta_description || entry.og_description || "No description set"}
                      </p>
                      {entry.og_image_path && (
                        <div className="mt-2">
                          <img 
                            src={getImageUrl(entry.og_image_path)} 
                            alt="OG Image" 
                            className="h-16 rounded object-cover"
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => openEditDialog(entry)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleDelete(entry.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingEntry ? "Edit SEO Entry" : "Add SEO Entry"}</DialogTitle>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Basic Info */}
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Basic Info</h4>
                
                <div className="space-y-2">
                  <Label htmlFor="page_path">Page Path *</Label>
                  <Input
                    id="page_path"
                    value={formData.page_path}
                    onChange={(e) => setFormData(prev => ({ ...prev, page_path: e.target.value }))}
                    placeholder="/blog/my-post"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="page_title">Page Title</Label>
                  <Input
                    id="page_title"
                    value={formData.page_title || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, page_title: e.target.value }))}
                    placeholder="My Amazing Blog Post"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meta_description">Meta Description</Label>
                  <Textarea
                    id="meta_description"
                    value={formData.meta_description || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                    placeholder="A brief description for search engines..."
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="keywords">Keywords (comma-separated)</Label>
                  <Input
                    id="keywords"
                    value={keywordsInput}
                    onChange={(e) => setKeywordsInput(e.target.value)}
                    placeholder="marketing, strategy, growth"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="canonical_url">Canonical URL</Label>
                  <Input
                    id="canonical_url"
                    value={formData.canonical_url || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, canonical_url: e.target.value }))}
                    placeholder="https://example.com/canonical-path"
                  />
                </div>
              </div>

              {/* Open Graph */}
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Open Graph (Facebook, LinkedIn)</h4>
                
                <div className="space-y-2">
                  <Label htmlFor="og_title">OG Title</Label>
                  <Input
                    id="og_title"
                    value={formData.og_title || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, og_title: e.target.value }))}
                    placeholder="Title for social sharing"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="og_description">OG Description</Label>
                  <Textarea
                    id="og_description"
                    value={formData.og_description || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, og_description: e.target.value }))}
                    placeholder="Description for social sharing..."
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label>OG Image</Label>
                  {formData.og_image_path && (
                    <div className="relative inline-block">
                      <img 
                        src={getImageUrl(formData.og_image_path)} 
                        alt="OG Preview" 
                        className="h-24 rounded object-cover"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6"
                        onClick={() => setFormData(prev => ({ ...prev, og_image_path: "" }))}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                  <div>
                    <Label htmlFor="og_image_upload" className="cursor-pointer">
                      <div className="flex items-center gap-2 text-sm text-primary hover:underline">
                        <Upload className="h-4 w-4" />
                        {uploading && uploadType === 'og' ? "Uploading..." : "Upload OG Image"}
                      </div>
                    </Label>
                    <input
                      id="og_image_upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, 'og')}
                      disabled={uploading}
                    />
                  </div>
                </div>
              </div>

              {/* Twitter Card */}
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Twitter Card</h4>
                
                <div className="space-y-2">
                  <Label htmlFor="twitter_title">Twitter Title</Label>
                  <Input
                    id="twitter_title"
                    value={formData.twitter_title || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, twitter_title: e.target.value }))}
                    placeholder="Title for Twitter"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twitter_description">Twitter Description</Label>
                  <Textarea
                    id="twitter_description"
                    value={formData.twitter_description || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, twitter_description: e.target.value }))}
                    placeholder="Description for Twitter..."
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Twitter Image</Label>
                  {formData.twitter_image_path && (
                    <div className="relative inline-block">
                      <img 
                        src={getImageUrl(formData.twitter_image_path)} 
                        alt="Twitter Preview" 
                        className="h-24 rounded object-cover"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6"
                        onClick={() => setFormData(prev => ({ ...prev, twitter_image_path: "" }))}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                  <div>
                    <Label htmlFor="twitter_image_upload" className="cursor-pointer">
                      <div className="flex items-center gap-2 text-sm text-primary hover:underline">
                        <Upload className="h-4 w-4" />
                        {uploading && uploadType === 'twitter' ? "Uploading..." : "Upload Twitter Image"}
                      </div>
                    </Label>
                    <input
                      id="twitter_image_upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, 'twitter')}
                      disabled={uploading}
                    />
                  </div>
                </div>
              </div>

              {/* Robot Directives */}
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Robot Directives</h4>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>No Index</Label>
                    <p className="text-sm text-muted-foreground">Prevent search engines from indexing this page</p>
                  </div>
                  <Switch
                    checked={formData.no_index}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, no_index: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>No Follow</Label>
                    <p className="text-sm text-muted-foreground">Prevent search engines from following links on this page</p>
                  </div>
                  <Switch
                    checked={formData.no_follow}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, no_follow: checked }))}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default SeoAdminPage;
