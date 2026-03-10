import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, LogOut, Loader2, Search, Copy, Check, FolderOpen, Image as ImageIcon, Grid3X3, List } from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

// Define image categories with their sources
const IMAGE_CATEGORIES = {
  og: {
    label: "OG Images",
    description: "Social sharing images",
    basePath: "/images/og",
    images: [
      { name: "cognitive-overload.png", path: "/images/og/cognitive-overload.png" },
      { name: "marketing-chaos.png", path: "/images/og/marketing-chaos.png" },
      { name: "stacked-behaviours-welcome.png", path: "/images/og/stacked-behaviours-welcome.png" },
      { name: "woman-took-control.png", path: "/images/og/woman-took-control.png" },
    ],
  },
  logos: {
    label: "Logos",
    description: "Brand logos in various formats",
    basePath: "/src/assets/logos",
    images: [
      { name: "Black_TS_SocialSq.svg", path: "/src/assets/logos/Black_TS_SocialSq.svg", importPath: "@/assets/logos/Black_TS_SocialSq.svg" },
      { name: "Black_TS_Stacked.svg", path: "/src/assets/logos/Black_TS_Stacked.svg", importPath: "@/assets/logos/Black_TS_Stacked.svg" },
      { name: "Black_TS_Wordmark.svg", path: "/src/assets/logos/Black_TS_Wordmark.svg", importPath: "@/assets/logos/Black_TS_Wordmark.svg" },
      { name: "Grey_TS_SocialSq.svg", path: "/src/assets/logos/Grey_TS_SocialSq.svg", importPath: "@/assets/logos/Grey_TS_SocialSq.svg" },
      { name: "Grey_TS_Stacked.svg", path: "/src/assets/logos/Grey_TS_Stacked.svg", importPath: "@/assets/logos/Grey_TS_Stacked.svg" },
      { name: "Grey_TS_Wordmark.svg", path: "/src/assets/logos/Grey_TS_Wordmark.svg", importPath: "@/assets/logos/Grey_TS_Wordmark.svg" },
      { name: "Indigo_TS_SocialSq.svg", path: "/src/assets/logos/Indigo_TS_SocialSq.svg", importPath: "@/assets/logos/Indigo_TS_SocialSq.svg" },
      { name: "Indigo_TS_Stacked.svg", path: "/src/assets/logos/Indigo_TS_Stacked.svg", importPath: "@/assets/logos/Indigo_TS_Stacked.svg" },
      { name: "Indigo_TS_Wordmark.svg", path: "/src/assets/logos/Indigo_TS_Wordmark.svg", importPath: "@/assets/logos/Indigo_TS_Wordmark.svg" },
      { name: "White_TS_SocialSq.svg", path: "/src/assets/logos/White_TS_SocialSq.svg", importPath: "@/assets/logos/White_TS_SocialSq.svg" },
      { name: "White_TS_Stacked.svg", path: "/src/assets/logos/White_TS_Stacked.svg", importPath: "@/assets/logos/White_TS_Stacked.svg" },
      { name: "White_TS_Wordmark.svg", path: "/src/assets/logos/White_TS_Wordmark.svg", importPath: "@/assets/logos/White_TS_Wordmark.svg" },
    ],
  },
  portraits: {
    label: "Portraits",
    description: "Professional portrait photos",
    basePath: "/src/assets/photos/portraits",
    images: [
      { name: "brendan-4.jpg", path: "/src/assets/photos/portraits/brendan-4.jpg", importPath: "@/assets/photos/portraits/brendan-4.jpg" },
      { name: "brendan-5.jpg", path: "/src/assets/photos/portraits/brendan-5.jpg", importPath: "@/assets/photos/portraits/brendan-5.jpg" },
      { name: "brendan-6.jpg", path: "/src/assets/photos/portraits/brendan-6.jpg", importPath: "@/assets/photos/portraits/brendan-6.jpg" },
      { name: "brendan-7.jpg", path: "/src/assets/photos/portraits/brendan-7.jpg", importPath: "@/assets/photos/portraits/brendan-7.jpg" },
      { name: "brendan-8.jpg", path: "/src/assets/photos/portraits/brendan-8.jpg", importPath: "@/assets/photos/portraits/brendan-8.jpg" },
      { name: "brendan-9.jpg", path: "/src/assets/photos/portraits/brendan-9.jpg", importPath: "@/assets/photos/portraits/brendan-9.jpg" },
      { name: "brendan-10.jpg", path: "/src/assets/photos/portraits/brendan-10.jpg", importPath: "@/assets/photos/portraits/brendan-10.jpg" },
      { name: "brendan-11.jpg", path: "/src/assets/photos/portraits/brendan-11.jpg", importPath: "@/assets/photos/portraits/brendan-11.jpg" },
      { name: "brendan-12.jpg", path: "/src/assets/photos/portraits/brendan-12.jpg", importPath: "@/assets/photos/portraits/brendan-12.jpg" },
      { name: "brendan-13.jpg", path: "/src/assets/photos/portraits/brendan-13.jpg", importPath: "@/assets/photos/portraits/brendan-13.jpg" },
      { name: "brendan-14.jpg", path: "/src/assets/photos/portraits/brendan-14.jpg", importPath: "@/assets/photos/portraits/brendan-14.jpg" },
      { name: "brendan-15.jpg", path: "/src/assets/photos/portraits/brendan-15.jpg", importPath: "@/assets/photos/portraits/brendan-15.jpg" },
      { name: "brendan-16.jpg", path: "/src/assets/photos/portraits/brendan-16.jpg", importPath: "@/assets/photos/portraits/brendan-16.jpg" },
      { name: "brendan-17.jpg", path: "/src/assets/photos/portraits/brendan-17.jpg", importPath: "@/assets/photos/portraits/brendan-17.jpg" },
    ],
  },
  shoreditch: {
    label: "Shoreditch",
    description: "Street photography in Shoreditch",
    basePath: "/src/assets/photos/shoreditch",
    images: [
      { name: "brendan-26.jpg", path: "/src/assets/photos/shoreditch/brendan-26.jpg", importPath: "@/assets/photos/shoreditch/brendan-26.jpg" },
      { name: "brendan-27.jpg", path: "/src/assets/photos/shoreditch/brendan-27.jpg", importPath: "@/assets/photos/shoreditch/brendan-27.jpg" },
      { name: "brendan-28.jpg", path: "/src/assets/photos/shoreditch/brendan-28.jpg", importPath: "@/assets/photos/shoreditch/brendan-28.jpg" },
      { name: "brendan-29.jpg", path: "/src/assets/photos/shoreditch/brendan-29.jpg", importPath: "@/assets/photos/shoreditch/brendan-29.jpg" },
      { name: "brendan-30.jpg", path: "/src/assets/photos/shoreditch/brendan-30.jpg", importPath: "@/assets/photos/shoreditch/brendan-30.jpg" },
      { name: "brendan-31.jpg", path: "/src/assets/photos/shoreditch/brendan-31.jpg", importPath: "@/assets/photos/shoreditch/brendan-31.jpg" },
      { name: "brendan-33.jpg", path: "/src/assets/photos/shoreditch/brendan-33.jpg", importPath: "@/assets/photos/shoreditch/brendan-33.jpg" },
      { name: "brendan-34.jpg", path: "/src/assets/photos/shoreditch/brendan-34.jpg", importPath: "@/assets/photos/shoreditch/brendan-34.jpg" },
      { name: "brendan-35.jpg", path: "/src/assets/photos/shoreditch/brendan-35.jpg", importPath: "@/assets/photos/shoreditch/brendan-35.jpg" },
      { name: "brendan-37.jpg", path: "/src/assets/photos/shoreditch/brendan-37.jpg", importPath: "@/assets/photos/shoreditch/brendan-37.jpg" },
    ],
  },
  workshop: {
    label: "Workshop",
    description: "Workshop and collaboration photos",
    basePath: "/src/assets/photos/workshop",
    images: [
      { name: "brendan-1.jpg", path: "/src/assets/photos/workshop/brendan-1.jpg", importPath: "@/assets/photos/workshop/brendan-1.jpg" },
      { name: "brendan-2.jpg", path: "/src/assets/photos/workshop/brendan-2.jpg", importPath: "@/assets/photos/workshop/brendan-2.jpg" },
      { name: "brendan-3.jpg", path: "/src/assets/photos/workshop/brendan-3.jpg", importPath: "@/assets/photos/workshop/brendan-3.jpg" },
      { name: "brendan-18.jpg", path: "/src/assets/photos/workshop/brendan-18.jpg", importPath: "@/assets/photos/workshop/brendan-18.jpg" },
      { name: "brendan-19.jpg", path: "/src/assets/photos/workshop/brendan-19.jpg", importPath: "@/assets/photos/workshop/brendan-19.jpg" },
      { name: "brendan-20.jpg", path: "/src/assets/photos/workshop/brendan-20.jpg", importPath: "@/assets/photos/workshop/brendan-20.jpg" },
      { name: "brendan-21.jpg", path: "/src/assets/photos/workshop/brendan-21.jpg", importPath: "@/assets/photos/workshop/brendan-21.jpg" },
      { name: "brendan-22.jpg", path: "/src/assets/photos/workshop/brendan-22.jpg", importPath: "@/assets/photos/workshop/brendan-22.jpg" },
      { name: "brendan-23.jpg", path: "/src/assets/photos/workshop/brendan-23.jpg", importPath: "@/assets/photos/workshop/brendan-23.jpg" },
      { name: "brendan-24.jpg", path: "/src/assets/photos/workshop/brendan-24.jpg", importPath: "@/assets/photos/workshop/brendan-24.jpg" },
      { name: "brendan-25.jpg", path: "/src/assets/photos/workshop/brendan-25.jpg", importPath: "@/assets/photos/workshop/brendan-25.jpg" },
    ],
  },
  projects: {
    label: "Projects",
    description: "Case study and project images",
    basePath: "/src/assets",
    images: [
      { name: "ebay-project.png", path: "/src/assets/ebay-project.png", importPath: "@/assets/ebay-project.png" },
      { name: "funraisin-project.jpg", path: "/src/assets/funraisin-project.jpg", importPath: "@/assets/funraisin-project.jpg" },
      { name: "imma-project.png", path: "/src/assets/imma-project.png", importPath: "@/assets/imma-project.png" },
      { name: "imma-1.png", path: "/src/assets/imma-1.png", importPath: "@/assets/imma-1.png" },
      { name: "imma-2.png", path: "/src/assets/imma-2.png", importPath: "@/assets/imma-2.png" },
      { name: "imma-3.png", path: "/src/assets/imma-3.png", importPath: "@/assets/imma-3.png" },
      { name: "ubiq-project.png", path: "/src/assets/ubiq-project.png", importPath: "@/assets/ubiq-project.png" },
      { name: "ubiq-1.png", path: "/src/assets/ubiq-1.png", importPath: "@/assets/ubiq-1.png" },
      { name: "ubiq-2.png", path: "/src/assets/ubiq-2.png", importPath: "@/assets/ubiq-2.png" },
      { name: "ubiq-3.png", path: "/src/assets/ubiq-3.png", importPath: "@/assets/ubiq-3.png" },
      { name: "ubiq-5.png", path: "/src/assets/ubiq-5.png", importPath: "@/assets/ubiq-5.png" },
      { name: "ntuk-digital.png", path: "/src/assets/ntuk-digital.png", importPath: "@/assets/ntuk-digital.png" },
      { name: "ntuk-digital-2.png", path: "/src/assets/ntuk-digital-2.png", importPath: "@/assets/ntuk-digital-2.png" },
      { name: "ntuk-digital-3.png", path: "/src/assets/ntuk-digital-3.png", importPath: "@/assets/ntuk-digital-3.png" },
      { name: "ntuk-kieran.png", path: "/src/assets/ntuk-kieran.png", importPath: "@/assets/ntuk-kieran.png" },
      { name: "ntuk-logo.png", path: "/src/assets/ntuk-logo.png", importPath: "@/assets/ntuk-logo.png" },
      { name: "ntuk-logo-new.png", path: "/src/assets/ntuk-logo-new.png", importPath: "@/assets/ntuk-logo-new.png" },
      { name: "ntuk-olivia.png", path: "/src/assets/ntuk-olivia.png", importPath: "@/assets/ntuk-olivia.png" },
      { name: "ntuk-quote.png", path: "/src/assets/ntuk-quote.png", importPath: "@/assets/ntuk-quote.png" },
      { name: "ntuk-quote-new.png", path: "/src/assets/ntuk-quote-new.png", importPath: "@/assets/ntuk-quote-new.png" },
      { name: "ntuk-running.png", path: "/src/assets/ntuk-running.png", importPath: "@/assets/ntuk-running.png" },
      { name: "ntuk-running-new.png", path: "/src/assets/ntuk-running-new.png", importPath: "@/assets/ntuk-running-new.png" },
    ],
  },
  brendan: {
    label: "Brendan (Legacy)",
    description: "Legacy Brendan photos",
    basePath: "/src/assets",
    images: [
      { name: "brendan-avatar.png", path: "/src/assets/brendan-avatar.png", importPath: "@/assets/brendan-avatar.png" },
      { name: "brendan-brick.jpeg", path: "/src/assets/brendan-brick.jpeg", importPath: "@/assets/brendan-brick.jpeg" },
      { name: "brendan-cafe.jpeg", path: "/src/assets/brendan-cafe.jpeg", importPath: "@/assets/brendan-cafe.jpeg" },
      { name: "brendan-collaboration.jpeg", path: "/src/assets/brendan-collaboration.jpeg", importPath: "@/assets/brendan-collaboration.jpeg" },
      { name: "brendan-desk-celebration.jpg", path: "/src/assets/brendan-desk-celebration.jpg", importPath: "@/assets/brendan-desk-celebration.jpg" },
      { name: "brendan-graffiti-portrait.jpg", path: "/src/assets/brendan-graffiti-portrait.jpg", importPath: "@/assets/brendan-graffiti-portrait.jpg" },
      { name: "brendan-graffiti-walk.jpg", path: "/src/assets/brendan-graffiti-walk.jpg", importPath: "@/assets/brendan-graffiti-walk.jpg" },
      { name: "brendan-mural.jpeg", path: "/src/assets/brendan-mural.jpeg", importPath: "@/assets/brendan-mural.jpeg" },
      { name: "brendan-portrait.jpeg", path: "/src/assets/brendan-portrait.jpeg", importPath: "@/assets/brendan-portrait.jpeg" },
      { name: "brendan-postits-close.jpeg", path: "/src/assets/brendan-postits-close.jpeg", importPath: "@/assets/brendan-postits-close.jpeg" },
      { name: "brendan-postits.jpeg", path: "/src/assets/brendan-postits.jpeg", importPath: "@/assets/brendan-postits.jpeg" },
      { name: "brendan-street.jpeg", path: "/src/assets/brendan-street.jpeg", importPath: "@/assets/brendan-street.jpeg" },
      { name: "brendan-workshop.jpeg", path: "/src/assets/brendan-workshop.jpeg", importPath: "@/assets/brendan-workshop.jpeg" },
    ],
  },
};

