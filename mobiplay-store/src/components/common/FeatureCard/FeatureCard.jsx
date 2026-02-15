import "./FeatureCard.css";

/**
 * FeatureCard Component
 * ---------------------
 * A simple card to display a feature with:
 * - icon
 * - title
 * - description
 *
 * Props:
 * @param {ReactNode} icon - The icon element to display at the top
 * @param {string} title - The feature title
 * @param {string} desc - A short description of the feature
 */
const FeatureCard = ({ icon, title, desc }) => {
  return (
    <div className="feature-card">
      {/* Icon wrapper */}
      <div className="icon-wrapper">
        {icon}
      </div>

      {/* Feature title */}
      <h4>{title}</h4>

      {/* Feature description */}
      <p>{desc}</p>
    </div>
  );
};

export default FeatureCard;