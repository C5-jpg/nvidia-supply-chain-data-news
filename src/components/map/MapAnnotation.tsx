type MapAnnotationProps = {
  text: string;
};

export function MapAnnotation({ text }: MapAnnotationProps) {
  return (
    <div className="map-annotation">
      <span>{text}</span>
    </div>
  );
}