type CategoryKey = keyof typeof IMAGE_CATEGORIES;

interface ImageItem {
  name: string;
  path: string;
  importPath?: string;
  category: CategoryKey;
  categoryLabel: string;
}

// Eagerly import all assets so Vite resolves their URLs
const assetModules = import.meta.glob<string>('/src/assets/**/*.{jpg,jpeg,png,svg,gif}', { eager: true, import: 'default' });

const ImageLibraryPage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, isAdmin, signOut } = useAdminAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryKey | "all">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [copiedPath, setCopiedPath] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/admin/login");
    } else if (!authLoading && user && !isAdmin) {
      toast.error("You don't have admin access");
      signOut();
      navigate("/admin/login");
    }
  }, [authLoading, user, isAdmin, navigate, signOut]);

  // Flatten all images with category info
  const allImages: ImageItem[] = Object.entries(IMAGE_CATEGORIES).flatMap(([key, category]) =>
    category.images.map((img) => ({
      ...img,
      category: key as CategoryKey,
      categoryLabel: category.label,
    }))
  );

  // Filter images based on search and category
  const filteredImages = allImages.filter((img) => {
    const matchesSearch = img.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      img.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || img.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedPath(text);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopiedPath(null), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const getImageSrc = (img: ImageItem) => {
    // For public folder images, use the path directly
    if (img.path.startsWith("/images/")) {
      return img.path;
    }
    // Resolve via Vite's glob import
    const resolved = assetModules[img.path];
    if (resolved) return resolved;
    return img.path;
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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/admin">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Image Library</h1>
              <p className="text-muted-foreground">
                Browse and manage project images ({allImages.length} total)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <Button variant="outline" size="icon" onClick={signOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search images..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <Button
            variant={activeCategory === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory("all")}
          >
            <FolderOpen className="h-4 w-4 mr-2" />
            All ({allImages.length})
          </Button>
          {Object.entries(IMAGE_CATEGORIES).map(([key, category]) => (
            <Button
              key={key}
              variant={activeCategory === key ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(key as CategoryKey)}
            >
              {category.label} ({category.images.length})
            </Button>
          ))}
        </div>

        {/* Results count */}
        {searchQuery && (
          <p className="text-sm text-muted-foreground mb-4">
            Showing {filteredImages.length} of {allImages.length} images
          </p>
        )}

        {/* Image grid/list */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredImages.map((img) => (
              <Card
                key={img.path}
                className="group cursor-pointer overflow-hidden hover:ring-2 hover:ring-primary transition-all"
                onClick={() => setSelectedImage(img)}
              >
                <div className="aspect-square relative bg-muted">
                  <img
                    src={getImageSrc(img)}
                    alt={img.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <ImageIcon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <CardContent className="p-2">
                  <p className="text-xs truncate font-medium">{img.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{img.categoryLabel}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredImages.map((img) => (
              <Card
                key={img.path}
                className="group cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                onClick={() => setSelectedImage(img)}
              >
                <CardContent className="p-3 flex items-center gap-4">
                  <div className="w-16 h-16 flex-shrink-0 rounded overflow-hidden bg-muted">
                    <img
                      src={getImageSrc(img)}
                      alt={img.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{img.name}</p>
                    <p className="text-sm text-muted-foreground">{img.categoryLabel}</p>
                    <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                      {img.importPath || img.path}
                    </code>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(img.importPath || img.path);
                    }}
                  >
                    {copiedPath === (img.importPath || img.path) ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredImages.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No images found matching your search.
          </div>
        )}

        {/* Image detail dialog */}
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-3xl">
            {selectedImage && (
              <div className="space-y-4">
                <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                  <img
                    src={getImageSrc(selectedImage)}
                    alt={selectedImage.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg">{selectedImage.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedImage.categoryLabel}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs text-muted-foreground block mb-1">File Path</label>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 text-sm bg-muted px-3 py-2 rounded overflow-x-auto">
                          {selectedImage.path}
                        </code>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(selectedImage.path)}
                        >
                          {copiedPath === selectedImage.path ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    {selectedImage.importPath && (
                      <div>
                        <label className="text-xs text-muted-foreground block mb-1">Import Path</label>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 text-sm bg-muted px-3 py-2 rounded overflow-x-auto">
                            {selectedImage.importPath}
                          </code>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(selectedImage.importPath!)}
                          >
                            {copiedPath === selectedImage.importPath ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    )}

                    {selectedImage.importPath && (
                      <div>
                        <label className="text-xs text-muted-foreground block mb-1">Usage Example</label>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 text-sm bg-muted px-3 py-2 rounded overflow-x-auto whitespace-pre">
{`import img from "${selectedImage.importPath}";
<img src={img} alt="${selectedImage.name.replace(/\.[^/.]+$/, "")}" />`}
                          </code>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(`import img from "${selectedImage.importPath}";\n<img src={img} alt="${selectedImage.name.replace(/\.[^/.]+$/, "")}" />`)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ImageLibraryPage;
