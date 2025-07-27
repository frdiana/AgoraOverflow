import { create } from "zustand";

export interface Agent {
  id: string;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
  category: "coding" | "creative" | "analysis" | "productivity";
  capabilities: string[];
  createdAt: number;
}

interface AgentsState {
  agents: Agent[];
  toggleAgent: (id: string) => void;
  enableAllAgents: () => void;
  disableAllAgents: () => void;
  getEnabledAgents: () => Agent[];
  getAgentsByCategory: (category: string) => Agent[];
}

const initialAgents: Agent[] = [
  {
    id: "1",
    name: "Code Assistant",
    description:
      "Helps with programming, debugging, and code optimization across multiple languages including Python, JavaScript, TypeScript, and more.",
    icon: "🔧",
    enabled: true,
    category: "coding",
    capabilities: [
      "Code Generation",
      "Debugging",
      "Code Review",
      "Optimization",
    ],
    createdAt: Date.now() - 86400000 * 7, // 7 days ago
  },
  {
    id: "2",
    name: "Data Analyst",
    description:
      "Specializes in data analysis, visualization, and statistical insights. Can help with SQL queries, data interpretation, and reporting.",
    icon: "📊",
    enabled: true,
    category: "analysis",
    capabilities: [
      "Data Analysis",
      "SQL Queries",
      "Statistics",
      "Visualization",
    ],
    createdAt: Date.now() - 86400000 * 6,
  },
  {
    id: "3",
    name: "Creative Writer",
    description:
      "Assists with creative writing, storytelling, content creation, and marketing copy. Perfect for blogs, articles, and creative projects.",
    icon: "✍️",
    enabled: false,
    category: "creative",
    capabilities: [
      "Creative Writing",
      "Storytelling",
      "Marketing Copy",
      "Content Strategy",
    ],
    createdAt: Date.now() - 86400000 * 5,
  },
  {
    id: "4",
    name: "Research Assistant",
    description:
      "Conducts thorough research, fact-checking, and information gathering. Helps with academic papers and business intelligence.",
    icon: "🔍",
    enabled: true,
    category: "analysis",
    capabilities: [
      "Research",
      "Fact Checking",
      "Information Gathering",
      "Citations",
    ],
    createdAt: Date.now() - 86400000 * 4,
  },
  {
    id: "5",
    name: "UI/UX Designer",
    description:
      "Provides design guidance, user experience insights, and interface recommendations. Helps create intuitive and beautiful designs.",
    icon: "🎨",
    enabled: false,
    category: "creative",
    capabilities: ["UI Design", "UX Research", "Design Systems", "Prototyping"],
    createdAt: Date.now() - 86400000 * 3,
  },
  {
    id: "6",
    name: "Project Manager",
    description:
      "Helps with project planning, task management, timeline estimation, and team coordination. Keeps projects on track.",
    icon: "📋",
    enabled: true,
    category: "productivity",
    capabilities: [
      "Project Planning",
      "Task Management",
      "Timeline Estimation",
      "Team Coordination",
    ],
    createdAt: Date.now() - 86400000 * 2,
  },
  {
    id: "7",
    name: "DevOps Engineer",
    description:
      "Assists with deployment, infrastructure, CI/CD pipelines, and cloud services. Helps optimize development workflows.",
    icon: "⚙️",
    enabled: false,
    category: "coding",
    capabilities: ["CI/CD", "Infrastructure", "Cloud Services", "Automation"],
    createdAt: Date.now() - 86400000 * 1,
  },
  {
    id: "8",
    name: "Business Analyst",
    description:
      "Provides business insights, market analysis, and strategic recommendations. Helps with decision-making and growth strategies.",
    icon: "💼",
    enabled: true,
    category: "analysis",
    capabilities: [
      "Business Analysis",
      "Market Research",
      "Strategic Planning",
      "ROI Analysis",
    ],
    createdAt: Date.now() - 86400000 * 0.5,
  },
  {
    id: "9",
    name: "Language Tutor",
    description:
      "Helps with language learning, translation, grammar correction, and communication skills improvement across multiple languages.",
    icon: "🌐",
    enabled: false,
    category: "productivity",
    capabilities: [
      "Language Learning",
      "Translation",
      "Grammar Correction",
      "Communication Skills",
    ],
    createdAt: Date.now(),
  },
];

export const useAgentsStore = create<AgentsState>((set, get) => ({
  agents: initialAgents,

  toggleAgent: (id: string) => {
    set((state) => ({
      agents: state.agents.map((agent) =>
        agent.id === id ? { ...agent, enabled: !agent.enabled } : agent
      ),
    }));
  },

  enableAllAgents: () => {
    set((state) => ({
      agents: state.agents.map((agent) => ({ ...agent, enabled: true })),
    }));
  },

  disableAllAgents: () => {
    set((state) => ({
      agents: state.agents.map((agent) => ({ ...agent, enabled: false })),
    }));
  },

  getEnabledAgents: () => {
    return get().agents.filter((agent) => agent.enabled);
  },

  getAgentsByCategory: (category: string) => {
    return get().agents.filter((agent) => agent.category === category);
  },
}));
