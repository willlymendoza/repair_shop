// Maintainer utility: refresh the explicitly selected MIT-licensed shadcn sources.
import { mkdir, writeFile } from "node:fs/promises";
const components = ["button", "input", "textarea", "label", "badge", "table", "card", "select"];
await mkdir("src/components/ui", { recursive: true });
for (const name of components) {
  const response = await fetch(`https://ui.shadcn.com/r/styles/new-york/${name}.json`);
  if (!response.ok) throw new Error(`${name}: HTTP ${response.status}`);
  const entry = await response.json();
  for (const file of entry.files) {
    const content = file.content
      .replace(
        'import { Slot } from "@radix-ui/react-slot"',
        'import { Slot as SlotPrimitive } from "radix-ui"\nconst Slot = SlotPrimitive.Root',
      )
      .replace(
        'import * as LabelPrimitive from "@radix-ui/react-label"',
        'import { Label as LabelPrimitive } from "radix-ui"',
      )
      .replace(
        'import * as SelectPrimitive from "@radix-ui/react-select"',
        'import { Select as SelectPrimitive } from "radix-ui"',
      );
    await writeFile(`src/components/ui/${name}.tsx`, content);
  }
  console.log(`Added shadcn/ui ${name}`);
}
