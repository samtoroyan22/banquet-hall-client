interface Props {
  title: string;
}

export function Title({ title }: Props) {
  return (
    <div className="mb-12">
      <h1 className="text-primary-dark text-3xl font-semibold">{title}</h1>
    </div>
  );
}
