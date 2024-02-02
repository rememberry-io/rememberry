type MapProps = {
  params: { id: string };
};

export default function IndMap({ params }: MapProps) {
  return <div>My Post: {params.id}</div>;
}
