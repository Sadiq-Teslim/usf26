type SportDefaults = {
  name?: string;
  slug?: string;
  displayMode?: string;
  tablePreset?: string;
  format?: string;
  colorHex?: string;
  pointsWin?: number;
  pointsDraw?: number;
  pointsLoss?: number;
  allowDraws?: boolean;
  isPublished?: boolean;
};

const field =
  "mt-1 w-full rounded-lg border border-border-brand bg-indigo-deep px-3 py-2 text-sm outline-none focus:border-white/40";
const label = "block text-sm font-medium";

export function SportForm({
  action,
  sport,
  submitLabel,
}: {
  action: (formData: FormData) => void | Promise<void>;
  sport?: SportDefaults;
  submitLabel: string;
}) {
  const s = sport ?? {};
  return (
    <form action={action} className="flex max-w-xl flex-col gap-4">
      <div>
        <label className={label}>Name</label>
        <input name="name" defaultValue={s.name} required className={field} />
      </div>
      <div>
        <label className={label}>Slug (URL)</label>
        <input
          name="slug"
          defaultValue={s.slug}
          placeholder="auto from name"
          className={field}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={label}>Display mode</label>
          <select name="displayMode" defaultValue={s.displayMode ?? "STANDARD"} className={field}>
            <option value="STANDARD">Standard (fixtures + table)</option>
            <option value="RESULTS_ONLY">Results only</option>
          </select>
        </div>
        <div>
          <label className={label}>Table preset</label>
          <select name="tablePreset" defaultValue={s.tablePreset ?? "FOOTBALL"} className={field}>
            <option value="FOOTBALL">Football (GF/GA/GD)</option>
            <option value="BASKETBALL">Basketball (PF/PA/PD)</option>
            <option value="SETS">Sets (volleyball/tennis)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={label}>Format</label>
          <select name="format" defaultValue={s.format ?? "LEAGUE_AND_KNOCKOUT"} className={field}>
            <option value="LEAGUE">League</option>
            <option value="KNOCKOUT">Knockout</option>
            <option value="LEAGUE_AND_KNOCKOUT">League + Knockout</option>
          </select>
        </div>
        <div>
          <label className={label}>Accent color</label>
          <input
            name="colorHex"
            type="color"
            defaultValue={s.colorHex ?? "#2e2a8c"}
            className="mt-1 h-10 w-full rounded-lg border border-border-brand bg-indigo-deep"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className={label}>Points: win</label>
          <input name="pointsWin" type="number" defaultValue={s.pointsWin ?? 3} className={field} />
        </div>
        <div>
          <label className={label}>Draw</label>
          <input name="pointsDraw" type="number" defaultValue={s.pointsDraw ?? 1} className={field} />
        </div>
        <div>
          <label className={label}>Loss</label>
          <input name="pointsLoss" type="number" defaultValue={s.pointsLoss ?? 0} className={field} />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="allowDraws" defaultChecked={s.allowDraws ?? true} />
        Allow draws
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isPublished" defaultChecked={s.isPublished ?? false} />
        Published (visible on public site)
      </label>

      <button
        type="submit"
        className="mt-2 w-fit rounded-lg bg-foreground px-5 py-2 text-sm font-semibold text-indigo-deep"
      >
        {submitLabel}
      </button>
    </form>
  );
}
