// Mensaje de confirmación. role="status" hace que los lectores de pantalla
// lo anuncien sin interrumpir.
export default function Notice({ children }: { children: React.ReactNode }) {
  return (
    <p
      role="status"
      className="border-l-2 border-primary bg-mist px-4 py-3 text-[15px]"
    >
      {children}
    </p>
  );
}
