import { useState, useEffect } from "react";
import { Avatar } from "@heroui/avatar";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Switch } from "@heroui/switch";
import { Tooltip } from "@heroui/tooltip";

import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { Agent } from "@/types";

interface AgentCardProps {
  agent: Agent;
  isEnabled: boolean;
  onToggle: (agentId: string, enabled: boolean) => void;
}

// Array of chip colors for random selection
const chipColors = [
  "primary",
  "secondary",
  "success",
  "warning",
  "danger",
  "default",
] as const;

// Function to get a random color for each chip
const getRandomColor = (index: number, capability: string) => {
  // Use a simple hash of the capability string + index for consistent colors
  const hash = capability
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), index);

  return chipColors[hash % chipColors.length];
};

function AgentCard({ agent, isEnabled, onToggle }: AgentCardProps) {
  const maxVisibleChips = 3;
  const visibleCapabilities = agent.capabilities.slice(0, maxVisibleChips);
  const hiddenCapabilities = agent.capabilities.slice(maxVisibleChips);
  const hasMoreCapabilities = hiddenCapabilities.length > 0;

  return (
    <Card className="max-w-[340px]">
      <CardHeader className="justify-between">
        <div className="flex gap-5">
          <Avatar
            isBordered
            radius="full"
            size="md"
            src={agent.avatar || "https://heroui.com/avatars/avatar-1.png"}
          />
          <div className="flex flex-col gap-1 items-start justify-center">
            <h4 className="text-small font-semibold leading-none text-default-600">
              {agent.name}
            </h4>
            <h5 className="text-small tracking-tight text-default-400">
              @{agent.name.toLowerCase().replace(/\s+/g, "")}
            </h5>
          </div>
        </div>
        <Switch
          color="primary"
          isSelected={isEnabled}
          onValueChange={(enabled: boolean) => onToggle(agent.id, enabled)}
        />
      </CardHeader>
      <CardBody className="px-3 py-0 text-small text-default-400">
        <p className="mb-3">{agent.description}</p>
        <div className="flex flex-wrap gap-2 mx-[10px]">
          {visibleCapabilities.map((capability, index) => (
            <Chip
              key={index}
              color={getRandomColor(index, capability)}
              size="sm"
              variant="flat"
            >
              {capability}
            </Chip>
          ))}
          {hasMoreCapabilities && (
            <Tooltip
              content={
                <div className="p-2">
                  <div className="text-small font-semibold mb-2">
                    All Capabilities:
                  </div>
                  <div className="flex flex-wrap gap-1 max-w-[200px]">
                    {agent.capabilities.map((capability, index) => (
                      <Chip
                        key={index}
                        color={getRandomColor(index, capability)}
                        size="sm"
                        variant="flat"
                      >
                        {capability}
                      </Chip>
                    ))}
                  </div>
                </div>
              }
              placement="top"
            >
              <Chip
                className="cursor-help"
                color="default"
                size="sm"
                variant="bordered"
              >
                +{hiddenCapabilities.length} more
              </Chip>
            </Tooltip>
          )}
        </div>
      </CardBody>
    </Card>
  );
}

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
