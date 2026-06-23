import { Star } from 'lucide-react';

interface CardProps {
  title: string;
  image: string;
  tags?: string[];
  rating?: number;
  subtitle?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

export default function Card({ title, image, tags, rating, subtitle, onClick, children }: CardProps) {
  return (
    <div className="card" onClick={onClick}>
      <div className="card-image-wrapper">
        <img src={image} alt={title} className="card-image" />
        {rating && (
          <div className="card-rating">
            <Star size={14} fill="#FFD700" color="#FFD700" />
            <span>{rating}</span>
          </div>
        )}
      </div>
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        {subtitle && <p className="card-subtitle">{subtitle}</p>}
        {tags && tags.length > 0 && (
          <div className="card-tags">
            {tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="card-tag">{tag}</span>
            ))}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
