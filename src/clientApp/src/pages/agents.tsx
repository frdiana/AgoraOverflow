import { useState, useEffect } from "react";

import { Agent } from "@/types";
import DefaultLayout from "@/layouts/default";
import AgentCard from "@/components/agentCard";
import { title } from "@/components/primitives";

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [enabledAgents, setEnabledAgents] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${baseUrl}/agents`);

      if (!response.ok) {
        throw new Error(`Failed to fetch agents: ${response.statusText}`);
      }

      const data = await response.json();

      setAgents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch agents");
      // Mock data for development
      const mockAgents: Agent[] = [
        {
          id: "1",
          name: "Code Assistant",
          description:
            "A helpful AI agent that assists with coding tasks and debugging.",
          capabilities: [
            "Coding",
            "Debugging",
            "Code Review",
            "Documentation",
            "Testing",
            "Refactoring",
          ],
        },
        {
          id: "2",
          name: "Data Analyst",
          description:
            "Specializes in data analysis, visualization, and insights generation.",
          capabilities: [
            "Data Analysis",
            "Visualization",
            "SQL",
            "Statistics",
            "Machine Learning",
            "Data Mining",
            "Reporting",
          ],
        },
        {
          id: "3",
          name: "Content Writer",
          description:
            "Creates engaging content for blogs, articles, and marketing materials.",
          capabilities: [
            "Writing",
            "SEO",
            "Content Strategy",
            "Copywriting",
            "Social Media",
            "Blogging",
          ],
        },
      ];

      setAgents(mockAgents);
    } finally {
      setLoading(false);
    }
  };

  const handleAgentToggle = (agentId: string, enabled: boolean) => {
    setEnabledAgents((prev) => {
      const newSet = new Set(prev);

      if (enabled) {
        newSet.add(agentId);
      } else {
        newSet.delete(agentId);
      }

      return newSet;
    });
  };

  if (loading) {
    return (
      <DefaultLayout>
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
          <div className="inline-block max-w-lg text-center justify-center">
            <h1 className={title()}>Agents</h1>
            <p className="text-default-500 mt-4">Loading agents...</p>
          </div>
        </section>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-4xl text-center justify-center mb-8">
          <h1 className={title()}>Agents</h1>
          <p className="text-default-500 mt-4">
            Discover and manage AI agents to help with your tasks
          </p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <span className="text-primary font-semibold">
              {enabledAgents.size}
            </span>
            <span className="text-default-500">
              of {agents.length} agents active
            </span>
          </div>
          {error && (
            <p className="text-warning text-sm mt-2">
              Note: Using mock data due to API connection issues
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl px-4">
          {agents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              isEnabled={enabledAgents.has(agent.id)}
              onToggle={handleAgentToggle}
            />
          ))}
        </div>
      </section>
    </DefaultLayout>
  );
}
