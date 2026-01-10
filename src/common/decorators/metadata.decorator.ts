import 'reflect-metadata';

export function Relation() {
  return (target: Record<string, unknown>, propertyKey: string) => {
    const relations =
      (Reflect.getMetadata('relations', target) as string[]) ?? [];
    Reflect.defineMetadata('relations', [...relations, propertyKey], target);
  };
}
