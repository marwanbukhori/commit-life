import { Navbar } from "@/components/ui/Navbar";
import { DashboardGrid } from "@/components/ui/DashboardGrid";
import { LivelyBackground } from "@/components/ui/LivelyBackground";
import { getDashboardData } from "@/app/actions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { LandingPage } from "@/components/ui/LandingPage";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return <LandingPage />;
  }

  const { pillars, habits, settings } = await getDashboardData();

  // Filter habits for the dashboard view
  const todaysChores = habits.filter((h: any) => h.frequency === 'daily' && !h.completedToday);
  const weeklyChores = habits.filter((h: any) => h.frequency === 'weekly' && !h.completedToday);

  return (
    <main className="min-h-screen pb-20 font-sans relative">
      {/* Pixel Art Farm Background */}
      <LivelyBackground />

      <div className="relative z-10">
        <Navbar />

        <div className="container mx-auto px-4 pt-24">
          <DashboardGrid
            pillars={pillars as any}
            todaysChores={todaysChores as any}
            weeklyChores={weeklyChores as any}
            sectionTitle={settings?.gardenSectionTitle || "Your Gardens"}
          />
        </div>
      </div>
    </main>
  );
}
