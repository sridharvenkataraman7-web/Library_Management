// INITIAL MOCK DATA FOR LIBRAX SYSTEM

export const INITIAL_STUDENT_PROFILE = {
  id: "STU-2024-8842",
  name: "Madhumitha S",
  email: "madhumitha@campus.edu",
  department: "Computer Science & AI",
  year: "3rd Year B.Tech",
  studentCardStatus: "Active / Verified",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
  borrowedCount: 3,
  reservationsCount: 1,
  wishlistCount: 4,
  finesDue: 0.0,
  borrowLimit: 5
};

export const INITIAL_STUDENT = INITIAL_STUDENT_PROFILE;

export const INITIAL_LIBRARIAN_PROFILE = {
  id: "STAFF-9021",
  name: "Dr. Sarah Lin",
  email: "sarah.lin@campus.edu",
  role: "Chief Digital Librarian",
  department: "Main Campus Central Library",
  avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250",
  activeDutyFloor: "Floor 2 & Central Circulation Desk"
};

export const INITIAL_LIBRARIAN = INITIAL_LIBRARIAN_PROFILE;

export const INITIAL_WISHLIST = ["BK-101", "BK-102", "BK-104", "BK-108"];

export const INITIAL_BOOKS = [
  {
    id: "BK-101",
    title: "Deep Learning",
    author: "Ian Goodfellow, Yoshua Bengio, Aaron Courville",
    isbn: "978-0262035613",
    department: "Computer Science & AI",
    category: "Machine Learning",
    subject: "Computer Science & AI",
    publisher: "MIT Press",
    year: 2016,
    rating: 4.9,
    reviewsCount: 142,
    totalCopies: 95,
    availableCopies: 0,
    status: "Checked Out", // "Available", "Reserved", "Checked Out"
    shelf: "C-14",
    shelfBay: "Bay 3, Shelf 2",
    floor: 2,
    section: "AI & Data Systems Wing",
    coverUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600",
    synopsis: "An introduction to a broad range of topics in deep learning, covering mathematical and conceptual background, deep learning techniques used in industry, and research perspectives.",
    queue: [
      { studentId: "STU-2024-4190", name: "Reader #01", reservedAt: "2026-08-18", estReturn: "2026-08-25" },
      { studentId: "STU-2024-8842", name: "YOU (Madhumitha S)", reservedAt: "2026-08-20", estReturn: "2026-08-28" },
      { studentId: "STU-2024-9102", name: "Reader #03", reservedAt: "2026-08-21", estReturn: "2026-09-02" }
    ],
    estReturnDate: "2026-08-25",
    tags: ["neural networks", "python", "ai", "deep learning", "algorithms"],
    directions: [
      "Enter Central Library via South Main Gate",
      "Take the Central Escalator to Floor 2",
      "Head East towards the AI & Data Systems Wing",
      "Locate Aisle C, Bay 3 -> Shelf C-14"
    ]
  },
  {
    id: "BK-102",
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    isbn: "978-1449373320",
    department: "Computer Science & AI",
    category: "Distributed Systems",
    subject: "Software Engineering",
    publisher: "O'Reilly Media",
    year: 2017,
    rating: 4.95,
    reviewsCount: 230,
    totalCopies: 110,
    availableCopies: 92,
    status: "Available",
    shelf: "CS-08",
    shelfBay: "Bay 1, Shelf 4",
    floor: 2,
    section: "Systems & Architecture Aisle",
    coverUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600",
    synopsis: "The definitive guide to data system architecture, covering scalability, consistency, reliability, fault tolerance, and batch/stream processing.",
    queue: [],
    tags: ["databases", "distributed systems", "backend", "architecture", "scalability"],
    directions: [
      "Enter Central Library via South Main Gate",
      "Take Stairs or Elevator to Floor 2",
      "Turn left into Systems & Architecture Aisle",
      "Walk to Shelf CS-08 (Bay 1, Level 4)"
    ]
  },
  {
    id: "BK-103",
    title: "Artificial Intelligence: A Modern Approach",
    author: "Stuart Russell, Peter Norvig",
    isbn: "978-0134610993",
    department: "Computer Science & AI",
    category: "Core AI",
    subject: "Computer Science & AI",
    publisher: "Pearson",
    year: 2020,
    rating: 4.8,
    reviewsCount: 185,
    totalCopies: 85,
    availableCopies: 0,
    status: "Reserved",
    shelf: "C-12",
    shelfBay: "Bay 2, Shelf 1",
    floor: 2,
    section: "AI & Data Systems Wing",
    coverUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=600",
    synopsis: "The leading textbook in Artificial Intelligence used in over 1,400 universities, detailing search algorithms, knowledge representation, probabilistic reasoning, and robotics.",
    queue: [
      { studentId: "STU-2024-3321", name: "Reader #01", reservedAt: "2026-08-19", estReturn: "2026-08-24" }
    ],
    estReturnDate: "2026-08-24",
    tags: ["ai", "machine learning", "heuristics", "agents", "logic"],
    directions: [
      "Enter Central Library via Main Entrance",
      "Proceed to Floor 2 AI Section",
      "Locate Shelf C-12 in Bay 2"
    ]
  },
  {
    id: "BK-104",
    title: "Introduction to Algorithms (CLRS)",
    author: "Cormen, Leiserson, Rivest, Stein",
    isbn: "978-0262046305",
    department: "Computer Science & AI",
    category: "Algorithms & Data Structures",
    subject: "Computer Science & AI",
    publisher: "MIT Press",
    year: 2022,
    rating: 4.9,
    reviewsCount: 310,
    totalCopies: 120,
    availableCopies: 104,
    status: "Available",
    shelf: "CS-02",
    shelfBay: "Bay 4, Shelf 3",
    floor: 2,
    section: "Algorithms & Foundations Wing",
    coverUrl: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=600",
    synopsis: "Comprehensive coverage of modern algorithms, graph theory, dynamic programming, NP-completeness, and randomized algorithms.",
    queue: [],
    tags: ["algorithms", "data structures", "sorting", "graphs", "complexity"],
    directions: [
      "Take Floor 2 Central Corridor",
      "Walk straight to Foundations Wing",
      "Locate Shelf CS-02"
    ]
  },
  {
    id: "BK-105",
    title: "Hands-On Machine Learning with Scikit-Learn, Keras & TensorFlow",
    author: "Aurélien Géron",
    isbn: "978-1098125974",
    department: "Data Science",
    category: "Applied ML",
    subject: "Data Science",
    publisher: "O'Reilly Media",
    year: 2022,
    rating: 4.85,
    reviewsCount: 198,
    totalCopies: 75,
    availableCopies: 62,
    status: "Available",
    shelf: "DS-05",
    shelfBay: "Bay 2, Shelf 2",
    floor: 2,
    section: "Data Science Lab Section",
    coverUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600",
    synopsis: "Through concrete examples, minimal theory, and production-ready Python code, Géron helps you gain an intuitive understanding of concepts and tools for building intelligent systems.",
    queue: [],
    tags: ["python", "machine learning", "tensorflow", "keras", "data science"],
    directions: [
      "Go to Floor 2 Data Science Section",
      "Locate Bay 2, Shelf DS-05"
    ]
  },
  {
    id: "BK-106",
    title: "Linear Algebra and Its Applications",
    author: "Gilbert Strang",
    isbn: "978-0030105678",
    department: "Mathematics",
    category: "Applied Mathematics",
    subject: "Mathematics",
    publisher: "Cengage Learning",
    year: 2016,
    rating: 4.75,
    reviewsCount: 95,
    totalCopies: 90,
    availableCopies: 78,
    status: "Available",
    shelf: "M-09",
    shelfBay: "Bay 3, Shelf 1",
    floor: 1,
    section: "Mathematical Sciences Hall",
    coverUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=600",
    synopsis: "Renowned for its clarity, Strang's linear algebra text presents vector spaces, eigenvalues, singular value decomposition, and linear transformations with practical intuition.",
    queue: [],
    tags: ["math", "linear algebra", "matrices", "vectors", "eigenvalues"],
    directions: [
      "Stay on Floor 1 (Ground Level)",
      "Head North to Mathematical Sciences Hall",
      "Locate Shelf M-09"
    ]
  },
  {
    id: "BK-107",
    title: "Sears and Zemansky's University Physics",
    author: "Hugh D. Young, Roger A. Freedman",
    isbn: "978-0135159552",
    department: "Physics",
    category: "Classical & Quantum Physics",
    subject: "Physics",
    publisher: "Pearson",
    year: 2019,
    rating: 4.7,
    reviewsCount: 112,
    totalCopies: 105,
    availableCopies: 0,
    status: "Checked Out",
    shelf: "PHY-04",
    shelfBay: "Bay 1, Shelf 3",
    floor: 1,
    section: "Physical Sciences Wing",
    coverUrl: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=80&w=600",
    synopsis: "Comprehensive foundational physics text covering mechanics, thermodynamics, electromagnetism, optics, and relativity.",
    queue: [
      { studentId: "STU-2024-5501", name: "Reader #01", reservedAt: "2026-08-17", estReturn: "2026-08-23" }
    ],
    estReturnDate: "2026-08-23",
    tags: ["physics", "mechanics", "electromagnetism", "thermodynamics"],
    directions: [
      "Floor 1 Physical Sciences Wing",
      "Find Shelf PHY-04"
    ]
  },
  {
    id: "BK-108",
    title: "Clean Code: A Handbook of Agile Software Craftsmanship",
    author: "Robert C. Martin",
    isbn: "978-0132350884",
    department: "Computer Science & AI",
    category: "Software Design",
    subject: "Software Engineering",
    publisher: "Prentice Hall",
    year: 2008,
    rating: 4.88,
    reviewsCount: 420,
    totalCopies: 95,
    availableCopies: 82,
    status: "Available",
    shelf: "CS-11",
    shelfBay: "Bay 2, Shelf 4",
    floor: 2,
    section: "Software Design & Patterns Aisle",
    coverUrl: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=600",
    synopsis: "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees. Learn refactoring, unit testing, and design principles.",
    queue: [],
    tags: ["clean code", "refactoring", "java", "design patterns"],
    directions: [
      "Floor 2 Software Design Aisle",
      "Find Shelf CS-11"
    ]
  },
  {
    id: "BK-109",
    title: "Python for Data Analysis",
    author: "Wes McKinney",
    isbn: "978-1098104030",
    department: "Data Science",
    category: "Data Wrangling",
    subject: "Data Science",
    publisher: "O'Reilly Media",
    year: 2022,
    rating: 4.82,
    reviewsCount: 164,
    totalCopies: 80,
    availableCopies: 0,
    status: "Reserved",
    shelf: "DS-02",
    shelfBay: "Bay 3, Shelf 3",
    floor: 2,
    section: "Data Science Lab Section",
    coverUrl: "https://images.unsplash.com/photo-1526379879527-8559ecfcaec0?auto=format&fit=crop&q=80&w=600",
    synopsis: "Get complete instructions for manipulating, processing, cleaning, and crunching datasets in Python using pandas, NumPy, and Jupyter.",
    queue: [
      { studentId: "STU-2024-9981", name: "Reader #01", reservedAt: "2026-08-20", estReturn: "2026-08-27" }
    ],
    estReturnDate: "2026-08-27",
    tags: ["pandas", "numpy", "python", "data analysis"],
    directions: [
      "Floor 2 Data Science Section",
      "Shelf DS-02"
    ]
  },
  {
    id: "BK-110",
    title: "Principles of Corporate Finance",
    author: "Richard Brealey, Stewart Myers",
    isbn: "978-1260013900",
    department: "Management",
    category: "Finance & Economics",
    subject: "Management",
    publisher: "McGraw-Hill",
    year: 2020,
    rating: 4.7,
    reviewsCount: 88,
    totalCopies: 115,
    availableCopies: 98,
    status: "Available",
    shelf: "MGT-04",
    shelfBay: "Bay 1, Shelf 2",
    floor: 3,
    section: "Management & Economics Hall",
    coverUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600",
    synopsis: "Describes the theory and practice of corporate finance, focusing on financial decision making, capital structure, and risk valuation.",
    queue: [],
    tags: ["finance", "business", "economics", "management"],
    directions: [
      "Take Elevator to Floor 3",
      "Management & Economics Hall",
      "Shelf MGT-04"
    ]
  }
];

