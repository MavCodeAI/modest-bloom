import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const promoTiles = [
  {
    id: 1,
    title: 'Printed Velvet',
    subtitle: 'Collection',
    description: 'Luxurious velvet abayas with exclusive prints',
    image: '/images/product-modern-1.jpeg',
    link: '/shop?category=printed',
  },
  {
    id: 2,
    title: 'Ramadan',
    subtitle: 'Essentials',
    description: 'Curated pieces for the holy month',
    image: '/images/product-traditional-1.jpeg',
    link: '/shop?category=sets',
  },
];

export function PromoTilesSection() {
  return (
    <section className="section-padding">
      <div className="luxury-container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {promoTiles.map((tile) => (
            <Link
              key={tile.id}
              to={tile.link}
              className="group relative aspect-[4/3] md:aspect-[16/9] overflow-hidden rounded-lg"
            >
              {/* Background Image */}
              <img
                src={tile.image}
                alt={tile.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <p className="text-primary text-xs font-medium uppercase tracking-[0.2em] mb-2">
                  {tile.subtitle}
                </p>
                <h3 className="font-serif text-2xl md:text-3xl mb-2">{tile.title}</h3>
                <p className="text-muted-foreground text-sm mb-4 max-w-xs">
                  {tile.description}
                </p>
                <div className="flex items-center gap-2 text-sm font-medium group-hover:text-primary transition-colors">
                  Shop Now
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
