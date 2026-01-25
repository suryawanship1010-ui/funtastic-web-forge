import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Twitter, Facebook, Linkedin } from "lucide-react";

interface OGPreviewProps {
  title: string;
  description: string;
  image: string;
  url?: string;
}

const OGPreview = ({ title, description, image, url = "yoursite.com" }: OGPreviewProps) => {
  const truncate = (text: string, length: number) => {
    if (!text) return "";
    return text.length > length ? text.substring(0, length) + "..." : text;
  };

  return (
    <Card className="bg-card border shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Globe className="h-4 w-4" />
          Social Media Preview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="google" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="google" className="text-xs">
              <Globe className="h-3 w-3 mr-1" />
              Google
            </TabsTrigger>
            <TabsTrigger value="twitter" className="text-xs">
              <Twitter className="h-3 w-3 mr-1" />
              Twitter
            </TabsTrigger>
            <TabsTrigger value="facebook" className="text-xs">
              <Facebook className="h-3 w-3 mr-1" />
              Facebook
            </TabsTrigger>
            <TabsTrigger value="linkedin" className="text-xs">
              <Linkedin className="h-3 w-3 mr-1" />
              LinkedIn
            </TabsTrigger>
          </TabsList>

          {/* Google Search Preview */}
          <TabsContent value="google" className="mt-0">
            <div className="bg-white rounded-lg p-4 border">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                  <Globe className="h-3 w-3" />
                </div>
                <div>
                  <p className="text-xs text-gray-700">{url}</p>
                </div>
              </div>
              <h3 className="text-lg text-blue-800 hover:underline cursor-pointer font-normal mb-1">
                {truncate(title || "Your Blog Title", 60)}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2">
                {truncate(description || "Your blog description will appear here...", 160)}
              </p>
            </div>
          </TabsContent>

          {/* Twitter Card Preview */}
          <TabsContent value="twitter" className="mt-0">
            <div className="bg-white rounded-xl overflow-hidden border max-w-md">
              {image ? (
                <div className="aspect-[1.91/1] bg-muted">
                  <img
                    src={image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-[1.91/1] bg-muted flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">No image</p>
                </div>
              )}
              <div className="p-3 border-t">
                <p className="text-sm text-gray-500 mb-1">{url}</p>
                <h4 className="font-semibold text-gray-900 text-sm mb-1">
                  {truncate(title || "Your Blog Title", 70)}
                </h4>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {truncate(description || "Your blog description will appear here...", 200)}
                </p>
              </div>
            </div>
          </TabsContent>

          {/* Facebook Preview */}
          <TabsContent value="facebook" className="mt-0">
            <div className="bg-white rounded-lg overflow-hidden border max-w-lg">
              {image ? (
                <div className="aspect-[1.91/1] bg-muted">
                  <img
                    src={image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-[1.91/1] bg-muted flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">No image</p>
                </div>
              )}
              <div className="p-3 bg-gray-100 border-t">
                <p className="text-xs text-gray-500 uppercase mb-1">{url}</p>
                <h4 className="font-bold text-gray-900 text-base leading-tight mb-1">
                  {truncate(title || "Your Blog Title", 88)}
                </h4>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {truncate(description || "Your blog description will appear here...", 200)}
                </p>
              </div>
            </div>
          </TabsContent>

          {/* LinkedIn Preview */}
          <TabsContent value="linkedin" className="mt-0">
            <div className="bg-white rounded-lg overflow-hidden border max-w-lg shadow-sm">
              {image ? (
                <div className="aspect-[1.91/1] bg-muted">
                  <img
                    src={image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-[1.91/1] bg-muted flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">No image</p>
                </div>
              )}
              <div className="p-3 border-t">
                <h4 className="font-semibold text-gray-900 text-sm mb-1">
                  {truncate(title || "Your Blog Title", 100)}
                </h4>
                <p className="text-xs text-gray-500">{url}</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <p className="text-xs text-muted-foreground mt-4 text-center">
          Preview how your post will appear when shared on social media
        </p>
      </CardContent>
    </Card>
  );
};

export default OGPreview;