export const INITIAL_STUDENT_LOANS = [
  {
    id: "LOAN-1001",
    bookId: "BK-102",
    bookTitle: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    issuedDate: "2026-08-10",
    dueDate: "2026-08-24",
    daysLeft: 2,
    shelf: "CS-08",
    coverUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "LOAN-1002",
    bookId: "BK-108",
    bookTitle: "Clean Code: Software Craftsmanship",
    author: "Robert C. Martin",
    issuedDate: "2026-08-12",
    dueDate: "2026-08-26",
    daysLeft: 4,
    shelf: "CS-11",
    coverUrl: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=600"
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: "NOTIF-01",
    title: "Reservation Available for Pickup! 📚",
    message: "Your hold for 'Deep Learning' (BK-101) is ready at Central Library Desk Counter #2.",
    timestamp: "10 mins ago",
    isRead: false,
    pickupLocation: "Central Library Desk - Counter #2"
  },
  {
    id: "NOTIF-02",
    title: "Loan Renewal Reminder ⏰",
    message: "'Designing Data-Intensive Applications' is due in 2 days. Click to renew for 14 days.",
    timestamp: "2 hours ago",
    isRead: false,
    pickupLocation: null
  },
  {
    id: "NOTIF-03",
    title: "Queue Position Advanced! 🚀",
    message: "You moved up to Position #1 in the queue for 'Artificial Intelligence: A Modern Approach'.",
    timestamp: "1 day ago",
    isRead: true,
    pickupLocation: null
  }
];

