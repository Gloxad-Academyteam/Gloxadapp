import Button from "@components/Button";
import useFilterBy from "../hooks/useFilterBy";
import Stars from "@components/Stars/Stars";

const FilterBy = () => {
  const {
    currentRating,
    handleRatingChange,
    handleClearFilter,
    handleLanguageChange,
    currentLanguage,
  } = useFilterBy();

  return (
    <div className="flex flex-col gap-[20px]">
      <div className="flex flex-col gap-[20px]">
        <p className="font-bold text-body-large">Rating</p>
        {[5, 4, 3, 2, 1].map((rating) => (
          <div key={rating} className="flex gap-[10px]">
            <input
              type="radio"
              id={`rating-${rating}`}
              name="rating"
              onChange={() => handleRatingChange(rating)}
              checked={currentRating === rating}
            />
            <label htmlFor={`rating-${rating}`}>
              <Stars rating={rating} />
            </label>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-[20px]">
        <p className="font-bold text-body-large">Language</p>
        {["English", "Spanish", "French", "German", "Italian"].map(
          (language) => (
            <div key={language} className="flex gap-[10px]">
              <input
                type="radio"
                id={`language-${language}`}
                name="language"
                onChange={() => handleLanguageChange(language)}
                checked={currentLanguage === language}
              />
              <label htmlFor={`language-${language}`}>{language}</label>
            </div>
          )
        )}
      </div>

      <Button text="Clear Filter" onClick={handleClearFilter} ghost />
    </div>
  );
};

export default FilterBy;
