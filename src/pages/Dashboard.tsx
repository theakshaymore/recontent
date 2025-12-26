import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Video,
  BarChart3,
  Sparkles,
  Sun,
  Moon,
  Loader2,
  CreditCard
} from 'lucide-react';
import { useAuthQuery } from '@/hooks/useAuthQuery';
import { useTheme } from '@/hooks/useTheme';
import { useUIStore } from '@/stores/uiStore';
import { useToast } from '@/hooks/use-toast';
import { useProfile } from '@/hooks/useProfile';
import { useVideos, useDeleteVideo } from '@/hooks/useVideos';
import ProcessVideoForm from '@/components/dashboard/ProcessVideoForm';
import VideoCard from '@/components/dashboard/VideoCard';
import { PLAN_DETAILS } from '@/types';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOut, isSigningOut } = useAuthQuery();
  const { theme, toggleTheme } = useTheme();
  const { isSidebarOpen, toggleSidebar } = useUIStore();
  const { toast } = useToast();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: videos = [], isLoading: videosLoading } = useVideos();
  const deleteVideo = useDeleteVideo();
  const [activeTab, setActiveTab] = useState('overview');
  const [deletingVideoId, setDeletingVideoId] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteVideo = async (videoId: string) => {
    setDeletingVideoId(videoId);
    try {
      await deleteVideo.mutateAsync(videoId);
      toast({
        title: "Video deleted",
        description: "The video has been removed from your library.",
      });
    } catch (error: any) {
      toast({
        title: "Failed to delete",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeletingVideoId(null);
    }
  };

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'content', label: 'My Videos', icon: Video },
    { id: 'create', label: 'Create New', icon: Sparkles },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const completedVideos = videos.filter(v => v.status === 'completed');
  const totalContentPieces = completedVideos.length * 4; // Blog, Tweets, Carousel, Instagram

  const stats = [
    { label: 'Videos Processed', value: videos.length.toString(), icon: Video },
    { label: 'Content Pieces', value: totalContentPieces.toString(), icon: FileText },
    { label: 'Credits Remaining', value: profile?.credits_remaining?.toString() || '0', icon: CreditCard },
  ];

  const currentPlan = profile?.subscription_tier || 'free';
  const planDetails = PLAN_DETAILS[currentPlan];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-xl font-bold gradient-text">ReContentAI</span>
            </Link>
          </div>

          {/* Plan badge */}
          <div className="px-6 py-3 border-b border-border">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Plan</span>
              <Badge variant={currentPlan === 'pro' ? 'default' : 'secondary'} className="capitalize">
                {currentPlan}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {profile?.credits_remaining ?? 0} credits left
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </button>
            ))}
          </nav>

          {/* Bottom section */}
          <div className="p-4 border-t border-border space-y-2">
            <button
              onClick={toggleTheme}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </button>
            <button
              onClick={handleLogout}
              disabled={isSigningOut}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors disabled:opacity-50"
            >
              {isSigningOut ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <LogOut className="h-5 w-5" />
              )}
              {isSigningOut ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Main content */}
      <main className={`flex-1 lg:ml-64 transition-all duration-300`}>
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={toggleSidebar}
                className="lg:hidden p-2 rounded-lg hover:bg-secondary"
              >
                {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              <h1 className="text-xl font-semibold">
                {sidebarItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground hidden sm:block">
                {user?.email}
              </span>
              <Button variant="gradient" size="sm" onClick={() => setActiveTab('create')}>
                <Sparkles className="h-4 w-4 mr-2" />
                Create
              </Button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid gap-4 md:grid-cols-3">
                {stats.map((stat) => (
                  <Card key={stat.label}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {stat.label}
                      </CardTitle>
                      <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Quick actions */}
              <div className="grid gap-6 md:grid-cols-2">
                <ProcessVideoForm onSuccess={() => setActiveTab('content')} />
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-primary" />
                      Your Plan
                    </CardTitle>
                    <CardDescription>
                      {planDetails?.name} - ₹{planDetails?.price}/month
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2">
                      {planDetails?.features.slice(0, 3).map((feature) => (
                        <li key={feature} className="text-sm text-muted-foreground flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    {currentPlan === 'free' && (
                      <Button variant="outline" className="w-full">
                        Upgrade to Pro
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Recent videos */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Videos</CardTitle>
                  <CardDescription>Your latest content transformations</CardDescription>
                </CardHeader>
                <CardContent>
                  {videosLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : videos.length > 0 ? (
                    <div className="space-y-4">
                      {videos.slice(0, 3).map((video) => (
                        <VideoCard
                          key={video.id}
                          video={video}
                          onDelete={handleDeleteVideo}
                          isDeleting={deletingVideoId === video.id}
                        />
                      ))}
                      {videos.length > 3 && (
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => setActiveTab('content')}
                        >
                          View All Videos
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
                      <p className="text-muted-foreground">No videos yet</p>
                      <p className="text-sm text-muted-foreground">
                        Start by processing your first video
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'content' && (
            <div className="space-y-6">
              <ProcessVideoForm />
              
              <Card>
                <CardHeader>
                  <CardTitle>My Videos</CardTitle>
                  <CardDescription>Manage your processed videos and content</CardDescription>
                </CardHeader>
                <CardContent>
                  {videosLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : videos.length > 0 ? (
                    <div className="space-y-4">
                      {videos.map((video) => (
                        <VideoCard
                          key={video.id}
                          video={video}
                          onDelete={handleDeleteVideo}
                          isDeleting={deletingVideoId === video.id}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Video className="h-12 w-12 text-muted-foreground/50 mb-4" />
                      <p className="text-muted-foreground">No videos yet</p>
                      <p className="text-sm text-muted-foreground">
                        Process a YouTube video to see it here
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'create' && (
            <div className="max-w-2xl mx-auto">
              <ProcessVideoForm onSuccess={() => setActiveTab('content')} />
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>How It Works</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { step: 1, title: 'Paste YouTube URL', desc: 'Enter any YouTube video link' },
                      { step: 2, title: 'AI Processing', desc: 'Our AI transcribes and analyzes your video' },
                      { step: 3, title: 'Get Content', desc: 'Receive blog posts, tweets, carousels & thumbnails' },
                      { step: 4, title: 'Download & Share', desc: 'Use your content across all platforms' },
                    ].map((item) => (
                      <div key={item.step} className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-primary-foreground font-semibold text-sm flex-shrink-0">
                          {item.step}
                        </div>
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'analytics' && (
            <Card>
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
                <CardDescription>Track your content performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <BarChart3 className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">Analytics coming soon</p>
                  <p className="text-sm text-muted-foreground">
                    We're working on bringing you detailed insights about your content
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage your account preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <p className="text-muted-foreground">{user?.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Full Name</label>
                    <p className="text-muted-foreground">{profile?.full_name || 'Not set'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Account ID</label>
                    <p className="text-xs text-muted-foreground font-mono">{user?.id}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Subscription</CardTitle>
                  <CardDescription>Manage your subscription plan</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{planDetails?.name} Plan</p>
                      <p className="text-sm text-muted-foreground">
                        ₹{planDetails?.price}/month
                      </p>
                    </div>
                    <Badge variant={currentPlan === 'pro' ? 'default' : 'secondary'} className="capitalize">
                      {currentPlan}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Credits Remaining</p>
                    <p className="text-2xl font-bold">{profile?.credits_remaining ?? 0}</p>
                  </div>
                  {currentPlan === 'free' && (
                    <Button variant="gradient" className="w-full">
                      Upgrade to Pro - ₹999/month
                    </Button>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>Customize how the app looks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Theme</p>
                      <p className="text-sm text-muted-foreground">
                        {theme === 'light' ? 'Light mode' : 'Dark mode'}
                      </p>
                    </div>
                    <Button variant="outline" onClick={toggleTheme}>
                      {theme === 'light' ? <Moon className="h-4 w-4 mr-2" /> : <Sun className="h-4 w-4 mr-2" />}
                      Switch to {theme === 'light' ? 'Dark' : 'Light'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
