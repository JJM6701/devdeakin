import React, { useEffect, useState, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { db, auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  getDoc,
} from "firebase/firestore";
import axios from "axios";
import CommentSection from "./CommentSection";

const FindQuestionPage = () => {
  const [questions, setQuestions] = useState([]);
  const [userNames, setUserNames] = useState({});
  const [filters, setFilters] = useState({ title: "", tag: "", date: "" });
  const [expandedQuestions, setExpandedQuestions] = useState(new Set());
  const [debouncedFilters, setDebouncedFilters] = useState(filters);
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [aiAnswers, setAiAnswers] = useState({});

  useEffect(() => {
    const fetchQuestions = async () => {
      const q = query(collection(db, "posts"), where("type", "==", "question"));
      const querySnapshot = await getDocs(q);
      const fetchedQuestions = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const date = data.date?.toDate
          ? data.date.toDate()
          : new Date(data.date);
        return {
          ...data,
          id: doc.id,
          formattedDate: date.toISOString().split("T")[0],
        };
      });
      setQuestions(fetchedQuestions);

      const uniqueUids = [
        ...new Set(fetchedQuestions.map((question) => question.createdBy)),
      ];

      const userNamesMap = {};
      for (const uid of uniqueUids) {
        const userDoc = await getDoc(doc(db, "users", uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          userNamesMap[uid] = `${userData.firstName} ${userData.lastName}`;
        } else {
          userNamesMap[uid] = "Unknown";
        }
      }

      setUserNames(userNamesMap);
    };

    const fetchUserStatus = () => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const userData = userSnap.data();
            if (userData.plan === "premium") {
              setIsPremiumUser(true);
            } else {
            }
          } else {
          }
        } else {
          setIsPremiumUser(false);
        }
      });
    };

    fetchQuestions();
    fetchUserStatus();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const filteredQuestions = useMemo(() => {
    const { title, tag, date } = debouncedFilters;
    return questions.filter((question) => {
      const matchesTitle = question.title
        .toLowerCase()
        .includes(title.toLowerCase());
      const matchesTag =
        question.tags &&
        question.tags.toLowerCase().includes(tag.toLowerCase());

      const matchesDate = !date || question.formattedDate === date;

      return matchesTitle && matchesTag && matchesDate;
    });
  }, [debouncedFilters, questions]);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "posts", id));
    setQuestions(questions.filter((question) => question.id !== id));
  };

  const toggleExpand = (id) => {
    setExpandedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const generateAiAnswer = async (questionId, questionCode) => {
    try {
      const response = await axios.post(
        "/.netlify/functions/generate_ai_answer",
        {
          prompt: questionCode,
        }
      );

      const aiAnswer = response.data.answer;

      setAiAnswers((prevAnswers) => ({
        ...prevAnswers,
        [questionId]: aiAnswer,
      }));
    } catch (error) {
      console.error("Error generating AI answer:", error);
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
      fontSize: "24px",
      color: "#333",
    },
    filter: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "20px",
    },
    filterInput: {
      padding: "10px",
      border: "1px solid #ccc",
      borderRadius: "3px",
      width: "30%",
    },
    questionList: {
      listStyle: "none",
      padding: 0,
    },
    card: {
      backgroundColor: "#f9f9f9",
      padding: "15px",
      margin: "10px 0",
      borderRadius: "5px",
      boxShadow: "0 0 5px rgba(0, 0, 0, 0.05)",
      cursor: "pointer",
    },
    cardExpanded: {
      display: "block",
    },
    cardDetails: {
      display: "none",
      marginTop: "10px",
    },
    button: {
      display: "inline-block",
      padding: "10px",
      backgroundColor: "lightskyblue",
      color: "white",
      border: "none",
      borderRadius: "3px",
      cursor: "pointer",
      fontSize: "14px",
      marginRight: "10px",
    },
    buttonHover: {
      backgroundColor: "lightblue",
    },
    codeBlock: {
      border: "1px solid #ccc",
      padding: "10px",
      borderRadius: "3px",
      backgroundColor: "#f9f9f9",
      marginBottom: "10px",
    },
    aiAnswer: {
      margin: "10px 0",
      padding: "10px",
      backgroundColor: "#f1f1f1",
      borderRadius: "5px",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Find Questions</h2>

      <div style={styles.filter}>
        <input
          type="text"
          name="title"
          placeholder="Filter by title"
          value={filters.title}
          onChange={handleFilterChange}
          style={styles.filterInput}
        />
        <input
          type="text"
          name="tag"
          placeholder="Filter by tag"
          value={filters.tag}
          onChange={handleFilterChange}
          style={styles.filterInput}
        />
        <input
          type="date"
          name="date"
          value={filters.date}
          onChange={handleFilterChange}
          style={styles.filterInput}
        />
      </div>

      <ul style={styles.questionList}>
        {filteredQuestions.map((question) => {
          const isExpanded = expandedQuestions.has(question.id);
          const userFullName = userNames[question.createdBy] || "Unknown";

          return (
            <li
              key={question.id}
              style={{
                ...styles.card,
                ...(isExpanded ? styles.cardExpanded : {}),
              }}
              onClick={() => toggleExpand(question.id)}
            >
              <h3>{question.title}</h3>

              {isExpanded && (
                <>
                  <p>{question.description}</p>

                  {question.fileUrl && (
                    <div style={{ marginBottom: "10px" }}>
                      <img
                        src={question.fileUrl}
                        alt="Question-related visual"
                        style={{ maxWidth: "100%", borderRadius: "5px" }}
                      />
                    </div>
                  )}

                  {question.code && (
                    <div style={styles.codeBlock}>
                      <h4>Code:</h4>
                      <ReactMarkdown>{`\`\`\`javascript\n${question.code}\n\`\`\``}</ReactMarkdown>
                    </div>
                  )}

                  {question.createdBy && (
                    <p>
                      <strong>Posted by:</strong> {userFullName}
                    </p>
                  )}

                  <div className="details" style={styles.cardDetails}>
                    <p>
                      <strong>Tags:</strong> {question.tags}
                    </p>
                    <p>
                      <strong>Date:</strong> {question.formattedDate}
                    </p>
                  </div>

                  {isPremiumUser && (
                    <button
                      style={styles.button}
                      onClick={(e) => {
                        e.stopPropagation();
                        generateAiAnswer(question.id, question.code);
                      }}
                    >
                      Generate AI Answer
                    </button>
                  )}

                  {aiAnswers[question.id] && (
                    <div style={styles.aiAnswer}>
                      <strong>AI Answer:</strong>
                      <p>{aiAnswers[question.id]}</p>
                    </div>
                  )}

                  <button
                    style={styles.button}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(question.id);
                    }}
                  >
                    Delete
                  </button>

                  <div onClick={(e) => e.stopPropagation()}>
                    {" "}
                    <CommentSection postId={question.id} />
                  </div>
                </>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default FindQuestionPage;
