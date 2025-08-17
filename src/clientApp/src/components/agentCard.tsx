import { Avatar } from "@heroui/avatar";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Switch } from "@heroui/switch";
import { Tooltip } from "@heroui/tooltip";

import { Agent } from "@/types";

export interface AgentCardProps {
  agent: Agent;
  isEnabled: boolean;
  onToggle: (agentId: string, enabled: boolean) => void;
}

const chipColors = [
  "primary",
  "secondary",
  "success",
  "warning",
  "danger",
  "default",
] as const;

const getRandomColor = (index: number, capability: string) => {
  const hash = capability
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), index);

  return chipColors[hash % chipColors.length];
};

export default function AgentCard({
  agent,
  isEnabled,
  onToggle,
}: AgentCardProps) {
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
