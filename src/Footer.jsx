import React from "react";
import { Link } from "react-router-dom"; // Link component for internal navigation
import InstagramIcon from "@mui/icons-material/Instagram"; // Instagram icon
import FacebookIcon from "@mui/icons-material/Facebook"; // Facebook icon
import LinkedInIcon from "@mui/icons-material/LinkedIn"; // LinkedIn icon

const Footer = () => {
  const styles = {
    footer: {
      padding: "20px 0",
      backgroundColor: "#f5f5f5",
      color: "#333",
      boxShadow: "0 -4px 6px rgba(0, 0, 0, 0.1)",
    },
    columnContainer: {
      display: "flex",
      justifyContent: "space-between",
      padding: "0 50px",
      maxWidth: "1200px",
      margin: "0 auto",
    },
    column: {
      flex: "1",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      gap: "10px",
    },
    section: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "30px",
      padding: "10px 0",
      margin: "10px 0",
      borderTop: "1px solid #ddd",
    },
    link: {
      textDecoration: "none",
      color: "#333",
      transition: "color 0.3s ease",
    },
    linkHover: {
      color: "#000",
    },
    linkList: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    },
    socials: {
      display: "flex",
      gap: "20px",
      justifyContent: "center",
    },
    socialIcon: {
      color: "#333",
      fontSize: "36px",
      cursor: "pointer",
      transition: "color 0.3s ease",
    },
    socialIconHover: {
      color: "#000",
    },
    heading: {
      fontSize: "18px",
      fontWeight: "bold",
      marginBottom: "10px",
    },
    bottomText: {
      textAlign: "center",
      marginTop: "20px",
      color: "#333",
    },
  };

  return (
    <footer style={styles.footer}>
      {/* Column container to display footer sections */}
      <div style={styles.columnContainer}>
        <div style={styles.column}>
          <h3 style={styles.heading}>Explore</h3>
          <div style={styles.linkList}>
            {/* Internal navigation links */}
            <Link
              style={styles.link}
              to="/"
              onMouseEnter={(e) =>
                (e.target.style.color = styles.linkHover.color)
              }
              onMouseLeave={(e) => (e.target.style.color = styles.link.color)}
            >
              Home
            </Link>
            <Link
              style={styles.link}
              to="/questions"
              onMouseEnter={(e) =>
                (e.target.style.color = styles.linkHover.color)
              }
              onMouseLeave={(e) => (e.target.style.color = styles.link.color)}
            >
              Questions
            </Link>
            <Link
              style={styles.link}
              to="/articles"
              onMouseEnter={(e) =>
                (e.target.style.color = styles.linkHover.color)
              }
              onMouseLeave={(e) => (e.target.style.color = styles.link.color)}
            >
              Articles
            </Link>
            <Link
              style={styles.link}
              to="/videos"
              onMouseEnter={(e) =>
                (e.target.style.color = styles.linkHover.color)
              }
              onMouseLeave={(e) => (e.target.style.color = styles.link.color)}
            >
              Videos
            </Link>
          </div>
        </div>
        <div style={styles.column}>
          <h3 style={styles.heading}>Support</h3>
          <div style={styles.linkList}>
            <Link
              style={styles.link}
              to="/faq"
              onMouseEnter={(e) =>
                (e.target.style.color = styles.linkHover.color)
              }
              onMouseLeave={(e) => (e.target.style.color = styles.link.color)}
            >
              FAQs
            </Link>
            <Link
              style={styles.link}
              to="/help"
              onMouseEnter={(e) =>
                (e.target.style.color = styles.linkHover.color)
              }
              onMouseLeave={(e) => (e.target.style.color = styles.link.color)}
            >
              Help
            </Link>
            <Link
              style={styles.link}
              to="/contact"
              onMouseEnter={(e) =>
                (e.target.style.color = styles.linkHover.color)
              }
              onMouseLeave={(e) => (e.target.style.color = styles.link.color)}
            >
              Contact Us
            </Link>
          </div>
        </div>
        <div style={styles.column}>
          <h3 style={styles.heading}>Stay connected</h3>
          <div style={styles.socials}>
            {/* Social media icons */}
            <InstagramIcon
              style={styles.socialIcon}
              onMouseEnter={(e) =>
                (e.target.style.color = styles.socialIconHover.color)
              }
              onMouseLeave={(e) =>
                (e.target.style.color = styles.socialIcon.color)
              }
            />
            <FacebookIcon
              style={styles.socialIcon}
              onMouseEnter={(e) =>
                (e.target.style.color = styles.socialIconHover.color)
              }
              onMouseLeave={(e) =>
                (e.target.style.color = styles.socialIcon.color)
              }
            />
            <LinkedInIcon
              style={styles.socialIcon}
              onMouseEnter={(e) =>
                (e.target.style.color = styles.socialIconHover.color)
              }
              onMouseLeave={(e) =>
                (e.target.style.color = styles.socialIcon.color)
              }
            />
          </div>
        </div>
      </div>
      {/* Footer bottom links */}
      <div style={styles.section}>
        <Link
          style={styles.link}
          to="/privacy"
          onMouseEnter={(e) => (e.target.style.color = styles.linkHover.color)}
          onMouseLeave={(e) => (e.target.style.color = styles.link.color)}
        >
          Privacy Policy
        </Link>
        <Link
          style={styles.link}
          to="/terms"
          onMouseEnter={(e) => (e.target.style.color = styles.linkHover.color)}
          onMouseLeave={(e) => (e.target.style.color = styles.link.color)}
        >
          Terms
        </Link>
        <Link
          style={styles.link}
          to="/code-of-conduct"
          onMouseEnter={(e) => (e.target.style.color = styles.linkHover.color)}
          onMouseLeave={(e) => (e.target.style.color = styles.link.color)}
        >
          Code of Conduct
        </Link>
      </div>
      {/* Footer bottom text */}
      <div style={styles.bottomText}>
        <p>DEV@Deakin 2024</p>
      </div>
    </footer>
  );
};

export default Footer;
