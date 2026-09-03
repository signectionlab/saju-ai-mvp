import { CLASHES, HARMS, SIX_COMBINATIONS, THREE_HARMONIES } from "./constants";

interface PillarRef {
  position: string;
  branch: string;
}

function hasPair(branches: string[], a: string, b: string): boolean {
  return branches.includes(a) && branches.includes(b);
}

export function detectRelations(pillars: PillarRef[]) {
  const relations: Array<{
    type: string;
    members: string[];
    positions: string[];
    detected: boolean;
    transformation_applied: boolean;
  }> = [];

  const branches = pillars.map((p) => p.branch);

  for (const [a, b] of SIX_COMBINATIONS) {
    if (hasPair(branches, a, b)) {
      relations.push({
        type: "six_combine",
        members: [a, b],
        positions: pillars.filter((p) => p.branch === a || p.branch === b).map((p) => p.position),
        detected: true,
        transformation_applied: false,
      });
    }
  }

  for (const [a, b] of CLASHES) {
    if (hasPair(branches, a, b)) {
      relations.push({
        type: "clash",
        members: [a, b],
        positions: pillars.filter((p) => p.branch === a || p.branch === b).map((p) => p.position),
        detected: true,
        transformation_applied: false,
      });
    }
  }

  for (const [a, b] of HARMS) {
    if (hasPair(branches, a, b)) {
      relations.push({
        type: "harm",
        members: [a, b],
        positions: pillars.filter((p) => p.branch === a || p.branch === b).map((p) => p.position),
        detected: true,
        transformation_applied: false,
      });
    }
  }

  for (const group of THREE_HARMONIES) {
    const matched = group.members.filter((m) => branches.includes(m));
    if (matched.length >= 2) {
      relations.push({
        type: "three_harmony",
        members: matched,
        positions: pillars.filter((p) => matched.includes(p.branch)).map((p) => p.position),
        detected: true,
        transformation_applied: false,
      });
    }
  }

  return relations;
}
