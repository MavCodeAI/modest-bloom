import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat';
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
    <div className="min-h-screen bg-background">
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
    </div>
  );
};

export default Index;
