import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const collections = [
  {
    id: 1,
    name: 'Abayas',
    image: '/images/product-hero-1.jpeg',
    link: '/shop?category=abayas',
    count: '45+ Styles',
  },
  {
    id: 2,
    name: 'Kaftans',
    image: '/images/product-hero-2.jpeg',
    link: '/shop?category=kaftans',
    count: '30+ Styles',
  },
  {
    id: 3,
    name: 'Sets',
    image: '/images/product-showcase-1.jpeg',
    link: '/shop?category=sets',
    count: '20+ Styles',
  },
];

export function FavoriteCollectionsSection() {
  return (
    <section className="section-padding">
      <div className="luxury-container">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-primary text-sm font-medium uppercase tracking-[0.2em] mb-3">
            Explore
          </p>
          <h2 className="font-serif text-3xl md:text-4xl">Favorite Collections</h2>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {collections.map((collection, index) => (
            <Link
              key={collection.id}
              to={collection.link}
              className="group relative aspect-[3/4] overflow-hidden rounded-lg animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image */}
              <img
                src={collection.image}
                alt={collection.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <p className="text-xs text-primary uppercase tracking-wider mb-1">
                  {collection.count}
                </p>
                <h3 className="font-serif text-2xl mb-3">{collection.name}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  Explore
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
