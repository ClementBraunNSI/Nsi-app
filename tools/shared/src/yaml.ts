import yaml from 'js-yaml';

export function loadYaml<T = unknown>(text: string): T {
  return yaml.load(text) as T;
}

export function dumpYaml(data: unknown): string {
  return yaml.dump(data, { lineWidth: 120, noRefs: true });
}

export async function loadYamlFile<T = unknown>(file: File): Promise<T> {
  const text = await file.text();
  return loadYaml<T>(text);
}
