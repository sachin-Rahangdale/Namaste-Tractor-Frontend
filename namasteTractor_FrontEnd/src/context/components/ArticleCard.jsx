import { Link } from "react-router-dom";

export default function ArticleCard({ article }) {
  return (
    <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition">
      <img 
        src={article.mainImageUrl || "https://via.placeholder.com/300x200?text=No+Image"} 
        alt={article.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-bold text-xl line-clamp-2">{article.title}</h3>
        <p className="text-gray-600 text-sm mt-1">{article.shortDescription}</p>
        <p className="text-gray-500 text-xs mt-2">By {article.author} • {new Date(article.createdAt).toLocaleDateString()}</p>
        <Link to={`/article/${article.slug}`} className="mt-3 inline-block text-green-600 hover:underline">
          Read More →
        </Link>
      </div>
    </div>
  );
}