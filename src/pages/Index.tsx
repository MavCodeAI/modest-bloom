import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat';
import { BottomNav } from '@/components/layout/BottomNav';
import { HeroSection } from '@/components/home/HeroSection';
import { NewDropsSection } from '@/components/home/NewDropsSection';
import { PromoTilesSection } from '@/components/home/PromoTilesSection';
import { EditorialBannerSection } from '@/components/home/EditorialBannerSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { FavoriteCollectionsSection } from '@/components/home/FavoriteCollectionsSection';
import { ExpressStripSection } from '@/components/home/ExpressStripSection';
import { BestSellersSection } from '@/components/home/BestSellersSection';
import { AbayaOfTheWeekSection } from '@/components/home/AbayaOfTheWeekSection';
import { WholesaleStripSection } from '@/components/home/WholesaleStripSection';

const Index = () => {
  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <Navbar />
      <CartDrawer />
      <WhatsAppFloat />

      <main>
        <HeroSection />
        <NewDropsSection />
        <PromoTilesSection />
        <EditorialBannerSection />
        <BestSellersSection />
        <ExpressStripSection />
        <AbayaOfTheWeekSection />
        <TestimonialsSection />
        <FavoriteCollectionsSection />
        <WholesaleStripSection />
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
};

export default Index;
