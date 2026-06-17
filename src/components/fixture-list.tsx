import { ScoreCapsule, type CapsuleFixture } from "@/components/score-capsule";
import { StaggerGrid, StaggerItem } from "@/components/motion/reveal";

export function FixtureList({ fixtures }: { fixtures: CapsuleFixture[] }) {
  if (fixtures.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border-brand p-4 text-sm text-muted">
        No fixtures yet.
      </p>
    );
  }
  return (
    <StaggerGrid className="grid gap-3 sm:grid-cols-2">
      {fixtures.map((f) => (
        <StaggerItem key={f.id}>
          <ScoreCapsule fixture={f} />
        </StaggerItem>
      ))}
    </StaggerGrid>
  );
}
