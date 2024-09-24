import React from "react";

const HeaderImage = () => {
  const styles = {
    imageContainer: {
      height: "50vh",
    },
    image: {
      height: "100%",
      width: "100%",
      objectFit: "cover",
      objectPosition: "center",
    },
  };

  return (
    <div style={styles.imageContainer}>
      <img src="/images/BannerImage.jpg" alt="Header" style={styles.image} />
    </div>
  );
};

export default HeaderImage;
