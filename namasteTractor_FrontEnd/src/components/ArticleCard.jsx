import { useNavigate } from "react-router-dom";

const ArticleCard = ({ article }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/articles/${article.slug}`);
  };

  return (
    <div
      onClick={handleClick}
      className="border rounded-lg p-4 shadow hover:shadow-xl transition cursor-pointer"
    >
      {/* 🖼️ IMAGE */}
      <img
        src={
          article.mainImageUrl ||
          "https://via.placeholder.com/300x200?text=No+Image"
        }
        alt={article.title}
        className="w-full h-40 object-cover rounded mb-3"
      />

      {/* 📰 TITLE */}
      <h2 className="text-lg font-bold mb-1 line-clamp-2">
        {article.title}
      </h2>

      {/* 👤 AUTHOR */}
      <p className="text-sm text-gray-500 mb-1">
        By {article.author}
      </p>

      {/* 📅 DATE */}
      <p className="text-xs text-gray-400">
        {new Date(article.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
};

export default ArticleCard;