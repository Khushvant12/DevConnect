import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Project from './models/Project.js';
import Comment from './models/Comment.js';
import { connectDB } from './config/db.js';

dotenv.config();

const dummyEmails = [
  'alex.rivera@example.com',
  'sarah.chen@example.com',
  'marcus.j@example.com',
  'elena.r@example.com',
  'sid.m@example.com',
  'chloe.d@example.com',
  'yuki.t@example.com',
  'liam.oc@example.com'
];

const seedData = async () => {
  try {
    await connectDB();
    console.log('Connected to database. Starting cleanup of dummy data...');

    // Find any existing dummy users
    const existingDummyUsers = await User.find({ email: { $in: dummyEmails } });
    const dummyUserIds = existingDummyUsers.map(u => u._id);

    if (dummyUserIds.length > 0) {
      // Find all projects created by these dummy users
      const dummyProjects = await Project.find({ createdBy: { $in: dummyUserIds } });
      const dummyProjectIds = dummyProjects.map(p => p._id);

      // Delete comments associated with dummy projects or created by dummy users
      const deletedComments = await Comment.deleteMany({
        $or: [
          { user: { $in: dummyUserIds } },
          { project: { $in: dummyProjectIds } }
        ]
      });
      console.log(`Deleted ${deletedComments.deletedCount} existing dummy comments.`);

      // Delete dummy projects
      const deletedProjects = await Project.deleteMany({ createdBy: { $in: dummyUserIds } });
      console.log(`Deleted ${deletedProjects.deletedCount} existing dummy projects.`);

      // Delete dummy users
      const deletedUsers = await User.deleteMany({ email: { $in: dummyEmails } });
      console.log(`Deleted ${deletedUsers.deletedCount} existing dummy users.`);
    }

    console.log('Inserting new dummy users...');

    // Note: The User model pre-save hook handles hashing passwords
    const users = [
      {
        name: 'Alex Rivera',
        email: 'alex.rivera@example.com',
        username: 'alex_dev',
        password: 'password123',
        bio: 'Full Stack Engineer passionate about React, Node.js, and scaling web applications. Always looking for design-minded collaborators!',
        skills: ['React', 'Node.js', 'Express', 'MongoDB', 'TypeScript', 'Tailwind CSS'],
        techStack: ['React', 'Node.js', 'Express', 'MongoDB'],
        interests: ['SaaS', 'Open Source', 'Web3'],
        location: 'San Francisco, CA',
        company: 'TechCorp',
        experienceLevel: 'senior',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
        profileCompletedAt: new Date()
      },
      {
        name: 'Sarah Chen',
        email: 'sarah.chen@example.com',
        username: 'sarah_ai',
        password: 'password123',
        bio: 'AI Researcher and Machine Learning Engineer. Building intelligent agents and working on NLP and computer vision problems.',
        skills: ['Python', 'PyTorch', 'TensorFlow', 'FastAPI', 'Docker', 'Machine Learning'],
        techStack: ['Python', 'FastAPI', 'PyTorch'],
        interests: ['AI', 'Deep Learning', 'Automation'],
        location: 'Boston, MA',
        company: 'MIT Lab',
        experienceLevel: 'lead',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        profileCompletedAt: new Date()
      },
      {
        name: 'Marcus Johnson',
        email: 'marcus.j@example.com',
        username: 'marcus_codes',
        password: 'password123',
        bio: 'Mobile App Developer specialized in React Native and Flutter. Designing smooth user interfaces and offline-first mobile apps.',
        skills: ['React Native', 'Flutter', 'iOS', 'Android', 'Firebase', 'Redux'],
        techStack: ['React Native', 'Firebase'],
        interests: ['Mobile UI', 'Game Dev', 'UX Design'],
        location: 'Austin, TX',
        company: 'Freelance',
        experienceLevel: 'mid',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        profileCompletedAt: new Date()
      },
      {
        name: 'Elena Rostova',
        email: 'elena.r@example.com',
        username: 'elena_ui',
        password: 'password123',
        bio: 'Product Designer and UI/UX developer. Turning wireframes into beautiful, accessible React web interfaces.',
        skills: ['Figma', 'UI/UX', 'CSS', 'Tailwind CSS', 'React', 'HTML5'],
        techStack: ['React', 'Tailwind CSS'],
        interests: ['Design Systems', 'Web Accessibility', 'Animation'],
        location: 'Berlin, Germany',
        company: 'PixelPerfect Studio',
        experienceLevel: 'junior',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
        profileCompletedAt: new Date()
      },
      {
        name: 'Siddharth Mehta',
        email: 'sid.m@example.com',
        username: 'sid_devops',
        password: 'password123',
        bio: 'DevOps Engineer and Cloud Architect. Docker, Kubernetes, AWS, and CI/CD pipelines expert. Automating everything.',
        skills: ['Docker', 'Kubernetes', 'AWS', 'Terraform', 'CI/CD', 'Bash', 'Linux'],
        techStack: ['Docker', 'Kubernetes', 'AWS'],
        interests: ['Cloud Native', 'Automation', 'Security'],
        location: 'Mumbai, India',
        company: 'CloudOps Solutions',
        experienceLevel: 'senior',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
        profileCompletedAt: new Date()
      },
      {
        name: 'Chloe Dupont',
        email: 'chloe.d@example.com',
        username: 'chloe_blockchain',
        password: 'password123',
        bio: 'Smart Contract Developer and Cryptographer. Building decentralized applications (dApps) and exploring layer-2 scaling.',
        skills: ['Solidity', 'Ethereum', 'Web3.js', 'Hardhat', 'TypeScript', 'Rust'],
        techStack: ['Solidity', 'TypeScript'],
        interests: ['DeFi', 'Web3', 'DAOs'],
        location: 'Paris, France',
        company: 'Decentral Lab',
        experienceLevel: 'mid',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        profileCompletedAt: new Date()
      },
      {
        name: 'Yuki Tanaka',
        email: 'yuki.t@example.com',
        username: 'yuki_games',
        password: 'password123',
        bio: 'Indie Game Developer and Creative Coder. Passionate about WebGL, physics engines, and pixel art.',
        skills: ['Three.js', 'WebGL', 'C#', 'Unity', 'JavaScript', 'GLSL'],
        techStack: ['Three.js', 'JavaScript'],
        interests: ['Game Jam', 'Creative Coding', '3D Web'],
        location: 'Tokyo, Japan',
        company: 'Self-Employed',
        experienceLevel: 'junior',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
        profileCompletedAt: new Date()
      },
      {
        name: "Liam O'Connor",
        email: 'liam.oc@example.com',
        username: 'liam_go',
        password: 'password123',
        bio: 'Backend Engineer writing highly concurrent services in Go. Open source contributor and systems programming enthusiast.',
        skills: ['Go', 'gRPC', 'PostgreSQL', 'Redis', 'Kafka', 'Linux'],
        techStack: ['Go', 'PostgreSQL', 'Redis'],
        interests: ['Distributed Systems', 'Concurrency', 'High Performance'],
        location: 'Dublin, Ireland',
        company: 'ScaleTech',
        experienceLevel: 'senior',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
        profileCompletedAt: new Date()
      }
    ];

    const createdUsers = await User.create(users);
    console.log(`Inserted ${createdUsers.length} dummy users.`);

    // Map username to inserted User objects
    const userMap = createdUsers.reduce((acc, user) => {
      acc[user.username] = user;
      return acc;
    }, {});

    console.log('Inserting new dummy projects...');

    const projects = [
      {
        title: 'DevConnect - Developer Collaboration Platform',
        description: 'A social and professional network designed specifically for developers to find project collaborators, build teams, and chat in real-time. Features real-time typing indicators, project category filtering, and smart skill-matching algorithms.',
        techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'Socket.io', 'Tailwind CSS'],
        githubLink: 'https://github.com/alexdev/devconnect',
        liveDemoLink: 'https://devconnect-showcase.vercel.app',
        category: 'web',
        difficulty: 'advanced',
        teamSize: 4,
        thumbnail: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80',
        createdBy: userMap['alex_dev']._id,
        likes: [userMap['sarah_ai']._id, userMap['marcus_codes']._id, userMap['sid_devops']._id]
      },
      {
        title: 'CodeSense AI - Intelligent Code Reviewer',
        description: 'An open-source AI assistant that integrates into GitHub PR pipelines to review code quality, detect security vulnerabilities, suggest performance improvements, and generate automated tests.',
        techStack: ['Python', 'FastAPI', 'PyTorch', 'Docker', 'OpenAI API'],
        githubLink: 'https://github.com/sarah-ai/codesense',
        liveDemoLink: 'https://codesense-ai.demo',
        category: 'ai-ml',
        difficulty: 'advanced',
        teamSize: 3,
        thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
        createdBy: userMap['sarah_ai']._id,
        likes: [userMap['alex_dev']._id, userMap['liam_go']._id]
      },
      {
        title: 'FitPulse - Offline-First Fitness Tracker',
        description: 'A clean and beautiful mobile application built to track daily workouts, log water intake, and visualize performance over time. Runs fully offline and syncs with SQLite database.',
        techStack: ['React Native', 'Expo', 'SQLite', 'Tailwind CSS'],
        githubLink: 'https://github.com/marcuscodes/fitpulse',
        liveDemoLink: '',
        category: 'mobile',
        difficulty: 'intermediate',
        teamSize: 2,
        thumbnail: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
        createdBy: userMap['marcus_codes']._id,
        likes: [userMap['elena_ui']._id]
      },
      {
        title: 'AnimaCSS - Micro-interaction Animation Library',
        description: 'A lightweight utility-first CSS library containing performance-optimized transitions and interactive hover micro-animations for modern web layouts. Designed to improve user engagement by keeping elements responsive and alive.',
        techStack: ['CSS', 'HTML5', 'Vite', 'React'],
        githubLink: 'https://github.com/elena-ui/animacss',
        liveDemoLink: 'https://animacss.dev',
        category: 'open-source',
        difficulty: 'beginner',
        teamSize: 1,
        thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80',
        createdBy: userMap['elena_ui']._id,
        likes: [userMap['alex_dev']._id, userMap['elena_ui']._id, userMap['yuki_games']._id]
      },
      {
        title: 'KubeDeploy - GitOps Deployment Dashboard',
        description: 'A visual GitOps monitoring dashboard for Kubernetes clusters. Syncs with ArgoCD and displays real-time status of deployments, pods, and logs with single-click rollbacks.',
        techStack: ['Kubernetes', 'Go', 'React', 'Docker', 'gRPC'],
        githubLink: 'https://github.com/siddevops/kubedeploy',
        liveDemoLink: '',
        category: 'devops',
        difficulty: 'advanced',
        teamSize: 3,
        thumbnail: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=600&q=80',
        createdBy: userMap['sid_devops']._id,
        likes: [userMap['alex_dev']._id, userMap['liam_go']._id]
      },
      {
        title: 'TrustVote - Decentralized Voting Platform',
        description: 'An Ethereum-based transparent voting dApp using quadratic voting mechanisms. Ensures voter privacy through zero-knowledge proofs and prevents double-voting.',
        techStack: ['Solidity', 'Hardhat', 'React', 'Web3.js', 'Tailwind CSS'],
        githubLink: 'https://github.com/chloe-blockchain/trustvote',
        liveDemoLink: 'https://trustvote.eth',
        category: 'blockchain',
        difficulty: 'advanced',
        teamSize: 4,
        thumbnail: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=600&q=80',
        createdBy: userMap['chloe_blockchain']._id,
        likes: [userMap['alex_dev']._id, userMap['sid_devops']._id]
      },
      {
        title: 'WebAsteroids 3D - Three.js Space Shooter',
        description: 'An interactive, GPU-accelerated retro space shooter game playable directly in the browser. Features procedural asteroid generation and dynamic lighting using custom shaders.',
        techStack: ['Three.js', 'JavaScript', 'HTML5', 'GLSL', 'Webpack'],
        githubLink: 'https://github.com/yukigames/webasteroids',
        liveDemoLink: 'https://asteroids3d.play',
        category: 'game',
        difficulty: 'intermediate',
        teamSize: 1,
        thumbnail: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=600&q=80',
        createdBy: userMap['yuki_games']._id,
        likes: [userMap['marcus_codes']._id, userMap['elena_ui']._id]
      },
      {
        title: 'GoCache - Distributed In-Memory Key-Value Store',
        description: 'A high-performance, distributed, in-memory cache written in Go. Supports consistent hashing, peer-to-peer data replication, active expiration policies, and hot-item promotion.',
        techStack: ['Go', 'gRPC', 'Redis', 'Protobuf'],
        githubLink: 'https://github.com/liamgo/gocache',
        liveDemoLink: '',
        category: 'open-source',
        difficulty: 'advanced',
        teamSize: 2,
        thumbnail: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=600&q=80',
        createdBy: userMap['liam_go']._id,
        likes: [userMap['sarah_ai']._id, userMap['sid_devops']._id]
      }
    ];

    const createdProjects = await Project.create(projects);
    console.log(`Inserted ${createdProjects.length} dummy projects.`);

    const projectMap = createdProjects.reduce((acc, project) => {
      // Map project titles using a simple key
      const key = project.title.split(' ')[0].toLowerCase();
      acc[key] = project;
      return acc;
    }, {});

    console.log('Inserting dummy comments...');

    const comments = [
      {
        project: projectMap['devconnect']._id,
        user: userMap['marcus_codes']._id,
        text: "Wow! This is exactly what I've been looking for. Are you looking for a React Native developer to help build the mobile app?"
      },
      {
        project: projectMap['devconnect']._id,
        user: userMap['elena_ui']._id,
        text: "Love the layout and clean responsive design. I would love to contribute to the UI/UX components!"
      },
      {
        project: projectMap['devconnect']._id,
        user: userMap['yuki_games']._id,
        text: "The chat feature is super fast! Did you use Socket.IO rooms for individual project channels?"
      },
      {
        project: projectMap['codesense']._id,
        user: userMap['alex_dev']._id,
        text: "This is super cool! Automated PR review is a lifesaver. Let me know if you need help with the frontend integration dashboard."
      },
      {
        project: projectMap['animacss']._id,
        user: userMap['sarah_ai']._id,
        text: "Nice! The documentation looks great and the animations are buttery smooth."
      },
      {
        project: projectMap['kubedeploy']._id,
        user: userMap['alex_dev']._id,
        text: "This is excellent. I'd love to help with the dashboard frontend."
      },
      {
        project: projectMap['kubedeploy']._id,
        user: userMap['sid_devops']._id,
        text: "Looking for an expert React developer to help polish the monitoring graphs."
      },
      {
        project: projectMap['trustvote']._id,
        user: userMap['chloe_blockchain']._id,
        text: "If anyone is familiar with Circom or SnarkJS, let's team up to implement the ZK proofs!"
      },
      {
        project: projectMap['gocache']._id,
        user: userMap['liam_go']._id,
        text: "Running benchmarks right now, and the latency is sub-millisecond. Contribution PRs are welcome!"
      }
    ];

    const createdComments = await Comment.create(comments);
    console.log(`Inserted ${createdComments.length} comments.`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
};

seedData();
