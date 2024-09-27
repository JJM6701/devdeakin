import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Hook for navigation
import { auth, db, storage } from "./firebase"; // Firebase services
import { onAuthStateChanged } from "firebase/auth"; // Firebase auth state listener
import { collection, addDoc } from "firebase/firestore"; // Firestore methods for adding documents
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Firebase storage methods for file upload
import { UnControlled as CodeMirror } from "react-codemirror2"; // CodeMirror for code editing
import ReactMarkdown from "react-markdown"; // Markdown rendering
import "codemirror/lib/codemirror.css"; // CodeMirror styles
import "codemirror/theme/material.css"; // CodeMirror theme
import "codemirror/mode/javascript/javascript"; // CodeMirror JavaScript mode

const NewPostPage = () => {
  const [postType, setPostType] = useState("question"); // State for selecting post type
  const navigate = useNavigate(); // Hook for navigating pages
  const [user, setUser] = useState(null); // State to store the current user

  useEffect(() => {
    // Listen for authentication state changes and redirect if not logged in
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate("/login");
      } else {
        setUser(currentUser); // Set the user state if authenticated
      }
    });
    return () => unsubscribe(); // Clean up the listener on unmount
  }, [navigate]);

  const handlePostTypeChange = (type) => {
    setPostType(type); // Update the selected post type
  };

  const handleSubmit = async (post, file) => {
    try {
      let fileUrl = "";
      if (file) {
        // Upload the file to Firebase storage and get the URL
        const storageRef = ref(storage, `${post.type}/${file.name}`);
        await uploadBytes(storageRef, file);
        fileUrl = await getDownloadURL(storageRef);
      }

      const postData = {
        ...post,
        fileUrl,
        date: new Date(),
        createdBy: user.uid, // Add the user ID to the post data
      };

      // Add the post data to Firestore
      await addDoc(collection(db, "posts"), postData);
      alert("Post saved successfully!");
      navigate("/"); // Redirect to the homepage after successful submission
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const styles = {
    container: {
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#fff",
      maxWidth: "800px",
      margin: "100px auto",
      padding: "20px 30px",
      borderRadius: "5px",
      boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    },
    header: {
      margin: "20px",
      textAlign: "center",
    },
    label: {
      margin: "15px",
    },
    radio: {
      margin: "5px",
    },
    inputText: {
      width: "100%",
      padding: "10px",
      marginTop: "10px",
      marginBottom: "20px",
      border: "1px solid #ccc",
      borderRadius: "3px",
      boxSizing: "border-box",
    },
    textarea: {
      width: "100%",
      padding: "10px",
      marginTop: "10px",
      marginBottom: "20px",
      border: "1px solid #ccc",
      borderRadius: "3px",
      boxSizing: "border-box",
    },
    fileInput: {
      marginTop: "10px",
      marginBottom: "20px",
    },
    button: {
      display: "block",
      width: "100%",
      padding: "10px",
      backgroundColor: "#333",
      color: "white",
      border: "none",
      borderRadius: "3px",
      cursor: "pointer",
      fontSize: "16px",
    },
    subheader: {
      marginBottom: "10px",
      fontSize: "16px",
      color: "#333",
    },
  };

  return (
    user && (
      <div style={styles.container}>
        <h2 style={styles.header}>New Post</h2>
        <div>
          {/* Radio buttons to select the type of post */}
          <label style={styles.label}>
            <input
              type="radio"
              name="postType"
              value="question"
              checked={postType === "question"}
              onChange={() => handlePostTypeChange("question")}
              style={styles.radio}
            />
            Question
          </label>
          <label style={styles.label}>
            <input
              type="radio"
              name="postType"
              value="article"
              checked={postType === "article"}
              onChange={() => handlePostTypeChange("article")}
              style={styles.radio}
            />
            Article
          </label>
          <label style={styles.label}>
            <input
              type="radio"
              name="postType"
              value="video"
              checked={postType === "video"}
              onChange={() => handlePostTypeChange("video")}
              style={styles.radio}
            />
            Tutorial
          </label>
        </div>

        {/* Render different forms based on the selected post type */}
        {postType === "question" ? (
          <QuestionForm handleSubmit={handleSubmit} styles={styles} />
        ) : postType === "article" ? (
          <ArticleForm handleSubmit={handleSubmit} styles={styles} />
        ) : (
          <VideoForm handleSubmit={handleSubmit} styles={styles} />
        )}
      </div>
    )
  );
};

// Form for creating a question post
const QuestionForm = ({ handleSubmit, styles }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [code, setCode] = useState("");
  const [image, setImage] = useState(null);

  const handleFileChange = (e) => {
    setImage(e.target.files[0]); // Set the uploaded image
  };

  const handleFormSubmit = () => {
    const post = { title, description, tags, code, type: "question" };
    handleSubmit(post, image); // Submit the question post data
  };

  return (
    <div>
      <h3 style={styles.subheader}>Ask your question</h3>
      <input
        type="text"
        placeholder="Enter the question title"
        style={styles.inputText}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Describe your question"
        style={styles.textarea}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>
      <input
        type="text"
        placeholder="Add tags"
        style={styles.inputText}
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />
      {/* Code editor for the code section */}
      <div style={{ margin: "10px 0" }}>
        <h4>Write your code:</h4>
        <CodeMirror
          value={code}
          options={{
            mode: "javascript",
            theme: "material",
            lineNumbers: true,
          }}
          onChange={(editor, data, value) => setCode(value)}
        />
      </div>
      {/* Preview the entered code */}
      <div style={{ margin: "10px 0" }}>
        <h4>Preview:</h4>
        <div
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            borderRadius: "3px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <ReactMarkdown>{`\`\`\`javascript\n${code}\n\`\`\``}</ReactMarkdown>
        </div>
      </div>
      <input type="file" style={styles.fileInput} onChange={handleFileChange} />
      <button style={styles.button} onClick={handleFormSubmit}>
        Post
      </button>
    </div>
  );
};

// Form for creating an article post
const ArticleForm = ({ handleSubmit, styles }) => {
  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState(null);

  const handleFileChange = (e) => {
    setImage(e.target.files[0]); // Set the uploaded image
  };

  const handleFormSubmit = () => {
    const post = { title, abstract, content, tags, type: "article" };
    handleSubmit(post, image); // Submit the article post data
  };

  return (
    <div>
      <h3 style={styles.subheader}>Share an article</h3>
      <input
        type="text"
        placeholder="Enter a descriptive title"
        style={styles.inputText}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Enter a 1 paragraph abstract"
        style={styles.textarea}
        value={abstract}
        onChange={(e) => setAbstract(e.target.value)}
      ></textarea>
      <textarea
        placeholder="Enter the full article"
        style={styles.textarea}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></textarea>
      <input
        type="text"
        placeholder="Add tags"
        style={styles.inputText}
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />
      <input type="file" style={styles.fileInput} onChange={handleFileChange} />
      <button style={styles.button} onClick={handleFormSubmit}>
        Post
      </button>
    </div>
  );
};

// Form for creating a video post
const VideoForm = ({ handleSubmit, styles }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [video, setVideo] = useState(null);

  const handleFileChange = (e) => {
    setVideo(e.target.files[0]); // Set the uploaded video
  };

  const handleFormSubmit = () => {
    const post = {
      title,
      description,
      tags,
      type: "video",
      views: 0,
      likes: 0,
      dislikes: 0,
    };
    handleSubmit(post, video); // Submit the video post data
  };

  return (
    <div>
      <h3 style={styles.subheader}>Upload your Tutorial</h3>
      <input
        type="text"
        placeholder="Enter a descriptive title"
        style={styles.inputText}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Enter a description"
        style={styles.textarea}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>
      <input
        type="text"
        placeholder="Add tags"
        style={styles.inputText}
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />
      <input
        type="file"
        accept="video/*"
        style={styles.fileInput}
        onChange={handleFileChange}
      />
      <button style={styles.button} onClick={handleFormSubmit}>
        Upload Tutorial
      </button>
    </div>
  );
};

export default NewPostPage;
