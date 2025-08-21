import React, { useState } from 'react';
import styles from './CandidateCard.module.css';
import { getCandidatePhoto, getInitials } from '../utils/photoMapping';

const CandidateCard = ({ candidate, isTop10 }) => {
  const { name, totalCount, totalValue, position } = candidate;
  
  // Get candidate photo and initials
  const photoUrl = getCandidatePhoto(name);
  const initials = getInitials(name);
  
  // State for image loading error
  const [imageError, setImageError] = useState(false);
  
  // Determine card color based on position
  const cardBgColor = isTop10 ? "#e8f5e8" : "#fff5e6"; // Light orange-yellow for trailing candidates
  const borderColor = isTop10 ? "#2E8B57" : "#ffa726"; // Orange border for trailing candidates

  return (
    <div 
      className={styles.candidateCard}
      style={{
        border: `3px solid ${borderColor}`,
        backgroundColor: cardBgColor
      }}
    >
      {/* Position Number */}
      <div className={styles.positionNumber}>
        {position || 'N/A'}
      </div>
      
      {/* Header */}
      <div 
        className={styles.cardHeader}
        style={{ backgroundColor: borderColor }}
      >
        {name.toUpperCase()}
      </div>
      
      {/* Card Body */}
      <div className={styles.cardBody}>
        <div className={styles.cardContent}>
          {/* Profile Photo */}
          <div className={styles.profilePhoto}>
            {photoUrl && !imageError ? (
              <img 
                src={photoUrl} 
                alt={name}
                onError={() => setImageError(true)}
                className={styles.candidatePhoto}
              />
            ) : (
              <div className={styles.photoFallback}>
                {initials}
              </div>
            )}
          </div>
          
          {/* Vote Information */}
          <div className={styles.voteInfo}>
            <div className={styles.voteStats}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Total Count:</span>
                <span className={styles.statValue}>{totalCount}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Total Value:</span>
                <span className={styles.statValue}>{totalValue}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateCard;