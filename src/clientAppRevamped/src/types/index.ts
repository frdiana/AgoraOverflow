import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface Agent {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  avatar?: string;
}