export const INITIAL_FLOOR_MAPS = [
  {
    floor: 1,
    name: "Floor 1 - Physical Sciences, Mathematics & General Library Desk",
    sections: ["Mathematical Sciences Hall", "Physical Sciences Wing", "Central Library Counter"],
    shelves: [
      { code: "M-09", subject: "Linear Algebra & Vector Calculus", status: "Active" },
      { code: "M-12", subject: "Probability & Stochastic Processes", status: "Active" },
      { code: "PHY-04", subject: "University Physics & Quantum Mechanics", status: "Active" },
      { code: "PHY-08", subject: "Thermodynamics & Electromagnetism", status: "Active" }
    ]
  },
  {
    floor: 2,
    name: "Floor 2 - Computer Science, AI & Data Systems Center",
    sections: ["AI & Data Systems Wing", "Systems & Architecture Aisle", "Algorithms Wing"],
    shelves: [
      { code: "C-14", subject: "Deep Learning & Neural Networks", status: "Target" },
      { code: "CS-08", subject: "Distributed Systems & Data Architectures", status: "Active" },
      { code: "C-12", subject: "Core AI & Search Algorithms", status: "Active" },
      { code: "CS-02", subject: "Algorithms & Complexity Theory (CLRS)", status: "Active" },
      { code: "DS-05", subject: "Machine Learning & TensorFlow", status: "Active" },
      { code: "CS-11", subject: "Clean Code & Agile Design", status: "Active" }
    ]
  },
  {
    floor: 3,
    name: "Floor 3 - Management, Economics & Quiet Study Zones",
    sections: ["Management & Economics Hall", "Research Reading Rooms"],
    shelves: [
      { code: "MGT-04", subject: "Corporate Finance & Valuation", status: "Active" },
      { code: "MGT-10", subject: "Strategic Operations & Supply Chain", status: "Active" }
    ]
  }
];
