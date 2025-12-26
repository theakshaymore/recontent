import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Film, Instagram, Twitter, Linkedin } from 'lucide-react';
import ShortsTab from './content-tabs/ShortsTab';
import InstagramTab from './content-tabs/InstagramTab';
import TwitterTab from './content-tabs/TwitterTab';
import LinkedInTab from './content-tabs/LinkedInTab';

interface ContentTabsProps {
  videoId: string;
}

const ContentTabs = ({ videoId }: ContentTabsProps) => {
  return (
    <Tabs defaultValue="shorts" className="w-full">
      <TabsList className="grid w-full grid-cols-4 h-auto p-1">
        <TabsTrigger 
          value="shorts" 
          className="flex items-center gap-2 py-2.5 data-[state=active]:bg-red-500/10 data-[state=active]:text-red-500"
        >
          <Film className="h-4 w-4" />
          <span className="hidden sm:inline">YouTube Shorts</span>
          <span className="sm:hidden">Shorts</span>
        </TabsTrigger>
        <TabsTrigger 
          value="instagram" 
          className="flex items-center gap-2 py-2.5 data-[state=active]:bg-pink-500/10 data-[state=active]:text-pink-500"
        >
          <Instagram className="h-4 w-4" />
          <span className="hidden sm:inline">Instagram Reels</span>
          <span className="sm:hidden">Reels</span>
        </TabsTrigger>
        <TabsTrigger 
          value="twitter" 
          className="flex items-center gap-2 py-2.5 data-[state=active]:bg-sky-500/10 data-[state=active]:text-sky-500"
        >
          <Twitter className="h-4 w-4" />
          <span className="hidden sm:inline">Twitter</span>
          <span className="sm:hidden">X</span>
        </TabsTrigger>
        <TabsTrigger 
          value="linkedin" 
          className="flex items-center gap-2 py-2.5 data-[state=active]:bg-blue-600/10 data-[state=active]:text-blue-600"
        >
          <Linkedin className="h-4 w-4" />
          <span className="hidden sm:inline">LinkedIn</span>
          <span className="sm:hidden">LinkedIn</span>
        </TabsTrigger>
      </TabsList>

      <div className="mt-4">
        <TabsContent value="shorts" className="mt-0">
          <ShortsTab videoId={videoId} />
        </TabsContent>

        <TabsContent value="instagram" className="mt-0">
          <InstagramTab videoId={videoId} />
        </TabsContent>

        <TabsContent value="twitter" className="mt-0">
          <TwitterTab videoId={videoId} />
        </TabsContent>

        <TabsContent value="linkedin" className="mt-0">
          <LinkedInTab videoId={videoId} />
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default ContentTabs;
